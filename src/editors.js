// Kids Tasks Card Editors - Configuration UI components

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

        .color-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
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

        }
      </style>
    `;

    this._attachListeners();
  }

  _renderSpecificOptions() {
    // To be overridden by subclasses
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
    // To be overridden by subclasses
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
      <div class="section-title">Couleurs Carte Principale</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Couleur des onglets</label>
          <input
            type="color"
            class="tab-color-input"
            value="${this._config.tab_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur d'entête</label>
          <input
            type="color"
            class="header-color-input"
            value="${this._config.header_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur primaire dashboard</label>
          <input
            type="color"
            class="dashboard-primary-input"
            value="${this._config.dashboard_primary_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur secondaire dashboard</label>
          <input
            type="color"
            class="dashboard-secondary-input"
            value="${this._config.dashboard_secondary_color || '#ff4081'}"
          >
        </div>
      </div>

      <div class="section-title">Couleurs Cartes Enfants</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Début dégradé cartes enfants</label>
          <input
            type="color"
            class="child-gradient-start-input"
            value="${this._config.child_gradient_start || '#4CAF50'}"
          >
        </div>
        <div class="color-option">
          <label>Fin dégradé cartes enfants</label>
          <input
            type="color"
            class="child-gradient-end-input"
            value="${this._config.child_gradient_end || '#8BC34A'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur bordure cartes enfants</label>
          <input
            type="color"
            class="child-border-color-input"
            value="${this._config.child_border_color || '#2E7D32'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur texte cartes enfants</label>
          <input
            type="color"
            class="child-text-color-input"
            value="${this._config.child_text_color || '#ffffff'}"
          >
        </div>
      </div>

      <div class="section-title">Couleurs Interface</div>
      <div class="color-grid">
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
        <div class="color-option">
          <label>Couleur des icônes</label>
          <input
            type="color"
            class="icon-color-input"
            value="${this._config.icon_color || '#757575'}"
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
    const tabColorInput = this.querySelector('.tab-color-input');
    const headerColorInput = this.querySelector('.header-color-input');
    const dashboardPrimaryInput = this.querySelector('.dashboard-primary-input');
    const dashboardSecondaryInput = this.querySelector('.dashboard-secondary-input');
    const childGradientStartInput = this.querySelector('.child-gradient-start-input');
    const childGradientEndInput = this.querySelector('.child-gradient-end-input');
    const childBorderColorInput = this.querySelector('.child-border-color-input');
    const childTextColorInput = this.querySelector('.child-text-color-input');
    const buttonHoverInput = this.querySelector('.button-hover-input');
    const progressBarInput = this.querySelector('.progress-bar-input');
    const pointsBadgeInput = this.querySelector('.points-badge-input');
    const iconColorInput = this.querySelector('.icon-color-input');

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

    if (childBorderColorInput) {
      childBorderColorInput.addEventListener('change', (e) => {
        this._config.child_border_color = e.target.value;
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
}

class KidsTasksManagerEditor extends KidsTasksBaseCardEditor {
  _renderSpecificOptions() {
    return `
      <div class="section-title">Personnalisation des couleurs</div>
      <div class="color-grid">
        <div class="color-option">
          <label>Couleur des onglets</label>
          <input
            type="color"
            class="tab-color-input"
            value="${this._config.tab_color || '#3f51b5'}"
          >
        </div>
        <div class="color-option">
          <label>Couleur de l'en-tête</label>
          <input
            type="color"
            class="header-color-input"
            value="${this._config.header_color || '#3f51b5'}"
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
    const tabColorInput = this.querySelector('.tab-color-input');
    const headerColorInput = this.querySelector('.header-color-input');
    const dashboardPrimaryInput = this.querySelector('.dashboard-primary-input');
    const buttonHoverInput = this.querySelector('.button-hover-input');
    const progressBarInput = this.querySelector('.progress-bar-input');
    const pointsBadgeInput = this.querySelector('.points-badge-input');

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

// ES6 exports
export {
  KidsTasksBaseCardEditor,
  KidsTasksCardEditor,
  KidsTasksManagerEditor,
  KidsTasksChildCardEditor
};