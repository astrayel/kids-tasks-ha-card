// Interface graphique complète pour Kids Tasks Manager

// === GESTIONNAIRE DE STYLES GLOBAUX ===
class KidsTasksStyleManager {
  static instance = null;
  static injected = false;
  static currentVersion = 'v1.0.0';
  
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
    console.log('Kids Tasks: Global styles injected');
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
      
      /* === INTERFACE HISTORIQUE === */
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
        padding-left: 36px;
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
      }

      .kids-tasks-scope .entry-description {
        font-weight: 600;
        color: var(--primary-text-color, #212121);
        padding-left: 8px;
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
      /* Composant Avatar Section - Structure de base pour avatar + nom */
      .kt-avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--kt-space-xs);
      }
      
      /* Composant Avatar Container - Conteneur pour avatar + badge */
      .kt-avatar-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--kt-space-xs);
      }
      
      /* Composant Avatar - Styles de base pour l'avatar */
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
      
      .kt-avatar--small {
        font-size: 1.5em;
      }
      
      .kt-avatar--large {
        font-size: 4em;
      }
      
      .kt-avatar--extra-large {
        font-size: 6em;
      }
      
      /* Images dans l'avatar */
      .kt-avatar img {
        width: 2em;
        height: 2em;
        border-radius: var(--kt-radius-round) !important;
        object-fit: cover !important;
        border: 2px solid var(--kt-cosmetic-background, rgba(255,255,255,0.2));
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      /* Composant Child Name Header - En-tête nom d'enfant */
      .kt-child-name-header {
        font-size: 2em;
        font-weight: 700;
        text-align: center;
        color: var(--custom-child-text-color, var(--header-text-color, var(--primary-text-color)));
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }
      
      /* Composant Level Badge - Badge de niveau standardisé */
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
      
      /* Composant Child Info - Conteneur d'informations enfant pour modales */
      .kt-child-info {
        display: flex;
        align-items: center;
        gap: var(--kt-space-lg);
        margin-bottom: var(--kt-space-lg);
      }
      
      /* Composant Child Details - Détails complémentaires */
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

class KidsTasksBaseCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
    
    // Injecter les styles globaux dès le premier chargement
    KidsTasksStyleManager.injectGlobalStyles();
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!this._initialized && hass) {
      this._initialized = true;
      this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
      this.render();
    } else if (hass && this.shouldUpdate(oldHass, hass)) {
      this.render();
    }
  }

  handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const action = target.dataset.action;
    const id = target.dataset.id;

    // Pour les filtres, passer la valeur du filtre à la place de l'ID
    if (action === 'filter-rewards' || action === 'filter-children' || action === 'filter-tasks') {
      this.handleAction(action, target.dataset.filter, event);
    } else {
      this.handleAction(action, id, event);
    }
  }

  // Méthode abstraite à implémenter dans les classes filles
  handleAction(action, id = null, event = null) {
    throw new Error('handleAction must be implemented by subclass');
  }

  // Méthode abstraite à implémenter dans les classes filles
  render() {
    throw new Error('render must be implemented by subclass');
  }

  // Méthode abstraite à implémenter dans les classes filles
  shouldUpdate(oldHass, newHass) {
    throw new Error('shouldUpdate must be implemented by subclass');
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
    
    const dialog = document.createElement('ha-dialog');
    dialog.setAttribute('open', '');
    dialog.setAttribute('hide-actions', '');
    
    if (title) {
      dialog.setAttribute('heading', title);
    }

    dialog.innerHTML = `
      <div class="kids-tasks-scope">
        ${content}
      </div>
    `;

    // Forcer un z-index très élevé pour la dialog
    dialog.style.zIndex = '99999';
    
    dialog._cardInstance = this;
    dialog._originalOverflow = originalOverflow;
    document.body.appendChild(dialog);

    dialog.addEventListener('closed', () => {
      this.closeModal(dialog);
    });

    return dialog;
  }

  closeModal(dialog) {
    if (dialog && dialog.close) {
      dialog.close();
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
      // Restaurer le style overflow original du body
      if (dialog._originalOverflow !== undefined) {
        document.body.style.overflow = dialog._originalOverflow;
      } else {
        // Si pas de style original, remettre à auto pour permettre le scroll
        document.body.style.overflow = 'auto';
      }
    }
  }

  showNotification(message, type = 'info') {
    if (!this._hass) return;

    let icon = '💭';
    let title = 'Information';
    
    switch (type) {
      case 'success':
        icon = '✅';
        title = 'Succès';
        break;
      case 'error':
        icon = '❌';
        title = 'Erreur';
        break;
      case 'warning':
        icon = '⚠️';
        title = 'Attention';
        break;
      default:
        icon = 'ℹ️';
        title = 'Information';
    }

    this._hass.callService('persistent_notification', 'create', {
      message: message,
      title: `${icon} Kids Tasks - ${title}`,
      notification_id: `kids_tasks_${Date.now()}`
    });
  }

  getAvatar(child) {
    if (!child) {
      return '👶';
    }
    const avatarType = child.avatar_type || 'emoji';
    
    if (avatarType === 'emoji') {
      return child.avatar || '👶';
    } else if (avatarType === 'url' && child.avatar_data) {
      return `<img src="${child.avatar_data}" alt="${child.name || 'Enfant'}">`;
    } else if (avatarType === 'person_entity' && child.person_entity_id && this._hass) {
      const personEntity = this._hass.states[child.person_entity_id];
      if (personEntity && personEntity.attributes && personEntity.attributes.entity_picture) {
        return `<img src="${personEntity.attributes.entity_picture}" alt="${child.name || 'Enfant'}">`;
      }
    }
    return child.avatar || '👶';
  }

  getAssignedChildrenNames(task) {
    if (!this._hass) return [];
    
    const children = this.getChildren();
    const assignedIds = task.assigned_child_ids || (task.assigned_child_id ? [task.assigned_child_id] : []);
    
    return assignedIds.map(assignedChildId => {
      const child = children.find(c => c.id === assignedChildId);
      return child ? child.name : 'Enfant inconnu';
    }).filter(name => name);
  }

  getCosmeticImagePath(cosmeticType, fileName) {
    if (!fileName || !cosmeticType) return null;
    const baseUrl = '/local/community/kids_tasks/cosmetics';
    return `${baseUrl}/${cosmeticType}/${fileName}`;
  }

  renderCosmeticPreview(cosmeticData, rewardName = null) {
    if (!cosmeticData && rewardName) {
      cosmeticData = this.generateCosmeticDataFromName(rewardName);
    }
    
    if (!cosmeticData) {
      return '🎨';
    }
    
    const catalogData = cosmeticData.catalog_data || {};
    const cosmeticType = cosmeticData.type ? cosmeticData.type.replace(/s$/, '') : '';
    
    switch (cosmeticType) {
      case 'avatar':
        if (catalogData.pixel_art && typeof catalogData.pixel_art === 'string' && catalogData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('avatars', catalogData.pixel_art);
          return `<img class="cosmetic-pixel-art-preview" src="${imageUrl}" alt="Avatar" style="width: 54px; height: 54px; image-rendering: pixelated;" />`;
        }
        if (catalogData.emoji) {
          return `<div class="cosmetic-avatar-preview">${catalogData.emoji}</div>`;
        }
        return '👤';
        
      case 'background':
        if (catalogData.css_gradient) {
          return `<div class="cosmetic-background-preview" style="background: ${catalogData.css_gradient};"></div>`;
        }
        return `<div class="cosmetic-background-preview"></div>`;
        
      case 'outfit':
        if (catalogData.pixel_art && typeof catalogData.pixel_art === 'string' && catalogData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('outfits', catalogData.pixel_art);
          return `<div style="position: relative; width: 54px; height: 54px;">
            <div class="avatar-placeholder" style="background: var(--kt-avatar-background);">👤</div>
            <img src="${imageUrl}" alt="Outfit" style="position: absolute; top: 0; left: 0; width: 54px; height: 54px; image-rendering: pixelated;" />
          </div>`;
        }
        if (catalogData.emoji_overlay) {
          return `<div class="cosmetic-outfit-preview">
            <span class="base-avatar">👤</span>
            <span class="outfit-overlay">${catalogData.emoji_overlay}</span>
          </div>`;
        }
        return '👕';
        
      case 'theme':
        const themeCssVars = catalogData.css_variables || {};
        const primaryColor = themeCssVars['--kt-primary'] || '#3f51b5';
        return `<div class="cosmetic-theme-preview" style="background: ${primaryColor}; width: 40px; height: 40px; border-radius: var(--kt-radius-sm); border: 2px solid var(--kt-cosmetic-border);"></div>`;
        
      default:
        return '🎨';
    }
  }

  emptySection(icon, text, subtext){
    return `
        <div class="empty-state">
          <div class="empty-icon">${icon}</div>
          <div class="empty-text">${text}</div>
          <div class="empty-subtext">${subtext}</div>
        </div>
      `;
  }

  // Méthode héritée - peut être surchargée dans les classes filles
  generateCosmeticDataFromName(rewardName) {
    if (!rewardName) return null;
    
    const name = rewardName.toLowerCase();
    
    // Avatars
    if (name.includes('avatar') || name.includes('personnage')) {
      return {
        type: 'avatar',
        catalog_data: { emoji: '👤', default_avatar: true }
      };
    }
    
    // Backgrounds
    if (name.includes('fond') || name.includes('background') || name.includes('thème')) {
      return {
        type: 'background',
        catalog_data: { css_gradient: 'var(--kt-gradient-neutral)' }
      };
    }
    
    // Outfits
    if (name.includes('tenue') || name.includes('vêtement') || name.includes('costume')) {
      return {
        type: 'outfit',
        catalog_data: { emoji_overlay: '👕' }
      };
    }
    
    return null;
  }

  // === SYSTÈME DE STYLES CSS FACTORISÉ ===
  // Couche 1: Variables CSS globales unifiées
  getGlobalVariables() {
    return `
      :host {
        /* Couleurs système unifiées */
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
        --kt-status-validated: var(--kt-success);
        --kt-status-failed: var(--kt-error);
        
        /* Monnaies et points */
        --kt-points-color: var(--kt-success);
        --kt-coins-color: #9C27B0;
        --kt-penalty-color: var(--kt-error);
        
        /* Raretés cosmétiques */
        --kt-rarity-common: #9e9e9e;
        --kt-rarity-rare: var(--kt-info);
        --kt-rarity-epic: #9c27b0;
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
        
        /* Gradients réutilisables */
        --kt-gradient-primary: linear-gradient(135deg, var(--primary-color, #1976d2), var(--accent-color, #ff4081));
        --kt-gradient-success: linear-gradient(135deg, #4CAF50, #8BC34A);
        --kt-gradient-neutral: var(--kt-gradient-neutral);
        --kt-gradient-avatar: var(--kt-avatar-background);
        
        /* Espacements standardisés */
        --kt-space-xs: 4px;
        --kt-space-sm: 8px;
        --kt-space-md: 12px;
        --kt-space-lg: 16px;
        --kt-space-xl: 24px;
        
        /* Rayons de courbure standardisés */
        --kt-radius-sm: 8px;
        --kt-radius-md: 12px;
        --kt-radius-lg: 16px;
        --kt-radius-xl: 20px;
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
    `;
  }

  // Couche 2: Styles de base communs
  getBaseStyles() {
    return `
      /* === STYLES DE BASE === */
      
      /* Boutons standardisés */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--kt-space-sm) var(--kt-space-lg);
        border: none;
        border-radius: var(--kt-space-xs);
        font-family: var(--kt-font-family);
        font-size: var(--kt-font-size-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--kt-transition-fast);
        text-decoration: none;
        min-height: 32px;
        gap: var(--kt-space-xs);
      }
      
      .btn:hover, .hover-lift:hover { transform: translateY(-1px); box-shadow: 0 2px 4px var(--kt-shadow-medium); }
      .hover-card:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .flex-content { flex: 1; min-width: 0; }
      .btn:active { transform: translateY(0); }
      .btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
      
      .btn-primary { background: var(--kt-primary); color: white; }
      .btn-secondary { background: var(--kt-secondary); color: white; }
      .btn-success { background: var(--kt-success); color: white; }
      .btn-danger { background: var(--kt-error); color: white; }
      .btn-warning { background: var(--kt-warning); color: white; }
      .btn-info { background: var(--kt-info); color: white; }
      
      .filter-btn {
        padding: var(--kt-space-sm) var(--kt-space-lg);
        border: 2px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-radius-xl);
        cursor: pointer;
        transition: all var(--kt-transition-fast);
        font-size: var(--kt-font-size-sm);
        font-weight: 500;
      }
      
      .filter-btn:hover {
        border-color: var(--kt-primary);
        background: rgba(63, 81, 181, 0.05);
      }
      
      .filter-btn.active {
        border-color: var(--kt-primary);
        background: var(--kt-primary);
        color: white;
      }

      /* Cartes et conteneurs */
      .card-base {
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-space-md);
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px var(--kt-shadow-light));
        padding: var(--kt-space-lg);
        margin: var(--kt-space-sm) 0;
        transition: box-shadow var(--kt-transition-medium);
      }
      
      .content {
        padding: 8px;
        background: var(--card-background-color, white);
      }
      
      .card-base:hover { box-shadow: 0 4px 12px var(--kt-shadow-medium); }
      
      /* Modales */
      .modal-base {
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-space-md);
        box-shadow: 0 8px 32px var(--kt-shadow-heavy);
        padding: var(--kt-space-xl);
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
      }
      
      /* Formulaires */
      .form-row {
        display: flex;
        gap: var(--kt-space-lg);
        margin-bottom: var(--kt-space-lg);
        align-items: flex-end;
      }
      
      .form-row > * { flex: 1; }
      
      .form-section {
        margin-bottom: var(--kt-space-xl);
        padding: var(--kt-space-lg);
        background: var(--secondary-background-color, #fafafa);
        border-radius: var(--kt-space-sm);
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      
      .form-section-title {
        font-weight: 600;
        margin-bottom: var(--kt-space-md);
        padding-bottom: var(--kt-space-xs);
        border-bottom: 2px solid var(--kt-primary);
        color: var(--primary-text-color, #212121);
      }
      
      .dialog-actions {
        display: flex;
        gap: var(--kt-space-sm);
        justify-content: flex-end;
        margin-top: var(--kt-space-xl);
      }
    
      /* Classes utilitaires pour styles inline répétitifs */
      .avatar-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--kt-radius-sm);
        font-size: 24px;
      }
      
      .avatar-placeholder-large {
        border-radius: var(--kt-radius-md);
        font-size: 32px;
      }
      
      .secondary-text {
        font-size: 0.9em;
        color: var(--secondary-text-color);
      }
      
      .center-flex {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      /* Classes utilitaires pour espacements */
      .p-xs { padding: var(--kt-space-xs); }
      .p-sm { padding: var(--kt-space-sm); }
      .p-md { padding: var(--kt-space-md); }
      .p-lg { padding: var(--kt-space-lg); }
      .p-xl { padding: var(--kt-space-xl); }

      /* Tâches */  
      .task-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

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
      }   

      .task.inactive {
        opacity: 0.6;
        border-left-color: #ccc;
      }
      
      .task.out-of-period {
        border-left-color: var(--kt-warning);
        background: #fff8e1;
      }
      
      .task.validated {
        border-left-color: var(--kt-success);
      }
      
      .task.pending {
        border-left: 4px solid var(--kt-status-pending);
        background: #fff3e0;
      }

      .task.on-time, coin-earned {
        border-left: 4px solid var(--kt-status-validated); 
      }
        
      .task.delayed, coin-lost {
        border-left: 4px solid var(--kt-status-failed);
      }
        
      /* Liseret vert pour les tâches réussies dans la carte enfant */
      .task.success-border {
        border-left: 4px solid var(--kt-status-completed); 
      }

      .task-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--kt-space-sm);
      }
      
      .task-main { /* flex-content utility class */ }

      .task-info { flex: 1; }
      .task-icon {
        font-size: 32px;
      }

      .task-meta {
        display: flex;
        gap: var(--kt-space-md);
        align-items: center;
        font-size: var(--kt-font-size-sm);
        color: var(--secondary-text-color, #757575);
      }
      
      .task-description {
        margin-top: var(--kt-space-sm);
        padding: var(--kt-space-sm);
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-space-xs);
        font-size: var(--kt-font-size-sm);
        color: var(--secondary-text-color, #666);
        border-left: 3px solid var(--kt-info);
      }
      
      .task-actions {
        display: flex;
        gap: var(--kt-space-sm);
        margin-top: var(--kt-space-sm);
      }
      
      /* Récompenses */
      .rewards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: var(--kt-space-xs);
        margin-top: var(--kt-space-lg);
      }
      
      .reward-square {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--kt-space-md);
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-space-sm);
        border: 2px solid transparent;
        cursor: pointer;
        transition: all var(--kt-transition-medium);
        position: relative;
        height: 90px;
        text-align: center;
      }
      
      .reward-square:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--kt-shadow-medium);
      }
      
      .reward-square.affordable { border-color: var(--kt-success); }
      .reward-square.expensive { opacity: 0.6; }
      
      .reward-square.cosmetic {
        background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(0,0,0,0.1) 100%);
        border-color: var(--kt-rarity-common);
      }
      
      .reward-square.cosmetic.affordable {
        border-color: var(--kt-coins-color);
        background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(156,39,176,0.1) 100%);
      }
      
      .reward-icon-large {
        font-size: 2.5em;
        margin-bottom: var(--kt-space-sm);
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .reward-name {
        font-weight: 600;
        margin-bottom: var(--kt-space-xs);
        line-height: 1.2;
        font-size: var(--kt-font-size-sm);
      }
      
      .reward-price {
        font-weight: 500;
        color: var(--kt-points-color);
        font-size: var(--kt-font-size-sm);
      }
      
      .reward-level {
        position: absolute;
        top: var(--kt-space-xs);
        right: var(--kt-space-xs);
        background: var(--kt-info);
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 0.7em;
        font-weight: 500;
      }
      
      .reward-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--kt-space-md);
        margin: var(--kt-space-lg) 0;
      }
      
      /* Jauges et statistiques */
      .gauge {
        display: flex;
        flex-direction: column;
        gap: var(--kt-space-xs);
      }
      
      .gauge-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .gauge-label {
        font-size: var(--kt-font-size-xs);
        opacity: 0.9;
        font-weight: 500;
      }
      
      .gauge-bar {
        height: var(--kt-space-sm);
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--kt-space-xs);
        overflow: hidden;
        position: relative;
      }
      
      .gauge-fill {
        height: 100%;
        border-radius: var(--kt-space-xs);
        transition: width 0.6s ease;
      }
      
      .gauge-fill.total-points { background: linear-gradient(90deg, #ffd700, #ffed4a); }
      .gauge-fill.level-progress { background: linear-gradient(90deg, #4facfe, #00f2fe); }
      .gauge-fill.tasks-progress { background: linear-gradient(90deg, #43e97b, #38f9d7); }
      .gauge-fill.coins-progress { background: linear-gradient(90deg, var(--kt-coins-color), #E1BEE7); }
      
      .gauge-text {
        font-size: var(--kt-font-size-xs);
        font-weight: bold;
        opacity: 0.9;
      }
      
      /* Section de jauges */
      .gauges-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-height: 80px;
        justify-content: space-between;
      }
      
      /* Réduire les jauges quand les boutons sont présents */
      .child-card:has(.btn-close) .gauges-section {
        padding-right: 80px;
        max-width: calc(100% - 80px);
      }
      
      /* Stats et métriques */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--kt-space-lg);
        margin: var(--kt-space-lg) 0;
      }
      
      /* Stats compactes sur une ligne */
      .stats-grid-compact {
        display: flex;
        gap: var(--kt-space-md);
        margin: var(--kt-space-lg) 0;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      
      .stat-card.compact {
        display: flex;
        align-items: center;
        gap: var(--kt-space-sm);
        padding: var(--kt-space-sm) var(--kt-space-md);
        flex: 1;
        min-width: 120px;
        flex-direction: row;
      }
      
      .stat-icon.small {
        font-size: 1.2em;
        width: auto;
        height: auto;
      }
      
      .stat-info.compact {
        text-align: left;
        font-size: var(--kt-font-size-sm);
      }
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--kt-space-lg);
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-space-sm);
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      
      .stat-icon { font-size: 2em; margin-bottom: var(--kt-space-sm); }
      .stat-number { 
        font-size: 1.8em; 
        font-weight: bold; 
        color: var(--primary-text-color, #212121);
        line-height: 1.2;
        margin-bottom: 4px;
      }
      .stat-label { color: var(--secondary-text-color, #757575); font-size: var(--kt-font-size-sm); }
      
      /* === COSMÉTIQUES === */
      
      /* Aperçus cosmétiques */
      .cosmetic-avatar-preview { font-size: 1.2em; }
      
      .cosmetic-pixel-art-preview {
        width: 20px;
        height: 20px;
        image-rendering: pixelated;
      }
      
      .background-preview {
        border-radius: var(--kt-radius-round);
        border: 2px solid var(--kt-cosmetic-border);
        background: var(--kt-gradient-neutral); 
        width: 54px; 
        height: 54px; 
      }
      
      .background-preview.large {
        width: 108px; 
        height: 108px;
      }
      
      .cosmetic-outfit-preview {
        position: relative;
        display: inline-block;
      }
      
      .cosmetic-outfit-preview .base-avatar {
        font-size: 1.2em;
      }
      
      .cosmetic-outfit-preview .outfit-overlay {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.8em;
      }
      
      .cosmetic-theme-preview {
        border-radius: var(--kt-space-sm);
        border: 2px solid var(--kt-cosmetic-border);
      }
      
      .avatar-preview {
        font-size: 3em;
      }
      
      .pixel-art-preview {
        max-width: 64px;
        max-height: 64px;
        image-rendering: pixelated;
      }
      
      /* === NOTIFICATIONS === */
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: var(--kt-space-md) var(--kt-space-lg);
        border-radius: var(--kt-space-xs);
        z-index: 10000;
        box-shadow: 0 2px 8px var(--kt-shadow-medium);
        font-family: var(--kt-font-family);
        color: white;
        font-weight: 500;
      }
      
      .notification.success { background: var(--kt-notification-success); }
      .notification.error { background: var(--kt-notification-error); }
      .notification.info { background: var(--kt-notification-info); }
      
      /* === UTILITAIRES === */
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color, #757575);
      }
      
      .empty-state {
        text-align: center;
        padding: var(--kt-space-xl);
        color: var(--secondary-text-color, #757575);
      }
      
      
      .section {
        margin: var(--kt-space-xl) 0;
      }
      
      .section h2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--kt-space-lg);
        font-weight: 600;
        color: var(--primary-text-color, #212121);
      }
      
      .section-actions {
        display: flex;
        gap: var(--kt-space-sm);
      }
      
      .filters {
        display: flex;
        gap: var(--kt-space-sm);
        margin: var(--kt-space-lg) 0;
        flex-wrap: wrap;
      }

    /* Header avec avatar et jauges */
      .header {
        background: linear-gradient(135deg, var(--custom-child-gradient-start, var(--header-color)) 0%, var(--custom-child-gradient-end, var(--secondary-color)) 100%);
        color: var(--custom-child-text-color, var(--header-text-color));
        padding: 10px;
        position: relative;
      }

      .header-content {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }

      /* === RESPONSIVE MOBILE POUR HEADERS === */
      @media (max-width: 600px) {
        .header {
          padding: var(--kt-space-lg);
        }
        
        .task-actions {
          align-self: flex-end;
        }
        
        .rewards-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
      }
      
      @media (max-width: 400px) {
        .rewards-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }
        
        .reward-square {
          padding: var(--kt-space-xs);
          border-radius: 4px;
        }
        
        .reward-square.points-only {
          border-left: 3px solid #4caf50;
        }
        
        .reward-square.coins-only {
          border-left: 3px solid #ffc107;
        }
        
        .reward-square.mixed {
          border-left: 3px solid #9c27b0;
        }
        
        .reward-icon-large {
          font-size: 4em;
          width: 64px;
          height: 64px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Tasks responsive styles */
        .task {
          padding: 6px 8px;
          gap: 8px;
          min-height: 44px;
        }
        
        .task-name {
          font-size: 0.9em;
        }
        
        /* Force les containers à prendre toute la largeur */
        .child-card {
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        .child-card .header {
          width: 100% !important;
          margin: 0 !important;
        }
        
        .child-card .header-content {
          width: 100% !important;
        }
        
        .child-card .gauges-section {
          width: 100% !important;
          flex: 1 !important;
        }

      }

      /* === AFFICHAGE UNIFIÉ DES ENFANTS === */
      .child-card {
        position: relative;
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-radius-lg);
        box-shadow: 0 2px 4px var(--kt-shadow-light);
        overflow: hidden;
        transition: all var(--kt-transition-fast);
        margin-bottom: var(--kt-space-md);
      }
      
      .child-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px var(--kt-shadow-medium);
      }
      
      /* === GRID DASHBOARD 2 COLONNES === */
      .children-dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--kt-space-md);
        margin-top: var(--kt-space-md);
      }
      
      .child-border {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: white;
        z-index: 1;
      }
      
      .drag-handle {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--secondary-text-color);
        cursor: grab;
        font-size: 1.2em;
        z-index: 1;
      }
      
      .drag-handle:active {
        cursor: grabbing;
      }

      /* === COMPOSANTS KT-* POUR SHADOW DOM === */
      ${KidsTasksStyleManager.getCoreKTStyles()}
      
      
      .child-info {
        /* Alias vers kt-child-info */
        display: flex;
        align-items: center;
        gap: var(--kt-space-md);
      }
      
    `;
  }

  // Couche 3: Styles configurables basés sur la config
  getConfigurableStyles() {
    // Cette méthode peut être surchargée dans les classes filles pour gérer les configs spécifiques
    return '';
  }

  // Couche 4: Méthode abstraite pour styles spécifiques
  getSpecificStyles() {
    throw new Error('getSpecificStyles must be implemented by subclass');
  }

  // Assemblage final de tous les styles
  // Méthode commune pour générer les jauges
  renderGauges(stats, compact = false, includeCoins = false, completedToday, totalTasksToday) {
    if (!stats) return '';
    
    const gaugeClass = compact ? 'gauge-compact' : 'gauge';
    const labelClass = compact ? 'gauge-label-compact' : 'gauge-label';
    const textClass = compact ? 'gauge-text-compact' : 'gauge-text';
    const barClass = compact ? 'gauge-bar-compact' : 'gauge-bar';
    const useHeader = !compact; // La version non-compacte utilise gauge-header
    
    // Utiliser les valeurs passées ou celles dans stats
    const completed = completedToday !== undefined ? completedToday : (stats.completedToday || 0);
    const total = totalTasksToday !== undefined ? totalTasksToday : (stats.totalTasksToday || 0);
    
    const renderGauge = (label, text, fillClass, width, barExtra = '') => {
      if (useHeader) {
        return `
          <div class="${gaugeClass}">
            <div class="gauge-header">
              <div class="${labelClass}">${label}</div>
              <div class="${textClass}">${text}</div>
            </div>
            <div class="${barClass}${barExtra}">
              <div class="gauge-fill ${fillClass}" style="width: ${width}%"></div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="${gaugeClass}">
            <div class="${labelClass}">${label}</div>
            <div class="${textClass}">${text}</div>
            <div class="${barClass}">
              <div class="gauge-fill ${fillClass}" style="width: ${width}%"></div>
            </div>
          </div>
        `;
      }
    };
    
    let gaugesHtml = renderGauge(
      'Points totaux', 
      stats.totalPoints, 
      'total-points', 
      Math.min((stats.totalPoints / 500) * 100, 100)
    );
    
    gaugesHtml += renderGauge(
      `Niveau ${stats.level}`, 
      `${stats.pointsInCurrentLevel}/${stats.pointsToNextLevel}`, 
      'level-progress', 
      (stats.pointsInCurrentLevel / stats.pointsToNextLevel) * 100,
      useHeader ? ' circular' : ''
    );
    
    gaugesHtml += renderGauge(
      'Tâches', 
      `${completed}/${total}`, 
      'tasks-progress', 
      total > 0 ? (completed / total) * 100 : 0
    );
    
    // Ajouter la jauge des coins si demandée
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
  
  formatAssignedChildren(task) {
    const childrenNames = this.getAssignedChildrenNames(task);
    if (childrenNames.length === 0) return 'Non assigné';
    if (childrenNames.length === 1) return childrenNames[0];
    return childrenNames.join(', ');
  }
  
  safeGetCategoryIcon(categoryOrItem, fallback = '📋') {
    try {
      if (this.getCategoryIcon && typeof this.getCategoryIcon === 'function') {
        const icon = this.getCategoryIcon(categoryOrItem);
        if (icon && icon !== '') {
          return icon;
        }
      }
    } catch (error) {
      console.warn('Error in getCategoryIcon:', error);
    }
    
    // Provide default icons for common reward categories
    const category = typeof categoryOrItem === 'object' ? categoryOrItem?.category : categoryOrItem;
    const defaultIcons = {
      'leisure': '🎮',
      'outing': '🚶',
      'food': '🍕',
      'toy': '🧸',
      'experience': '🎪',
      'cosmetic': '🎨',
      'gift': '🎁',
      'money': '💰',
      'activity': '⚽',
      'entertainment': '🎬'
    };
    
    return defaultIcons[category] || fallback;
  }
  
  renderIcon(iconData) {
    if (!iconData || iconData === '') return '📋';
    
    try {
      // Si c'est une URL (commence par http:// ou https://)
      if (typeof iconData === 'string' && (iconData.startsWith('http://') || iconData.startsWith('https://'))) {
        return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;" onerror="this.style.display='none'; this.insertAdjacentText('afterend', '📋');">`;
      }
      
      // Si c'est une icône MDI (commence par mdi:)
      if (typeof iconData === 'string' && iconData.startsWith('mdi:')) {
        return `<ha-icon icon="${iconData}" style="width: 1.2em; height: 1.2em;"></ha-icon>`;
      }
      
      // Sinon, traiter comme un emoji ou texte simple
      const iconString = iconData.toString();
      return iconString || '📋';
    } catch (error) {
      console.warn('Error in renderIcon:', error);
      return '📋';
    }
  }

  // Méthode commune pour calculer les statistiques des tâches
  getTasksStatsForGauges(tasks, completedToday) {
    const activeTasks = tasks.filter(task => 
      task.status === 'todo' && 
      this.isTaskActiveToday && this.isTaskActiveToday(task)
    );
    
    const completedTasks = tasks.filter(task => 
      (task.status === 'validated' || task.status === 'completed') &&
      this.isTaskActiveToday && this.isTaskActiveToday(task)
    );
    
    const pendingTasks = tasks.filter(task => 
      task.status === 'pending_validation'
    );
    
    return {
      completedToday: completedToday,
      totalTasksToday: activeTasks.length + completedTasks.length + pendingTasks.length
    };
  }

  // Vérifier si une tâche est active aujourd'hui (méthode partagée)
  isTaskActiveToday(task) {
    if (!task.active && task.active !== undefined) return false;
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = dimanche
    
    // Logique pour la carte enfant
    if (task.frequency) {
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const todayName = dayNames[dayOfWeek];
      
      if (task.frequency === 'daily' && task.weekly_days && task.weekly_days.length > 0) {
        return task.weekly_days.includes(todayName);
      }
      
      return task.frequency === 'daily' || 
             (task.frequency === 'weekly' && dayOfWeek === 1) ||
             (task.frequency === 'monthly' && today.getDate() === 1);
    }
    
    // Logique pour la carte parent
    if (task.days && task.days.length > 0) {
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayName = dayNames[dayOfWeek];
      return task.days.includes(todayName);
    }
    
    return true;
  }

  // Méthode partagée pour calculer les statistiques d'un enfant
  calculateChildStatistics(child, tasks) {
    // Statistiques de base de l'enfant
    const totalPoints = child.points || 0;
    const level = child.level || 1;
    const pointsInCurrentLevel = totalPoints % 100;
    const pointsToNextLevel = level * 100;
    
    // Calculer les tâches complétées aujourd'hui
    const completedToday = tasks.filter(task => 
      (task.status === 'validated' || task.status === 'completed') &&
      this.isTaskActiveToday(task)
    ).length;
    
    // Utiliser la méthode partagée pour les statistiques des jauges
    const taskStats = this.getTasksStatsForGauges(tasks, completedToday);
    
    // Retourner les statistiques communes
    return {
      totalPoints,
      level,
      pointsInCurrentLevel,
      pointsToNextLevel,
      completedToday: taskStats.completedToday,
      totalTasksToday: taskStats.totalTasksToday
    };
  }
  
  isToday(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  getStatusLabel(status) {
    const labels = {
      'todo': 'À faire',
      'in_progress': 'En cours', 
      'completed': 'Terminé',
      'pending_validation': 'En attente',
      'validated': 'Validé',
      'failed': 'Échoué'
    };
    return labels[status] || status;
  }
  
  // Version unifiée de getChildren - utilisée par les deux cartes
  getChildren() {
    if (!this._hass) return [];
    const children = [];
    
    Object.keys(this._hass.states).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const entity = this._hass.states[entityId];
        if (entity && entity.attributes && entity.state !== 'unavailable') {
          children.push({
            id: entity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', ''),
            name: entity.attributes.name || entity.attributes.friendly_name || 'Enfant',
            points: parseInt(entity.state) || 0,
            coins: parseInt(entity.attributes.coins) || 0,
            level: entity.attributes.level || 1,
            avatar: entity.attributes.avatar || '👶',
            avatar_type: entity.attributes.avatar_type || 'emoji',
            avatar_data: entity.attributes.avatar_data,
            person_entity_id: entity.attributes.person_entity_id,
            card_gradient_start: entity.attributes.card_gradient_start,
            card_gradient_end: entity.attributes.card_gradient_end
          });
        }
      }
    });
    
    return children;
  }

  // Méthode unifiée pour afficher les enfants, basée sur le style de la carte enfant
  renderChildCard(child, showActions = false, showDragHandle = false) {
    // Protection contre les enfants undefined/null
    if (!child) {
      return '<div class="child-card"><div class="error">Erreur: enfant non trouvé</div></div>';
    }
    
    try {
      const name = child.name || 'Enfant sans nom';
      const points = child.points || 0;
      const coins = child.coins || 0;
      const progress = ((points % 100) / 100) * 100;
      const pointsToNext = (100 - (points % 100));
      
      // Récupérer les tâches de l'enfant
      const childTasks = this.getTasks().filter(task => 
        task.assigned_child_ids && task.assigned_child_ids.includes(child.id)
      );
      
      // Utiliser la méthode partagée pour calculer les statistiques
      const baseStats = this.calculateChildStatistics(child, childTasks);
      
      // Compléter avec les champs spécifiques à la carte parent
      const stats = {
        ...baseStats,
        points: points,
        coins: coins,
        progress: progress,
        pointsToNext: pointsToNext
      };

      return `
        <div class="child-card kids-tasks-scope" data-child-id="${child.id || 'unknown'}">
          ${showDragHandle ? '<div class="drag-handle">⋮⋮</div>' : ''}
          ${showActions ? '<div class="child-border"></div>' : ''}
          ${showActions ? `<button class="btn-close" data-action="remove-child" data-id="${child.id || 'unknown'}" title="Supprimer l'enfant">×</button>` : ''}
          
          <div class="child-border"></div>
          <div class="header">
            <div class="header-content">
              <div class="kt-avatar-section">
                <div class="kt-child-name-header">${name}</div>
                <div class="kt-avatar-container">
                  <div class="kt-avatar kt-avatar--large">${this.getAvatar(child)}</div>
                  <div class="kt-level-badge">Niveau ${stats.level}</div>
                </div>
              </div>
              
              <div class="gauges-section">
                ${this.renderGauges(stats, false, true)}
              </div>
            </div>
          </div>
          
          ${showActions ? `
            <div class="task-actions" style="flex-direction: column; gap: 4px;">
              <button class="btn btn-info btn-icon history-btn" data-action="show-child-history" data-id="${child.id || 'unknown'}" title="Historique des points">📊</button>
              <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-child" data-id="${child.id || 'unknown'}">Modifier</button>
            </div>
          ` : ''}
        </div>
      `;
    } catch (error) {
      console.error('Erreur dans renderChildCard:', error, 'Child data:', child);
      return `<div class="child-card"><div class="error">Erreur rendu: ${error.message}</div></div>`;
    }
  }


  getStyles() {
    return `<style>
      ${this.getGlobalVariables()}
      ${this.getBaseStyles()}
      ${this.getConfigurableStyles()}
      ${this.getSpecificStyles()}
    </style>`;
  }
}

class KidsTasksCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'dashboard';
  }

  setConfig(config) {
    this.config = config || {};
    this.title = config.title || 'Gestionnaire de Tâches Enfants';
    this.showNavigation = config.show_navigation !== false;
    this.mode = config.mode || 'dashboard'; // 'dashboard' ou 'config'
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Vérifier si les entités enfants ont changé
    const oldChildren = this.getChildrenFromHass(oldHass);
    const newChildren = this.getChildrenFromHass(newHass);
    
    if (oldChildren.length !== newChildren.length) return true;
    
    // Vérifier si les données des enfants ont changé
    for (let i = 0; i < oldChildren.length; i++) {
      const oldChild = oldChildren[i];
      const newChild = newChildren[i];
      if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) {
        return true;
      }
    }
    
    // Vérifier si les tâches ou récompenses ont changé
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    
    if (oldTaskEntities.length !== newTaskEntities.length) return true;
    
    // Vérifier les changements d'état des tâches
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state || 
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }
    
    // Vérifier les récompenses
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

  getChildrenFromHass(hass) {
    const children = [];
    const entities = hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && pointsEntity.state !== 'unavailable') {
          children.push({
            id: pointsEntity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', ''),
            state: pointsEntity.state,
            attributes: pointsEntity.attributes
          });
        }
      }
    });
    
    return children;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    try {
      if (!this._hass) {
        this.shadowRoot.innerHTML = '<div class="loading">Chargement...</div>';
        return;
      }

      this.shadowRoot.innerHTML = `
        ${this.getStyles()}
        <div class="kids-tasks-manager">
          ${this.showNavigation ? this.getNavigation() : ''}
          <div class="content">
            ${this.getCurrentView()}
          </div>
        </div>
      `;
      
      // Attacher les événements drag après le rendu
      this.setupDragAndDrop();
    } catch (error) {
      console.error('Erreur lors du rendu de la carte:', error);
      this.shadowRoot.innerHTML = `
        <div class="error-state" style="padding: 20px; color: red; border: 1px solid red; border-radius: 4px; margin: 10px;">
          <h3>Erreur de rendu de la carte</h3>
          <p>Veuillez vérifier la console pour plus de détails.</p>
          <button onclick="this.closest('kids-tasks-card').render()" style="margin-top: 10px;">Réessayer</button>
        </div>
      `;
    }
  }

  handleClick(event) {
    // Logique spécifique pour les filtres de tâches
    const target = event.target.closest('[data-action]');
    if (target && target.dataset.action === 'filter-tasks') {
      event.preventDefault();
      event.stopPropagation();
      this.handleAction('filter-tasks', target.dataset.filter, event);
      return;
    }
    
    // Déléguer à la classe de base pour le reste
    super.handleClick(event);
  }

  handleAction(action, id = null) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        // Petit délai pour éviter les blocages lors du changement de vue
        setTimeout(() => {
          this.render();
          this.setupDragAndDrop();
        }, 10);
        break;
      case 'add-child':
        this.showChildForm();
        break;
      case 'edit-child':
        this.showChildForm(id);
        break;
      case 'show-child-history':
        this.showChildHistory(id);
        break;
      case 'add-task':
        this.showTaskForm();
        break;
      case 'edit-task':
        this.showTaskForm(id);
        break;
      case 'complete-task':
        const completeChildId = event.target.dataset.childId;
        if (!completeChildId) {
          this.showNotification('Erreur: ID enfant manquant', 'error');
          return;
        }
        this.callService('kids_tasks', 'complete_task', { 
          task_id: id, 
          child_id: completeChildId 
        });
        break;
      case 'validate-task':
        this.callService('kids_tasks', 'validate_task', { task_id: id });
        break;
      case 'reject-task':
        this.callService('kids_tasks', 'reject_task', { task_id: id });
        break;
      case 'add-reward':
        this.showRewardForm();
        break;
      case 'edit-reward':
        this.showRewardForm(id);
        break;
      case 'remove-child':
        const child = this.getChildById(id);
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
            child_id: id,
            force_remove_entities: true 
          });
        }
        break;
      case 'remove-task':
        const task = this.getTaskById(id);
        const taskName = task ? task.name : 'cette tâche';
        const assignedChildren = task ? this.formatAssignedChildren(task) : 'Aucun enfant assigné';
        
        const confirmTaskMessage = `Êtes-vous sûr de vouloir supprimer "${taskName}" ?\n\n` +
                                  `Informations sur la tâche :\n` +
                                  `• Nom : ${taskName}\n` +
                                  `• Points : ${task ? task.points : 0} 🎫\n` +
                                  `• Assignée à : ${assignedChildren}\n` +
                                  `• Catégorie : ${task ? this.getCategoryLabel(task.category) : 'Inconnue'}\n` +
                                  `• Fréquence : ${task ? this.getFrequencyLabel(task.frequency) : 'Inconnue'}\n\n` +
                                  `Cette action supprimera définitivement :\n` +
                                  `• La tâche et sa configuration\n` +
                                  `• Tout l'historique de completion\n` +
                                  `• Tous les capteurs associés\n\n` +
                                  `Cette action est IRRÉVERSIBLE !`;
        
        if (confirm(confirmTaskMessage)) {
          this.callService('kids_tasks', 'remove_task', { task_id: id });
        }
        break;
      case 'remove-reward':
        const reward = this.getRewardById(id);
        const rewardName = reward ? reward.name : 'cette récompense';
        
        const confirmRewardMessage = `Êtes-vous sûr de vouloir supprimer "${rewardName}" ?\n\n` +
                                    `Informations sur la récompense :\n` +
                                    `• Nom : ${rewardName}\n` +
                                    `• Coût : ${reward ? reward.cost : 0} 🎫\n` +
                                    `• Catégorie : ${reward ? this.getCategoryLabel(reward.category) : 'Inconnue'}\n` +
                                    `• Quantité limitée : ${reward && reward.limited_quantity ? `${reward.remaining_quantity}/${reward.limited_quantity}` : 'Non'}\n` +
                                    `• Description : ${reward && reward.description ? reward.description : 'Aucune'}\n\n` +
                                    `Cette action supprimera définitivement :\n` +
                                    `• La récompense et sa configuration\n` +
                                    `• Tout l'historique d'échange\n` +
                                    `• Tous les capteurs associés\n\n` +
                                    `Cette action est IRRÉVERSIBLE !`;
        
        if (confirm(confirmRewardMessage)) {
          this.callService('kids_tasks', 'remove_reward', { reward_id: id });
        }
        break;
      case 'filter-tasks':
        // Utiliser l'ID passé (qui contient le filtre)
        if (id) {
          this.taskFilter = id;
          this.render();
        }
        break;
        
      case 'filter-children':
        // Filtrer les enfants par ID
        if (id) {
          this.childFilter = id;
          this.render();
        }
        break;
        
      case 'load-cosmetics-catalog':
        if (!this._hass) {
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        try {
          this._hass.callService('kids_tasks', 'load_cosmetics_catalog', {})
            .then(() => {
              this.showNotification('Catalogue cosmétique chargé avec succès ! 📚', 'success');
            })
            .catch(error => {
              this.showNotification('Erreur lors du chargement du catalogue : ' + error.message, 'error');
            });
          this.showNotification('Chargement du catalogue cosmétique...', 'info');
        } catch (error) {
          this.showNotification('Erreur : ' + error.message, 'error');
        }
        break;
        
      case 'create-cosmetic-rewards':
        if (!this._hass) {
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        try {
          this._hass.callService('kids_tasks', 'create_cosmetic_rewards', {})
            .then(() => {
              this.showNotification('Récompenses cosmétiques créées avec succès ! 🎆', 'success');
              // Rafraîchir la vue pour afficher les nouvelles récompenses
              setTimeout(() => this.render(), 1000);
            })
            .catch(error => {
              this.showNotification('Erreur lors de la création des récompenses : ' + error.message, 'error');
            });
          this.showNotification('Création des récompenses cosmétiques...', 'info');
        } catch (error) {
          this.showNotification('Erreur : ' + error.message, 'error');
        }
        break;
        
      case 'give-cosmetic':
        const giveButton = event.target;
        const giveCosmeticId = giveButton.dataset.cosmeticId;
        const select = giveButton.parentElement.querySelector('.cosmetic-give-select');
        const selectedChildId = select.value;
        
        if (!selectedChildId) {
          this.showNotification('Veuillez sélectionner un enfant', 'error');
          return;
        }
        
        if (!this._hass) {
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        
        try {
          this._hass.callService('kids_tasks', 'claim_reward', {
            child_id: selectedChildId,
            reward_id: giveCosmeticId
          })
          .then(() => {
            const cosmetic = this.getRewards().find(r => r.id === giveCosmeticId);
            const child = this.getChildren().find(c => c.id === selectedChildId);
            this.showNotification(`${cosmetic?.name || 'Cosmétique'} donné à ${child?.name || 'l\'enfant'} ! 🎁`, 'success');
            select.value = ''; // Reset selection
          })
          .catch(error => {
            console.error('Erreur lors du don du cosmétique:', error);
            this.showNotification('Erreur lors du don : ' + error.message, 'error');
          });
        } catch (error) {
          console.error('Erreur lors du don du cosmétique:', error);
          this.showNotification('Erreur lors du don du cosmétique', 'error');
        }
        break;
        
      case 'activate-cosmetic':
        const targetChildId = target.dataset.childId;
        const cosmeticType = target.dataset.cosmeticType;
        const activeCosmeticId = target.dataset.cosmeticId;
        
        if (!this._hass) {
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        
        this._hass.callService('kids_tasks', 'activate_cosmetic', {
          child_id: targetChildId,
          cosmetic_type: cosmeticType,
          cosmetic_id: activeCosmeticId
        });
        this.showNotification(`Cosmétique ${cosmeticType} activé ! 🎨`, 'success');
        break;
    }
  }

  // === DRAG & DROP ===

  setupDragAndDrop() {
    // Attendre que le DOM soit complètement mis à jour
    setTimeout(() => {
      // Seulement attacher les événements drag dans la vue "children" où il y a des cartes draggables
      if (this.currentView === 'children') {
        this.attachDragEvents();
      }
    }, 100); // Délai plus long pour s'assurer que le DOM est rendu
  }

  attachDragEvents() {
    const draggableCards = this.shadowRoot.querySelectorAll('.child-card[draggable="true"]');
    const container = this.shadowRoot.querySelector('.children-grid');
    
    // Si pas de cartes draggables, pas besoin de continuer
    if (draggableCards.length === 0) {
      return;
    }
    
    // Nettoyer les anciens listeners
    if (container) {
      container.removeEventListener('dragenter', this.handleDragEnter);
      container.removeEventListener('dragover', this.handleDragOver);
      container.removeEventListener('drop', this.handleDrop);
    }
    
    draggableCards.forEach(card => {
      // Supprimer les anciens listeners pour éviter les doublons
      card.removeEventListener('dragstart', this.handleDragStart);
      card.removeEventListener('dragend', this.handleDragEnd);
      card.removeEventListener('dragenter', this.handleDragEnter);
      card.removeEventListener('dragover', this.handleDragOver);
      card.removeEventListener('drop', this.handleDrop);
      
      // Ajouter les nouveaux listeners
      card.addEventListener('dragstart', this.handleDragStart.bind(this));
      card.addEventListener('dragend', this.handleDragEnd.bind(this));
      card.addEventListener('dragenter', this.handleDragEnter.bind(this));
      card.addEventListener('dragover', this.handleDragOver.bind(this));
      card.addEventListener('drop', this.handleDrop.bind(this));
      
      // Empêcher le drag depuis les boutons
      const buttons = card.querySelectorAll('button');
      buttons.forEach(button => {
        button.addEventListener('mousedown', (e) => e.stopPropagation());
        button.addEventListener('dragstart', (e) => e.preventDefault());
      });
    });
    
    // Ajouter les événements dragover et drop au conteneur
    if (container) {
      container.addEventListener('dragenter', this.handleDragEnter.bind(this));
      container.addEventListener('dragover', this.handleDragOver.bind(this));
      container.addEventListener('drop', this.handleDrop.bind(this));
    } 
  }

  handleDragStart(event) {
    const card = event.target.closest('.child-card');
    if (!card) {
      return;
    }
    
    const childId = card.getAttribute('data-child-id');
    event.dataTransfer.setData('text/plain', childId);
    event.dataTransfer.effectAllowed = 'move';
    
    card.classList.add('dragging');
    this.draggedElement = card;
  }

  handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    
    // Nettoyer toutes les indications visuelles existantes
    const allCards = this.shadowRoot.querySelectorAll('.child-card');
    allCards.forEach(c => {
      c.classList.remove('drop-before', 'drop-after');
    });
    
    const card = event.target.closest('.child-card');
    if (!card || card === this.draggedElement) {
      return;
    }
    
    // Ajouter une indication visuelle
    const rect = card.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    
    if (event.clientY < midY) {
      card.classList.add('drop-before');
      card.classList.remove('drop-after');
    } else {
      card.classList.add('drop-after');
      card.classList.remove('drop-before');
    }
  }

  handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const draggedChildId = event.dataTransfer.getData('text/plain');
    const dropCard = event.target.closest('.child-card');
    
    if (!dropCard || !draggedChildId) {
      this.cleanupDragStyles();
      return;
    }
    
    const targetChildId = dropCard.getAttribute('data-child-id');
    if (draggedChildId === targetChildId) {
      this.cleanupDragStyles();
      return;
    }
    
    // Déterminer la position (avant ou après)
    const rect = dropCard.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const dropBefore = event.clientY < midY;
    
    this.reorderChildren(draggedChildId, targetChildId, dropBefore);
    
    // Nettoyer les classes CSS
    this.cleanupDragStyles();
  }

  handleDragEnd(event) {
    this.cleanupDragStyles();
    this.draggedElement = null;
  }

  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  cleanupDragStyles() {
    const cards = this.shadowRoot.querySelectorAll('.child-card');
    cards.forEach(card => {
      card.classList.remove('dragging', 'drop-before', 'drop-after');
    });
  }

  reorderChildren(draggedId, targetId, dropBefore) {
    const currentOrder = this.config.children_order || [];
    const children = this.getChildren();
    
    // Créer un nouvel ordre basé sur l'ordre d'affichage actuel
    const displayOrder = children.map(child => child.id);
    
    // Supprimer l'élément déplacé
    const draggedIndex = displayOrder.indexOf(draggedId);
    if (draggedIndex !== -1) {
      displayOrder.splice(draggedIndex, 1);
    }
    
    // Trouver la nouvelle position
    const targetIndex = displayOrder.indexOf(targetId);
    const insertIndex = dropBefore ? targetIndex : targetIndex + 1;
    
    // Insérer à la nouvelle position
    displayOrder.splice(insertIndex, 0, draggedId);
    
    // Mettre à jour la configuration
    this.config = { ...this.config, children_order: displayOrder };
    
    // Déclencher la mise à jour de la configuration
    if (this.configChanged) {
      this.configChanged(this.config);
    }
    
    // Re-rendre immédiatement
    this.render();
    this.setupDragAndDrop();
  }

  // === SERVICE CALLS ET ACTIONS ===

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
    console.log('submitChildForm called, isEdit:', isEdit);
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) {
      console.error('No dialog found');
      return;
    }
    const form = dialog.querySelector('form');
    if (!form) {
      console.error('No form found in dialog');
      return;
    }
    
    // Récupérer les valeurs des composants HA
    const name = form.querySelector('[name="name"]').value;
    const person_entity_id = form.querySelector('[name="person_entity_id"]')?.value || null;
    const avatar_type = form.querySelector('[name="avatar_type"]').value;
    const card_gradient_start = form.querySelector('[name="card_gradient_start"]')?.value || null;
    const card_gradient_end = form.querySelector('[name="card_gradient_end"]')?.value || null;
    
    let avatar_data = null;
    let avatar = '👶';

    // Déterminer les données d'avatar selon le type
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

    // Ajouter seulement les champs non-null
    if (person_entity_id) serviceData.person_entity_id = person_entity_id;
    if (avatar_data) serviceData.avatar_data = avatar_data;
    if (card_gradient_start) serviceData.card_gradient_start = card_gradient_start;
    if (card_gradient_end) serviceData.card_gradient_end = card_gradient_end;

    if (!isEdit) {
      serviceData.initial_points = parseInt(form.querySelector('[name="initial_points"]')?.value || '0');
    }

    try {
      if (isEdit) {
        const childId = form.querySelector('[name="child_id"]').value;
        serviceData.child_id = childId;
        
        // Récupérer les nouvelles valeurs pour niveau, points et coins
        const newLevel = parseInt(form.querySelector('[name="level"]')?.value || '1');
        const newPoints = parseInt(form.querySelector('[name="points"]')?.value || '0');
        const newCoins = parseInt(form.querySelector('[name="coins"]')?.value || '0');
        
        // Trouver l'enfant actuel pour comparer les valeurs
        const children = this.getChildren();
        const currentChild = children.find(c => c.id === childId);
        
        console.log('Calling update_child with:', serviceData);
        const success = await this.callService('kids_tasks', 'update_child', serviceData);
        console.log('update_child result:', success);
        
        if (success && currentChild) {
          // Calculer la différence totale de points (incluant le changement de niveau)
          let finalPointsDiff = newPoints - (currentChild.points || 0);
          const coinsDiff = newCoins - (currentChild.coins || 0);
          
          // Si le niveau change, ajuster les points pour le nouveau niveau
          const currentLevel = currentChild.level || 1;
          if (newLevel !== currentLevel) {
            // Calculer les points de base pour le nouveau niveau
            const newLevelBasePoints = (newLevel - 1) * 100;
            const currentLevelBasePoints = (currentLevel - 1) * 100;
            const levelPointsDiff = newLevelBasePoints - currentLevelBasePoints;
            finalPointsDiff += levelPointsDiff;
          }
          
          // Appliquer les changements de points et coins
          if (finalPointsDiff !== 0 || coinsDiff !== 0) {
            console.log(`Adjusting currency: points=${finalPointsDiff}, coins=${coinsDiff}`);
            await this.callService('kids_tasks', 'add_currency', {
              child_id: childId,
              points: finalPointsDiff,
              coins: coinsDiff
            });
          }
          
          console.log('Closing dialog...');
          setTimeout(() => {
            if (dialog && dialog.close) {
              console.log('Dialog still exists, closing...');
              this.closeModal(dialog);
            } else {
              console.log('Dialog no longer exists or cannot be closed');
            }
          }, 500);
        }
      } else {
        console.log('Calling add_child with:', serviceData);
        const success = await this.callService('kids_tasks', 'add_child', serviceData);
        console.log('add_child result:', success);
        if (success) {
          console.log('Closing dialog...');
          // Délai pour s'assurer que la notification est affichée avant fermeture
          setTimeout(() => {
            if (dialog && dialog.close) {
              console.log('Dialog still exists, closing...');
              this.closeModal(dialog);
            } else {
              console.log('Dialog no longer exists or cannot be closed');
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error in submitChildForm:', error);
    }
  }

  async submitTaskForm(dialog, isEdit = false) {
    const form = dialog.querySelector('form');
    
    // Récupérer les valeurs des composants HA
    const name = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]').value || '';
    const icon = form.querySelector('[name="icon"]').value || null;
    const categorySelect = form.querySelector('[name="category"]');
    const category = categorySelect.value || categorySelect.getAttribute('value') || 'other';
    const points = parseInt(form.querySelector('[name="points"]').value);
    const coins = parseInt(form.querySelector('[name="coins"]').value) || 0;
    const frequencySelect = form.querySelector('[name="frequency"]');
    const frequency = frequencySelect.value || frequencySelect.getAttribute('value') || 'daily';
    // Récupérer les enfants assignés (checkboxes)
    const allChildCheckboxes = form.querySelectorAll('[name="assigned_child_ids"]');
    const assigned_child_ids = Array.from(allChildCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value)
      .filter(v => v);
    
    const validation_required = form.querySelector('[name="validation_required"]').checked;
    
    // Récupérer les jours sélectionnés pour les tâches journalières - Méthode corrigée pour ha-checkbox
    const allWeeklyDaysCheckboxes = form.querySelectorAll('[name="weekly_days"]');
    const weekly_days = Array.from(allWeeklyDaysCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    
    // Récupérer l'heure limite et la pénalité
    const deadline_time = form.querySelector('[name="deadline_time"]').value || null;
    const penalty_points = parseInt(form.querySelector('[name="penalty_points"]').value) || 0;
    
    const serviceData = {
      name,
      description,
      category,
      icon,
      points,
      frequency,
      validation_required
    };
    
    // Ajouter deadline_time seulement s'il est défini
    if (deadline_time) {
      serviceData.deadline_time = deadline_time;
    }
    
    // Ajouter penalty_points seulement s'il est > 0
    if (penalty_points > 0) {
      serviceData.penalty_points = penalty_points;
    }
    
    // Ajouter coins seulement s'ils sont > 0
    if (coins > 0) {
      serviceData.coins = coins;
    }
    
    // Ajouter l'assignation
    if (assigned_child_ids.length > 0) {
      serviceData.assigned_child_ids = assigned_child_ids;
    }
    
    // Toujours ajouter weekly_days (même si vide pour permettre la mise à jour)
    serviceData.weekly_days = weekly_days;

    if (isEdit) {
      const taskIdInput = form.querySelector('[name="task_id"]');
      serviceData.task_id = taskIdInput ? taskIdInput.value : null;
      
      const activeCheckbox = form.querySelector('[name="active"]');
      serviceData.active = activeCheckbox ? activeCheckbox.checked : true;
      
      if (await this.callService('kids_tasks', 'update_task', serviceData)) {
        this.closeModal(dialog);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_task', serviceData)) {
        this.closeModal(dialog);
      }
    }
  }

  async submitRewardForm(dialog, isEdit = false) {
    const form = dialog.querySelector('form');
    
    // Récupérer les valeurs des composants HA
    const name = form.querySelector('[name="name"]').value;
    const description = form.querySelector('[name="description"]').value || '';
    const icon = form.querySelector('[name="icon"]').value || null;
    const cost = parseInt(form.querySelector('[name="cost"]').value) || 0;
    const coin_cost = parseInt(form.querySelector('[name="coin_cost"]').value) || 0;
    
    // Validation : une récompense doit avoir au moins un coût (points ou coins)
    if (cost === 0 && coin_cost === 0) {
      alert('Une récompense doit coûter au moins 1 point ou 1 coin.');
      return;
    }
    
    const categorySelect = form.querySelector('[name="category"]');
    const category = categorySelect.value || categorySelect.getAttribute('value') || 'fun';
    const limitedQuantityInput = form.querySelector('[name="limited_quantity"]');
    const limited_quantity = limitedQuantityInput.value ? parseInt(limitedQuantityInput.value) : null;
    
    const serviceData = {
      name,
      description,
      cost,
      coin_cost,
      category,
      limited_quantity
    };
    
    // N'inclure l'icône que si elle est définie
    if (icon) {
      serviceData.icon = icon;
    }

    if (isEdit) {
      const rewardIdInput = form.querySelector('[name="reward_id"]');
      serviceData.reward_id = rewardIdInput ? rewardIdInput.value : null;
      
      const activeCheckbox = form.querySelector('[name="active"]');
      serviceData.active = activeCheckbox ? activeCheckbox.checked : true;
      
      if (await this.callService('kids_tasks', 'update_reward', serviceData)) {
        this.closeModal(dialog);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_reward', serviceData)) {
        this.closeModal(dialog);
      }
    }
  }

  async submitClaimForm(dialog) {
    const form = dialog.querySelector('form');
    
    // Récupérer les valeurs des composants HA
    const rewardIdInput = form.querySelector('[name="reward_id"]');
    const reward_id = rewardIdInput ? rewardIdInput.value : null;
    const child_id = form.querySelector('[name="child_id"]').value;
    
    const serviceData = {
      reward_id,
      child_id
    };

    if (await this.callService('kids_tasks', 'claim_reward', serviceData)) {
      this.closeModal(dialog);
    }
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
          display: flex
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
      </style>
      <div class="kids-tasks-scope">
        ${content}
      </div>
    `;
    
    // Stocker la référence à this dans le dialog
    dialog._cardInstance = this;
    
    dialog.appendChild(contentDiv);
    document.body.appendChild(dialog);
    
    // Ouvrir immédiatement et laisser les composants s'initialiser naturellement
    dialog.show();
    
    return dialog;
  }

  showChildForm(editChildId = null) {
    const children = this.getChildren();
    const child = editChildId ? children.find(c => c.id === editChildId) : null;
    const isEdit = !!child;
    const persons = this.getPersonEntities();

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="child_id" value="${child.id}">` : ''}
        
        <ha-textfield
          label="Nom de l'enfant *"
          name="name"
          required
          value="${isEdit ? child.name : ''}"
          placeholder="Prénom de l'enfant">
        </ha-textfield>

        ${persons.length > 0 ? `
          <ha-select
            label="Lier à une personne (optionnel)"
            name="person_entity_id"
            value="${isEdit && child.person_entity_id ? child.person_entity_id : ''}">
            <ha-list-item value="">Aucune liaison</ha-list-item>
            ${persons.map(person => `
              <ha-list-item value="${person.entity_id}" ${isEdit && child.person_entity_id === person.entity_id ? 'selected' : ''}>
                ${person.name}
              </ha-list-item>
            `).join('')}
          </ha-select>
        ` : ''}

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
              max="100">
            </ha-textfield>
            <ha-textfield
              label="Points"
              name="points"
              type="number"
              value="${child.points || 0}"
              min="0"
              max="10000">
            </ha-textfield>
            <ha-textfield
              label="🪙"
              name="coins"
              type="number"
              value="${child.coins || 0}"
              min="0"
              max="1000">
            </ha-textfield>
          </div>
        `}

        <div class="dialog-actions">
          <ha-button onclick="this.closest('ha-dialog').close()">Annuler</ha-button>
          <ha-button onclick="this.closest('ha-dialog')._cardInstance.submitChildForm(${isEdit})" class="primary">${isEdit ? 'Modifier' : 'Ajouter'}</ha-button>
        </div>
      </form>

    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant');
    
    // Attendre que le modal soit rendu et ajouter les event listeners
    setTimeout(() => {
      // Gérer le changement de type d'avatar
      const avatarTypeSelect = dialog.querySelector('ha-select[name="avatar_type"]');
      const avatarConfig = dialog.querySelector('#avatar-config');
      
      if (avatarTypeSelect && avatarConfig) {
        // Fonction pour mettre à jour l'affichage des sections d'avatar
        const updateAvatarDisplay = (selectedType) => {
          avatarConfig.querySelectorAll('[id$="-config"]').forEach(div => {
            div.style.display = 'none';
          });
          const targetDiv = dialog.querySelector('#' + selectedType + '-config');
          if (targetDiv) {
            targetDiv.style.display = 'block';
          }
        };
        
        // Event listener pour ha-select
        avatarTypeSelect.addEventListener('selected', (e) => {
          const selectedType = e.detail.value || e.target.value;
          updateAvatarDisplay(selectedType);
        });
        
        // Event listener alternatif pour change
        avatarTypeSelect.addEventListener('change', (e) => {
          const selectedType = e.target.value;
          updateAvatarDisplay(selectedType);
        });

        // Gérer la sélection d'emoji
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

  async showChildHistory(childId) {
    if (!childId) {
      console.error('ID enfant manquant pour l\'affichage de l\'historique');
      return;
    }

    // Récupérer les données de l'enfant
    const children = this.getChildren();
    const child = children.find(c => c.id === childId);
    
    if (!child) {
      console.error(`Enfant avec l'ID ${childId} introuvable`);
      return;
    }

    // Récupérer l'historique via le service backend
    let historyData = [];
    try {
      await this._hass.callService('kids_tasks', 'get_child_history', {
        child_id: childId,
        limit: 20
      });
      
      // Fallback to sensor data since services don't return data directly
      const historyEntityId = `sensor.kidtasks_${child.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_points_history`;
      const historyEntity = this._hass.states[historyEntityId];
      
      if (historyEntity && historyEntity.attributes && historyEntity.attributes.points_history) {
        historyData = historyEntity.attributes.points_history;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      // Fallback to sensor if service fails
      const historyEntityId = `sensor.kidtasks_${child.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_points_history`;
      const historyEntity = this._hass.states[historyEntityId];
      
      if (historyEntity && historyEntity.attributes && historyEntity.attributes.points_history) {
        historyData = historyEntity.attributes.points_history;
      }
    }

    const content = `
      <div class="child-history-container">
        <div class="history-header">
          <div class="kt-child-info">
            <div class="kt-avatar-section">
              <div class="kt-child-name-header">${child.name}</div>
              <div class="kt-avatar-container">
                <div class="kt-avatar kt-avatar--large">${this.getAvatar(child)}</div>
                <div class="kt-level-badge">Niveau ${child.level || 1}</div>
              </div>
            </div>
            <div class="kt-child-details">
              <div class="current-stats">
                <span class="stat">${child.points || 0} 🎫</span>
                <span class="stat">${child.coins || 0} 🪙</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="history-content">
          ${historyData.length > 0 ? `
            <div class="history-list">
              ${historyData.map(entry => this.renderHistoryEntry(entry)).join('')}
            </div>
          ` : `
            <div class="empty-history">
              <div class="empty-icon">📈</div>
              <p>Aucun historique disponible</p>
              <small>Les actions sur les points apparaîtront ici</small>
            </div>
          `}
        </div>
        
        <div class="dialog-actions">
          <ha-button onclick="this.closest('ha-dialog').close()">Fermer</ha-button>
        </div>
      </div>
    `;

    this.showModal(content, `Historique - ${child.name}`);
  }

  renderHistoryEntry(entry) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const pointsDisplay = entry.points_delta > 0 ? `+${entry.points_delta}` : `${entry.points_delta}`;
    const pointsClass = entry.points_delta > 0 ? 'plus' : 'minus';
    const actionIcon = this.getActionIcon(entry.action_type);

    return `
      <div class="history-entry">
        <div class="entry-title">
          <div class="entry-icon">${actionIcon}</div>
          <div class="entry-description">${entry.description || 'Action inconnue'}</div>
        </div>
        <div class="entry-content">
          <div class="entry-points ${pointsClass}">${pointsDisplay} 🎫</div>  
          <span class="entry-type">${this.getActionTypeLabel(entry.action_type)}</span>
          <span class="entry-date">(${dateStr} à ${timeStr})</span>
        </div>
      </div>
    `;
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
      'task_completed': 'Tâche terminée',
      'task_validated': 'Tâche validée',
      'task_penalty': 'Pénalité',
      'reward_claimed': 'Récompense',
      'manual_adjustment': 'Ajustement',
      'level_up': 'Montée niveau',
      'bonus_points': 'Points bonus',
      'default': 'Autre'
    };
    return labels[actionType] || labels['default'];
  }

  showTaskForm(taskId = null) {
    const tasks = this.getTasks();
    const children = this.getChildren();
    const task = taskId ? tasks.find(t => t.id === taskId) : null;
    const isEdit = !!task;

    const categories = this.getAvailableCategories();
    const frequencies = this.getAvailableFrequencies();

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="task_id" value="${task.id}">` : ''}
        
        <ha-textfield
          label="Nom de la tâche *"
          name="name" 
          required
          value="${isEdit ? task.name : ''}"
          placeholder="Ex: Ranger sa chambre">
        </ha-textfield>
        
        <ha-textarea
          label="Description"
          name="description"
          placeholder="Description détaillée de la tâche..."
          value="${isEdit ? task.description || '' : ''}">
        </ha-textarea>
        
        <ha-textfield
          label="Icône personnalisée (optionnel)"
          name="icon"
          value="${isEdit ? task.icon || '' : ''}"
          placeholder="Ex: 🧹, mdi:broom, https://example.com/icon.png">
        </ha-textfield>

        <div class="form-row">
          <ha-select 
            label="Catégorie *"
            name="category"
            required>
            ${categories.map(cat => `
              <ha-list-item value="${cat}" ${(!isEdit && cat === 'other') || (isEdit && task.category === cat) ? 'selected' : ''}>
                ${this.getCategoryLabel(cat)}
              </ha-list-item>
            `).join('')}
          </ha-select>
          <ha-select
            label="Fréquence *"
            name="frequency"
            required>
            ${frequencies.map(freq => `
              <ha-list-item value="${freq}" ${(!isEdit && freq === 'daily') || (isEdit && task.frequency === freq) ? 'selected' : ''}>
                ${this.getFrequencyLabel(freq)}
              </ha-list-item>
            `).join('')}
          </ha-select>
        </div>
        <div class="form-row">
          <ha-textfield
            label="Points *"
            name="points"
            type="number"
            required
            value="${isEdit ? task.points : '10'}"
            min="1"
            max="100">
          </ha-textfield>
          <ha-textfield
            label="Coins"
            name="coins"
            type="number"
            value="${isEdit ? task.coins || '0' : '0'}"
            min="0"
            max="50"
            helper-text="Coins attribués en bonus">
          </ha-textfield>
          <ha-textfield
            label="Points de pénalité"
            name="penalty_points"
            type="number"
            value="${isEdit ? task.penalty_points || '0' : '0'}"
            min="0"
            max="50"
            helper-text="Points retirés si l'heure limite est dépassée">
          </ha-textfield>
        </div>
        <div class="form-row">
          <ha-textfield
            label="Heure limite (optionnel)"
            name="deadline_time"
            type="time"
            value="${isEdit ? task.deadline_time || '' : ''}"
            placeholder="Ex: 18:00">
          </ha-textfield>
          ${isEdit ? `
          <ha-formfield label="Tâche active">
            <ha-checkbox 
              name="active"
              ${task.active !== false ? 'checked' : ''}>
            </ha-checkbox>
          </ha-formfield>
        ` : ''}
          <ha-formfield label="Validation parentale">
            <ha-checkbox 
              name="validation_required"
              ${isEdit ? (task.validation_required ? 'checked' : '') : 'checked'}>
            </ha-checkbox>
          </ha-formfield>
        </div>

        <!-- Conteneur pour enfants et jours côte à côte -->
        <div class="form-row">
          <!-- Enfants assignés -->
          <div class="form-group children-column">
            <div class="children-section">
              <label class="form-label">Enfants assignés</label>
              ${children.map(child => {
                let isChecked = false;
                if (isEdit) {
                  // Vérifier dans assigned_child_ids
                  const assignedIds = task.assigned_child_ids || [];
                  isChecked = assignedIds.includes(child.id);
                }
                return `
                  <label class="child-checkbox">
                    <ha-checkbox 
                      name="assigned_child_ids" 
                      value="${child.id}"
                      ${isChecked ? 'checked' : ''}>
                    </ha-checkbox>
                    <span class="child-label">${child.name}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Jours de la semaine -->
          <div class="form-group days-column">
            <div class="weekly-days-section" style="display: ${(!isEdit && 'daily' === 'daily') || (isEdit && task.frequency === 'daily') ? 'block' : 'none'};">
              <label class="form-label">Jours de la semaine:<br><small>(optionnel, tous si aucun sélectionné)</small></label>
              <div class="days-selector">
                ${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
                  const labels = {
                    'mon': 'Lundi', 'tue': 'Mardi', 'wed': 'Mercredi', 'thu': 'Jeudi', 
                    'fri': 'Vendredi', 'sat': 'Samedi', 'sun': 'Dimanche'
                  };
                  const isSelected = isEdit && task.weekly_days && task.weekly_days.includes(day);
                  return `
                    <label class="day-checkbox">
                      <ha-checkbox 
                        name="weekly_days" 
                        value="${day}"
                        ${isSelected ? 'checked' : ''}>
                      </ha-checkbox>
                      <span class="day-label">${labels[day]}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
               
        <div class="dialog-actions">
          <ha-button 
            slot="secondaryAction" 
            onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button 
            slot="primaryAction"
            raised
            onclick="this.closest('ha-dialog')._cardInstance.submitTaskForm(this.closest('ha-dialog'), ${isEdit})">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier la tâche' : 'Créer une tâche');
    
    // Ajouter les event listeners après affichage du modal
    setTimeout(() => {
      const frequencySelect = dialog.querySelector('[name="frequency"]');
      const weeklyDaysSection = dialog.querySelector('.weekly-days-section');
      const penaltyPointsField = dialog.querySelector('[name="penalty_points"]');
      const deadlineTimeField = dialog.querySelector('[name="deadline_time"]')?.parentElement;
      
      if (frequencySelect && weeklyDaysSection) {
        // Fonction pour afficher/masquer la section des jours et les champs liés
        const toggleFields = (frequency) => {
          const isDaily = frequency === 'daily';
          const isBonus = frequency === 'none';
          
          // Afficher/masquer la section des jours (seulement pour daily)
          weeklyDaysSection.style.display = isDaily ? 'block' : 'none';
          
          // Masquer SEULEMENT les points de pénalité et l'heure limite pour les tâches bonus
          // Les points et coins principaux restent TOUJOURS visibles
          if (penaltyPointsField) {
            penaltyPointsField.style.display = isBonus ? 'none' : 'block';
          }
          if (deadlineTimeField) {
            deadlineTimeField.style.display = isBonus ? 'none' : 'block';
          }
        };
        
        // Event listeners pour ha-select
        frequencySelect.addEventListener('selected', (e) => {
          const selectedFreq = e.detail.value || e.target.value;
          toggleFields(selectedFreq);
        });
        
        frequencySelect.addEventListener('change', (e) => {
          const selectedFreq = e.target.value;
          toggleFields(selectedFreq);
        });
        
        // Initialiser l'affichage selon la fréquence actuelle
        const currentFrequency = isEdit ? task.frequency : 'daily';
        toggleFields(currentFrequency);
      }
      
      // Ajouter les event listeners pour les checkboxes cliquables
      // Enfants
      dialog.querySelectorAll('.child-checkbox').forEach(label => {
        label.addEventListener('click', (e) => {
          // Empêcher la propagation double si on clique directement sur la checkbox
          if (e.target.tagName.toLowerCase() === 'ha-checkbox') return;
          
          const checkbox = label.querySelector('ha-checkbox');
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            // Déclencher l'événement change pour la cohérence
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
      
      // Jours
      dialog.querySelectorAll('.day-checkbox').forEach(label => {
        label.addEventListener('click', (e) => {
          // Empêcher la propagation double si on clique directement sur la checkbox
          if (e.target.tagName.toLowerCase() === 'ha-checkbox') return;
          
          const checkbox = label.querySelector('ha-checkbox');
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
            // Déclencher l'événement change pour la cohérence
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    }, 100);
  }

  showRewardForm(rewardId = null) {
    const rewards = this.getRewards();
    const reward = rewardId ? rewards.find(r => r.id === rewardId) : null;
    const isEdit = !!reward;

    const categories = this.getAvailableRewardCategories();

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="reward_id" value="${reward.id}">` : ''}
        
        <ha-textfield
          label="Nom de la récompense *"
          name="name"
          required
          value="${isEdit ? reward.name : ''}"
          placeholder="Ex: 30 minutes de tablette">
        </ha-textfield>
        
        <ha-textarea
          label="Description"
          name="description"
          placeholder="Description de la récompense..."
          value="${isEdit ? reward.description || '' : ''}">
        </ha-textarea>
        
        <ha-textfield
          label="Icône personnalisée (optionnel)"
          name="icon"
          value="${isEdit ? reward.icon || '' : ''}"
          placeholder="Ex: 🎮, mdi:gamepad, https://example.com/icon.png">
        </ha-textfield>
        
        <div class="form-row">
          <ha-textfield
            label="Coût en 🎫"
            name="cost"
            type="number"
            value="${isEdit ? reward.cost : '0'}"
            min="0"
            max="1000">
          </ha-textfield>
          
          <ha-textfield
            label="Coût en coins"
            name="coin_cost"
            type="number"
            value="${isEdit ? reward.coin_cost || 0 : '0'}"
            min="0"
            max="500">
          </ha-textfield>
          
          <ha-select
            label="Catégorie *"
            name="category"
            required>
            ${categories.map(cat => `
              <ha-list-item value="${cat}" ${(!isEdit && cat === 'fun') || (isEdit && reward.category === cat) ? 'selected' : ''}>
                ${this.getCategoryLabel(cat)}
              </ha-list-item>
            `).join('')}
          </ha-select>
        </div>
        
        <ha-textfield
          label="Quantité limitée"
          name="limited_quantity"
          type="number"
          value="${isEdit && reward.limited_quantity !== null && reward.limited_quantity !== undefined ? reward.limited_quantity : ''}"
          min="1"
          max="100"
          placeholder="Laissez vide pour illimité">
        </ha-textfield>
        
        ${isEdit ? `
          <ha-formfield label="Récompense active">
            <ha-checkbox
              name="active"
              ${reward.active !== false ? 'checked' : ''}>
            </ha-checkbox>
          </ha-formfield>
        ` : ''}
        
        <div class="dialog-actions">
          <ha-button
            slot="secondaryAction"
            onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button
            slot="primaryAction"
            raised
            onclick="this.closest('ha-dialog')._cardInstance.submitRewardForm(this.closest('ha-dialog'), ${isEdit})">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    this.showModal(content, isEdit ? 'Modifier la récompense' : 'Créer une récompense');
  }

  getChildren() {
    const children = [];
    const entities = this._hass.states;
    
    Object.keys(entities).forEach(entityId => {
      // Chercher UNIQUEMENT les entités avec le nouveau format kidtasks_
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        
        if (pointsEntity && pointsEntity.attributes && pointsEntity.state !== 'unavailable') {
          const points = parseInt(pointsEntity.state) || 0;
          const coins = parseInt(pointsEntity.attributes.coins) || 0;
          const level = parseInt(pointsEntity.attributes.level) || 1;
          const progress = ((points % 100) / 100) * 100;
          
          // Extraire l'ID et le nom depuis le nouveau format kidtasks_
          const childId = pointsEntity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', '');
          const childName = pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || childId;
          
          children.push({
            id: childId,
            name: childName,
            points: points,
            coins: coins,
            level: level,
            progress: progress,
            avatar: pointsEntity.attributes.avatar || '👶',
            person_entity_id: pointsEntity.attributes.person_entity_id,
            avatar_type: pointsEntity.attributes.avatar_type || 'emoji',
            avatar_data: pointsEntity.attributes.avatar_data,
            card_gradient_start: pointsEntity.attributes.card_gradient_start,
            card_gradient_end: pointsEntity.attributes.card_gradient_end
          });
        }
      }
    });
    
    
    // Trier selon l'ordre personnalisé ou alphabétique par défaut
    const childrenOrder = this.config.children_order || [];
    
    const sortedChildren = children.sort((a, b) => {
      const indexA = childrenOrder.indexOf(a.id);
      const indexB = childrenOrder.indexOf(b.id);
      
      // Si les deux enfants ont un ordre défini
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // Si seul A a un ordre défini, A vient en premier
      if (indexA !== -1 && indexB === -1) {
        return -1;
      }
      // Si seul B a un ordre défini, B vient en premier
      if (indexA === -1 && indexB !== -1) {
        return 1;
      }
      // Si aucun n'a d'ordre défini, tri alphabétique
      return a.name.localeCompare(b.name);
    });
    
    return sortedChildren;
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

  getTasks() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const tasks = [];
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les capteurs kidtasks_task_
    Object.keys(entities).forEach(entityId => { 
      if (entityId.startsWith('sensor.kidtasks_task_')) {
        const taskEntity = entities[entityId];
        if (taskEntity && taskEntity.attributes && taskEntity.state !== 'unavailable') {
          
          const attrs = taskEntity.attributes;
          
          // Construire la liste des enfants avec leurs statuts individuels
          let childStatusesSummary = {};
          let pendingValidationChildNames = [];
          
          if (attrs.child_statuses) {
            // Nouveau système avec statuts individuels
            for (const [childId, childStatus] of Object.entries(attrs.child_statuses)) {
              childStatusesSummary[childId] = childStatus.status;
              if (childStatus.status === 'pending_validation') {
                pendingValidationChildNames.push(childStatus.child_name || 'Enfant inconnu');
              }
            }
          }
          
          // Déterminer le nom des enfants en attente pour l'affichage
          let assignedChildName = attrs.assigned_child_name || 'Non assigné';
          
          // Pour les tâches en attente de validation, afficher SEULEMENT les enfants concernés
          if (taskEntity.state === 'pending_validation') {
            if (pendingValidationChildNames.length > 0) {
              assignedChildName = pendingValidationChildNames.join(', ');
            } else {
              // Si aucun enfant n'est en pending_validation, ne pas afficher la tâche
              // Ne pas ajouter cette tâche à la liste
              assignedChildName = null;
            }
          }
          
          // Ne pas ajouter la tâche si assignedChildName est null
          if (assignedChildName === null) {
            return;
          }
          
          tasks.push({
            id: attrs.task_id || entityId.replace('sensor.kidtasks_task_', ''),
            name: attrs.task_name || attrs.friendly_name || 'Tâche',
            description: attrs.description || '',
            category: attrs.category || 'other',
            icon: attrs.icon,
            points: parseInt(attrs.points) || 10,
            coins: parseInt(attrs.coins) || 0,
            frequency: attrs.frequency || 'daily',
            status: taskEntity.state || 'todo',
            assigned_child_id: attrs.assigned_child_id,
            assigned_child_ids: attrs.assigned_child_ids || [],
            assigned_child_name: assignedChildName,
            validation_required: attrs.validation_required !== false,
            active: attrs.active !== false,
            created_at: attrs.created_at,
            last_completed_at: attrs.last_completed_at,
            weekly_days: attrs.weekly_days || [],
            deadline_time: attrs.deadline_time,
            penalty_points: attrs.penalty_points || 0,
            deadline_passed: attrs.deadline_passed || false,
            child_statuses: attrs.child_statuses || {},
            pending_validation_children: pendingValidationChildNames
          });
        }
      }
    });
    
    // Trier par statut (en attente de validation en premier)
    return tasks.sort((a, b) => {
      if (a.status === 'pending_validation' && b.status !== 'pending_validation') return -1;
      if (b.status === 'pending_validation' && a.status !== 'pending_validation') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getRewards() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const rewards = [];
    
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les capteurs kidtasks_reward_
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_reward_')) {
        const rewardEntity = entities[entityId];
        if (rewardEntity && rewardEntity.attributes && rewardEntity.state !== 'unavailable') {
          const attrs = rewardEntity.attributes;
          
          
          rewards.push({
            id: attrs.reward_id || entityId.replace('sensor.kidtasks_reward_', ''),
            name: attrs.reward_name || attrs.friendly_name || 'Récompense',
            cost: parseInt(attrs.cost) || parseInt(rewardEntity.state) || 0,
            coin_cost: parseInt(attrs.coin_cost) || 0,
            category: attrs.category || 'fun',
            icon: attrs.icon,
            description: attrs.description || '',
            active: attrs.active !== false,
            remaining_quantity: attrs.remaining_quantity,
            is_available: attrs.is_available !== false,
            reward_type: attrs.reward_type || 'standard',
            cosmetic_data: attrs.cosmetic_data || null,
            min_level: parseInt(attrs.min_level) || 1
          });
        }
      }
    });
    
    return rewards.filter(r => r.active && r.is_available).sort((a, b) => a.cost - b.cost);
  }

  getStats() {
    const children = this.getChildren();
    const tasks = this.getTasks();
    const completedToday = tasks.filter(task => 
      task.status === 'validated' && 
      task.last_completed_at && 
      this.isToday(task.last_completed_at)
    ).length;

    // Utiliser la méthode partagée pour les statistiques des jauges
    const taskStats = this.getTasksStatsForGauges(tasks, completedToday);

    return {
      totalChildren: children.length,
      totalTasks: tasks.length,
      completedToday: taskStats.completedToday,
      totalTasksToday: taskStats.totalTasksToday,
      pendingValidation: tasks.filter(t => t.status === 'pending_validation').length
    };
  }

  getChildById(childId) {
    return this.getChildren().find(child => child.id === childId);
  }

  getTaskById(taskId) {
    return this.getTasks().find(task => task.id === taskId);
  }

  getRewardById(rewardId) {
    return this.getRewards().find(reward => reward.id === rewardId);
  }

  getAvailableCategories() {
    // Récupérer les catégories depuis l'entité sensor.kidtasks_pending_validations
    const pendingValidationsEntity = this._hass.states['sensor.kidtasks_pending_validations'];
    if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.available_categories) {
      return pendingValidationsEntity.attributes.available_categories;
    }
    
    // Fallback sur les catégories par défaut si l'entité n'est pas disponible
    return ['bedroom', 'bathroom', 'kitchen', 'homework', 'outdoor', 'pets', 'other'];
  }

  getAvailableFrequencies() {
    // Récupérer les fréquences depuis l'entité sensor.kidtasks_pending_validations
    const pendingValidationsEntity = this._hass.states['sensor.kidtasks_pending_validations'];
    if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.available_frequencies) {
      return pendingValidationsEntity.attributes.available_frequencies;
    }
    
    // Fallback sur les fréquences par défaut si l'entité n'est pas disponible
    return ['daily', 'weekly', 'monthly', 'once', 'none'];
  }

  getAvailableRewardCategories() {
    // Récupérer les catégories de récompenses depuis l'entité sensor.kidtasks_pending_validations
    const pendingValidationsEntity = this._hass.states['sensor.kidtasks_pending_validations'];
    if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.available_reward_categories) {
      return pendingValidationsEntity.attributes.available_reward_categories;
    }
    
    // Fallback sur les catégories par défaut si l'entité n'est pas disponible
    return ['fun', 'screen_time', 'outing', 'privilege', 'toy', 'treat'];
  }

  getChildTasksToday(childId, tasks = null) {
    if (!tasks) tasks = this.getTasks();
    return tasks.filter(task => {
      // Supporter la sélection multiple d'enfants
      const isAssigned = task.assigned_child_ids 
        ? task.assigned_child_ids.includes(childId)
        : task.assigned_child_id === childId;
      
      return isAssigned && 
        (task.frequency === 'daily' || 
         (task.last_completed_at && this.isToday(task.last_completed_at)));
    });
  }

  getChildCompletedToday(childId, tasks = null) {
    if (!tasks) tasks = this.getTasks();
    return tasks.filter(task => {
      // Supporter la sélection multiple d'enfants
      const isAssigned = task.assigned_child_ids 
        ? task.assigned_child_ids.includes(childId)
        : task.assigned_child_id === childId;
      
      return isAssigned && 
        task.status === 'validated' &&
        task.last_completed_at && 
        this.isToday(task.last_completed_at);
    });
  }

  // Utilitaires - isToday déplacée vers KidsTasksBaseCard

  getChildName(childId, children = null) {
    if (!children) children = this.getChildren();
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Non assigné';
  }

  getCategoryLabel(category) {
    // Récupérer les labels depuis l'intégration
    const pendingValidationsEntity = this._hass.states['sensor.kidtasks_pending_validations'];
    if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.category_labels) {
      const dynamicLabels = pendingValidationsEntity.attributes.category_labels;
      if (dynamicLabels[category]) {
        return dynamicLabels[category];
      }
    }
    
    // Récupérer les labels de récompenses depuis l'intégration
    if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.reward_category_labels) {
      const rewardLabels = pendingValidationsEntity.attributes.reward_category_labels;
      if (rewardLabels[category]) {
        return rewardLabels[category];
      }
    }
    
    return category;
  }

  getFrequencyLabel(frequency) {
    const labels = {
      'daily': 'Quotidienne',
      'weekly': 'Hebdomadaire',
      'monthly': 'Mensuelle', 
      'once': 'Une fois',
      'none': 'Bonus'
    };
    return labels[frequency] || frequency;
  }

  // Navigation et vues (réutilisation du code existant avec ajout des boutons de suppression)
  getNavigation() {
    let tabs = [];
    
    if (this.mode === 'config') {
      // Onglets pour la carte de configuration
      tabs = [
        { id: 'tasks', label: '📝 Tâches', icon: '📝' },
        { id: 'rewards', label: '🎁 Récompenses', icon: '🎁' },
        { id: 'cosmetics', label: '🎨 Cosmétiques', icon: '🎨' }
      ];
    } else {
      // Onglets pour la carte dashboard
      tabs = [
        { id: 'dashboard', label: '📊 Aperçu', icon: '📊' },
        { id: 'children', label: '👶 Enfants', icon: '👶' },
        { id: 'validation', label: '✅ Validation', icon: '✅' }
      ];
    }

    return `
      <div class="nav-tabs">
        ${tabs.map(tab => `
          <button class="nav-tab ${this.currentView === tab.id ? 'active' : ''}" 
                  data-action="switch-view" data-id="${tab.id}">
            ${tab.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  getCurrentView() {
    // Si mode est défini dans config, utiliser seulement les vues correspondantes
    if (this.mode === 'config') {
      // Carte de configuration : tâches, récompenses, cosmétiques
      switch (this.currentView) {
        case 'tasks': return this.getTasksView();
        case 'rewards': return this.getRewardsView();
        case 'cosmetics': return this.getCosmeticsView();
        default: 
          this.currentView = 'tasks'; // Vue par défaut pour config
          return this.getTasksView();
      }
    } else {
      // Carte dashboard : aperçu, enfants, validation
      switch (this.currentView) {
        case 'dashboard': return this.getDashboardView();
        case 'children': return this.getChildrenView();
        case 'validation': return this.getValidationView();
        default: return this.getDashboardView();
      }
    }
  }

  getDashboardView() {
    const children = this.getChildren();
    const tasks = this.getTasks();
    const stats = this.getStats();
    const pendingTasks = tasks.filter(t => t.status === 'pending_validation');

    return `
      ${pendingTasks.length > 0 ? `
        <div class="section">
          <h2>Tâches à valider (${pendingTasks.length})</h2>
          <div class="validation-tasks-list">
            ${pendingTasks.map(task => this.renderValidationTask(task, children)).join('')}
          </div>
        </div>
      ` : ''}

      ${children.length > 0 ? `
        <div class="section children-grid">
          <div class="children-dashboard-grid">
            ${children.map((child, index) => {
              try {
                console.log(`Rendu enfant ${index}:`, child);
                const result = this.renderChildCard(child, false, false);
                console.log(`Rendu enfant ${index} réussi`);
                return result;
              } catch (error) {
                console.error(`Erreur lors du rendu de l'enfant ${index}:`, error, child);
                return `<div class="child-card"><div class="error">Erreur enfant ${index}: ${error.message}</div></div>`;
              }
            }).join('')}
          </div>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">👶</div>
          <p>Aucun enfant enregistré</p>
          <button class="btn btn-primary" data-action="add-child">Ajouter un enfant</button>
        </div>
      `}

      <div class="section">
        <h2>${this.title}</h2>
        <div class="stats-grid-compact">
          <div class="stat-card compact">
            <div class="stat-icon small">👶</div>
            <div class="stat-info compact">
              ${stats.totalChildren} Enfant${stats.totalChildren > 1 ? 's' : ''}
            </div>
          </div>
          <div class="stat-card compact">
            <div class="stat-icon small">📝</div>
            <div class="stat-info compact">
              ${stats.totalTasks} tâches
            </div>
          </div>
          <div class="stat-card compact">
            <div class="stat-icon small">✅</div>
            <div class="stat-info compact">
              ${stats.completedToday} finies<br>aujourd'hui
            </div>
          </div>
          <div class="stat-card compact clickable" data-action="switch-view" data-id="validation" title="Voir les tâches à valider">
            <div class="stat-icon small">⏳</div>
            <div class="stat-info compact">
              ${stats.pendingValidation} à valider
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getChildrenView() {
    const children = this.getChildren();
    const currentChildFilter = this.childFilter || 'all';
    
    // Filtrer les enfants selon le filtre sélectionné
    const filteredChildren = currentChildFilter === 'all' ? children : 
                             children.filter(child => child.id === currentChildFilter);
    
    return `
      <div class="section">
        <h2>
          Gestion des enfants
          <button class="btn btn-primary add-btn" data-action="add-child">Ajouter</button>
        </h2>
        
        <!-- Filtres pour les enfants -->
        <div class="filters">
          <button class="filter-btn ${currentChildFilter === 'all' ? 'active' : ''}" data-action="filter-children" data-filter="all">Tous</button>
          ${children.map(child => `
            <button class="filter-btn ${currentChildFilter === child.id ? 'active' : ''}" data-action="filter-children" data-filter="${child.id}">${child.name}</button>
          `).join('')}
        </div>
        
        ${filteredChildren.length > 0 ? `
          <div class="${currentChildFilter === 'all' ? 'grid children-grid' : 'single-child-view'}">
            ${filteredChildren.map((child, index) => {
              try {
                console.log(`Rendu enfant gestion ${index}:`, child);
                const result = this.renderChildCard(child, true, true);
                console.log(`Rendu enfant gestion ${index} réussi`);
                return result;
              } catch (error) {
                console.error(`Erreur lors du rendu de l'enfant gestion ${index}:`, error, child);
                return `<div class="child-card"><div class="error">Erreur enfant gestion ${index}: ${error.message}</div></div>`;
              }
            }).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">👶</div>
            <p>Aucun enfant ajouté</p>
            <button class="btn btn-primary" data-action="add-child">Ajouter votre premier enfant</button>
          </div>
        `}
      </div>
    `;
  }

  getTasksView() {
    const children = this.getChildren();
    const allTasks = this.getTasks();
    
    // Appliquer le filtre sélectionné
    const currentFilter = this.taskFilter || 'active';
    const tasks = this.filterTasks(allTasks, currentFilter);
    
    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <button class="btn btn-primary add-btn" data-action="add-task">Ajouter</button>
        </h2>
        
        <!-- Filtres pour les tâches -->
        <div class="filters">
          <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-action="filter-tasks" data-filter="all">Toutes</button>
          <button class="filter-btn ${currentFilter === 'active' ? 'active' : ''}" data-action="filter-tasks" data-filter="active">Actives</button>
          <button class="filter-btn ${currentFilter === 'bonus' ? 'active' : ''}" data-action="filter-tasks" data-filter="bonus">Bonus</button>
          <button class="filter-btn ${currentFilter === 'inactive' ? 'active' : ''}" data-action="filter-tasks" data-filter="inactive">Désactivées</button>
          <button class="filter-btn ${currentFilter === 'out-of-period' ? 'active' : ''}" data-action="filter-tasks" data-filter="out-of-period">Hors période</button>
        </div>
        
        ${tasks.length > 0 ? `
          <div class="task-list">
            ${tasks.map(task => this.renderTaskItem(task, children)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Aucune tâche ${this.getFilterLabel(currentFilter)}</p>
            ${currentFilter === 'active' ? '<button class="btn btn-primary" data-action="add-task">Créer votre première tâche</button>' : ''}
          </div>
        `}
      </div>
    `;
  }

  filterTasks(tasks, filter) {
    switch (filter) {
      case 'active':
        return tasks.filter(task => task.frequency !== 'none' && task.active !== false && this.isTaskInPeriod(task));
      case 'inactive':
        return tasks.filter(task => task.frequency !== 'none' && task.active === false);
      case 'out-of-period':
        return tasks.filter(task => task.frequency !== 'none' && task.active !== false && !this.isTaskInPeriod(task));
      case 'bonus':
        return tasks.filter(task => task.frequency === 'none');
      case 'all':
        return tasks;
      default:
        return tasks.filter(task => task.frequency !== 'none' && task.active !== false && this.isTaskInPeriod(task));
    }
  }

  isTaskInPeriod(task) {
    // Vérifier si la tâche est dans sa période de validité
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (task.frequency) {
      case 'daily':
        return true; // Les tâches quotidiennes sont toujours valides
      case 'weekly':
        // Vérifier si c'est un jour valide de la semaine
        if (task.weekly_days && task.weekly_days.length > 0) {
          const dayOfWeek = now.getDay(); // 0 = dimanche, 1 = lundi, ...
          const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          return task.weekly_days.includes(daysMap[dayOfWeek]);
        }
        return true; // Si pas de restriction de jours, toujours valide
      case 'monthly':
        return true; // Les tâches mensuelles sont toujours valides
      case 'once':
        // Vérifier si pas encore complétée
        return task.status !== 'validated' && task.status !== 'completed';
      default:
        return true;
    }
  }

  getFilterLabel(filter) {
    const labels = {
      'active': 'active',
      'inactive': 'désactivée',
      'out-of-period': 'hors période',
      'bonus': 'bonus',
      'all': ''
    };
    return labels[filter] || '';
  }

  renderTaskItem(task, children) {
    const childName = this.formatAssignedChildren(task);
    const taskIcon = this.safeGetCategoryIcon(task, '📋');
    
    return `
      <div class="task hover-card ${task.status} ${task.active === false ? 'inactive' : ''} ${!this.isTaskInPeriod(task) ? 'out-of-period' : ''}">
        <div class="task-icon">${taskIcon}</div>
        <div class="task-main flex-content">
          <div class="task-name">${task.name}</div>
          <div class="task-meta-compact">
            <span class="assigned-child">${childName}</span>
            <span class="task-frequency">${this.getFrequencyLabel(task.frequency)}</span>
            <span class="task-category">${this.getCategoryLabel(task.category)}</span>
          </div>
        </div>
        <div class="task-rewards-compact">
          ${task.points > 0 ? `<span class="reward-points">+${task.points}🎫</span>` : ''}
          ${task.coins > 0 ? `<span class="reward-coins">+${task.coins}🪙</span>` : ''}
          ${task.penalty_points > 0 ? `<span class="penalty-points">-${task.penalty_points}🎫</span>` : ''}
        </div>
        <div class="task-actions-compact">
          <button class="btn btn-secondary btn-sm" data-action="edit-task" data-id="${task.id}">Modifier</button>
          <button class="btn btn-danger btn-sm" data-action="remove-task" data-id="${task.id}">×</button>
        </div>
      </div>
    `;
  }

  getRewardsView() {
    const rewards = this.getRewards();
    return `
      <div class="section">
        <h2>
          Gestion des récompenses
          <button class="btn btn-primary add-btn" data-action="add-reward">Ajouter</button>
        </h2>
        ${rewards.length > 0 ? `
          <div class="reward-list-compact">
            ${rewards.map(reward => this.renderRewardItemCompact(reward)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎁</div>
            <p>Aucune récompense créée</p>
            <button class="btn btn-primary" data-action="add-reward">Créer votre première récompense</button>
          </div>
        `}
      </div>
    `;
  }


  calculateChildStats(child, tasks) {
    const totalPoints = child.points || 0;
    const level = child.level || 1;
    const pointsToNextLevel = level * 100;
    const pointsInCurrentLevel = totalPoints % 100;
    
    // Calculer les tâches actives aujourd'hui (similaire à getChildStats)
    const today = new Date();
    const activeTasks = tasks.filter(task => 
      task.status === 'todo' && 
      this.isTaskActiveToday ? this.isTaskActiveToday(task) : true
    );
    
    const completedTasks = tasks.filter(task => 
      (task.status === 'validated' || task.status === 'completed') &&
      this.isTaskActiveToday ? this.isTaskActiveToday(task) : true
    );
    
    return {
      totalPoints,
      level,
      pointsInCurrentLevel,
      pointsToNextLevel,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      totalTasksToday: activeTasks.length + completedTasks.length
    };
  }

  renderRewardItemCompact(reward) {
    const rewardIcon = this.safeGetCategoryIcon(reward, '🎁');
    
    return `
      <div class="reward-item hover-card">
        <div class="reward-icon-compact">${rewardIcon}</div>
        <div class="reward-main-compact">
          <div class="reward-name-compact">${reward.name}</div>
          <div class="reward-meta-compact">
            ${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''} • ${this.getCategoryLabel(reward.category)}
            ${reward.remaining_quantity !== null ? ` • ${reward.remaining_quantity} restant(s)` : ''}
          </div>
          ${reward.description ? `<div class="reward-description-compact">${reward.description}</div>` : ''}
        </div>
        <div class="reward-actions-compact">
          <button class="btn btn-secondary btn-sm" data-action="edit-reward" data-id="${reward.id}">Modifier</button>
          <button class="btn btn-danger btn-sm" data-action="remove-reward" data-id="${reward.id}">×</button>
        </div>
      </div>
    `;
  }

  getValidationView() {
    const children = this.getChildren();
    const allTasks = this.getTasks();
    // Filtrer seulement les tâches en attente de validation
    const pendingTasks = allTasks.filter(task => task.status === 'pending_validation');
    
    return `
      <div class="section">
        <h2>
          Validation des tâches
          ${pendingTasks.length > 0 ? `<span class="badge">${pendingTasks.length}</span>` : ''}
        </h2>
        
        ${pendingTasks.length > 0 ? `
          <div class="validation-tasks-list">
            ${pendingTasks.map(task => this.renderValidationTask(task, children)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">✅</div>
            <p>Aucune tâche en attente de validation</p>
            <p class="secondary-text">Les tâches complétées par les enfants apparaîtront ici.</p>
          </div>
        `}
      </div>
    `;
  }

  renderValidationTask(task, children) {
    // Pour les validations, afficher l'enfant qui a demandé la validation
    let childName = 'Enfant inconnu';
    if (task.pending_validation_children && task.pending_validation_children.length > 0) {
      // Utiliser les noms des enfants en attente de validation déjà construits
      childName = task.pending_validation_children.join(', ');
    } else if (task.completed_by) {
      const child = children.find(c => c.id === task.completed_by);
      childName = child ? child.name : `Enfant ${task.completed_by}`;
    } else {
      // Fallback sur les enfants assignés si rien d'autre n'est disponible
      childName = this.formatAssignedChildren(task);
    }
    
    const taskIcon = this.safeGetCategoryIcon(task, '📋');
    
    // Calculer l'âge de la demande
    let ageText = '';
    if (task.completed_at) {
      const completedDate = new Date(task.completed_at);
      const now = new Date();
      const diffHours = Math.floor((now - completedDate) / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        ageText = 'À l\'instant';
      } else if (diffHours < 24) {
        ageText = `Il y a ${diffHours}h`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        ageText = `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      }
    }
    
    return `
      <div class="validation-task">
        <div class="validation-task-icon">${taskIcon}</div>
        <div class="validation-task-content flex-content">
          <div class="validation-task-header">
            <div class="validation-task-title">${task.name}</div>
            <div class="validation-task-age">${ageText}</div>
          </div>
          <div class="validation-task-meta">
            <span class="validation-child">${childName}</span>
            <span class="validation-rewards">
              ${task.points !== 0 ? `${task.points > 0 ? '+' : ''}${task.points}🎫` : ''}
              ${task.coins !== 0 ? ` ${task.coins > 0 ? '+' : ''}${task.coins}🪙` : ''}
              ${task.penalty_points ? ` ${task.penalty_points}🎫` : ''}
            </span>
            <span class="validation-category">${this.getCategoryLabel(task.category)}</span>
          </div>
          ${task.description ? `<div class="validation-task-description">${task.description}</div>` : ''}
        </div>
        <div class="validation-task-actions">
          <button class="btn btn-success btn-validation" data-action="validate-task" data-id="${task.id}">
            ✅ Valider
          </button>
          <button class="btn btn-danger btn-validation" data-action="reject-task" data-id="${task.id}">
            ❌ Rejeter
          </button>
        </div>
      </div>
    `;
  }

  getCosmeticsView() {
    const children = this.getChildren();
    const allRewards = this.getRewards();
    
    // Filtrer les cosmétiques
    const cosmeticsRewards = allRewards.filter(r => {
      return !!(r.cosmetic_data || r.reward_type === 'cosmetic' || r.category === 'cosmetic');
    });
    
    if (cosmeticsRewards.length === 0) {
      return `
        <div class="section">
          <h2>
            🎨 Cosmétiques
            <div class="section-actions">
              <button class="btn btn-primary" data-action="load-cosmetics-catalog">
                🔄 Charger le catalogue
              </button>
              <button class="btn btn-secondary" data-action="create-cosmetic-rewards">
                ⚡ Créer les récompenses
              </button>
            </div>
          </h2>
          <div class="empty-state">
            <div class="empty-state-icon">🎨</div>
            <p>Aucun cosmétique disponible</p>
            <p class="secondary-text">Chargez le catalogue et créez les récompenses pour voir les cosmétiques.</p>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="section">
        <h2>
          🎨 Cosmétiques (${cosmeticsRewards.length})
          <div class="section-actions">
            <button class="btn btn-primary" data-action="load-cosmetics-catalog">
              🔄 Charger le catalogue
            </button>
            <button class="btn btn-secondary" data-action="create-cosmetic-rewards">
              ⚡ Créer les récompenses
            </button>
          </div>
        </h2>
        
        <div class="cosmetics-simple-grid">
          ${cosmeticsRewards.map(cosmetic => `
            <div class="cosmetic-simple-item rarity-${cosmetic.cosmetic_data?.rarity || 'common'}" data-cosmetic-id="${cosmetic.id}">
              <div class="cosmetic-simple-preview">
                ${this.renderCosmeticItemPreview(cosmetic.cosmetic_data, cosmetic.name)}
                 <div class="cosmetic-simple-rarity kt-level-badge rarity-${cosmetic.cosmetic_data?.rarity || 'common'}">${this.getCosmeticRarityLabel(cosmetic.cosmetic_data?.rarity || 'common')}</div>
              </div>
              <div class="cosmetic-simple-info">
                <div class="cosmetic-simple-name">${cosmetic.name}</div>
                <div class="cosmetic-simple-cost">
                  ${cosmetic.cost > 0 ? `${cosmetic.cost}🎫` : ''}
                  ${cosmetic.coin_cost > 0 ? `${cosmetic.cost > 0 ? ' + ' : ''}${cosmetic.coin_cost} 🪙` : ''}
                  ${cosmetic.cost === 0 && cosmetic.coin_cost === 0 ? 'Gratuit' : ''}
                </div>
              </div>
              <div class="cosmetic-simple-actions">
                <ha-select label="Donner à..." class="cosmetic-give-select" data-cosmetic-id="${cosmetic.id}">
                  ${children.map(child => `
                    <ha-list-item value="${child.id}"> ${child.name}</ha-list-item>
                  `).join('')}
                </ha-select>
                <button class="btn btn-sm btn-primary" data-action="give-cosmetic" data-cosmetic-id="${cosmetic.id}">
                  🎁 Donner
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderCosmeticItemPreview(cosmeticItemData, rewardName = null) {
    // Si pas de cosmetic_data, essayer de la générer depuis le nom
    if (!cosmeticItemData && rewardName) {
      cosmeticItemData = this.generateCosmeticDataFromName(rewardName);
    }
    
    if (!cosmeticItemData) {
      return `<div class="generic-preview">🎨</div>`;
    }
    
    const catalogItemData = cosmeticItemData.catalog_data || {};
    
    // Normaliser le type (enlever le 's' final si présent pour 'backgrounds' -> 'background')
    const cosmeticType = cosmeticItemData.type ? cosmeticItemData.type.replace(/s$/, '') : '';
    
    switch (cosmeticType) {
      case 'avatar':
        if (catalogItemData.pixel_art && typeof catalogItemData.pixel_art === 'string' && catalogItemData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('avatars', catalogItemData.pixel_art);
          return `<img class="pixel-art-preview" src="${imageUrl}" alt="${catalogItemData.name}" style="width: 100px; height: 100px; border-radius: var(--kt-radius-round); image-rendering: pixelated;" />`;
        }
        if (catalogItemData.emoji) {
          return `<div class="avatar-preview">${catalogItemData.emoji}</div>`;
        }
        return `<div class="avatar-preview">👤</div>`;
        
      case 'background':
        if (catalogItemData.css_gradient) {
          return `<div class="background-preview large" style="background: ${catalogItemData.css_gradient};"></div>`;
        }
        return `<div class="background-preview large"></div>`;
        
      case 'outfit':
        if (catalogItemData.pixel_art && typeof catalogItemData.pixel_art === 'string' && catalogItemData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('outfits', catalogItemData.pixel_art);
          return `<div style="position: relative; width: 100px; height: 100px; border-radius: var(--kt-radius-round);">
            <div class="avatar-placeholder avatar-placeholder-large" style="background: var(--kt-avatar-background);">👤</div>
            <img src="${imageUrl}" alt="Outfit" style="position: absolute; top: 0; left: 0; width: 100px; height: 100px; border-radius: var(--kt-radius-round); image-rendering: pixelated;" />
          </div>`;
        }
        if (catalogItemData.emoji_overlay) {
          return `<div class="outfit-preview">
            <span class="base-avatar">👤</span>
            <span class="outfit-overlay">${catalogItemData.emoji_overlay}</span>
          </div>`;
        }
        return `<div class="outfit-preview">👕</div>`;
        
      case 'theme':
        const themeCssVars = catalogItemData.css_variables || {};
        const themePrimaryColor = themeCssVars['--primary-color'] || '#667eea';
        const themeSecondaryColor = themeCssVars['--secondary-color'] || '#764ba2';
        return `<div class="theme-preview" style="width: 100px; height: 100px; border-radius: var(--kt-radius-round); background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themeSecondaryColor} 100%); border: 1px solid var(--kt-cosmetic-border);"></div>`;
        
      default:
        return `<div class="generic-preview">🎨</div>`;
    }
  }

  getCosmeticRarityLabel(rarityLevel) {
    const cosmeticRarityLabels = {
      'common': 'Commun',
      'rare': 'Rare', 
      'epic': 'Épique',
      'legendary': 'Légendaire'
    };
    return cosmeticRarityLabels[rarityLevel] || 'Commun';
  }

  // Styles CSS identiques au fichier précédent
  // Couche 3: Styles configurables pour KidsTasksCard
  getConfigurableStyles() {
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

  // Couche 4: Styles spécifiques à KidsTasksCard
  getSpecificStyles() {
    return `
      /* Layout principal parent */
      * { box-sizing: border-box; }
        
        .kids-tasks-manager {
          font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
          background: var(--card-background-color, white);
          border-radius: var(--border-radius, 8px);
          box-shadow: var(--card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
          overflow: hidden;
          min-height: 300px;
        }
        
        .nav-tabs {
          display: flex;
          background: var(--custom-tab-color);
          margin: 0;
          padding: 0;
        }
        
        .nav-tab {
          flex: 1;
          padding: var(--kt-space-md) 8px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.3s;
          font-size: 13px;
          text-align: center;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
        }
        
        .nav-tab:hover { background: var(--kt-cosmetic-background); }
        .nav-tab.active { background: var(--kt-cosmetic-background); font-weight: bold; }
        
        /* .content inherited from base class */
        .section { margin-bottom: 24px; }
        .section h2 {
          margin: 0 0 16px 0;
          color: var(--primary-text-color, #212121);
          font-size: 1.3em;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          padding: var(--kt-space-lg);
          background: var(--secondary-background-color, #fafafa);
          border-radius: var(--kt-radius-sm);
          border-left: 4px solid var(--custom-dashboard-secondary);
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        
        .stat-info { 
          display: flex; 
          flex-direction: column; 
          gap: 8px;
        }
        
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .stat-icon { font-size: 2em; }
        .stat-number {
          font-size: 1.8em;
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .stat-label { 
          color: var(--secondary-text-color, #757575); 
          font-size: 0.9em;
          line-height: 1.3;
          word-wrap: break-word;
        }
        
        
        .reward-card {
          border-left-color: var(--custom-dashboard-primary, #6b73ff);
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: var(--kt-space-sm);
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: var(--kt-radius-sm);
          border-left: 4px solid var(--custom-dashboard-secondary);
          transition: all 0.3s;
          position: relative;
        }
        
        /* Drag & Drop styles */
        .child-card[draggable="true"] {
          cursor: move;
        }
        
        .child-card[draggable="true"]:hover .drag-handle {
          color: var(--primary-color, #03a9f4);
        }
        
        .child-card.dragging {
          opacity: 0.6;
          transform: rotate(2deg) scale(1.05);
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        
        .child-card.drop-before {
          position: relative;
        }
        
        .child-card.drop-before::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          height: 16px;
          background: linear-gradient(90deg, 
            var(--primary-color, #03a9f4) 0%, 
            rgba(3, 169, 244, 0.3) 50%, 
            var(--primary-color, #03a9f4) 100%);
          border-radius: var(--kt-radius-sm);
          z-index: 100;
          opacity: 0.8;
          animation: pulse-insert 1s infinite alternate;
        }
        
        .child-card.drop-after {
          position: relative;
        }
        
        .child-card.drop-after::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: -8px;
          right: -8px;
          height: 16px;
          background: linear-gradient(90deg, 
            var(--primary-color, #03a9f4) 0%, 
            rgba(3, 169, 244, 0.3) 50%, 
            var(--primary-color, #03a9f4) 100%);
          border-radius: var(--kt-radius-sm);
          z-index: 100;
          opacity: 0.8;
          animation: pulse-insert 1s infinite alternate;
        }
        
        @keyframes pulse-insert {
          0% { opacity: 0.6; transform: scaleY(0.8); }
          100% { opacity: 1; transform: scaleY(1); }
        }
        
        .drag-handle {
          position: absolute;
          top: 20px;
          left: 8px;
          color: var(--secondary-text-color, --kt-success);
          font-size: 32px;
          line-height: 32px;
          cursor: grab;
          user-select: none;
          z-index: 1;
        }
        
        .drag-handle:active {
          cursor: grabbing;
        }
        
        .child-avatar { 
          font-size: 2.5em; 
          margin-right: 16px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          min-width: 3em;
          min-height: 3em;
          flex-shrink: 0;
          padding-top: 8px;
          height: 100%;
          pointer-events: none;
        }
        .child-avatar img {
          width: 3em !important;
          height: 3em !important;
          border-radius: var(--kt-radius-round) !important;
          object-fit: cover !important;
          border: 2px solid var(--kt-cosmetic-background);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        
        .reward-icon { 
          font-size: 2.5em; 
          margin-right: 16px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          min-width: 3em;
          min-height: 3em;
          flex-shrink: 0;
          padding-top: 8px;
          height: 100%;
          pointer-events: none;
        }
        .reward-icon img {
          width: 3em !important;
          height: 3em !important;
          border-radius: var(--kt-radius-round) !important;
          object-fit: cover !important;
          border: 2px solid var(--kt-cosmetic-background);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .reward-info { 
          flex: 1; 
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .reward-name {
          font-size: 1.3em;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: var(--primary-text-color, #212121);
          text-align: left;
        }
        .reward-stats {
          color: var(--secondary-text-color, #757575);
          font-size: 0.9em;
          margin-bottom: 8px;
        }

        .child-info { 
          flex: 1; 
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .child-wrapper {
          display: flex;
          flex-direction: row;
        }
        .child-name {
          font-size: 1.6em;
          font-weight: bold;
          margin: 0 0 8px 0;
          color: var(--primary-text-color, #212121);
          text-align: left;
        }
        .child-stats {
          color: var(--secondary-text-color, #757575);
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        
        
        .progress-bar {
          width: 120px;
          height: 6px;
          background: var(--divider-color, #e0e0e0);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }
        
        .progress-fill {
          height: 100%;
          background: var(--custom-progress-bar-color);
          transition: width 0.3s ease;
        }
        
        /* Styles pour les jauges compactes dans les cartes enfants (mode gestion) */
        .child-card.management-mode {
          min-height: 200px;
          height: auto;
        }
        
        .child-gauges-compact {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 8px;
        }
        
        .gauge-compact {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .gauge-label-compact {
          font-size: 0.7em;
          font-weight: 600;
          color: var(--secondary-text-color);
        }
        
        .gauge-text-compact {
          font-size: 0.65em;
          font-weight: bold;
          color: var(--primary-text-color);
          text-align: right;
        }
        
        .gauge-bar-compact {
          height: 8px;
          background: var(--divider-color, #e0e0e0);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .gauge-fill-compact {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }
        
        /* .task styles inherited from base class */
        .task-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .task-main-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .task-content { flex: 1; }
        .task-title {
          font-weight: bold;
          color: var(--primary-text-color, #212121);
        }
        .task-meta { font-size: 0.85em; color: var(--secondary-text-color, #757575); }
              
        .task-name {
          font-weight: 600;
          color: var(--primary-text-color, #212121);
          font-size: 0.9em;
          margin-bottom: 2px;
        }
        
        .task-meta-compact {
          display: flex;
          gap: 8px;
          font-size: 0.75em;
          color: var(--secondary-text-color, #757575);
          flex-wrap: wrap;
        }
        
        .task-meta-compact span {
          background: rgba(0,0,0,0.05);
          padding: 1px 6px;
          border-radius: var(--kt-radius-sm);
        }
        
        .task-rewards-compact {
          display: flex;
          gap: 4px;
          margin: 0 8px;
          flex-shrink: 0;
        }
        
        .reward-points {
          background: var(--kt-success);
          color: white;
          padding: 2px 6px;
          border-radius: var(--kt-radius-sm);
          font-size: 0.75em;
          font-weight: bold;
        }
        
        .reward-coins {
          background: #9C27B0;
          color: white;
          padding: 2px 6px;
          border-radius: var(--kt-radius-sm);
          font-size: 0.75em;
          font-weight: bold;
        }
        
        .penalty-points {
          background: var(--kt-error);
          color: white;
          padding: 2px 6px;
          border-radius: var(--kt-radius-sm);
          font-size: 0.75em;
          font-weight: bold;
        }

        .task-actions-compact {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        
        .btn-sm {
          padding: var(--kt-space-xs) 8px;
          font-size: 0.75em;
          border-radius: 4px;
        }
        
        /* Styles pour les récompenses compactes */
        .reward-list-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .reward-item {
          display: flex;
          align-items: center;
          padding: var(--kt-space-sm) 12px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 6px;
          border-left: 3px solid #4CAF50;
          transition: all 0.3s ease;
          min-height: 50px;
        }
        
        /* Reward hover effect handled by hover-card utility class */
        
        .reward-icon-compact {
          font-size: 1.2em;
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .reward-main-compact {
          flex: 1;
          min-width: 0;
        }
        
        .reward-name-compact {
          font-weight: 600;
          color: var(--primary-text-color, #212121);
          font-size: 0.9em;
          margin-bottom: 2px;
        }
        
        .reward-meta-compact {
          display: flex;
          gap: 8px;
          font-size: 0.75em;
          color: var(--secondary-text-color, #757575);
          flex-wrap: wrap;
        }
        
        .reward-description-compact {
          font-size: 0.75em;
          color: var(--secondary-text-color, #757575);
          margin-top: 2px;
          line-height: 1.3;
        }
        
        .reward-actions-compact {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        
        
        /* Styles pour l'onglet Validation */
        .validation-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .validation-task {
          display: flex;
          align-items: center;
          padding: var(--kt-space-md);
          background: var(--secondary-background-color, #fafafa);
          border-radius: var(--kt-radius-sm);
          border-left: 4px solid #ff5722;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .validation-task:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .validation-task-icon {
          font-size: 1.5em;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .validation-task-content { /* flex-content utility class */ }
        
        .validation-task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .validation-task-title {
          font-weight: 700;
          font-size: 1.1em;
          color: var(--primary-text-color, #212121);
        }
        
        .validation-task-age {
          font-size: 0.8em;
          color: var(--secondary-text-color, #757575);
          font-style: italic;
        }
        
        .validation-task-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
          font-size: 0.85em;
          flex-wrap: wrap;
        }
        
        /* Base badge styles */
        .validation-child, .validation-rewards, .validation-category, .badge, .cosmetic-rarity {
          padding: 2px 8px;
          border-radius: var(--kt-radius-md);
          font-weight: 600;
        }
        
        .validation-child {
          background: var(--kt-info);
          color: white;
        }
        
        .validation-rewards {
          background: #4caf50;
          color: white;
        }
        
        .validation-category {
          background: rgba(0,0,0,0.1);
          color: var(--secondary-text-color, #757575);
          font-weight: normal;
        }
        
        .validation-task-description {
          font-size: 0.9em;
          color: var(--secondary-text-color, #757575);
          font-style: italic;
          margin-top: 4px;
        }
        
        .validation-task-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          margin-left: 16px;
        }
        
        .btn-validation {
          padding: var(--kt-space-sm) 16px;
          font-size: 0.85em;
          font-weight: 600;
          border-radius: var(--kt-radius-xl);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-validation:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        /* Améliorations pour mobile - validations */
        @media (max-width: 768px) {
          .validation-task {
            flex-direction: column;
            align-items: stretch;
            padding: var(--kt-space-lg);
          }
          
          .validation-task-icon {
            margin-right: 0;
            margin-bottom: 8px;
            text-align: center;
            font-size: 1.8em;
          }
          
          .validation-task-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 8px;
          }
          
          .validation-task-title {
            font-size: 1.2em;
            margin-bottom: 4px;
          }
          
          .validation-task-age {
            font-size: 0.85em;
          }
          
          .validation-task-meta {
            justify-content: center;
            margin-bottom: 12px;
          }
          
          .validation-task-actions {
            justify-content: center;
            gap: 12px;
            margin-top: 8px;
            margin-left: 0;
          }
          
          .btn-validation {
            flex: 1;
            padding: var(--kt-space-md) 16px;
            font-size: 0.9em;
            min-width: 120px;
          }
        }
        
        @media (max-width: 480px) {
          .validation-task-actions {
            flex-direction: column;
            gap: 8px;
          }
          
          .btn-validation {
            width: 100%;
          }
          
          .validation-task-meta {
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }
        }
        
        .badge {
          background: var(--primary-color, #3f51b5);
          color: white;
          font-size: 0.8em;
          font-weight: bold;
          margin-left: 8px;
        }
        
        .stat-card.clickable {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .stat-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        /* Styles pour les icônes personnalisées */
        .icon-image {
          width: 1.2em;
          height: 1.2em;
          object-fit: cover;
          border-radius: 3px;
          vertical-align: middle;
        }
        
        ha-icon {
          width: 1.2em;
          height: 1.2em;
          vertical-align: middle;
        }
        
        .task-actions {
          /* display inherited from base */
          position: absolute;
          right: 8px;
          bottom: 8px;
          flex-direction: row;
          justify-content: end;
        }
        
        .task-actions .btn {
          padding: 6px 12px;
          font-size: 0.85em;
          min-width: 65px;
        }
        
        .task-actions .edit-btn {
          background-color: var(--kt-success);
          color: white;
          border: 1px solid #4caf50;
          order: 2;
        }
        
        .task-actions .edit-btn:hover {
          background-color: #45a049;
        }
        
        .task-actions .delete-btn {
          background-color: var(--kt-error);
          color: white;
          border: 1px solid #f44336;
          order: 1;
        }
        
        .task-actions .delete-btn:hover {
          background-color: #d32f2f;
        }
        
        .btn-close {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border: none;
          background: var(--kt-error);
          color: white;
          border-radius: var(--kt-radius-round);
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 1;
        }
        
        .btn-close:hover {
          background: #d32f2f;
          transform: scale(1.1);
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
        
        /* Styles pour la section des jours de la semaine avec cadre */
        .weekly-days-section, .children-section {
          margin-bottom: 20px;
          padding: var(--kt-space-lg);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-sm);
          background: var(--secondary-background-color, #fafafa);
        }
        
        .weekly-days-section .form-label,.children-section .form-label {
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--primary-text-color, #212121);
        }
        
        .weekly-days-section .days-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
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
        
        
        .task-status {
          padding: var(--kt-space-xs) 8px;
          border-radius: var(--kt-radius-lg);
          font-size: 0.75em;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0 4px;
          white-space: nowrap;
          display: inline-block;
        }
        
        /* .form-group et .form-label définis dans showModal() */
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: var(--kt-space-sm) 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 4px;
          background: var(--card-background-color, white);
          color: var(--primary-text-color, #212121);
          font-size: 14px;
          font-family: inherit;
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color, #3f51b5);
          box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
        }
        
        .form-textarea { height: 80px; resize: vertical; }
        /* .form-row inherited from base class */
        .form-row .form-group { flex: 1; }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }
        
        @keyframes fadeIn { to { opacity: 1; } }
        
        .modal-content {
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-sm);
          padding: 0;
          max-width: 500px;
          width: 90%;
          max-height: 90%;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          transform: scale(0.9);
          animation: scaleIn 0.3s forwards;
        }
        
        @keyframes scaleIn { to { transform: scale(1); } }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
          background: var(--secondary-background-color, #fafafa);
        }
        
        .modal-title { margin: 0; font-size: 1.2em; color: var(--primary-text-color, #212121); }
        .modal-body { padding: var(--kt-space-xl); max-height: 60vh; overflow-y: auto; }
        .modal-footer {
          padding: var(--kt-space-lg) 24px;
          border-top: 1px solid var(--divider-color, #e0e0e0);
          background: var(--secondary-background-color, #fafafa);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--secondary-text-color, #757575);
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--kt-radius-round);
          transition: all 0.3s;
        }
        
        .close-btn:hover { background: rgba(0,0,0,0.1); }
        
        .empty-state {
          text-align: center;
          padding: 40px;
          color: var(--secondary-text-color, #757575);
        }
        
        .empty-state-icon { font-size: 4em; margin-bottom: 16px; opacity: 0.5; }
        .empty-state p { margin: 0 0 20px 0; font-size: 1.1em; }
        
        .grid { display: grid; gap: 24px; }
        .grid-2 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .grid-3 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        
        .single-child-view {
          display: flex;
          justify-content: center;
          gap: 24px;
        }
        
        .single-child-view .child-card {
          max-width: 400px;
          width: 100%;
        }
        
        .avatar-options { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
        .avatar-option {
          padding: var(--kt-space-sm);
          border: 2px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-sm);
          background: var(--secondary-background-color, #fafafa);
          cursor: pointer;
          font-size: 1.5em;
          transition: all 0.3s;
        }
        .avatar-option:hover { border-color: var(--primary-color, #3f51b5); }
        .avatar-option.selected {
          border-color: var(--accent-color, #ff4081);
          background: rgba(255, 64, 129, 0.1);
        }
        
        .reward-claim { text-align: center; }
        .reward-info {
          margin-bottom: 24px;
          padding: var(--kt-space-lg);
          background: var(--secondary-background-color, #fafafa);
          border-radius: var(--kt-radius-sm);
        }
        .reward-info h3 {
          margin: 0 0 8px 0;
          color: var(--primary-text-color, #212121);
        }
        
        .cosmetic-simple-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: var(--kt-space-lg);
          margin: 8px 0;
          background: var(--secondary-background-color, #f8f9fa);
          border-radius: var(--kt-radius-sm);
          border-left: 4px solid #ddd;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cosmetic-simple-item.rarity-common {
          border-left-color: var(--kt-rarity-common);
        }

        .cosmetic-simple-item.rarity-rare {
          border-left-color: var(--custom-rarity-rare)
        }

        .cosmetic-simple-item.rarity-epic {
          border-left-color: var(--custom-rarity-epic);
        }

        .cosmetic-simple-item.rarity-legendary {
          border-left-color: var(-- custom-rarity-legendary);
        }

        .cosmetic-simple-rarity {
          position: relative;
          top: -8px;
          place-self: center;
        }

        .cosmetic-simple-rarity.rarity-common {
          background: var(--kt-rarity-common);
          color: white;
        }
        .cosmetic-simple-rarity.rarity-rare {
          background: var(--custom-rarity-rare);
          color: white;
        }
        .cosmetic-simple-rarity.rarity-epic {
          background: var(--custom-rarity-epic);
          color: white;
        }
        .cosmetic-simple-rarity.rarity-legendary {
          background: var(--custom-rarity-legendary);
          color: white;
        }

        .cosmetic-simple-item:hover {
          background: var(--card-background-color, #fff);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          color: var(--secondary-text-color, #757575);
        }
        
        /* Téléphone */
        @media (max-width: 768px) {
          /*.content { padding: var(--kt-space-lg); }
          .nav-tab { font-size: 11px; padding: var(--kt-space-sm) 4px; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          
          /* Optimisation dashboard pour mobile */
          .children-dashboard-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: var(--kt-space-sm);
          }
          
          /* Stats compactes sur mobile - FORCER une seule ligne */
          .stats-grid-compact {
            flex-direction: row;
            flex-wrap: nowrap;
            gap: var(--kt-space-xs);
            overflow-x: auto;
          }
          
          .stat-card.compact {
            justify-content: center;
            min-width: 80px;
            flex: 1 1 auto;
            padding: var(--kt-space-xs);
            flex-direction: column;
            text-align: center;
          }
          
          .stat-card.compact .stat-icon.small {
            font-size: 1em;
            margin-bottom: 2px;
          }
          
          .modal-content { width: 95%; margin: 0 auto; }
          .modal-body { padding: var(--kt-space-lg); }*/
          
          .task-actions {
            /* position, display, flex-direction, justify-content, right, bottom inherited from non-responsive definition */
            min-width: auto;
          }
          
          .task-actions .btn {
            min-width: 70px;
          }
          
          .child-avatar {
            font-size: 2em !important;
            margin-right: 12px !important;
            flex-shrink: 0;
          }
          
          .reward-icon {
            font-size: 1.5em !important;
            margin-right: 12px !important;
            min-width: 2em !important;
            min-height: 2em !important;
          }
          
          .reward-icon img {
            width: 2em !important;
            height: 2em !important;
          }
          
          .reward-icon ha-icon {
            width: 2em !important;
            height: 2em !important;
          }
          
          .child-info {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .child-name {
            font-size: 0.9em !important;
          }
          
          .child-stats {
            font-size: 0.8em !important;
            text-align: left;
          }
          
          /* Styles supplémentaires pour les cartes individuelles */
          .header {
            padding: var(--kt-space-lg);
          }
          
          .rewards-grid {
            grid-template-columns: 1fr;
          }
          
          .task-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .task-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
        }
    `;
  }

  // Configuration pour Home Assistant
  static getConfigElement() {
    return document.createElement('kids-tasks-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-card',
      title: "Gestionnaire de Tâches Enfants",
      show_navigation: true
    };
  }

  getCosmeticImagePath(cosmeticType, fileName) {
    // Construire le chemin vers l'image cosmétique
    if (!fileName || !cosmeticType) return null;
    
    // URL de base pour les cosmétiques dans Home Assistant
    const baseUrl = '/local/community/kids_tasks/cosmetics';
    return `${baseUrl}/${cosmeticType}/${fileName}`;
  }

  // safeGetCategoryIcon et renderIcon déplacées vers KidsTasksBaseCard

  getCategoryIcon(categoryOrItem) {
    // Si c'est un objet (task/reward), vérifier d'abord l'icône personnalisée
    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }
    
    const category = categoryOrItem;
    
    // Récupérer les icônes depuis l'intégration si _hass est disponible
    if (this._hass && this._hass.states) {
      const pendingValidationsEntity = this._hass.states['sensor.kidtasks_pending_validations'];
      if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.category_icons) {
        const dynamicIcons = pendingValidationsEntity.attributes.category_icons;
        if (dynamicIcons[category]) {
          return this.renderIcon(dynamicIcons[category]);
        }
      }
      
      // Récupérer les icônes de récompenses depuis l'intégration
      if (pendingValidationsEntity && pendingValidationsEntity.attributes && pendingValidationsEntity.attributes.reward_category_icons) {
        const rewardIcons = pendingValidationsEntity.attributes.reward_category_icons;
        if (rewardIcons[category]) {
          return this.renderIcon(rewardIcons[category]);
        }
      }
    }
    
    // Fallback par défaut
    return this.renderIcon('📋');
  }
}

