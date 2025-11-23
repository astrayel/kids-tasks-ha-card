// Kids Tasks Style Manager v2.0 - Optimized CSS System
// Consolidated from 364+ variables to 56 essential variables based on usage analysis

class KidsTasksStyleManager {
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
    return 56; // Optimized to 56 essential variables
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
        color: var(--primary-text-color, #212121);
        font-size: 0.9em;
        margin-bottom: 2px;
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
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-complete {
        background: var(--kt-success);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: var(--kt-radius-sm);
        cursor: pointer;
        transition: all var(--kt-transition-fast);
        font-weight: 600;
        font-size: 1em;
      }

      .btn-complete:hover {
        background: #45a049;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px var(--kt-shadow-light);
      }

      .status {
        padding: 4px 8px;
        border-radius: var(--kt-radius-md);
        font-weight: 500;
        text-align: center;
        font-size: 0.8em;
      }

      .status.pending {
        background-color: #fff3e0;
        color: #f57c00;
        border: 1px solid #ffcc02;
      }

      .status.completed {
        background-color: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #4caf50;
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

      /* Task list and items styles */
      .task-list {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-sm);
      }

      .task-item {
        display: flex;
        flex-direction: row;
        background: var(--kt-surface-variant);
        border-radius: var(--kt-radius-md);
        padding: var(--kt-space-md);
        transition: all var(--kt-transition-fast);
        cursor: pointer;
      }

      .task-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
      }

      .task-title {
        font-weight: 600;
        margin-bottom: var(--kt-space-xs);
      }

      .task-description {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        margin-bottom: var(--kt-space-sm);
      }

      .task-meta {
        display: flex;
        gap: 8px;
        font-size: 0.75em;
        color: var(--secondary-text-color, #757575);
        flex-wrap: wrap;
      }

      .task-points {
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
    `;
  }

  static getRewardStyles() {
    return `
      /* Reward styles */
      .reward-list {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-sm);
      }

      .reward-item {
        background: var(--kt-surface-variant);
        border-radius: var(--kt-radius-md);
        padding: var(--kt-space-md);
        transition: all var(--kt-transition-fast);
        cursor: pointer;
      }

      .reward-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
      }

      .reward-title {
        font-weight: 600;
        margin-bottom: var(--kt-space-xs);
      }

      .reward-description {
        font-size: 0.9em;
        color: var(--secondary-text-color);
        margin-bottom: var(--kt-space-sm);
      }

      .reward-meta {
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
    `;
  }
  
  static getOptimizedGlobalStyles() {
    return `
      /* === KIDS TASKS V2.0 - OPTIMIZED CSS VARIABLES === */
      :root {
        /* === CORE COLORS (9 variables) === */
        --kt-primary: var(--primary-color, #3f51b5);
        --kt-primary-dark: var(--darker-primary-color, #303f9f);
        --kt-active: var(--darker-primary-color, #1e3462ff);
        --kt-secondary: var(--accent-color, #ff4081);
        --kt-success: #4caf50;
        --kt-warning: #ff9800;
        --kt-warning-light: #ffb74d;
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
        
        /* === BORDER RADIUS (5 variables) === */
        --kt-radius-sm: 8px;     /* Used 16 times */
        --kt-radius-md: 12px;    /* Used 11 times */
        --kt-radius-lg: 16px;    /* Used 4 times */
        --kt-radius-xl: 20px;    /* Large cards */
        --kt-radius-round: 50%;  /* Used 4 times */
        
        /* === TRANSITIONS (2 variables - performance optimized) === */
        --kt-transition-fast: 0.2s ease;    /* Used 12 times */
        --kt-transition-medium: 0.3s ease;  /* Used 4 times */
        
        /* === SHADOWS (2 variables) === */
        --kt-shadow-light: rgba(0, 0, 0, 0.1);  /* Used 7 times */
        --kt-shadow-medium: rgba(0, 0, 0, 0.2); /* Used 2 times */
        
        /* === SURFACES (5 variables) === */
        --kt-surface: var(--card-background-color, white);
        --kt-surface-primary: var(--card-background-color, white);
        --kt-surface-variant: var(--secondary-background-color, #fafafa); /* Used 14 times */
        --kt-surface-hover: var(--secondary-background-color, #f5f5f5);
        --kt-border: 1px solid var(--divider-color, #e0e0e0);
        
        /* === TYPOGRAPHY (7 variables) === */
        --kt-font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        --kt-font-size-sm: 0.85em;
        --kt-font-size-md: 1em;
        --kt-font-size-lg: 1.2em;
        --kt-text: var(--primary-text-color, #212121);
        --kt-text-secondary: var(--secondary-text-color, #757575);
        
        /* === COMPONENT SPECIFIC (15 variables) === */
        --kt-avatar-bg: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        --kt-avatar-background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        --kt-cosmetic-border: rgba(0,0,0,0.1);
        --kt-cosmetic-bg: rgba(255,255,255,0.1);
        --kt-cosmetic-background: rgba(255,255,255,0.05);
        --kt-gauge-bg: var(--kt-surface-variant);
        --kt-gauge-success: linear-gradient(90deg, var(--kt-success) 0%, var(--kt-info) 100%);
        --kt-gauge-points: var(--kt-success);
        --kt-gauge-coins: var(--kt-coins-color);
        --kt-gradient-neutral: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
        --kt-button-hover: rgba(0,0,0,0.1);
        --kt-overlay: rgba(0,0,0,0.5);
        --kt-error-background: rgba(244, 67, 54, 0.1);
        --kt-warning-background: rgba(255, 152, 0, 0.1);
        --kt-info-background: rgba(33, 150, 243, 0.1);

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

      ${this.getRewardStyles()}
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
          --kt-surface: var(--card-background-color, #1e1e1e);
          --kt-surface-primary: var(--card-background-color, #1e1e1e);
          --kt-surface-variant: var(--secondary-background-color, #2c2c2c);
          --kt-surface-hover: var(--secondary-background-color, #3a3a3a);
          --kt-avatar-bg: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          --kt-avatar-background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          --kt-cosmetic-background: rgba(255,255,255,0.1);
          --kt-gradient-neutral: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
          --kt-gauge-bg: var(--kt-surface-variant);
          --kt-shadow-light: rgba(0, 0, 0, 0.3);
          --kt-shadow-medium: rgba(0, 0, 0, 0.5);
          --kt-text: var(--primary-text-color, #e0e0e0);
          --kt-text-secondary: var(--secondary-text-color, #9e9e9e);
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
  
  // Utility method to check if a CSS variable is being used
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
  
  // Performance optimization: Pre-calculate commonly used values
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

// ES6 export
export { KidsTasksStyleManager };

// Backwards compatibility
window.KidsTasksStyleManager = KidsTasksStyleManager;