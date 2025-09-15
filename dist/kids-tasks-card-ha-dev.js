/* Kids Tasks Card v2.0.0 - Development Build */
class KidsTasksStyleManagerV2 {
  static instance = null;
  static injected = false;
  static currentVersion = 'v2.0.0-optimized';

  static getInstance() {
    if (!this.instance) {
      this.instance = new KidsTasksStyleManagerV2();
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

  static getOptimizedGlobalStyles() {
    return `
      /* === KIDS TASKS V2.0 - OPTIMIZED CSS VARIABLES === */
      :root {
        /* === CORE COLORS (6 variables) === */
        --kt-primary: var(--primary-color, #3f51b5);
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
        background: var(--kt-surface-primary);
        border-radius: var(--kt-radius-lg);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
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
    `;
  }

  static getInteractionStyles() {
    return `
      /* Clickable Elements */
      .kt-clickable {
        cursor: pointer;
        transition: all var(--kt-transition-fast);
      }
      
      .kt-clickable:hover {
        background: var(--kt-button-hover);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
      }
      
      .kt-clickable:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px var(--kt-shadow-light);
      }
      
      /* Loading States */
      .kt-loading {
        text-align: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color);
      }
      
      /* Error States */
      .kt-error {
        background: var(--kt-error);
        color: white;
        padding: var(--kt-space-md);
        border-radius: var(--kt-radius-md);
        text-align: center;
      }
      
      /* Focus States */
      .kt-focusable:focus {
        outline: 2px solid var(--kt-primary);
        outline-offset: 2px;
      }
      
      /* Animation States */
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
      
      /* Tablet */
      @media (min-width: 481px) and (max-width: 768px) {
        .kt-grid-auto {
          grid-template-columns: repeat(2, 1fr);
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
}


window.KidsTasksStyleManagerV2 = KidsTasksStyleManagerV2;

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


let performanceMonitor$1;


if (typeof window !== 'undefined') {
  performanceMonitor$1 = new KidsTasksPerformanceMonitor();
  window.KidsTasksPerformanceMonitor = performanceMonitor$1;


  {
    window.ktPerf = {
      report: () => performanceMonitor$1.generateReport(),
      toggle: () => performanceMonitor$1.toggle(),
      clear: () => performanceMonitor$1.destroy()
    };

    console.info('🛠️ Performance tools available: window.ktPerf');
  }
}
var performanceMonitor$2 = performanceMonitor$1;

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


    if (performanceMonitor$2) {
      performanceMonitor$2.trackEventHandler('constructor', this.constructor.name, 'add');
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


      if (performanceMonitor$2) {
        const endTime = performance.now();
        performanceMonitor$2.trackRender(this.constructor.name, startTime, endTime);
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
          <button onclick="this.closest('kids-tasks-card, kids-tasks-child-card').smartRender(true)" 
                  style="margin-top: 8px; padding: 4px 8px; background: #c33; color: white; border: none; border-radius: 2px; cursor: pointer;">
            Retry
          </button>
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
      if (performanceMonitor$2) {
        performanceMonitor$2.trackEventHandler('touch', this.constructor.name, 'remove');
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


    if (performanceMonitor$2) {
      performanceMonitor$2.trackEventHandler('disconnect', this.constructor.name, 'remove');
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

    if (performanceMonitor$2) {
      performanceMonitor$2.trackEventHandler('delegation', this.constructor.name, 'add');
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
      if (!longPressItem || longPressItem.querySelector('.kt-delete-confirmation:not(.hidden)')) {
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
      confirmation.classList.remove('hidden');

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
      confirmation.classList.add('hidden');
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
    const openConfirmations = this.shadowRoot.querySelectorAll('.kt-delete-confirmation:not(.hidden)');

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


  renderGauges(stats, includeCoins = false, completedToday, totalTasksToday) {
    if (!stats) return '';

    const completed = completedToday !== undefined ? completedToday : (stats.completedToday || 0);
    const total = totalTasksToday !== undefined ? totalTasksToday : (stats.totalTasksToday || 0);

    const renderGauge = (label, text, fillClass, width) => {
      return `
        <div class="gauge">
          <div class="gauge-header">
            <span class="gauge-label">${label}</span>
            <span class="gauge-value">${text}</span>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill ${fillClass}" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    };

    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const progressGauge = renderGauge(
      'Tâches du jour',
      `${completed}/${total}`,
      'tasks-fill',
      progressPercent
    );

    if (!includeCoins) {
      return progressGauge;
    }

    const points = stats.points || 0;
    const coins = stats.coins || 0;

    const pointsGauge = renderGauge(
      'Points',
      `${points} 🎫`,
      'points-fill',
      Math.min(100, points)
    );

    const coinsGauge = renderGauge(
      'Pièces',
      `${coins} 🪙`,
      'coins-fill',
      Math.min(100, coins * 2)
    );

    return `
      <div class="gauges-container">
        ${progressGauge}
        ${pointsGauge}
        ${coinsGauge}
      </div>
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
    return [];
  }

  getTasks() {
    return [];
  }

  getRewards() {
    return [];
  }

  getDynamicIcons() {
    return {};
  }

  getRewardIcons() {
    return {};
  }
}

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
    return `<style>
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
          font-size: .9em;
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
          font-size: .9em;
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
          font-size: .9em;
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
            font-size: .8em;
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--kt-space-sm);
          }

          .card-header {
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
        }
      </style>`;
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


    if (performanceMonitor) {
      performanceMonitor.trackEventHandler('timers', this.constructor.name, 'remove');
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
      this.shadowRoot.innerHTML = '<div class="loading">Chargement...</div>';
      return;
    }

    const child = this.getChild();
    if (!child) {
      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="error">
          Enfant non trouvé (ID: ${this.config.child_id})
        </div>
      `;
      return;
    }

