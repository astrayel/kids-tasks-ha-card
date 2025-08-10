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
    this._hass = hass;
    if (!this._initialized && hass) {
      this._initialized = true;
      this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
    }
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
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
      case 'claim-reward':
        this.showClaimRewardForm(id);
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

  async submitChildForm(dialog, isEdit = false) {
    const form = dialog.querySelector('form');
    const formData = new FormData(form);
    
    const serviceData = {
      name: formData.get('name'),
      avatar: formData.get('avatar') || '👶',
      initial_points: parseInt(formData.get('initial_points') || '0')
    };

    if (isEdit) {
      serviceData.child_id = formData.get('child_id');
      delete serviceData.initial_points;
      if (await this.callService('kids_tasks', 'update_child', serviceData)) {
        this.closeModal(dialog);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_child', serviceData)) {
        this.closeModal(dialog);
      }
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
    
    const serviceData = {
      name,
      description,
      category,
      points,
      frequency,
      assigned_child_id,
      validation_required
    };

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
        
        /* Limiter la hauteur des ha-select pour éviter l'overflow */
        ha-select {
          max-height: 56px;
          overflow: visible;
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
        
        /* Corriger la taille des select */
        ha-select {
          max-height: 56px;
          overflow: visible;
        }
        
        ha-select[opened] {
          max-height: none;
        }
        
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

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="child_id" value="${child.id}">` : ''}
        <div class="form-group">
          <label class="form-label">Nom de l'enfant*</label>
          <input type="text" name="name" class="form-input" required 
                 value="${isEdit ? child.name : ''}"
                 placeholder="Prénom de l'enfant">
        </div>
        <div class="form-group">
          <label class="form-label">Avatar</label>
          <div class="avatar-options">
            ${avatarOptions.map(avatar => `
              <button type="button" class="avatar-option ${isEdit && child.avatar === avatar ? 'selected' : ''}" 
                      onclick="this.closest('ha-dialog').querySelector('input[name=avatar]').value = '${avatar}'; this.closest('.avatar-options').querySelectorAll('.avatar-option').forEach(btn => btn.classList.remove('selected')); this.classList.add('selected');">
                ${avatar}
              </button>
            `).join('')}
          </div>
          <input type="hidden" name="avatar" value="${isEdit ? child.avatar || '👶' : '👶'}">
        </div>
        ${!isEdit ? `
          <div class="form-group">
            <label class="form-label">Points initiaux</label>
            <input type="number" name="initial_points" class="form-input" 
                   value="0" min="0" max="1000" step="1">
          </div>
        ` : ''}
        <div style="margin-top: 20px; text-align: right;">
          <button type="button" class="btn btn-secondary" onclick="this.closest('ha-dialog').close()" style="margin-right: 10px;">Annuler</button>
          <button type="button" class="btn btn-primary" onclick="this.closest('ha-dialog')._cardInstance.submitChildForm(this.closest('ha-dialog'), ${isEdit})">${isEdit ? 'Modifier' : 'Ajouter'}</button>
        </div>
      </form>
    `;

    this.showModal(content, isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant');
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

    this.showModal(content, isEdit ? 'Modifier la tâche' : 'Créer une tâche');
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
            avatar: pointsEntity.attributes.avatar || '👶'
          });
        }
      }
    });
    
    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  getTasks() {
    const tasks = [];
    const entities = this._hass.states;
    
    // Chercher les tâches par groupes d'entités avec préfixe KT_
    const taskGroups = new Map();
    
    Object.keys(entities).forEach(entityId => {
      // Chercher les entités button, number, select de tâches
      if (entityId.startsWith('button.terminer_') || 
          entityId.startsWith('number.points_') || 
          entityId.startsWith('select.statut_')) {
        
        // Extraire le nom de base de la tâche
        let taskBaseName;
        if (entityId.startsWith('button.terminer_')) {
          taskBaseName = entityId.replace('button.terminer_', '');
        } else if (entityId.startsWith('number.points_')) {
          taskBaseName = entityId.replace('number.points_', '');
        } else if (entityId.startsWith('select.statut_')) {
          taskBaseName = entityId.replace('select.statut_', '');
        }
        
        if (taskBaseName) {
          if (!taskGroups.has(taskBaseName)) {
            taskGroups.set(taskBaseName, {});
          }
          
          const entity = entities[entityId];
          if (entityId.startsWith('button.terminer_')) {
            taskGroups.get(taskBaseName).button = entity;
          } else if (entityId.startsWith('number.points_')) {
            taskGroups.get(taskBaseName).points = entity;
          } else if (entityId.startsWith('select.statut_')) {
            taskGroups.get(taskBaseName).status = entity;
          }
        }
      }
    });
    
    // Créer les tâches à partir des groupes
    taskGroups.forEach((group, taskBaseName) => {
      if (group.status && group.points) {
        const statusEntity = group.status;
        const pointsEntity = group.points;
        
        // Convertir le statut français en statut système
        const statusMapping = {
          'À faire': 'todo',
          'En cours': 'in_progress', 
          'Terminé': 'completed',
          'En attente validation': 'pending_validation',
          'Validé': 'validated',
          'Échoué': 'failed'
        };
        
        tasks.push({
          id: taskBaseName,
          name: statusEntity.attributes.friendly_name?.replace('Statut: ', '') || taskBaseName.replace(/_/g, ' '),
          description: statusEntity.attributes.description || '',
          category: statusEntity.attributes.category || 'other',
          points: parseInt(pointsEntity.state) || 10,
          frequency: statusEntity.attributes.frequency || 'daily',
          status: statusMapping[statusEntity.state] || 'todo',
          assigned_child_id: statusEntity.attributes.assigned_child_id || null,
          validation_required: statusEntity.attributes.validation_required !== false,
          active: statusEntity.attributes.active !== false,
          created_at: statusEntity.attributes.created_at || new Date().toISOString(),
          last_completed_at: statusEntity.attributes.last_completed_at || null
        });
      }
    });
    
    return tasks.sort((a, b) => {
      if (a.status === 'pending_validation' && b.status !== 'pending_validation') return -1;
      if (b.status === 'pending_validation' && a.status !== 'pending_validation') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getRewards() {
    if (!this._hass || !this._hass.states) return [];
    
    const rewards = [];
    const entities = this._hass.states;
    
    // Chercher les récompenses par groupes d'entités avec préfixe KT_
    const rewardGroups = new Map();
    
    Object.keys(entities).forEach(entityId => {
      // Chercher les entités de récompenses sans préfixe
      if (entityId.startsWith('button.echanger_') || 
          entityId.startsWith('number.cout_') || 
          entityId.startsWith('switch.active_reward_') ||
          entityId.startsWith('number.quantite_')) {
        
        // Extraire le nom de base de la récompense
        let rewardBaseName;
        if (entityId.startsWith('button.echanger_')) {
          rewardBaseName = entityId.replace('button.echanger_', '');
        } else if (entityId.startsWith('number.cout_')) {
          rewardBaseName = entityId.replace('number.cout_', '');
        } else if (entityId.startsWith('switch.active_reward_')) {
          rewardBaseName = entityId.replace('switch.active_reward_', '');
        } else if (entityId.startsWith('number.quantite_')) {
          rewardBaseName = entityId.replace('number.quantite_', '');
        }
        
        if (rewardBaseName) {
          if (!rewardGroups.has(rewardBaseName)) {
            rewardGroups.set(rewardBaseName, {});
          }
          
          const entity = entities[entityId];
          if (entityId.startsWith('button.echanger_')) {
            rewardGroups.get(rewardBaseName).button = entity;
          } else if (entityId.startsWith('number.cout_')) {
            rewardGroups.get(rewardBaseName).cost = entity;
          } else if (entityId.startsWith('switch.active_reward_')) {
            rewardGroups.get(rewardBaseName).active = entity;
          } else if (entityId.startsWith('number.quantite_')) {
            rewardGroups.get(rewardBaseName).quantity = entity;
          }
        }
      }
    });
    
    // Créer les récompenses à partir des groupes
    rewardGroups.forEach((group, rewardBaseName) => {
      if (group.cost) {
        const costEntity = group.cost;
        const activeEntity = group.active;
        const quantityEntity = group.quantity;
        const buttonEntity = group.button;
        
        rewards.push({
          id: rewardBaseName,
          name: costEntity.attributes.friendly_name?.replace('Coût: ', '') || 
                buttonEntity?.attributes.friendly_name?.replace('Échanger: ', '') || 
                rewardBaseName.replace(/_/g, ' '),
          description: costEntity.attributes.description || '',
          category: costEntity.attributes.category || 'fun',
          cost: parseInt(costEntity.state) || 50,
          active: activeEntity ? activeEntity.state === 'on' : true,
          limited_quantity: quantityEntity ? parseInt(quantityEntity.attributes.max) : null,
          remaining_quantity: quantityEntity ? parseInt(quantityEntity.state) : null
        });
      }
    });
    
    return rewards.filter(r => r.active).sort((a, b) => a.name.localeCompare(b.name));
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
          ${children.map(child => this.renderChildCard(child)).join('')}
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
            ${children.map(child => this.renderChildCard(child, true)).join('')}
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
    const tasks = this.getTasks();
    const completedToday = this.getChildCompletedToday(child.id, tasks).length;
    const todayTasks = this.getChildTasksToday(child.id, tasks).length;

    return `
      <div class="child-card">
        <div class="child-avatar">${child.avatar || '👶'}</div>
        <div class="child-info">
          <div class="child-name">${child.name}</div>
          <div class="child-stats">
            ${child.points} points • Niveau ${child.level}<br>
            ${completedToday}/${todayTasks} tâches aujourd'hui
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${child.progress || 0}%"></div>
            </div>
          </div>
        </div>
        <div class="level-badge">Niveau ${child.level}</div>
        ${showActions ? `
          <div class="task-actions">
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-child" data-id="${child.id}">Modifier</button>
            <button class="btn btn-danger btn-icon delete-btn" data-action="remove-child" data-id="${child.id}">Supprimer</button>
          </div>
        ` : ''}
      </div>
    `;
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
          <button class="btn btn-primary btn-icon claim-btn" data-action="claim-reward" data-id="${reward.id}">Échanger</button>
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
    return `
      <style>
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
          background: var(--primary-color, #3f51b5);
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
          border-left: 4px solid var(--accent-color, #ff4081);
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
          border-left: 4px solid var(--accent-color, #ff4081);
          transition: all 0.3s;
          position: relative;
        }
        
        .child-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .child-avatar { font-size: 2.5em; margin-right: 16px; }
        .child-info { flex: 1; }
        .child-name {
          font-size: 1.1em;
          font-weight: bold;
          margin-bottom: 4px;
          color: var(--primary-text-color, #212121);
        }
        .child-stats {
          color: var(--secondary-text-color, #757575);
          font-size: 0.9em;
          margin-bottom: 8px;
        }
        
        .level-badge {
          background: var(--accent-color, #ff4081);
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
          background: var(--accent-color, #ff4081);
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
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          margin-top: 0;
          flex-direction: row;
          gap: 8px;
          min-width: 160px;
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
        
        .btn-primary { background: var(--primary-color, #3f51b5); color: white; }
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
        
        @media (max-width: 768px) {
          .content { padding: 16px; }
          .nav-tab { font-size: 11px; padding: 8px 4px; }
          .form-row { flex-direction: column; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          .child-card { flex-direction: column; text-align: center; padding: 16px 12px; }
          .child-avatar { margin: 0 0 12px 0; }
          .task-item { flex-direction: column; align-items: flex-start; }
          .task-actions { margin-top: 12px; width: 100%; justify-content: center; }
          .modal-content { width: 95%; margin: 0 auto; }
          .modal-body { padding: 16px; }
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
      title: "Gestionnaire de Tâches Enfants",
      show_navigation: true
    };
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
      </div>
    `;

    // Attacher les événements après le rendu
    const titleInput = this.shadowRoot.getElementById('title-input');
    const navSwitch = this.shadowRoot.getElementById('navigation-switch');
    
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
    this._hass = hass;
    if (!this._initialized && hass) {
      this._initialized = true;
      this.shadowRoot.addEventListener('click', this.handleClick.bind(this));
    }
    this.render();
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
      pointsToNext: pointsEntity.attributes.points_to_next_level || (100 - (points % 100))
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
          background: linear-gradient(135deg, var(--primary-color, #3f51b5) 0%, var(--accent-color, #ff4081) 100%);
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
          background: var(--accent-color, #ff4081);
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
          background: var(--accent-color, #ff4081);
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
          ${this.config.show_avatar ? `<span class="avatar">${child.avatar}</span>` : ''}
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
  }

  getCardSize() {
    return 6;
  }

  static getConfigElement() {
    return document.createElement('kids-tasks-child-card-editor');
  }

  static getStubConfig() {
    return {
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
    if (hass && !this._rendered) {
      this.render();
      this._rendered = true;
    }
  }

  configChanged(newConfig) {
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
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
        ha-textfield, ha-select {
          width: 100%;
          margin-bottom: 16px;
        }
        ha-switch {
          margin-right: 8px;
        }
      </style>
      <div>
        <ha-select
          id="child-select"
          label="Enfant *"
          value="${this.config?.child_id || ''}"
          required>
          <ha-list-item value="">Sélectionner un enfant...</ha-list-item>
          ${children.map(child => `
            <ha-list-item value="${child.id}" ${this.config?.child_id === child.id ? 'selected' : ''}>
              ${child.name}
            </ha-list-item>
          `).join('')}
        </ha-select>
        
        <ha-textfield
          id="title-input"
          label="Titre de la carte"
          value="${this.config?.title || 'Mes Tâches'}">
        </ha-textfield>
        
        <div class="config-row">
          <ha-switch
            id="avatar-switch"
            ${this.config?.show_avatar !== false ? 'checked' : ''}>
          </ha-switch>
          <label>Afficher l'avatar</label>
        </div>
        
        <div class="config-row">
          <ha-switch
            id="progress-switch"
            ${this.config?.show_progress !== false ? 'checked' : ''}>
          </ha-switch>
          <label>Afficher la progression</label>
        </div>
        
        <div class="config-row">
          <ha-switch
            id="rewards-switch"
            ${this.config?.show_rewards !== false ? 'checked' : ''}>
          </ha-switch>
          <label>Afficher les récompenses</label>
        </div>
      </div>
    `;

    // Attacher les événements après le rendu
    const childSelect = this.shadowRoot.getElementById('child-select');
    const titleInput = this.shadowRoot.getElementById('title-input');
    const avatarSwitch = this.shadowRoot.getElementById('avatar-switch');
    const progressSwitch = this.shadowRoot.getElementById('progress-switch');
    const rewardsSwitch = this.shadowRoot.getElementById('rewards-switch');
    
    if (childSelect) {
      childSelect.addEventListener('selected', (ev) => {
        setTimeout(() => {
          const selectedValue = childSelect.value;
          if (selectedValue && selectedValue !== this.config?.child_id) {
            const newConfig = {
              ...this.config,
              child_id: selectedValue
            };
            
            // Déclencher l'événement de configuration
            const event = new CustomEvent('config-changed', {
              detail: { config: newConfig },
              bubbles: true,
              composed: true
            });
            this.dispatchEvent(event);
          }
        }, 100);
      });
    }
    
    if (titleInput) {
      titleInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, title: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (avatarSwitch) {
      avatarSwitch.addEventListener('change', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, show_avatar: ev.target.checked };
        this.configChanged(this.config);
      });
    }
    
    if (progressSwitch) {
      progressSwitch.addEventListener('change', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, show_progress: ev.target.checked };
        this.configChanged(this.config);
      });
    }
    
    if (rewardsSwitch) {
      rewardsSwitch.addEventListener('change', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, show_rewards: ev.target.checked };
        this.configChanged(this.config);
      });
    }
    
    this._rendered = true;
  }
}

customElements.define('kids-tasks-child-card-editor', KidsTasksChildCardEditor);

// Ajouter à la liste des cartes personnalisées
window.customCards.push({
  type: 'kids-tasks-child-card',
  name: 'Kids Tasks Child Card',
  description: 'Carte individuelle pour chaque enfant avec ses tâches et progrès',
  preview: true,
  documentationURL: 'https://github.com/astrayel/kids-tasks-card',
});