customElements.define('kids-tasks-card', KidsTasksCard);

// Classe de base pour tous les éditeurs de cartes
class KidsTasksBaseCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._rendered = false;
    this._hass = null;
  }

  setConfig(config) {
    const configChanged = JSON.stringify(this._config) !== JSON.stringify(config);
    this._config = Object.assign({}, config);
    // Maintain compatibility with existing code that uses this.config
    this.config = this._config;
    
    if (!this._rendered || configChanged) {
      this._rendered = false;
      if (this._hass) {
        this.render();
        this._rendered = true;
      }
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this.render();
      this._rendered = true;
    }
  }

  // Méthode abstraite à implémenter par les sous-classes
  render() {
    throw new Error('render method must be implemented by subclass');
  }

  // Méthode commune pour déclencher l'événement config-changed
  fireConfigChanged(config) {
    const event = new CustomEvent('config-changed', {
      detail: { config: config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  // CSS commun pour tous les éditeurs
  getCommonEditorStyles() {
    return `
      .config-container {
        padding: var(--kt-space-lg);
        max-width: 600px;
      }
      .config-section {
        margin-bottom: 24px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: var(--kt-radius-sm);
        padding: var(--kt-space-lg);
        background: var(--card-background-color, #fff);
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: var(--primary-text-color, #000);
        border-bottom: 2px solid var(--primary-color, #1976d2);
        padding-bottom: 4px;
      }
      .config-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      .config-item {
        flex: 1;
        min-width: 200px;
      }
      .config-item label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        color: var(--primary-text-color, #000);
      }
      .config-item input[type="text"], 
      .config-item input[type="number"], 
      .config-item select {
        width: 100%;
        padding: var(--kt-space-sm);
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #000);
        box-sizing: border-box;
      }
      .config-item input[type="color"] {
        width: 100%;
        height: 40px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;
      }
      .switch-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .switch-row label {
        cursor: pointer;
        margin-bottom: 0;
      }
      ha-switch {
        --switch-checked-color: var(--primary-color);
      }
      .config-item small {
        display: block;
        color: var(--secondary-text-color, #666);
        font-size: 12px;
        margin-top: 4px;
      }
      .preview-header {
        margin-top: 16px;
        padding: var(--kt-space-lg);
        border-radius: var(--kt-radius-md);
        background: var(--kt-gradient-success);
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 2px solid #2E7D32;
      }
      .preview-avatar { 
        font-size: 2em;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: var(--kt-radius-round);
      }
      .preview-name {
        font-size: 1.2em;
        font-weight: 600;
        flex: 1;
      }
      .preview-level {
        background: rgba(255, 255, 255, 0.2);
        padding: var(--kt-space-xs) 12px;
        border-radius: var(--kt-radius-xl);
        font-size: 0.9em;
        font-weight: 500;
      }
    `;
  }
}

// Éditeur de configuration pour la carte principale
class KidsTasksCardEditor extends KidsTasksBaseCardEditor {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  configChanged(newConfig) {
    this.fireConfigChanged(newConfig);
    // Force re-render pour appliquer les nouveaux styles
    this.render();
  }

  render() {
    
    this.shadowRoot.innerHTML = `
      <style>
        ${this.getCommonEditorStyles()}
        .config-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .config-row label {
          margin-left: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .config-row-vertical {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          gap: 8px;
        }
        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        ha-textfield {
          width: 100%;
          margin-bottom: 16px;
        }
        ha-switch {
          margin-right: 8px;
        }
        .color-input-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .color-input-container label {
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color, #000);
        }
        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color, #666);
          margin-top: 4px;
          font-style: italic;
        }
        .preview-card {
          background: linear-gradient(135deg, var(--primary-color, #1976d2), var(--accent-color, #ff4081));
          color: white;
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-sm);
          text-align: center;
          margin-top: 8px;
          font-weight: 500;
        }
      </style>
      <div class="config-container">
        <!-- Section Configuration Générale -->
        <div class="config-section">
          <div class="section-title">🔧 Configuration Générale</div>          
          <div class="config-row">
            <ha-switch
              id="navigation-switch"
              ${this.config?.show_navigation !== false ? 'checked' : ''}>
            </ha-switch>
            <label>Afficher la navigation par onglets</label>
          </div>
        </div>

        <!-- Section Couleurs Carte Principale -->
        <div class="config-section">
          <div class="section-title">🎨 Couleurs Carte Principale</div>
          
          <div class="config-grid">
            <div class="color-input-container">
              <label>Couleur des onglets</label>
              <input
                type="color"
                id="tab-color-input"
                value="${this.config?.tab_color || '#3f51b5'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur de fond des onglets de navigation</div>
            </div>

            <div class="color-input-container">
              <label>Couleur d'entête</label>
              <input
                type="color"
                id="header-color-input"
                value="${this.config?.header_color || '#1976d2'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur de l'entête du dashboard</div>
            </div>

            <div class="color-input-container">
              <label>Couleur primaire dashboard</label>
              <input
                type="color"
                id="dashboard-primary-input"
                value="${this.config?.dashboard_primary_color || '#2196f3'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur principale des éléments du dashboard</div>
            </div>

            <div class="color-input-container">
              <label>Couleur secondaire dashboard</label>
              <input
                type="color"
                id="dashboard-secondary-input"
                value="${this.config?.dashboard_secondary_color || '#ff4081'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des accents et boutons secondaires</div>
            </div>
          </div>
        </div>

        <!-- Section Couleurs Cartes Enfants -->
        <div class="config-section">
          <div class="section-title">👶 Couleurs Cartes Enfants</div>
          
          <div class="config-grid">
            <div class="color-input-container">
              <label>Début dégradé cartes enfants</label>
              <input
                type="color"
                id="child-gradient-start-input"
                value="${this.config?.child_gradient_start || '#4CAF50'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur de début du dégradé pour les cartes enfants</div>
            </div>

            <div class="color-input-container">
              <label>Fin dégradé cartes enfants</label>
              <input
                type="color"
                id="child-gradient-end-input"
                value="${this.config?.child_gradient_end || '#8BC34A'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur de fin du dégradé pour les cartes enfants</div>
            </div>

            <div class="color-input-container">
              <label>Couleur bordure cartes enfants</label>
              <input
                type="color"
                id="child-border-input"
                value="${this.config?.child_border_color || '#2E7D32'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des bordures des cartes enfants</div>
            </div>

            <div class="color-input-container">
              <label>Couleur texte cartes enfants</label>
              <input
                type="color"
                id="child-text-input"
                value="${this.config?.child_text_color || '#ffffff'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur du texte sur les cartes enfants</div>
            </div>
          </div>

          <!-- Aperçu du dégradé enfant -->
          <div class="preview-card" id="child-preview" 
               style="background: linear-gradient(135deg, ${this.config?.child_gradient_start || '#4CAF50'}, ${this.config?.child_gradient_end || '#8BC34A'}); 
                      color: ${this.config?.child_text_color || '#ffffff'}; 
                      border: 2px solid ${this.config?.child_border_color || '#2E7D32'};">
            Aperçu carte enfant
          </div>
        </div>

        <!-- Section Styles Avancés -->
        <div class="config-section">
          <div class="section-title">⚙️ Styles Avancés</div>
          
          <div class="config-grid">
            <div class="color-input-container">
              <label>Couleur survol boutons</label>
              <input
                type="color"
                id="button-hover-input"
                value="${this.config?.button_hover_color || '#1565C0'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des boutons au survol</div>
            </div>

            <div class="color-input-container">
              <label>Couleur barres de progression</label>
              <input
                type="color"
                id="progress-bar-input"
                value="${this.config?.progress_bar_color || '#4CAF50'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des barres de progression</div>
            </div>

            <div class="color-input-container">
              <label>Couleur badges 🎫</label>
              <input
                type="color"
                id="points-badge-input"
                value="${this.config?.points_badge_color || '#FF9800'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des badges de 🎫</div>
            </div>

            <div class="color-input-container">
              <label>Couleur icônes</label>
              <input
                type="color"
                id="icon-color-input"
                value="${this.config?.icon_color || '#757575'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des icônes dans l'interface</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attacher les événements après le rendu
    const titleInput = this.shadowRoot.getElementById('title-input');
    const navSwitch = this.shadowRoot.getElementById('navigation-switch');
    const tabColorInput = this.shadowRoot.getElementById('tab-color-input');
    const headerColorInput = this.shadowRoot.getElementById('header-color-input');
    const dashboardPrimaryInput = this.shadowRoot.getElementById('dashboard-primary-input');
    const dashboardSecondaryInput = this.shadowRoot.getElementById('dashboard-secondary-input');
    const childGradientStartInput = this.shadowRoot.getElementById('child-gradient-start-input');
    const childGradientEndInput = this.shadowRoot.getElementById('child-gradient-end-input');
    const childBorderInput = this.shadowRoot.getElementById('child-border-input');
    const childTextInput = this.shadowRoot.getElementById('child-text-input');
    const buttonHoverInput = this.shadowRoot.getElementById('button-hover-input');
    const progressBarInput = this.shadowRoot.getElementById('progress-bar-input');
    const pointsBadgeInput = this.shadowRoot.getElementById('points-badge-input');
    const iconColorInput = this.shadowRoot.getElementById('icon-color-input');
    const childPreview = this.shadowRoot.getElementById('child-preview');
    
    if (titleInput) {
      titleInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, title: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (navSwitch) {
      navSwitch.addEventListener('change', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, show_navigation: ev.target.checked };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (tabColorInput) {
      tabColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, tab_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (headerColorInput) {
      headerColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, header_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (dashboardPrimaryInput) {
      dashboardPrimaryInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, dashboard_primary_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (dashboardSecondaryInput) {
      dashboardSecondaryInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, dashboard_secondary_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }

    // Event listeners pour les couleurs des cartes enfants
    if (childGradientStartInput) {
      childGradientStartInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_gradient_start: ev.target.value };
        this.updateChildPreview();
        this.fireConfigChanged(this.config);
      });
    }
    
    if (childGradientEndInput) {
      childGradientEndInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_gradient_end: ev.target.value };
        this.updateChildPreview();
        this.fireConfigChanged(this.config);
      });
    }
    
    if (childBorderInput) {
      childBorderInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_border_color: ev.target.value };
        this.updateChildPreview();
        this.fireConfigChanged(this.config);
      });
    }
    
    if (childTextInput) {
      childTextInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_text_color: ev.target.value };
        this.updateChildPreview();
        this.fireConfigChanged(this.config);
      });
    }

    // Event listeners pour les styles avancés
    if (buttonHoverInput) {
      buttonHoverInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, button_hover_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (progressBarInput) {
      progressBarInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, progress_bar_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (pointsBadgeInput) {
      pointsBadgeInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, points_badge_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    if (iconColorInput) {
      iconColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, icon_color: ev.target.value };
        this.fireConfigChanged(this.config);
      });
    }
    
    this._rendered = true;
  }

  updateChildPreview() {
    const childPreview = this.shadowRoot.getElementById('child-preview');
    if (childPreview && this.config) {
      const gradientStart = this.config.child_gradient_start || '#4CAF50';
      const gradientEnd = this.config.child_gradient_end || '#8BC34A';
      const borderColor = this.config.child_border_color || '#2E7D32';
      const textColor = this.config.child_text_color || '#ffffff';
      
      childPreview.style.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
      childPreview.style.color = textColor;
      childPreview.style.border = `2px solid ${borderColor}`;
    }
  }
}

customElements.define('kids-tasks-card-editor', KidsTasksCardEditor);

// Déclaration pour HACS
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'kids-tasks-card', 
  name: 'Kids Tasks Card',
  description: 'Interface graphique pour gérer les tâches et récompenses des enfants'
});

// =====================================================
// CARTE INDIVIDUELLE POUR ENFANTS
// =====================================================
class KidsTasksChildCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this._refreshInterval = null;
  }

  connectedCallback() {
    // Démarrer le rafraîchissement automatique toutes les 5 secondes
    this._refreshInterval = setInterval(() => {
      if (this._hass && this._initialized) {
        this.render();
      }
    }, 5000);
  }

  disconnectedCallback() {
    // Nettoyer l'intervalle quand l'élément est supprimé
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval);
      this._refreshInterval = null;
    }
  }

  setConfig(config) {
    if (!config || !config.child_id) {
      throw new Error('Configuration invalide: child_id requis');
    }
    
    this.config = {
      child_id: config.child_id,
      title: config.title || 'Mes Tâches',
      show_avatar: config.show_avatar !== false,
      show_progress: config.show_progress !== false,
      show_rewards: config.show_rewards !== false,
      ...config
    };
    
    // État pour les onglets
    this.currentTab = 'tasks';
    
    // Re-rendre la carte si elle est déjà initialisée avec les nouvelles couleurs
    if (this._initialized && this._hass) {
      this.render();
    }
  }

  handleClick(event) {
    // Logique spécifique pour les filtres de récompenses dans la carte enfant
    const target = event.target.closest('[data-action]');
    if (target && target.dataset.action === 'filter-rewards') {
      event.preventDefault();
      event.stopPropagation();
      this.handleAction('filter-rewards', target.dataset.filter, event);
      return;
    }
    
    // Déléguer à la classe de base pour le reste
    super.handleClick(event);
  }

  handleAction(action, id = null) {
    if (!this._hass) return;
    
    try {
      switch (action) {
        case 'switch_tab':
          this.currentTab = id;
          this.render();
          break;
          
        case 'complete_task':
          const childId = this.config.child_id;
          if (!childId) {
            this.showNotification('Erreur: ID enfant manquant', 'error');
            return;
          }
          this._hass.callService('kids_tasks', 'complete_task', {
            task_id: id,
            child_id: childId,
          });
          this.showNotification('Tâche marquée comme terminée ! 🎉', 'success');
          break;
          
        case 'validate_task':
          this._hass.callService('kids_tasks', 'validate_task', {
            task_id: id,
          });
          this.showNotification('Tâche validée ! ✅', 'success');
          break;
          
        case 'filter-rewards':
          // Utiliser l'ID passé (qui contient le filtre) au lieu de l'événement
          this.rewardsFilter = id;
          this.render();
          break;
          
        case 'show_reward_detail':
          this.showRewardDetail(id);
          break;
          
        case 'claim_reward':
          this._hass.callService('kids_tasks', 'claim_reward', {
            reward_id: id,
            child_id: this.config.child_id,
          });
          this.showNotification('Récompense échangée ! 🎁', 'success');
          break;
          
        default:
          console.warn('Action inconnue:', action);
      }
    } catch (error) {
      console.error('Action échouée:', error);
      this.showNotification('Erreur: ' + error.message, 'error');
    }
  }

  // Récupérer les données de l'enfant spécifique
  getChild() {
    if (!this._hass) return null;

    const entities = this._hass.states;
    
    // Chercher l'entité de points de cet enfant (nouveau format KT_ ou ancien)
    const pointsEntity = Object.values(entities).find(entity => 
      entity.attributes && 
      (entity.attributes.type === 'child' || entity.entity_id?.startsWith('sensor.KT_')) &&
      entity.attributes.child_id === this.config.child_id
    );

    if (!pointsEntity) return null;

    const points = parseInt(pointsEntity.state) || 0;
    const coins = parseInt(pointsEntity.attributes.coins) || 0;
    const level = parseInt(pointsEntity.attributes.level) || 1;
    const progress = ((points % 100) / 100) * 100;

    return {
      id: this.config.child_id,
      name: pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || 'Enfant',
      points: points,
      coins: coins,
      level: level,
      progress: progress,
      avatar: pointsEntity.attributes.avatar || '👶',
      pointsToNext: pointsEntity.attributes.points_to_next_level || (100 - (points % 100)),
      card_gradient_start: pointsEntity.attributes.card_gradient_start,
      card_gradient_end: pointsEntity.attributes.card_gradient_end,
      avatar_type: pointsEntity.attributes.avatar_type || 'emoji',
      avatar_data: pointsEntity.attributes.avatar_data,
      person_entity_id: pointsEntity.attributes.person_entity_id
    };
  }

  // Récupérer les tâches de l'enfant
  getTasks() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const tasks = [];
    
    
    // Chercher toutes les entités de tâches possibles
    const taskEntities = Object.keys(entities).filter(entityId => 
      entityId.includes('task') || entityId.startsWith('sensor.kidtasks_')
    );
    
    
    // Essayer différents formats d'entités de tâches
    Object.keys(entities).forEach(entityId => { 
      if (entityId.startsWith('sensor.kidtasks_task_') || entityId.startsWith('sensor.kids_tasks_task_') || entityId.includes('_task_')) {
        const taskEntity = entities[entityId];
        
        if (taskEntity && taskEntity.attributes && taskEntity.state !== 'unavailable') {
          const attrs = taskEntity.attributes;
          // Vérifier si l'enfant est assigné (nouveau format avec array ou ancien format)
          const isAssigned = attrs.assigned_child_ids 
            ? attrs.assigned_child_ids.includes(this.config.child_id)
            : attrs.assigned_child_id === this.config.child_id;
            
            
          if (isAssigned) {
            
            // Utiliser uniquement le statut individuel de l'enfant
            let childStatus = 'todo';
            let childCompletedAt = null;
            let childValidatedAt = null;
            let childPenaltyAppliedAt = null;
            let childPenaltyApplied = false;
            
            if (attrs.child_statuses && attrs.child_statuses[this.config.child_id]) {
              const individualStatus = attrs.child_statuses[this.config.child_id];
              childStatus = individualStatus.status || 'todo';
              childCompletedAt = individualStatus.completed_at;
              childValidatedAt = individualStatus.validated_at;
              childPenaltyAppliedAt = individualStatus.penalty_applied_at;
              childPenaltyApplied = individualStatus.penalty_applied || false;
            } else {
            }
            
            tasks.push({
              id: attrs.task_id || entityId.replace('sensor.kidtasks_task_', ''),
              name: attrs.task_name || attrs.friendly_name || 'Tâche',
              description: attrs.description || '',
              category: attrs.category || 'other',
              points: parseInt(attrs.points) || 10,
              coins: parseInt(attrs.coins) || 0,
              penalty_points: parseInt(attrs.penalty_points) || 0,
              status: childStatus,
              frequency: attrs.frequency || 'daily',
              validation_required: attrs.validation_required !== false,
              active: attrs.active !== false,
              assigned_child_id: attrs.assigned_child_id,
              assigned_child_ids: attrs.assigned_child_ids || [],
              last_completed_at: childCompletedAt,
              last_validated_at: childValidatedAt,
              penalty_applied_at: childPenaltyAppliedAt,
              penalty_applied: childPenaltyApplied,
              weekly_days: attrs.weekly_days,
              icon: attrs.icon
            });
          }
        }
      }
    });
    
    // Trier par statut (en attente en premier, puis à faire)
    const sortedTasks = tasks.sort((a, b) => {
      const statusOrder = { 'pending_validation': 0, 'todo': 1, 'completed': 2, 'validated': 3 };
      return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    });
    
    return sortedTasks;
  }

  // Récupérer les récompenses disponibles
  getRewards() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const rewards = [];
    
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les capteurs kidtasks_reward_
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_reward_')) {
        const rewardEntity = entities[entityId];
        if (rewardEntity && rewardEntity.attributes && rewardEntity.state !== 'unavailable') {
          const attrs = rewardEntity.attributes;
          
          
          rewards.push({
            id: attrs.reward_id || entityId.replace('sensor.kidtasks_reward_', ''),
            name: attrs.reward_name || attrs.friendly_name || 'Récompense',
            cost: parseInt(attrs.cost) || parseInt(rewardEntity.state) || 0,
            coin_cost: parseInt(attrs.coin_cost) || 0,
            category: attrs.category || 'fun',
            icon: attrs.icon,
            description: attrs.description || '',
            active: attrs.active !== false,
            remaining_quantity: attrs.remaining_quantity,
            is_available: attrs.is_available !== false,
            reward_type: attrs.reward_type || 'standard',
            cosmetic_data: attrs.cosmetic_data || null,
            min_level: parseInt(attrs.min_level) || 1
          });
        }
      }
    });
    
    return rewards.filter(r => r.active && r.is_available).sort((a, b) => a.cost - b.cost);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: var(--kt-space-md) 20px;
      background: ${type === 'error' ? 'var(--kt-notification-error)' : type === 'success' ? 'var(--kt-notification-success)' : 'var(--kt-notification-info)'};
      color: white;
      border-radius: var(--kt-radius-sm);
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
      font-size: 14px;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 4000);
  }


  getStatusLabel(status) {
    const labels = {
      'todo': 'À faire',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'pending_validation': 'En attente de validation',
      'validated': 'Validé ✅'
    };
    return labels[status] || status;
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;
    
    // Vérifier si les données de l'enfant ont changé (entité points)
    const oldChildEntity = oldHass.states[`sensor.kidtasks_${this.config.child_id}_points`];
    const newChildEntity = newHass.states[`sensor.kidtasks_${this.config.child_id}_points`];
    
    if (!oldChildEntity !== !newChildEntity) return true;
    if (oldChildEntity && newChildEntity) {
      if (oldChildEntity.state !== newChildEntity.state || 
          JSON.stringify(oldChildEntity.attributes) !== JSON.stringify(newChildEntity.attributes)) {
        return true;
      }
    }
    
    // Vérifier si les tâches de cet enfant ont changé
    const oldTaskEntities = Object.keys(oldHass.states)
      .filter(id => id.startsWith('sensor.kids_tasks_task_'))
      .filter(id => oldHass.states[id].attributes && oldHass.states[id].attributes.child_id === this.config.child_id);
    const newTaskEntities = Object.keys(newHass.states)
      .filter(id => id.startsWith('sensor.kids_tasks_task_'))
      .filter(id => newHass.states[id].attributes && newHass.states[id].attributes.child_id === this.config.child_id);
    
    if (oldTaskEntities.length !== newTaskEntities.length) return true;
    
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state || 
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }
    
    // Vérifier si les récompenses ont changé (pour l'affichage des récompenses disponibles)
    if (this.config.show_rewards) {
      const oldRewardEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kids_tasks_reward_'));
      const newRewardEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kids_tasks_reward_'));
      
      if (oldRewardEntities.length !== newRewardEntities.length) return true;
      
      for (const entityId of oldRewardEntities) {
        const oldEntity = oldHass.states[entityId];
        const newEntity = newHass.states[entityId];
        if (!newEntity || oldEntity.state !== newEntity.state || 
            JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
          return true;
        }
      }
    }
    
    return false;
  }

  getChildFromHass(hass) {
    if (!hass) return null;
    const childEntity = hass.states[`sensor.kidtasks_${this.config.child_id}_points`];
    return childEntity ? childEntity.attributes : null;
  }

  getTasksFromHass(hass) {
    if (!hass) return [];
    return Object.values(hass.states)
      .filter(entity => 
        entity.entity_id.startsWith('sensor.kids_tasks_task_') &&
        entity.attributes &&
        entity.attributes.child_id === this.config.child_id
      )
      .map(entity => entity.attributes);
  }

  getRewardsFromHass(hass) {
    if (!hass || !this.config.show_rewards) return [];
    return Object.values(hass.states)
      .filter(entity => 
        entity.entity_id.startsWith('sensor.kids_tasks_reward_')
      )
      .map(entity => entity.attributes);
  }

  render() {
    if (!this._hass || !this.config) {
      this.shadowRoot.innerHTML = '<div class="loading">Chargement...</div>';
      return;
    }

    const child = this.getChild();
    if (!child) {
      this.shadowRoot.innerHTML = `
        <div class="error">
          <h3>Enfant non trouvé</h3>
          <p>L'enfant avec l'ID "${this.config.child_id}" n'a pas été trouvé.</p>
        </div>
      `;
      return;
    }

    const tasks = this.getTasks();
    const rewards = this.config.show_rewards ? this.getRewards() : [];
    const stats = this.getChildStats(child, tasks);
    const taskCategories = this.getTasksByCategory(tasks);
    

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}   
      <div class="kidstask-card">
        <!-- Header avec avatar et jauges -->
        <div class="header">
          <div class="header-content">
            ${this.config.show_avatar ? `
            <div class="kt-avatar-section">
              <div class="kt-child-name-header">${child.name}</div>
              <div class="kt-avatar-container">
                <div class="kt-avatar kt-avatar--large">${this.getAvatar(child)}</div>
                <div class="kt-level-badge">Niveau ${stats.level}</div>
              </div>
            </div>
            ` : `
            <div class="no-avatar-section">
              <div class="kt-child-name-header">${child.name}</div>
              <div class="level-badge">Niveau ${stats.level}</div>
            </div>
            `}
            
            ${this.config.show_progress ? `<div class="gauges-section">
                ${(() => {
                  stats.coins = child.coins || 0; // Ajouter les coins aux stats
                  return this.renderGauges(stats, false, true);
                })()}
              </div>` : ''}
          </div>
        </div>

        <!-- Navigation par onglets -->
        <div class="tabs">
          <button class="tab ${this.currentTab === 'tasks' ? 'active' : ''}" 
                  data-action="switch_tab" data-id="tasks">Tâches</button>
          <button class="tab ${this.currentTab === 'past' ? 'active' : ''}" 
                  data-action="switch_tab" data-id="past">Passées</button>
          <button class="tab ${this.currentTab === 'bonus' ? 'active' : ''}" 
                  data-action="switch_tab" data-id="bonus">Bonus</button>
          ${this.config.show_rewards ? `<button class="tab ${this.currentTab === 'rewards' ? 'active' : ''}" 
                  data-action="switch_tab" data-id="rewards">Récompenses</button>` : ''}
        </div>
        <div class="content">
          ${this.renderTabContent(taskCategories, rewards, stats, child)}
        </div>
      </div>
    `;
  }
  
  getChildren() {
    if (!this._hass) return [];
    const children = [];
    
    Object.keys(this._hass.states).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const entity = this._hass.states[entityId];
        if (entity && entity.attributes && entity.state !== 'unavailable') {
          children.push({
            id: entity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', ''),
            name: entity.attributes.name || entity.attributes.friendly_name || 'Enfant',
            points: parseInt(entity.state) || 0,
            coins: parseInt(entity.attributes.coins) || 0,
            level: entity.attributes.level || 1
          });
        }
      }
    });
    
    return children;
  }

  getCardSize() {
    return 6;
  }

  static getConfigElement() {
    return document.createElement('kids-tasks-child-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-child-card',
      child_id: '',
      title: 'Mes Tâches',
      show_avatar: true,
      show_progress: true,
      show_rewards: true
    };
  }

  // Méthodes d'icônes maintenant héritées de KidsTasksBaseCard

  getCategoryIcon(categoryOrItem) {
    // Si c'est un objet (task/reward), vérifier d'abord l'icône personnalisée
    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }
    
    // Utiliser les icônes dynamiques si disponibles
    if (this._hass && this._hass.states) {
      const pendingValidationsEntity = this._hass.states['sensor.kids_tasks_pending_validations'];
      if (pendingValidationsEntity && pendingValidationsEntity.attributes) {
        const dynamicIcons = pendingValidationsEntity.attributes.category_icons;
        if (dynamicIcons && dynamicIcons[categoryOrItem]) {
          return this.renderIcon(dynamicIcons[categoryOrItem]);
        }
        
        // Essayer aussi les icônes de récompenses
        const rewardIcons = pendingValidationsEntity.attributes.reward_category_icons;
        if (rewardIcons && rewardIcons[categoryOrItem]) {
          return this.renderIcon(rewardIcons[categoryOrItem]);
        }
      }
    }
    
    // Fallback par défaut
    return this.renderIcon('📋');
  }

  // Calculer les statistiques de l'enfant
  getChildStats(child, tasks) {
    // Utiliser la méthode partagée pour calculer les statistiques de base
    const baseStats = this.calculateChildStatistics(child, tasks);
    
    // Ajouter les champs spécifiques à la carte enfant
    const activeTasks = tasks.filter(task => 
      task.status === 'todo' && 
      this.isTaskActiveToday(task)
    );
    
    const pendingTasks = tasks.filter(task => 
      task.status === 'pending_validation'
    );
    
    return {
      ...baseStats,
      activeTasks: activeTasks.length,
      pendingTasks: pendingTasks.length
    };
  }

  // Obtenir les tâches par catégorie
  getTasksByCategory(tasks) {
    
    const todoTasks = tasks.filter(t => {
      const isTodo = t.status === 'todo';
      const isActive = this.isTaskActiveToday(t);
      return isTodo && isActive;
    });
    
    const pendingTasks = tasks.filter(t => t.status === 'pending_validation');
    
    const completedTasks = tasks.filter(t => {
      const isCompleted = (t.status === 'validated' || t.status === 'completed');
      const isActive = this.isTaskActiveToday(t);
      return isCompleted && isActive;
    });
    
    const pastTasks = tasks.filter(t => this.isTaskFromPast(t));
    
    const bonusTasks = tasks.filter(task => task.frequency === 'none');

    const categories = {
      todo: todoTasks,
      pending: pendingTasks,
      completed: completedTasks,
      bonus: bonusTasks,
      past: pastTasks
    };
    
    return categories;
  }

  // Vérifier si une tâche est du passé
  isTaskFromPast(task) {
    if (!task.last_completed_at) return false;
    const taskDate = new Date(task.last_completed_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today && (task.status === 'validated' || task.status === 'completed');
  }

  // Générer les styles CSS pour le nouveau design
  // Couche 3: Styles configurables pour KidsTasksChildCard
  getConfigurableStyles() {
    const gradientStart = this.config?.child_gradient_start || this.config?.gradient_start || '#4CAF50';
    const gradientEnd = this.config?.child_gradient_end || this.config?.gradient_end || '#8BC34A';
    const borderColor = this.config?.child_border_color || this.config?.border_color || '#2E7D32';
    const textColor = this.config?.child_text_color || this.config?.text_color || '#ffffff';
    
    // Récupérer les variables CSS personnalisées du style parent pour les couleurs secondaires
    const computedStyle = getComputedStyle(this);
    const customDashboardPrimary = computedStyle.getPropertyValue('--custom-dashboard-primary').trim() || gradientStart;
    const customDashboardSecondary = computedStyle.getPropertyValue('--custom-dashboard-secondary').trim() || gradientEnd;
    const customHeaderColor = computedStyle.getPropertyValue('--custom-header-color').trim() || gradientStart;
    const customTabColor = computedStyle.getPropertyValue('--custom-tab-color').trim() || gradientStart;
    
    return `
      /* Variables configurables pour la carte enfant */
      :host {
        --primary-color: ${customDashboardPrimary};
        --secondary-color: ${customDashboardSecondary};
        --header-color: ${customHeaderColor};
        --tab-color: ${customTabColor};
        --border-color: ${borderColor};
        --header-text-color: ${textColor};
        --success-color: var(--kt-success);
        --warning-color: var(--kt-warning);
        --error-color: var(--kt-error);
        --info-color: var(--kt-info);
      }
    `;
  }

  // Couche 4: Styles spécifiques à KidsTasksChildCard
  getSpecificStyles() {
    return `
      /* Layout principal enfant */
      :host {
        display: block;
        font-family: var(--kt-font-family);
        }
        
        .kidstask-card {
          background: var(--card-background-color, #fff);
          border-radius: var(--kt-radius-lg);
          box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0,0,0,0.1));
          overflow: hidden;
          max-width: 100%;
          position: relative;
        }
        
        .no-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 80px;
        }

        /* Navigation par onglets */
        .tabs {
          display: flex;
          background: var(--card-background-color, #fff);
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .tab {
          flex: 1;
          padding: var(--kt-space-lg) 12px;
          border: none;
          background: transparent;
          color: var(--secondary-text-color, #757575);
          font-weight: 600;
          font-size: 0.9em;
          cursor: pointer;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }
        
        .tab:hover {
          background: rgba(0,0,0,0.05);
          color: var(--primary-text-color, #212121);
        }
        
        .tab.active {
          color: var(--tab-color);
          border-bottom-color: var(--tab-color);
          background: rgba(107, 115, 255, 0.05);
          position: relative;
        }
        
        .tab.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--primary-color);
          opacity: 0.05;
          z-index: -1;
        }
        
        /* Contenu */
        .content {
          /* padding and background inherited from base */
          min-height: 400px;
        }
        
        /* Tâches */    
        .task-info {
          flex: 1;
        }
        
        .task-deadline {
          color: var(--warning-color);
        }
        
        /* .task-actions inherited from base class */
        
        .btn-task {
          padding: 10px 16px;
          border: none;
          border-radius: var(--kt-radius-xl);
          font-size: 0.85em;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .btn-complete {
          background: var(--success-color);
          color: white;
        }
        
        .btn-complete:hover {
          background: #45a049;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .btn-validate {
          background: var(--warning-color);
          color: white;
        }
        
        .btn-validate:hover {
          background: #e68900;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        /* Récompenses en grille */
        /* .rewards-grid inherited from base class */
        
        .reward-square {
          /* display, flex-direction, align-items, cursor inherited from base */
          aspect-ratio: 1;
          background: var(--secondary-background-color, #f8f9fa);
          border-radius: 6px;
          padding: 6px;
          justify-content: center;
          transition: all 0.3s;
          border: 1px solid transparent;
          text-align: center;
        }
        
        .reward-square.affordable {
          border-color: var(--success-color);
          background: #e8f5e833;
        }
        
        .reward-square.points-only {
          border-left: 4px solid #4caf5033;
        }
        
        .reward-square.coins-only {
          border-left: 4px solid #ffc10733;
        }
        
        .reward-square.dual-currency {
          border-left: 4px solid #9c27b033;
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
        }
        
        .reward-square:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .reward-icon-large {
          /* display, align-items, justify-content inherited from base */
          font-size: 4em;
          margin-bottom: 8px;
          width: 64px;
          height: 64px;
        }
        
        .reward-icon-large ha-icon {
          display: flex !important;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .reward-name {
          font-weight: bold;
          font-size: 1em;
          margin-bottom: 2px;
          color: var(--primary-text-color);
          line-height: 1.2;
          text-align: center;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
        }
        
        .reward-price {
          font-size: 0.55em;
          color: var(--primary-color);
          font-weight: bold;
        }
        
        /* Styles pour les cosmétiques */
        .reward-square.cosmetic {
          background: linear-gradient(135deg, #ffffffff 0%, #0000006c 100%);
        }
        
        .reward-square.cosmetic.affordable {
          border-color: #d49c00ff;
          background: linear-gradient(135deg, #ffffffff 0%, #0000006c 100%);
        }
        
        .reward-level {
          font-size: 0.6em;
          background: var(--primary-color, #3f51b5);
          color: white;
          padding: 1px 4px;
          border-radius: var(--kt-radius-sm);
          margin-top: 2px;
        }
        
        /* Styles pour les previews cosmétiques */
        .cosmetic-avatar-preview {
          font-size: 1.2em;
        }
        
        .cosmetic-pixel-art-preview {
          width: 20px;
          height: 20px;
          image-rendering: pixelated;
        }
        
        .cosmetic-outfit-preview {
          position: relative;
          font-size: 1em;
        }
        
        .cosmetic-outfit-preview .outfit-overlay {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 0.6em;
        }
        
        .cosmetic-theme-preview {
          display: flex;
          gap: 2px;
        }

        /* États vides */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--secondary-text-color, #757575);
        }
        
        .empty-icon {
          font-size: 4em;
          opacity: 0.3;
          margin-bottom: 16px;
        }
        
        .empty-text {
          font-size: 1.1em;
          margin-bottom: 8px;
        }
        
        .empty-subtext {
          font-size: 0.9em;
          opacity: 0.7;
        }
        
        
        
        /* Styles pour l'onglet historique */
        .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .section-header.success {
          color: var(--success-color, #4CAF50);
        }
        
        .section-header.penalty {
          color: var(--error-color, #f44336);
        }
        
        .section-icon {
          font-size: 1.2em;
          margin-right: 8px;
        }
        
        .section-title {
          font-weight: bold;
          font-size: 1.1em;
        }
        
        
        .task-result {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: var(--kt-radius-round);
          font-size: 1.2em;
          flex-shrink: 0;
        }
        
        .task-result.success {
          background: rgba(76, 175, 80, 0.1);
        }
        
        .task-result.penalty {
          background: rgba(244, 67, 54, 0.1);
        }
        
        .completion-date, .validation-date, .penalty-date {
          font-size: 0.8em;
          color: var(--secondary-text-color, #757575);
          font-style: italic;
        }
        
        .completion-date::before {
          content: "📅 ";
        }
        
        .validation-date::before {
          content: "✅ ";
        }
        
        .penalty-date::before {
          content: "⏰ ";
        }
        
        .task-name {
          font-weight: 500;
          color: var(--primary-text-color, #212121);
          font-size: 1em;
          line-height: 1.2;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .task-name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        
        .task-points {
          font-size: 0.85em;
          font-weight: 500;
        }
        
        .task-action-compact {
          flex-shrink: 0;
        }

        
        /* Indicateurs de statut pour les tâches */
        .status {
          font-size: 0.8em;
          padding: var(--kt-space-xs) 8px;
          border-radius: var(--kt-radius-md);
          font-weight: 500;
          text-align: center;
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
        
        
        /* Modal de détail des récompenses */
        .reward-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }
        
        .reward-modal-content {
          background: var(--card-background-color, #fff);
          border-radius: var(--kt-radius-lg);
          padding: var(--kt-space-xl);
          max-width: 400px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .reward-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          color: var(--secondary-text-color, #757575);
          width: 32px;
          height: 32px;
          border-radius: var(--kt-radius-round);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .reward-modal-close:hover {
          background: var(--secondary-background-color, #f5f5f5);
          color: var(--primary-text-color, #212121);
        }
        
        .reward-modal-icon {
          font-size: 4em;
          text-align: center;
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
          text-align: center;
          margin-bottom: 8px;
          color: var(--primary-text-color, #212121);
        }
        
        .reward-modal-price {
          font-size: 1.2em;
          color: var(--primary-color);
          font-weight: bold;
          text-align: center;
          margin-bottom: 16px;
        }
        
        .reward-modal-description {
          color: var(--secondary-text-color, #757575);
          line-height: 1.5;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .reward-modal-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        
        .btn-modal {
          padding: var(--kt-space-md) 24px;
          border: none;
          border-radius: var(--kt-radius-xl);
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
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
    `;
  }

  // Rendu du contenu des onglets
  renderTabContent(taskCategories, rewards, stats, child) {
    switch (this.currentTab) {
      case 'tasks':
        return this.renderTasksTab(taskCategories.todo.concat(taskCategories.pending));
      case 'past':
        return this.renderPastTab(taskCategories.completed.concat(taskCategories.past));
      case 'bonus':
        return this.renderTasksTab(taskCategories.bonus);
      case 'rewards':
        return this.renderRewardsTab(rewards, child.points);
      default:
        return this.renderTasksTab(taskCategories.todo.concat(taskCategories.pending));
    }
  }

  // Onglet des tâches actives
  renderTasksTab(tasks) {
    if (tasks.length === 0) {
      return emptySection('🎉', 'Toutes les tâches sont terminées !', 'Bravo ! Tu as tout fini.');
    }

    return `
      <div class="task-list">
        ${tasks.map(task => {
          // Déterminer la classe de retard
          let delayClass = '';
          if (task.deadline_passed && task.status === 'todo') {
            delayClass = 'delayed';
          } else if (task.status === 'pending_validation') {
            delayClass = 'pending';
          } else {
            delayClass = 'on-time';
          }
          
          return `
            <div class="task ${task.status} ${delayClass}">
              <div class="task-icon">${this.safeGetCategoryIcon(task, '📋')}</div>
              <div class="task-main flex-content">
                <div class="task-name">${task.name}</div>
                <div class="task-points">
                  ${this.config && this.config.child_id ? `
                    ${task.points > 0 ? `<span style="color: #4CAF50; font-weight: bold;">+${task.points} 🎫</span>` : ''}
                    ${task.penalty_points > 0 ? `<span style="color: #f44336; font-weight: bold;">-${task.penalty_points} 🎫</span>` : ''}
                    ${task.coins > 0 ? `<span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span>` : ''}
                  ` : `
                    ${task.points > 0 ? `+${task.points}` : ''}${task.coins > 0 ? ` +${task.coins}🪙` : ''} ${task.penalty_points ? `| -${task.penalty_points}` : ''}
                  `}
                </div>
              </div>
              <div class="task-action-compact">
                ${task.status === 'todo' ? `
                  <button class="btn btn-complete" 
                          data-action="complete_task" 
                          data-id="${task.id}">Terminé</button>
                ` : task.status === 'pending_validation' ? `
                  ${this.config && this.config.child_id ? `
                    <span class="status pending">En attente de validation</span>
                  ` : `
                    <button class="btn btn-validate" 
                            data-action="validate_task"
                            data-id="${task.id}">Validation</button>
                  `}
                ` : `
                  <span class="status completed">✓ Validée</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // Onglet des tâches passées
  renderPastTab(tasks) {
    // Obtenir les occurrences des tâches bonus validées
    const bonusTaskOccurrences = this.getBonusTaskOccurrences();
    
    // Combiner les tâches normales avec les occurrences bonus
    const allPastTasks = [...tasks, ...bonusTaskOccurrences];
    
    if (allPastTasks.length === 0) {
      return this.emptySection('📚', 'Aucune tâche passée', 'Tes tâches terminées apparaîtront ici.');
    }

    // Séparer les tâches réussies des tâches manquées
    const completedTasks = allPastTasks.filter(task => task.status === 'validated' || task.status === 'completed');
    const missedTasks = allPastTasks.filter(task => task.status === 'missed' || task.penalty_applied);
    
    // Vérifier si nous sommes dans une carte enfant
    const isChildCard = this.config && this.config.child_id;

    return `
      <div>
        ${completedTasks.length > 0 ? `
          <div class="past-section">
            ${!isChildCard ? `
              <div class="section-header success">
                <span class="section-icon">✅</span>
                <span class="section-title">Tâches réussies (${completedTasks.length})</span>
              </div>
            ` : ''}
            <div class="task-list">
              ${completedTasks.map(task => `
                <div class="task completed ${isChildCard ? 'success-border' : ''}">
                  <div class="task-icon">${this.safeGetCategoryIcon(task, '📋')}</div>
                  <div class="task-main flex-content">
                    <div class="task-name-row">
                      <div class="task-name">${task.name}</div>
                      ${task.last_validated_at ? `<div class="task-validation-compact" style="font-style: italic; font-size: 0.8em; color: var(--secondary-text-color);">Validée le ${new Date(task.last_validated_at).toLocaleDateString('fr-FR')}</div>` : ''}
                    </div>
                    <div class="task-points">
                      ${task.points > 0 ? `<span style="color: #4CAF50; font-weight: bold;">+${task.points} 🎫</span>` : ''}
                      ${task.coins > 0 ? `<span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span>` : ''}
                      ${task.last_completed_at ? `<div style="color: var(--secondary-text-color);">${new Date(task.last_completed_at).toLocaleDateString('fr-FR')}</div>` : ''}
                    </div>
                  </div>
                  <div class="task-action-compact">
                    <span class="task-result-compact success">🎉</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${missedTasks.length > 0 ? `
          <div class="past-section" style="margin-top: ${completedTasks.length > 0 ? '20px' : '0'};">
            <div class="section-header penalty">
              <span class="section-icon">❌</span>
              <span class="section-title">Tâches manquées (${missedTasks.length})</span>
            </div>
            <div class="task-list">
              ${missedTasks.map(task => `
                <div class="task missed">
                  <div class="task-icon">${this.safeGetCategoryIcon(task, '📋')}</div>
                  <div class="task-main flex-content">
                    <div class="task-name">${task.name}</div>
                    <div class="task-points">
                      -<span class="points-lost">${task.penalty_points ? task.penalty_points : Math.floor(task.points / 2)}</span> 🎫
                      ${task.penalty_applied_at ? ` • Pénalité le ${new Date(task.penalty_applied_at).toLocaleDateString('fr-FR')}` : ''}
                    </div>
                  </div>
                  <div class="task-action-compact">
                    <span class="task-result-compact penalty">😞</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Obtenir les occurrences des tâches bonus validées pour l'historique
  getBonusTaskOccurrences() {
    const child = this.getChild();
    if (!child) return [];

    const allTasks = this.getTasks();
    const bonusTasks = allTasks.filter(task => task.frequency === 'none');
    const occurrences = [];

    bonusTasks.forEach(task => {
      if (task.child_statuses && task.child_statuses[child.id]) {
        const childStatus = task.child_statuses[child.id];
        
        // Nouveau : utiliser l'historique des validations si disponible
        if (childStatus.validation_history && childStatus.validation_history.length > 0) {
          childStatus.validation_history.forEach((validation, index) => {
            occurrences.push({
              id: `${task.id}_bonus_${validation.validated_at}_${index}`,
              name: `${task.name} (Bonus)`,
              description: task.description,
              icon: task.icon,
              category: task.category,
              points: task.points,
              frequency: 'none',
              status: 'validated',
              last_completed_at: validation.completed_at,
              last_validated_at: validation.validated_at,
              isBonus: true
            });
          });
        } 
        // Fallback pour l'ancienne méthode (si pas d'historique mais validation présente)
        else if (childStatus.validated_at) {
          occurrences.push({
            id: `${task.id}_bonus_${childStatus.validated_at}`,
            name: `${task.name} (Bonus)`,
            description: task.description,
            icon: task.icon,
            category: task.category,
            points: task.points,
            frequency: 'none',
            status: 'validated',
            last_completed_at: childStatus.completed_at,
            last_validated_at: childStatus.validated_at,
            isBonus: true
          });
        }
      }
    });

    // Trier par date de validation (plus récent en premier)
    return occurrences.sort((a, b) => new Date(b.last_validated_at) - new Date(a.last_validated_at));
  }

  // Onglet des récompenses
  renderRewardsTab(rewards, childPoints) {
    if (rewards.length === 0) {
      return this.emptySection('🎁', 'Aucune récompense', 'Les récompenses apparaîtront ici.');
    }

    const child = this.getChild();
    const childCoins = child ? child.coins || 0 : 0;
    const childLevel = child ? child.level || 1 : 1;
    
    
    // Séparer les récompenses normales des cosmétiques avec détection par category
    const isCosmetic = (r) => {
      const hasCosmetic = !!(r.cosmetic_data || r.reward_type === 'cosmetic' || r.category === 'cosmetic');
      const hasCosmetic2 = r.name && (
        r.name.toLowerCase().includes('avatar') ||
        r.name.toLowerCase().includes('thème') ||
        r.name.toLowerCase().includes('theme') ||
        r.name.toLowerCase().includes('background') ||
        r.name.toLowerCase().includes('outfit') ||
        r.name.toLowerCase().includes('océan') ||
        r.name.toLowerCase().includes('coucher')
      );
      return hasCosmetic || hasCosmetic2;
    };
    
    const regularRewards = rewards.filter(r => !isCosmetic(r));
    const cosmeticRewards = rewards.filter(r => isCosmetic(r));
    
    
    // Filtrer par niveau minimum
    const availableRegularRewards = regularRewards.filter(r => (r.min_level || 1) <= childLevel);
    const availableCosmeticRewards = cosmeticRewards.filter(r => (r.min_level || 1) <= childLevel);
    
    const currentFilter = this.rewardsFilter || 'all';
    let displayRewards = [];
    
    switch (currentFilter) {
      case 'regular':
        displayRewards = availableRegularRewards;
        break;
      case 'cosmetics':
        displayRewards = availableCosmeticRewards;
        break;
      default:
        displayRewards = [...availableRegularRewards, ...availableCosmeticRewards];
        break;
    }
    
    const affordableRewards = displayRewards.filter(r => r.cost <= childPoints && r.coin_cost <= childCoins);
    const expensiveRewards = displayRewards.filter(r => r.cost > childPoints || r.coin_cost > childCoins);

    // Helper function to get currency class
    const getCurrencyClass = (reward) => {
      if (reward.cost > 0 && reward.coin_cost > 0) return 'dual-currency';
      if (reward.coin_cost > 0) return 'coins-only';
      return 'points-only';
    };

    return `
      <!-- Filtres des récompenses -->
      <div class="filters">
        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" 
                data-action="filter-rewards" data-filter="all">
          Toutes (${displayRewards.length})
        </button>
        <button class="filter-btn ${currentFilter === 'regular' ? 'active' : ''}" 
                data-action="filter-rewards" data-filter="regular">
          Récompenses (${availableRegularRewards.length})
        </button>
        <button class="filter-btn ${currentFilter === 'cosmetics' ? 'active' : ''}" 
                data-action="filter-rewards" data-filter="cosmetics">
          Cosmétiques (${availableCosmeticRewards.length})
        </button>
      </div>
      
      <div class="rewards-grid">
        ${affordableRewards.map(reward => `
          <div class="reward-square affordable ${getCurrencyClass(reward)} ${reward.cosmetic_data || reward.category === 'cosmetic' ? 'cosmetic' : 'regular'}" 
               data-action="show_reward_detail" 
               data-id="${reward.id}">
            <div class="reward-icon-large">
              ${reward.cosmetic_data || isCosmetic(reward) ? this.renderCosmeticPreview(reward.cosmetic_data, reward.name) : this.safeGetCategoryIcon(reward, '🎁')}
            </div>
            <div class="reward-name">${reward.name}</div>
            <div class="reward-price">
              ${reward.cost > 0 ? `${reward.cost}🎫` : ''}${reward.coin_cost > 0 ? `${reward.cost > 0 ? ' + ' : ''}${reward.coin_cost}🪙` : ''}
              ${reward.cost === 0 && reward.coin_cost === 0 ? 'Gratuit' : ''}
            </div>
            ${reward.min_level && reward.min_level > 1 ? `<div class="reward-level">Niveau ${reward.min_level}+</div>` : ''}
          </div>
        `).join('')}
        ${expensiveRewards.map(reward => `
          <div class="reward-square ${getCurrencyClass(reward)} ${reward.cosmetic_data || reward.category === 'cosmetic' ? 'cosmetic' : 'regular'}" 
               data-action="show_reward_detail" 
               data-id="${reward.id}">
            <div class="reward-icon-large" style="opacity: 0.5">
              ${reward.cosmetic_data || isCosmetic(reward) ? this.renderCosmeticPreview(reward.cosmetic_data, reward.name) : this.safeGetCategoryIcon(reward, '🎁')}
            </div>
            <div class="reward-name" style="opacity: 0.5">${reward.name}</div>
            <div class="reward-price" style="opacity: 0.5">
              ${reward.cost > 0 ? `${reward.cost}🎫` : ''}${reward.coin_cost > 0 ? `${reward.cost > 0 ? ' + ' : ''}${reward.coin_cost}🪙` : ''}
              ${reward.cost === 0 && reward.coin_cost === 0 ? 'Gratuit' : ''}
            </div>
            ${reward.min_level && reward.min_level > 1 ? `<div class="reward-level" style="opacity: 0.5">Niveau ${reward.min_level}+</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  getCosmeticImagePath(cosmeticType, fileName) {
    // Construire le chemin vers l'image cosmétique
    if (!fileName || !cosmeticType) return null;
    
    // URL de base pour les cosmétiques dans Home Assistant
    const baseUrl = '/local/community/kids_tasks/cosmetics';
    return `${baseUrl}/${cosmeticType}/${fileName}`;
  }

  generateCosmeticDataFromName(rewardName) {
    // Générer des données cosmétiques basées sur le nom de la récompense
    if (!rewardName) return null;
    
    const name = rewardName.toLowerCase();
    
    // Avatars
    if (name.includes('avatar')) {
      return {
        type: 'avatar',
        catalog_data: { 
          pixel_art: 'default_child.png'
        }
      };
    }
    
    // Thèmes
    if (name.includes('thème') || name.includes('theme')) {
      let colors = { '--primary-color': '#667eea', '--secondary-color': '#764ba2' };
      
      if (name.includes('sombre') || name.includes('dark')) {
        colors = { '--primary-color': '#4a5568', '--secondary-color': '#2d3748' };
      } else if (name.includes('arc-en-ciel') || name.includes('rainbow')) {
        colors = { '--primary-color': '#ff6b6b', '--secondary-color': '#4ecdc4' };
      } else if (name.includes('spatial') || name.includes('space')) {
        colors = { '--primary-color': '#1e3a8a', '--secondary-color': '#312e81' };
      }
      
      return {
        type: 'theme',
        catalog_data: { css_variables: colors }
      };
    }
    
    // Arrière-plans
    if (name.includes('background') || name.includes('coucher') || name.includes('océan')) {
      let gradient = 'var(--kt-gradient-neutral)';
      
      if (name.includes('coucher') || name.includes('sunset')) {
        gradient = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
      } else if (name.includes('océan') || name.includes('ocean')) {
        gradient = 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)';
      }
      
      return {
        type: 'background',
        catalog_data: { css_gradient: gradient }
      };
    }
    
    return null;
  }

  renderCosmeticPreview(cosmeticData, rewardName = null) {
    // Si pas de cosmetic_data, essayer de la générer depuis le nom
    if (!cosmeticData && rewardName) {
      cosmeticData = this.generateCosmeticDataFromName(rewardName);
    }
    
    if (!cosmeticData) {
      return '🎨';
    }
    
    const catalogData = cosmeticData.catalog_data || {};
    
    // Normaliser le type (enlever le 's' final si présent pour 'backgrounds' -> 'background')
    const cosmeticType = cosmeticData.type ? cosmeticData.type.replace(/s$/, '') : '';
    
    switch (cosmeticType) {
      case 'avatar':
        if (catalogData.pixel_art && typeof catalogData.pixel_art === 'string' && catalogData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('avatars', catalogData.pixel_art);
          return `<img class="cosmetic-pixel-art-preview" src="${imageUrl}" alt="Avatar" style="width: 54px; height: 54px; image-rendering: pixelated;" />`;
        }
        if (catalogData.emoji) {
          return `<div class="cosmetic-avatar-preview">${catalogData.emoji}</div>`;
        }
        return '👤';
        
      case 'background':
        if (catalogData.css_gradient) {
          return `<div class="background-preview" style="background: ${catalogData.css_gradient};"></div>`;
        }
        return '🖼️';
        
      case 'outfit':
        if (catalogData.pixel_art && typeof catalogData.pixel_art === 'string' && catalogData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('outfits', catalogData.pixel_art);
          return `<div style="position: relative; width: 54px; height: 54px;">
            <div class="avatar-placeholder" style="background: var(--kt-avatar-background);">👤</div>
            <img src="${imageUrl}" alt="Outfit" style="position: absolute; top: 0; left: 0; width: 54px; height: 54px; image-rendering: pixelated;" />
          </div>`;
        }
        if (catalogData.emoji_overlay) {
          return `<div class="cosmetic-outfit-preview">
            <span class="base-avatar">👤</span>
            <span class="outfit-overlay">${catalogData.emoji_overlay}</span>
          </div>`;
        }
        return '👕';
        
      case 'theme':
        const themeCssVars = catalogData.css_variables || {};
        const themePrimaryColor = themeCssVars['--primary-color'] || '#667eea';
        const themeSecondaryColor = themeCssVars['--secondary-color'] || '#764ba2';
        return `<div class="cosmetic-theme-preview" style="width: 54px; height: 54px; border-radius: var(--kt-radius-sm); background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themeSecondaryColor} 100%); border: 1px solid var(--kt-cosmetic-border);"></div>`;
        
      default:
        return '🎨';
    }
  }

  renderCosmeticPreviewLarge(cosmeticData, rewardName = null) {
    // Version large pour les modals
    if (!cosmeticData && rewardName) {
      cosmeticData = this.generateCosmeticDataFromName(rewardName);
    }
    
    if (!cosmeticData) {
      return '🎨';
    }
    
    const catalogData = cosmeticData.catalog_data || {};
    const cosmeticType = cosmeticData.type ? cosmeticData.type.replace(/s$/, '') : '';
    
    switch (cosmeticType) {
      case 'avatar':
        if (catalogData.pixel_art && typeof catalogData.pixel_art === 'string' && catalogData.pixel_art.endsWith('.png')) {
          const imageUrl = this.getCosmeticImagePath('avatars', catalogData.pixel_art);
          return `<div style="display: flex; justify-content: center; width: 100px; height: 100px; border-radius: var(--kt-radius-lg); border: 2px solid rgba(0,0,0,0.1); background: #f9f9f9; align-items: center;"><img src="${imageUrl}" alt="Avatar" style="width: 96px; height: 96px; image-rendering: pixelated;" /></div>`;
        }
        if (catalogData.emoji) {
          return `<div class="cosmetic-avatar-preview-large">${catalogData.emoji}</div>`;
        }
        return '👤';
        
      case 'background':
        if (catalogData.css_gradient) {
          return `<div class="background-preview large" style="background: ${catalogData.css_gradient};"></div>`;
        }
        return '🖼️';
        
      case 'outfit':
        if (catalogData.emoji_overlay) {
          return `<div class="cosmetic-outfit-preview-large">
            <span class="base-avatar" style="font-size: 3em;">👤</span>
            <span class="outfit-overlay" style="font-size: 2em; position: absolute;">${catalogData.emoji_overlay}</span>
          </div>`;
        }
        return '👕';
        
      case 'theme':
        const themeCssVars = catalogData.css_variables || {};
        const themePrimaryColor = themeCssVars['--primary-color'] || '#667eea';
        const themeSecondaryColor = themeCssVars['--secondary-color'] || '#764ba2';
        return `<div class="cosmetic-theme-preview-large" style="width: 100px; height: 100px; border-radius: var(--kt-radius-lg); background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themeSecondaryColor} 100%); border: 2px solid rgba(0,0,0,0.1);"></div>`;
        
      default:
        return '🎨';
    }
  }

  // Méthodes pour le modal des récompenses
  showRewardDetail(rewardId) {
    const rewards = this.getRewards();
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const child = this.getChild();
    const canAfford = reward.cost <= child.points && reward.coin_cost <= (child.coins || 0);

    const modal = document.createElement('div');
    modal.className = 'reward-modal';
    
    // Copier les styles CSS nécessaires depuis le shadow DOM
    const style = document.createElement('style');
    style.textContent = `
      .reward-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
        font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
      }
      .reward-modal-content {
        background: var(--card-background-color, #fff);
        border-radius: var(--kt-radius-lg);
        padding: var(--kt-space-xl);
        max-width: 400px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }
      .reward-modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: #757575;
        width: 32px;
        height: 32px;
        border-radius: var(--kt-radius-round);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .reward-modal-close:hover {
        background: #f5f5f5;
        color: #212121;
      }
      .reward-modal-icon {
        font-size: 4em;
        text-align: center;
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
        text-align: center;
        margin-bottom: 8px;
        color: var(--primary-text-color, #212121);
      }
      .reward-modal-price {
        font-size: 1.2em;
        color: ${this.computedStyle?.getPropertyValue('--custom-dashboard-primary')?.trim() || '#6b73ff'};
        font-weight: bold;
        text-align: center;
        margin-bottom: 16px;
      }
      .reward-modal-description {
        color: var(--primary-text-color, #212121);
        line-height: 1.5;
        margin-bottom: 24px;
        text-align: center;
        font-weight: 500;
      }
      .reward-modal-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .btn-modal-purchase {
        background: #4CAF50;
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
        background: #f5f5f5;
        color: #212121;
      }
      .btn-modal-cancel:hover {
        background: #e0e0e0;
      }
    `;
    
    modal.innerHTML = `
      <div class="reward-modal-content">
        <button class="reward-modal-close" data-action="close_modal">×</button>
        <div class="reward-modal-icon">${reward.cosmetic_data || reward.category === 'cosmetic' ? this.renderCosmeticPreviewLarge(reward.cosmetic_data, reward.name) : this.safeGetCategoryIcon(reward, '🎁')}</div>
        <div class="reward-modal-name">${reward.name}</div>
        <div class="reward-modal-price">${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} 🪙` : ''}</div>
        ${reward.description ? `<div class="reward-modal-description">${reward.description}</div>` : ''}
        <div class="reward-modal-actions">
          <button class="btn-modal btn-modal-cancel" data-action="close_modal">Annuler</button>
          <button class="btn-modal btn-modal-purchase" 
                  data-action="claim_reward" 
                  data-id="${reward.id}"
                  ${!canAfford ? 'disabled' : ''}>
            ${canAfford ? `Acheter (${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} 🪙` : ''})` : 'Pas assez de monnaie'}
          </button>
        </div>
      </div>
    `;
    
    // Ajouter les styles au modal
    modal.appendChild(style);

    // Ajouter des gestionnaires d'événements au modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    modal.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action === 'close_modal') {
        this.closeModal();
      } else if (action === 'claim_reward') {
        this.closeModal();
        this.handleAction(action, e.target.dataset.id);
      }
    });

    document.body.appendChild(modal);
    this.currentModal = modal;
  }

  closeModal() {
    if (this.currentModal) {
      document.body.removeChild(this.currentModal);
      this.currentModal = null;
    }
  }
}

// Enregistrer le composant enfant
customElements.define('kids-tasks-child-card', KidsTasksChildCard);

// Éditeur de configuration pour la carte enfant
class KidsTasksChildCardEditor extends KidsTasksBaseCardEditor {
  constructor() {
    super();
  }

  setConfig(config) {
    super.setConfig(config);
    if (this._rendered) {
      this._updateValues();
    }
  }

  get _child_id() {
    return this._config.child_id || '';
  }

  get _title() {
    return this._config.title || 'Mes Tâches';
  }

  get _show_avatar() {
    return this._config.show_avatar !== false;
  }

  get _show_progress() {
    return this._config.show_progress !== false;
  }

  get _show_rewards() {
    return this._config.show_rewards !== false;
  }

  get _gradient_start() {
    return this._config.gradient_start || '#4CAF50';
  }

  get _gradient_end() {
    return this._config.gradient_end || '#8BC34A';
  }

  get _text_color() {
    return this._config.text_color || '#ffffff';
  }

  get _border_color() {
    return this._config.border_color || '#2E7D32';
  }

  getChildren() {
    if (!this._hass) return [];
    
    const children = [];
    const entities = this._hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && pointsEntity.attributes.type === 'child') {
          children.push({
            id: pointsEntity.attributes.child_id || entityId.replace('sensor.', '').replace('_points', ''),
            name: pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || entityId.replace('sensor.', '').replace('_points', ''),
          });
        }
      }
    });
    
    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  render() {
    const children = this.getChildren();
    
    this.innerHTML = `
      <div class="card-config">
        <div class="config-row">
          <div class="config-item">
            <label>Enfant (requis)</label>
            <select id="child_select" required>
              <option value="">Sélectionner un enfant...</option>
              ${children.map(child => `
                <option value="${child.id}" ${this._child_id === child.id ? 'selected' : ''}>
                  ${child.name}
                </option>
              `).join('')}
            </select>
            <small>Liste des enfants créés dans l'intégration</small>
          </div>
        </div>
        
        <div class="config-row">
          <div class="config-item">
            <label>Titre de la carte</label>
            <input 
              id="title" 
              type="text" 
              value="${this._title}"
              placeholder="Mes Tâches"
            >
          </div>
        </div>
        
        <div class="config-row">
          <div class="config-item">
            <div class="switch-row">
              <ha-switch id="show_avatar" ${this._show_avatar ? 'checked' : ''}></ha-switch>
              <label for="show_avatar">Afficher l'avatar</label>
            </div>
          </div>
          <div class="config-item">
            <div class="switch-row">
              <ha-switch id="show_progress" ${this._show_progress ? 'checked' : ''}></ha-switch>
              <label for="show_progress">Afficher la progression</label>
            </div>
          </div>
          <div class="config-item">
            <div class="switch-row">
              <ha-switch id="show_rewards" ${this._show_rewards ? 'checked' : ''}></ha-switch>
              <label for="show_rewards">Afficher les récompenses</label>
            </div>
          </div>
        </div>

        <!-- Section Personnalisation visuelle -->
        <div class="config-section">
          <h3>🎨 Personnalisation Visuelle</h3>
          
          <div class="config-row">
            <div class="config-item">
              <label>Couleur début dégradé</label>
              <input 
                id="gradient_start" 
                type="color" 
                value="${this._config.gradient_start || '#4CAF50'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <small>Couleur de début du dégradé d'arrière-plan</small>
            </div>
            <div class="config-item">
              <label>Couleur fin dégradé</label>
              <input 
                id="gradient_end" 
                type="color" 
                value="${this._config.gradient_end || '#8BC34A'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <small>Couleur de fin du dégradé d'arrière-plan</small>
            </div>
          </div>

          <div class="config-row">
            <div class="config-item">
              <label>Couleur texte principal</label>
              <input 
                id="text_color" 
                type="color" 
                value="${this._config.text_color || '#ffffff'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <small>Couleur du texte dans l'entête</small>
            </div>
            <div class="config-item">
              <label>Couleur bordure</label>
              <input 
                id="border_color" 
                type="color" 
                value="${this._config.border_color || '#2E7D32'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <small>Couleur de la bordure de la carte</small>
            </div>
          </div>

          <!-- Aperçu -->
          <div class="preview-header" id="preview-header">
            <span class="preview-avatar">👶</span>
            <div class="preview-name">Aperçu</div>
            <div class="preview-level">Niveau 5</div>
          </div>
        </div>
      </div>
      
      <style>
        .card-config {
          padding: var(--kt-space-lg);
        }
        .config-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .config-item {
          flex: 1;
        }
        .config-item label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: var(--primary-text-color, #000);
        }
        .config-item input[type="text"], .config-item select {
          width: 100%;
          padding: var(--kt-space-sm);
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color, #000);
        }
        .switch-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .switch-row label {
          cursor: pointer;
          margin-bottom: 0;
        }
        ha-switch {
          --switch-checked-color: var(--primary-color);
        }
        .config-item small {
          display: block;
          color: var(--secondary-text-color, #666);
          font-size: 12px;
          margin-top: 4px;
        }
        .config-section {
          margin-top: 24px;
          padding: var(--kt-space-lg);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-sm);
          background: var(--card-background-color, #fff);
        }
        .config-section h3 {
          margin: 0 0 16px 0;
          color: var(--primary-text-color, #000);
          font-size: 16px;
          font-weight: 600;
          border-bottom: 2px solid var(--primary-color, #1976d2);
          padding-bottom: 4px;
        }
        .preview-header {
          margin-top: 16px;
          padding: var(--kt-space-lg);
          border-radius: var(--kt-radius-md);
          background: var(--kt-gradient-success);
          color: white;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid #2E7D32;
        }
        .preview-avatar { 
          font-size: 2em;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: var(--kt-radius-round);
        }
        .preview-name {
          font-size: 1.2em;
          font-weight: 600;
          flex: 1;
        }
        .preview-level {
          background: rgba(255, 255, 255, 0.2);
          padding: var(--kt-space-xs) 12px;
          border-radius: var(--kt-radius-xl);
          font-size: 0.9em;
          font-weight: 500;
        }
        
        /* Styles pour l'interface cosmétiques */
        .cosmetics-children-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--divider-color, #e0e0e0);
          padding-bottom: 16px;
        }
        
        .cosmetics-child-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: var(--kt-space-md) 16px;
          background: var(--card-background-color, white);
          border: 2px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-md);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
        }
        
        .cosmetics-child-tab:hover {
          background: var(--primary-color, #3f51b5);
          color: white;
          transform: translateY(-2px);
        }
        
        .cosmetics-child-tab.active {
          background: var(--primary-color, #3f51b5);
          color: white;
          border-color: var(--primary-color, #3f51b5);
        }
        
        .cosmetics-child-tab .child-avatar {
          font-size: 1.5em;
        }
        
        .cosmetics-child-tab .child-name {
          font-weight: 500;
        }
        
        .cosmetics-child-tab .child-currency {
          display: flex;
          gap: 4px;
          font-size: 0.85em;
          opacity: 0.8;
        }
        
        .cosmetics-content {
          position: relative;
        }
        
        .cosmetics-child-panel {
          display: none;
        }
        
        .cosmetics-child-panel.active {
          display: block;
        }
        
        .cosmetics-categories {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .cosmetic-category {
          background: var(--card-background-color, white);
          border-radius: var(--kt-radius-lg);
          padding: var(--kt-space-xl);
          border: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .cosmetic-category-header h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 8px 0;
          font-size: 1.3em;
          color: var(--primary-text-color, #212121);
        }
        
        .cosmetic-category-header .category-icon {
          font-size: 1.2em;
        }
        
        .cosmetic-category-header .active-indicator {
          background: var(--success-color, #4caf50);
          color: white;
          padding: var(--kt-space-xs) 12px;
          border-radius: var(--kt-radius-xl);
          font-size: 0.8em;
          font-weight: 500;
          margin-left: auto;
        }
        
        .cosmetic-category {
          margin-bottom: 32px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-xl);
          border: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .category-description {
          margin: 0 0 20px 0;
          color: var(--secondary-text-color, #757575);
          font-size: 0.95em;
          line-height: 1.4;
        }
        
        .cosmetic-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 16px;
        }
        
        .cosmetic-item {
          display: flex;
          flex-direction: column;
          background: var(--card-background-color, white);
          border: 2px solid var(--divider-color, #e0e0e0);
          border-radius: var(--kt-radius-lg);
          padding: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .cosmetic-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .cosmetic-item.owned {
          border-color: var(--success-color, #4caf50);
          background: rgba(76, 175, 80, 0.05);
        }
        
        .cosmetic-item.active {
          border-color: var(--primary-color, #3f51b5);
          background: rgba(63, 81, 181, 0.1);
          box-shadow: 0 4px 16px rgba(63, 81, 181, 0.3);
        }
        
        .cosmetic-item.default-item {
          background: linear-gradient(135deg, #f5f5f5, #eeeeee);
          border-color: #bdbdbd;
        }
        
        .cosmetic-item.empty-category {
          justify-content: center;
          align-items: center;
          min-height: 120px;
          text-align: center;
          color: var(--secondary-text-color, #757575);
        }
        
        .cosmetic-preview {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 80px;
          margin-bottom: 16px;
          border-radius: var(--kt-radius-sm);
          position: relative;
        }

        .cosmetics-simple-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .cosmetic-simple-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: var(--kt-space-lg);
          margin: 8px 0;
          background: var(--secondary-background-color, #f8f9fa);
          border-radius: var(--kt-radius-sm);
          border-left: 4px solid #ddd;
          transition: all 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cosmetic-simple-item.rarity-common {
          border-left-color: #9e9e9e;
        }

        .cosmetic-simple-item.rarity-rare {
          border-left-color: #2196f3;
        }

        .cosmetic-simple-item.rarity-epic {
          border-left-color: #9c27b0;
        }

        .cosmetic-simple-item.rarity-legendary {
          border-left-color: var(--kt-warning);
        }

        .cosmetic-simple-item:hover {
          background: var(--card-background-color, #fff);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          transform: translateY(-1px);
        }

        .cosmetic-simple-preview {
          flex-shrink: 0;
        }

        .cosmetic-simple-info {
          flex-grow: 1;
        }

        .cosmetic-simple-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .cosmetic-simple-rarity {
          font-size: 0.85em;
          color: var(--secondary-text-color, #757575);
          margin-bottom: 4px;
        }

        .cosmetic-simple-cost {
          font-size: 0.9em;
          font-weight: 500;
          color: var(--primary-color, #1976d2);
        }

        .cosmetic-simple-actions {
          display: flex;
          flex-direction: row;
          gap: 12px;
          align-items: center;
          min-width: 220px;
        }

        .cosmetic-give-select {
          padding: var(--kt-space-xs) 8px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 4px;
          background: var(--card-background-color, #fff);
          font-size: 0.9em;
          flex: 1;
          min-width: 120px;
        }
        
        .avatar-preview {
          font-size: 3em;
        }
        
        .pixel-art-preview {
          max-width: 64px;
          max-height: 64px;
          image-rendering: pixelated;
        }
        
        .outfit-preview {
          position: relative;
          font-size: 2.5em;
        }
        
        .outfit-preview .base-avatar {
          display: block;
        }
        
        .outfit-preview .outfit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 0.8em;
          transform: translateX(50%) translateY(-20%);
        }
        
        .theme-preview {
          display: flex;
          gap: 4px;
        }
        
        .generic-preview {
          font-size: 3em;
          opacity: 0.6;
        }
        
        .default-preview {
          font-size: 2.5em;
          opacity: 0.7;
        }
        
        .cosmetic-info {
          flex: 1;
          margin-bottom: 16px;
        }
        
        .cosmetic-name {
          font-weight: 600;
          font-size: 1.1em;
          margin-bottom: 4px;
          color: var(--primary-text-color, #212121);
        }
        
        .cosmetic-rarity {
          display: inline-block;
          font-size: 0.8em;
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .rarity-common {
          background: #e8f5e8;
          color: #2e7d32;
        }
        
        .rarity-rare {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .rarity-epic {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        
        .rarity-legendary {
          background: #fff3e0;
          color: #f57c00;
        }
        
        .cosmetic-description {
          font-size: 0.9em;
          color: var(--secondary-text-color, #757575);
          margin-bottom: 8px;
        }
        
        .cosmetic-status {
          font-size: 0.85em;
          color: var(--success-color, #4caf50);
          font-weight: 500;
        }
        
        .cosmetic-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        
        .cosmetic-cost {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .section-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }
      </style>
    `;

    // Ajouter les event listeners
    this.querySelectorAll('input, select, ha-switch').forEach(input => {
      input.addEventListener('change', this._valueChanged.bind(this));
      input.addEventListener('input', this._valueChanged.bind(this));
    });

    this._rendered = true;
  }

  _updateValues() {
    if (!this._rendered) return;
    
    const childSelect = this.querySelector('#child_select');
    const titleInput = this.querySelector('#title');
    const showAvatarSwitch = this.querySelector('#show_avatar');
    const showProgressSwitch = this.querySelector('#show_progress');
    const showRewardsSwitch = this.querySelector('#show_rewards');
    const gradientStartInput = this.querySelector('#gradient_start');
    const gradientEndInput = this.querySelector('#gradient_end');
    const textColorInput = this.querySelector('#text_color');
    const borderColorInput = this.querySelector('#border_color');
    
    if (childSelect) childSelect.value = this._child_id;
    if (titleInput) titleInput.value = this._title;
    if (showAvatarSwitch) showAvatarSwitch.checked = this._show_avatar;
    if (showProgressSwitch) showProgressSwitch.checked = this._show_progress;
    if (showRewardsSwitch) showRewardsSwitch.checked = this._show_rewards;
    if (gradientStartInput) gradientStartInput.value = this._gradient_start;
    if (gradientEndInput) gradientEndInput.value = this._gradient_end;
    if (textColorInput) textColorInput.value = this._text_color;
    if (borderColorInput) borderColorInput.value = this._border_color;
    
    // Mettre à jour l'aperçu après avoir mis à jour les valeurs
    this.updatePreview();
  }

  _valueChanged() {
    const child_id = this.querySelector('#child_select').value;
    const title = this.querySelector('#title').value;
    const show_avatar = this.querySelector('#show_avatar').checked;
    const show_progress = this.querySelector('#show_progress').checked;
    const show_rewards = this.querySelector('#show_rewards').checked;
    const gradient_start = this.querySelector('#gradient_start')?.value;
    const gradient_end = this.querySelector('#gradient_end')?.value;
    const text_color = this.querySelector('#text_color')?.value;
    const border_color = this.querySelector('#border_color')?.value;

    this._config = {
      type: 'custom:kids-tasks-child-card',
      child_id,
      title,
      show_avatar,
      show_progress,
      show_rewards,
      gradient_start,
      gradient_end,
      text_color,
      border_color,
    };

    // Mettre à jour l'aperçu en temps réel
    this.updatePreview();

    // Fire config-changed event using base class method
    this.fireConfigChanged(this._config);
  }

  updatePreview() {
    const previewHeader = this.querySelector('#preview-header');
    if (previewHeader && this._config) {
      const gradientStart = this._config.gradient_start || '#4CAF50';
      const gradientEnd = this._config.gradient_end || '#8BC34A';
      const textColor = this._config.text_color || '#ffffff';
      const borderColor = this._config.border_color || '#2E7D32';
      
      previewHeader.style.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
      previewHeader.style.color = textColor;
      previewHeader.style.border = `2px solid ${borderColor}`;
    }
  }
}

// Enregistrer l'éditeur
customElements.define('kids-tasks-child-card-editor', KidsTasksChildCardEditor);

// Ajouter à la liste des cartes personnalisées
window.customCards.push({
  type: 'kids-tasks-child-card',
  name: 'Kids Tasks Child Card',
  description: 'Carte individuelle pour chaque enfant avec ses tâches et progrès',
  preview: true,
  documentationURL: 'https://github.com/astrayel/kids-tasks-card',
});

// === EXPOSITION GLOBALE POUR DEBUG ===
// Exposer le gestionnaire de styles pour les tests et le debug
window.KidsTasksStyleManager = KidsTasksStyleManager;

// API de debug globale
window.KidsTasksDebug = {
  injectStyles: () => KidsTasksStyleManager.injectGlobalStyles(),
  removeStyles: () => KidsTasksStyleManager.removeGlobalStyles(),
  getStylesInfo: () => {
    const styles = document.querySelector('#kids-tasks-global-styles');
    return {
      injected: !!styles,
      version: styles?.getAttribute('data-version'),
      size: styles?.textContent?.length || 0
    };
  }
};