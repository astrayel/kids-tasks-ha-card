// Kids Tasks Style Manager - Global styles and theming system

class KidsTasksStyleManager {
  static instance = null;
  static injected = false;
  static currentVersion = 'v1.1.0';
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new KidsTasksStyleManager();
    }
    return this.instance;
  }
  
  static injectGlobalStyles() {
    // Vérifier si les styles sont déjà injectés
    const existingStyles = document.querySelector('#kids-tasks-global-styles');
    if (existingStyles || this.injected) {
      return;
    }
    
    const styleElement = document.createElement('style');
    styleElement.id = 'kids-tasks-global-styles';
    styleElement.setAttribute('data-version', this.currentVersion);
    
    styleElement.textContent = this.getGlobalStyles();
    document.head.appendChild(styleElement);
    
    this.injected = true;
    console.log('Kids Tasks: Global styles injected v' + this.currentVersion);
  }
  
  static getGlobalStyles() {
    return `
      /* === VARIABLES CSS GLOBALES KIDS TASKS === */
      :root {
        --kt-primary: var(--primary-color, #3f51b5);
        --kt-secondary: var(--accent-color, #ff4081);
        --kt-success: #4caf50;
        --kt-warning: #ff9800;
        --kt-error: #f44336;
        --kt-info: #2196f3;
        
        /* Status unifié */
        --kt-status-todo: var(--kt-warning);
        --kt-status-progress: var(--kt-info);
        --kt-status-pending: #ff9800;
        --kt-status-completed: var(--kt-success);
        --kt-status-validated: var(--kt-success);
        --kt-status-failed: var(--kt-error);
        
        /* Monnaies et points */
        --kt-points-color: var(--kt-success);
        --kt-coins-color: #9C27B0;
        --kt-penalty-color: var(--kt-error);
        --kt-points-plus: var(--kt-success);
        --kt-points-minus: var(--kt-error);
        
        /* Raretés cosmétiques */
        --kt-rarity-common: #9e9e9e;
        --kt-rarity-rare: var(--kt-info);
        --kt-rarity-epic: var(--kt-secondary);
        --kt-rarity-legendary: var(--kt-warning);
        
        /* Notifications */
        --kt-notification-success: var(--kt-success);
        --kt-notification-error: var(--kt-error);
        --kt-notification-info: var(--kt-info);
        
        /* Effets visuels */
        --kt-shadow-light: rgba(0, 0, 0, 0.1);
        --kt-shadow-medium: rgba(0, 0, 0, 0.2);
        --kt-shadow-heavy: rgba(0, 0, 0, 0.3);
        --kt-overlay: rgba(0, 0, 0, 0.5);
        
        /* Surfaces et bordures */
        --kt-surface-variant: var(--secondary-background-color, #fafafa);
        --kt-border-thin: 1px solid var(--divider-color, #e0e0e0);
        
        /* Avatar et cosmétiques */
        --kt-avatar-background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        --kt-cosmetic-border: rgba(0,0,0,0.1);
        --kt-cosmetic-background: rgba(255,255,255,0.1);
        
        /* Espacements standardisés */
        --kt-space-xs: 4px;
        --kt-space-sm: 8px;
        --kt-space-md: 16px;
        --kt-space-lg: 24px;
        --kt-space-xl: 32px;
        
        /* Rayons de courbure standardisés */
        --kt-radius-sm: 8px;
        --kt-radius-md: 12px;
        --kt-radius-lg: 16px;
        --kt-radius-xl: 24px;
        --kt-radius-round: 50%;
        
        /* Transitions communes */
        --kt-transition-fast: 0.2s ease;
        --kt-transition-medium: 0.3s ease;
        --kt-transition-slow: 0.5s ease;
        
        /* Polices et tailles */
        --kt-font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        --kt-font-size-xs: 0.75em;
        --kt-font-size-sm: 0.85em;
        --kt-font-size-md: 1em;
        --kt-font-size-lg: 1.2em;
        --kt-font-size-xl: 1.5em;
      }

      /* === COMPOSANTS CSS GLOBAUX KIDS TASKS === */
      .kids-tasks-scope {
        font-family: var(--kt-font-family);
      }
      
      /* Composants KT-* avec préfixe pour dialogs */
      ${this.getCoreKTStyles().replace(/\.kt-/g, '.kids-tasks-scope .kt-')}
      
      /* Classes utilitaires */
      .kids-tasks-scope .avatar-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--kt-radius-round);
        font-size: 20px;
        color: rgba(0, 0, 0, 0.4);
        z-index: 1;
      }
      
      .kids-tasks-scope .avatar-placeholder-large {
        border-radius: var(--kt-radius-md);
        font-size: 32px;
        width: 100px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0, 0, 0, 0.4);
        border: 2px solid var(--kt-cosmetic-border);
      }
      
      /* Interface historique */
      .kids-tasks-scope .child-history-container {
        max-width: 600px;
        margin: 0 auto;
      }
      
      .kids-tasks-scope .history-header {
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        margin-bottom: var(--kt-space-lg);
      }
      
      .kids-tasks-scope .history-content {
        max-height: 400px;
        overflow-y: auto;
      }
      
      .kids-tasks-scope .history-list {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-xs);
      }
      
      .kids-tasks-scope .history-entry {
        display: flex;
        flex-direction: column;
        border: var(--kt-border-thin);
        border-radius: var(--kt-radius-lg);
        transition: all var(--kt-transition-fast);
      }
      
      .kids-tasks-scope .history-entry:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
      }
      
      .kids-tasks-scope .entry-title {
        display: flex;
        flex-direction: row;
        place-items: center;
        padding: 4px 0px 0px 4px;
      }

      .kids-tasks-scope .entry-content {
        display: flex;
        flex-direction: row;
        padding-left: 2em;
      }

      .kids-tasks-scope .entry-description {
        font-weight: 600;
        color: var(--primary-text-color, #212121);
        padding-left: 1em;
      }

      .kids-tasks-scope .entry-date {
        font-style: italic;
        font-size: 0.6em;
        align-self: center;
      }

      .kids-tasks-scope .entry-type {
        padding: 2px var(--kt-space-xs);
        border-radius: var(--kt-radius-sm);
        align-self: center;
      }

      .kids-tasks-scope .entry-points {
        font-weight: 700;
        font-size: 1.1em;
        padding: var(--kt-space-xs) var(--kt-space-sm);
        border-radius: var(--kt-radius-md);
        flex-shrink: 0;
      }

      .kids-tasks-scope .entry-points.plus {
        color: var(--kt-points-plus);
      }

      .kids-tasks-scope .entry-points.minus {
        color: var(--kt-points-minus);
      }

      .kids-tasks-scope .entry-icon {
        font-size: 1.5em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .kids-tasks-scope .empty-history {
        text-align: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color, #757575);
      }
      
      .kids-tasks-scope .empty-icon {
        font-size: 3em;
        margin-bottom: var(--kt-space-md);
        opacity: 0.6;
      }
      
      .kids-tasks-scope .current-stats {
        display: flex;
        gap: var(--kt-space-md);
      }
      
      .kids-tasks-scope .current-stats .stat {
        background: var(--kt-surface-variant);
        padding: var(--kt-space-xs) var(--kt-space-sm);
        border-radius: var(--kt-radius-md);
        font-size: 0.9em;
        font-weight: 600;
      }
    `;
  }
  
  // Méthode centrale pour les styles kt-* (source unique de vérité)
  static getCoreKTStyles() {
    return `
      /* Avatar Section Components */
      .kt-avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--kt-space-xs);
      }
      
      .kt-avatar-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--kt-space-xs);
      }
      
      .kt-avatar {
        font-size: 3em;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--kt-radius-round);
        background: var(--kt-avatar-background);
        border: 2px solid var(--kt-cosmetic-background);
        transition: all var(--kt-transition-fast);
      }
      
      .kt-avatar--small { font-size: 1.5em; }
      .kt-avatar--large { font-size: 4em; }
      .kt-avatar--extra-large { font-size: 6em; }
      
      .kt-avatar img {
        width: 2em;
        height: 2em;
        border-radius: var(--kt-radius-round) !important;
        object-fit: cover !important;
        border: 2px solid var(--kt-cosmetic-background, rgba(255,255,255,0.2));
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      /* Child Name and Level Components */
      .kt-child-name-header {
        font-size: 2em;
        line-height: 1.2em;
        font-weight: 700;
        text-align: center;
        color: var(--custom-child-text-color, var(--header-text-color, var(--primary-text-color)));
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      
      
      /* Child Info Components */
      .kt-child-info {
        display: flex;
        align-items: center;
        gap: var(--kt-space-lg);
        margin-bottom: var(--kt-space-lg);
      }
      
      .kt-child-details {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-sm);
      }
      
      .kt-child-details .current-stats {
        display: flex;
        gap: var(--kt-space-md);
        flex-wrap: wrap;
      }
      
      .kt-child-details .current-stats .stat {
        font-weight: 600;
        font-size: 0.9em;
        color: var(--secondary-text-color, #666);
      }

      /* Touch Interactions */
      .kt-clickable-item {
        cursor: pointer;
        transition: all var(--kt-transition-fast);
      }

      .kt-clickable-item:hover {
        background-color: var(--kt-surface-variant);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px var(--kt-shadow-light);
      }

      .kt-clickable-item:active {
        transform: translateY(0);
        box-shadow: 0 1px 4px var(--kt-shadow-light);
      }

      /* Long Press Components */
      .kt-long-press-item {
        position: relative;
      }

      .kt-long-press-item.long-pressing {
        animation: kt-pulse 0.6s ease-in-out;
      }

      @keyframes kt-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }

      .kt-delete-confirmation {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(244, 67, 54, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--kt-space-md);
        border-radius: var(--kt-radius-md);
        z-index: 10;
      }

      .kt-delete-confirmation.hidden {
        display: none;
      }

      .kt-confirm-delete {
        background: var(--kt-error);
        color: white;
        border: none;
        padding: var(--kt-space-sm) var(--kt-space-md);
        border-radius: var(--kt-radius-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--kt-transition-fast);
      }

      .kt-cancel-delete {
        background: transparent;
        color: white;
        border: 2px solid white;
        padding: var(--kt-space-sm) var(--kt-space-md);
        border-radius: var(--kt-radius-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--kt-transition-fast);
      }

      /* Swipe Interactions */
      .kt-swipeable-item {
        position: relative;
        overflow: hidden;
        touch-action: pan-y;
      }

      .kt-swipeable-item .kt-task-content {
        position: relative;
        display: flex;
        flex-direction: row;
        width: 100%;
        z-index: 2;
        transition: transform var(--kt-transition-medium);
      }

      .kt-swipeable-item.swiping-left::before,
      .kt-swipeable-item.swiping-right::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        font-size: 24px;
        font-weight: bold;
        color: white;
      }

      .kt-swipeable-item.swiping-left::before {
        content: '✗';
        font-size: 3em;
        left: 0;
        background: linear-gradient(90deg, var(--kt-error), transparent);
      }

      .kt-swipeable-item.swiping-right::before {
        right: 0;
        background: linear-gradient(-90deg, var(--kt-success), transparent);
      }

      .kt-swipeable-item.pending-validation.swiping-right::before {
        font-size: 3em;
        content: '✓';
        background: linear-gradient(-90deg, var(--kt-success), transparent);
      }

      .kt-swipeable-item.reward-item.swiping-right::before {
        font-size: 3em;
        content: '🗑️';
        background: linear-gradient(-90deg, var(--kt-error), transparent);
      }

      .kt-swipeable-item.swiping-left .kt-task-content {
        transform: translateX(-20px);
      }
      
      .kt-swipeable-item.swiping-right .kt-task-content {
        transform: translateX(20px);
      }

      /* Animation Effects */
      .kt-task-item.editing {
        outline: 2px solid var(--kt-primary);
        outline-offset: 2px;
      }

      .task.kt-animating-validated {
        animation: kt-slideOutRight 0.3s ease-out forwards;
      }

      .task.kt-animating-rejected {
        animation: kt-slideOutLeft 0.3s ease-out forwards;
      }

      @keyframes kt-slideOutRight {
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes kt-slideOutLeft {
        to {
          transform: translateX(-100%);
          opacity: 0;
        }
      }
    `;
  }
  
  static removeGlobalStyles() {
    const existingStyles = document.querySelector('#kids-tasks-global-styles');
    if (existingStyles) {
      existingStyles.remove();
      this.injected = false;
      console.log('Kids Tasks: Global styles removed');
    }
  }
}

// ES6 export
export { KidsTasksStyleManager };