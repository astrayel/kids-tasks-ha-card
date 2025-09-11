/* Kids Tasks Card v2.0.0 - Development Build */
let KidsTasksStyleManager$1 = class KidsTasksStyleManager {
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
      
      .kt-level-badge {
        position: absolute;
        top: 100px;
        border-radius: var(--kt-radius-md);
        font-size: 0.8em;
        font-weight: 600;
        text-align: center;
        z-index: 2;
        background: var(--custom-points-badge-color, var(--primary-color, #3f51b5));
        backdrop-filter: blur(10px);
        padding: var(--kt-space-xs) 8px;
        min-width: 60px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
};

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

class KidsTasksBaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;


    this._touchStates = new WeakMap();
    this._touchControllers = new Map();
    this._isMobile = this._detectMobileDevice();


    if (typeof KidsTasksStyleManager !== 'undefined') {
      KidsTasksStyleManager.injectGlobalStyles();
    }
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!this._initialized && hass) {
      this._initialized = true;
      this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
      this.initTouchInteractions();
      this.render();
    } else if (hass && this.shouldUpdate(oldHass, hass)) {
      this.render();
      if (this._initialized) {
        this.initTouchInteractions();
      }
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
    }
    this._touchControllers.clear();
    this._touchStates = new WeakMap();
    this._longPressListenersAdded = false;
    this._swipeListenersAdded = false;
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

    if (oldTaskEntities.length !== newTaskEntities.length) return true;


    for (const entityId of oldTaskEntities) {
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

    const children = this.getChildren();

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="card-content kids-tasks-card">
        <div class="card-header">
          <h2 class="card-title">${this.config.title}</h2>
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${this.renderCurrentView(children)}
        </div>
      </div>
    `;
  }

  getStyles() {
    return `
      <style>
        :host {
          display: block;
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-lg);
          box-shadow: var(--box-shadow, 0 2px 8px var(--kt-shadow-light));
          overflow: hidden;
        }

        .card-content {
          padding: var(--kt-space-lg);
        }

        .card-header {
          margin-bottom: var(--kt-space-lg);
          padding-bottom: var(--kt-space-sm);
          border-bottom: 2px solid var(--kt-surface-variant);
        }

        .card-title {
          font-size: 1.5em;
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

        .stat {
          background: var(--kt-primary);
          color: white;
          padding: 4px 8px;
          border-radius: var(--kt-radius-sm);
          font-size: 0.8em;
          font-weight: 600;
        }

        .child-progress {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          text-align: center;
          margin-bottom: var(--kt-space-md);
        }

        .progress-bar {
          height: 4px;
          background: var(--kt-surface-variant);
          border-radius: var(--kt-radius-sm);
          overflow: hidden;
          margin-top: var(--kt-space-xs);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--kt-success) 0%, var(--kt-info) 100%);
          transition: width var(--kt-transition-medium);
        }

        .child-actions {
          text-align: center;
        }

        .action-button {
          background: var(--kt-primary);
          color: white;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9em;
          transition: all var(--kt-transition-fast);
        }

        .action-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
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

        /* Responsive design */
        @media (max-width: 768px) {
          .children-grid {
            grid-template-columns: 1fr;
          }
          
          .card-content {
            padding: var(--kt-space-md);
          }

          .navigation {
            justify-content: center;
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .child-stats {
            flex-direction: column;
            align-items: center;
          }

          .summary-stats {
            grid-template-columns: 1fr;
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
      return this.emptySection(
        '👨‍👩‍👧‍👦',
        'Aucun enfant configuré',
        'Configurez des enfants dans l\'intégration Kids Tasks Manager.'
      );
    }

    return `
      <div class="children-grid">
        ${children.map(child => this.renderChildCard(child)).join('')}
      </div>
    `;
  }

  renderSummary(children) {
    const stats = this.calculateGlobalStats(children);

    return `
      <div class="summary-stats">
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
        ${this.emptySection('🚧', 'Gestion avancée', 'Fonctionnalités de gestion en cours de développement.')}
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
          <div class="child-stats">
            <span class="stat">${child.points || 0} 🎫</span>
            <span class="stat">${child.coins || 0} 🪙</span>
            <span class="stat">Niv. ${child.level || 1}</span>
          </div>
        </div>
        
        <div class="child-progress">
          Aujourd'hui: ${stats.completedToday}/${stats.totalToday} tâches
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>
        
        <div class="child-actions">
          <button class="action-button" data-action="view-child" data-id="${child.id}">
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
        
        <div class="child-summary-stats">
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
    this.currentTab = 'tasks';
    this.tasksFilter = 'active';
    this.rewardsFilter = 'all';
  }

  connectedCallback() {

    this._refreshInterval = setInterval(() => {
      if (this._hass && this._initialized) {
        this.render();
      }
    }, 5000);
  }

  disconnectedCallback() {
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
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
    return `
      <style>
        :host {
          display: block;
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-lg);
          overflow: hidden;
          box-shadow: var(--box-shadow, 0 2px 8px rgba(0,0,0,0.1));
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
      </style>
    `;
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

{
  console.info('🛠️ Kids Tasks Card - Development Mode');
  console.info('📦 Loading modular components...');
}


KidsTasksStyleManager$1.injectGlobalStyles();


window.KidsTasksUtils = KidsTasksUtils;
window.KidsTasksStyleManager = KidsTasksStyleManager$1;


customElements.define('kids-tasks-card', KidsTasksCard);
customElements.define('kids-tasks-child-card', KidsTasksChildCard);
customElements.define('kids-tasks-card-editor', KidsTasksCardEditor);
customElements.define('kids-tasks-child-card-editor', KidsTasksChildCardEditor);


window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'kids-tasks-card',
    name: 'Kids Tasks Card',
    description: 'Manage children\'s tasks and rewards with an engaging interface',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  },
  {
    type: 'kids-tasks-child-card',
    name: 'Kids Tasks Child Card',
    description: 'Individual child view for tasks and rewards',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  }
);


if (typeof window !== 'undefined') {

  window.addEventListener('beforeunload', () => {
    console.info('🔄 Kids Tasks Card - Hot reload triggered');
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
          console.info('🔄 Hot reload: File changed, reloading...');
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
          console.info('🔄 Live reload triggered');
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
  window.KidsTasksBaseCard = KidsTasksBaseCard;


  window.KidsTasksDebug = {
    reloadCard: (cardElement) => {
      if (cardElement && cardElement.setConfig && cardElement.hass) {
        cardElement.setConfig(cardElement.config);
        cardElement.hass = cardElement.hass;
        console.info('🔄 Card reloaded manually');
      }
    },

    reloadAllCards: () => {
      document.querySelectorAll('kids-tasks-card, kids-tasks-child-card').forEach(card => {
        window.KidsTasksDebug.reloadCard(card);
      });
      console.info('🔄 All cards reloaded');
    },

    inspectCard: (cardElement) => {
      console.log('🔍 Card inspection:', {
        element: cardElement,
        config: cardElement.config,
        hass: cardElement._hass,
        children: cardElement.getChildren?.()
      });
    }
  };

  console.info('🛠️ Development utilities available as window.KidsTasksDebug');
}


const version = "2.0.0";

console.info(
  `%c Kids Tasks Card v${version} loaded successfully! `,
  'background: #4caf50; color: white; padding: 4px 8px; border-radius: 4px;'
);

{
  console.info('🎯 Mode: Development with hot reload');
  console.info('🏗️ Architecture: Modular ES6 components');
  console.info('⚡ Performance: Optimized rendering pipeline');
  console.info('🎨 Styles: Consolidated CSS variables');
}

export { KidsTasksBaseCard, KidsTasksCard, KidsTasksChildCard, KidsTasksStyleManager$1 as KidsTasksStyleManager, KidsTasksUtils };
//# sourceMappingURL=kids-tasks-card-ha-dev.js.map
