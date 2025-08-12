// Interface graphique complète pour Kids Tasks Manager
// Version fonctionnelle avec formulaires modaux et services Home Assistant

class KidsTasksCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentView = 'dashboard';
    this._initialized = false;
  }

  setConfig(config) {
    this.config = config || {};
    this.title = config.title || 'Gestionnaire de Tâches Enfants';
    this.showNavigation = config.show_navigation !== false;
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
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kids_tasks_task_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kids_tasks_task_'));
    
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
    
    return false;
  }

  getChildrenFromHass(hass) {
    const children = [];
    const entities = hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.endsWith('_points') || entityId.startsWith('sensor.KT_')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && 
            (pointsEntity.attributes.type === 'child' || entityId.startsWith('sensor.KT_'))) {
          children.push({
            id: pointsEntity.attributes.child_id || entityId.replace('sensor.', '').replace('_points', ''),
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
    const target = event.target.closest('[data-action]');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const action = target.dataset.action;
    const id = target.dataset.id;

    this.handleAction(action, id);
  }

  handleAction(action, id = null) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        // Petit délai pour éviter les blocages lors du changement de vue
        setTimeout(() => this.render(), 10);
        break;
      case 'add-child':
        this.showChildForm();
        break;
      case 'edit-child':
        this.showChildForm(id);
        break;
      case 'add-task':
        this.showTaskForm();
        break;
      case 'edit-task':
        this.showTaskForm(id);
        break;
      case 'complete-task':
        this.callService('kids_tasks', 'complete_task', { task_id: id });
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
                              `• L'enfant et tous ses points\n` +
                              `• Toutes ses tâches assignées\n` +
                              `• Tout l'historique de ses activités\n` +
                              `• Tous les capteurs associés\n\n` +
                              `Cette action est IRRÉVERSIBLE !`;
        
        if (confirm(confirmMessage)) {
          this.callService('kids_tasks', 'remove_child', { 
            child_id: id,
            force_delete: true 
          });
        }
        break;
      case 'remove-task':
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
          this.callService('kids_tasks', 'remove_task', { task_id: id });
        }
        break;
      case 'remove-reward':
        if (confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) {
          this.callService('kids_tasks', 'remove_reward', { reward_id: id });
        }
        break;
    }
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
    } else if (avatar_type === 'inline') {
      avatar_data = form.querySelector('[name="avatar_inline"]').value;
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
        serviceData.child_id = form.querySelector('[name="child_id"]').value;
        console.log('Calling update_child with:', serviceData);
        const success = await this.callService('kids_tasks', 'update_child', serviceData);
        console.log('update_child result:', success);
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
    const categorySelect = form.querySelector('[name="category"]');
    const category = categorySelect.value || categorySelect.getAttribute('value') || 'other';
    const points = parseInt(form.querySelector('[name="points"]').value);
    const frequencySelect = form.querySelector('[name="frequency"]');
    const frequency = frequencySelect.value || frequencySelect.getAttribute('value') || 'daily';
    const assigned_child_id = form.querySelector('[name="assigned_child_id"]').value || null;
    const validation_required = form.querySelector('[name="validation_required"]').checked;
    
    // Récupérer les jours sélectionnés pour les tâches journalières
    const weeklyDaysCheckboxes = form.querySelectorAll('[name="weekly_days"]:checked');
    const weekly_days = Array.from(weeklyDaysCheckboxes).map(cb => cb.value);
    
    const serviceData = {
      name,
      description,
      category,
      points,
      frequency,
      assigned_child_id,
      validation_required
    };
    
    // Ajouter weekly_days seulement si des jours sont sélectionnés
    if (weekly_days.length > 0) {
      serviceData.weekly_days = weekly_days;
    }

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
    const cost = parseInt(form.querySelector('[name="cost"]').value);
    const categorySelect = form.querySelector('[name="category"]');
    const category = categorySelect.value || categorySelect.getAttribute('value') || 'fun';
    const limitedQuantityInput = form.querySelector('[name="limited_quantity"]');
    const limited_quantity = limitedQuantityInput.value ? parseInt(limitedQuantityInput.value) : null;
    
    const serviceData = {
      name,
      description,
      cost,
      category,
      limited_quantity
    };

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
    // Utiliser ha-dialog pour les modales
    const dialog = document.createElement('ha-dialog');
    dialog.heading = title;
    dialog.hideActions = true;
    
    // Créer le contenu avec les styles et référence à l'instance
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = `
      <style>
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        /* Corriger la hauteur des ha-select pour éviter l'overflow */
        ha-select {
          --mdc-menu-max-height: 200px;
          --mdc-menu-min-width: 100%;
        }
        
        ha-select mwc-menu {
          --mdc-menu-max-height: 200px;
          --mdc-menu-item-height: 48px;
        }
        
        /* Améliorer l'affichage des modals */
        ha-dialog {
          max-height: 90vh;
          overflow-y: auto;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font-size: 14px;
          font-family: inherit;
          box-sizing: border-box;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
        }
        
        /* Styles pour les composants HA */
        ha-textfield, ha-textarea, ha-select, ha-formfield {
          display: block;
          margin-bottom: 16px;
          width: 100%;
        }
        
        /* Correction déjà appliquée plus haut */
        
        /* Uniformiser les tailles de police */
        ha-textfield, ha-textarea, ha-select {
          --mdc-typography-subtitle1-font-size: 16px;
        }
        
        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .form-row > * {
          flex: 1;
          margin-bottom: 0;
        }
        
        /* Styles pour la sélection des jours de la semaine */
        .weekly-days-section {
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background: var(--secondary-background-color, #fafafa);
        }
        
        .days-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }
        
        .days-selector ha-formfield {
          margin-bottom: 0;
          flex: 0 0 auto;
          min-width: 60px;
          text-align: center;
        }
        
        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color);
        }
        
        /* Responsive design pour les formulaires */
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .form-row > * {
            margin-bottom: 16px;
          }
          
          .dialog-actions {
            flex-direction: column-reverse;
          }
        }
        .avatar-options { 
          display: flex; 
          gap: 8px; 
          flex-wrap: wrap; 
          margin-bottom: 8px; 
        }
        .avatar-option {
          padding: 8px;
          border: 2px solid var(--divider-color);
          border-radius: 8px;
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
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
        }
        .btn-primary { background: var(--primary-color); color: white; }
        .btn-secondary { 
          background: var(--secondary-background-color); 
          color: var(--primary-text-color);
          border: 1px solid var(--divider-color);
        }
      </style>
      ${content}
    `;
    
    // Stocker la référence à this dans le dialog
    dialog._cardInstance = this;
    
    dialog.appendChild(contentDiv);
    document.body.appendChild(dialog);
    
    // Ouvrir immédiatement et laisser les composants s'initialiser naturellement
    dialog.show();
    
    return dialog;
  }

  closeModal(dialog) {
    if (dialog && dialog.close) {
      dialog.close();
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    }
  }

  showChildForm(childId = null) {
    const children = this.getChildren();
    const child = childId ? children.find(c => c.id === childId) : null;
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
          <ha-list-item value="inline">Image inline (base64)</ha-list-item>
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

          <div id="inline-config" style="display: ${isEdit && child.avatar_type === 'inline' ? 'block' : 'none'};">
            <label class="form-label">Image base64 (sans le préfixe data:image)</label>
            <ha-textarea
              name="avatar_inline"
              value="${isEdit && child.avatar_type === 'inline' ? child.avatar_data || '' : ''}"
              placeholder="iVBORw0KGgoAAAANSUhEUgAA...">
            </ha-textarea>
          </div>
        </div>

        <div class="form-row">
          <ha-input-color-picker
            label="Couleur dégradé début"
            name="card_gradient_start"
            value="${isEdit ? child.card_gradient_start || '#3f51b5' : '#3f51b5'}">
          </ha-input-color-picker>
          
          <ha-input-color-picker
            label="Couleur dégradé fin"
            name="card_gradient_end"
            value="${isEdit ? child.card_gradient_end || '#ff4081' : '#ff4081'}">
          </ha-input-color-picker>
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
        ` : ''}

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

  showTaskForm(taskId = null) {
    const tasks = this.getTasks();
    const children = this.getChildren();
    const task = taskId ? tasks.find(t => t.id === taskId) : null;
    const isEdit = !!task;

    const categories = ['bedroom', 'bathroom', 'kitchen', 'homework', 'outdoor', 'pets', 'other'];
    const frequencies = ['daily', 'weekly', 'monthly', 'once'];

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
          
          <ha-textfield
            label="Points *"
            name="points"
            type="number"
            required
            value="${isEdit ? task.points : '10'}"
            min="1"
            max="100">
          </ha-textfield>
        </div>
        
        <div class="form-row">
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
          
          <ha-select
            label="Enfant assigné"
            name="assigned_child_id"
            value="${isEdit ? task.assigned_child_id || '' : ''}">
            <ha-list-item value="">Non assigné</ha-list-item>
            ${children.map(child => `
              <ha-list-item value="${child.id}" ${isEdit && task.assigned_child_id === child.id ? 'selected' : ''}>
                ${child.name}
              </ha-list-item>
            `).join('')}
          </ha-select>
        </div>
        
        <!-- Sélection des jours de la semaine pour les tâches journalières -->
        <div class="weekly-days-section" style="display: ${(!isEdit && 'daily' === 'daily') || (isEdit && task.frequency === 'daily') ? 'block' : 'none'};">
          <label class="form-label">Jours de la semaine (optionnel - tous les jours si aucun sélectionné)</label>
          <div class="days-selector">
            ${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
              const labels = {
                'mon': 'L', 'tue': 'M', 'wed': 'M', 'thu': 'J', 
                'fri': 'V', 'sat': 'S', 'sun': 'D'
              };
              const isSelected = isEdit && task.weekly_days && task.weekly_days.includes(day);
              return `
                <ha-formfield label="${labels[day]}">
                  <ha-checkbox
                    name="weekly_days"
                    value="${day}"
                    ${isSelected ? 'checked' : ''}>
                  </ha-checkbox>
                </ha-formfield>
              `;
            }).join('')}
          </div>
        </div>
        
        <ha-formfield label="Validation parentale requise">
          <ha-checkbox 
            name="validation_required"
            ${isEdit ? (task.validation_required ? 'checked' : '') : 'checked'}>
          </ha-checkbox>
        </ha-formfield>
        
        ${isEdit ? `
          <ha-formfield label="Tâche active">
            <ha-checkbox 
              name="active"
              ${task.active !== false ? 'checked' : ''}>
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
      
      if (frequencySelect && weeklyDaysSection) {
        // Fonction pour afficher/masquer la section des jours
        const toggleWeeklyDays = (frequency) => {
          weeklyDaysSection.style.display = frequency === 'daily' ? 'block' : 'none';
        };
        
        // Event listeners pour ha-select
        frequencySelect.addEventListener('selected', (e) => {
          const selectedFreq = e.detail.value || e.target.value;
          toggleWeeklyDays(selectedFreq);
        });
        
        frequencySelect.addEventListener('change', (e) => {
          const selectedFreq = e.target.value;
          toggleWeeklyDays(selectedFreq);
        });
      }
    }, 100);
  }

  showRewardForm(rewardId = null) {
    const rewards = this.getRewards();
    const reward = rewardId ? rewards.find(r => r.id === rewardId) : null;
    const isEdit = !!reward;

    const categories = ['fun', 'screen_time', 'outing', 'treat', 'privilege', 'toy', 'other'];

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
        
        <div class="form-row">
          <ha-textfield
            label="Coût en points *"
            name="cost"
            type="number"
            required
            value="${isEdit ? reward.cost : '50'}"
            min="1"
            max="1000">
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
          value="${isEdit && reward.limited_quantity ? reward.limited_quantity : ''}"
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

  showClaimRewardForm(rewardId) {
    const reward = this.getRewardById(rewardId);
    const children = this.getChildren();

    if (!reward) {
      this.showNotification('Récompense non trouvée', 'error');
      return;
    }

    const content = `
      <div class="reward-info" style="text-align: center; margin-bottom: 24px; padding: 16px; background: var(--secondary-background-color); border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: var(--primary-text-color);">🎁 ${reward.name}</h3>
        <p style="margin: 4px 0;"><strong>Coût:</strong> ${reward.cost} points</p>
        <p style="margin: 4px 0;"><strong>Catégorie:</strong> ${this.getCategoryLabel(reward.category)}</p>
        ${reward.description ? `<p style="margin: 8px 0 0 0;">${reward.description}</p>` : ''}
        ${reward.remaining_quantity !== null ? `<p style="margin: 4px 0;"><strong>Stock restant:</strong> ${reward.remaining_quantity}</p>` : ''}
      </div>
      
      <form>
        <input type="hidden" name="reward_id" value="${reward.id}">
        
        <ha-select
          label="Sélectionner l'enfant *"
          name="child_id"
          required>
          <ha-list-item value="">Choisir un enfant...</ha-list-item>
          ${children.map(child => `
            <ha-list-item value="${child.id}" ${child.points < reward.cost ? 'disabled' : ''}>
              ${child.name} (${child.points} points) ${child.points >= reward.cost ? '' : '- Pas assez de points'}
            </ha-list-item>
          `).join('')}
        </ha-select>
        
        <div class="dialog-actions">
          <ha-button
            slot="secondaryAction"
            onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button
            slot="primaryAction"
            raised
            onclick="this.closest('ha-dialog')._cardInstance.submitClaimForm(this.closest('ha-dialog'))">
            Échanger
          </ha-button>
        </div>
      </form>
    `;

    this.showModal(content, 'Échanger une récompense');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
      color: white;
      border-radius: 4px;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // === RÉCUPÉRATION DES DONNÉES ===

  getChildren() {
    const children = [];
    const entities = this._hass.states;
    
    Object.keys(entities).forEach(entityId => {
      // Chercher les entités se terminant par _points avec type: child OU avec préfixe KT_
      if (entityId.endsWith('_points') || entityId.startsWith('sensor.KT_')) {
        const pointsEntity = entities[entityId];
        if (pointsEntity && pointsEntity.attributes && 
            (pointsEntity.attributes.type === 'child' || entityId.startsWith('sensor.KT_'))) {
          const points = parseInt(pointsEntity.state) || 0;
          const level = parseInt(pointsEntity.attributes.level) || 1;
          const progress = ((points % 100) / 100) * 100;
          
          // Extraire l'ID et le nom
          let childId, childName;
          if (entityId.startsWith('sensor.KT_')) {
            childId = pointsEntity.attributes.child_id || entityId.replace('sensor.KT_', '').replace('_points', '');
            childName = pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || childId;
          } else {
            childId = pointsEntity.attributes.child_id || entityId.replace('sensor.', '').replace('_points', '');
            childName = pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || childId;
          }
          
          children.push({
            id: childId,
            name: childName,
            points: points,
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
    
    return children.sort((a, b) => a.name.localeCompare(b.name));
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
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les nouveaux capteurs TaskSensor
    Object.keys(entities).forEach(entityId => { 
      if (entityId.startsWith('sensor.kids_tasks_task_')) {
        const taskEntity = entities[entityId];
        if (taskEntity && taskEntity.attributes) {
          
          const attrs = taskEntity.attributes;
          tasks.push({
            id: attrs.task_id || entityId.replace('sensor.kids_tasks_task_', ''),
            name: attrs.task_name || attrs.friendly_name || 'Tâche',
            description: attrs.description || '',
            category: attrs.category || 'other',
            points: parseInt(attrs.points) || 10,
            frequency: attrs.frequency || 'daily',
            status: taskEntity.state || 'todo',
            assigned_child_id: attrs.assigned_child_id,
            assigned_child_name: attrs.assigned_child_name || 'Non assigné',
            validation_required: attrs.validation_required !== false,
            active: attrs.active !== false,
            created_at: attrs.created_at,
            last_completed_at: attrs.last_completed_at
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
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les nouveaux capteurs RewardSensor
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_reward_')) {
        const rewardEntity = entities[entityId];
        if (rewardEntity && rewardEntity.attributes) {
          const attrs = rewardEntity.attributes;
          
          rewards.push({
            id: attrs.reward_id || entityId.replace('sensor.kids_tasks_reward_', ''),
            name: attrs.reward_name || attrs.friendly_name || 'Récompense',
            cost: parseInt(attrs.cost) || parseInt(rewardEntity.state) || 50,
            category: attrs.category || 'fun',
            description: attrs.description || '',
            active: attrs.active !== false,
            remaining_quantity: attrs.remaining_quantity,
            is_available: attrs.is_available !== false
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

    return {
      totalChildren: children.length,
      totalTasks: tasks.length,
      completedToday: completedToday,
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

  getChildTasksToday(childId, tasks = null) {
    if (!tasks) tasks = this.getTasks();
    return tasks.filter(task => 
      task.assigned_child_id === childId && 
      (task.frequency === 'daily' || 
       (task.last_completed_at && this.isToday(task.last_completed_at)))
    );
  }

  getChildCompletedToday(childId, tasks = null) {
    if (!tasks) tasks = this.getTasks();
    return tasks.filter(task => 
      task.assigned_child_id === childId && 
      task.status === 'validated' &&
      task.last_completed_at && 
      this.isToday(task.last_completed_at)
    );
  }

  // Utilitaires
  isToday(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  getChildName(childId, children = null) {
    if (!children) children = this.getChildren();
    const child = children.find(c => c.id === childId);
    return child ? child.name : 'Non assigné';
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

  getCategoryLabel(category) {
    const labels = {
      'bedroom': '🛏️ Chambre',
      'bathroom': '🛁 Salle de bain',
      'kitchen': '🍽️ Cuisine', 
      'homework': '📚 Devoirs',
      'outdoor': '🌳 Extérieur',
      'pets': '🐕 Animaux',
      'other': '📦 Autre',
      'fun': '🎉 Amusement',
      'screen_time': '📱 Écran',
      'outing': '🚗 Sortie',
      'privilege': '👑 Privilège',
      'toy': '🧸 Jouet',
      'treat': '🍭 Friandise'
    };
    return labels[category] || category;
  }

  getFrequencyLabel(frequency) {
    const labels = {
      'daily': 'Quotidienne',
      'weekly': 'Hebdomadaire',
      'monthly': 'Mensuelle', 
      'once': 'Une fois'
    };
    return labels[frequency] || frequency;
  }

  // Navigation et vues (réutilisation du code existant avec ajout des boutons de suppression)
  getNavigation() {
    const tabs = [
      { id: 'dashboard', label: '📊 Aperçu', icon: '📊' },
      { id: 'children', label: '👶 Enfants', icon: '👶' },
      { id: 'tasks', label: '📝 Tâches', icon: '📝' },
      { id: 'rewards', label: '🎁 Récompenses', icon: '🎁' }
    ];

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
    switch (this.currentView) {
      case 'dashboard': return this.getDashboardView();
      case 'children': return this.getChildrenView();
      case 'tasks': return this.getTasksView();
      case 'rewards': return this.getRewardsView();
      default: return this.getDashboardView();
    }
  }

  getDashboardView() {
    const children = this.getChildren();
    const tasks = this.getTasks();
    const stats = this.getStats();
    const pendingTasks = tasks.filter(t => t.status === 'pending_validation');

    return `
      <div class="section">
        <h2>${this.title}</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👶</div>
            <div class="stat-info">
              <div class="stat-number">${stats.totalChildren}</div>
              <div class="stat-label">Enfant${stats.totalChildren > 1 ? 's' : ''}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <div class="stat-number">${stats.totalTasks}</div>
              <div class="stat-label">Tâches créées</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-number">${stats.completedToday}</div>
              <div class="stat-label">Terminées aujourd'hui</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-info">
              <div class="stat-number">${stats.pendingValidation}</div>
              <div class="stat-label">À valider</div>
            </div>
          </div>
        </div>
      </div>

      ${children.length > 0 ? `
        <div class="section">
          <h2>Enfants</h2>
          ${children.map((child, index) => {
            try {
              console.log(`Rendu enfant ${index}:`, child);
              const result = this.renderChildCard(child);
              console.log(`Rendu enfant ${index} réussi`);
              return result;
            } catch (error) {
              console.error(`Erreur lors du rendu de l'enfant ${index}:`, error, child);
              return `<div class="child-card"><div class="error">Erreur enfant ${index}: ${error.message}</div></div>`;
            }
          }).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">👶</div>
          <p>Aucun enfant enregistré</p>
          <button class="btn btn-primary" data-action="add-child">Ajouter un enfant</button>
        </div>
      `}

      ${pendingTasks.length > 0 ? `
        <div class="section">
          <h2>Tâches à valider (${pendingTasks.length})</h2>
          ${pendingTasks.map(task => this.renderTaskItem(task, children, true)).join('')}
        </div>
      ` : ''}
    `;
  }

  getChildrenView() {
    const children = this.getChildren();
    return `
      <div class="section">
        <h2>
          Gestion des enfants
          <button class="btn btn-primary add-btn" data-action="add-child">Ajouter</button>
        </h2>
        ${children.length > 0 ? `
          <div class="grid grid-2">
            ${children.map((child, index) => {
              try {
                console.log(`Rendu enfant gestion ${index}:`, child);
                const result = this.renderChildCard(child, true);
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
    const tasks = this.getTasks();
    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <button class="btn btn-primary add-btn" data-action="add-task">Ajouter</button>
        </h2>
        ${tasks.length > 0 ? tasks.map(task => this.renderTaskItem(task, children, false, true)).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Aucune tâche créée</p>
            <button class="btn btn-primary" data-action="add-task">Créer votre première tâche</button>
          </div>
        `}
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
          <div class="grid grid-2">
            ${rewards.map(reward => this.renderRewardCard(reward, true)).join('')}
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

  renderChildCard(child, showActions = false) {
    // Protection contre les enfants undefined/null
    if (!child) {
      return '<div class="child-card"><div class="error">Erreur: enfant non trouvé</div></div>';
    }
    
    try {
      const name = child.name || 'Enfant sans nom';
      const points = child.points || 0;
      const level = child.level || 1;
      
      // Calculer les tâches de manière sûre
      let completedToday = 0;
      let todayTasks = 0;
      
      try {
        const tasks = this.getTasks();
        completedToday = this.getChildCompletedToday(child.id, tasks).length;
        todayTasks = this.getChildTasksToday(child.id, tasks).length;
      } catch (taskError) {
        console.warn('Erreur lors du calcul des tâches:', taskError);
      }
      
      // Utiliser getEffectiveAvatar
      const avatar = this.getEffectiveAvatar(child, 'large');
      
      return `
        <div class="child-card">
          <div class="child-avatar">${avatar}</div>
          <div class="child-info">
            <div class="child-name">${name}</div>
            <div class="child-stats">
              ${points} points • Niveau ${level}<br>
              ${completedToday}/${todayTasks} tâches aujourd'hui
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${child.progress || 0}%"></div>
              </div>
            </div>
          </div>
          <div class="level-badge">Niveau ${level}</div>
          ${showActions ? `
            <div class="task-actions">
              <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-child" data-id="${child.id || 'unknown'}">Modifier</button>
              <button class="btn btn-danger btn-icon delete-btn" data-action="remove-child" data-id="${child.id || 'unknown'}">Supprimer</button>
            </div>
          ` : ''}
        </div>
      `;
    } catch (error) {
      console.error('Erreur dans renderChildCard:', error, 'Child data:', child);
      return `<div class="child-card"><div class="error">Erreur rendu: ${error.message}</div></div>`;
    }
  }

  renderTaskItem(task, children, showValidation = false, showManagement = false) {
    const childName = this.getChildName(task.assigned_child_id, children);
    
    return `
      <div class="task-item ${task.status}">
        <div class="task-content">
          <div class="task-title">${task.name}</div>
          <div class="task-meta">
            ${childName} • ${task.points} points • ${this.getCategoryLabel(task.category)} • ${this.getFrequencyLabel(task.frequency)}
            ${task.description ? `<br>${task.description}` : ''}
          </div>
        </div>
        <div class="task-status status-${task.status}">${this.getStatusLabel(task.status)}</div>
        <div class="task-actions">
          ${showValidation && task.status === 'pending_validation' ? `
            <button class="btn btn-success btn-icon validate-btn" data-action="validate-task" data-id="${task.id}">Valider</button>
            <button class="btn btn-danger btn-icon reject-btn" data-action="reject-task" data-id="${task.id}">Rejeter</button>
          ` : showManagement ? `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-task" data-id="${task.id}">Modifier</button>
            <button class="btn btn-danger btn-icon delete-btn" data-action="remove-task" data-id="${task.id}">Supprimer</button>
          ` : `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-task" data-id="${task.id}">Modifier</button>
          `}
        </div>
      </div>
    `;
  }

  renderRewardCard(reward, showActions = false) {
    return `
      <div class="child-card">
        <div class="child-avatar">🎁</div>
        <div class="child-info">
          <div class="child-name">${reward.name}</div>
          <div class="child-stats">
            ${reward.cost} points • ${this.getCategoryLabel(reward.category)}
            ${reward.remaining_quantity !== null ? `<br>${reward.remaining_quantity} restant(s)` : ''}
            ${reward.description ? `<br>${reward.description}` : ''}
          </div>
        </div>
        <div class="task-actions">
          ${showActions ? `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-reward" data-id="${reward.id}">Modifier</button>
            <button class="btn btn-danger btn-icon delete-btn" data-action="remove-reward" data-id="${reward.id}">Supprimer</button>
          ` : `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-reward" data-id="${reward.id}">Modifier</button>
          `}
        </div>
      </div>
    `;
  }

  // Styles CSS identiques au fichier précédent
  getStyles() {
    const tabColor = this.config?.tab_color || 'var(--primary-color, #3f51b5)';
    const dashboardPrimary = this.config?.dashboard_primary_color || 'var(--primary-color, #3f51b5)';
    const dashboardSecondary = this.config?.dashboard_secondary_color || 'var(--accent-color, #ff4081)';
    
    return `
      <style>
        :host {
          --custom-tab-color: ${tabColor};
          --custom-dashboard-primary: ${dashboardPrimary};
          --custom-dashboard-secondary: ${dashboardSecondary};
        }
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
          padding: 12px 8px;
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
        
        .nav-tab:hover { background: rgba(255, 255, 255, 0.1); }
        .nav-tab.active { background: rgba(255, 255, 255, 0.2); font-weight: bold; }
        
        .content { padding: 20px; background: var(--card-background-color, white); }
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
          padding: 16px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid var(--custom-dashboard-secondary);
          display: flex;
          align-items: center;
        }
        
        .stat-icon { font-size: 2em; margin-right: 16px; }
        .stat-info { flex: 1; }
        .stat-number {
          font-size: 1.5em;
          font-weight: bold;
          color: var(--primary-text-color, #212121);
        }
        .stat-label { color: var(--secondary-text-color, #757575); font-size: 0.9em; }
        
        .child-card {
          display: flex;
          align-items: center;
          padding: 16px;
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid var(--custom-dashboard-secondary);
          transition: all 0.3s;
          position: relative;
        }
        
        .child-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .child-avatar { 
          font-size: 2.5em; 
          margin-right: 16px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          min-width: 3em;
          min-height: 3em;
          flex-shrink: 0;
        }
        .child-avatar img {
          width: 3em !important;
          height: 3em !important;
          border-radius: 50% !important;
          object-fit: cover !important;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        .child-info { 
          flex: 1; 
          display: flex;
          align-items: center;
        }
        .child-name {
          font-size: 1.6em;
          font-weight: bold;
          margin: 0;
          color: var(--primary-text-color, #212121);
        }
        .child-stats {
          color: var(--secondary-text-color, #757575);
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        
        .level-badge {
          background: var(--custom-dashboard-secondary);
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-weight: bold;
          font-size: 0.8em;
          margin: 0 8px;
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
          background: var(--custom-dashboard-secondary);
          transition: width 0.3s ease;
        }
        
        .task-item {
          display: flex;
          align-items: center;
          padding: 12px;
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid #ddd;
          transition: all 0.3s;
        }
        
        .task-item:hover { box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .task-item.pending_validation { border-left-color: #ff5722; background: #fff3e0; }
        .task-item.validated { border-left-color: #4caf50; }
        
        .task-content { flex: 1; }
        .task-title {
          font-weight: bold;
          margin-bottom: 4px;
          color: var(--primary-text-color, #212121);
        }
        .task-meta { font-size: 0.85em; color: var(--secondary-text-color, #757575); }
        .task-actions { 
          display: flex; 
          gap: 8px; 
          flex-wrap: nowrap; 
          justify-content: center; 
          align-items: center; 
          margin-top: 8px;
        }
        
        .child-card .task-actions {
          position: absolute;
          right: 20px;
          bottom: 20px;
          margin-top: 0;
          flex-direction: row;
          gap: 8px;
          min-width: 140px;
        }
        
        .child-card .task-actions .btn {
          padding: 6px 12px;
          font-size: 0.85em;
          min-width: 65px;
        }
        
        .child-card .task-actions .edit-btn {
          background-color: #4caf50;
          color: white;
          border: 1px solid #4caf50;
          order: 2;
        }
        
        .child-card .task-actions .edit-btn:hover {
          background-color: #45a049;
        }
        
        .child-card .task-actions .delete-btn {
          background-color: #f44336;
          color: white;
          border: 1px solid #f44336;
          order: 1;
        }
        
        .child-card .task-actions .delete-btn:hover {
          background-color: #d32f2f;
        }
        
        .task-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0 8px;
          white-space: nowrap;
        }
        
        .status-todo { background: #ff9800; color: white; }
        .status-in_progress { background: #2196f3; color: white; }
        .status-pending_validation { background: #ff5722; color: white; }
        .status-validated { background: #4caf50; color: white; }
        .status-failed { background: #f44336; color: white; }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          text-decoration: none;
        }
        
        .btn:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .btn:active { transform: translateY(0); }
        
        .btn-primary { background: var(--custom-dashboard-primary); color: white; }
        .btn-success { background: #4caf50; color: white; }
        .btn-danger { background: #f44336; color: white; }
        .btn-secondary {
          background: var(--secondary-background-color, #fafafa);
          color: var(--primary-text-color, #212121);
          border: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .btn-icon { padding: 6px 12px; font-size: 12px; }
        .btn-icon::before { margin-right: 4px; font-weight: normal; }
        .add-btn::before { content: "+ "; }
        .edit-btn::before { content: "✎ "; }
        .delete-btn::before { content: "🗑 "; }
        .validate-btn::before { content: "✓ "; }
        .reject-btn::before { content: "✗ "; }
        .claim-btn::before { content: "🎁 "; }
        
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: var(--primary-text-color, #212121);
        }
        
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 8px 12px;
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
        .form-row { display: flex; gap: 12px; }
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
          border-radius: 8px;
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
        .modal-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
        .modal-footer {
          padding: 16px 24px;
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
          border-radius: 50%;
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
        
        .grid { display: grid; gap: 16px; }
        .grid-2 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .grid-3 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
        
        .avatar-options { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
        .avatar-option {
          padding: 8px;
          border: 2px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
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
          padding: 16px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
        }
        .reward-info h3 {
          margin: 0 0 8px 0;
          color: var(--primary-text-color, #212121);
        }
        
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          color: var(--secondary-text-color, #757575);
        }
        
        /* Tablette */
        @media (max-width: 1024px) and (min-width: 769px) {
          .child-card {
            padding: 14px;
            padding-bottom: 50px;
          }
          .child-card .task-actions {
            right: 8px;
            bottom: 12px;
          }
        }
        
        /* Téléphone */
        @media (max-width: 768px) {
          .content { padding: 16px; }
          .nav-tab { font-size: 11px; padding: 8px 4px; }
          .form-row { flex-direction: column; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          .child-card { 
            flex-direction: column; 
            text-align: center; 
            padding: 16px 12px;
            padding-bottom: 50px;
            position: relative;
          }
          .child-avatar { margin: 0 0 12px 0; }
          .task-item { flex-direction: column; align-items: flex-start; }
          .task-actions { margin-top: 12px; width: 100%; justify-content: center; }
          .modal-content { width: 95%; margin: 0 auto; }
          .modal-body { padding: 16px; }
          
          .child-card .task-actions {
            position: absolute;
            left: 8px;
            right: 8px;
            bottom: 8px;
            flex-direction: row;
            justify-content: space-between;
            gap: 0;
            min-width: auto;
          }
          
          .child-card .task-actions .btn {
            min-width: 70px;
            padding: 8px 12px;
          }
        }
      </style>
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

  // Méthode pour résoudre l'avatar effectif
  getEffectiveAvatar(child, context = 'normal') {
    if (!child) {
      return '👶';
    }
    
    const avatarType = child.avatar_type || 'emoji';
    
    if (avatarType === 'emoji') {
      return child.avatar || '👶';
    } else if (avatarType === 'url' && child.avatar_data) {
      const size = context === 'large' ? '4em' : '3em';
      return `<img src="${child.avatar_data}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
    } else if (avatarType === 'inline' && child.avatar_data) {
      const size = context === 'large' ? '4em' : '3em';
      return `<img src="data:image/png;base64,${child.avatar_data}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
    } else if (avatarType === 'person_entity' && child.person_entity_id && this._hass) {
      const personEntity = this._hass.states[child.person_entity_id];
      if (personEntity && personEntity.attributes && personEntity.attributes.entity_picture) {
        const size = context === 'large' ? '4em' : '3em';
        return `<img src="${personEntity.attributes.entity_picture}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
      }
    }
    return child.avatar || '👶';
  }
}

customElements.define('kids-tasks-card', KidsTasksCard);

// Éditeur de configuration pour la carte principale
class KidsTasksCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._rendered = false;
  }

  setConfig(config) {
    const configChanged = JSON.stringify(this.config) !== JSON.stringify(config);
    this.config = config;
    if (!this._rendered || configChanged) {
      this._rendered = false; // Permettre le re-rendu si la config a changé
      this.render();
      this._rendered = true;
    }
  }

  set hass(hass) {
    this._hass = hass;
  }

  configChanged(newConfig) {
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    
    this.shadowRoot.innerHTML = `
      <style>
        .config-row {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .config-row label {
          margin-left: 8px;
          cursor: pointer;
        }
        ha-textfield {
          width: 100%;
          margin-bottom: 16px;
        }
        ha-switch {
          margin-right: 8px;
        }
      </style>
      <div>
        <ha-textfield
          id="title-input"
          label="Titre de la carte"
          value="${this.config?.title || 'Gestionnaire de Tâches Enfants'}">
        </ha-textfield>
        
        <div class="config-row">
          <ha-switch
            id="navigation-switch"
            ${this.config?.show_navigation !== false ? 'checked' : ''}>
          </ha-switch>
          <label>Afficher la navigation par onglets</label>
        </div>

        <ha-input-color-picker
          id="tab-color-input"
          label="Couleur des onglets"
          value="${this.config?.tab_color || '#3f51b5'}">
        </ha-input-color-picker>

        <ha-input-color-picker
          id="dashboard-primary-input"
          label="Couleur primaire dashboard"
          value="${this.config?.dashboard_primary_color || '#2196f3'}">
        </ha-input-color-picker>

        <ha-input-color-picker
          id="dashboard-secondary-input"
          label="Couleur secondaire dashboard"
          value="${this.config?.dashboard_secondary_color || '#ff4081'}">
        </ha-input-color-picker>
      </div>
    `;

    // Attacher les événements après le rendu
    const titleInput = this.shadowRoot.getElementById('title-input');
    const navSwitch = this.shadowRoot.getElementById('navigation-switch');
    const tabColorInput = this.shadowRoot.getElementById('tab-color-input');
    const dashboardPrimaryInput = this.shadowRoot.getElementById('dashboard-primary-input');
    const dashboardSecondaryInput = this.shadowRoot.getElementById('dashboard-secondary-input');
    
    if (titleInput) {
      titleInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, title: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (navSwitch) {
      navSwitch.addEventListener('change', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, show_navigation: ev.target.checked };
        this.configChanged(this.config);
      });
    }
    
    if (tabColorInput) {
      tabColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, tab_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (dashboardPrimaryInput) {
      dashboardPrimaryInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, dashboard_primary_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (dashboardSecondaryInput) {
      dashboardSecondaryInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, dashboard_secondary_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    this._rendered = true;
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

// Carte individuelle pour chaque enfant
// Permet à chaque enfant de suivre ses propres progrès et tâches

class KidsTasksChildCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
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

    this.handleAction(action, id);
  }

  handleAction(action, id = null) {
    if (!this._hass) return;

    try {
      switch (action) {
        case 'complete_task':
          this._hass.callService('kids_tasks', 'complete_task', {
            task_id: id,
          });
          this.showNotification('Tâche marquée comme terminée ! 🎉', 'success');
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

  // Méthode pour résoudre l'avatar effectif
  getEffectiveAvatar(child, context = 'normal') {
    if (!child) {
      return '👶';
    }
    
    const avatarType = child.avatar_type || 'emoji';
    
    if (avatarType === 'emoji') {
      return child.avatar || '👶';
    } else if (avatarType === 'url' && child.avatar_data) {
      const size = context === 'large' ? '4em' : '3em';
      return `<img src="${child.avatar_data}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
    } else if (avatarType === 'inline' && child.avatar_data) {
      const size = context === 'large' ? '4em' : '3em';
      return `<img src="data:image/png;base64,${child.avatar_data}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
    } else if (avatarType === 'person_entity' && child.person_entity_id && this._hass) {
      const personEntity = this._hass.states[child.person_entity_id];
      if (personEntity && personEntity.attributes && personEntity.attributes.entity_picture) {
        const size = context === 'large' ? '4em' : '3em';
        return `<img src="${personEntity.attributes.entity_picture}" alt="${child.name || 'Enfant'}" style="width: ${size}; height: ${size}; border-radius: 50%; object-fit: cover;">`;
      }
    }
    return child.avatar || '👶';
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
    const level = parseInt(pointsEntity.attributes.level) || 1;
    const progress = ((points % 100) / 100) * 100;

    return {
      id: this.config.child_id,
      name: pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || 'Enfant',
      points: points,
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
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les nouveaux capteurs TaskSensor
    Object.keys(entities).forEach(entityId => { 
      if (entityId.startsWith('sensor.kids_tasks_task_')) {
        const taskEntity = entities[entityId];
        if (taskEntity && 
            taskEntity.attributes && 
            taskEntity.attributes.assigned_child_id === this.config.child_id) {
          
          const attrs = taskEntity.attributes;
          tasks.push({
            id: attrs.task_id || entityId.replace('sensor.kids_tasks_task_', ''),
            name: attrs.task_name || attrs.friendly_name || 'Tâche',
            description: attrs.description || '',
            category: attrs.category || 'other',
            points: parseInt(attrs.points) || 10,
            status: taskEntity.state || 'todo',
            validation_required: attrs.validation_required !== false
          });
        }
      }
    });
    
    // Trier par statut (en attente en premier, puis à faire)
    return tasks.sort((a, b) => {
      const statusOrder = { 'pending_validation': 0, 'todo': 1, 'completed': 2, 'validated': 3 };
      return (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);
    });
  }

  // Récupérer les récompenses disponibles
  getRewards() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const rewards = [];
    
    // VERSION SIMPLIFIÉE - Chercher UNIQUEMENT les nouveaux capteurs RewardSensor
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_reward_')) {
        const rewardEntity = entities[entityId];
        if (rewardEntity && rewardEntity.attributes) {
          const attrs = rewardEntity.attributes;
          
          rewards.push({
            id: attrs.reward_id || entityId.replace('sensor.kids_tasks_reward_', ''),
            name: attrs.reward_name || attrs.friendly_name || 'Récompense',
            cost: parseInt(attrs.cost) || parseInt(rewardEntity.state) || 50,
            category: attrs.category || 'fun',
            description: attrs.description || '',
            active: attrs.active !== false,
            remaining_quantity: attrs.remaining_quantity,
            is_available: attrs.is_available !== false
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
      padding: 12px 20px;
      background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
      color: white;
      border-radius: 8px;
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

  getCategoryIcon(category) {
    const icons = {
      'bedroom': '🛏️',
      'bathroom': '🛁',
      'kitchen': '🍽️',
      'homework': '📚',
      'outdoor': '🌳',
      'pets': '🐕',
      'other': '📋',
      'fun': '🎉',
      'screen_time': '📱',
      'outing': '🚗',
      'privilege': '👑',
      'toy': '🧸',
      'treat': '🍭'
    };
    return icons[category] || '📋';
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
    const oldChildEntity = oldHass.states[`sensor.kids_tasks_child_${this.config.child_id}`];
    const newChildEntity = newHass.states[`sensor.kids_tasks_child_${this.config.child_id}`];
    
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
    const childEntity = hass.states[`sensor.kids_tasks_child_${this.config.child_id}`];
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
    const availableRewards = rewards.filter(r => r.cost <= child.points);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
        }
        
        .child-card {
          background: var(--card-background-color, #fff);
          border-radius: 12px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          overflow: hidden;
          margin: 8px 0;
        }
        
        .header {
          background: linear-gradient(135deg, ${child.card_gradient_start || 'var(--primary-color, #3f51b5)'} 0%, ${child.card_gradient_end || 'var(--accent-color, #ff4081)'} 100%);
          color: white;
          padding: 24px;
          text-align: center;
          position: relative;
        }
        
        .avatar {
          font-size: 3em;
          margin-bottom: 8px;
          display: block;
        }
        
        .child-name {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .level-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.9em;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 12px;
        }
        
        .points-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
        
        .points-display {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .progress-bar {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin: 8px 0;
        }
        
        .progress-fill {
          background: white;
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-size: 0.9em;
          opacity: 0.9;
        }
        
        .content {
          padding: 20px;
        }
        
        .section {
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 1.2em;
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .task-item {
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          padding: 16px;
          border-left: 4px solid #ddd;
          transition: all 0.3s;
        }
        
        .task-item:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        
        .task-item.todo {
          border-left-color: var(--info-color, #2196F3);
        }
        
        .task-item.pending_validation {
          border-left-color: var(--warning-color, #FF9800);
          background: #fff3e0;
        }
        
        .task-item.completed {
          border-left-color: var(--success-color, #4CAF50);
          opacity: 0.8;
        }
        
        .task-item.validated {
          border-left-color: var(--success-color, #4CAF50);
          background: #e8f5e8;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .task-info {
          flex: 1;
        }
        
        .task-name {
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .task-description {
          color: var(--secondary-text-color, #757575);
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        
        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .task-status {
          font-size: 0.8em;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
        }
        
        .task-status.todo {
          background: var(--info-color, #2196F3);
          color: white;
        }
        
        .task-status.pending_validation {
          background: var(--warning-color, #FF9800);
          color: white;
        }
        
        .task-status.validated {
          background: var(--success-color, #4CAF50);
          color: white;
        }
        
        .task-points {
          background: var(--custom-dashboard-secondary);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: bold;
        }
        
        .complete-btn {
          background: var(--success-color, #4CAF50);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
          margin-top: 8px;
        }
        
        .complete-btn:hover {
          background: var(--success-color, #45a049);
          transform: scale(1.05);
        }
        
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        
        .reward-card {
          background: var(--secondary-background-color, #f5f5f5);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        
        .reward-card.affordable {
          border-color: var(--success-color, #4CAF50);
          background: #e8f5e8;
        }
        
        .reward-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        
        .reward-icon {
          font-size: 2em;
          margin-bottom: 8px;
        }
        
        .reward-name {
          font-weight: bold;
          margin-bottom: 4px;
          color: var(--primary-text-color, #212121);
        }
        
        .reward-cost {
          color: var(--accent-color, #ff4081);
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .claim-btn {
          background: var(--custom-dashboard-secondary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s;
        }
        
        .claim-btn:hover {
          background: var(--accent-color, #e91e63);
          transform: scale(1.05);
        }
        
        .claim-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--secondary-text-color, #757575);
        }
        
        .empty-icon {
          font-size: 3em;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .loading, .error {
          text-align: center;
          padding: 40px;
        }
        
        .error {
          color: var(--error-color, #f44336);
        }
        
        @media (max-width: 768px) {
          .header {
            padding: 16px;
          }
          
          .content {
            padding: 16px;
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
      </style>
      
      <div class="child-card">
        <div class="header">
          ${this.config.show_avatar ? `<span class="avatar">${this.getEffectiveAvatar(child)}</span>` : ''}
          <div class="child-name">${child.name}</div>
          <div class="level-badge">Niveau ${child.level}</div>
          
          ${this.config.show_progress ? `
            <div class="points-section">
              <div class="points-display">${child.points} points</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${child.progress}%"></div>
              </div>
              <div class="progress-text">
                ${child.pointsToNext} points pour le niveau suivant
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">
              📝 Mes Tâches ${tasks.length > 0 ? `(${tasks.length})` : ''}
            </div>
            
            ${tasks.length > 0 ? `
              <div class="task-list">
                ${tasks.map(task => `
                  <div class="task-item ${task.status}">
                    <div class="task-header">
                      <div class="task-info">
                        <div class="task-name">
                          ${this.getCategoryIcon(task.category)} ${task.name}
                        </div>
                        ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                        <div class="task-meta">
                          <div class="task-status ${task.status}">${this.getStatusLabel(task.status)}</div>
                          <div class="task-points">+${task.points} points</div>
                        </div>
                      </div>
                    </div>
                    
                    ${task.status === 'todo' ? `
                      <button class="complete-btn" data-action="complete_task" data-id="${task.id}">
                        ✅ Marquer comme terminé
                      </button>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <p>Aucune tâche assignée pour le moment</p>
              </div>
            `}
          </div>
          
          ${this.config.show_rewards && rewards.length > 0 ? `
            <div class="section">
              <div class="section-title">
                🎁 Récompenses Disponibles
              </div>
              <div class="rewards-grid">
                ${rewards.map(reward => `
                  <div class="reward-card ${reward.cost <= child.points ? 'affordable' : ''}">
                    <div class="reward-icon">${this.getCategoryIcon(reward.category)}</div>
                    <div class="reward-name">${reward.name}</div>
                    <div class="reward-cost">${reward.cost} points</div>
                    ${reward.description ? `<div style="font-size: 0.9em; color: var(--secondary-text-color); margin-bottom: 8px;">${reward.description}</div>` : ''}
                    <button class="claim-btn" 
                            data-action="claim_reward" 
                            data-id="${reward.id}"
                            ${reward.cost > child.points ? 'disabled' : ''}>
                      ${reward.cost <= child.points ? '🎁 Échanger' : `Besoin de ${reward.cost - child.points} points`}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Ajouter gestionnaire pour détecter les ratios d'images après le rendu
    setTimeout(() => this.handleImageAspectRatios(), 10);
  }
  
  handleImageAspectRatios() {
    const avatarImages = this.shadowRoot.querySelectorAll('.avatar img');
    avatarImages.forEach(img => {
      if (img.complete && img.naturalWidth && img.naturalHeight) {
        this.checkImageRatio(img);
      } else {
        img.addEventListener('load', () => this.checkImageRatio(img), { once: true });
      }
    });
  }
  
  checkImageRatio(img) {
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Math.abs(ratio - 2) < Math.abs(ratio - 1)) {
        // L'image est plus proche d'un ratio 2:1 que 1:1 - mode bannière
        img.setAttribute('data-wide', 'true');
        img.style.borderRadius = '16px';
        img.style.width = '100%';
        img.style.height = '4em';
        img.style.maxWidth = '100%';
        img.style.objectFit = 'cover';
        img.style.objectPosition = 'center';
        // Conserver la transparence pour les PNG
        img.style.backgroundColor = 'transparent';
      }
    }
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
}

// Enregistrer le composant enfant
customElements.define('kids-tasks-child-card', KidsTasksChildCard);

// Éditeur de configuration pour la carte enfant
class KidsTasksChildCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
  }

  setConfig(config) {
    this._config = Object.assign({}, config);
    if (this._rendered) {
      this._updateValues();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this.render();
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
      </div>
      
      <style>
        .card-config {
          padding: 16px;
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
          padding: 8px;
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
    
    if (childSelect) childSelect.value = this._child_id;
    if (titleInput) titleInput.value = this._title;
    if (showAvatarSwitch) showAvatarSwitch.checked = this._show_avatar;
    if (showProgressSwitch) showProgressSwitch.checked = this._show_progress;
    if (showRewardsSwitch) showRewardsSwitch.checked = this._show_rewards;
  }

  _valueChanged() {
    const child_id = this.querySelector('#child_select').value;
    const title = this.querySelector('#title').value;
    const show_avatar = this.querySelector('#show_avatar').checked;
    const show_progress = this.querySelector('#show_progress').checked;
    const show_rewards = this.querySelector('#show_rewards').checked;

    this._config = {
      type: 'custom:kids-tasks-child-card',
      child_id,
      title,
      show_avatar,
      show_progress,
      show_rewards
    };

    // Fire config-changed event
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
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