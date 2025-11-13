// Kids Tasks Card Editors - Configuration UI components

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
    // To be overridden by subclasses
    return '';
  }

  _attachListeners() {
    this._attachSpecificListeners();
  }

  _attachSpecificListeners() {
    // To be overridden by subclasses
  }

  _syncInputValues() {
    // Call specific sync method for subclasses
    this._syncSpecificInputValues();
  }

  _syncSpecificInputValues() {
    // To be overridden by subclasses
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

    // Sync all color inputs with current config values
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

// ES6 exports
export {
  KidsTasksBaseCardEditor,
  KidsTasksCardEditor,
  KidsTasksManagerEditor,
  KidsTasksChildCardEditor
};