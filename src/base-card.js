// Kids Tasks Base Card - Foundation class for all card components

import { KidsTasksUtils } from './utils.js';
import performanceMonitor from './performance-monitor.js';
import logger from './logger.js';

class KidsTasksBaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
    
    // Performance and render optimization
    this._lastRenderState = null;
    this._renderDebounceTimer = null;
    this._isRendering = false;
    this._pendingRender = false;
    
    // Touch interaction state management
    this._touchStates = new WeakMap();
    this._touchControllers = new Map();
    this._isMobile = this._detectMobileDevice();
    
    // Inject global styles on first load
    if (typeof KidsTasksStyleManager !== 'undefined') {
      KidsTasksStyleManager.injectGlobalStyles();
    }
    
    // Performance monitoring
    if (performanceMonitor) {
      performanceMonitor.trackEventHandler('constructor', this.constructor.name, 'add');
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

  // Smart rendering system with debouncing and state diffing
  smartRender(force = false) {
    // Prevent render spam
    if (this._isRendering && !force) {
      this._pendingRender = true;
      return;
    }

    // Debounce rapid render calls
    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
    }

    this._renderDebounceTimer = setTimeout(() => {
      this._performRender(force);
    }, force ? 0 : 16); // 16ms debounce (~60fps)
  }

  _performRender(force = false) {
    if (this._isRendering) return;

    const startTime = performance.now();
    this._isRendering = true;

    try {
      // Check if render is actually needed
      if (!force && !this._needsRender()) {
        return;
      }

      // Perform the actual render
      this.render();
      
      // Update render state tracking
      this._updateRenderState();
      
      // Handle pending render if needed
      if (this._pendingRender) {
        this._pendingRender = false;
        setTimeout(() => this.smartRender(), 0);
      }
      
    } catch (error) {
      logger.error('Render error in', this.constructor.name, error);
      this._handleRenderError(error);
    } finally {
      this._isRendering = false;
      
      // Performance tracking
      if (performanceMonitor) {
        const endTime = performance.now();
        performanceMonitor.trackRender(this.constructor.name, startTime, endTime);
      }
    }
  }

  // Check if component needs re-render based on state changes
  _needsRender() {
    const currentState = this._getCurrentRenderState();
    
    if (!this._lastRenderState) {
      return true; // First render
    }

    // Deep comparison of render state
    return JSON.stringify(currentState) !== JSON.stringify(this._lastRenderState);
  }

  // Get current state for render comparison
  _getCurrentRenderState() {
    return {
      hasHass: !!this._hass,
      entityCount: this._hass ? Object.keys(this._hass.states || {}).length : 0,
      configHash: this.config ? JSON.stringify(this.config).slice(0, 100) : null,
      timestamp: Math.floor(Date.now() / 1000) // Round to seconds to avoid constant changes
    };
  }

  // Update render state tracking
  _updateRenderState() {
    this._lastRenderState = this._getCurrentRenderState();
  }

  // Handle render errors gracefully
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

    // Don't process clicks during long press
    const longPressItem = target.closest('.long-pressing');
    if (longPressItem) return;

    // Check for active touch state
    const touchState = this._touchStates.get(target.closest('.kt-long-press-item'));
    if (touchState && touchState.isActive) return;

    // Don't process clicks during swipe
    const swipeableItem = target.closest('.kt-swipeable-item');
    if (swipeableItem && (swipeableItem.classList.contains('swiping-left') || swipeableItem.classList.contains('swiping-right'))) {
      return;
    }

    // Close other confirmations unless this is a confirmation button
    if (!target.classList.contains('kt-confirm-delete') && !target.classList.contains('kt-cancel-delete')) {
      this._hideAllDeleteConfirmations();
    }

    event.preventDefault();
    event.stopPropagation();

    const action = target.dataset.action;
    const id = target.dataset.id;

    // Handle filter actions specially
    if (action === 'filter-rewards' || action === 'filter-children' || action === 'filter-tasks') {
      this.handleAction(action, target.dataset.filter, event);
    } else {
      this.handleAction(action, id, event);
    }
  }

  // Touch Interaction System
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
    // Clean up touch controllers
    for (const controller of this._touchControllers.values()) {
      controller.abort();
      if (performanceMonitor) {
        performanceMonitor.trackEventHandler('touch', this.constructor.name, 'remove');
      }
    }
    this._touchControllers.clear();
    this._touchStates = new WeakMap();
    this._longPressListenersAdded = false;
    this._swipeListenersAdded = false;

    // Clean up render timers
    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
      this._renderDebounceTimer = null;
    }
  }

  // Enhanced disconnection cleanup
  disconnectedCallback() {
    this._cleanupTouchInteractions();
    
    // Clean up any component-specific resources
    if (this._cleanupTimers) {
      this._cleanupTimers();
    }
    
    // Performance monitoring
    if (performanceMonitor) {
      performanceMonitor.trackEventHandler('disconnect', this.constructor.name, 'remove');
    }
  }

  // Event delegation system for better performance
  _setupEventDelegation() {
    if (this._eventDelegationSetup) return;
    
    // Use single event listener with delegation instead of multiple listeners
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
    
    if (performanceMonitor) {
      performanceMonitor.trackEventHandler('delegation', this.constructor.name, 'add');
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

    // Touch handlers for swipe gestures
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

  // Swipe handling methods (to be overridden by subclasses)
  handleSwipeLeft(item) {
    // Default implementation - override in subclasses
  }

  handleSwipeRight(item) {
    // Default implementation - override in subclasses
  }

  // Utility methods
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

  // Common rendering methods
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

  // Abstract methods to be implemented by subclasses
  shouldUpdate(oldHass, newHass) {
    throw new Error('shouldUpdate must be implemented by subclass');
  }

  render() {
    throw new Error('render must be implemented by subclass');
  }

  handleAction(action, id, event) {
    throw new Error('handleAction must be implemented by subclass');
  }

  // Common data access methods (to be overridden)
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

// ES6 export
export { KidsTasksBaseCard };