    try {
      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="child-card-container">
          ${this.renderHeader(child)}
          ${this.renderTabs()}
          ${this.renderTabContent(child)}
        </div>
      `;
    } catch (error) {
      console.error('Error rendering child card:', error);
      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="error">Erreur: ${error.message}</div>
      `;
    }
  }

  getStyles() {
    return `<style>
        :host {
          display: block;
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-lg);
          overflow: hidden;
          box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,.1));
        }

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

        .child-avatar {
          font-size: 4em;
          margin-bottom: var(--kt-space-sm);
        }

        .child-name {
          font-size: 1.5em;
          font-weight: 700;
          color: var(--primary-text-color);
          margin-bottom: var(--kt-space-sm);
        }

        .child-stats {
          display: flex;
          gap: var(--kt-space-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat {
          background: var(--kt-primary);
          color: white;
          padding: var(--kt-space-xs) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: .9em;
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
          opacity: .9;
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
          font-size: .9em;
          color: var(--secondary-text-color);
          margin-bottom: var(--kt-space-sm);
        }

        .task-meta, .reward-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: .8em;
        }

        .task-points, .reward-cost {
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
          font-size: .7em;
        }

        .task-status.todo { background: var(--kt-warning); color: white; }
        .task-status.completed { background: var(--kt-success); color: white; }
        .task-status.pending { background: var(--kt-info); color: white; }

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
          font-size: .85em;
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

        .empty-icon {
          font-size: 3em;
          margin-bottom: var(--kt-space-md);
          opacity: .6;
        }

        /* Progress gauges */
        .progress-section {
          margin-bottom: var(--kt-space-lg);
        }

        .gauge {
          margin-bottom: var(--kt-space-md);
        }

        .gauge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--kt-space-xs);
        }

        .gauge-label {
          font-weight: 600;
          color: var(--primary-text-color);
        }

        .gauge-value {
          font-weight: 700;
          color: var(--kt-primary);
        }

        .gauge-bar {
          height: 8px;
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-sm);
          overflow: hidden;
        }

        .gauge-fill {
          height: 100%;
          transition: width var(--kt-transition-medium);
          border-radius: var(--kt-radius-sm);
        }

        .gauge-fill.tasks-fill {
          background: linear-gradient(90deg, var(--kt-success) 0%, var(--kt-info) 100%);
        }

        .gauge-fill.points-fill {
          background: var(--kt-success);
        }

        .gauge-fill.coins-fill {
          background: var(--kt-coins-color);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .child-card-container {
            padding: var(--kt-space-md);
          }
          
          .tabs {
            flex-wrap: wrap;
          }
          
          .child-stats {
            justify-content: center;
          }
        }
      </style>`;
  }

  renderHeader(child) {
    if (!this.config.show_avatar) return '';

    const stats = this.getChildStats(child);

    return `
      <div class="child-header">
        <div class="child-avatar">${this.getAvatar(child)}</div>
        <div class="child-name">${child.name}</div>
        <div class="child-stats">
          <span class="stat">${child.points || 0} 🎫 Points</span>
          <span class="stat">${child.coins || 0} 🪙 Pièces</span>
          <span class="stat">Niveau ${child.level || 1}</span>
        </div>
        ${this.config.show_progress ? this.renderProgress(stats) : ''}
      </div>
    `;
  }

  renderProgress(stats) {
    return `
      <div class="progress-section">
        ${this.renderGauges(stats, true, stats.completedToday, stats.totalTasksToday)}
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
      <div class="tabs">
        ${tabs.map(tab => `
          <button 
            class="tab-button ${this.currentTab === tab.id ? 'active' : ''}"
            data-action="switch-tab"
            data-id="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
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
    const tasks = this.getChildTasks(child.id);
    const filteredTasks = this.filterTasks(tasks);

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
      { id: 'completed', label: 'Terminées' },
      { id: 'all', label: 'Toutes' }
    ];

    return `
      <div class="filters">
        ${filters.map(filter => `
          <button 
            class="filter-btn ${this.tasksFilter === filter.id ? 'active' : ''}"
            data-action="filter-tasks"
            data-filter="${filter.id}"
          >
            ${filter.label}
          </button>
        `).join('')}
      </div>
    `;
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
    return `
      <div class="tab-content">
        <div class="empty-state">
          <div class="empty-icon">📈</div>
          <div class="empty-text">Historique</div>
          <div class="empty-subtext">Fonctionnalité en développement</div>
        </div>
      </div>
    `;
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-tab':
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

  filterTasks(tasks) {
    switch (this.tasksFilter) {
      case 'active':
        return tasks.filter(t => t.status === 'todo' || t.status === 'pending');
      case 'completed':
        return tasks.filter(t => t.status === 'completed' || t.status === 'validated');
      default:
        return tasks;
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

  getChildFromHass(hass, childId) {
    const pointsEntityId = `sensor.kidtasks_${childId}_points`;
    const entity = hass.states[pointsEntityId];

    if (!entity) return null;

    return {
      id: childId,
      name: entity.attributes.friendly_name || childId,
      points: parseInt(entity.state) || 0,
      coins: entity.attributes.coins || 0,
      level: entity.attributes.level || 1,
      ...entity.attributes
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
      description: entity.attributes.description,
      status: entity.state,
      points: entity.attributes.points || 0,
      category: entity.attributes.category,
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
      min_level: entity.attributes.min_level || 1,
      category: entity.attributes.category,
      icon: entity.attributes.icon,
      ...entity.attributes
    }));
  }

  getChildStats(child) {
    const tasks = this.getChildTasks(child.id);
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

  getAvatar(child) {
    return child.avatar || child.cosmetics?.avatar?.emoji || '👤';
  }

  isToday(dateString) {
    if (!dateString) return false;
    const today = new Date().toDateString();
    return new Date(dateString).toDateString() === today;
  }


  static getConfigElement() {
    return document.createElement('kids-tasks-child-card-editor');
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

class KidsTasksBaseCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._rendered = false;
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...config };
    this._fireConfigChanged();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
  }

  _render() {
    this.innerHTML = `
      <div class="card-config">
        <div class="option">
          <label>Titre de la carte</label>
          <input 
            type="text" 
            class="title-input"
            value="${this._config.title || ''}"
            placeholder="Gestionnaire de Tâches Enfants"
          >
        </div>
        <div class="option">
          <label>
            <input 
              type="checkbox" 
              class="navigation-toggle"
              ${this._config.show_navigation !== false ? 'checked' : ''}
            >
            Afficher la navigation
          </label>
        </div>
        ${this._renderSpecificOptions()}
      </div>
      <style>
        .card-config {
          padding: 16px;
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        }
        
        .option {
          margin-bottom: 16px;
        }
        
        .option label {
          display: block;
          margin-bottom: 4px;
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
          font-size: 16px;
          font-weight: 600;
          margin: 24px 0 12px 0;
          color: var(--primary-text-color);
          border-bottom: 1px solid var(--divider-color);
          padding-bottom: 4px;
        }
      </style>
    `;

    this._attachListeners();
  }

  _renderSpecificOptions() {

    return '';
  }

  _attachListeners() {
    const titleInput = this.querySelector('.title-input');
    const navToggle = this.querySelector('.navigation-toggle');

    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this._config.title = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (navToggle) {
      navToggle.addEventListener('change', (e) => {
        this._config.show_navigation = e.target.checked;
        this._fireConfigChanged();
      });
    }

    this._attachSpecificListeners();
  }

  _attachSpecificListeners() {

  }

  _fireConfigChanged() {
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

class KidsTasksCardEditor extends KidsTasksBaseCardEditor {
  _renderSpecificOptions() {
    return `
      <div class="section-title">Options d'affichage</div>
      <div class="option">
        <label>Mode d'affichage</label>
        <select class="mode-select">
          <option value="dashboard" ${this._config.mode === 'dashboard' ? 'selected' : ''}>
            Tableau de bord
          </option>
          <option value="compact" ${this._config.mode === 'compact' ? 'selected' : ''}>
            Vue compacte
          </option>
        </select>
      </div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-completed-toggle"
            ${this._config.show_completed !== false ? 'checked' : ''}
          >
          Afficher les tâches terminées
        </label>
      </div>
      <div class="option">
        <label>
          <input 
            type="checkbox" 
            class="show-rewards-toggle"
            ${this._config.show_rewards !== false ? 'checked' : ''}
          >
          Afficher les récompenses
        </label>
      </div>
    `;
  }

  _attachSpecificListeners() {
    const modeSelect = this.querySelector('.mode-select');
    const completedToggle = this.querySelector('.show-completed-toggle');
    const rewardsToggle = this.querySelector('.show-rewards-toggle');

    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this._config.mode = e.target.value;
        this._fireConfigChanged();
      });
    }

    if (completedToggle) {
      completedToggle.addEventListener('change', (e) => {
        this._config.show_completed = e.target.checked;
        this._fireConfigChanged();
      });
    }

    if (rewardsToggle) {
      rewardsToggle.addEventListener('change', (e) => {
        this._config.show_rewards = e.target.checked;
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
        <select class="child-select" required>
          <option value="">-- Choisir un enfant --</option>
          ${children.map(child => `
            <option value="${child.id}" ${this._config.child_id === child.id ? 'selected' : ''}>
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
    const childSelect = this.querySelector('.child-select');
    const avatarToggle = this.querySelector('.show-avatar-toggle');
    const progressToggle = this.querySelector('.show-progress-toggle');
    const rewardsToggle = this.querySelector('.show-rewards-toggle');
    const completedToggle = this.querySelector('.show-completed-toggle');

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
    const entities = this._hass.states;

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && pointsEntity.state !== 'unavailable') {
          children.push({
            id: pointsEntity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', ''),
            name: pointsEntity.attributes.friendly_name || entityId.replace('sensor.kidtasks_', '').replace('_points', '')
          });
        }
      }
    });

    return children;
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
            <button class="kt-error-btn kt-error-btn--retry" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('retry'))">
              🔄 Try Again
            </button>
          ` : ''}
          <button class="kt-error-btn kt-error-btn--reset" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('reset'))">
            🔧 Reset Card
          </button>
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
          <button class="kt-btn kt-btn--primary" onclick="this.closest('.kt-help-modal').remove()">
            Close Help
          </button>
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
          max-width: 500px;
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


KidsTasksStyleManagerV2.injectGlobalStyles();


window.KidsTasksUtils = KidsTasksUtils;
window.KidsTasksStyleManager = KidsTasksStyleManagerV2;


const cardSuffix = '-dev' ;
customElements.define(`kids-tasks-card${cardSuffix}`, withErrorBoundary(KidsTasksCardOptimized));
customElements.define(`kids-tasks-child-card${cardSuffix}`, withErrorBoundary(KidsTasksChildCard));
customElements.define(`kids-tasks-card${cardSuffix}-editor`, KidsTasksCardEditor);
customElements.define(`kids-tasks-child-card${cardSuffix}-editor`, KidsTasksChildCardEditor);


window.customCards = window.customCards || [];
const devSuffix = ' (Dev)' ;
window.customCards.push(
  {
    type: `kids-tasks-card${cardSuffix}`,
    name: `Kids Tasks Card${devSuffix}`,
    description: 'Manage children\'s tasks and rewards with an engaging interface',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  },
  {
    type: `kids-tasks-child-card${cardSuffix}`,
    name: `Kids Tasks Child Card${devSuffix}`,
    description: 'Individual child view for tasks and rewards',
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


  window.KidsTasksCard = KidsTasksCardOptimized;
  window.KidsTasksChildCard = KidsTasksChildCard;
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
      document.querySelectorAll('kids-tasks-card, kids-tasks-child-card').forEach(card => {
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
      report: () => performanceMonitor$2?.generateReport(),
      toggle: () => performanceMonitor$2?.toggle(),
      clear: () => performanceMonitor$2?.destroy()
    },


    errors: {
      stats: () => errorBoundary.getErrorStats(),
      clear: () => errorBoundary.clearErrors()
    },


    accessibility: {
      enhance: (card) => accessibility.enhanceCard(card),
      announce: (message) => accessibility.announceToUser(message)
    },


    systemInfo: () => ({
      cards: document.querySelectorAll('kids-tasks-card, kids-tasks-child-card').length,
      performance: performanceMonitor$2?.generateReport()?.summary,
      errors: errorBoundary.getErrorStats(),
      memory: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
      } : null
    })
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

export { KidsTasksBaseCard, KidsTasksCardOptimized as KidsTasksCard, KidsTasksChildCard, KidsTasksStyleManagerV2 as KidsTasksStyleManager, KidsTasksUtils };
//# sourceMappingURL=kids-tasks-card-ha-dev.js.map
