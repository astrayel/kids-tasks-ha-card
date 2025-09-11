// Kids Tasks Card - Modular version
// Entry point that imports all components

// Import core modules
import './src/style-manager.js';
import './src/utils.js';
import './src/base-card.js';

// Main Dashboard Card Implementation
class KidsTasksCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'dashboard';
  }

  setConfig(config) {
    this.config = config || {};
    this.title = config.title || 'Gestionnaire de Tâches Enfants';
    this.showNavigation = config.show_navigation !== false;
    this.mode = config.mode || 'dashboard';
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Check if child entities have changed
    const oldChildren = this.getChildrenFromHass(oldHass);
    const newChildren = this.getChildrenFromHass(newHass);
    
    if (oldChildren.length !== newChildren.length) return true;
    
    // Check if child data has changed
    for (let i = 0; i < oldChildren.length; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];
      if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) {
        return true;
      }
    }
    
    // Check task entities
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    
    if (oldTaskEntities.length !== newTaskEntities.length) return true;
    
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state || 
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }
    
    // Check reward entities
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

  getChildrenFromHass(hass) {
    const children = [];
    const entities = hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && pointsEntity.state !== 'unavailable') {
          children.push({
            id: pointsEntity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', ''),
            state: pointsEntity.state,
            attributes: pointsEntity.attributes
          });
        }
      }
    });
    
    return children;
  }

  render() {
    try {
      if (!this._hass) {
        this.shadowRoot.innerHTML = '<div class="loading">Chargement...</div>';
        return;
      }

      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="kids-tasks-manager">
          ${this.showNavigation ? this.getNavigation() : ''}
          <div class="content-container">
            ${this.renderCurrentView()}
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Erreur lors du rendu de la carte:', error);
      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="error">
          Erreur lors du chargement: ${error.message}
        </div>
      `;
    }
  }

  getStyles() {
    return `
      <style>
        /* Core Card Styles */
        :host {
          display: block;
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-lg);
          box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          overflow: hidden;
        }

        .kids-tasks-manager {
          padding: var(--kt-space-lg);
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
          margin: var(--kt-space-md);
        }

        /* Navigation Styles */
        .navigation {
          display: flex;
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-lg);
          border-bottom: 2px solid var(--kt-surface-variant);
          padding-bottom: var(--kt-space-sm);
        }

        .nav-button {
          background: none;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-weight: 600;
          transition: all var(--kt-transition-fast);
          color: var(--secondary-text-color);
        }

        .nav-button.active {
          background: var(--kt-primary);
          color: white;
        }

        .nav-button:hover {
          background: var(--kt-surface-variant);
        }

        .nav-button.active:hover {
          background: var(--kt-primary);
          opacity: 0.9;
        }

        /* Content Styles */
        .content-container {
          min-height: 200px;
        }

        .dashboard-content {
          display: grid;
          gap: var(--kt-space-lg);
        }

        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--kt-space-lg);
        }

        .child-card {
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-lg);
          transition: all var(--kt-transition-fast);
        }

        .child-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--kt-shadow-medium);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .kids-tasks-manager {
            padding: var(--kt-space-md);
          }
          
          .children-grid {
            grid-template-columns: 1fr;
          }

          .navigation {
            flex-wrap: wrap;
          }
        }
      </style>
    `;
  }

  getNavigation() {
    const views = [
      { id: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
      { id: 'tasks', label: 'Tâches', icon: '✅' },
      { id: 'rewards', label: 'Récompenses', icon: '🎁' },
      { id: 'management', label: 'Gestion', icon: '⚙️' }
    ];

    return `
      <div class="navigation">
        ${views.map(view => `
          <button 
            class="nav-button ${this.currentView === view.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${view.id}"
          >
            ${view.icon} ${view.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        return this.renderDashboard();
      case 'tasks':
        return this.renderTasksView();
      case 'rewards':
        return this.renderRewardsView();
      case 'management':
        return this.renderManagementView();
      default:
        return this.renderDashboard();
    }
  }

  renderDashboard() {
    const children = this.getChildren();
    
    if (children.length === 0) {
      return this.emptySection('👨‍👩‍👧‍👦', 'Aucun enfant configuré', 'Ajoutez des enfants depuis la gestion.');
    }

    return `
      <div class="dashboard-content">
        <h2>Tableau de bord des tâches</h2>
        <div class="children-grid">
          ${children.map(child => this.renderChildCard(child)).join('')}
        </div>
      </div>
    `;
  }

  renderChildCard(child) {
    const stats = this.getChildStats(child);
    const tasks = this.getChildTasks(child.id);
    
    return `
      <div class="child-card">
        <div class="kt-child-info">
          <div class="kt-avatar-section">
            <div class="kt-avatar">${this.getAvatar(child)}</div>
            <div class="kt-child-name-header">${child.name}</div>
          </div>
          <div class="kt-child-details">
            <div class="current-stats">
              <span class="stat">${child.points || 0} 🎫</span>
              <span class="stat">${child.coins || 0} 🪙</span>
              <span class="stat">Niveau ${child.level || 1}</span>
            </div>
          </div>
        </div>
        ${this.renderGauges(stats, true, stats.completedToday, stats.totalTasksToday)}
        <div class="child-actions">
          <button 
            class="action-button"
            data-action="view-child-details"
            data-id="${child.id}"
          >
            Voir détails
          </button>
        </div>
      </div>
    `;
  }

  renderTasksView() {
    return `<div class="tasks-view">Vue des tâches - À implémenter</div>`;
  }

  renderRewardsView() {
    return `<div class="rewards-view">Vue des récompenses - À implémenter</div>`;
  }

  renderManagementView() {
    return `<div class="management-view">Vue de gestion - À implémenter</div>`;
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'view-child-details':
        // Implementation for child details
        break;
      default:
        console.warn('Unknown action:', action);
    }
  }

  // Data access methods
  getChildren() {
    if (!this._hass) return [];
    return this.getChildrenFromHass(this._hass).map(childEntity => ({
      id: childEntity.id,
      name: childEntity.attributes.friendly_name || childEntity.id,
      points: parseInt(childEntity.state) || 0,
      coins: childEntity.attributes.coins || 0,
      level: childEntity.attributes.level || 1,
      ...childEntity.attributes
    }));
  }

  getChildStats(child) {
    const tasks = this.getChildTasks(child.id);
    const completedToday = tasks.filter(t => t.status === 'completed' && this.isToday(t.completed_at)).length;
    const totalToday = tasks.filter(t => this.isTaskActiveToday(t)).length;
    
    return {
      completedToday,
      totalTasksToday: totalToday,
      points: child.points || 0,
      coins: child.coins || 0
    };
  }

  getChildTasks(childId) {
    if (!this._hass) return [];
    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id])
      .filter(entity => entity.attributes && entity.attributes.assigned_children && 
                      entity.attributes.assigned_children.includes(childId));
    
    return taskEntities.map(entity => ({
      id: entity.entity_id,
      name: entity.attributes.friendly_name || 'Tâche',
      status: entity.state,
      ...entity.attributes
    }));
  }

  getAvatar(child) {
    return child.avatar || child.cosmetics?.avatar?.emoji || '👤';
  }

  isToday(dateString) {
    if (!dateString) return false;
    const today = new Date().toDateString();
    return new Date(dateString).toDateString() === today;
  }

  isTaskActiveToday(task) {
    // Simplified check - implement proper frequency logic
    return task.status === 'todo';
  }

  // Configuration schema
  static getConfigElement() {
    return document.createElement('kids-tasks-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-card',
      title: 'Gestionnaire de Tâches Enfants',
      show_navigation: true
    };
  }
}

// Register the card
customElements.define('kids-tasks-card', KidsTasksCard);

// Register in card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'kids-tasks-card',
  name: 'Kids Tasks Card',
  description: 'Card for managing children\'s tasks and rewards',
  preview: true,
  documentationURL: 'https://github.com/astrayel/kids-tasks-card'
});

console.info('Kids Tasks Card (Modular) loaded successfully');