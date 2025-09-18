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

  getCustomCSSVariables() {
    // Extract colors from config like in original
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

  getOptimizedStyles() {
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
          border-bottom: 2px solid var(--custom-header-color, var(--kt-surface-variant));
          margin-bottom: var(--kt-space-lg);
          background: linear-gradient(135deg, var(--custom-header-color, var(--kt-primary)) 0%, transparent 100%);
          background-size: 100% 4px;
          background-repeat: no-repeat;
          background-position: bottom;
        }

        .card-title {
          font-size: var(--kt-font-size-lg);
          font-weight: 700;
          color: var(--custom-dashboard-primary, var(--primary-text-color));
          margin: 0 0 var(--kt-space-sm) 0;
        }

        /* Navigation tabs like original */
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
          background: var(--custom-button-hover-color, rgba(0,0,0,0.05));
          color: var(--primary-text-color, #212121);
        }

        .nav-button.active {
          color: var(--custom-tab-color, var(--kt-primary));
          border-bottom-color: var(--custom-tab-color, var(--kt-primary));
          background: rgba(107, 115, 255, 0.05);
          position: relative;
        }

        .nav-button.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--custom-tab-color, var(--kt-primary));
          opacity: 0.1;
          z-index: -1;
        }

        /* Grid system using CSS custom properties */
        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--kt-space-lg);
        }

        /* Colorful child cards like original design */
        .child-card-colorful {
          background: linear-gradient(135deg, var(--custom-child-gradient-start, #4CAF50) 0%, var(--custom-child-gradient-end, #8BC34A) 100%);
          color: var(--custom-child-text-color, white);
          border: 2px solid var(--custom-child-border-color, #2E7D32);
          border-radius: var(--kt-radius-lg);
          padding: var(--kt-space-sm);
          transition: all var(--kt-transition-fast);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          min-height: 180px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
        }

        .child-card-colorful:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .child-name-header {
          font-size: 1.8em;
          font-weight: 700;
          margin-bottom: 12px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          text-align: left;
          line-height: 1.2;
          opacity: 1;
          color: var(--custom-child-text-color, var(--primary-text-color));
        }

        .child-content-horizontal {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          width: 100%;
        }
        .child-avatar {
          display: flex;
          flex-direction: column;
          align-items: center; 
        }
        .child-avatar-section {
          position: relative;
          flex-shrink: 0;
        }

        .child-avatar-colorful {
          font-size: 3em;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          border-radius: var(--kt-radius-round);
          background: var(--kt-avatar-background);
          border: 2px solid var(--kt-cosmetic-background);
          transition: all var(--kt-transition-fast);
        }

        .child-avatar-colorful img {
          width: 2em;
          height: 2em;
          border-radius: var(--kt-radius-round) !important;
          object-fit: cover !important;
          border: 2px solid var(--kt-cosmetic-background, rgba(255, 255, 255, 0.2));
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .child-level-badge {
          position: absolute;
          bottom: -16px;
          left: 16px;
          border-radius: var(--kt-radius-md);
          font-size: 0.8em;
          font-weight: 600;
          text-align: center;
          z-index: 2;
          background: var(--custom-points-badge-color, var(--primary-color, #3f51b5));
          backdrop-filter: blur(10px);
          padding: var(--kt-space-xs) 8px;
          min-width: 60px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .child-stats-colorful {
          display: flex;
          justify-content: space-around;
          margin: var(--kt-space-lg) 0;
        }

        .stat-item {
          text-align: center;
          background: rgba(255, 255, 255, 0.15);
          padding: var(--kt-space-sm);
          border-radius: var(--kt-radius-md);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 80px;
        }

        .stat-value {
          font-size: 1.5em;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 0.7em;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Jauges et barres de progression comme l'original */
        .gauges-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 60px;
          justify-content: flex-start;
          padding-left: 4px;
          padding-top: 0px;
        }

        .gauge {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gauge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gauge-label {
          font-size: 0.65em;
          opacity: 0.9;
          font-weight: 500;
        }

        .gauge-text {
          font-size: 0.65em;
          font-weight: bold;
          opacity: 0.95;
        }

        .gauge-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .gauge-fill {
          height: 100%;
          border-radius: var(--kt-space-xs);
          transition: width 0.6s ease;
        }

        .gauge-fill.total-points {
          background: linear-gradient(90deg, #ffd700, #ffed4a);
        }

        .gauge-fill.level-progress {
          background: linear-gradient(90deg, var(--custom-progress-bar-color, #4facfe), var(--custom-dashboard-secondary, #00f2fe));
        }

        .gauge-fill.tasks-progress {
          background: linear-gradient(90deg, var(--custom-progress-bar-color, #43e97b), var(--custom-dashboard-secondary, #38f9d7));
        }

        .gauge-fill.coins-progress {
          background: linear-gradient(90deg, var(--kt-coins-color, #9C27B0), #E1BEE7);
        }

        .child-progress-colorful {
          background: rgba(255, 255, 255, 0.15);
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-label {
          font-size: 0.8em;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .progress-value {
          font-size: 1.1em;
          font-weight: 600;
          margin-bottom: var(--kt-space-xs);
        }

        .progress-bar-colorful {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--kt-radius-sm);
          overflow: hidden;
        }

        .progress-fill-colorful {
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
          transition: width var(--kt-transition-medium);
          border-radius: var(--kt-radius-sm);
        }

        /* Legacy support */
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
          font-size: 1.2em;
          margin-bottom: var(--kt-space-sm);
          margin-right: var(--kt-space-md);
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
          background: var(--custom-progress-bar-color, var(--kt-gauge-success));
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

        /* Icônes et éléments secondaires */
        .kt-empty__icon,
        ha-icon,
        .icon-image,
        .task-icon,
        .reward-icon,
        .child-icon {
          color: var(--custom-icon-color, var(--secondary-text-color));
        }

        .summary-card,
        .gauge-label,
        .secondary-text,
        .child-stats,
        .progress-label {
          color: var(--custom-dashboard-secondary, var(--secondary-text-color));
        }

        /* Navigation avec couleur secondaire */
        .nav-button:not(.active) {
          color: var(--custom-dashboard-secondary, var(--secondary-text-color));
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

    // Créer les stats pour les gauges comme dans l'original
    const gaugeStats = {
      totalPoints: child.points || 0,
      level: child.level || 1,
      pointsInCurrentLevel: (child.points || 0) % 100,
      pointsToNextLevel: 100,
      completedToday: stats.completedToday,
      totalToday: stats.totalToday,
      coins: child.coins || 0
    };

    // Use configurable gradient from config like in original
    return `
      <div class="child-card-colorful kt-clickable"
           data-action="view-child"
           data-id="${child.id}">
        <div class="child-avatar">
          <div class="child-name-header">${child.name}</div>
          <div class="child-avatar-section">
            <div class="child-avatar-colorful">
              ${this.getAvatar(child)}
            </div>
            <div class="child-level-badge">Niveau ${child.level || 1}</div>
          </div>
        </div>
        <div class="child-content-horizontal">

          <div class="gauges-section">
            ${this.renderGauges(gaugeStats, true)}
          </div>
        </div>
      </div>
    `;
  }

  // Méthode pour récupérer l'avatar (emoji ou image)
  getAvatar(child) {
    if (!child) return '👤';

    const avatarType = child.avatar_type || 'emoji';

    if (avatarType === 'emoji') {
      return child.avatar || '👤';
    } else if (avatarType === 'url' && child.avatar_data) {
      return `<img src="${child.avatar_data}" alt="${child.name || 'Enfant'}">`;
    } else if (avatarType === 'person_entity' && child.person_entity_id && this._hass) {
      const personEntity = this._hass.states[child.person_entity_id];
      if (personEntity && personEntity.attributes && personEntity.attributes.entity_picture) {
        return `<img src="${personEntity.attributes.entity_picture}" alt="${child.name || 'Enfant'}">`;
      }
    }

    return child.avatar || '👤';
  }

  // Méthode renderGauges comme dans l'original
  renderGauges(stats, includeCoins = false) {
    if (!stats) return '';

    const renderGauge = (label, text, fillClass, width) => {
      return `
        <div class="gauge">
          <div class="gauge-header">
            <div class="gauge-label">${label}</div>
            <div class="gauge-text">${text}</div>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill ${fillClass}" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    };

    let gaugesHtml = renderGauge(
      `Niveau ${stats.level}`,
      `${stats.pointsInCurrentLevel}/${stats.pointsToNextLevel}`,
      'level-progress',
      (stats.pointsInCurrentLevel / stats.pointsToNextLevel) * 100
    );

    gaugesHtml += renderGauge(
      'Tâches',
      `${stats.completedToday}/${stats.totalToday}`,
      'tasks-progress',
      stats.totalToday > 0 ? (stats.completedToday / stats.totalToday) * 100 : 0
    );

    gaugesHtml += renderGauge(
      'Points',
      stats.totalPoints,
      'total-points',
      Math.min((stats.totalPoints / 500) * 100, 100)
    );

    if (includeCoins && stats.coins !== undefined) {
      gaugesHtml += renderGauge(
        '🪙',
        stats.coins,
        'coins-progress',
        Math.min(stats.coins, 100)
      );
    }

    return gaugesHtml;
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