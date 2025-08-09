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
        this.render();
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
        if (confirm('Êtes-vous sûr de vouloir supprimer cet enfant ? Toutes ses données seront perdues.')) {
          this.callService('kids_tasks', 'remove_child', { child_id: id });
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

  async submitChildForm(modal, isEdit = false) {
    const form = modal.querySelector('form');
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
        this.closeModal(modal);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_child', serviceData)) {
        this.closeModal(modal);
      }
    }
  }

  async submitTaskForm(modal, isEdit = false) {
    const form = modal.querySelector('form');
    const formData = new FormData(form);
    
    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      category: formData.get('category'),
      points: parseInt(formData.get('points')),
      frequency: formData.get('frequency'),
      assigned_child_id: formData.get('assigned_child_id') || null,
      validation_required: formData.get('validation_required') === 'true'
    };

    if (isEdit) {
      serviceData.task_id = formData.get('task_id');
      serviceData.active = formData.get('active') === 'true';
      if (await this.callService('kids_tasks', 'update_task', serviceData)) {
        this.closeModal(modal);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_task', serviceData)) {
        this.closeModal(modal);
      }
    }
  }

  async submitRewardForm(modal, isEdit = false) {
    const form = modal.querySelector('form');
    const formData = new FormData(form);
    
    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      cost: parseInt(formData.get('cost')),
      category: formData.get('category'),
      limited_quantity: formData.get('limited_quantity') ? parseInt(formData.get('limited_quantity')) : null
    };

    if (isEdit) {
      serviceData.reward_id = formData.get('reward_id');
      serviceData.active = formData.get('active') === 'true';
      if (await this.callService('kids_tasks', 'update_reward', serviceData)) {
        this.closeModal(modal);
      }
    } else {
      if (await this.callService('kids_tasks', 'add_reward', serviceData)) {
        this.closeModal(modal);
      }
    }
  }

  async submitClaimForm(modal) {
    const form = modal.querySelector('form');
    const formData = new FormData(form);
    
    const serviceData = {
      reward_id: formData.get('reward_id'),
      child_id: formData.get('child_id')
    };

    if (await this.callService('kids_tasks', 'claim_reward', serviceData)) {
      this.closeModal(modal);
    }
  }

  showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;
    this.shadowRoot.appendChild(modal);
    
    // Auto-fermeture sur clic en dehors uniquement
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    // Empêcher la fermeture sur les clics à l'intérieur du contenu
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    return modal;
  }

  closeModal(modal) {
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
    }
  }

  showChildForm(childId = null) {
    const children = this.getChildren();
    const child = childId ? children.find(c => c.id === childId) : null;
    const isEdit = !!child;

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant'}</h3>
          <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
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
                          onclick="this.closest('.modal').querySelector('input[name=avatar]').value = '${avatar}'; this.closest('.avatar-options').querySelectorAll('.avatar-option').forEach(btn => btn.classList.remove('selected')); this.classList.add('selected');">
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
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
          <button class="btn btn-primary" onclick="this.closest('kids-tasks-card').submitChildForm(this.closest('.modal'), ${isEdit})">${isEdit ? 'Modifier' : 'Ajouter'}</button>
        </div>
      </div>
    `;

    this.showModal(content);
  }

  showTaskForm(taskId = null) {
    const tasks = this.getTasks();
    const children = this.getChildren();
    const task = taskId ? tasks.find(t => t.id === taskId) : null;
    const isEdit = !!task;

    const categories = ['bedroom', 'bathroom', 'kitchen', 'homework', 'outdoor', 'pets', 'other'];
    const frequencies = ['daily', 'weekly', 'monthly', 'once'];

    const content = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${isEdit ? 'Modifier la tâche' : 'Créer une tâche'}</h3>
          <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <form>
            ${isEdit ? `<input type="hidden" name="task_id" value="${task.id}">` : ''}
            <div class="form-group">
              <label class="form-label">Nom de la tâche*</label>
              <input type="text" name="name" class="form-input" required 
                     value="${isEdit ? task.name : ''}"
                     placeholder="Ex: Ranger sa chambre">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="form-textarea" 
                        placeholder="Description détaillée de la tâche...">${isEdit ? task.description || '' : ''}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Catégorie*</label>
                <select name="category" class="form-select" required>
                  ${categories.map(cat => `
                    <option value="${cat}" ${isEdit && task.category === cat ? 'selected' : ''}>${this.getCategoryLabel(cat)}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Points*</label>
                <input type="number" name="points" class="form-input" required 
                       value="${isEdit ? task.points : '10'}" 
                       min="1" max="100" step="1">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Fréquence*</label>
                <select name="frequency" class="form-select" required>
                  ${frequencies.map(freq => `
                    <option value="${freq}" ${isEdit && task.frequency === freq ? 'selected' : ''}>${this.getFrequencyLabel(freq)}</option>
                  `).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Enfant assigné</label>
                <select name="assigned_child_id" class="form-select">
                  <option value="">Non assigné</option>
                  ${children.map(child => `
                    <option value="${child.id}" ${isEdit && task.assigned_child_id === child.id ? 'selected' : ''}>${child.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">
                <input type="checkbox" name="validation_required" value="true" 
                       ${isEdit ? (task.validation_required ? 'checked' : '') : 'checked'}>
                Validation parentale requise
              </label>
            </div>
            ${isEdit ? `
              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" name="active" value="true" 
                         ${task.active !== false ? 'checked' : ''}>
                  Tâche active
                </label>
              </div>
            ` : ''}
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
          <button class="btn btn-primary" onclick="this.closest('kids-tasks-card').submitTaskForm(this.closest('.modal'), ${isEdit})">${isEdit ? 'Modifier' : 'Créer'}</button>
        </div>
      </div>
    `;

    this.showModal(content);
  }

  showRewardForm(rewardId = null) {
    const rewards = this.getRewards();
    const reward = rewardId ? rewards.find(r => r.id === rewardId) : null;
    const isEdit = !!reward;

    const categories = ['fun', 'screen_time', 'outing', 'treat', 'privilege', 'toy', 'other'];

    const content = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${isEdit ? 'Modifier la récompense' : 'Créer une récompense'}</h3>
          <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body">
          <form>
            ${isEdit ? `<input type="hidden" name="reward_id" value="${reward.id}">` : ''}
            <div class="form-group">
              <label class="form-label">Nom de la récompense*</label>
              <input type="text" name="name" class="form-input" required 
                     value="${isEdit ? reward.name : ''}"
                     placeholder="Ex: 30 minutes de tablette">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea name="description" class="form-textarea" 
                        placeholder="Description de la récompense...">${isEdit ? reward.description || '' : ''}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Coût en points*</label>
                <input type="number" name="cost" class="form-input" required 
                       value="${isEdit ? reward.cost : '50'}" 
                       min="1" max="1000" step="1">
              </div>
              <div class="form-group">
                <label class="form-label">Catégorie*</label>
                <select name="category" class="form-select" required>
                  ${categories.map(cat => `
                    <option value="${cat}" ${isEdit && reward.category === cat ? 'selected' : ''}>${this.getCategoryLabel(cat)}</option>
                  `).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Quantité limitée</label>
              <input type="number" name="limited_quantity" class="form-input" 
                     value="${isEdit && reward.limited_quantity ? reward.limited_quantity : ''}"
                     min="1" max="100" step="1"
                     placeholder="Laissez vide pour illimité">
            </div>
            ${isEdit ? `
              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" name="active" value="true" 
                         ${reward.active !== false ? 'checked' : ''}>
                  Récompense active
                </label>
              </div>
            ` : ''}
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
          <button class="btn btn-primary" onclick="this.closest('kids-tasks-card').submitRewardForm(this.closest('.modal'), ${isEdit})">${isEdit ? 'Modifier' : 'Créer'}</button>
        </div>
      </div>
    `;

    this.showModal(content);
  }

  showClaimRewardForm(rewardId) {
    const reward = this.getRewardById(rewardId);
    const children = this.getChildren();

    if (!reward) {
      this.showNotification('Récompense non trouvée', 'error');
      return;
    }

    const content = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Échanger une récompense</h3>
          <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
        </div>
        <div class="modal-body reward-claim">
          <div class="reward-info">
            <h3>🎁 ${reward.name}</h3>
            <p><strong>Coût:</strong> ${reward.cost} points</p>
            <p><strong>Catégorie:</strong> ${this.getCategoryLabel(reward.category)}</p>
            ${reward.description ? `<p>${reward.description}</p>` : ''}
            ${reward.remaining_quantity !== null ? `<p><strong>Stock restant:</strong> ${reward.remaining_quantity}</p>` : ''}
          </div>
          <form>
            <input type="hidden" name="reward_id" value="${reward.id}">
            <div class="form-group">
              <label class="form-label">Sélectionner l'enfant*</label>
              <select name="child_id" class="form-select" required>
                <option value="">Choisir un enfant...</option>
                ${children.map(child => `
                  <option value="${child.id}" ${child.points >= reward.cost ? '' : 'disabled'}>
                    ${child.name} (${child.points} points) ${child.points >= reward.cost ? '' : '- Pas assez de points'}
                  </option>
                `).join('')}
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
          <button class="btn btn-primary" onclick="this.closest('kids-tasks-card').submitClaimForm(this.closest('.modal'))">Échanger</button>
        </div>
      </div>
    `;

    this.showModal(content);
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
      if (entityId.startsWith('sensor.kids_tasks_') && entityId.includes('_points')) {
        const childMatch = entityId.match(/sensor\.kids_tasks_(.+)_points/);
        if (childMatch) {
          const childId = childMatch[1];
          const pointsEntity = entities[entityId];
          const levelEntity = entities[`sensor.kids_tasks_${childId}_level`];
          
          if (pointsEntity && levelEntity) {
            const points = parseInt(pointsEntity.state) || 0;
            const level = parseInt(levelEntity.state) || 1;
            const progress = ((points % 100) / 100) * 100;
            
            children.push({
              id: childId,
              name: pointsEntity.attributes.friendly_name?.replace(' Points', '') || childId,
              points: points,
              level: level,
              progress: progress,
              avatar: pointsEntity.attributes.avatar || '👶'
            });
          }
        }
      }
    });
    
    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  getTasks() {
    const tasks = [];
    const entities = this._hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_task_')) {
        const taskEntity = entities[entityId];
        if (taskEntity && taskEntity.attributes) {
          const attrs = taskEntity.attributes;
          
          tasks.push({
            id: attrs.task_id || entityId.replace('sensor.kids_tasks_task_', ''),
            name: attrs.friendly_name || attrs.task_name || 'Tâche sans nom',
            description: attrs.description || '',
            category: attrs.category || 'other',
            points: parseInt(attrs.points) || 10,
            frequency: attrs.frequency || 'daily',
            status: taskEntity.state || 'todo',
            assigned_child_id: attrs.assigned_child_id || null,
            validation_required: attrs.validation_required !== false,
            active: attrs.active !== false,
            created_at: attrs.created_at || new Date().toISOString(),
            last_completed_at: attrs.last_completed_at || null
          });
        }
      }
    });
    
    return tasks.sort((a, b) => {
      if (a.status === 'pending_validation' && b.status !== 'pending_validation') return -1;
      if (b.status === 'pending_validation' && a.status !== 'pending_validation') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  getRewards() {
    const rewards = [];
    const entities = this._hass.states;
    
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_reward_')) {
        const rewardEntity = entities[entityId];
        if (rewardEntity && rewardEntity.attributes) {
          const attrs = rewardEntity.attributes;
          
          rewards.push({
            id: attrs.reward_id || entityId.replace('sensor.kids_tasks_reward_', ''),
            name: attrs.friendly_name || attrs.reward_name || 'Récompense sans nom',
            description: attrs.description || '',
            category: attrs.category || 'fun',
            cost: parseInt(attrs.cost) || 50,
            active: attrs.active !== false,
            limited_quantity: attrs.limited_quantity || null,
            remaining_quantity: attrs.remaining_quantity || null
          });
        }
      }
    });
    
    return rewards.sort((a, b) => a.name.localeCompare(b.name));
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
      { id: 'dashboard', label: '📊 Tableau', icon: '📊' },
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
        <h2>Tableau de bord</h2>
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
          transition: all 0.3s;
          font-size: 13px;
          text-align: center;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
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
        .task-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        
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
        .claim-btn::before { content = "🎁 "; }
        
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
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 20px;">
        <div style="margin-bottom: 16px;">
          <label>Titre de la carte:</label>
          <input type="text" class="form-control" 
                 placeholder="Gestionnaire de Tâches Enfants"
                 .value="\${this.config.title || ''}"
                 .configValue="title">
        </div>
        <div style="margin-bottom: 16px;">
          <label>
            <input type="checkbox" 
                   .checked="\${this.config.show_navigation !== false}"
                   .configValue="show_navigation"> 
            Afficher la navigation par onglets
          </label>
        </div>
      </div>
    `;
    return element;
  }

  static getStubConfig() {
    return {
      title: "Gestionnaire de Tâches Enfants",
      show_navigation: true
    };
  }
}

customElements.define('kids-tasks-card', KidsTasksCard);

// Déclaration pour HACS
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'kids-tasks-card', 
  name: 'Kids Tasks Card',
  description: 'Interface graphique pour gérer les tâches et récompenses des enfants'
});