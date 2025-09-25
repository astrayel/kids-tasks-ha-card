// Kids Tasks Child Card - Individual child view component

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

class KidsTasksChildCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this._refreshInterval = null;
    this._refreshTimeout = null;
    this._allTimers = new Set(); // Track all timers for cleanup
    this.currentTab = 'tasks';
    this.tasksFilter = 'active';
    this.rewardsFilter = 'all';
    this._lastDataHash = null;
    this._isVisible = true;
    this._refreshRate = 30000; // Increased to 30 seconds for better performance
  }

  connectedCallback() {
    // Set up smart auto-refresh with visibility detection
    this._setupSmartRefresh();
    
    // Track page visibility to pause refreshing when not visible
    this._setupVisibilityDetection();
    
    // Clean up any existing timers first
    this._cleanupTimers();
  }

  disconnectedCallback() {
    this._cleanupTimers();
    this._removeVisibilityDetection();
  }

  // Smart refresh that only updates when data actually changes
  _setupSmartRefresh() {
    const smartRefresh = () => {
      if (!this._hass || !this._initialized || !this._isVisible) {
        this._scheduleNextRefresh();
        return;
      }

      // Check if data has actually changed
      const currentDataHash = this._getDataHash();
      if (currentDataHash === this._lastDataHash) {
        this._scheduleNextRefresh();
        return;
      }

      // Data changed, perform refresh
      this._lastDataHash = currentDataHash;
      this.smartRender();
      this._scheduleNextRefresh();
    };

    // Initial refresh
    if (this._hass && this._initialized) {
      smartRefresh();
    }
  }

  // Schedule next refresh with exponential backoff for inactive periods
  _scheduleNextRefresh() {
    this._cleanupRefreshTimers();
    
    const refreshRate = this._isVisible ? this._refreshRate : this._refreshRate * 2;
    
    this._refreshTimeout = setTimeout(() => {
      this._setupSmartRefresh();
    }, refreshRate);
    
    this._allTimers.add(this._refreshTimeout);
  }

  // Generate hash of relevant data to detect changes
  _getDataHash() {
    if (!this._hass || !this.config?.child_id) return null;
    
    const child = this.getChild();
    const tasks = this.getChildTasks(this.config.child_id);
    const rewards = this.getChildRewards(this.config.child_id);
    
    // Create simple hash of key data points
    const dataString = JSON.stringify({
      childPoints: child?.points || 0,
      childCoins: child?.coins || 0,
      childLevel: child?.level || 1,
      taskCount: tasks.length,
      taskStates: tasks.map(t => `${t.id}:${t.status}`).join(','),
      rewardCount: rewards.length
    });
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString();
  }

  // Set up page visibility detection
  _setupVisibilityDetection() {
    this._visibilityChangeHandler = () => {
      this._isVisible = !document.hidden;
      
      if (this._isVisible) {
        // Page became visible, refresh immediately
        this._setupSmartRefresh();
      } else {
        // Page hidden, clean up active refresh
        this._cleanupRefreshTimers();
      }
    };
    
    document.addEventListener('visibilitychange', this._visibilityChangeHandler);
    this._isVisible = !document.hidden;
  }

  // Remove visibility detection
  _removeVisibilityDetection() {
    if (this._visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
      this._visibilityChangeHandler = null;
    }
  }

  // Clean up refresh timers specifically
  _cleanupRefreshTimers() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
    
    if (this._refreshTimeout) {
      clearTimeout(this._refreshTimeout);
      this._allTimers.delete(this._refreshTimeout);
      this._refreshTimeout = null;
    }
  }

  // Clean up all timers and intervals
  _cleanupTimers() {
    this._cleanupRefreshTimers();
    
    // Clean up any tracked timers
    for (const timer of this._allTimers) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this._allTimers.clear();
    
    // Performance monitoring cleanup
    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('timers', this.constructor.name, 'remove');
    }
  }

  // Override base card cleanup
  _cleanupTouchInteractions() {
    super._cleanupTouchInteractions();
    this._cleanupTimers();
  }

  setConfig(config) {
    if (!config || !config.child_id) {
      throw new Error('Invalid configuration: child_id required');
    }
    
    this.config = {
      child_id: config.child_id,
      title: config.title || 'Mes Tâches',
      show_avatar: config.show_avatar !== false,
      show_progress: config.show_progress !== false,
      show_rewards: config.show_rewards !== false,
      show_completed: config.show_completed !== false,
      ...config
    };
    
    if (this._initialized && this._hass) {
      this.render();
    }
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Check if child data changed
    const childId = this.config.child_id;
    const oldChild = this.getChildFromHass(oldHass, childId);
    const newChild = this.getChildFromHass(newHass, childId);
    
    if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) {
      return true;
    }
    
    // Check tasks and rewards
    const taskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    const rewardEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_reward_'));
    
    for (const entityId of [...taskEntities, ...rewardEntities]) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!oldEntity || !newEntity || 
          oldEntity.state !== newEntity.state || 
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }
    
    return false;
  }

  render() {
    if (!this._hass || !this.config) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="loading">Chargement...</div>
      `;
      return;
    }

    const child = this.getChild();
    if (!child) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="error">
          Enfant non trouvé (ID: ${this.config.child_id})
        </div>
      `;
      return;
    }

    try {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this.getChildSpecificStyles()}
        <div class="child-card-container">
          ${this.renderChild(child)}
          ${this.renderTabs()}
          ${this.renderTabContent(child)}
        </div>
      `;
    } catch (error) {
      console.error('Error rendering child card:', error);
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        <div class="error">Erreur: ${error.message}</div>
      `;
    }
  }

  getChildSpecificStyles() {
    return `
      <style>
        .child-card-container {
          padding: var(--kt-space-lg);
        }

        .child-header {
          text-align: center;
          margin-bottom: var(--kt-space-lg);
          padding: var(--kt-space-lg);
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
        }

        .child-card-colorful {
          border-bottom-right-radius: 0px;
          border-bottom-left-radius: 0px;
        }

        .child-stats {
          display: flex;
          gap: var(--kt-space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .card-header, .navigation {
          border-radius: 0px;
        }

        .stat {
          background: var(--kt-primary);
          color: white;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: 0.9em;
        }

        .tabs {
          display: flex;
          border-bottom: 2px solid var(--kt-surface-variant);
          margin-bottom: var(--kt-space-lg);
          gap: var(--kt-space-sm);
        }

        .tab-button {
          background: none;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-md);
          border-radius: var(--kt-radius-sm) var(--kt-radius-sm) 0 0;
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
          color: var(--secondary-text-color);
        }

        .tab-button.active {
          background: var(--kt-primary);
          color: white;
        }

        .tab-button:hover {
          background: var(--kt-surface-variant);
        }

        .tab-button.active:hover {
          background: var(--kt-primary);
          opacity: 0.9;
        }

        .tab-content {
          min-height: 200px;
        }

        .task-list, .reward-list {
          display: flex;
          flex-direction: column;
          gap: var(--kt-space-sm);
        }

        .task-item, .reward-item {
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          transition: all var(--kt-transition-fast);
          cursor: pointer;
        }

        .task-item:hover, .reward-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--kt-shadow-light);
        }

        .task-title, .reward-title {
          font-weight: 600;
          margin-bottom: var(--kt-space-xs);
        }

        .task-description, .reward-description {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          margin-bottom: var(--kt-space-sm);
        }

        .task-meta, .reward-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8em;
        }

        .reward-cost {
          background: var(--kt-success);
          color: white;
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
        }

        .task-status {
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.7em;
        }

        .task-status.todo { background: var(--kt-warning); color: white; }
        .task-status.completed { background: var(--kt-success); color: white; }
        .task-status.pending { background: var(--kt-info); color: white; }
        .task-status.validated { background: var(--kt-success); color: white; }

        .filters {
          display: flex;
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-lg);
          flex-wrap: wrap;
        }

        .filter-btn {
          background: var(--kt-surface-variant);
          border: 2px solid transparent;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
          font-size: 0.85em;
        }

        .filter-btn.active {
          border-color: var(--kt-primary);
          background: var(--kt-primary);
          color: white;
        }

        .loading {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .error {
          background: var(--kt-error);
          color: white;
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          text-align: center;
        }

        .empty-state {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .empty-icon {
          font-size: 3em;
          margin-bottom: var(--kt-space-md);
          opacity: 0.6;
        }

        /* Progress section styling */
        .progress-section {
          margin-bottom: var(--kt-space-lg);
        }

        /* Responsive adjustments for child card */
        @media (max-width: 768px) {
          .child-stats {
            flex-direction: column;
            align-items: center;
          }

          .tabs {
            flex-wrap: wrap;
          }
        }

        /* Include task styles for history display */
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getTaskStyles() : ''}
      </style>
    `;
  }

  renderHeader(child) {
    if (!this.config.show_avatar) return '';

    const stats = this.getChildStats(child);
    
    return `
      <div class="child-header">
        <div class="child-avatar">${this.getAvatar(child, '👶')}</div>
        <div class="child-name">${child.name}</div>
        <div class="child-stats">
          <span class="stat">${child.points || 0} 🎫 Points</span>
          <span class="stat">${child.coins || 0} 🪙 Pièces</span>
          <span class="stat">Niveau ${child.level || 1}</span>
        </div>
        ${this.config.show_progress ? this.renderProgress(stats, child) : ''}
      </div>
    `;
  }

  renderProgress(stats, child) {
    // Adapt stats to match renderGauges() expectations
    const gaugeStats = {
      level: child?.level || 1,
      pointsInCurrentLevel: (child?.points || 0) % 100,
      pointsToNextLevel: 100,
      completedToday: stats.completedToday,
      totalToday: stats.totalTasksToday,
      totalPoints: child?.points || 0,
      coins: stats.coins
    };

    return `
      <div class="progress-section">
        ${this.renderGauges(gaugeStats, true)}
      </div>
    `;
  }

  renderTabs() {
    const tabs = [
      { id: 'tasks', label: '✅ Tâches', show: true },
      { id: 'rewards', label: '🎁 Récompenses', show: this.config.show_rewards },
      { id: 'history', label: '📈 Historique', show: this.config.show_completed }
    ].filter(tab => tab.show);

    return `
      <div class="card-header">
        <div class="navigation">
          ${tabs.map(tab => `
            <button 
              class="nav-button ${this.currentTab === tab.id ? 'active' : ''}"
              data-action="switch-view"
              data-id="${tab.id}"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderTabContent(child) {
    switch (this.currentTab) {
      case 'tasks':
        return this.renderTasksTab(child);
      case 'rewards':
        return this.renderRewardsTab(child);
      case 'history':
        return this.renderHistoryTab(child);
      default:
        return this.renderTasksTab(child);
    }
  }

  renderTasksTab(child) {
    const tasks = this.getChildTasks(child.child_id);
    const filteredTasks = this.filterTasks(tasks, this.tasksFilter, 'child');

    // Debug
    console.log('=== DEBUG CHILD TASKS ===');
    console.log('Child:', child);
    console.log('Child ID used:', child.child_id);
    console.log('Config child_id:', this.config.child_id);
    console.log('All tasks found:', tasks);
    console.log('Current filter:', this.tasksFilter);
    console.log('Filtered tasks:', filteredTasks);
    console.log('========================');

    return `
      <div class="tab-content">
        ${this.renderTaskFilters()}
        ${filteredTasks.length > 0 ? `
          <div class="task-list">
            ${filteredTasks.map(task => this.renderTaskItem(task)).join('')}
          </div>
        ` : this.emptySection('📝', 'Aucune tâche', 'Aucune tâche disponible pour ce filtre.')}
      </div>
    `;
  }

  renderTaskFilters() {
    const filters = [
      { id: 'active', label: 'Actives' },
      { id: 'bonus', label: 'Bonus' },
      { id: 'completed', label: 'Terminées' },
      { id: 'all', label: 'Toutes' }
    ];

    return super.renderTaskFilters({
      filters,
      filterProperty: 'tasksFilter',
      actionName: 'filter-tasks',
      wrapper: true,
      wrapperClass: 'filters'
    });
  }

  renderTaskItem(task) {
    return `
      <div class="task-item kt-clickable-item" data-action="complete-task" data-id="${task.id}">
        <div class="task-title">${this.getCategoryIcon(task)} ${task.name}</div>
        <div class="task-description">${task.description || ''}</div>
        <div class="task-meta">
          <span class="task-points">+${task.points || 0} 🎫</span>
          <span class="task-status ${task.status}">${task.status}</span>
        </div>
      </div>
    `;
  }

  renderRewardsTab(child) {
    const rewards = this.getRewards().filter(r => (r.min_level || 1) <= (child.level || 1));
    const affordableRewards = rewards.filter(r => 
      (r.cost <= child.points) && (r.coin_cost <= child.coins)
    );

    return `
      <div class="tab-content">
        ${affordableRewards.length > 0 ? `
          <div class="reward-list">
            ${affordableRewards.map(reward => this.renderRewardItem(reward, child)).join('')}
          </div>
        ` : this.emptySection('🎁', 'Aucune récompense', 'Aucune récompense disponible pour le moment.')}
      </div>
    `;
  }

  renderRewardItem(reward, child) {
    const canAfford = (reward.cost <= child.points) && (reward.coin_cost <= child.coins);
    
    return `
      <div class="reward-item kt-clickable-item ${canAfford ? '' : 'disabled'}" 
           data-action="claim-reward" 
           data-id="${reward.id}">
        <div class="reward-title">${this.getCategoryIcon(reward)} ${reward.name}</div>
        <div class="reward-description">${reward.description || ''}</div>
        <div class="reward-meta">
          <span class="reward-cost">
            ${reward.cost > 0 ? `${reward.cost} 🎫` : ''}
            ${reward.coin_cost > 0 ? ` ${reward.coin_cost} 🪙` : ''}
          </span>
        </div>
      </div>
    `;
  }

  renderHistoryTab(child) {
    // Use a placeholder that will be populated asynchronously
    setTimeout(() => this.loadHistoryContent(child), 100);

    return `
      <div class="tab-content">
        <div class="history-content-placeholder" id="history-${child.child_id}">
          <div class="loading">Chargement de l'historique...</div>
        </div>
      </div>
    `;
  }

  async loadHistoryContent(child) {
    try {
      const historyContent = await this.renderChildHistoryForTab(child);
      const placeholder = this.shadowRoot.getElementById(`history-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = historyContent;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      const placeholder = this.shadowRoot.getElementById(`history-${child.child_id}`);
      if (placeholder) {
        placeholder.innerHTML = '<div class="error">Erreur lors du chargement de l\'historique</div>';
      }
    }
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentTab = id;
        this.render();
        break;
      case 'filter-tasks':
        this.tasksFilter = id;
        this.render();
        break;
      case 'complete-task':
        this.completeTask(id);
        break;
      case 'claim-reward':
        this.claimReward(id);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }


  async completeTask(taskId) {
    try {
      await this._hass.callService('kids_tasks', 'complete_task', {
        task_id: taskId,
        child_id: this.config.child_id
      });
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  async claimReward(rewardId) {
    try {
      await this._hass.callService('kids_tasks', 'claim_reward', {
        reward_id: rewardId,
        child_id: this.config.child_id
      });
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  }

  // Data access methods
  getChild() {
    const childId = this.config.child_id;
    return this.getChildFromHass(this._hass, childId);
  }

  getChildFromHass(hass, childIdOrName) {
    console.log('=== getChildFromHass DEBUG ===');
    console.log('Looking for child:', childIdOrName);

    // Get all points entities to see what we have
    const pointsEntities = Object.keys(hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_') && id.endsWith('_points'));

    console.log('All points entities:', pointsEntities);

    // First, search by friendly_name (most common case)
    for (const entityId of pointsEntities) {
      const e = hass.states[entityId];
      console.log(`Entity ${entityId}:`, {
        friendly_name: e.attributes.friendly_name,
        state: e.state,
        attributes: e.attributes
      });

      if (e.attributes.friendly_name === childIdOrName || e.attributes.friendly_name?.toLowerCase() === childIdOrName.toLowerCase()) {
        const realId = e.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', '');
        console.log('Found by friendly_name! Real ID:', realId);
        return {
          id: realId,
          name: e.attributes.friendly_name || realId,
          points: parseInt(e.state) || 0,
          coins: e.attributes.coins || 0,
          level: e.attributes.level || 1,
          ...e.attributes
        };
      }
    }

    // Then try direct ID (for UUID cases)
    let pointsEntityId = `sensor.kidtasks_${childIdOrName}_points`;
    let entity = hass.states[pointsEntityId];

    if (entity) {
      console.log('Found by direct ID:', childIdOrName);
      return {
        id: childIdOrName,
        name: entity.attributes.friendly_name || childIdOrName,
        points: parseInt(entity.state) || 0,
        coins: entity.attributes.coins || 0,
        level: entity.attributes.level || 1,
        ...entity.attributes
      };
    }

    console.log('Child not found!');
    console.log('===============================');
    return null;
  }

  getChildTasks(childId) {
    if (!this._hass) return [];

    console.log('=== getChildTasks DEBUG ===');
    console.log('Input childId:', childId);

    // Get all task entities
    const allTaskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'));

    console.log('All task entities:', allTaskEntities);

    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id])
      .filter(entity => {
        if (!entity.attributes) return false;

        // Support multiple assignment formats
        const assignedChildIds = entity.attributes.assigned_child_ids ||
                                (entity.attributes.assigned_children ? entity.attributes.assigned_children :
                                (entity.attributes.assigned_child_id ? [entity.attributes.assigned_child_id] : []));

        console.log(`Task ${entity.entity_id}:`, {
          assigned_child_ids: entity.attributes.assigned_child_ids,
          assigned_children: entity.attributes.assigned_children,
          assigned_child_id: entity.attributes.assigned_child_id,
          final_assignedChildIds: assignedChildIds,
          searching_for: childId
        });

        const result = Array.isArray(assignedChildIds) ? assignedChildIds.includes(childId) : assignedChildIds === childId;
        console.log('Match result:', result);
        return result;
      });

    console.log('Filtered entities:', taskEntities.length);
    console.log('==========================');


    const result = taskEntities.map(entity => ({
      id: entity.entity_id.replace('sensor.kidtasks_task_', ''),
      name: entity.attributes.friendly_name || 'Tâche',
      description: entity.attributes.description,
      status: entity.state,
      points: entity.attributes.points || 0,
      category: entity.attributes.category,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));

    console.log('Final mapped tasks:', result);
    return result;
  }

  getRewards() {
    if (!this._hass) return [];

    const rewardEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_reward_'))
      .map(id => this._hass.states[id]);

    return rewardEntities.map(entity => ({
      id: entity.entity_id.replace('sensor.kidtasks_reward_', ''),
      name: entity.attributes.friendly_name || 'Récompense',
      description: entity.attributes.description,
      cost: entity.attributes.cost || 0,
      coin_cost: entity.attributes.coin_cost || 0,
      min_level: entity.attributes.min_level || 1,
      category: entity.attributes.category,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));
  }

  getChildRewards(childId) {
    const child = this.getChildFromHass(this._hass, childId);
    if (!child) return [];

    const allRewards = this.getRewards();
    return allRewards.filter(reward => (reward.min_level || 1) <= (child.level || 1));
  }

  getChildStats(child) {
    const tasks = this.getChildTasks(child.child_id);
    const completedToday = tasks.filter(t => 
      (t.status === 'completed' || t.status === 'validated') && 
      this.isToday(t.completed_at)
    ).length;
    const totalToday = tasks.filter(t => t.status === 'todo').length;
    
    return {
      completedToday,
      totalTasksToday: totalToday,
      points: child.points || 0,
      coins: child.coins || 0
    };
  }




  isToday(dateString) {
    if (!dateString) return false;
    const today = new Date().toDateString();
    return new Date(dateString).toDateString() === today;
  }

  // Configuration
  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-child-card-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-child-card',
      child_id: 'child1',
      title: 'Mes Tâches',
      show_avatar: true,
      show_progress: true,
      show_rewards: true,
      show_completed: true
    };
  }
}

// ES6 export
export { KidsTasksChildCard };