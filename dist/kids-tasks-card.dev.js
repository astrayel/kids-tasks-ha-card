/* Kids Tasks Card v2.0.0 - Development Build */
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
let KidsTasksStyleManager$1 = class KidsTasksStyleManager {
  static instance = null;
  static injected = false;
  static currentVersion = 'v2.0.0-optimized';

  static getInstance() {
    if (!this.instance) {
      this.instance = new KidsTasksStyleManager();
    }
    return this.instance;
  }

  static injectGlobalStyles() {
    if (this.injected) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'kids-tasks-global-styles-v2';
    styleElement.setAttribute('data-version', this.currentVersion);

    styleElement.textContent = this.getOptimizedGlobalStyles();
    document.head.appendChild(styleElement);

    this.injected = true;
    console.info(`Kids Tasks v2.0: Optimized styles injected (${this.getVariableCount()} variables)`);
  }

  static getVariableCount() {
    return 45;
  }

  static getTaskStyles() {
    return `
      /* Task styles from temp_working_version.js */
      .task {
        display: flex;
        align-items: center;
        padding: var(--kt-space-sm) 12px;
        background: var(--secondary-background-color, #fafafa);
        border-radius: 6px;
        border: 1px solid var(--divider-color, #e0e0e0);
        transition: all 0.3s ease;
        min-height: 48px;
        gap: 12px;
        position: relative;
        margin-bottom: var(--kt-space-xs);
      }

      .task.completed {
        border-left: 4px solid var(--kt-success);
      }

      .task.missed {
        border-left: 4px solid var(--kt-error);
      }

      .item-icon {
        font-size: 2em;
        flex-shrink: 0;
      }

      .task-main {
        display: flex;
        flex-direction: column;
        margin-left: 0.5em;
        flex: 1;
      }

      .flex-content {
        min-width: 0;
        flex: 1;
      }

      .task-name-row {
        display: flex;
        flex-direction: column;
      }

      .task-name {
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .task-validation {
        font-style: italic;
        font-size: 0.7em;
        color: var(--secondary-text-color);
      }

      .task-points {
        font-size: 0.85em;
        font-weight: 500;
      }

      .task-action {
        flex-shrink: 0;
        position: absolute;
        right: 1em;
      }

      .task-result {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: var(--kt-radius-round, 50%);
        font-size: 1.2em;
        flex-shrink: 0;
      }

      .task-result.success {
        background: rgba(76, 175, 80, 0.1);
      }

      .task-result.penalty {
        background: rgba(244, 67, 54, 0.1);
      }
    `;
  }

  static getOptimizedGlobalStyles() {
    return `
      /* === KIDS TASKS V2.0 - OPTIMIZED CSS VARIABLES === */
      :root {
        /* === CORE COLORS (6 variables) === */
        --kt-primary: var(--primary-color, #3f51b5);
        --kt-active: var(--darker-primary-color, #1e3462ff);
        --kt-secondary: var(--accent-color, #ff4081);
        --kt-success: #4caf50;
        --kt-warning: #ff9800;
        --kt-error: #f44336;
        --kt-info: #2196f3;
        
        /* === STATUS COLORS (4 variables) === */
        --kt-status-todo: var(--kt-warning);
        --kt-status-completed: var(--kt-success);
        --kt-status-pending: var(--kt-info);
        --kt-status-validated: var(--kt-success);
        
        /* === CURRENCY COLORS (2 variables) === */
        --kt-points-color: var(--kt-success);
        --kt-coins-color: #9c27b0;
        
        /* === LAYOUT SPACING (5 variables - most used) === */
        --kt-space-xs: 4px;      /* Used 16 times */
        --kt-space-sm: 8px;      /* Used 19 times */
        --kt-space-md: 16px;     /* Used 23 times */
        --kt-space-lg: 24px;     /* Used 16 times */
        --kt-space-xl: 32px;     /* Used 4 times */
        
        /* === BORDER RADIUS (4 variables) === */
        --kt-radius-sm: 8px;     /* Used 16 times */
        --kt-radius-md: 12px;    /* Used 11 times */
        --kt-radius-lg: 16px;    /* Used 4 times */
        --kt-radius-round: 50%;  /* Used 4 times */
        
        /* === TRANSITIONS (2 variables - performance optimized) === */
        --kt-transition-fast: 0.2s ease;    /* Used 12 times */
        --kt-transition-medium: 0.3s ease;  /* Used 4 times */
        
        /* === SHADOWS (2 variables) === */
        --kt-shadow-light: rgba(0, 0, 0, 0.1);  /* Used 7 times */
        --kt-shadow-medium: rgba(0, 0, 0, 0.2); /* Used 2 times */
        
        /* === SURFACES (3 variables) === */
        --kt-surface-variant: var(--secondary-background-color, #fafafa); /* Used 14 times */
        --kt-surface-primary: var(--card-background-color, white);
        --kt-border: 1px solid var(--divider-color, #e0e0e0);
        
        /* === TYPOGRAPHY (3 variables) === */
        --kt-font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        --kt-font-size-sm: 0.85em;
        --kt-font-size-lg: 1.2em;
        
        /* === COMPONENT SPECIFIC (9 variables) === */
        --kt-avatar-bg: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        --kt-cosmetic-border: rgba(0,0,0,0.1);
        --kt-cosmetic-bg: rgba(255,255,255,0.1);
        --kt-gauge-bg: var(--kt-surface-variant);
        --kt-gauge-success: linear-gradient(90deg, var(--kt-success) 0%, var(--kt-info) 100%);
        --kt-gauge-points: var(--kt-success);
        --kt-gauge-coins: var(--kt-coins-color);
        --kt-button-hover: rgba(0,0,0,0.1);
        --kt-overlay: rgba(0,0,0,0.5);

        /* === ADDITIONAL VARIABLES === */
        --kt-font-size-xs: 0.75em;
      }

      /* === OPTIMIZED GLOBAL COMPONENTS === */
      .kids-tasks-scope {
        font-family: var(--kt-font-family);
        --paper-card-background-color: var(--kt-surface-primary);
      }
      
      /* === CORE LAYOUT UTILITIES === */
      ${this.getCoreLayoutStyles()}
      
      /* === COMPONENT STYLES === */
      ${this.getComponentStyles()}
      
      /* === INTERACTION STYLES === */
      ${this.getInteractionStyles()}
      
      /* === RESPONSIVE UTILITIES === */
      ${this.getResponsiveStyles()}
    `;
  }

  static getCoreLayoutStyles() {
    return `
      /* Card Containers */
      .kt-card {
        border-radius: var(--kt-radius-lg);
        overflow: hidden;
        transition: all var(--kt-transition-fast);
      }
      
      .kt-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--kt-shadow-medium);
      }
      
      /* Spacing Utilities */
      .kt-p-xs { padding: var(--kt-space-xs); }
      .kt-p-sm { padding: var(--kt-space-sm); }
      .kt-p-md { padding: var(--kt-space-md); }
      .kt-p-lg { padding: var(--kt-space-lg); }
      .kt-p-xl { padding: var(--kt-space-xl); }
      
      .kt-m-xs { margin: var(--kt-space-xs); }
      .kt-m-sm { margin: var(--kt-space-sm); }
      .kt-m-md { margin: var(--kt-space-md); }
      .kt-m-lg { margin: var(--kt-space-lg); }
      .kt-m-xl { margin: var(--kt-space-xl); }
      
      /* Flex Utilities */
      .kt-flex { display: flex; }
      .kt-flex-col { flex-direction: column; }
      .kt-flex-center { align-items: center; justify-content: center; }
      .kt-flex-between { justify-content: space-between; }
      .kt-flex-wrap { flex-wrap: wrap; }
      .kt-gap-xs { gap: var(--kt-space-xs); }
      .kt-gap-sm { gap: var(--kt-space-sm); }
      .kt-gap-md { gap: var(--kt-space-md); }
      .kt-gap-lg { gap: var(--kt-space-lg); }
    `;
  }

  static getComponentStyles() {
    return `
      /* Avatar Components */
      .kt-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--kt-radius-round);
        background: var(--kt-avatar-bg);
        border: 2px solid var(--kt-cosmetic-bg);
        transition: all var(--kt-transition-fast);
        font-size: 3em;
      }
      
      .kt-avatar--sm { font-size: 1.5em; }
      .kt-avatar--lg { font-size: 4em; }
      .kt-avatar--xl { font-size: 6em; }
      
      .kt-avatar img {
        width: 2em;
        height: 2em;
        border-radius: var(--kt-radius-round) !important;
        object-fit: cover !important;
        border: 2px solid var(--kt-cosmetic-bg);
        box-shadow: 0 2px 4px var(--kt-shadow-light);
      }
      
      /* Button Components */
      .kt-btn {
        border: none;
        padding: var(--kt-space-sm) var(--kt-space-md);
        border-radius: var(--kt-radius-sm);
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9em;
        transition: all var(--kt-transition-fast);
        display: inline-flex;
        align-items: center;
        gap: var(--kt-space-xs);
      }
      
      .kt-btn--primary {
        background: var(--kt-primary);
        color: white;
      }
      
      .kt-btn--secondary {
        background: var(--kt-surface-variant);
        color: var(--primary-text-color);
        border: 2px solid transparent;
      }
      
      .kt-btn--success {
        background: var(--kt-success);
        color: white;
      }
      
      .kt-btn--error {
        background: var(--kt-error);
        color: white;
      }
      
      .kt-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px var(--kt-shadow-light);
      }
      
      .kt-btn:active {
        transform: translateY(0);
      }
      
      /* Status Components */
      .kt-status {
        padding: 2px var(--kt-space-xs);
        border-radius: var(--kt-radius-sm);
        font-weight: 600;
        font-size: var(--kt-font-size-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .kt-status--todo { background: var(--kt-status-todo); color: white; }
      .kt-status--completed { background: var(--kt-status-completed); color: white; }
      .kt-status--pending { background: var(--kt-status-pending); color: white; }
      .kt-status--validated { background: var(--kt-status-validated); color: white; }
      
      /* Gauge Components */
      .kt-gauge {
        margin-bottom: var(--kt-space-md);
      }
      
      .kt-gauge__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--kt-space-xs);
      }
      
      .kt-gauge__label {
        font-weight: 600;
        color: var(--primary-text-color);
        font-size: var(--kt-font-size-sm);
      }
      
      .kt-gauge__value {
        font-weight: 700;
        color: var(--kt-primary);
      }
      
      .kt-gauge__bar {
        height: 8px;
        background: var(--kt-gauge-bg);
        border-radius: var(--kt-radius-sm);
        overflow: hidden;
      }
      
      .kt-gauge__fill {
        height: 100%;
        transition: width var(--kt-transition-medium);
        border-radius: var(--kt-radius-sm);
      }
      
      .kt-gauge__fill--tasks { background: var(--kt-gauge-success); }
      .kt-gauge__fill--points { background: var(--kt-gauge-points); }
      .kt-gauge__fill--coins { background: var(--kt-gauge-coins); }
      
      /* Stats Components */
      .kt-stat {
        background: var(--kt-primary);
        color: white;
        padding: 4px var(--kt-space-sm);
        border-radius: var(--kt-radius-sm);
        font-size: var(--kt-font-size-sm);
        font-weight: 600;
        white-space: nowrap;
      }
      
      .kt-stat--points { background: var(--kt-points-color); }
      .kt-stat--coins { background: var(--kt-coins-color); }
      .kt-stat--success { background: var(--kt-success); }
      .kt-stat--warning { background: var(--kt-warning); }
      
      /* Empty State Components */
      .kt-empty {
        text-align: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color);
      }
      
      .kt-empty__icon {
        font-size: 3em;
        margin-bottom: var(--kt-space-md);
        opacity: 0.6;
      }
      
      .kt-empty__text {
        font-weight: 600;
        margin-bottom: var(--kt-space-xs);
      }
      
      .kt-empty__subtext {
        font-size: var(--kt-font-size-sm);
        opacity: 0.8;
      }

      /* History Components */
      .child-history-container {
        max-width: 100%;
      }

      .history-header {
        padding: var(--kt-space-md);
        background: var(--kt-surface-variant);
        border-radius: var(--kt-radius-md);
        margin-bottom: var(--kt-space-md);
      }

      .kt-child-info {
        display: flex;
        align-items: center;
        gap: var(--kt-space-md);
      }

      .kt-child-details h3 {
        margin: 0 0 var(--kt-space-xs) 0;
        color: var(--primary-text-color);
      }

      .current-stats {
        display: flex;
        gap: var(--kt-space-sm);
        flex-wrap: wrap;
      }

      .current-stats .stat {
        padding: var(--kt-space-xs) var(--kt-space-sm);
        background: var(--kt-primary);
        color: white;
        border-radius: var(--kt-radius-sm);
        font-size: var(--kt-font-size-sm);
        font-weight: 600;
      }

      .history-content {
        max-height: 60vh;
        overflow-y: auto;
      }

      .history-sections {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-lg);
      }

      .history-section h4 {
        margin: 0 0 var(--kt-space-sm) 0;
        color: var(--primary-text-color);
        font-size: 1.1em;
        padding-bottom: var(--kt-space-xs);
        border-bottom: 1px solid var(--divider-color);
      }


      .empty-history {
        text-align: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color);
      }

      .empty-history .empty-icon {
        font-size: 3em;
        margin-bottom: var(--kt-space-md);
        opacity: 0.6;
      }

      .loading {
        text-align: center;
        padding: var(--kt-space-lg);
        color: var(--secondary-text-color);
        font-style: italic;
      }

      .error {
        text-align: center;
        padding: var(--kt-space-lg);
        color: var(--kt-error);
        background: var(--kt-error-background);
        border-radius: var(--kt-radius-sm);
        margin: var(--kt-space-sm);
      }

      ${this.getTaskStyles()}
    `;
  }

  static getInteractionStyles() {
    return `
      /* Focus States - utile globalement */
      .kt-focusable:focus {
        outline: 2px solid var(--kt-primary);
        outline-offset: 2px;
      }

      /* Animation States globales */
      @keyframes kt-fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes kt-slide-up {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .kt-fade-in {
        animation: kt-fade-in var(--kt-transition-medium) ease;
      }

      .kt-slide-up {
        animation: kt-slide-up var(--kt-transition-medium) ease;
      }
    `;
  }

  static getResponsiveStyles() {
    return `
      /* === RESPONSIVE DESIGN === */
      
      /* Mobile First Approach */
      @media (max-width: 480px) {
        :root {
          --kt-space-xs: 2px;
          --kt-space-sm: 4px;
          --kt-space-md: 8px;
          --kt-space-lg: 16px;
          --kt-space-xl: 24px;
        }
        
        .kt-card {
          margin: var(--kt-space-sm);
        }
        
        .kt-avatar {
          font-size: 2em;
        }
        
        .kt-btn {
          padding: var(--kt-space-xs) var(--kt-space-sm);
          font-size: 0.8em;
        }
        
        .kt-flex {
          flex-direction: column;
        }
        
        .kt-flex--mobile-row {
          flex-direction: row;
        }
        
        .kt-gap-md {
          gap: var(--kt-space-sm);
        }
      }
      
      /* Desktop */
      @media (min-width: 769px) {
        .kt-grid-auto {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        
        .kt-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px var(--kt-shadow-medium);
        }
      }
      
      /* Large Desktop */
      @media (min-width: 1200px) {
        .kt-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .kt-grid-auto {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
      }
      
      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .kt-card:hover {
          transform: none;
        }
        
        .kt-clickable:hover {
          transform: none;
        }
        
        .kt-btn:hover {
          transform: none;
        }
      }
      
      /* High Contrast */
      @media (prefers-contrast: high) {
        :root {
          --kt-shadow-light: rgba(0, 0, 0, 0.3);
          --kt-shadow-medium: rgba(0, 0, 0, 0.5);
          --kt-border: 2px solid var(--primary-text-color);
        }
        
        .kt-btn {
          border: 2px solid currentColor;
        }
        
        .kt-status {
          border: 1px solid var(--primary-text-color);
        }
      }
      
      /* Dark Mode Support */
      @media (prefers-color-scheme: dark) {
        :root {
          --kt-surface-variant: var(--secondary-background-color, #2c2c2c);
          --kt-avatar-bg: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          --kt-gauge-bg: var(--kt-surface-variant);
          --kt-shadow-light: rgba(0, 0, 0, 0.3);
          --kt-shadow-medium: rgba(0, 0, 0, 0.5);
        }
      }
    `;
  }

  static removeGlobalStyles() {
    const existingStyles = document.querySelector('#kids-tasks-global-styles-v2');
    if (existingStyles) {
      existingStyles.remove();
      this.injected = false;
      console.info('Kids Tasks v2.0: Optimized styles removed');
    }
  }


  static isVariableUsed(variableName) {
    const usageMap = {
      '--kt-space-md': 23, '--kt-space-sm': 19, '--kt-space-xs': 16,
      '--kt-space-lg': 16, '--kt-radius-sm': 16, '--kt-surface-variant': 14,
      '--kt-success': 14, '--kt-primary': 13, '--kt-transition-fast': 12,
      '--kt-radius-md': 11, '--kt-error': 9, '--kt-shadow-light': 7,
      '--kt-info': 7, '--kt-warning': 4, '--kt-transition-medium': 4,
      '--kt-space-xl': 4, '--kt-radius-round': 4, '--kt-radius-lg': 4
    };

    return usageMap[variableName] || 0;
  }


  static getPreCalculatedValues() {
    return {
      spacingScale: {
        xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px'
      },
      radiusScale: {
        sm: '8px', md: '12px', lg: '16px', round: '50%'
      },
      colorPalette: {
        primary: '#3f51b5', success: '#4caf50', warning: '#ff9800',
        error: '#f44336', info: '#2196f3', coins: '#9c27b0'
      }
    };
  }
};


