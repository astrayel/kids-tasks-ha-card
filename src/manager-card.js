// Kids Tasks Manager Card - Administration interface

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

class KidsTasksManagerCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'tasks';
    this.taskFilter = 'active';
  }

  setConfig(config) {
    this.config = {
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true,
      ...config
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    // Check for task/reward entity changes
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));

    if (oldTaskEntities.length !== newTaskEntities.length) return true;

    // Check for state changes in tasks/rewards
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state ||
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }

    // Check rewards
    const oldRewardEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_reward_'));
    const newRewardEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_reward_'));

    if (oldRewardEntities.length !== newRewardEntities.length) return true;

    for (const entityId of oldRewardEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state ||
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }

    return false;
  }

  render() {
    if (!this._hass) {
      this.shadowRoot.innerHTML = '<div class="kt-loading">Chargement...</div>';
      return;
    }

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="card-content kids-tasks-scope">
        <div class="card-header kt-p-lg">
          <h2 class="card-title">${this.config.title}</h2>
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content kt-p-lg">
          ${this.renderCurrentView()}
        </div>
      </div>
    `;
  }

  getCustomCSSVariables() {
    // Extract colors from config like in dashboard card
    const tabColor = this.config?.tab_color || 'var(--kt-primary)';
    const headerColor = this.config?.header_color || 'var(--kt-primary)';
    const dashboardPrimary = this.config?.dashboard_primary_color || 'var(--kt-primary)';
    const dashboardSecondary = this.config?.dashboard_secondary_color || 'var(--kt-secondary)';
    const childGradientStart = this.config?.child_gradient_start || '#4CAF50';
    const childGradientEnd = this.config?.child_gradient_end || '#8BC34A';
    const childBorderColor = this.config?.child_border_color || '#2E7D32';
    const childTextColor = this.config?.child_text_color || '#ffffff';
    const buttonHoverColor = this.config?.button_hover_color || '#1565C0';
    const progressBarColor = this.config?.progress_bar_color || 'var(--kt-success)';
    const pointsBadgeColor = this.config?.points_badge_color || 'var(--kt-warning)';
    const iconColor = this.config?.icon_color || '#757575';

    return `
      /* Configurable colors from config */
      :host {
        --custom-tab-color: ${tabColor};
        --custom-header-color: ${headerColor};
        --custom-dashboard-primary: ${dashboardPrimary};
        --custom-dashboard-secondary: ${dashboardSecondary};
        --custom-child-gradient-start: ${childGradientStart};
        --custom-child-gradient-end: ${childGradientEnd};
        --custom-child-border-color: ${childBorderColor};
        --custom-child-text-color: ${childTextColor};
        --custom-button-hover-color: ${buttonHoverColor};
        --custom-progress-bar-color: ${progressBarColor};
        --custom-points-badge-color: ${pointsBadgeColor};
        --custom-icon-color: ${iconColor};
      }
    `;
  }

  getStyles() {
    return `
      <style>
        ${this.getCustomCSSVariables()}
        :host {
          display: block;
          background: var(--kt-surface-primary);
          border-radius: var(--kt-radius-lg);
          box-shadow: 0 2px 8px var(--kt-shadow-light);
          overflow: hidden;
        }

        .card-content {
          min-height: 200px;
        }

        .card-header {
          border-bottom: 2px solid var(--kt-surface-variant);
          margin-bottom: var(--kt-space-lg);
        }

        .card-title {
          font-size: var(--kt-font-size-lg);
          font-weight: 700;
          color: var(--primary-text-color);
          margin: 0 0 var(--kt-space-sm) 0;
        }

        .navigation {
          display: flex;
          background: var(--card-background-color, #fff);
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }

        .nav-button {
          flex: 1;
          padding: var(--kt-space-md);
          border: none;
          background: transparent;
          color: var(--secondary-text-color, #757575);
          font-weight: 600;
          font-size: 0.9em;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }

        .nav-button:hover {
          background: rgba(0,0,0,0.05);
          color: var(--primary-text-color, #212121);
        }

        .nav-button.active {
          color: var(--custom-tab-color, var(--kt-primary));
          border-bottom-color: var(--custom-tab-color, var(--kt-primary));
          background: rgba(107, 115, 255, 0.05);
          position: relative;
        }

        .section {
          margin-bottom: var(--kt-space-lg);
        }

        .section h2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--kt-space-md);
          color: var(--primary-text-color);
        }

        .add-btn {
          background: var(--kt-primary);
          color: white;
          border: none;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .add-btn:hover {
          background: var(--kt-success);
          transform: translateY(-1px);
        }

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
          font-size: 0.9em;
        }

        .filter-btn:hover {
          background: var(--kt-primary);
          color: white;
        }

        .filter-btn.active {
          border-color: var(--kt-primary);
          background: var(--kt-primary);
          color: white;
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
          display: flex;
          align-items: center;
          gap: var(--kt-space-md);
          transition: all var(--kt-transition-fast);
          cursor: pointer;
        }

        .task-item:hover, .reward-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--kt-shadow-light);
        }

        .task-item.inactive {
          opacity: 0.6;
          background: var(--kt-surface-variant);
        }

        .task-item.out-of-period {
          border-left: 4px solid var(--kt-warning);
        }

        .item-icon {
          font-size: 1.5em;
          width: 40px;
          text-align: center;
        }

        .task-main, .reward-main {
          flex: 1;
        }

        .task-name, .reward-name {
          font-weight: 600;
          color: var(--primary-text-color);
          margin-bottom: var(--kt-space-xs);
        }

        .task-meta, .reward-meta {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          display: flex;
          gap: var(--kt-space-sm);
          flex-wrap: wrap;
        }

        .task-rewards {
          display: flex;
          gap: var(--kt-space-xs);
          align-items: center;
        }

        .reward-points, .reward-coins {
          background: var(--kt-success);
          color: white;
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: 0.8em;
        }

        .reward-coins {
          background: var(--kt-coins-color);
        }

        .empty-state {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .empty-state-icon {
          font-size: 3em;
          margin-bottom: var(--kt-space-md);
          opacity: 0.6;
        }

        .kt-loading {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-tabs {
            flex-wrap: wrap;
          }

          .filters {
            justify-content: center;
          }
        }
      </style>
    `;
  }

  renderNavigation() {
    const tabs = [
      { id: 'tasks', label: '📝 Tâches' },
      { id: 'rewards', label: '🎁 Récompenses' },
      { id: 'cosmetics', label: '🎨 Cosmétiques' }
    ];

    return `
      <div class="navigation">
        ${tabs.map(tab => `
          <button
            class="nav-button ${this.currentView === tab.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'tasks':
        return this.renderTasksView();
      case 'rewards':
        return this.renderRewardsView();
      case 'cosmetics':
        return this.renderCosmeticsView();
      default:
        return this.renderTasksView();
    }
  }

  renderTasksView() {
    const allTasks = this.getTasks();
    const tasks = this.filterTasks(allTasks, this.taskFilter);

    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <button class="add-btn" data-action="add-task">Ajouter</button>
        </h2>

        <div class="filters">
          ${this.renderTaskFilters()}
        </div>

        ${tasks.length > 0 ? `
          <div class="task-list">
            ${tasks.map(task => this.renderTaskItem(task)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Aucune tâche ${this.getFilterLabel(this.taskFilter)}</p>
            ${this.taskFilter === 'active' ? '<button class="add-btn" data-action="add-task">Créer votre première tâche</button>' : ''}
          </div>
        `}
      </div>
    `;
  }

  renderTaskFilters() {
    const filters = [
      { id: 'all', label: 'Toutes' },
      { id: 'active', label: 'Actives' },
      { id: 'bonus', label: 'Bonus' },
      { id: 'inactive', label: 'Désactivées' },
      { id: 'out-of-period', label: 'Hors période' }
    ];

    return filters.map(filter => `
      <button
        class="filter-btn ${this.taskFilter === filter.id ? 'active' : ''}"
        data-action="filter-tasks"
        data-filter="${filter.id}"
      >
        ${filter.label}
      </button>
    `).join('');
  }

  renderTaskItem(task) {
    const childName = this.formatAssignedChildren(task);
    const taskIcon = this.getCategoryIcon(task);

    return `
      <div class="task-item kt-swipeable-item ${task.active === false ? 'inactive' : ''} ${!this.isTaskInPeriod(task) ? 'out-of-period' : ''}"
           data-action="edit-task" data-id="${task.id}">
        <div class="item-icon">${taskIcon}</div>
        <div class="task-main">
          <div class="task-name">${task.name}</div>
          <div class="task-meta">
            <span>👤 ${childName}</span>
            <span>📅 ${this.getFrequencyLabel(task.frequency)}</span>
            <span>📂 ${this.getCategoryLabel(task.category)}</span>
          </div>
          ${task.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${task.description}</div>` : ''}
        </div>
        <div class="task-rewards">
          ${task.points > 0 ? `<span class="reward-points">+${task.points} 🎫</span>` : ''}
          ${task.coins > 0 ? `<span class="reward-coins">+${task.coins} 🪙</span>` : ''}
        </div>
      </div>
    `;
  }

  renderRewardsView() {
    const rewards = this.getRewards();

    return `
      <div class="section">
        <h2>
          Gestion des récompenses
          <button class="add-btn" data-action="add-reward">Ajouter</button>
        </h2>
        ${rewards.length > 0 ? `
          <div class="reward-list">
            ${rewards.map(reward => this.renderRewardItem(reward)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎁</div>
            <p>Aucune récompense créée</p>
            <button class="add-btn" data-action="add-reward">Créer votre première récompense</button>
          </div>
        `}
      </div>
    `;
  }

  renderRewardItem(reward) {
    const rewardIcon = this.getCategoryIcon(reward);

    return `
      <div class="reward-item kt-swipeable-item"
           data-action="edit-reward" data-id="${reward.id}">
        <div class="item-icon">${rewardIcon}</div>
        <div class="reward-main">
          <div class="reward-name">${reward.name}</div>
          <div class="reward-meta">
            <span>💰 ${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} 🪙` : ''}</span>
            <span>📂 ${this.getCategoryLabel(reward.category)}</span>
            ${reward.remaining_quantity !== null ? `<span>📦 ${reward.remaining_quantity} restant(s)</span>` : ''}
          </div>
          ${reward.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${reward.description}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderCosmeticsView() {
    const allRewards = this.getRewards();
    const cosmeticsRewards = allRewards.filter(r =>
      r.cosmetic_data || r.reward_type === 'cosmetic' || r.category === 'cosmetic'
    );

    if (cosmeticsRewards.length === 0) {
      return `
        <div class="section">
          <h2>🎨 Cosmétiques</h2>
          <div class="empty-state">
            <div class="empty-state-icon">🎨</div>
            <p>Aucun cosmétique disponible</p>
            <p style="font-size: 0.9em; opacity: 0.8;">Créez des récompenses de type cosmétique pour les voir apparaître ici.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="section">
        <h2>🎨 Cosmétiques</h2>
        <div class="reward-list">
          ${cosmeticsRewards.map(cosmetic => this.renderRewardItem(cosmetic)).join('')}
        </div>
      </div>
    `;
  }

  getFilterLabel(filter) {
    const labels = {
      'all': '',
      'active': 'actives',
      'inactive': 'désactivées',
      'bonus': 'bonus',
      'out-of-period': 'hors période'
    };
    return labels[filter] || '';
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'filter-tasks':
        this.taskFilter = event.target.dataset.filter;
        this.render();
        break;
      case 'add-task':
        this.handleAddTask();
        break;
      case 'edit-task':
        this.handleEditTask(id);
        break;
      case 'add-reward':
        this.handleAddReward();
        break;
      case 'edit-reward':
        this.handleEditReward(id);
        break;
      default:
        if (__DEV__) {
          console.warn('Unknown action in manager card:', action);
        }
    }
  }

  // CRUD operations - placeholder implementations
  async handleAddTask() {
    console.info('Add task requested');
    // TODO: Implement task creation dialog/service call
  }

  async handleEditTask(taskId) {
    console.info('Edit task:', taskId);
    // TODO: Implement task edit dialog/service call
  }

  async handleAddReward() {
    console.info('Add reward requested');
    // TODO: Implement reward creation dialog/service call
  }

  async handleEditReward(rewardId) {
    console.info('Edit reward:', rewardId);
    // TODO: Implement reward edit dialog/service call
  }

  // Configuration
  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-manager-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-manager',
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true
    };
  }
}

// ES6 export
export { KidsTasksManagerCard };