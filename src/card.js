// Kids Tasks Main Dashboard Card - Optimized CSS Version

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

class KidsTasksCard extends KidsTasksBaseCard {
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
        <div class="card-header">
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${this.renderCurrentView(children)}
        </div>
      </div>
    `;
  }


  getOptimizedStyles() {
    return `
      ${this.getCommonStyles()}
      <style>
        /* Dashboard dark purple theme */
        :host {
          --kt-dp-bg:      #1E0B3B;
          --kt-dp-section: #2C1654;
          --kt-dp-purple:  #7B3FA0;
          --kt-dp-border:  rgba(123,63,160,0.3);
          --kt-dp-white:   #FFFFFF;
          --kt-dp-muted:   rgba(255,255,255,0.60);
        }

        .card-content {
          background: var(--kt-dp-bg);
          color: var(--kt-dp-white);
        }

        .card-header {
          background: linear-gradient(135deg, var(--kt-dp-section) 0%, #3D1F7A 100%);
          padding: 0;
          margin: 0;
          border-radius: var(--kt-radius-lg) var(--kt-radius-lg) 0 0;
        }

        .navigation {
          background: transparent;
          border-radius: var(--kt-radius-lg) var(--kt-radius-lg) 0 0;
        }

        .nav-button {
          color: var(--kt-dp-muted);
          border-bottom: 3px solid transparent;
        }

        .nav-button.active {
          color: var(--kt-dp-white);
          background: var(--kt-dp-purple);
          border-bottom-color: transparent;
        }

        /* Summary stats – big numbers like Canva */
        .summary-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--kt-dp-border);
          margin-bottom: 0;
          border-top: 1px solid var(--kt-dp-border);
        }

        .summary-card {
          background: var(--kt-dp-section);
          border-left: none;
          border-radius: 0;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: var(--kt-space-lg) var(--kt-space-md);
          gap: var(--kt-space-xs);
        }

        .summary-card:hover {
          border-left: none;
          background: var(--kt-dp-accent, #3D1F7A);
          transform: none;
          box-shadow: none;
        }

        .summary-icon {
          font-size: 1.5em;
          opacity: 0.7;
          margin-bottom: 0;
        }

        .summary-number {
          font-size: 2.4em;
          font-weight: 700;
          color: var(--kt-dp-white);
          text-align: center;
          margin-bottom: 0;
        }

        .summary-label {
          font-size: 0.70em;
          color: var(--kt-dp-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .main-content {
          padding: var(--kt-space-md);
        }

        /* Children grid – darker cards */
        .children-grid {
          gap: var(--kt-space-md);
        }

        .child-card-colorful {
          border-radius: var(--kt-radius-lg);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .child-name-header { color: white; }

        /* Empty state */
        .kt-empty { color: var(--kt-dp-muted); }
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

    const stats = this.calculateGlobalStats(children);

    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-icon">👦🏻</div>
          <div class="summary-number">${children.length}</div>
          <div class="summary-label">Enfants</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">✅</div>
          <div class="summary-number">${stats.completedToday}</div>
          <div class="summary-label">Terminées aujourd'hui</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">⏳</div>
          <div class="summary-number">${stats.pendingTasks}</div>
          <div class="summary-label">En attente validation</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📋</div>
          <div class="summary-number">${stats.totalTasks}</div>
          <div class="summary-label">Tâches actives</div>
        </div>
      </div>

      <div class="children-grid kt-fade-in" style="margin-top: var(--kt-space-md);">
        ${children.map(child => this.renderChild(child)).join('')}
      </div>
    `;
  }

  renderSummary(children) {
    const stats = this.calculateGlobalStats(children);
    
    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-icon">👦🏻</div>
          <div class="summary-number">${children.length}</div>
          <div class="summary-label">Enfants</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📋</div>
          <div class="summary-number">${stats.totalTasks}</div>
          <div class="summary-label">Tâches actives</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">✅</div>
          <div class="summary-number">${stats.completedToday}</div>
          <div class="summary-label">Terminées aujourd'hui</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">🎫</div>
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

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'view-child':
        this.handleViewChild(id);
        break;
      case 'show-child-history':
        this.showChildHistory(id);
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
    let pendingTasks = 0;

    children.forEach(child => {
      const stats = this.getChildStats(child);
      totalTasks += stats.totalToday;
      completedToday += stats.completedToday;
      totalPoints += child.points || 0;

      // Calculer les tâches en attente de validation (completed mais pas validated)
      const childTasks = this.getChildTasks(child.id);
      pendingTasks += childTasks.filter(task =>
        task.status === 'completed' && !task.validated
      ).length;
    });

    return {
      totalTasks,
      completedToday,
      totalPoints,
      pendingTasks
    };
  }

  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-card-editor${suffix}`);
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

export { KidsTasksCard };