window.KidsTasksStyleManager = KidsTasksStyleManager$1;

class KidsTasksUtils {


  static renderIcon(iconData) {
    if (!iconData || iconData === '') return '📋';

    try {

      if (typeof iconData === 'string' && (iconData.startsWith('http://') || iconData.startsWith('https://'))) {
        return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;" onerror="this.style.display='none'; this.insertAdjacentText('afterend', '📋');">`;
      }


      if (typeof iconData === 'string' && iconData.startsWith('mdi:')) {
        return `<ha-icon icon="${iconData}" style="width: 1.2em; height: 1.2em;"></ha-icon>`;
      }


      const iconString = iconData.toString();
      return iconString || '📋';
    } catch (error) {
      console.warn('Error in renderIcon:', error);
      return '📋';
    }
  }


  static emptySection(icon, text, subtext) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <div class="empty-text">${text}</div>
        <div class="empty-subtext">${subtext}</div>
      </div>
    `;
  }


  static getCategoryIcon(categoryOrItem, dynamicIcons = {}, rewardIcons = {}) {

    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }


    if (categoryOrItem && dynamicIcons) {
      const category = categoryOrItem.toLowerCase();
      if (dynamicIcons[category]) {
        return this.renderIcon(dynamicIcons[category]);
      }
    }


    if (categoryOrItem && rewardIcons) {
      const category = categoryOrItem.toLowerCase();
      if (rewardIcons[category]) {
        return this.renderIcon(rewardIcons[category]);
      }
    }


    return this.renderIcon('📋');
  }


  static generateCosmeticDataFromName(rewardName) {
    if (!rewardName) return null;

    const name = rewardName.toLowerCase();


    if (name.includes('avatar') || name.includes('personnage')) {
      return {
        type: 'avatar',
        catalog_data: { emoji: '👤', default_avatar: true }
      };
    }


    if (name.includes('fond') || name.includes('background') || name.includes('thème')) {
      return {
        type: 'background',
        catalog_data: { css_gradient: 'var(--kt-gradient-neutral)' }
      };
    }


    if (name.includes('tenue') || name.includes('outfit') || name.includes('vêtement')) {
      return {
        type: 'outfit',
        catalog_data: { emoji: '👔', default_outfit: true }
      };
    }

    return null;
  }


  static getTasksStatsForGauges(tasks, completedToday, isTaskActiveTodayFn) {
    const activeTasks = tasks.filter(task =>
      task.status === 'todo' &&
      isTaskActiveTodayFn && isTaskActiveTodayFn(task)
    );

    const totalTasksToday = activeTasks.length;
    const completedTasks = completedToday || 0;

    const progressPercent = totalTasksToday > 0 ? Math.round((completedTasks / totalTasksToday) * 100) : 0;

    return {
      completedToday: completedTasks,
      totalTasksToday,
      progressPercent,
      activeTasks
    };
  }


  static formatDate(dateString) {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      const diffTime = taskDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Aujourd\'hui';
      if (diffDays === -1) return 'Hier';
      if (diffDays === 1) return 'Demain';
      if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`;
      if (diffDays < -1 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`;

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  }


  static formatPoints(points) {
    if (!points || points === 0) return '0';
    return points > 0 ? `+${points}` : points.toString();
  }


  static getCurrencyClass(reward) {
    if (reward.cost > 0 && reward.coin_cost > 0) return 'dual-currency';
    if (reward.coin_cost > 0) return 'coins-only';
    return 'points-only';
  }


  static detectMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  }


  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }


  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }


  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }


  static safeGet(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !current.hasOwnProperty(key)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current;
  }


  static isValidChild(child) {
    return child &&
           typeof child === 'object' &&
           child.id &&
           child.name;
  }

  static isValidTask(task) {
    return task &&
           typeof task === 'object' &&
           task.id &&
           task.name &&
           task.status;
  }

  static isValidReward(reward) {
    return reward &&
           typeof reward === 'object' &&
           reward.id &&
           reward.name &&
           (reward.cost > 0 || reward.coin_cost > 0);
  }


  static safeExecute(fn, fallbackValue = null, context = 'Unknown') {
    try {
      return fn();
    } catch (error) {
      console.warn(`Safe execute error in ${context}:`, error);
      return fallbackValue;
    }
  }
}

class KidsTasksPerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTimes: [],
      domUpdates: [],
      eventHandlers: [],
      memoryUsage: [],
      componentCounts: {}
    };

    this.observers = {
      mutation: null,
      performance: null,
      resize: null
    };

    this.isEnabled = true;
    this.startTime = performance.now();

    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }


  initializeMonitoring() {
    this.setupMutationObserver();
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();

    {
      console.info('🔍 Performance monitoring enabled');
    }
  }


  trackRender(componentName, startTime, endTime) {
    if (!this.isEnabled) return;

    const renderTime = endTime - startTime;
    this.metrics.renderTimes.push({
      component: componentName,
      duration: renderTime,
      timestamp: Date.now()
    });


    if (this.metrics.renderTimes.length > 100) {
      this.metrics.renderTimes.shift();
    }


    if (renderTime > 16 && true) {
      console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }


  trackDOMUpdate(operation, elementCount = 1) {
    if (!this.isEnabled) return;

    this.metrics.domUpdates.push({
      operation,
      elementCount,
      timestamp: Date.now()
    });


    if (this.metrics.domUpdates.length > 50) {
      this.metrics.domUpdates.shift();
    }
  }


  trackEventHandler(event, component, action = 'add') {
    if (!this.isEnabled) return;

    this.metrics.eventHandlers.push({
      event,
      component,
      action,
      timestamp: Date.now()
    });


    if (!this.metrics.componentCounts[component]) {
      this.metrics.componentCounts[component] = { events: 0 };
    }

    this.metrics.componentCounts[component].events += action === 'add' ? 1 : -1;
  }


  setupMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;

    this.observers.mutation = new MutationObserver((mutations) => {
      let totalChanges = 0;
      mutations.forEach(mutation => {
        totalChanges += mutation.addedNodes.length + mutation.removedNodes.length;
      });

      if (totalChanges > 0) {
        this.trackDOMUpdate('mutation', totalChanges);
      }
    });


    this.observers.mutation.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }


  setupPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      this.observers.performance = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      this.observers.performance.observe({ entryTypes: ['longtask'] });
    } catch (error) {

    }
  }


  setupMemoryMonitoring() {
    if (!performance.memory) return;

    const measureMemory = () => {
      if (!this.isEnabled) return;

      this.metrics.memoryUsage.push({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });


      if (this.metrics.memoryUsage.length > 20) {
        this.metrics.memoryUsage.shift();
      }
    };


    setInterval(measureMemory, 10000);
    measureMemory();
  }


  wrapRender(component, originalRender) {
    if (!this.isEnabled) return originalRender;

    return function(...args) {
      const startTime = performance.now();
      const result = originalRender.apply(this, args);
      const endTime = performance.now();

      window.KidsTasksPerformanceMonitor?.trackRender(
        component.constructor.name,
        startTime,
        endTime
      );

      return result;
    };
  }


  generateReport() {
    if (!this.isEnabled) return null;

    const now = Date.now();
    const last5Minutes = now - (5 * 60 * 1000);


    const recentRenders = this.metrics.renderTimes.filter(r => r.timestamp > last5Minutes);
    const recentDOMUpdates = this.metrics.domUpdates.filter(d => d.timestamp > last5Minutes);
    const recentMemory = this.metrics.memoryUsage.slice(-5);


    const avgRenderTime = recentRenders.length > 0
      ? recentRenders.reduce((sum, r) => sum + r.duration, 0) / recentRenders.length
      : 0;

    const memoryTrend = recentMemory.length > 1
      ? recentMemory[recentMemory.length - 1].used - recentMemory[0].used
      : 0;

    return {
      summary: {
        uptime: Math.round((now - this.startTime) / 1000),
        avgRenderTime: Math.round(avgRenderTime * 100) / 100,
        totalRenders: recentRenders.length,
        domUpdates: recentDOMUpdates.length,
        memoryTrend: Math.round(memoryTrend / 1024),
        activeComponents: Object.keys(this.metrics.componentCounts).length
      },
      details: {
        slowRenders: recentRenders.filter(r => r.duration > 16),
        componentBreakdown: this.metrics.componentCounts,
        memoryUsage: recentMemory
      }
    };
  }


  startProfile(name) {
    if (!this.isEnabled) return null;
    return { name, startTime: performance.now() };
  }

  endProfile(profile) {
    if (!this.isEnabled || !profile) return;
    const duration = performance.now() - profile.startTime;
    console.log(`⏱️ ${profile.name}: ${duration.toFixed(2)}ms`);
    return duration;
  }


  toggle(enabled = !this.isEnabled) {
    this.isEnabled = enabled;
    localStorage.setItem('kt-debug-performance', enabled.toString());

    if (enabled && !this.observers.mutation) {
      this.initializeMonitoring();
    }

    console.info(`🔍 Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }


  destroy() {
    if (this.observers.mutation) {
      this.observers.mutation.disconnect();
    }
    if (this.observers.performance) {
      this.observers.performance.disconnect();
    }

    this.metrics = {
      renderTimes: [],
      domUpdates: [],
      eventHandlers: [],
      memoryUsage: [],
      componentCounts: {}
    };
  }
}


let performanceMonitor;


if (typeof window !== 'undefined') {
  performanceMonitor = new KidsTasksPerformanceMonitor();
  window.KidsTasksPerformanceMonitor = performanceMonitor;


  {
    window.ktPerf = {
      report: () => performanceMonitor.generateReport(),
      toggle: () => performanceMonitor.toggle(),
      clear: () => performanceMonitor.destroy()
    };

    console.info('🛠️ Performance tools available: window.ktPerf');
  }
}
var performanceMonitor$1 = performanceMonitor;

class KidsTasksLogger {
  constructor() {
    this.isDevelopment = true;
    this.isDebugEnabled = this.isDevelopment || localStorage.getItem('kt-debug') === 'true';
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
    this.currentLevel = this.isDevelopment ? 3 : 1;
  }


  error(message, ...args) {
    if (this.currentLevel >= this.logLevels.error) {
      console.error(`🔴 [Kids Tasks] ${message}`, ...args);
    }
  }


  warn(message, ...args) {
    if (this.currentLevel >= this.logLevels.warn) {
      console.warn(`🟡 [Kids Tasks] ${message}`, ...args);
    }
  }


  info(message, ...args) {
    if (this.currentLevel >= this.logLevels.info) {
      console.info(`🔵 [Kids Tasks] ${message}`, ...args);
    }
  }


  debug(message, ...args) {
    if (this.currentLevel >= this.logLevels.debug && this.isDebugEnabled) {
      console.debug(`🟢 [Kids Tasks] ${message}`, ...args);
    }
  }


  perf(component, action, duration) {
    if (this.isDebugEnabled && duration !== undefined) {
      this.debug(`⏱️ ${component}.${action}: ${duration.toFixed(2)}ms`);
    }
  }


  group(title, callback) {
    if (this.isDebugEnabled) {
      console.group(`📁 [Kids Tasks] ${title}`);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else {
      callback();
    }
  }


  toggleDebug() {
    this.isDebugEnabled = !this.isDebugEnabled;
    localStorage.setItem('kt-debug', this.isDebugEnabled.toString());
    this.info(`Debug mode ${this.isDebugEnabled ? 'enabled' : 'disabled'}`);
  }


  setLevel(level) {
    if (level in this.logLevels) {
      this.currentLevel = this.logLevels[level];
      this.info(`Log level set to: ${level}`);
    }
  }
}


const logger = new KidsTasksLogger();


if (typeof window !== 'undefined') {
  window.ktLogger = logger;
  window.ktDebug = () => logger.toggleDebug();
}

class KidsTasksBaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;


    this.performanceMonitor = performanceMonitor$1;


    this._lastRenderState = null;
    this._renderDebounceTimer = null;
    this._isRendering = false;
    this._pendingRender = false;


    this._touchStates = new WeakMap();
    this._touchControllers = new Map();
    this._isMobile = this._detectMobileDevice();


