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

// ES6 exports
export {
  KidsTasksBaseCardEditor,
  KidsTasksCardEditor,
  KidsTasksChildCardEditor
};