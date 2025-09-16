// Kids Tasks Main Dashboard Card - Optimized CSS Version

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

class KidsTasksCardOptimized extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'dashboard';
  }

  setConfig(config) {
    this.config = { 
      title: 'Kids Tasks Manager',
      show_navigation: true,
      show_completed: false,
      show_rewards: true,
      mode: 'dashboard',
      ...config 
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Quick check: compare entity counts for kids tasks
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_'));
    
    return oldTaskEntities.length !== newTaskEntities.length;
  }

  render() {
    if (!this._hass) {
      this.shadowRoot.innerHTML = '<div class="kt-loading">Chargement...</div>';
      return;
    }

    const children = this.getChildren();

    this.shadowRoot.innerHTML = `
      ${this.getOptimizedStyles()}
      <div class="card-content kids-tasks-scope">
        <div class="card-header kt-p-lg">
          <h2 class="card-title">${this.config.title}</h2>
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content kt-p-lg">
          ${this.renderCurrentView(children)}
        </div>
      </div>
    `;
  }

  getOptimizedStyles() {
    return `
      <style>
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
          gap: var(--kt-space-sm);
          flex-wrap: wrap;
        }

        .nav-button {
          background: var(--kt-surface-variant);
          border: 2px solid transparent;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9em;
          transition: all var(--kt-transition-fast);
          color: var(--primary-text-color);
        }

        .nav-button.active {
          border-color: var(--kt-primary);
          background: var(--kt-primary);
          color: white;
        }

        .nav-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px var(--kt-shadow-light);
        }

        /* Grid system using CSS custom properties */
        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--kt-space-lg);
        }

        .child-card {
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-lg);
          transition: all var(--kt-transition-fast);
          cursor: pointer;
        }

        .child-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--kt-shadow-medium);
        }

        .child-header {
          text-align: center;
          margin-bottom: var(--kt-space-md);
        }

        .child-avatar {
          font-size: 3em;
          margin-bottom: var(--kt-space-sm);
        }

        .child-name {
          font-size: 1.2em;
          font-weight: 600;
          color: var(--primary-text-color);
          margin-bottom: var(--kt-space-xs);
        }

        .child-stats {
          display: flex;
          gap: var(--kt-space-sm);
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: var(--kt-space-md);
        }

        .child-progress {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          text-align: center;
          margin-bottom: var(--kt-space-md);
        }

        .progress-bar {
          height: 4px;
          background: var(--kt-gauge-bg);
          border-radius: var(--kt-radius-sm);
          overflow: hidden;
          margin-top: var(--kt-space-xs);
        }

        .progress-fill {
          height: 100%;
          background: var(--kt-gauge-success);
          transition: width var(--kt-transition-medium);
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--kt-space-md);
          margin-bottom: var(--kt-space-lg);
        }

        .summary-card {
          background: var(--kt-surface-variant);
          padding: var(--kt-space-lg);
          border-radius: var(--kt-radius-md);
          text-align: center;
        }

        .summary-number {
          font-size: 2em;
          font-weight: 700;
          color: var(--kt-primary);
          margin-bottom: var(--kt-space-xs);
        }

        .summary-label {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          font-weight: 600;
        }

        /* Enhanced responsive optimizations */
        @media (max-width: 1200px) {
          .children-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--kt-space-md);
          }
        }

        @media (max-width: 768px) {
          .children-grid {
            grid-template-columns: 1fr;
            gap: var(--kt-space-md);
          }
          
          .navigation {
            justify-content: center;
            gap: var(--kt-space-xs);
          }

          .nav-button {
            padding: var(--kt-space-xs);
            font-size: 0.8em;
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--kt-space-sm);
          }

          .card-header {
            padding: var(--kt-space-md);
          }

          .main-content {
            padding: var(--kt-space-md);
          }
        }

        @media (max-width: 480px) {
          .child-stats {
            flex-direction: column;
            align-items: center;
            gap: var(--kt-space-xs);
          }

          .summary-stats {
            grid-template-columns: 1fr;
          }

          .card-content {
            padding: var(--kt-space-sm);
          }

          .card-title {
            font-size: var(--kt-font-size-md);
            text-align: center;
          }

          .navigation {
            flex-direction: column;
            align-items: center;
          }

          .nav-button {
            width: 100%;
            max-width: 200px;
            text-align: center;
          }
        }

        @media (max-width: 320px) {
          .card-content {
            padding: var(--kt-space-xs);
          }

          .child-card {
            padding: var(--kt-space-md);
          }

          .summary-card {
            padding: var(--kt-space-md);
          }
        }
      </style>
    `;
  }

  renderNavigation() {
    const views = [
      { id: 'dashboard', label: '🏠 Tableau de bord' },
      { id: 'summary', label: '📊 Résumé' },
      { id: 'management', label: '⚙️ Gestion' }
    ];

    return `
      <div class="navigation">
        ${views.map(view => `
          <button 
            class="nav-button ${this.currentView === view.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${view.id}"
          >
            ${view.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView(children) {
    switch (this.currentView) {
      case 'dashboard':
        return this.renderDashboard(children);
      case 'summary':
        return this.renderSummary(children);
      case 'management':
        return this.renderManagement(children);
      default:
        return this.renderDashboard(children);
    }
  }

  renderDashboard(children) {
    if (children.length === 0) {
      return `
        <div class="kt-empty">
          <div class="kt-empty__icon">👨‍👩‍👧‍👦</div>
          <div class="kt-empty__text">Aucun enfant configuré</div>
          <div class="kt-empty__subtext">Configurez des enfants dans l'intégration Kids Tasks Manager.</div>
        </div>
      `;
    }

    return `
      <div class="children-grid kt-fade-in">
        ${children.map(child => this.renderChildCard(child)).join('')}
      </div>
    `;
  }

  renderSummary(children) {
    const stats = this.calculateGlobalStats(children);
    
    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-number">${children.length}</div>
          <div class="summary-label">Enfants</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.totalTasks}</div>
          <div class="summary-label">Tâches actives</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.completedToday}</div>
          <div class="summary-label">Terminées aujourd'hui</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${stats.totalPoints}</div>
          <div class="summary-label">Points totaux</div>
        </div>
      </div>
      
      <div class="children-grid">
        ${children.map(child => this.renderChildSummary(child)).join('')}
      </div>
    `;
  }

  renderManagement(children) {
    return `
      <div class="management-content">
        <div class="kt-empty">
          <div class="kt-empty__icon">🚧</div>
          <div class="kt-empty__text">Gestion avancée</div>
          <div class="kt-empty__subtext">Fonctionnalités de gestion en cours de développement.</div>
        </div>
      </div>
    `;
  }

  renderChildCard(child) {
    const stats = this.getChildStats(child);
    const progressPercent = stats.totalToday > 0 ? (stats.completedToday / stats.totalToday) * 100 : 0;
    
    return `
      <div class="child-card kt-clickable" data-action="view-child" data-id="${child.id}">
        <div class="child-header">
          <div class="child-avatar">${child.avatar || '👤'}</div>
          <div class="child-name">${child.name}</div>
          <div class="child-stats kt-flex kt-flex-wrap kt-gap-sm kt-flex-center">
            <span class="kt-stat kt-stat--points">${child.points || 0} 🎫</span>
            <span class="kt-stat kt-stat--coins">${child.coins || 0} 🪙</span>
            <span class="kt-stat">Niv. ${child.level || 1}</span>
          </div>
        </div>
        
        <div class="child-progress">
          Aujourd'hui: ${stats.completedToday}/${stats.totalToday} tâches
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>
        
        <div class="child-actions">
          <button class="kt-btn kt-btn--primary" data-action="view-child" data-id="${child.id}">
            Voir les tâches
          </button>
        </div>
      </div>
    `;
  }

  renderChildSummary(child) {
    const stats = this.getChildStats(child);
    
    return `
      <div class="child-card">
        <div class="child-header">
          <div class="child-avatar">${child.avatar || '👤'}</div>
          <div class="child-name">${child.name}</div>
        </div>
        
        <div class="kt-flex kt-gap-md">
          <div class="summary-card">
            <div class="summary-number">${stats.completedToday}</div>
            <div class="summary-label">Tâches terminées</div>
          </div>
          <div class="summary-card">
            <div class="summary-number">${child.points || 0}</div>
            <div class="summary-label">Points</div>
          </div>
        </div>
      </div>
    `;
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'view-child':
        this.handleViewChild(id);
        break;
      default:
        if (__DEV__) {
          console.warn('Unknown action:', action);
        }
    }
  }

  handleViewChild(childId) {
    console.info('View child details:', childId);
    
    const event = new CustomEvent('kids-tasks-view-child', {
      detail: { childId },
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  // Data methods (same as before)
  getChildren() {
    if (!this._hass) return [];
    
    const children = [];
    Object.keys(this._hass.states).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const entity = this._hass.states[entityId];
        if (entity && entity.state !== 'unavailable') {
          const childId = entityId.replace('sensor.kidtasks_', '').replace('_points', '');
          children.push({
            id: childId,
            name: entity.attributes.friendly_name || childId,
            points: parseInt(entity.state) || 0,
            coins: entity.attributes.coins || 0,
            level: entity.attributes.level || 1,
            avatar: entity.attributes.avatar || entity.attributes.cosmetics?.avatar?.emoji || '👤',
            ...entity.attributes
          });
        }
      }
    });
    
    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  getChildStats(child) {
    const tasks = this.getChildTasks(child.id);
    const today = new Date().toDateString();
    
    const completedToday = tasks.filter(t => 
      (t.status === 'completed' || t.status === 'validated') && 
      t.completed_at && new Date(t.completed_at).toDateString() === today
    ).length;
    
    const totalToday = tasks.filter(t => t.status === 'todo').length;
    
    return {
      completedToday,
      totalToday,
      totalTasks: tasks.length
    };
  }

  getChildTasks(childId) {
    if (!this._hass) return [];
    
    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id])
      .filter(entity => entity.attributes && 
                      entity.attributes.assigned_children && 
                      entity.attributes.assigned_children.includes(childId));
    
    return taskEntities.map(entity => ({
      id: entity.entity_id.replace('sensor.kidtasks_task_', ''),
      name: entity.attributes.friendly_name || 'Tâche',
      status: entity.state,
      completed_at: entity.attributes.completed_at,
      ...entity.attributes
    }));
  }

  calculateGlobalStats(children) {
    let totalTasks = 0;
    let completedToday = 0;
    let totalPoints = 0;
    
    children.forEach(child => {
      const stats = this.getChildStats(child);
      totalTasks += stats.totalToday;
      completedToday += stats.completedToday;
      totalPoints += child.points || 0;
    });
    
    return {
      totalTasks,
      completedToday,
      totalPoints
    };
  }

  static getConfigElement() {
    return document.createElement('kids-tasks-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-card',
      title: 'Kids Tasks Manager',
      show_navigation: true,
      show_completed: false,
      show_rewards: true,
      mode: 'dashboard'
    };
  }
}

export { KidsTasksCardOptimized as KidsTasksCard };