    if (typeof KidsTasksStyleManager !== 'undefined') {
      KidsTasksStyleManager.injectGlobalStyles();
    }


    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('constructor', this.constructor.name, 'add');
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!this._initialized && hass) {
      this._initialized = true;
      this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
      this.initTouchInteractions();
      this.smartRender();
    } else if (hass && this.shouldUpdate(oldHass, hass)) {
      this.smartRender();
      if (this._initialized) {
        this.initTouchInteractions();
      }
    }
  }


  smartRender(force = false) {

    if (this._isRendering && !force) {
      this._pendingRender = true;
      return;
    }


    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
    }

    this._renderDebounceTimer = setTimeout(() => {
      this._performRender(force);
    }, force ? 0 : 16);
  }

  _performRender(force = false) {
    if (this._isRendering) return;

    const startTime = performance.now();
    this._isRendering = true;

    try {

      if (!force && !this._needsRender()) {
        return;
      }


      this.render();


      this._updateRenderState();


      if (this._pendingRender) {
        this._pendingRender = false;
        setTimeout(() => this.smartRender(), 0);
      }

    } catch (error) {
      logger.error('Render error in', this.constructor.name, error);
      this._handleRenderError(error);
    } finally {
      this._isRendering = false;


      if (this.performanceMonitor) {
        const endTime = performance.now();
        this.performanceMonitor.trackRender(this.constructor.name, startTime, endTime);
      }
    }
  }


  _needsRender() {
    const currentState = this._getCurrentRenderState();

    if (!this._lastRenderState) {
      return true;
    }


    return JSON.stringify(currentState) !== JSON.stringify(this._lastRenderState);
  }


  _getCurrentRenderState() {
    return {
      hasHass: !!this._hass,
      entityCount: this._hass ? Object.keys(this._hass.states || {}).length : 0,
      configHash: this.config ? JSON.stringify(this.config).slice(0, 100) : null,
      timestamp: Math.floor(Date.now() / 1000)
    };
  }


  _updateRenderState() {
    this._lastRenderState = this._getCurrentRenderState();
  }


  _handleRenderError(error) {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <div style="padding: 16px; background: #fee; border: 1px solid #fcc; border-radius: 4px;">
          <h3 style="color: #c33; margin: 0 0 8px 0;">Card Error</h3>
          <p style="margin: 0; font-size: 14px;">${error.message}</p>
          <ha-button onclick="this.closest('kids-tasks-card, kids-tasks-child-card').smartRender(true)" 
                  style="margin-top: 8px; padding: 4px 8px; background: #c33; color: white; border: none; border-radius: 2px; cursor: pointer;">
            Retry
          </ha-button>
        </div>
      `;
    }
  }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) {
      this._hideAllDeleteConfirmations();
      return;
    }


    const longPressItem = target.closest('.long-pressing');
    if (longPressItem) return;


    const touchState = this._touchStates.get(target.closest('.kt-long-press-item'));
    if (touchState && touchState.isActive) return;


    const swipeableItem = target.closest('.kt-swipeable-item');
    if (swipeableItem && (swipeableItem.classList.contains('swiping-left') || swipeableItem.classList.contains('swiping-right'))) {
      return;
    }


    if (!target.classList.contains('kt-confirm-delete') && !target.classList.contains('kt-cancel-delete')) {
      this._hideAllDeleteConfirmations();
    }

    event.preventDefault();
    event.stopPropagation();

    const action = target.dataset.action;
    const id = target.dataset.id;


    if (action === 'filter-rewards' || action === 'filter-children' || action === 'filter-tasks') {
      this.handleAction(action, target.dataset.filter, event);
    } else {
      this.handleAction(action, id, event);
    }
  }


  _detectMobileDevice() {
    return typeof KidsTasksUtils !== 'undefined'
      ? KidsTasksUtils.detectMobileDevice()
      : 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  initTouchInteractions() {
    this._cleanupTouchInteractions();
    this._initLongPressSystem();
    this.addSwipeListeners();
  }

  _cleanupTouchInteractions() {

    for (const controller of this._touchControllers.values()) {
      controller.abort();
      if (this.performanceMonitor) {
        this.performanceMonitor.trackEventHandler('touch', this.constructor.name, 'remove');
      }
    }
    this._touchControllers.clear();
    this._touchStates = new WeakMap();
    this._longPressListenersAdded = false;
    this._swipeListenersAdded = false;


    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
      this._renderDebounceTimer = null;
    }
  }


  disconnectedCallback() {
    this._cleanupTouchInteractions();


    if (this._cleanupTimers) {
      this._cleanupTimers();
    }


    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('disconnect', this.constructor.name, 'remove');
    }
  }


  _setupEventDelegation() {
    if (this._eventDelegationSetup) return;


    const handleDelegatedEvent = (event) => {
      const target = event.target.closest('[data-action]');
      if (target) {
        this.handleClick(event);
      }
    };

    this.shadowRoot.addEventListener('click', handleDelegatedEvent, {
      passive: false,
      capture: false
    });

    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('delegation', this.constructor.name, 'add');
    }

    this._eventDelegationSetup = true;
  }

  _initLongPressSystem() {
    if (this._longPressListenersAdded) return;
    this._longPressListenersAdded = true;

    const controller = new AbortController();
    this._touchControllers.set('longpress', controller);
    const signal = controller.signal;

    const events = this._isMobile
      ? { down: 'touchstart', up: 'touchend', move: 'touchmove' }
      : { down: 'pointerdown', up: 'pointerup', move: 'pointermove' };

    const handleStart = (e) => {
      const longPressItem = e.target.closest('.kt-long-press-item');
      if (!longPressItem || longPressItem.querySelector('.kt-delete-confirmation:not(.kt-hidden)')) {
        return;
      }

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (!clientX || !clientY) return;

      const state = {
        timer: null,
        startX: clientX,
        startY: clientY,
        isActive: true,
        element: longPressItem
      };

      const oldState = this._touchStates.get(longPressItem);
      if (oldState && oldState.timer) {
        clearTimeout(oldState.timer);
      }

      state.timer = setTimeout(() => {
        if (state.isActive && this._touchStates.get(longPressItem) === state) {
          longPressItem.classList.add('long-pressing');
          this.showDeleteConfirmation(longPressItem);
          if (navigator.vibrate) navigator.vibrate(50);
        }
      }, 500);

      this._touchStates.set(longPressItem, state);
    };

    const handleEnd = (e) => {
      const longPressItem = e.target.closest('.kt-long-press-item');
      if (!longPressItem) return;

      const state = this._touchStates.get(longPressItem);
      if (state) {
        if (state.timer) {
          clearTimeout(state.timer);
        }
        state.isActive = false;
        this._touchStates.delete(longPressItem);
      }
    };

    const handleMove = (e) => {
      const longPressItem = e.target.closest('.kt-long-press-item');
      if (!longPressItem) return;

      const state = this._touchStates.get(longPressItem);
      if (!state || !state.isActive) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (clientX && clientY) {
        const deltaX = Math.abs(clientX - state.startX);
        const deltaY = Math.abs(clientY - state.startY);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 8) {
          if (state.timer) {
            clearTimeout(state.timer);
          }
          state.isActive = false;
          this._touchStates.delete(longPressItem);
        }
      }
    };

    this.shadowRoot.addEventListener(events.down, handleStart, { signal });
    this.shadowRoot.addEventListener(events.up, handleEnd, { signal });
    this.shadowRoot.addEventListener(events.move, handleMove, { signal });
  }

  showDeleteConfirmation(item) {
    this._hideAllDeleteConfirmations(item);

    const confirmation = item.querySelector('.kt-delete-confirmation');
    if (confirmation) {
      confirmation.classList.remove('kt-hidden');

      const confirmBtn = confirmation.querySelector('.kt-confirm-delete');
      const cancelBtn = confirmation.querySelector('.kt-cancel-delete');

      if (confirmBtn) {
        confirmBtn.onclick = () => {
          const deleteAction = item.dataset.deleteAction;
          const id = item.dataset.id;
          if (deleteAction && id) {
            this.handleAction(deleteAction, id);
          }
          this.hideDeleteConfirmation(item);
        };
      }

      if (cancelBtn) {
        cancelBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideDeleteConfirmation(item);
        };
      }

      setTimeout(() => {
        this.hideDeleteConfirmation(item);
      }, 3000);
    }
  }

  hideDeleteConfirmation(item) {
    const confirmation = item.querySelector('.kt-delete-confirmation');
    if (confirmation) {
      confirmation.classList.add('kt-hidden');
    }
    item.classList.remove('long-pressing');

    const state = this._touchStates.get(item);
    if (state) {
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.isActive = false;
      this._touchStates.delete(item);
    }

    item.style.pointerEvents = 'none';
    setTimeout(() => {
      item.style.pointerEvents = '';
    }, 200);
  }

  _hideAllDeleteConfirmations(exceptItem = null) {
    const openConfirmations = this.shadowRoot.querySelectorAll('.kt-delete-confirmation:not(.kt-hidden)');

    openConfirmations.forEach(confirmation => {
      const parentItem = confirmation.closest('.kt-long-press-item');
      if (parentItem && parentItem !== exceptItem) {
        this.hideDeleteConfirmation(parentItem);
      }
    });
  }

  addSwipeListeners() {
    if (this._swipeListenersAdded) return;
    this._swipeListenersAdded = true;

    const controller = new AbortController();
    this._touchControllers.set('swipe', controller);
    const signal = controller.signal;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTracking = false;
    let currentItem = null;


    const touchStart = (e) => {
      const swipeableItem = e.target.closest('.kt-swipeable-item');
      if (!swipeableItem) return;

      currentItem = swipeableItem;
      isTracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      currentY = startY;
    };

    const touchMove = (e) => {
      if (!isTracking || !currentItem) return;

      e.preventDefault();
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;

      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isTracking = false;
        currentItem = null;
        return;
      }

      if (Math.abs(deltaX) > 30) {
        if (deltaX > 0) {
          currentItem.classList.add('swiping-right');
          currentItem.classList.remove('swiping-left');
        } else {
          currentItem.classList.add('swiping-left');
          currentItem.classList.remove('swiping-right');
        }
      }
    };

    const touchEnd = (e) => {
      if (!isTracking || !currentItem) return;

      const deltaX = currentX - startX;

      if (Math.abs(deltaX) > 80) {
        if (deltaX > 0) {
          this.handleSwipeRight(currentItem);
        } else {
          this.handleSwipeLeft(currentItem);
        }
      }

      setTimeout(() => {
        if (currentItem) {
          currentItem.classList.remove('swiping-left', 'swiping-right');
        }
      }, 300);

      isTracking = false;
      currentItem = null;
    };

    this.shadowRoot.addEventListener('touchstart', touchStart, { signal, passive: true });
    this.shadowRoot.addEventListener('touchmove', touchMove, { signal, passive: false });
    this.shadowRoot.addEventListener('touchend', touchEnd, { signal, passive: true });
  }


  handleSwipeLeft(item) {

  }

  handleSwipeRight(item) {

  }


  emptySection(icon, text, subtext) {
    return typeof KidsTasksUtils !== 'undefined'
      ? KidsTasksUtils.emptySection(icon, text, subtext)
      : `
          <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <div class="empty-text">${text}</div>
            <div class="empty-subtext">${subtext}</div>
          </div>
        `;
  }

  renderIcon(iconData) {
    return typeof KidsTasksUtils !== 'undefined'
      ? KidsTasksUtils.renderIcon(iconData)
      : (iconData || '📋');
  }

  getCategoryIcon(categoryOrItem) {
    if (typeof KidsTasksUtils !== 'undefined') {
      return KidsTasksUtils.getCategoryIcon(categoryOrItem, this.getDynamicIcons?.() || {}, this.getRewardIcons?.() || {});
    }
    return this.renderIcon('📋');
  }


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


  getAvatar(child, defaultEmoji = '👤') {
    if (!child) return defaultEmoji;

    const avatarType = child.avatar_type || 'emoji';

    if (avatarType === 'emoji') {
      return child.avatar || defaultEmoji;
    } else if (avatarType === 'url' && child.avatar_data) {
      return `<img src="${child.avatar_data}" alt="${child.name || 'Enfant'}">`;
    } else if (avatarType === 'person_entity' && child.person_entity_id && this._hass) {
      const personEntity = this._hass.states[child.person_entity_id];
      if (personEntity && personEntity.attributes && personEntity.attributes.entity_picture) {
        return `<img src="${personEntity.attributes.entity_picture}" alt="${child.name || 'Enfant'}">`;
      }
    }

    return child.avatar || defaultEmoji;
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
      .filter(entity => {
        if (!entity.attributes) return false;


        const assignedChildIds = entity.attributes.assigned_child_ids ||
                                (entity.attributes.assigned_children ? entity.attributes.assigned_children :
                                (entity.attributes.assigned_child_id ? [entity.attributes.assigned_child_id] : []));

        return Array.isArray(assignedChildIds) ? assignedChildIds.includes(childId) : assignedChildIds === childId;
      });

    return taskEntities.map(entity => ({
      id: entity.entity_id.replace('sensor.kidtasks_task_', ''),
      name: entity.attributes.friendly_name || 'Tâche',
      status: entity.state,
      completed_at: entity.attributes.completed_at,
      ...entity.attributes
    }));
  }


  renderChild(child) {
    const stats = this.getChildStats(child);


    const gaugeStats = {
      totalPoints: child.points || 0,
      level: child.level || 1,
      pointsInCurrentLevel: (child.points || 0) % 100,
      pointsToNextLevel: 100,
      completedToday: stats.completedToday,
      totalToday: stats.totalToday,
      coins: child.coins || 0
    };


    return `
      <div class="child-card-colorful kt-clickable kt-long-press-item"
           data-action="edit-child"
           data-id="${child.child_id || child.id}"
           data-delete-action="remove-child">
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

          <div class="gauges-section kt-clickable"
               data-action="show-child-history"
               data-id="${child.child_id || child.id}">
            ${this.renderGauges(gaugeStats, true)}
          </div>
        </div>

        <!-- Confirmation de suppression pour appui long -->
        <div class="kt-delete-confirmation kt-hidden">
          <span style="color: white; font-weight: bold;">Supprimer ${child.name} ?</span>
          <ha-button class="kt-confirm-delete">Confirmer</ha-button>
          <ha-button class="kt-cancel-delete">Annuler</ha-button>
        </div>
      </div>
    `;
  }

showModal(content, title = '') {

    const existingDialogs = document.querySelectorAll('ha-dialog');
    existingDialogs.forEach(existingDialog => {
      if (existingDialog && existingDialog.parentNode) {
        existingDialog.close();
        existingDialog.parentNode.removeChild(existingDialog);
      }
    });


    const originalOverflow = document.body.style.overflow;


    const dialog = document.createElement('ha-dialog');
    dialog.heading = title;
    dialog.hideActions = true;


    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
      <style>
        /* Styles spécifiques pour les modales ha-dialog */
        ha-dialog {
          max-height: 90vh;
          overflow-y: auto;
          --mdc-dialog-max-width: 800px;
          --mdc-dialog-min-width: 600px;
          z-index: 10001 !important;
        }
        
        ha-select {
          --mdc-menu-max-height: 480px;
          --mdc-menu-min-width: 100%;
        }
        
        ha-select mwc-menu {
          --mdc-menu-max-height: 480px;
          --mdc-menu-item-height: 48px;
        }
        
        /* Composants HA dans les modales */
        ha-textfield, ha-textarea, ha-select, ha-formfield {
          display: block;
          margin-bottom: 16px;
          width: 100%;
          --mdc-typography-subtitle1-font-size: 16px;
        }
        
        /* Effet hover pour les ha-formfield cliquables (validation requise, etc.) */
        ha-formfield {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        /* Styles des formulaires pour les modales */
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: var(--primary-text-color, #212121);
        }
        
        .form-row { 
          display: flex; 
          gap: 12px; 
          margin-bottom: 16px;
        }
        .form-row > * { 
          flex: 1; 
          margin-bottom: 0;
        }
        
        /* Layout côte à côte pour enfants et jours */
        .selection-row {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        
        .children-column {
          flex: 1;
          min-width: 0;
        }
        
        .days-column {
          flex: 1;
          min-width: 0;
        }
        
        /* Quand la section des jours est masquée, masquer toute la colonne des jours */
        .days-column .weekly-days-section[style*="display: none"],
        .days-column .weekly-days-section[style*="display:none"] {
          display: none !important;
        }
        
        /* Masquer la colonne des jours si elle ne contient qu'une section masquée */
        .days-column:has(.weekly-days-section[style*="display: none"]) {
          display: none;
        }
        
        .children-grid {
          display: flex;
          flex-direction: column;  
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }

        .child-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
          user-select: none;
        }
        
        .child-checkbox:hover {
          background-color: var(--primary-color, #3f51b5);
          color: white;
        }
        
        .child-label {
          font-size: 14px;
          color: var(--primary-text-color, #212121);
          user-select: none;
        }

        .child-info {
          display: flex;
          flex-direction: column;
        }
        
        /* Styles pour la section des jours de la semaine */
        .weekly-days-section, .children-section {
          margin-bottom: 20px;
          padding: var(--kt-space-lg);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-sm);
          background: var(--secondary-background-color, #fafafa);
        }
        
        .weekly-days-section .form-label, .children-section .form-label {
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--primary-text-color, #212121);
        }
        
        .weekly-days-section .days-selector {
          display: flex;
          flex-direction: column;
          margin-top: 8px;
        }
        
        .day-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s;
          user-select: none;
        }
        
        .day-checkbox:hover {
          background-color: var(--primary-color, #3f51b5);
          color: white;
        }
        
        .day-checkbox:hover .day-label {
          color: white;
        }
        
        .day-label {
          font-size: 14px;
          color: var(--primary-text-color, #212121);
          user-select: none;
        }
        
        /* Actions des dialogues */
        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color, #e0e0e0);
        }
        
        /* Responsive design pour les modales */
        @media (max-width: 768px) {
          ha-dialog {
            --mdc-dialog-max-width: 95vw;
            --mdc-dialog-min-width: 320px;
          }
          
          .selection-row {
            flex-direction: column;
            gap: 16px;
          }
          
          .form-row > * {
            margin-bottom: 16px;
          }
        }
        
        /* Styles avatar spécifiques aux modales */
        .avatar-options { 
          display: flex; 
          gap: 8px; 
          flex-wrap: wrap; 
          margin-bottom: 8px; 
        }
        .avatar-option {
          padding: var(--kt-space-sm);
          border: 2px solid var(--divider-color);
          border-radius: var(--kt-radius-sm);
          background: var(--secondary-background-color);
          cursor: pointer;
          font-size: 1.5em;
          transition: all 0.3s;
        }
        .avatar-option:hover { border-color: var(--primary-color); }
        .avatar-option.selected {
          border-color: var(--accent-color);
          background: rgba(255, 64, 129, 0.1);
        }
        
        /* Styles spécifiques pour le modal de détail des récompenses */
        .reward-detail-content {
          text-align: center;
          padding: var(--kt-space-lg, 16px);
        }
        
        .reward-modal-icon {
          font-size: 4em;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .reward-modal-icon ha-icon {
          display: flex !important;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .reward-modal-name {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 8px;
          color: var(--primary-text-color, #212121);
        }
        
        .reward-modal-price {
          font-size: 1.2em;
          color: var(--primary-color, #6b73ff);
          font-weight: bold;
          margin-bottom: 16px;
        }
        
        .reward-modal-description {
          color: var(--primary-text-color, #212121);
          line-height: 1.5;
          margin-bottom: 24px;
          font-weight: 500;
        }
        
        .btn-modal {
          padding: var(--kt-space-md, 12px) 24px;
          border: none;
          border-radius: var(--kt-radius-xl, 20px);
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          font-size: 1em;
        }
        
        .btn-modal-purchase {
          background: var(--success-color, #4CAF50);
          color: white;
        }
        
        .btn-modal-purchase:hover {
          background: #45a049;
          transform: translateY(-1px);
        }
        
        .btn-modal-purchase:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-modal-cancel {
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color, #212121);
        }
        
        .btn-modal-cancel:hover {
          background: var(--divider-color, #e0e0e0);
        }
      </style>
      <div class="kids-tasks-scope">
        ${content}
      </div>
    `;


    dialog._cardInstance = this;
    dialog._originalOverflow = originalOverflow;

    dialog.appendChild(contentDiv);
    document.body.appendChild(dialog);


    dialog.addEventListener('closed', () => {

      if (dialog._originalOverflow !== undefined) {
        document.body.style.overflow = dialog._originalOverflow;
      } else {

        document.body.style.overflow = 'auto';
      }
    });


    dialog.show();

    return dialog;
  }


  getCustomCSSVariables() {

    const tabColor = this.config?.tab_color || 'var(--kt-primary)';
    const headerColor = this.config?.header_color || 'var(--kt-primary)';
    const tabTextColor = this.config?.tab_text_color || '#ffffff';
    const dashboardPrimary = this.config?.dashboard_primary_color || 'var(--kt-primary)';
    const dashboardSecondary = this.config?.dashboard_secondary_color || 'var(--kt-secondary)';
    const childGradientStart = this.config?.child_gradient_start || '#4CAF50';
    const childGradientEnd = this.config?.child_gradient_end || '#8BC34A';
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
        --custom-tab-text-color: ${tabTextColor};
        --custom-dashboard-primary: ${dashboardPrimary};
        --custom-dashboard-secondary: ${dashboardSecondary};
        --custom-child-gradient-start: ${childGradientStart};
        --custom-child-gradient-end: ${childGradientEnd};
        --custom-child-text-color: ${childTextColor};
        --custom-button-hover-color: ${buttonHoverColor};
        --custom-progress-bar-color: ${progressBarColor};
        --custom-points-badge-color: ${pointsBadgeColor};
        --custom-icon-color: ${iconColor};
      }
    `;
  }

  getCommonStyles() {
    return `
      <style>
        ${this.getCustomCSSVariables()}

        :host {
          display: block;
          border-radius: var(--kt-radius-lg);
          box-shadow: 0 2px 8px var(--kt-shadow-light);
          overflow: hidden;
        }

        .card-content {
          min-height: 200px;
        }

        .card-header {
          background-size: 50% 4px;
          background-repeat: no-repeat;
          background-position: bottom;
          padding: 0px;
          margin: 0px 0px var(--kt-space-sm) 0px;
          position: relative;
          z-index: 1;
          overflow: hidden;
          border-radius: var(--kt-radius-lg) var(--kt-radius-lg) 0 0;
        }

        .kt-hidden {
          display: none !important; 
        }

        /* Navigation */
        .navigation {
          display: flex;
          border-radius: var(--kt-radius-lg) var(--kt-radius-lg) 0px 0px;
          background-color: var(--custom-header-color, var(--divider-color, #e0e0e0));
          overflow: hidden;
        }

        .nav-button {
          flex: 1;
          padding: var(--kt-space-md);
          border: none;
          background: transparent;
          color: var(--custom-dashboard-primary, var(--secondary-text-color, #757575));
          font-weight: 600;
          font-size: 0.9em;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }

        .nav-button:hover, .nav-button.active:hover {
          color: var(--primary-text-color, #212121);
        }

        .nav-button.active {
          color: var(--custom-tab-text-color, #ffffff);
          border-bottom-color: var(--custom-tab-color, var(--kt-primary));
          background: var(--custom-tab-color, var(--kt-active));
          position: relative;
          z-index: 2;
        }

        /* Grid system */
        .children-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: var(--kt-space-lg);
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--kt-space-md);
          margin-bottom: var(--kt-space-lg);
        }

        .summary-card {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          gap: var(--kt-space-sm);
          background: var(--kt-surface-variant);
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          border-left: 3px solid var(--kt-primary);
          text-align: center;
        }

        .summary-card:hover {
          border-left: 3px solid var(--kt-secondary);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .summary-icon {
          font-size: 2em;
          margin-bottom: var(--kt-space-xs);
          opacity: 0.8;
        }

        .summary-number {
          font-size: 2em;
          font-weight: 700;
          color: var(--kt-primary);
          margin-bottom: var(--kt-space-xs);
          text-align: right;
        }

        .summary-label {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          font-weight: 600;
        }

        /* Child cards */
        .child-card-colorful {
          background: linear-gradient(135deg, var(--custom-child-gradient-start, #4CAF50) 0%, var(--custom-child-gradient-end, #8BC34A) 100%);
          color: var(--custom-child-text-color, white);
          border-left: 3px solid var(--kt-primary);
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
          border-left: 3px solid var(--kt-secondary);
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

        .gauges-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 60px;
          justify-content: flex-start;
          padding-left: 4px;
          padding-top: 0px;
          cursor: pointer;
          border-radius: var(--kt-radius-sm);
          transition: all var(--kt-transition-fast);
        }

        .gauges-section:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.02);
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

        /* Progress bars */
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

        /* Gauges */
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

        .gauge-value, .gauge-text {
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

        .gauge-fill.tasks-progress, .gauge-fill.tasks-fill {
          background: linear-gradient(90deg, var(--custom-progress-bar-color, #43e97b), var(--custom-dashboard-secondary, #38f9d7));
        }

        .gauge-fill.coins-progress, .gauge-fill.coins-fill {
          background: linear-gradient(90deg, var(--kt-coins-color, #9C27B0), #E1BEE7);
        }

        .gauge-fill.points-fill {
          background: linear-gradient(90deg, #ffd700, #ffed4a);
        }

        /* Empty states */
        .empty-state, .kt-empty {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        .empty-state-icon, .kt-empty__icon {
          font-size: 3em;
          margin-bottom: var(--kt-space-md);
          opacity: 0.6;
        }

        .kt-empty__text {
          font-size: 1.1em;
          font-weight: 600;
          margin-bottom: var(--kt-space-xs);
        }

        .kt-empty__subtext {
          font-size: 0.9em;
          opacity: 0.8;
        }

        /* Loading */
        .kt-loading {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--secondary-text-color);
        }

        /* Common buttons */
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

        /* Utilities */
        .kt-flex { display: flex; }
        .kt-gap-md { gap: var(--kt-space-md); }
        .kt-fade-in { animation: fadeIn 0.3s ease-in; }
        .kt-clickable {
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }
        .kt-p-lg { padding: var(--kt-space-lg); }

        /* Utilities critiques dans Shadow DOM */
        .kt-delete-confirmation {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(244, 67, 54, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          z-index: 10;
        }

        .kt-delete-confirmation.kt-hidden {
          display: none !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Icons and secondary elements */
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

        /* Navigation with color secondary */
        .nav-button:not(.active) {
          color: var(--custom-dashboard-secondary, var(--secondary-text-color));
        }

          .main-content {
            padding: var(--kt-space-md);
          }
        }

        @media (max-width: 480px) {

          .card-content {
            padding: var(--kt-space-sm);
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


  shouldUpdate(oldHass, newHass) {
    throw new Error('shouldUpdate must be implemented by subclass');
  }

  render() {
    throw new Error('render must be implemented by subclass');
  }

  handleAction(action, id, event) {
    throw new Error('handleAction must be implemented by subclass');
  }


  getChildren() {
    if (!this._hass) return [];

    const children = [];
    Object.keys(this._hass.states).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const entity = this._hass.states[entityId];
        if (entity && entity.state !== 'unavailable') {
          const childId = entity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', '');
          children.push({
            id: childId,
            child_id: entity.attributes.child_id,
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

  getTasks() {
    if (!this._hass) return [];

    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id]);

    return taskEntities.map(entity => ({
      id: entity.entity_id.replace('sensor.kidtasks_task_', ''),
      name: entity.attributes.friendly_name || 'Tâche',
      description: entity.attributes.description,
      status: entity.state,
      points: entity.attributes.points || 0,
      coins: entity.attributes.coins || 0,
      penalty_points: entity.attributes.penalty_points || 0,
      category: entity.attributes.category,
      frequency: entity.attributes.frequency || 'daily',
      assigned_children: entity.attributes.assigned_children || [],
      active: entity.attributes.active !== false,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));
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
      category: entity.attributes.category,
      remaining_quantity: entity.attributes.remaining_quantity,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));
  }


  filterTasks(tasks, filter, mode = 'manager') {
    switch (filter) {
      case 'active':
        if (mode === 'child') {

          return tasks.filter(t => t.status === 'todo' || t.status === 'pending');
        } else {

          return tasks.filter(task => task.frequency !== 'none' && task.active !== false && this.isTaskInPeriod(task));
        }
      case 'completed':

        return tasks.filter(t => t.status === 'completed' || t.status === 'validated');
      case 'inactive':
        return tasks.filter(task => task.frequency !== 'none' && task.active === false);
      case 'bonus':
        return tasks.filter(task => task.frequency === 'none');
      case 'out-of-period':
        return tasks.filter(task => task.frequency !== 'none' && task.active !== false && !this.isTaskInPeriod(task));
      case 'all':
      default:
        return tasks;
    }
  }

  isTaskInPeriod(task) {

    return true;
  }

  getFilterLabel(filter, customLabels = {}) {
    const defaultLabels = {
      'all': '',
      'active': 'actives',
      'completed': 'terminées',
      'inactive': 'désactivées',
      'bonus': 'bonus',
      'out-of-period': 'hors période'
    };

    const labels = { ...defaultLabels, ...customLabels };
    return labels[filter] || '';
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

  renderTaskFilters(options = {}) {
    const {
      filters = [],
      currentFilter,
      filterProperty = 'taskFilter',
      actionName = 'filter-tasks',
      wrapper = false,
      wrapperClass = 'filters'
    } = options;

    if (!filters.length) return '';

    const buttonsHtml = filters.map(filter => `
      <button
        class="filter-btn ${this[filterProperty] === filter.id ? 'active' : ''}"
        data-action="${actionName}"
        data-filter="${filter.id}"
      >
        ${filter.label}
      </button>
    `).join('');

    return wrapper ? `<div class="${wrapperClass}">${buttonsHtml}</div>` : buttonsHtml;
  }

  getFrequencyLabel(frequency) {
    const labels = {
      'daily': 'Quotidienne',
      'weekly': 'Hebdomadaire',
      'monthly': 'Mensuelle',
      'bonus': 'Bonus',
      'none': 'Désactivée'
    };
    return labels[frequency] || frequency;
  }

  getCategoryLabel(category) {
    const labels = {
      'chores': 'Corvées',
      'homework': 'Devoirs',
      'hygiene': 'Hygiène',
      'bonus': 'Bonus',
      'cosmetic': 'Cosmétique',
      'reward': 'Récompense'
    };
    return labels[category] || category;
  }

  getCategoryIcon(item) {
    if (item.icon) return item.icon;

    const icons = {
      'chores': '🧹',
      'homework': '📚',
      'hygiene': '🦷',
      'bonus': '⭐',
      'cosmetic': '🎨',
      'reward': '🎁'
    };
    return icons[item.category] || '📋';
  }

  formatAssignedChildren(task) {
    const childrenNames = this.getAssignedChildrenNames(task);
    if (childrenNames.length === 0) return 'Non assignée';
    if (childrenNames.length === 1) return childrenNames[0];
    return childrenNames.join(', ');
  }

  getAssignedChildrenNames(task) {
    if (!this._hass || !task.assigned_child_ids) return [];

    const children = this.getChildren();
    const assignedIds = task.assigned_child_ids;

    return assignedIds.map(assignedChildId => {

      const child = children.find(c =>
        c.child_id === assignedChildId ||
        c.name === assignedChildId ||
        c.id === assignedChildId
      );
      return child ? child.name : 'Enfant inconnu';
    }).filter(name => name !== 'Enfant inconnu');
  }

  getDynamicIcons() {
    return {};
  }

  getRewardIcons() {
    return {};
  }


  async getChildHistory(childId) {
    if (!this._hass) return [];


    const children = this.getChildren();
    const child = children.find(c => c.child_id === childId || c.id === childId);

    if (!child) {
      console.error(`Enfant avec l'ID ${childId} introuvable`);
      return [];
    }


    let historyData = [];
    try {
      await this._hass.callService('kids_tasks', 'get_child_history', {
        child_id: childId,
        limit: 20
      });


      const historyEntityId = `sensor.kidtasks_${child.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_points_history`;
      const historyEntity = this._hass.states[historyEntityId];

      if (historyEntity && historyEntity.attributes && historyEntity.attributes.points_history) {
        historyData = historyEntity.attributes.points_history;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);

      const historyEntityId = `sensor.kidtasks_${child.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_points_history`;
      const historyEntity = this._hass.states[historyEntityId];

      if (historyEntity && historyEntity.attributes && historyEntity.attributes.points_history) {
        historyData = historyEntity.attributes.points_history;
      }
    }

    return historyData || [];
  }

  getActionIcon(actionType) {
    const icons = {
      'task_completed': '✅',
      'task_validated': '🎯',
      'task_penalty': '⚠️',
      'reward_claimed': '🏆',
      'manual_adjustment': '⚙️',
      'level_up': '📈',
      'bonus_points': '🌟',
      'default': '📊'
    };
    return icons[actionType] || icons['default'];
  }

  getActionTypeLabel(actionType) {
    const labels = {
      'task_completed': 'Terminée',
      'task_validated': 'Validée',
      'task_penalty': 'Pénalité',
      'reward_claimed': 'Récompense',
      'manual_adjustment': 'Ajustement',
      'level_up': 'Montée niveau',
      'bonus_points': 'Points bonus',
      'default': 'Autre'
    };
    return labels[actionType] || labels['default'];
  }

  renderHistoryAsTask(entry) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const pointsDisplay = entry.points_delta > 0 ? `+${entry.points_delta}` : `${entry.points_delta}`;
    const pointsClass = entry.points_delta > 0 ? 'success' : 'penalty';
    const actionIcon = this.getActionIcon(entry.action_type);


    let taskClass = 'completed';
    if (entry.points_delta < 0) {
      taskClass = 'missed';
    }

    return `
      <div class="task ${taskClass}">
        <div class="item-icon">${actionIcon}</div>
        <div class="task-main flex-content">
          <div class="task-name-row">
            <div class="task-name">${entry.description || 'Action inconnue'}</div>
            <div class="task-validation">${dateStr} à ${timeStr}</div>
          </div>
          <div class="task-points">
            <span style="color: ${entry.points_delta > 0 ? '#4CAF50' : '#f44336'}; font-weight: bold;">${pointsDisplay} 🎫</span>
            <span style="color: var(--secondary-text-color, #757575); font-size: 0.9em;">${this.getActionTypeLabel(entry.action_type)}</span>
          </div>
        </div>
        <div class="task-action">
          <span class="task-result ${pointsClass}">${entry.points_delta > 0 ? '🎉' : '😞'}</span>
        </div>
      </div>
    `;
  }

  async renderChildHistoryForTab(child) {
    const history = await this.getChildHistory(child.child_id || child.id);

    if (history.length === 0) {
      return `
        <div class="empty-history">
          <div class="empty-icon">📈</div>
          <p>Aucun historique</p>
          <small>Les actions sur les points apparaîtront ici</small>
        </div>
      `;
    }


    const limitedHistory = history.slice(0, 15);

    return `
      <div class="task-list">
        ${limitedHistory.map(entry => this.renderHistoryAsTask(entry)).join('')}
      </div>
    `;
  }

  async renderChildHistoryContent(child, historyData = null, showHeader = true) {
    const history = historyData || await this.getChildHistory(child.child_id || child.id);

    const todayHistory = history.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toDateString() === new Date().toDateString();
    });

    const thisWeekHistory = history.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    return `
      <div class="child-history-container">
        ${showHeader ? `
          <div class="history-header">
            <div class="kt-child-info">
              <div class="kt-avatar">${this.getAvatar(child)}</div>
              <div class="kt-child-details">
                <h3>${child.name}</h3>
                <div class="current-stats">
                  <span class="stat">${child.points || 0} 🎫 Points</span>
                  <span class="stat">${child.coins || 0} 🪙 Pièces</span>
                  <span class="stat">Niveau ${child.level || 1}</span>
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="history-content">
          ${history.length > 0 ? `
            <div class="history-sections">
              ${todayHistory.length > 0 ? `
                <div class="history-section">
                  <h4>🌟 Aujourd'hui</h4>
                  ${todayHistory.map(entry => this.renderHistoryAsTask(entry)).join('')}
                </div>
              ` : ''}

              ${thisWeekHistory.length > todayHistory.length ? `
                <div class="history-section">
                  <h4>📅 Cette semaine</h4>
                  ${thisWeekHistory.filter(entry => {
                    const entryDate = new Date(entry.timestamp);
                    return entryDate.toDateString() !== new Date().toDateString();
                  }).map(entry => this.renderHistoryAsTask(entry)).join('')}
                </div>
              ` : ''}

              ${history.length > thisWeekHistory.length ? `
                <div class="history-section">
                  <h4>📈 Plus ancien</h4>
                  ${history.filter(entry => {
                    const entryDate = new Date(entry.timestamp);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return entryDate < weekAgo;
                  }).slice(0, 10).map(entry => this.renderHistoryAsTask(entry)).join('')}
                </div>
              ` : ''}
            </div>
          ` : `
            <div class="empty-history">
              <div class="empty-icon">📈</div>
              <p>Aucune activité dans l'historique</p>
              <p>Les tâches complétées apparaîtront ici.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }


  async showChildHistory(childId) {
    const child = this.getChildren().find(c => c.child_id === childId || c.id === childId);
    if (!child) return;

    const content = await this.renderChildHistoryContent(child);
    this.showModal(content, `Historique de ${child.name}`);
  }
}

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
        /* Dashboard-specific overrides */
        .card-header {
          background: linear-gradient(90deg, var(--custom-header-color, var(--kt-primary)) 0%, transparent 100%);
          background-size: 100% 4px;
          background-position: bottom;
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

    const stats = this.calculateGlobalStats(children);

    return `
      <div class="summary-stats kt-fade-in">
        <div class="summary-card">
          <div class="summary-icon">👦🏻</div>
          <div class="summary-number">${children.length}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">📋</div>
          <div class="summary-number">${stats.totalTasks}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">✅</div>
          <div class="summary-number">${stats.completedToday}</div>
        </div>
        <div class="summary-card">
          <div class="summary-icon">⏳</div>
          <div class="summary-number">${stats.pendingTasks}</div>
        </div>
      </div>

      <div class="children-grid kt-fade-in">
        ${children.map(child => this.renderChild(child)).join('')}
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
          <div class="summary-label">Points</div>
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
        {
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

class KidsTasksChildCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this._refreshInterval = null;
    this._refreshTimeout = null;
    this._allTimers = new Set();
    this.currentTab = 'tasks';
    this.tasksFilter = 'active';
    this.rewardsFilter = 'all';
    this._lastDataHash = null;
    this._isVisible = true;
    this._refreshRate = 30000;
  }

  connectedCallback() {

    this._setupSmartRefresh();


    this._setupVisibilityDetection();


    this._cleanupTimers();
  }

  disconnectedCallback() {
    this._cleanupTimers();
    this._removeVisibilityDetection();
  }


  _setupSmartRefresh() {
    const smartRefresh = () => {
      if (!this._hass || !this._initialized || !this._isVisible) {
        this._scheduleNextRefresh();
        return;
      }


      const currentDataHash = this._getDataHash();
      if (currentDataHash === this._lastDataHash) {
        this._scheduleNextRefresh();
        return;
      }


      this._lastDataHash = currentDataHash;
      this.smartRender();
      this._scheduleNextRefresh();
    };


    if (this._hass && this._initialized) {
      smartRefresh();
    }
  }


  _scheduleNextRefresh() {
    this._cleanupRefreshTimers();

    const refreshRate = this._isVisible ? this._refreshRate : this._refreshRate * 2;

    this._refreshTimeout = setTimeout(() => {
      this._setupSmartRefresh();
    }, refreshRate);

    this._allTimers.add(this._refreshTimeout);
  }


  _getDataHash() {
    if (!this._hass || !this.config?.child_id) return null;

    const child = this.getChild();
    const tasks = this.getChildTasks(this.config.child_id);
    const rewards = this.getChildRewards(this.config.child_id);


    const dataString = JSON.stringify({
      childPoints: child?.points || 0,
      childCoins: child?.coins || 0,
      childLevel: child?.level || 1,
      taskCount: tasks.length,
      taskStates: tasks.map(t => `${t.id}:${t.status}`).join(','),
      rewardCount: rewards.length
    });


    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return hash.toString();
  }


  _setupVisibilityDetection() {
    this._visibilityChangeHandler = () => {
      this._isVisible = !document.hidden;

      if (this._isVisible) {

        this._setupSmartRefresh();
      } else {

        this._cleanupRefreshTimers();
      }
    };

    document.addEventListener('visibilitychange', this._visibilityChangeHandler);
    this._isVisible = !document.hidden;
  }


  _removeVisibilityDetection() {
    if (this._visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
      this._visibilityChangeHandler = null;
    }
  }


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


  _cleanupTimers() {
    this._cleanupRefreshTimers();


    for (const timer of this._allTimers) {
      clearTimeout(timer);
      clearInterval(timer);
    }
    this._allTimers.clear();


    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('timers', this.constructor.name, 'remove');
    }
  }


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


    const childId = this.config.child_id;
    const oldChild = this.getChildFromHass(oldHass, childId);
    const newChild = this.getChildFromHass(newHass, childId);

    if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) {
      return true;
    }


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


  getChild() {
    const childId = this.config.child_id;
    return this.getChildFromHass(this._hass, childId);
  }

  getChildFromHass(hass, childIdOrName) {
    console.log('=== getChildFromHass DEBUG ===');
    console.log('Looking for child:', childIdOrName);


    const pointsEntities = Object.keys(hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_') && id.endsWith('_points'));

    console.log('All points entities:', pointsEntities);


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


    const allTaskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'));

    console.log('All task entities:', allTaskEntities);

    const taskEntities = Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id])
      .filter(entity => {
        if (!entity.attributes) return false;


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

class KidsTasksManagerCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'children';
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
        <div class="card-header">
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${this.renderCurrentView()}
        </div>
      </div>
    `;
  }


  getStyles() {
    return `
      ${this.getCommonStyles()}
      <style>
        /* Manager-specific styles */

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

        /* Manager responsive overrides */
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
      { id: 'children', label: '👦🏻 Enfants' },
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
      case 'children':
        return this.renderChildrenView();
      case 'tasks':
        return this.renderTasksView();
      case 'rewards':
        return this.renderRewardsView();
      case 'cosmetics':
        return this.renderCosmeticsView();
      default:
        return this.renderChildrenView();
    }
  }

  renderChildrenView() {
    const children = this.getChildren();
    return `
    <div class="children-grid">
        ${children.map(child => this.renderChild(child)).join('')}
    </div>
    `;

  }

  renderTasksView() {
    const allTasks = this.getTasks();
    const tasks = this.filterTasks(allTasks, this.taskFilter);

    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <ha-button class="add-btn" data-action="add-task">Ajouter</ha-button>
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
            ${this.taskFilter === 'active' ? '<ha-button class="add-btn" data-action="add-task">Créer votre première tâche</ha-button>' : ''}
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

    return super.renderTaskFilters({
      filters,
      filterProperty: 'taskFilter',
      actionName: 'filter-tasks',
      wrapper: false
    });
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
          <ha-button class="add-btn" data-action="add-reward">Ajouter</ha-button>
        </h2>
        ${rewards.length > 0 ? `
          <div class="reward-list">
            ${rewards.map(reward => this.renderRewardItem(reward)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎁</div>
            <p>Aucune récompense créée</p>
            <ha-button class="add-btn" data-action="add-reward">Créer votre première récompense</ha-button>
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


  handleAction(action, id, event) {
    console.log(`Action=${action}`);
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
      case 'edit-child':
        this.showChildForm(id);
        break;
      case 'show-child-history':
        this.showChildHistory(id);
        break;
      case 'remove-child':
        this.handleRemoveChild(id);
        break;
      default:
        {
          console.warn('Unknown action in manager card:', action);
        }
    }
  }


  async handleAddTask() {
    console.info('Add task requested');

  }

  async handleEditTask(taskId) {
    console.info('Edit task:', taskId);

  }

  async handleAddReward() {
    console.info('Add reward requested');

  }

  async handleEditReward(rewardId) {
    console.info('Edit reward:', rewardId);

  }

  showChildForm(editChildId = null) {
    const children = this.getChildren();
    const child = editChildId ? children.find(c => c.child_id === editChildId || c.id === editChildId) : null;
    const isEdit = !!child;
    const persons = this.getPersonEntities();

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="child_id" value="${child.child_id || child.id}">` : ''}

        <ha-textfield
          label="Nom de l'enfant *"
          name="name"
          required
          value="${isEdit ? child.name : ''}"
          placeholder="Prénom de l'enfant">
        </ha-textfield>

        <ha-select
          label="Type d'avatar"
          name="avatar_type"
          required
          value="${isEdit ? child.avatar_type || 'emoji' : 'emoji'}">
          <ha-list-item value="emoji">Emoji</ha-list-item>
          <ha-list-item value="url">URL d'image</ha-list-item>
          ${persons.length > 0 ? '<ha-list-item value="person_entity">Photo de la personne liée</ha-list-item>' : ''}
        </ha-select>

        <div id="avatar-config">
          <div id="emoji-config" style="display: ${isEdit && child.avatar_type !== 'emoji' ? 'none' : 'block'};">
            <label class="form-label">Choisir un emoji</label>
            <div class="avatar-options">
              ${avatarOptions.map(avatar => `
                <button type="button" class="avatar-option ${isEdit && child.avatar === avatar ? 'selected' : ''}"
                        data-avatar="${avatar}">
                  ${avatar}
                </button>
              `).join('')}
            </div>
            <input type="hidden" name="avatar" value="${isEdit ? child.avatar || '👶' : '👶'}">
          </div>

          <div id="url-config" style="display: ${isEdit && child.avatar_type === 'url' ? 'block' : 'none'};">
            <ha-textfield
              label="URL de l'image"
              name="avatar_url"
              value="${isEdit && child.avatar_type === 'url' ? child.avatar_data || '' : ''}"
              placeholder="https://example.com/photo.png">
            </ha-textfield>
          </div>

          ${persons.length > 0 ? `
          <div id="person_entity-config" style="display: ${isEdit && child.avatar_type === 'person_entity' ? 'block' : 'none'};">
            <ha-select
              label="Personne liée"
              name="person_entity_id"
              value="${isEdit ? child.person_entity_id || '' : ''}">
              <ha-list-item value="">Aucune liaison</ha-list-item>
              ${persons.map(person => `
                <ha-list-item value="${person.entity_id}" ${isEdit && child.person_entity_id === person.entity_id ? 'selected' : ''}>
                  ${person.name}
                </ha-list-item>
              `).join('')}
            </ha-select>
          </div>
          ` : ''}
        </div>

        ${!isEdit ? `
          <ha-textfield
            label="Points initiaux"
            name="initial_points"
            type="number"
            value="0"
            min="0"
            max="1000">
          </ha-textfield>
        ` : `
          <div class="form-row">
            <ha-textfield
              label="Niveau"
              name="level"
              type="number"
              value="${child.level || 1}"
              min="1"
              max="99">
            </ha-textfield>
            <ha-textfield
              label="Points"
              name="points"
              type="number"
              value="${child.points || 0}"
              min="0">
            </ha-textfield>
            <ha-textfield
              label="Pièces"
              name="coins"
              type="number"
              value="${child.coins || 0}"
              min="0">
            </ha-textfield>
          </div>
        `}

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary" onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary" onclick="this.closest('ha-dialog')._cardInstance.submitChildForm(${isEdit})">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant');


    setTimeout(() => {

      const avatarTypeSelect = dialog.querySelector('ha-select[name="avatar_type"]');
      const avatarConfig = dialog.querySelector('#avatar-config');

      if (avatarTypeSelect && avatarConfig) {

        const updateAvatarDisplay = (selectedType) => {
          avatarConfig.querySelectorAll('[id$="-config"]').forEach(div => {
            div.style.display = 'none';
          });
          const targetDiv = dialog.querySelector('#' + selectedType + '-config');
          if (targetDiv) {
            targetDiv.style.display = 'block';
          }
        };


        avatarTypeSelect.addEventListener('selected', (e) => {
          const selectedType = e.detail.value || e.target.value;
          updateAvatarDisplay(selectedType);
        });


        avatarTypeSelect.addEventListener('change', (e) => {
          const selectedType = e.target.value;
          updateAvatarDisplay(selectedType);
        });


        avatarConfig.querySelectorAll('.avatar-option').forEach(btn => {
          btn.addEventListener('click', () => {
            avatarConfig.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const avatarInput = dialog.querySelector('input[name="avatar"]');
            if (avatarInput) {
              avatarInput.value = btn.dataset.avatar;
            }
          });
        });
      }
    }, 100);
  }


  handleRemoveChild(childId) {
    const child = this.getChildren().find(c => c.child_id === childId || c.id === childId);
    const childName = child ? child.name : 'cet enfant';

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${childName} ?\n\n` +
                          `Cette action supprimera définitivement :\n` +
                          `• L'enfant et tous ses 🎫\n` +
                          `• Toutes ses tâches assignées\n` +
                          `• Tout l'historique de ses activités\n` +
                          `• Tous les capteurs associés\n\n` +
                          `Cette action est IRRÉVERSIBLE !`;

    if (confirm(confirmMessage)) {
      this.callService('kids_tasks', 'remove_child', {
        child_id: childId,
        force_remove_entities: true
      });
    }
  }

  async callService(domain, service, serviceData = {}) {
    try {
      await this._hass.callService(domain, service, serviceData);
      this.showNotification(`Action "${service}" exécutée avec succès`, 'success');
      setTimeout(() => { this.render(); }, 1000);
      return true;
    } catch (error) {
      this.showNotification(`Erreur: ${error.message}`, 'error');
      return false;
    }
  }

  async submitChildForm(isEdit = false) {
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;


    const name = form.querySelector('[name="name"]').value;
    const person_entity_id = form.querySelector('[name="person_entity_id"]')?.value || null;
    const avatar_type = form.querySelector('[name="avatar_type"]').value;

    let avatar_data = null;
    let avatar = '👶';


    if (avatar_type === 'emoji') {
      avatar = form.querySelector('[name="avatar"]').value;
    } else if (avatar_type === 'url') {
      avatar_data = form.querySelector('[name="avatar_url"]').value;
    }

    const serviceData = {
      name,
      avatar,
      avatar_type,
    };


    if (person_entity_id) serviceData.person_entity_id = person_entity_id;
    if (avatar_data) serviceData.avatar_data = avatar_data;

    if (!isEdit) {
      serviceData.initial_points = parseInt(form.querySelector('[name="initial_points"]')?.value || '0');
    } else {
      const childId = form.querySelector('[name="child_id"]').value;
      serviceData.child_id = childId;

      parseInt(form.querySelector('[name="level"]')?.value || '1');
      const newPoints = parseInt(form.querySelector('[name="points"]')?.value || '0');
      const newCoins = parseInt(form.querySelector('[name="coins"]')?.value || '0');


      const success = await this.callService('kids_tasks', 'update_child', serviceData);

      if (success) {

        const children = this.getChildren();
        const currentChild = children.find(c => (c.child_id || c.id) === childId);

        if (currentChild) {
          const pointsDiff = newPoints - (currentChild.points || 0);
          const coinsDiff = newCoins - (currentChild.coins || 0);

          if (pointsDiff !== 0) {
            await this.callService('kids_tasks', 'adjust_points', {
              child_id: childId,
              points: pointsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }

          if (coinsDiff !== 0) {
            await this.callService('kids_tasks', 'adjust_coins', {
              child_id: childId,
              coins: coinsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }
        }
      }


    }

    dialog.close();
  }

  getPersonEntities() {
    if (!this._hass) return [];

    const persons = [];
    const entities = this._hass.states;

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('person.')) {
        const personEntity = entities[entityId];
        if (personEntity) {
          persons.push({
            entity_id: entityId,
            name: personEntity.attributes.friendly_name || personEntity.attributes.name || entityId.replace('person.', ''),
            picture: personEntity.attributes.entity_picture
          });
        }
      }
    });

    return persons.sort((a, b) => a.name.localeCompare(b.name));
  }


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

class KidsTasksBaseCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._rendered = false;
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...config };
    if (this._rendered) {
      this._render();
    } else {
      this._pendingConfig = true;
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    } else if (this._pendingConfig) {
      this._syncInputValues();
      this._pendingConfig = false;
    }
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <div class="card-config">
        ${this._renderSpecificOptions()}
      </div>
      <style>
        .card-config {
          padding: var(--kt-space-lg);
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
          border-radius: var(--kt-radius-lg);
        }
        
        .option {
          margin-bottom: var(--kt-space-md);
        }
        
        .option label {
          display: block;
          margin-bottom: var(--kt-space-xs);
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        .option input[type="text"],
        .option input[type="number"],
        .option select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 14px;
        }
        
        .option input[type="checkbox"] {
          margin-right: 8px;
        }
        
        .option label:has(input[type="checkbox"]) {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
        
        .section-title {
          font-size: var(--kt-font-size-md);
          font-weight: 600;
          margin: var(--kt-space-lg) 0 var(--kt-space-sm) 0;
          color: var(--primary-text-color);
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: var(--kt-space-xs);
        }

        .color-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--kt-space-md);
          margin-bottom: var(--kt-space-md);
        }

        .color-option {
          margin-bottom: 0;
        }

        .color-option label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: var(--primary-text-color);
          font-size: 13px;
        }

        .color-option input[type="color"] {
          width: 100%;
          height: 40px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          cursor: pointer;
        }
      </style>
    `;

    this._attachListeners();
    this._syncInputValues();
  }

  _renderSpecificOptions() {

    return '';
  }

  _attachListeners() {
    this._attachSpecificListeners();
  }

  _attachSpecificListeners() {

  }

  _syncInputValues() {

    this._syncSpecificInputValues();
  }

  _syncSpecificInputValues() {

  }

  _fireConfigChanged() {
    const event = new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

class KidsTasksCardEditor extends KidsTasksBaseCardEditor {
  getDefaultColors() {
    return {
      tab_color: '#3f51b5',
      header_color: '#3f51b5',
      tab_text_color: '#ffffff',
      dashboard_primary_color: '#3f51b5',
      dashboard_secondary_color: '#ff4081',
      child_gradient_start: '#4CAF50',
      child_gradient_end: '#8BC34A',
      child_text_color: '#ffffff',
      button_hover_color: '#1565C0',
      progress_bar_color: '#4caf50',
      points_badge_color: '#ff9800',
      icon_color: '#757575'
    };
  }

  _renderSpecificOptions() {
    const defaults = this.getDefaultColors();
    return `
      <div class="section-title">Carte Principale</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Onglet actif</label>
          <input
            type="color"
            class="tab-color-input"
            value="${this._config.tab_color || defaults.tab_color}"
          >
        </div>
        <div class="color-option">
          <label>Onglets</label>
          <input
            type="color"
            class="header-color-input"
            value="${this._config.header_color || defaults.header_color}"
          >
        </div>
        <div class="color-option">
          <label>Texte des onglets</label>
          <input
            type="color"
            class="tab-text-color-input"
            value="${this._config.tab_text_color || defaults.tab_text_color}"
          >
        </div>
        <div class="color-option">
          <label>Couleur primaire dashboard</label>
          <input
            type="color"
            class="dashboard-primary-input"
            value="${this._config.dashboard_primary_color || defaults.dashboard_primary_color}"
          >
        </div>
        <div class="color-option">
          <label>Couleur secondaire dashboard</label>
          <input
            type="color"
            class="dashboard-secondary-input"
            value="${this._config.dashboard_secondary_color || defaults.dashboard_secondary_color}"
          >
        </div>
      </div>

      <div class="section-title">Cartes Enfants</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Début dégradé enfants</label>
          <input
            type="color"
            class="child-gradient-start-input"
            value="${this._config.child_gradient_start || defaults.child_gradient_start}"
          >
        </div>
        <div class="color-option">
          <label>Fin dégradé enfants</label>
          <input
            type="color"
            class="child-gradient-end-input"
            value="${this._config.child_gradient_end || defaults.child_gradient_end}"
          >
        </div>
        <div class="color-option">
          <label>Texte cartes enfants</label>
          <input
            type="color"
            class="child-text-color-input"
            value="${this._config.child_text_color || defaults.child_text_color}"
          >
        </div>
      </div>

      <div class="section-title">Interface</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Boutons au survol</label>
          <input
            type="color"
            class="button-hover-input"
            value="${this._config.button_hover_color || defaults.button_hover_color}"
          >
        </div>
        <div class="color-option">
          <label>Barre de progression</label>
          <input
            type="color"
            class="progress-bar-input"
            value="${this._config.progress_bar_color || defaults.progress_bar_color}"
          >
        </div>
        <div class="color-option">
          <label>Badges de points</label>
          <input
            type="color"
            class="points-badge-input"
            value="${this._config.points_badge_color || defaults.points_badge_color}"
          >
        </div>
        <div class="color-option">
          <label>Icônes</label>
          <input
            type="color"
            class="icon-color-input"
            value="${this._config.icon_color || defaults.icon_color}"
          >
        </div>
      </div>

      <div class="help-text">
        Cette carte affiche un tableau de bord avec tous les enfants et leurs tâches.
        Personnalisez les couleurs pour harmoniser avec votre thème Home Assistant.
      </div>
    `;
  }

  _attachSpecificListeners() {
    const tabColorInput = this.shadowRoot.querySelector('.tab-color-input');
    const headerColorInput = this.shadowRoot.querySelector('.header-color-input');
    const tabTextColorInput = this.shadowRoot.querySelector('.tab-text-color-input');
    const dashboardPrimaryInput = this.shadowRoot.querySelector('.dashboard-primary-input');
    const dashboardSecondaryInput = this.shadowRoot.querySelector('.dashboard-secondary-input');
    const childGradientStartInput = this.shadowRoot.querySelector('.child-gradient-start-input');
    const childGradientEndInput = this.shadowRoot.querySelector('.child-gradient-end-input');
    const childTextColorInput = this.shadowRoot.querySelector('.child-text-color-input');
    const buttonHoverInput = this.shadowRoot.querySelector('.button-hover-input');
    const progressBarInput = this.shadowRoot.querySelector('.progress-bar-input');
    const pointsBadgeInput = this.shadowRoot.querySelector('.points-badge-input');
    const iconColorInput = this.shadowRoot.querySelector('.icon-color-input');

    if (tabColorInput) {
      tabColorInput.addEventListener('change', (e) => {
        this._config.tab_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (headerColorInput) {
      headerColorInput.addEventListener('change', (e) => {
        this._config.header_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (tabTextColorInput) {
      tabTextColorInput.addEventListener('change', (e) => {
        this._config.tab_text_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (dashboardPrimaryInput) {
      dashboardPrimaryInput.addEventListener('change', (e) => {
        this._config.dashboard_primary_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (dashboardSecondaryInput) {
      dashboardSecondaryInput.addEventListener('change', (e) => {
        this._config.dashboard_secondary_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (childGradientStartInput) {
      childGradientStartInput.addEventListener('change', (e) => {
        this._config.child_gradient_start = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (childGradientEndInput) {
      childGradientEndInput.addEventListener('change', (e) => {
        this._config.child_gradient_end = e.target.value;
        this._fireConfigChanged();
      });
    }


    if (childTextColorInput) {
      childTextColorInput.addEventListener('change', (e) => {
        this._config.child_text_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (buttonHoverInput) {
      buttonHoverInput.addEventListener('change', (e) => {
        this._config.button_hover_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (progressBarInput) {
      progressBarInput.addEventListener('change', (e) => {
        this._config.progress_bar_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (pointsBadgeInput) {
      pointsBadgeInput.addEventListener('change', (e) => {
        this._config.points_badge_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (iconColorInput) {
      iconColorInput.addEventListener('change', (e) => {
        this._config.icon_color = e.target.value;
        this._fireConfigChanged();
      });
    }
  }

  _syncSpecificInputValues() {
    const defaults = this.getDefaultColors();


    const colorInputs = [
      { input: '.tab-color-input', config: 'tab_color', default: defaults.tab_color },
      { input: '.header-color-input', config: 'header_color', default: defaults.header_color },
      { input: '.tab-text-color-input', config: 'tab_text_color', default: defaults.tab_text_color },
      { input: '.dashboard-primary-input', config: 'dashboard_primary_color', default: defaults.dashboard_primary_color },
      { input: '.dashboard-secondary-input', config: 'dashboard_secondary_color', default: defaults.dashboard_secondary_color },
      { input: '.child-gradient-start-input', config: 'child_gradient_start', default: defaults.child_gradient_start },
      { input: '.child-gradient-end-input', config: 'child_gradient_end', default: defaults.child_gradient_end },
      { input: '.child-text-color-input', config: 'child_text_color', default: defaults.child_text_color },
      { input: '.button-hover-input', config: 'button_hover_color', default: defaults.button_hover_color },
      { input: '.progress-bar-input', config: 'progress_bar_color', default: defaults.progress_bar_color },
      { input: '.points-badge-input', config: 'points_badge_color', default: defaults.points_badge_color },
      { input: '.icon-color-input', config: 'icon_color', default: defaults.icon_color }
    ];

    colorInputs.forEach(({ input, config, default: defaultValue }) => {
      const element = this.shadowRoot.querySelector(input);
      if (element) {
        const value = this._config[config] || defaultValue;
        element.value = value;
      }
    });
  }
}

class KidsTasksManagerEditor extends KidsTasksBaseCardEditor {
  _renderSpecificOptions() {
    return `
      <div class="section-title">Personnalisation des couleurs</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Onglet actif</label>
          <input
            type="color"
            class="tab-color-input"
            value="${this._config.tab_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur des onglets</label>
          <input
            type="color"
            class="header-color-input"
            value="${this._config.header_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur du texte des onglets</label>
          <input
            type="color"
            class="tab-text-color-input"
            value="${this._config.tab_text_color || '#ffffff'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur primaire</label>
          <input
            type="color"
            class="dashboard-primary-input"
            value="${this._config.dashboard_primary_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur des boutons au survol</label>
          <input
            type="color"
            class="button-hover-input"
            value="${this._config.button_hover_color || '#1565C0'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur de la barre de progression</label>
          <input
            type="color"
            class="progress-bar-input"
            value="${this._config.progress_bar_color || '#4caf50'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur des badges de points</label>
          <input
            type="color"
            class="points-badge-input"
            value="${this._config.points_badge_color || '#ff9800'}"
          >
        </div>
      </div>

      <div class="help-text">
        Cette carte permet de gérer les tâches, récompenses et cosmétiques.
        Elle est destinée aux administrateurs du système Kids Tasks.
      </div>
    `;
  }

  _attachSpecificListeners() {
    const tabColorInput = this.shadowRoot.querySelector('.tab-color-input');
    const headerColorInput = this.shadowRoot.querySelector('.header-color-input');
    const tabTextColorInput = this.shadowRoot.querySelector('.tab-text-color-input');
    const dashboardPrimaryInput = this.shadowRoot.querySelector('.dashboard-primary-input');
    const buttonHoverInput = this.shadowRoot.querySelector('.button-hover-input');
    const progressBarInput = this.shadowRoot.querySelector('.progress-bar-input');
    const pointsBadgeInput = this.shadowRoot.querySelector('.points-badge-input');

    if (tabColorInput) {
      tabColorInput.addEventListener('change', (e) => {
        this._config.tab_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (headerColorInput) {
      headerColorInput.addEventListener('change', (e) => {
        this._config.header_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (tabTextColorInput) {
      tabTextColorInput.addEventListener('change', (e) => {
        this._config.tab_text_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (dashboardPrimaryInput) {
      dashboardPrimaryInput.addEventListener('change', (e) => {
        this._config.dashboard_primary_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (buttonHoverInput) {
      buttonHoverInput.addEventListener('change', (e) => {
        this._config.button_hover_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (progressBarInput) {
      progressBarInput.addEventListener('change', (e) => {
        this._config.progress_bar_color = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (pointsBadgeInput) {
      pointsBadgeInput.addEventListener('change', (e) => {
        this._config.points_badge_color = e.target.value;
        this._fireConfigChanged();
      });
    }
  }
}

class KidsTasksChildCardEditor extends KidsTasksBaseCardEditor {
  _renderSpecificOptions() {
    const children = this._getChildren();

    return `
      <div class="section-title">Configuration de l'enfant</div>
      <div class="option">
        <label>Sélectionner un enfant</label>
        <select id="child_select" required>
          <option value="">Sélectionner un enfant...</option>
            ${children.map(child => `
              <option value="${child.child_id}" ${this._config.child_id === child.chil_id ? 'selected' : ''}>
                ${child.name}
              </option>
            `).join('')}
            </select>
        <div class="help-text">
          Si aucun enfant n'apparaît, assurez-vous que l'intégration Kids Tasks Manager est configurée.
        </div>
      </div>
      
      <div class="section-title">Options d'affichage</div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-avatar-toggle"
            ${this._config.show_avatar !== false ? 'checked' : ''}
          >
          Afficher l'avatar et les informations
        </label>
      </div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-progress-toggle"
            ${this._config.show_progress !== false ? 'checked' : ''}
          >
          Afficher les barres de progression
        </label>
      </div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-rewards-toggle"
            ${this._config.show_rewards !== false ? 'checked' : ''}
          >
          Afficher l'onglet récompenses
        </label>
      </div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-completed-toggle"
            ${this._config.show_completed !== false ? 'checked' : ''}
          >
          Afficher l'onglet historique
        </label>
      </div>
    `;
  }

  _attachSpecificListeners() {
    const childSelect = this.shadowRoot.querySelector('.child-select');
    const avatarToggle = this.shadowRoot.querySelector('.show-avatar-toggle');
    const progressToggle = this.shadowRoot.querySelector('.show-progress-toggle');
    const rewardsToggle = this.shadowRoot.querySelector('.show-rewards-toggle');
    const completedToggle = this.shadowRoot.querySelector('.show-completed-toggle');

    if (childSelect) {
      childSelect.addEventListener('change', (e) => {
        this._config.child_id = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (avatarToggle) {
      avatarToggle.addEventListener('change', (e) => {
        this._config.show_avatar = e.target.checked;
        this._fireConfigChanged();
      });
    }

    if (progressToggle) {
      progressToggle.addEventListener('change', (e) => {
        this._config.show_progress = e.target.checked;
        this._fireConfigChanged();
      });
    }

    if (rewardsToggle) {
      rewardsToggle.addEventListener('change', (e) => {
        this._config.show_rewards = e.target.checked;
        this._fireConfigChanged();
      });
    }

    if (completedToggle) {
      completedToggle.addEventListener('change', (e) => {
        this._config.show_completed = e.target.checked;
        this._fireConfigChanged();
      });
    }
  }

  _getChildren() {
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
}

class KidsTasksErrorBoundary {
  constructor() {
    this.errors = new Map();
    this.retryAttempts = new Map();
    this.setupGlobalErrorHandling();
  }


  setupGlobalErrorHandling() {

    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, event.filename, event.lineno);
    });


    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason, 'Promise', 0);
      event.preventDefault();
    });
  }


  handleGlobalError(error, source = 'Unknown', line = 0) {

    if (source && !source.includes('kids-tasks') && !source.includes('KidsTask')) {
      return;
    }

    logger.error(`Global error caught: ${error.message || error}`, {
      source,
      line,
      stack: error.stack
    });


    this.attemptRecovery(error);
  }


  wrapComponent(component, methodName) {
    const originalMethod = component[methodName];
    if (!originalMethod) return;

    `${component.constructor.name}.${methodName}`;

    component[methodName] = (...args) => {
      try {
        return originalMethod.apply(component, args);
      } catch (error) {
        return this.handleComponentError(component, methodName, error, args);
      }
    };
  }


  handleComponentError(component, methodName, error, args = []) {
    const componentKey = `${component.constructor.name}.${methodName}`;
    const errorKey = `${componentKey}:${error.message}`;


    const errorCount = (this.errors.get(errorKey) || 0) + 1;
    this.errors.set(errorKey, errorCount);

    logger.error(`Component error in ${componentKey}:`, error);


    return this.recoverFromError(component, methodName, error, errorCount);
  }


  recoverFromError(component, methodName, error, errorCount) {
    const componentKey = component.constructor.name;


    if (errorCount <= 3 && methodName !== 'render') {
      const delay = Math.pow(2, errorCount) * 100;
      setTimeout(() => {
        try {
          logger.debug(`Retrying ${componentKey}.${methodName} (attempt ${errorCount})`);
          component[methodName]?.();
        } catch (retryError) {
          logger.warn(`Retry failed for ${componentKey}.${methodName}:`, retryError);
        }
      }, delay);
      return null;
    }


    if (methodName === 'render' || methodName === 'smartRender') {
      return this.renderErrorFallback(component, error);
    }


    if (errorCount > 5) {
      this.enterSafeMode(component, error);
      return null;
    }


    if (methodName.includes('set') || methodName.includes('update')) {
      return this.resetComponentState(component, error);
    }

    return null;
  }


  renderErrorFallback(component, error) {
    if (!component.shadowRoot) return;

    const errorId = Date.now().toString(36);
    const isRetryable = !error.message.includes('fatal');

    component.shadowRoot.innerHTML = `
      <div class="kt-error-boundary" data-error-id="${errorId}">
        <style>
          .kt-error-boundary {
            padding: var(--kt-space-lg, 16px);
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fca5a5;
            border-radius: var(--kt-radius-md, 8px);
            color: var(--kt-error, #dc2626);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .kt-error-title {
            font-size: 1.1em;
            font-weight: 600;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .kt-error-message {
            font-size: 0.9em;
            margin: 0 0 16px 0;
            opacity: 0.8;
            line-height: 1.4;
          }
          .kt-error-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .kt-error-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s;
          }
          .kt-error-btn--retry {
            background: var(--kt-primary, #2563eb);
            color: white;
          }
          .kt-error-btn--retry:hover {
            background: var(--kt-primary-dark, #1d4ed8);
          }
          .kt-error-btn--reset {
            background: var(--kt-surface-variant, #f3f4f6);
            color: var(--kt-text, #374151);
          }
          .kt-error-btn--reset:hover {
            background: var(--kt-surface-hover, #e5e7eb);
          }
          .kt-error-details {
            margin-top: 12px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.8em;
            display: none;
          }
          .kt-error-toggle {
            color: var(--kt-primary, #2563eb);
            text-decoration: underline;
            cursor: pointer;
            font-size: 0.8em;
          }
          @media (max-width: 480px) {
            .kt-error-boundary {
              padding: 12px;
            }
            .kt-error-actions {
              flex-direction: column;
            }
            .kt-error-btn {
              width: 100%;
              text-align: center;
            }
          }
        </style>
        
        <div class="kt-error-title">
          ⚠️ Oops! Something went wrong
        </div>
        
        <div class="kt-error-message">
          We encountered an issue loading this card. This is usually temporary.
        </div>
        
        <div class="kt-error-actions">
          ${isRetryable ? `
            <ha-button class="kt-error-btn kt-error-btn--retry" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('retry'))">
              🔄 Try Again
            </ha-button>
          ` : ''}
          <ha-button class="kt-error-btn kt-error-btn--reset" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('reset'))">
            🔧 Reset Card
          </ha-button>
          <span class="kt-error-toggle" onclick="
            const details = this.parentNode.parentNode.querySelector('.kt-error-details');
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            this.textContent = details.style.display === 'block' ? 'Hide details' : 'Show details';
          ">Show details</span>
        </div>
        
        <div class="kt-error-details">
          <strong>Component:</strong> ${component.constructor.name}<br>
          <strong>Error:</strong> ${error.message}<br>
          <strong>Time:</strong> ${new Date().toLocaleString()}
        </div>
      </div>
    `;


    const errorBoundary = component.shadowRoot.querySelector('.kt-error-boundary');

    errorBoundary.addEventListener('retry', () => {
      logger.debug('User requested retry for', component.constructor.name);
      component.smartRender?.(true) || component.render?.();
    });

    errorBoundary.addEventListener('reset', () => {
      logger.debug('User requested reset for', component.constructor.name);
      this.resetComponentState(component, error);
    });

    return errorBoundary;
  }


  resetComponentState(component, error) {
    try {

      if (component._lastRenderState) component._lastRenderState = null;
      if (component._refreshTimeout) {
        clearTimeout(component._refreshTimeout);
        component._refreshTimeout = null;
      }


      if (component.setConfig && component.constructor.getStubConfig) {
        const defaultConfig = component.constructor.getStubConfig();
        component.setConfig(defaultConfig);
      }

      logger.info(`Reset component state for ${component.constructor.name}`);


      setTimeout(() => {
        component.smartRender?.(true) || component.render?.();
      }, 100);

    } catch (resetError) {
      logger.error('Failed to reset component state:', resetError);
      this.enterSafeMode(component, resetError);
    }
  }


  enterSafeMode(component, error) {
    logger.warn(`Entering safe mode for ${component.constructor.name}`);

    if (component.shadowRoot) {
      component.shadowRoot.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #666;">
          <div style="font-size: 2em; margin-bottom: 8px;">🛡️</div>
          <div style="font-weight: bold; margin-bottom: 4px;">Safe Mode</div>
          <div style="font-size: 0.9em;">This card is experiencing issues and has been disabled for stability.</div>
        </div>
      `;
    }
  }


  attemptRecovery(error) {

    const cards = document.querySelectorAll('kids-tasks-card, kids-tasks-child-card');

    cards.forEach(card => {
      if (card.shadowRoot && card.shadowRoot.innerHTML.includes('kt-error-boundary')) {

        setTimeout(() => {
          if (card.smartRender) {
            card.smartRender(true);
          }
        }, 2000);
      }
    });
  }


  getErrorStats() {
    const stats = {
      totalErrors: 0,
      errorsByComponent: {},
      recentErrors: []
    };

    for (const [errorKey, count] of this.errors.entries()) {
      const [component] = errorKey.split('.');
      stats.totalErrors += count;
      stats.errorsByComponent[component] = (stats.errorsByComponent[component] || 0) + count;
    }

    return stats;
  }


  clearErrors() {
    this.errors.clear();
    this.retryAttempts.clear();
    logger.info('Error history cleared');
  }
}


const errorBoundary = new KidsTasksErrorBoundary();


function withErrorBoundary(component) {
  const methodsToWrap = ['render', 'setConfig', 'set hass', 'handleAction', 'connectedCallback'];

  methodsToWrap.forEach(method => {
    errorBoundary.wrapComponent(component, method);
  });

  return component;
}

class KidsTasksAccessibility {
  constructor() {
    this.focusableElements = [];
    this.announcements = [];
    this.keyboardNavigation = new Map();
    this.setupGlobalAccessibility();
  }


  setupGlobalAccessibility() {

    this.createAnnouncementRegion();


    this.setupGlobalKeyboardHandling();


    this.observeCardElements();
  }


  createAnnouncementRegion() {
    if (document.getElementById('kt-announcements')) return;

    const announceRegion = document.createElement('div');
    announceRegion.id = 'kt-announcements';
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    document.body.appendChild(announceRegion);
  }


  announce(message, priority = 'polite') {
    const region = document.getElementById('kt-announcements');
    if (!region) return;


    region.setAttribute('aria-live', priority);


    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
      logger.debug(`Accessibility announcement: ${message}`);
    }, 100);


    this.announcements.push({
      message,
      priority,
      timestamp: Date.now()
    });


    if (this.announcements.length > 10) {
      this.announcements.shift();
    }
  }


  setupGlobalKeyboardHandling() {
    document.addEventListener('keydown', (event) => {
      this.handleGlobalKeyboard(event);
    });
  }


  handleGlobalKeyboard(event) {
    const activeCard = event.target.closest('kids-tasks-card, kids-tasks-child-card');
    if (!activeCard) return;


    if (event.key === 'F1') {
      event.preventDefault();
      this.showKeyboardHelp(activeCard);
      return;
    }


    if (event.key === 'Escape') {
      this.handleEscape(activeCard);
      return;
    }


    if (event.key === 'Tab') {
      this.handleTabNavigation(event, activeCard);
      return;
    }
  }


  showKeyboardHelp(card) {
    const helpModal = this.createHelpModal();
    card.shadowRoot.appendChild(helpModal);


    const firstButton = helpModal.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }

    this.announce('Keyboard shortcuts help opened', 'assertive');
  }


  createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'kt-help-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'help-title');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="kt-help-overlay" onclick="this.closest('.kt-help-modal').remove()"></div>
      <div class="kt-help-content">
        <h2 id="help-title">Keyboard Shortcuts</h2>
        <div class="kt-help-shortcuts">
          <div class="kt-shortcut">
            <kbd>Tab</kbd>
            <span>Navigate between interactive elements</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Space</kbd> / <kbd>Enter</kbd>
            <span>Activate buttons and links</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Arrow Keys</kbd>
            <span>Navigate within lists and tabs</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Escape</kbd>
            <span>Close modal or cancel action</span>
          </div>
          <div class="kt-shortcut">
            <kbd>F1</kbd>
            <span>Show this help</span>
          </div>
        </div>
        <div class="kt-help-actions">
          <ha-button class="kt-btn kt-btn--primary" onclick="this.closest('.kt-help-modal').remove()">
            Close Help
          </ha-button>
        </div>
      </div>
      <style>
        .kt-help-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kt-help-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .kt-help-content {
          position: relative;
          background: white;
          border-radius: 8px;
          padding: 24px;
          max-width: 1024px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .kt-help-content h2 {
          margin: 0 0 16px 0;
          font-size: 1.25em;
          color: var(--kt-text, #1f2937);
        }
        .kt-help-shortcuts {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .kt-shortcut {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        .kt-shortcut kbd {
          background: var(--kt-surface-variant, #f3f4f6);
          border: 1px solid var(--kt-border, #d1d5db);
          border-radius: 4px;
          padding: 4px 8px;
          font-family: monospace;
          font-size: 0.9em;
          min-width: 80px;
          text-align: center;
        }
        .kt-shortcut span {
          color: var(--kt-text-secondary, #6b7280);
          flex: 1;
        }
        .kt-help-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      </style>
    `;

    return modal;
  }


  handleEscape(card) {

    const modals = card.shadowRoot.querySelectorAll('.kt-help-modal, .kt-modal');
    if (modals.length > 0) {
      modals[modals.length - 1].remove();
      this.announce('Modal closed');
      return;
    }


    const confirmations = card.shadowRoot.querySelectorAll('.kt-delete-confirmation');
    confirmations.forEach(conf => conf.remove());

    if (confirmations.length > 0) {
      this.announce('Action cancelled');
    }
  }


  handleTabNavigation(event, card) {
    const focusableElements = this.getFocusableElements(card.shadowRoot);
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(document.activeElement);

    if (event.shiftKey) {

      if (currentIndex === 0) {
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {

      if (currentIndex === focusableElements.length - 1) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    }
  }


  getFocusableElements(container) {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(container.querySelectorAll(selectors.join(', ')))
      .filter(el => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
  }


  observeCardElements() {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const cards = node.matches('kids-tasks-card, kids-tasks-child-card')
              ? [node]
              : Array.from(node.querySelectorAll('kids-tasks-card, kids-tasks-child-card'));

            cards.forEach(card => this.enhanceCardAccessibility(card));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }


  enhanceCardAccessibility(card) {
    if (!card.shadowRoot) return;


    this.addAriaLabels(card);


    this.setupCardKeyboardNavigation(card);


    this.setupFocusManagement(card);

    logger.debug('Enhanced accessibility for', card.constructor.name);
  }


  addAriaLabels(card) {
    const shadowRoot = card.shadowRoot;


    const cardContent = shadowRoot.querySelector('.card-content');
    if (cardContent && !cardContent.getAttribute('role')) {
      cardContent.setAttribute('role', 'region');
      cardContent.setAttribute('aria-label', card.config?.title || 'Kids Tasks Card');
    }


    const tabs = shadowRoot.querySelectorAll('.nav-button');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    });


    const items = shadowRoot.querySelectorAll('.task-item, .reward-item, .child-card');
    items.forEach(item => {
      if (!item.getAttribute('role')) {
        item.setAttribute('role', 'article');
      }


      const title = item.querySelector('.task-title, .reward-name, .child-name');
      if (title && !item.getAttribute('aria-label')) {
        item.setAttribute('aria-label', title.textContent);
      }
    });


    const progressBars = shadowRoot.querySelectorAll('.progress-fill');
    progressBars.forEach(progress => {
      const progressValue = progress.style.width || '0%';
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuenow', parseInt(progressValue));
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      progress.setAttribute('aria-label', `Progress: ${progressValue}`);
    });
  }


  setupCardKeyboardNavigation(card) {
    const shadowRoot = card.shadowRoot;


    const tabs = shadowRoot.querySelectorAll('.nav-button[role="tab"]');
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (event) => {
        let newIndex;

        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            newIndex = index > 0 ? index - 1 : tabs.length - 1;
            this.focusTab(tabs[newIndex]);
            break;
          case 'ArrowRight':
            event.preventDefault();
            newIndex = index < tabs.length - 1 ? index + 1 : 0;
            this.focusTab(tabs[newIndex]);
            break;
          case 'Home':
            event.preventDefault();
            this.focusTab(tabs[0]);
            break;
          case 'End':
            event.preventDefault();
            this.focusTab(tabs[tabs.length - 1]);
            break;
        }
      });
    });
  }


  focusTab(tab) {

    const allTabs = tab.parentNode.querySelectorAll('[role="tab"]');
    allTabs.forEach(t => t.setAttribute('tabindex', '-1'));
    tab.setAttribute('tabindex', '0');


    tab.focus();
    this.announce(`${tab.textContent} tab selected`);
  }


  setupFocusManagement(card) {
    const shadowRoot = card.shadowRoot;


    shadowRoot.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target && target.tagName === 'BUTTON') {

        const action = target.dataset.action;
        const actionText = this.getActionAnnouncement(action, target);
        if (actionText) {
          this.announce(actionText);
        }
      }
    });


    this.addSkipLinks(card);
  }


  addSkipLinks(card) {
    const shadowRoot = card.shadowRoot;
    const cardContent = shadowRoot.querySelector('.card-content');
    if (!cardContent) return;

    const skipLink = document.createElement('a');
    skipLink.textContent = 'Skip to main content';
    skipLink.href = '#';
    skipLink.className = 'kt-skip-link';
    skipLink.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: 6px;
        top: 6px;
        width: auto;
        height: auto;
        overflow: visible;
        z-index: 1000;
        padding: 8px 12px;
        background: var(--kt-primary, #2563eb);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
      `;
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
    });

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const mainContent = shadowRoot.querySelector('.main-content');
      if (mainContent) {
        mainContent.focus();
        this.announce('Skipped to main content');
      }
    });

    cardContent.insertBefore(skipLink, cardContent.firstChild);
  }


  getActionAnnouncement(action, element) {
    const actionMap = {
      'complete-task': 'Task completed',
      'uncomplete-task': 'Task marked as incomplete',
      'claim-reward': 'Reward claimed',
      'validate-task': 'Task validated',
      'delete-task': 'Task deleted',
      'filter': `Filter applied: ${element.textContent}`,
      'switch-tab': `Switched to ${element.textContent} tab`,
      'view-child': `Viewing ${element.dataset.id} details`
    };

    return actionMap[action] || null;
  }


  announceToUser(message, priority = 'polite') {
    this.announce(message, priority);
  }

  enhanceCard(card) {
    this.enhanceCardAccessibility(card);
  }
}


const accessibility = new KidsTasksAccessibility();

{
  logger.info('🛠️ Kids Tasks Card - Development Mode');
  logger.info('📦 Loading modular components...');
}


KidsTasksStyleManager$1.injectGlobalStyles();


window.KidsTasksUtils = KidsTasksUtils;
window.KidsTasksStyleManager = KidsTasksStyleManager$1;


const cardSuffix = '-dev' ;
window.KidsTasksCardSuffix = cardSuffix;
const mainCardType = `kids-tasks-card${cardSuffix}`;
const childCardType = `kids-tasks-child-card${cardSuffix}`;
const managerCardType = `kids-tasks-manager${cardSuffix}`;

customElements.define(mainCardType, withErrorBoundary(KidsTasksCard));
customElements.define(childCardType, withErrorBoundary(KidsTasksChildCard));
customElements.define(managerCardType, withErrorBoundary(KidsTasksManagerCard));
customElements.define(`kids-tasks-card-editor${cardSuffix}`, KidsTasksCardEditor);
customElements.define(`kids-tasks-child-card-editor${cardSuffix}`, KidsTasksChildCardEditor);
customElements.define(`kids-tasks-manager-editor${cardSuffix}`, KidsTasksManagerEditor);


window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: mainCardType,
    name: `Kids Tasks Card${' (Dev)' }`,
    description: 'Manage children\'s tasks and rewards with an engaging interface',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  },
  {
    type: childCardType,
    name: `Kids Tasks Child Card${' (Dev)' }`,
    description: 'Individual child view for tasks and rewards',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  },
  {
    type: managerCardType,
    name: `Kids Tasks Manager${' (Dev)' }`,
    description: 'Administration interface for managing tasks, rewards and cosmetics',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  }
);


if (typeof window !== 'undefined') {

  window.addEventListener('beforeunload', () => {
    logger.debug('🔄 Kids Tasks Card - Hot reload triggered');
  });


  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let reloadCheckInterval;
    let lastModified = Date.now();


    const checkForUpdates = async () => {
      try {
        const response = await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-cache'
        });

        const newLastModified = response.headers.get('last-modified');
        if (newLastModified && newLastModified !== lastModified) {
          logger.debug('🔄 Hot reload: File changed, reloading...');
          window.location.reload();
        }
      } catch (error) {

      }
    };


    setTimeout(() => {
      reloadCheckInterval = setInterval(checkForUpdates, 2000);
    }, 5000);


    window.addEventListener('beforeunload', () => {
      if (reloadCheckInterval) {
        clearInterval(reloadCheckInterval);
      }
    });
  }


  if (typeof EventSource !== 'undefined') {
    try {
      const eventSource = new EventSource('http://localhost:35729/livereload');
      eventSource.onmessage = function(event) {
        if (event.data === 'reload') {
          logger.debug('🔄 Live reload triggered');
          window.location.reload();
        }
      };

      eventSource.onerror = function() {

        eventSource.close();
      };
    } catch (error) {

    }
  }


  window.KidsTasksCard = KidsTasksCard;
  window.KidsTasksChildCard = KidsTasksChildCard;
  window.KidsTasksManagerCard = KidsTasksManagerCard;
  window.KidsTasksBaseCard = KidsTasksBaseCard;


  window.KidsTasksDebug = {
    reloadCard: (cardElement) => {
      if (cardElement && cardElement.setConfig && cardElement.hass) {
        cardElement.setConfig(cardElement.config);
        cardElement.hass = cardElement.hass;
        logger.debug('🔄 Card reloaded manually');
      }
    },

    reloadAllCards: () => {
      const selector = 'kids-tasks-card-dev, kids-tasks-child-card-dev, kids-tasks-manager-dev' ;
      document.querySelectorAll(selector).forEach(card => {
        window.KidsTasksDebug.reloadCard(card);
      });
      logger.debug('🔄 All cards reloaded');
    },

    inspectCard: (cardElement) => {
      logger.debug('🔍 Card inspection:', {
        element: cardElement,
        config: cardElement.config,
        hass: cardElement._hass,
        children: cardElement.getChildren?.()
      });
    },


    performance: {
      report: () => performanceMonitor$1?.generateReport(),
      toggle: () => performanceMonitor$1?.toggle(),
      clear: () => performanceMonitor$1?.destroy()
    },


    errors: {
      stats: () => errorBoundary.getErrorStats(),
      clear: () => errorBoundary.clearErrors()
    },


    accessibility: {
      enhance: (card) => accessibility.enhanceCard(card),
      announce: (message) => accessibility.announceToUser(message)
    },


    systemInfo: () => {
      const selector = 'kids-tasks-card-dev, kids-tasks-child-card-dev, kids-tasks-manager-dev' ;
      return {
        cards: document.querySelectorAll(selector).length,
        performance: performanceMonitor$1?.generateReport()?.summary,
        errors: errorBoundary.getErrorStats(),
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
        } : null
      };
    }
  };

  logger.info('🛠️ Development utilities available as window.KidsTasksDebug');
}


const version = "2.0.0";

logger.info(`Kids Tasks Card v${version} loaded successfully!`);

{
  logger.info('🎯 Mode: Development with hot reload');
  logger.info('🏗️ Architecture: Modular ES6 components');
  logger.info('⚡ Performance: Optimized rendering pipeline');
  logger.info('🎨 Styles: Consolidated CSS variables');
}

export { KidsTasksBaseCard, KidsTasksCard, KidsTasksChildCard, KidsTasksManagerCard, KidsTasksStyleManager$1 as KidsTasksStyleManager, KidsTasksUtils };
//# sourceMappingURL=kids-tasks-card.dev.js.map
