// Kids Tasks Base Card - Foundation class for all card components

import { KidsTasksUtils } from './utils.js';
import performanceMonitor from './performance-monitor.js';
import logger from './logger.js';

class KidsTasksBaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;

    // Make performanceMonitor accessible to child classes
    this.performanceMonitor = performanceMonitor;

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
      if (this.performanceMonitor) {
        const endTime = performance.now();
        this.performanceMonitor.trackRender(this.constructor.name, startTime, endTime);
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
      if (this.performanceMonitor) {
        this.performanceMonitor.trackEventHandler('touch', this.constructor.name, 'remove');
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
    if (this.performanceMonitor) {
      this.performanceMonitor.trackEventHandler('disconnect', this.constructor.name, 'remove');
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

  // Avatar rendering method
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

  // Child data methods
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

        // Support multiple assignment formats
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

  // Child card rendering method
  renderChild(child) {
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
               data-id="${child.child_id || child.id}"
               onclick="event.stopPropagation();">
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
    // Fermer toutes les dialogs existantes avant d'en créer une nouvelle
    const existingDialogs = document.querySelectorAll('ha-dialog');
    existingDialogs.forEach(existingDialog => {
      if (existingDialog && existingDialog.parentNode) {
        existingDialog.close();
        existingDialog.parentNode.removeChild(existingDialog);
      }
    });

    // Sauvegarder le style overflow du body
    const originalOverflow = document.body.style.overflow;

    // Utiliser ha-dialog pour les modales
    const dialog = document.createElement('ha-dialog');
    dialog.heading = title;
    dialog.hideActions = true;
    
    // Créer le contenu avec les styles et référence à l'instance
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
    
    // Stocker la référence à this et l'overflow original
    dialog._cardInstance = this;
    dialog._originalOverflow = originalOverflow;
    
    dialog.appendChild(contentDiv);
    document.body.appendChild(dialog);
    
    // Gérer la fermeture pour restaurer l'overflow
    dialog.addEventListener('closed', () => {
      // Restaurer le style overflow original du body
      if (dialog._originalOverflow !== undefined) {
        document.body.style.overflow = dialog._originalOverflow;
      } else {
        // Si pas de style original, remettre à auto pour permettre le scroll
        document.body.style.overflow = 'auto';
      }
    });
    
    // Ouvrir immédiatement et laisser les composants s'initialiser naturellement
    dialog.show();
    
    return dialog;
  }

  // CSS methods
  getCustomCSSVariables() {
    // Extract colors from config
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

  // Task management utilities
  filterTasks(tasks, filter, mode = 'manager') {
    switch (filter) {
      case 'active':
        if (mode === 'child') {
          // Pour child-card : tâches todo ou pending
          return tasks.filter(t => t.status === 'todo' || t.status === 'pending');
        } else {
          // Pour manager-card : tâches actives et dans la période
          return tasks.filter(task => task.frequency !== 'none' && task.active !== false && this.isTaskInPeriod(task));
        }
      case 'completed':
        // Pour child-card : tâches terminées ou validées
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
    // Simple implementation - can be extended
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
      <ha-button
        class="filter-btn ${this[filterProperty] === filter.id ? 'active' : ''}"
        data-action="${actionName}"
        data-filter="${filter.id}"
      >
        ${filter.label}
      </ha-button>
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
      // Search by child_id (UUID) first, then by name, then by id
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
}

// ES6 export
export { KidsTasksBaseCard };