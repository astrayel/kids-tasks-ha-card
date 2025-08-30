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
    this.mode = config.mode || 'dashboard'; // 'dashboard' ou 'config'
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
    const target = event.target.closest('[data-action]');
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();

    const action = target.dataset.action;
    const id = target.dataset.id;
    
    // Debug pour les actions cosmétiques (PARENT CARD)
    if (action === 'load-cosmetics-catalog' || action === 'create-cosmetic-rewards' || action === 'activate-cosmetic') {
    }

    // Pour les filtres de tâches, passer le filtre à la place de l'ID
    if (action === 'filter-tasks') {
      this.handleAction(action, target.dataset.filter, event);
    } else {
      this.handleAction(action, id, event);
    }
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
        console.log('DEBUG VALIDATION: Parent validating task', id);
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
                                  `• Points : ${task ? task.points : 0} points\n` +
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
                                    `• Coût : ${reward ? reward.cost : 0} points\n` +
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
        
      case 'load-cosmetics-catalog':
        if (!this._hass) {
          console.error('DEBUG COSMETICS: _hass not available in parent card');
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        try {
          this._hass.callService('kids_tasks', 'load_cosmetics_catalog', {})
            .then(() => {
              this.showNotification('Catalogue cosmétique chargé avec succès ! 📚', 'success');
            })
            .catch(error => {
              console.error('DEBUG COSMETICS: Load catalog service failed (PARENT):', error);
              this.showNotification('Erreur lors du chargement du catalogue : ' + error.message, 'error');
            });
          this.showNotification('Chargement du catalogue cosmétique...', 'info');
        } catch (error) {
          console.error('DEBUG COSMETICS: Load catalog action failed (PARENT):', error);
          this.showNotification('Erreur : ' + error.message, 'error');
        }
        break;
        
      case 'create-cosmetic-rewards':
        if (!this._hass) {
          console.error('DEBUG COSMETICS: _hass not available in parent card');
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
              console.error('DEBUG COSMETICS: Create rewards service failed (PARENT):', error);
              this.showNotification('Erreur lors de la création des récompenses : ' + error.message, 'error');
            });
          this.showNotification('Création des récompenses cosmétiques...', 'info');
        } catch (error) {
          console.error('DEBUG COSMETICS: Create rewards action failed (PARENT):', error);
          this.showNotification('Erreur : ' + error.message, 'error');
        }
        break;
        
      case 'switch-cosmetics-child':
        // Changer l'onglet enfant actif dans la vue cosmétiques
        console.log('DEBUG COSMETICS: Switching cosmetics child (PARENT)');
        this.switchCosmeticsChild(target.dataset.childId);
        break;
        
      case 'activate-cosmetic':
        const targetChildId = target.dataset.childId;
        const cosmeticType = target.dataset.cosmeticType;
        const cosmeticId = target.dataset.cosmeticId;
        console.log('DEBUG COSMETICS: Activating cosmetic (PARENT):', { targetChildId, cosmeticType, cosmeticId });
        
        if (!this._hass) {
          console.error('DEBUG COSMETICS: _hass not available for activate cosmetic');
          this.showNotification('Erreur : Home Assistant non disponible', 'error');
          return;
        }
        
        this._hass.callService('kids_tasks', 'activate_cosmetic', {
          child_id: targetChildId,
          cosmetic_type: cosmeticType,
          cosmetic_id: cosmeticId
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
    
    console.log('DEBUG: attachDragEvents called for view:', this.currentView);
    console.log('DEBUG: Found draggable cards:', draggableCards.length);
    console.log('DEBUG: Found container:', !!container);
    
    // Si pas de cartes draggables, pas besoin de continuer
    if (draggableCards.length === 0) {
      console.log('DEBUG: No draggable cards found, skipping event attachment');
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
      console.log('DEBUG: Events attached to container');
    } else {
      console.warn('DEBUG: No container found for drag events');
    }
  }

  handleDragStart(event) {
    console.log('DEBUG: handleDragStart called');
    const card = event.target.closest('.child-card');
    if (!card) {
      console.warn('DEBUG: No card found in dragstart');
      return;
    }
    
    const childId = card.getAttribute('data-child-id');
    console.log('DEBUG: Dragging child ID:', childId);
    event.dataTransfer.setData('text/plain', childId);
    event.dataTransfer.effectAllowed = 'move';
    
    card.classList.add('dragging');
    this.draggedElement = card;
  }

  handleDragOver(event) {
    console.log('DEBUG: handleDragOver called on:', event.target);
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
      console.log('DEBUG: dragover - no valid card or same element');
      return;
    }
    
    console.log('DEBUG: dragover on card:', card.getAttribute('data-child-id'));
    
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
    console.log('DEBUG: handleDrop called on:', event.target);
    event.preventDefault();
    event.stopPropagation();
    
    const draggedChildId = event.dataTransfer.getData('text/plain');
    const dropCard = event.target.closest('.child-card');
    
    console.log('DEBUG: Drop - dragged ID:', draggedChildId);
    console.log('DEBUG: Drop - target card:', dropCard?.getAttribute('data-child-id'));
    console.log('DEBUG: Drop - target element:', event.target);
    
    if (!dropCard || !draggedChildId) {
      console.warn('DEBUG: Drop failed - missing card or ID');
      this.cleanupDragStyles();
      return;
    }
    
    const targetChildId = dropCard.getAttribute('data-child-id');
    if (draggedChildId === targetChildId) {
      console.log('DEBUG: Drop on same element, ignoring');
      this.cleanupDragStyles();
      return;
    }
    
    // Déterminer la position (avant ou après)
    const rect = dropCard.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const dropBefore = event.clientY < midY;
    
    console.log('DEBUG: Reordering:', draggedChildId, 'to', targetChildId, dropBefore ? 'before' : 'after');
    this.reorderChildren(draggedChildId, targetChildId, dropBefore);
    
    // Nettoyer les classes CSS
    this.cleanupDragStyles();
  }

  handleDragEnd(event) {
    console.log('DEBUG: handleDragEnd called');
    this.cleanupDragStyles();
    this.draggedElement = null;
  }

  handleDragEnter(event) {
    console.log('DEBUG: handleDragEnter called on:', event.target);
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
        
        /* Styles pour la section des jours de la semaine */
        .weekly-days-section, .children-section {
          margin-bottom: 20px;
          padding: 16px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
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
          
          
          
          
          .dialog-actions {
            flex-direction: column-reverse;
            gap: 8px;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
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
          placeholder="Ex: 🧹, mdi:broom, https://example.com/icon.png, data:image/png;base64,iVBOR...">
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

    const dialog = this.showModal(content, isEdit ? 'Modifier la tâche' : 'Créer une tâche v0.15');
    
    // Ajouter les event listeners après affichage du modal
    setTimeout(() => {
      const frequencySelect = dialog.querySelector('[name="frequency"]');
      const weeklyDaysSection = dialog.querySelector('.weekly-days-section');
      const penaltyPointsField = dialog.querySelector('[name="penalty_points"]').parentElement;
      const deadlineTimeField = dialog.querySelector('[name="deadline_time"]').parentElement;
      
      if (frequencySelect && weeklyDaysSection) {
        // Fonction pour afficher/masquer la section des jours et les champs liés
        const toggleFields = (frequency) => {
          const isDaily = frequency === 'daily';
          const isBonus = frequency === 'none';
          
          // Afficher/masquer la section des jours (seulement pour daily)
          weeklyDaysSection.style.display = isDaily ? 'block' : 'none';
          
          // Masquer les points de pénalité et l'heure limite pour les tâches bonus
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
          placeholder="Ex: 🎮, mdi:gamepad, https://example.com/icon.png, data:image/png;base64,iVBOR...">
        </ha-textfield>
        
        <div class="form-row">
          <ha-textfield
            label="Coût en points"
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

  showClaimRewardForm(rewardId) {
    const reward = this.getRewardById(rewardId);
    const children = this.getChildren();

    if (!reward) {
      this.showNotification('Récompense non trouvée', 'error');
      return;
    }

    const content = `
      <div class="reward-info" style="text-align: center; margin-bottom: 24px; padding: 16px; background: var(--secondary-background-color); border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: var(--primary-text-color);">${this.safeGetCategoryIcon(reward, '🎁')} ${reward.name}</h3>
        <p style="margin: 4px 0;"><strong>Coût:</strong> ${reward.cost} points${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''}</p>
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
            <ha-list-item value="${child.id}" ${(child.points < reward.cost || child.coins < reward.coin_cost) ? 'disabled' : ''}>
              ${child.name} (${child.points} points, ${child.coins} coins) ${(child.points >= reward.cost && child.coins >= reward.coin_cost) ? '' : '- Pas assez de monnaie'}
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
    
    console.log('DEBUG getChildren: Nombre total d\'entités:', Object.keys(entities).length);
    
    Object.keys(entities).forEach(entityId => {
      // Chercher UNIQUEMENT les entités avec le nouveau format kidtasks_
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const pointsEntity = entities[entityId];
        console.log('DEBUG getChildren: Entité trouvée:', entityId, 'State:', pointsEntity?.state, 'Attributes:', pointsEntity?.attributes);
        
        if (pointsEntity && pointsEntity.attributes && pointsEntity.state !== 'unavailable') {
          const points = parseInt(pointsEntity.state) || 0;
          const coins = parseInt(pointsEntity.attributes.coins) || 0;
          const level = parseInt(pointsEntity.attributes.level) || 1;
          const progress = ((points % 100) / 100) * 100;
          
          // Extraire l'ID et le nom depuis le nouveau format kidtasks_
          const childId = pointsEntity.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', '');
          const childName = pointsEntity.attributes.name || pointsEntity.attributes.friendly_name?.replace(' Points', '') || childId;
          
          console.log('DEBUG getChildren: Enfant ajouté:', {
            entityId,
            childId,
            childName,
            points,
            level,
            state: pointsEntity.state,
            attributes: pointsEntity.attributes
          });
          
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
    
    console.log('DEBUG getChildren: Enfants triés:', sortedChildren.map(c => `${c.name} (${c.id})`));
    
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
          
          console.log('DEBUG FRONTEND: Task', attrs.task_name, 'has child_statuses:', attrs.child_statuses);
          
          if (attrs.child_statuses) {
            // Nouveau système avec statuts individuels
            for (const [childId, childStatus] of Object.entries(attrs.child_statuses)) {
              childStatusesSummary[childId] = childStatus.status;
              console.log('DEBUG FRONTEND: Child', childStatus.child_name, 'has status:', childStatus.status);
              if (childStatus.status === 'pending_validation') {
                pendingValidationChildNames.push(childStatus.child_name || 'Enfant inconnu');
                console.log('DEBUG FRONTEND: Added to pending list:', childStatus.child_name);
              }
            }
          }
          
          // Déterminer le nom des enfants en attente pour l'affichage
          let assignedChildName = attrs.assigned_child_name || 'Non assigné';
          
          console.log('DEBUG FRONTEND: Original assigned_child_name:', assignedChildName);
          console.log('DEBUG FRONTEND: pendingValidationChildNames:', pendingValidationChildNames);
          console.log('DEBUG FRONTEND: Task status:', taskEntity.state);
          
          // Pour les tâches en attente de validation, afficher SEULEMENT les enfants concernés
          if (taskEntity.state === 'pending_validation') {
            if (pendingValidationChildNames.length > 0) {
              assignedChildName = pendingValidationChildNames.join(', ');
              console.log('DEBUG FRONTEND: Using pending names for validation:', assignedChildName);
            } else {
              // Si aucun enfant n'est en pending_validation, ne pas afficher la tâche
              console.log('DEBUG FRONTEND: No pending validation children, skipping task');
              // Ne pas ajouter cette tâche à la liste
              assignedChildName = null;
            }
          }
          
          console.log('DEBUG FRONTEND: Final assignedChildName:', assignedChildName);
          
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

  getAssignedChildrenNames(task) {
    const children = this.getChildren();
    const assignedIds = task.assigned_child_ids || (task.assigned_child_id ? [task.assigned_child_id] : []);
    
    return assignedIds.map(assignedChildId => {
      const child = children.find(c => c.id === assignedChildId);
      return child ? child.name : 'Enfant inconnu';
    }).filter(name => name);
  }
  
  formatAssignedChildren(task) {
    const childrenNames = this.getAssignedChildrenNames(task);
    if (childrenNames.length === 0) return 'Non assigné';
    if (childrenNames.length === 1) return childrenNames[0];
    return childrenNames.join(', ');
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
      <div class="section">
        <h2>${this.title}</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-header">
                <div class="stat-icon">👶</div>
                <div class="stat-number">${stats.totalChildren}</div>
              </div>
              <div class="stat-label">Enfant${stats.totalChildren > 1 ? 's' : ''}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-header">
                <div class="stat-icon">📝</div>
                <div class="stat-number">${stats.totalTasks}</div>
              </div>
              <div class="stat-label">Tâches créées</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <div class="stat-header">
                <div class="stat-icon">✅</div>
                <div class="stat-number">${stats.completedToday}</div>
              </div>
              <div class="stat-label">Terminées aujourd'hui</div>
            </div>
          </div>
          <div class="stat-card clickable" data-action="switch-view" data-id="validation" title="Voir les tâches à valider">
            <div class="stat-info">
              <div class="stat-header">
                <div class="stat-icon">⏳</div>
                <div class="stat-number">${stats.pendingValidation}</div>
              </div>
              <div class="stat-label">À valider</div>
            </div>
          </div>
        </div>
      </div>

      ${children.length > 0 ? `
        <div class="section children-grid">
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
          <div class="grid grid-2 children-grid">
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
    const allTasks = this.getTasks();
    // Filtrer les tâches pour exclure les tâches bonus (frequency='none')
    const allRegularTasks = allTasks.filter(task => task.frequency !== 'none');
    
    // Appliquer le filtre sélectionné
    const currentFilter = this.taskFilter || 'active';
    const tasks = this.filterTasks(allRegularTasks, currentFilter);
    
    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <button class="btn btn-primary add-btn" data-action="add-task">Ajouter</button>
        </h2>
        
        <!-- Filtres pour les tâches -->
        <div class="task-filters">
          <button class="filter-btn ${currentFilter === 'active' ? 'active' : ''}" data-action="filter-tasks" data-filter="active">Actives</button>
          <button class="filter-btn ${currentFilter === 'inactive' ? 'active' : ''}" data-action="filter-tasks" data-filter="inactive">Désactivées</button>
          <button class="filter-btn ${currentFilter === 'out-of-period' ? 'active' : ''}" data-action="filter-tasks" data-filter="out-of-period">Hors période</button>
          <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-action="filter-tasks" data-filter="all">Toutes</button>
        </div>
        
        ${tasks.length > 0 ? `
          <div class="task-list-compact">
            ${tasks.map(task => this.renderTaskItemCompact(task, children)).join('')}
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
        return tasks.filter(task => task.active !== false && this.isTaskInPeriod(task));
      case 'inactive':
        return tasks.filter(task => task.active === false);
      case 'out-of-period':
        return tasks.filter(task => task.active !== false && !this.isTaskInPeriod(task));
      case 'all':
        return tasks;
      default:
        return tasks.filter(task => task.active !== false && this.isTaskInPeriod(task));
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
      'all': ''
    };
    return labels[filter] || '';
  }

  renderTaskItemCompact(task, children) {
    const childName = this.formatAssignedChildren(task);
    const taskIcon = this.safeGetCategoryIcon(task, '📋');
    
    return `
      <div class="task-item-compact ${task.status} ${task.active === false ? 'inactive' : ''} ${!this.isTaskInPeriod(task) ? 'out-of-period' : ''}">
        <div class="task-icon-compact">${taskIcon}</div>
        <div class="task-main-compact">
          <div class="task-name-compact">${task.name}</div>
          <div class="task-meta-compact">
            <span class="assigned-child">${childName}</span>
            <span class="task-frequency">${this.getFrequencyLabel(task.frequency)}</span>
            <span class="task-category">${this.getCategoryLabel(task.category)}</span>
          </div>
        </div>
        <div class="task-rewards-compact">
          ${task.points > 0 ? `<span class="reward-points">+${task.points}p</span>` : ''}
          ${task.coins > 0 ? `<span class="reward-coins">+${task.coins}c</span>` : ''}
          ${task.penalty_points > 0 ? `<span class="penalty-points">-${task.penalty_points}p</span>` : ''}
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

  renderChildCard(child, showActions = false) {
    // Protection contre les enfants undefined/null
    if (!child) {
      return '<div class="child-card"><div class="error">Erreur: enfant non trouvé</div></div>';
    }
    
    try {
      const name = child.name || 'Enfant sans nom';
      const points = child.points || 0;
      const coins = child.coins || 0;
      const level = child.level || 1;
      
      // Calculer les tâches et stats de manière sûre
      let completedToday = 0;
      let todayTasks = 0;
      let stats = null;
      
      try {
        const tasks = this.getTasks();
        const childTasks = tasks.filter(task => 
          task.assigned_child_ids && task.assigned_child_ids.includes(child.id)
        );
        completedToday = this.getChildCompletedToday(child.id, tasks).length;
        todayTasks = this.getChildTasksToday(child.id, tasks).length;
        
        // Calculer les stats pour les jauges (mode parent)
        if (showActions) {
          stats = this.calculateChildStats(child, childTasks);
        }
      } catch (taskError) {
        console.warn('Erreur lors du calcul des tâches:', taskError);
      }
      
      // Utiliser getEffectiveAvatar
      const avatar = this.getEffectiveAvatar(child, 'large');
      
      return `
        <div class="child-card ${showActions ? 'management-mode' : ''}" ${showActions ? `draggable="true" data-child-id="${child.id || 'unknown'}"` : ''}>
          ${showActions ? `
            <div class="drag-handle" title="Glisser pour réorganiser">⋮⋮</div>
            <button class="btn-close" data-action="remove-child" data-id="${child.id || 'unknown'}" title="Supprimer">×</button>
          ` : ''}
          <div class="child-avatar">${avatar}</div>
          <div class="child-info">
            <div class='child-wrapper'><div class="child-name">${name}</div><div class="level-badge">Niveau ${level}</div></div>
            ${showActions && stats ? `
              <div class="child-gauges-compact">
                <div class="gauge-compact">
                  <div class="gauge-label-compact">Points totaux</div>
                  <div class="gauge-text-compact">${points}</div>
                  <div class="gauge-bar-compact">
                    <div class="gauge-fill-compact total-points" style="width: ${Math.min((points / 500) * 100, 100)}%"></div>
                  </div>
                </div>
                <div class="gauge-compact">
                  <div class="gauge-label-compact">Niveau ${level}</div>
                  <div class="gauge-text-compact">${stats.pointsInCurrentLevel}/${stats.pointsToNextLevel}</div>
                  <div class="gauge-bar-compact">
                    <div class="gauge-fill-compact level-progress" style="width: ${stats.pointsInCurrentLevel}%"></div>
                  </div>
                </div>
                <div class="gauge-compact">
                  <div class="gauge-label-compact">Tâches</div>
                  <div class="gauge-text-compact">${completedToday}/${todayTasks}</div>
                  <div class="gauge-bar-compact">
                    <div class="gauge-fill-compact tasks-progress" style="width: ${todayTasks > 0 ? (completedToday / todayTasks) * 100 : 0}%"></div>
                  </div>
                </div>
                <div class="gauge-compact">
                  <div class="gauge-label-compact">Coins</div>
                  <div class="gauge-text-compact">${coins}</div>
                  <div class="gauge-bar-compact">
                    <div class="gauge-fill-compact coins-progress" style="width: ${Math.min(coins, 100)}%"></div>
                  </div>
                </div>
              </div>
            ` : `
              <div class="child-stats">
                ${points} points • ${coins} coins • Niveau ${level}<br>
                ${completedToday}/${todayTasks} tâches aujourd'hui
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${child.progress || 0}%"></div>
                </div>
              </div>
            `}
          </div>
          ${showActions ? `
            <div class="task-actions">
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

  renderTaskItem(task, children, showValidation = false, showManagement = false) {
    const childName = this.formatAssignedChildren(task);
    
    const taskIcon = this.safeGetCategoryIcon(task, '📋');
    
    return `
      <div class="task-item ${task.status}">
        <div class="task-top-row">
          <div class="task-title">${task.name}</div>
          <div class="task-status status-${task.status}">${this.getStatusLabel(task.status)}</div>
          ${showManagement ? `
            <button class="btn-close" data-action="remove-task" data-id="${task.id}" title="Supprimer">×</button>
          ` : ''}
        </div>
        <div class="task-main-row">
          <div class="task-icon">${taskIcon}</div>
          <div class="task-content">
            <div class="task-meta">
              ${childName}
              ${task.points > 0 ? `<br><span style="color: #4CAF50; font-weight: bold;">+${task.points} points</span>` : ''}
              ${task.penalty_points > 0 ? `<br><span style="color: #f44336; font-weight: bold;">-${task.penalty_points} points</span>` : ''}
              ${task.coins > 0 ? `<br><span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span>` : ''}
              ${task.description ? `<br>${task.description}` : ''}
              <br>${this.getCategoryLabel(task.category)} • ${this.getFrequencyLabel(task.frequency)}
              ${task.deadline_time ? `<br>🕐 Deadline: ${task.deadline_time}` : ''}
              ${task.deadline_passed && task.status === 'todo' ? `<br><span style="color: red;">⏰ Heure limite dépassée</span>` : ''}
            </div>
          </div>
          <div class="task-actions">
            ${showValidation && task.status === 'pending_validation' ? `
              <button class="btn btn-success btn-icon validate-btn" data-action="validate-task" data-id="${task.id}">Valider</button>
              <button class="btn btn-danger btn-icon reject-btn" data-action="reject-task" data-id="${task.id}">Rejeter</button>
            ` : showManagement ? `
              <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-task" data-id="${task.id}">Modifier</button>
            ` : `
              <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-task" data-id="${task.id}">Modifier</button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  renderRewardCard(reward, showActions = false) {
    return `
      <div class="reward-card">
        ${showActions ? `
          <button class="btn-close" data-action="remove-reward" data-id="${reward.id}" title="Supprimer">×</button>
        ` : ''}
        <div class="reward-icon">${this.safeGetCategoryIcon(reward, '🎁')}</div>
        <div class="reward-info">
          <div class="reward-name">${reward.name}</div>
          <div class="reward-stats">
            ${reward.cost} points${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''} • ${this.getCategoryLabel(reward.category)}
            ${reward.remaining_quantity !== null ? `<br>${reward.remaining_quantity} restant(s)` : ''}
            ${reward.description ? `<br>${reward.description}` : ''}
          </div>
        </div>
        <div class="task-actions">
          ${showActions ? `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-reward" data-id="${reward.id}">Modifier</button>
          ` : `
            <button class="btn btn-secondary btn-icon edit-btn" data-action="edit-reward" data-id="${reward.id}">Modifier</button>
          `}
        </div>
      </div>
    `;
  }

  renderRewardItemCompact(reward) {
    const rewardIcon = this.safeGetCategoryIcon(reward, '🎁');
    
    return `
      <div class="reward-item-compact">
        <div class="reward-icon-compact">${rewardIcon}</div>
        <div class="reward-main-compact">
          <div class="reward-name-compact">${reward.name}</div>
          <div class="reward-meta-compact">
            ${reward.cost} points${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''} • ${this.getCategoryLabel(reward.category)}
            ${reward.remaining_quantity !== null ? ` • ${reward.remaining_quantity} restant(s)` : ''}
          </div>
          ${reward.description ? `<div class="reward-description-compact">${reward.description}</div>` : ''}
        </div>
        <div class="reward-actions-compact">
          <button class="btn-icon-compact edit-btn" data-action="edit-reward" data-id="${reward.id}" title="Modifier">✎</button>
          <button class="btn-icon-compact delete-btn" data-action="remove-reward" data-id="${reward.id}" title="Supprimer">🗑</button>
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
            <p style="font-size: 0.9em; color: var(--secondary-text-color);">Les tâches complétées par les enfants apparaîtront ici.</p>
          </div>
        `}
      </div>
    `;
  }

  renderValidationTask(task, children) {
    // Pour les validations, afficher l'enfant qui a COMPLÉTÉ la tâche, pas tous les assignés
    let childName = 'Enfant inconnu';
    if (task.completed_by) {
      const child = children.find(c => c.id === task.completed_by);
      childName = child ? child.name : `Enfant ${task.completed_by}`;
    } else {
      // Fallback sur les enfants assignés si completed_by n'est pas disponible
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
      <div class="validation-task-item">
        <div class="validation-task-icon">${taskIcon}</div>
        <div class="validation-task-content">
          <div class="validation-task-header">
            <div class="validation-task-title">${task.name}</div>
            <div class="validation-task-age">${ageText}</div>
          </div>
          <div class="validation-task-meta">
            <span class="validation-child">${childName}</span>
            <span class="validation-rewards">
              ${task.points !== 0 ? `${task.points > 0 ? '+' : ''}${task.points}p` : ''}
              ${task.coins !== 0 ? ` ${task.coins > 0 ? '+' : ''}${task.coins}c` : ''}
              ${task.penalty_points ? ` ${task.penalty_points}p` : ''}
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
    const cosmeticsChildren = this.getChildren();
    const allRewards = this.getRewards();
    
    // Filtrer par category: cosmetic et par nom
    const cosmeticsRewards = allRewards.filter(r => {
      // Utiliser category au lieu de reward_type
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
      
      if (hasCosmetic || hasCosmetic2) {
        console.log('DEBUG: Found cosmetic:', r.name, 'category:', r.category, 'reward_type:', r.reward_type, 'cosmetic_data:', r.cosmetic_data);
      }
      
      return hasCosmetic || hasCosmetic2;
    });
    console.log('DEBUG PARENT COSMETICS: Cosmetic rewards found:', cosmeticsRewards.length);
    
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
        
        ${cosmeticsChildren.length > 0 ? `
          <div class="cosmetics-children-tabs">
            ${cosmeticsChildren.map((cosmeticChild, childIndex) => `
              <button class="cosmetics-child-tab ${childIndex === 0 ? 'active' : ''}" 
                      data-action="switch-cosmetics-child" data-child-id="${cosmeticChild.id}">
                <span class="child-avatar">${cosmeticChild.avatar || '👶'}</span>
                <span class="child-name">${cosmeticChild.name}</span>
                <div class="child-currency">
                  <span class="points">${cosmeticChild.points}p</span>
                  <span class="coins">${cosmeticChild.coins}c</span>
                </div>
              </button>
            `).join('')}
          </div>
          
          <div class="cosmetics-content">
            ${cosmeticsChildren.map((cosmeticChild, childIndex) => `
              <div class="cosmetics-child-panel ${childIndex === 0 ? 'active' : ''}" data-child-id="${cosmeticChild.id}">
                ${this.renderCosmeticsForChild(cosmeticChild, cosmeticsRewards)}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">👶</div>
            <p>Aucun enfant configuré</p>
            <p style="font-size: 0.9em; color: var(--secondary-text-color);">Ajoutez des enfants pour gérer leurs cosmétiques.</p>
          </div>
        `}
      </div>
    `;
  }

  renderCosmeticsForChild(cosmeticChild, cosmeticRewardsList) {
    const cosmeticsCategories = {
      'avatar': { name: 'Avatars', icon: '👤', description: 'Personnalisez l\'apparence de votre enfant' },
      'background': { name: 'Arrière-plans', icon: '🖼️', description: 'Changez le fond de la carte de l\'enfant' },
      'outfit': { name: 'Accessoires', icon: '👕', description: 'Ajoutez des accessoires à l\'avatar' },
      'theme': { name: 'Thèmes', icon: '🎨', description: 'Modifiez l\'apparence générale de l\'interface' }
    };
    
    const activeCosmetics = cosmeticChild.active_cosmetics || {};
    const ownedCosmetics = cosmeticChild.cosmetic_collection || {};
    
    return `
      <div class="cosmetics-categories">
        ${Object.entries(cosmeticsCategories).map(([categoryKey, categoryData]) => {
          const categoryRewardsList = cosmeticRewardsList.filter(rewardItem => 
            rewardItem.cosmetic_data && rewardItem.cosmetic_data.type === categoryKey
          );
          const activeCosmeticItem = activeCosmetics[categoryKey];
          const ownedCosmeticItems = ownedCosmetics[categoryKey] || [];
          
          return `
            <div class="cosmetic-category">
              <div class="cosmetic-category-header">
                <h3>
                  <span class="category-icon">${categoryData.icon}</span>
                  ${categoryData.name}
                  ${activeCosmeticItem ? `<span class="active-indicator">Actif: ${activeCosmeticItem}</span>` : ''}
                </h3>
                <p class="category-description">${categoryData.description}</p>
              </div>
              
              <div class="cosmetic-items-grid">
                <!-- Élément par défaut -->
                <div class="cosmetic-item default-item ${!activeCosmeticItem ? 'active' : ''}">
                  <div class="cosmetic-preview">
                    <div class="default-preview">${categoryData.icon}</div>
                  </div>
                  <div class="cosmetic-info">
                    <div class="cosmetic-name">Par défaut</div>
                    <div class="cosmetic-status">Gratuit</div>
                  </div>
                  <button class="btn btn-sm ${!activeCosmeticItem ? 'btn-success' : 'btn-outline'}" 
                          data-action="activate-cosmetic" 
                          data-child-id="${cosmeticChild.id}" 
                          data-cosmetic-type="${categoryKey}" 
                          data-cosmetic-id="default_${categoryKey}">
                    ${!activeCosmeticItem ? '✅ Actif' : 'Activer'}
                  </button>
                </div>
                
                ${categoryRewardsList.map(rewardItem => {
                  const isOwnedByChild = ownedCosmeticItems.includes(rewardItem.cosmetic_data.cosmetic_id);
                  const isActiveCosmeticForChild = activeCosmeticItem === rewardItem.cosmetic_data.cosmetic_id;
                  const childCanAfford = cosmeticChild.points >= rewardItem.cost && cosmeticChild.coins >= rewardItem.coin_cost;
                  
                  return `
                    <div class="cosmetic-item ${isOwnedByChild ? 'owned' : ''} ${isActiveCosmeticForChild ? 'active' : ''}">
                      <div class="cosmetic-preview">
                        ${this.renderCosmeticItemPreview(rewardItem.cosmetic_data, rewardItem.name)}
                      </div>
                      <div class="cosmetic-info">
                        <div class="cosmetic-name">${rewardItem.name}</div>
                        <div class="cosmetic-rarity rarity-${rewardItem.cosmetic_data.rarity || 'common'}">
                          ${this.getCosmeticRarityLabel(rewardItem.cosmetic_data.rarity || 'common')}
                        </div>
                        ${rewardItem.description ? `<div class="cosmetic-description">${rewardItem.description}</div>` : ''}
                      </div>
                      <div class="cosmetic-actions">
                        ${isOwnedByChild ? `
                          <button class="btn btn-sm ${isActiveCosmeticForChild ? 'btn-success' : 'btn-outline'}" 
                                  data-action="activate-cosmetic" 
                                  data-child-id="${cosmeticChild.id}" 
                                  data-cosmetic-type="${categoryKey}" 
                                  data-cosmetic-id="${rewardItem.cosmetic_data.cosmetic_id}">
                            ${isActiveCosmeticForChild ? '✅ Actif' : 'Activer'}
                          </button>
                        ` : `
                          <div class="cosmetic-cost">
                            ${rewardItem.cost > 0 ? `<span class="cost-points">${rewardItem.cost}p</span>` : ''}
                            ${rewardItem.coin_cost > 0 ? `<span class="cost-coins">${rewardItem.coin_cost}c</span>` : ''}
                          </div>
                          <button class="btn btn-sm ${childCanAfford ? 'btn-primary' : 'btn-disabled'}" 
                                  data-action="claim-reward" 
                                  data-reward-id="${rewardItem.id}" 
                                  data-child-id="${cosmeticChild.id}"
                                  ${!childCanAfford ? 'disabled' : ''}>
                            ${childCanAfford ? '💰 Acheter' : '❌ Pas assez'}
                          </button>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
                
                ${categoryRewardsList.length === 0 ? `
                  <div class="cosmetic-item empty-category">
                    <div class="empty-category-message">
                      <p>Aucun cosmétique ${categoryData.name.toLowerCase()} disponible</p>
                      <p class="hint">Utilisez "Créer les récompenses" pour générer les cosmétiques depuis le catalogue.</p>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
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
        if (catalogItemData.emoji) {
          return `<div class="avatar-preview">${catalogItemData.emoji}</div>`;
        }
        if (catalogItemData.pixel_art) {
          return `<img class="pixel-art-preview" src="${catalogItemData.pixel_art}" alt="${catalogItemData.name}" />`;
        }
        return `<div class="avatar-preview">👤</div>`;
        
      case 'background':
        if (catalogItemData.css_gradient) {
          return `<div class="background-preview" style="background: ${catalogItemData.css_gradient}; width: 48px; height: 48px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1);"></div>`;
        }
        return `<div class="background-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 48px; height: 48px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1);"></div>`;
        
      case 'outfit':
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
        return `<div class="theme-preview" style="width: 48px; height: 48px; border-radius: 8px; background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themeSecondaryColor} 100%); border: 1px solid rgba(0,0,0,0.1);"></div>`;
        
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
  getStyles() {
    const tabColor = this.config?.tab_color || 'var(--primary-color, #3f51b5)';
    const headerColor = this.config?.header_color || 'var(--primary-color, #1976d2)';
    const dashboardPrimary = this.config?.dashboard_primary_color || 'var(--primary-color, #3f51b5)';
    const dashboardSecondary = this.config?.dashboard_secondary_color || 'var(--accent-color, #ff4081)';
    const childGradientStart = this.config?.child_gradient_start || '#4CAF50';
    const childGradientEnd = this.config?.child_gradient_end || '#8BC34A';
    const childBorderColor = this.config?.child_border_color || '#2E7D32';
    const childTextColor = this.config?.child_text_color || '#ffffff';
    const buttonHoverColor = this.config?.button_hover_color || '#1565C0';
    const progressBarColor = this.config?.progress_bar_color || '#4CAF50';
    const pointsBadgeColor = this.config?.points_badge_color || '#FF9800';
    const iconColor = this.config?.icon_color || '#757575';
    
    return `
      <style>
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
        }
        .stat-label { 
          color: var(--secondary-text-color, #757575); 
          font-size: 0.9em;
          line-height: 1.3;
          word-wrap: break-word;
        }
        
        .child-card {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 8px;
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid var(--custom-dashboard-secondary);
          transition: all 0.3s;
          position: relative;
          min-height: 160px;
          height: 160px;
        }
        
        .reward-card {
          border-left-color: var(--custom-dashboard-primary, #6b73ff);
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          padding: 8px;
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
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
          border-radius: 8px;
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
          border-radius: 8px;
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
          top: -2px;
          left: 2px;
          color: var(--secondary-text-color, #757575);
          font-size: 32px;
          line-height: 32px;
          cursor: grab;
          user-select: none;
          z-index: 10;
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
          border-radius: 50% !important;
          object-fit: cover !important;
          border: 2px solid rgba(255,255,255,0.2);
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
          border-radius: 50% !important;
          object-fit: cover !important;
          border: 2px solid rgba(255,255,255,0.2);
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

        .task-icon {
          font-size: 2em;
          margin-right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2.5em;
          min-height: 2.5em;
          flex-shrink: 0;
        }
        
        .task-icon img {
          width: 2.5em !important;
          height: 2.5em !important;
          border-radius: 8px !important;
          object-fit: cover !important;
          border: 2px solid rgba(255,255,255,0.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }
        
        .task-icon ha-icon {
          width: 2.5em !important;
          height: 2.5em !important;
          color: var(--primary-color, #3f51b5);
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
        
        .level-badge {
          background: var(--custom-points-badge-color);
          color: white;
          padding: 4px 6px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 0.5em;
          margin: 0px 0px 0px 4px;
          height: 20px
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
          height: 4px;
          background: var(--divider-color, #e0e0e0);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .gauge-fill-compact {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
        }
        
        .gauge-fill-compact.total-points {
          background: linear-gradient(90deg, #ffd700, #ffed4a);
        }
        
        .gauge-fill-compact.level-progress {
          background: linear-gradient(90deg, #4facfe, #00f2fe);
        }
        
        .gauge-fill-compact.tasks-progress {
          background: linear-gradient(90deg, #43e97b, #38f9d7);
        }
        
        .gauge-fill-compact.coins-progress {
          background: linear-gradient(90deg, #9C27B0, #E1BEE7);
        }
        
        .task-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          margin: 8px 0;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid #ddd;
          transition: all 0.3s;
          position: relative;
        }
        
        .task-item:hover { box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
        .task-item.pending_validation { border-left-color: #ff5722; background: #fff3e0; }
        .task-item.validated { border-left-color: #4caf50; }
        
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
        
        /* Styles pour les filtres de tâches */
        .task-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 6px 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          background: var(--card-background-color, white);
          border-radius: 16px;
          font-size: 0.8em;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--secondary-text-color, #757575);
        }
        
        .filter-btn:hover {
          background: var(--primary-color, #3f51b5);
          color: white;
          border-color: var(--primary-color, #3f51b5);
        }
        
        .filter-btn.active {
          background: var(--primary-color, #3f51b5);
          color: white;
          border-color: var(--primary-color, #3f51b5);
          font-weight: 600;
        }
        
        /* Styles pour l'affichage compact des tâches */
        .task-list-compact {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .task-item-compact {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 6px;
          border-left: 3px solid #ddd;
          transition: all 0.3s ease;
          min-height: 50px;
        }
        
        .task-item-compact:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        
        .task-item-compact.inactive {
          opacity: 0.6;
          border-left-color: #ccc;
        }
        
        .task-item-compact.out-of-period {
          border-left-color: #ff9800;
          background: #fff8e1;
        }
        
        .task-item-compact.validated {
          border-left-color: #4caf50;
        }
        
        .task-item-compact.pending_validation {
          border-left-color: #ff5722;
          background: #fff3e0;
        }
        
        .task-icon-compact {
          font-size: 1.2em;
          margin-right: 12px;
          flex-shrink: 0;
        }
        
        .task-main-compact {
          flex: 1;
          min-width: 0;
        }
        
        .task-name-compact {
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
          border-radius: 8px;
        }
        
        .task-rewards-compact {
          display: flex;
          gap: 4px;
          margin: 0 8px;
          flex-shrink: 0;
        }
        
        .reward-points {
          background: #4CAF50;
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.75em;
          font-weight: bold;
        }
        
        .reward-coins {
          background: #9C27B0;
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.75em;
          font-weight: bold;
        }
        
        .penalty-points {
          background: #f44336;
          color: white;
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.75em;
          font-weight: bold;
        }
        
        .task-actions-compact {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        
        .btn-sm {
          padding: 4px 8px;
          font-size: 0.75em;
          border-radius: 4px;
        }
        
        /* Styles pour les récompenses compactes */
        .reward-list-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .reward-item-compact {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 6px;
          border-left: 3px solid #4CAF50;
          transition: all 0.3s ease;
          min-height: 50px;
        }
        
        .reward-item-compact:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        
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
        
        .btn-icon-compact {
          background: transparent;
          border: none;
          padding: 4px;
          font-size: 0.85em;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease;
          color: var(--secondary-text-color, #757575);
        }
        
        .btn-icon-compact:hover {
          background: var(--primary-color, #1976d2);
          color: white;
        }
        
        .btn-icon-compact.delete-btn:hover {
          background: #f44336;
        }
        
        /* Styles pour l'onglet Validation */
        .validation-tasks-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .validation-task-item {
          display: flex;
          align-items: center;
          padding: 12px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          border-left: 4px solid #ff5722;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .validation-task-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .validation-task-icon {
          font-size: 1.5em;
          margin-right: 16px;
          flex-shrink: 0;
        }
        
        .validation-task-content {
          flex: 1;
          min-width: 0;
        }
        
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
        
        .validation-child {
          background: #2196f3;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        
        .validation-rewards {
          background: #4caf50;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-weight: 600;
        }
        
        .validation-category {
          background: rgba(0,0,0,0.1);
          padding: 2px 8px;
          border-radius: 12px;
          color: var(--secondary-text-color, #757575);
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
          padding: 8px 16px;
          font-size: 0.85em;
          font-weight: 600;
          border-radius: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-validation:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        /* Améliorations pour mobile - validations */
        @media (max-width: 768px) {
          .validation-task-item {
            flex-direction: column;
            align-items: stretch;
            padding: 16px;
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
            padding: 12px 16px;
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
          padding: 2px 8px;
          border-radius: 12px;
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
          position: absolute;
          display: flex;
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
          background-color: #4caf50;
          color: white;
          border: 1px solid #4caf50;
          order: 2;
        }
        
        .task-actions .edit-btn:hover {
          background-color: #45a049;
        }
        
        .task-actions .delete-btn {
          background-color: #f44336;
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
          background: #f44336;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
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
          padding: 16px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
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
          padding: 4px 8px;
          border-radius: 16px;
          font-size: 0.75em;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0 4px;
          white-space: nowrap;
          display: inline-block;
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
        
        .btn:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
          background: var(--custom-button-hover-color);
        }
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
        
        /* Styles pour les actions des dialogues */
        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color, #e0e0e0);
        }
        
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
        
        .grid { display: grid; gap: 24px; }
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
          .child-card, .reward-card {
            padding: 14px;
            padding-bottom: 50px;
          }
          .child-card .task-actions, .reward-card .task-actions {
            right: 8px;
            bottom: 8px;
          }
        }
        
        /* Téléphone */
        @media (max-width: 768px) {
          .content { padding: 16px; }
          .nav-tab { font-size: 11px; padding: 8px 4px; }
          .form-row { flex-direction: column; }
          .grid-2, .grid-3 { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
          .modal-content { width: 95%; margin: 0 auto; }
          .modal-body { padding: 16px; }
          
          .task-actions {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: end;
            min-width: auto;
            right: 8px;
            bottom: 8px;
          }
          
          .task-actions .btn {
            min-width: 70px;
            padding: 8px 12px;
          }
          
          /* Styles enfants - disposition horizontale forcée */
          .child-card, .reward-card {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            min-height: 120px;
            height: auto;
            padding: 6px;
          }
          
          .child-avatar {
            font-size: 2em !important;
            margin-right: 12px !important;
            flex-shrink: 0;
          }
          
          .task-icon {
            font-size: 1.5em !important;
            margin-right: 12px !important;
            min-width: 2em !important;
            min-height: 2em !important;
          }
          
          .task-icon img {
            width: 2em !important;
            height: 2em !important;
          }
          
          .task-icon ha-icon {
            width: 2em !important;
            height: 2em !important;
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

  safeGetCategoryIcon(categoryOrItem, fallback = '📋') {
    try {
      if (this.getCategoryIcon && typeof this.getCategoryIcon === 'function') {
        return this.getCategoryIcon(categoryOrItem);
      }
    } catch (error) {
      console.warn('Error in getCategoryIcon:', error);
    }
    return fallback;
  }

  renderIcon(iconData) {
    if (!iconData) return '📋';
    
    // Si c'est une URL (commence par http:// ou https://)
    if (typeof iconData === 'string' && (iconData.startsWith('http://') || iconData.startsWith('https://'))) {
      return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est une image inline base64 (commence par data:image/)
    if (typeof iconData === 'string' && iconData.startsWith('data:image/')) {
      return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est du base64 sans préfixe (pour compatibilité)
    if (typeof iconData === 'string' && this.isBase64 && this.isBase64(iconData)) {
      return `<img src="data:image/png;base64,${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est une icône MDI (commence par mdi:)
    if (typeof iconData === 'string' && iconData.startsWith('mdi:')) {
      return `<ha-icon icon="${iconData}" style="width: 1.2em; height: 1.2em;"></ha-icon>`;
    }
    
    // Sinon, traiter comme un emoji ou texte simple
    return iconData.toString();
  }

  isBase64(str) {
    if (!str || typeof str !== 'string') return false;
    // Vérifier que c'est une chaîne base64 valide (caractères base64 + longueur raisonnable pour une image)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return str.length > 100 && str.length % 4 === 0 && base64Regex.test(str);
  }

  getCategoryIcon(categoryOrItem) {
    // Si c'est un objet (task/reward), vérifier d'abord l'icône personnalisée
    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }
    
    const category = categoryOrItem;
    
    // Récupérer les icônes depuis l'intégration
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
    
    // Fallback par défaut
    return this.renderIcon('📋');
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
    // Force re-render pour appliquer les nouveaux styles
    this.render();
  }

  render() {
    
    this.shadowRoot.innerHTML = `
      <style>
        .config-container {
          padding: 16px;
          max-width: 600px;
        }
        .config-section {
          margin-bottom: 24px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
          padding: 16px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--primary-text-color, #000);
          border-bottom: 2px solid var(--primary-color, #1976d2);
          padding-bottom: 4px;
        }
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
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          margin-top: 8px;
          font-weight: 500;
        }
      </style>
      <div class="config-container">
        <!-- Section Configuration Générale -->
        <div class="config-section">
          <div class="section-title">🔧 Configuration Générale</div>
          
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
              <label>Couleur badges points</label>
              <input
                type="color"
                id="points-badge-input"
                value="${this.config?.points_badge_color || '#FF9800'}"
                style="width: 100%; height: 40px; border: none; border-radius: 4px; cursor: pointer;">
              <div class="help-text">Couleur des badges de points</div>
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
    
    if (headerColorInput) {
      headerColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, header_color: ev.target.value };
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

    // Event listeners pour les couleurs des cartes enfants
    if (childGradientStartInput) {
      childGradientStartInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_gradient_start: ev.target.value };
        this.updateChildPreview();
        this.configChanged(this.config);
      });
    }
    
    if (childGradientEndInput) {
      childGradientEndInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_gradient_end: ev.target.value };
        this.updateChildPreview();
        this.configChanged(this.config);
      });
    }
    
    if (childBorderInput) {
      childBorderInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_border_color: ev.target.value };
        this.updateChildPreview();
        this.configChanged(this.config);
      });
    }
    
    if (childTextInput) {
      childTextInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, child_text_color: ev.target.value };
        this.updateChildPreview();
        this.configChanged(this.config);
      });
    }

    // Event listeners pour les styles avancés
    if (buttonHoverInput) {
      buttonHoverInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, button_hover_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (progressBarInput) {
      progressBarInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, progress_bar_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (pointsBadgeInput) {
      pointsBadgeInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, points_badge_color: ev.target.value };
        this.configChanged(this.config);
      });
    }
    
    if (iconColorInput) {
      iconColorInput.addEventListener('input', (ev) => {
        if (!this.config) return;
        this.config = { ...this.config, icon_color: ev.target.value };
        this.configChanged(this.config);
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

// Carte individuelle pour chaque enfant
// Permet à chaque enfant de suivre ses propres progrès et tâches

class KidsTasksChildCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._initialized = false;
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
    

    // Pour les filtres de récompenses, passer le filtre à la place de l'ID
    if (action === 'filter-rewards') {
      this.handleAction(action, target.dataset.filter, event);
    } else {
      this.handleAction(action, id, event);
    }
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
          console.log('DEBUG VALIDATION: Child card validating task', id);
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

  switchCosmeticsChild(selectedChildId) {
    // Désactiver tous les onglets et panneaux enfants
    const tabs = this.shadowRoot.querySelectorAll('.cosmetics-child-tab');
    const panels = this.shadowRoot.querySelectorAll('.cosmetics-child-panel');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Activer l'onglet et le panneau sélectionnés
    const selectedTab = this.shadowRoot.querySelector(`[data-child-id="${selectedChildId}"][data-action="switch-cosmetics-child"]`);
    const selectedPanel = this.shadowRoot.querySelector(`.cosmetics-child-panel[data-child-id="${selectedChildId}"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPanel) selectedPanel.classList.add('active');
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
  
  getAssignedChildrenNames(task) {
    if (!this._hass) return [];
    
    const children = this.getChildren();
    const assignedIds = task.assigned_child_ids || (task.assigned_child_id ? [task.assigned_child_id] : []);
    
    return assignedIds.map(assignedChildId => {
      const child = children.find(c => c.id === assignedChildId);
      return child ? child.name : 'Enfant inconnu';
    }).filter(name => name);
  }
  
  formatAssignedChildren(task) {
    const childrenNames = this.getAssignedChildrenNames(task);
    if (childrenNames.length === 0) return 'Non assigné';
    if (childrenNames.length === 1) return childrenNames[0];
    return childrenNames.join(', ');
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
      
      <div class="habitica-card">
        <!-- Header avec avatar et jauges -->
        <div class="header">
          <div class="header-content">
            ${this.config.show_avatar ? `
            <div class="avatar-section">
              <div class="child-name-header">${child.name}</div>
              <div class="avatar-container">
                <div class="avatar">${this.getEffectiveAvatar(child, 'large')}</div>
                <div class="level-badge">Niveau ${stats.level}</div>
                <!-- Placeholder pour avatar cosmétique -->
                <!--<div class="cosmetic-avatar-placeholder"></div>-->
              </div>
            </div>
            ` : `
            <div class="no-avatar-section">
              <div class="child-name-header">${child.name}</div>
              <div class="level-badge">Niveau ${stats.level}</div>
            </div>
            `}
            
            ${this.config.show_progress ? `<div class="gauges-section">` : ''}
              <div class="gauge">
                <div class="gauge-header">
                  <div class="gauge-label">Points totaux</div>
                  <div class="gauge-text">${stats.totalPoints}</div>
                </div>
                <div class="gauge-bar">
                  <div class="gauge-fill total-points" style="width: ${Math.min((stats.totalPoints / 500) * 100, 100)}%"></div>
                </div>
              </div>
              
              <div class="gauge">
                <div class="gauge-header">
                  <div class="gauge-label">Niveau ${stats.level}</div>
                  <div class="gauge-text">${stats.pointsInCurrentLevel}/${stats.pointsToNextLevel}</div>
                </div>
                <div class="gauge-bar circular">
                  <div class="gauge-fill level-progress" style="width: ${stats.pointsInCurrentLevel}%"></div>
                </div>
              </div>
              
              <div class="gauge">
                <div class="gauge-header">
                  <div class="gauge-label">Tâches</div>
                  <div class="gauge-text">${stats.completedTasks}/${stats.totalTasksToday}</div>
                </div>
                <div class="gauge-bar">
                  <div class="gauge-fill tasks-progress" style="width: ${stats.totalTasksToday > 0 ? (stats.completedTasks / stats.totalTasksToday) * 100 : 0}%"></div>
                </div>
              </div>
              
              <div class="gauge">
                <div class="gauge-header">
                  <div class="gauge-label">Coins</div>
                  <div class="gauge-text">${child.coins || 0}</div>
                </div>
                <div class="gauge-bar">
                  <div class="gauge-fill coins-progress" style="width: ${Math.min((child.coins || 0), 100)}%"></div>
                </div>
              </div>
            ${this.config.show_progress ? '</div>' : ''}
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

        <!-- Contenu des onglets -->
        <div class="content">
          ${this.renderTabContent(taskCategories, rewards, stats, child)}
        </div>
      </div>
    `;
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
  
  formatAssignedChildren(task) {
    const childrenNames = this.getAssignedChildrenNames(task);
    if (childrenNames.length === 0) return 'Non assigné';
    if (childrenNames.length === 1) return childrenNames[0];
    return childrenNames.join(', ');
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

  // Méthodes d'icônes (copiées de KidsTasksCard pour la compatibilité)
  safeGetCategoryIcon(categoryOrItem, fallback = '📋') {
    try {
      if (this.getCategoryIcon && typeof this.getCategoryIcon === 'function') {
        return this.getCategoryIcon(categoryOrItem);
      }
    } catch (error) {
      console.warn('Error in getCategoryIcon:', error);
    }
    return fallback;
  }

  renderIcon(iconData) {
    if (!iconData) return '📋';
    
    // Si c'est une URL (commence par http:// ou https://)
    if (typeof iconData === 'string' && (iconData.startsWith('http://') || iconData.startsWith('https://'))) {
      return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est une image inline base64 (commence par data:image/)
    if (typeof iconData === 'string' && iconData.startsWith('data:image/')) {
      return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est du base64 sans préfixe (pour compatibilité)
    if (typeof iconData === 'string' && this.isBase64 && this.isBase64(iconData)) {
      return `<img src="data:image/png;base64,${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;">`;
    }
    
    // Si c'est une icône MDI (commence par mdi:)
    if (typeof iconData === 'string' && iconData.startsWith('mdi:')) {
      return `<ha-icon icon="${iconData}" style="width: 1.2em; height: 1.2em;"></ha-icon>`;
    }
    
    // Sinon, traiter comme un emoji ou texte simple
    return iconData.toString();
  }

  isBase64(str) {
    if (!str || typeof str !== 'string') return false;
    // Vérifier que c'est une chaîne base64 valide (caractères base64 + longueur raisonnable pour une image)
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return str.length > 100 && str.length % 4 === 0 && base64Regex.test(str);
  }

  getCategoryIcon(categoryOrItem) {
    // Si c'est un objet (task/reward), vérifier d'abord l'icône personnalisée
    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }
    
    // Utiliser les icônes dynamiques si disponibles
    const pendingValidationsEntity = this._hass?.states['sensor.kids_tasks_pending_validations'];
    if (pendingValidationsEntity) {
      const dynamicIcons = pendingValidationsEntity.attributes.category_icons;
      if (dynamicIcons[categoryOrItem]) {
        return this.renderIcon(dynamicIcons[categoryOrItem]);
      }
    }
    
    // Essayer aussi les icônes de récompenses
    if (pendingValidationsEntity) {
      const rewardIcons = pendingValidationsEntity.attributes.reward_category_icons;
      if (rewardIcons[categoryOrItem]) {
        return this.renderIcon(rewardIcons[categoryOrItem]);
      }
    }
    
    // Fallback par défaut
    return this.renderIcon('📋');
  }

  // Calculer les statistiques de l'enfant
  getChildStats(child, tasks) {
    const totalPoints = child.points || 0;
    const level = child.level || 1;
    const pointsToNextLevel = level * 100;
    const pointsInCurrentLevel = totalPoints % 100;
    
    // Calculer les tâches de la période actuelle
    const activeTasks = tasks.filter(task => 
      task.status === 'todo' && 
      this.isTaskActiveToday(task)
    );
    
    const completedTasks = tasks.filter(task => 
      (task.status === 'validated' || task.status === 'completed') &&
      this.isTaskActiveToday(task)
    );
    
    const pendingTasks = tasks.filter(task => 
      task.status === 'pending_validation'
    );
    
    return {
      totalPoints,
      level,
      pointsInCurrentLevel,
      pointsToNextLevel,
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalTasksToday: activeTasks.length + completedTasks.length + pendingTasks.length
    };
  }

  // Vérifier si une tâche est active aujourd'hui
  isTaskActiveToday(task) {
    if (!task.active) return false;
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = dimanche
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const todayName = dayNames[dayOfWeek];
    
    if (task.frequency === 'daily' && task.weekly_days && task.weekly_days.length > 0) {
      return task.weekly_days.includes(todayName);
    }
    
    return task.frequency === 'daily' || 
           (task.frequency === 'weekly' && dayOfWeek === 1) ||
           (task.frequency === 'monthly' && today.getDate() === 1);
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
    
    const categories = {
      todo: todoTasks,
      pending: pendingTasks,
      completed: completedTasks,
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
  getStyles() {
    // Utiliser les couleurs de configuration ou les valeurs par défaut
    // Essayer d'abord avec le préfixe child_, puis sans préfixe
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
      <style>
        :host {
          display: block;
          font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
          --primary-color: ${customDashboardPrimary};
          --secondary-color: ${customDashboardSecondary};
          --header-color: ${customHeaderColor};
          --tab-color: ${customTabColor};
          --border-color: ${borderColor};
          --header-text-color: ${textColor};
          --success-color: #4caf50;
          --warning-color: #ff9800;
          --error-color: #f44336;
          --info-color: #2196f3;
        }
        
        .habitica-card {
          background: var(--card-background-color, #fff);
          border-radius: 16px;
          box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0,0,0,0.1));
          overflow: hidden;
          max-width: 100%;
          position: relative;
        }
        
        
        /* Header avec avatar et jauges */
        .header {
          background: linear-gradient(135deg, var(--header-color) 0%, var(--secondary-color) 100%);
          color: var(--header-text-color);
          padding: 20px;
          position: relative;
        }
        
        .header-content {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }
        
        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }
        
        .no-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 80px;
        }
        
        .avatar-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .avatar {
          font-size: 3em;
          margin-bottom: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px dashed rgba(255,255,255,0.2);
        }
        
        .avatar img {
          width: 80px !important;
          height: 80px !important;
          border-radius: 50% !important;
        }
        
        .child-name-header {
          font-size: 1.3em;
          font-weight: 700;
          text-align: center;
          margin: 0 0 12px 0;
          color: var(--header-text-color);
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .avatar-section .level-badge {
          position: absolute;
          top: 72px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color, #3f51b5);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 2;
        }
        
        .cosmetic-avatar-placeholder {
          margin-top: 8px;
          width: 40px;
          height: 40px;
          border: 2px dashed rgba(255,255,255,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7em;
          color: rgba(255,255,255,0.6);
        }
        
        .level-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: bold;
          text-align: center;
          min-width: 60px;
        }
        
        .gauges-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 80px;
          justify-content: space-between;
        }
        
        .gauge {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .gauge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .gauge-label {
          font-size: 0.75em;
          opacity: 0.9;
          font-weight: 500;
        }
        
        .gauge-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        
        .gauge-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }
        
        .total-points {
          background: linear-gradient(90deg, #ffd700, #ffed4a);
        }
        
        .level-progress {
          background: linear-gradient(90deg, #4facfe, #00f2fe);
        }
        
        .tasks-progress {
          background: linear-gradient(90deg, #43e97b, #38f9d7);
        }
        
        .coins-progress {
          background: linear-gradient(90deg, #9C27B0, #E1BEE7);
        }
        
        .gauge-text {
          font-size: 0.7em;
          font-weight: bold;
          opacity: 0.9;
        }
        
        
        /* Navigation par onglets */
        .tabs {
          display: flex;
          background: var(--card-background-color, #fff);
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        
        .tab {
          flex: 1;
          padding: 16px 12px;
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
          padding: 20px;
          min-height: 400px;
        }
        
        /* Tâches */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .task-item {
          background: var(--secondary-background-color, #f8f9fa);
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid #ddd;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .task-item.todo {
          border-left-color: var(--info-color);
          background: #e3f2fd;
        }
        
        .task-item.pending_validation {
          border-left-color: var(--warning-color);
          background: #fff3e0;
        }
        
        .task-item.validated,
        .task-item.completed {
          border-left-color: var(--success-color);
          background: var(--secondary-background-color, #f8f9fa);
        }
        
        .task-icon {
          font-size: 1.5em;
          min-width: 40px;
          text-align: center;
        }
        
        .task-info {
          flex: 1;
        }
        
        .task-name {
          font-weight: bold;
          color: var(--primary-text-color, #212121);
          margin-bottom: 4px;
        }
        
        .task-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          font-size: 0.85em;
          color: var(--secondary-text-color, #757575);
        }
        
        .task-points {
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .task-deadline {
          color: var(--warning-color);
        }
        
        .task-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-task {
          padding: 10px 16px;
          border: none;
          border-radius: 20px;
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
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 8px;
          margin-top: 16px;
        }
        
        .reward-square {
          aspect-ratio: 1;
          background: var(--secondary-background-color, #f8f9fa);
          border-radius: 6px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
          text-align: center;
        }
        
        .reward-square.affordable {
          border-color: var(--success-color);
          background: #e8f5e8;
        }
        
        .reward-square.points-only {
          border-left: 4px solid #4caf50;
        }
        
        .reward-square.coins-only {
          border-left: 4px solid #ffc107;
        }
        
        .reward-square.dual-currency {
          border-left: 4px solid #9c27b0;
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
        }
        
        .reward-square:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .reward-icon-large {
          font-size: 1em;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 1.2em;
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
        
        /* Styles pour les filtres de récompenses */
        .rewards-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 6px 12px;
          background: var(--secondary-background-color, #f5f5f5);
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 16px;
          font-size: 0.8em;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--secondary-text-color, #666);
        }
        
        .filter-btn.active {
          background: var(--primary-color, #3f51b5);
          color: white;
          border-color: var(--primary-color, #3f51b5);
        }
        
        .filter-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        /* Styles pour les cosmétiques */
        .reward-square.cosmetic {
          background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
        }
        
        .reward-square.cosmetic.affordable {
          border-color: #9c27b0;
          background: linear-gradient(135deg, #f3e5f5 0%, #e8f5e8 100%);
        }
        
        .reward-level {
          font-size: 0.6em;
          background: var(--primary-color, #3f51b5);
          color: white;
          padding: 1px 4px;
          border-radius: 8px;
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
        
        .cosmetic-background-preview {
          width: 20px;
          height: 12px;
          border-radius: 3px;
          border: 1px solid rgba(0,0,0,0.1);
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
        
        .theme-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
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
        
        /* Responsive mobile */
        @media (max-width: 600px) {
          .header {
            padding: 16px;
          }
          
          .header-content {
            flex-direction: row;
            align-items: flex-start;
            gap: 16px;
          }
          
          .avatar-section {
            flex-direction: column;
            align-items: center;
            min-width: 60px;
          }
          
          .avatar {
            width: 60px;
            height: 60px;
            font-size: 2.2em;
          }
          
          .content {
            padding: 16px;
          }
          
          .task-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
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
            padding: 4px;
            border-radius: 4px;
          }
          
          .reward-square.points-only {
            border-left: 3px solid #4caf50;
          }
          
          .reward-square.coins-only {
            border-left: 3px solid #ffc107;
          }
          
          .reward-square.dual-currency {
            border-left: 3px solid #9c27b0;
          }
          
          .reward-icon-large {
            font-size: 0.9em;
            margin-bottom: 1px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 1.1em;
          }
          
          .reward-name {
            font-size: 1em;
            margin-bottom: 1px;
            line-height: 1.1;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          
          .reward-price {
            font-size: 0.5em;
          }
        }
        
        @media (max-width: 320px) {
          .rewards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3px;
          }
          
          .reward-square {
            padding: 3px;
            border-radius: 3px;
          }
          
          .reward-square.points-only {
            border-left: 2px solid #4caf50;
          }
          
          .reward-square.coins-only {
            border-left: 2px solid #ffc107;
          }
          
          .reward-square.dual-currency {
            border-left: 2px solid #9c27b0;
          }
          
          .reward-icon-large {
            font-size: 0.8em;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 1em;
          }
          
          .reward-name {
            font-size: 1em;
            line-height: 1.1;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          
          .reward-price {
            font-size: 0.45em;
          }
        }
        
        /* Styles pour l'onglet historique */
        
        .past-section {
          background: var(--secondary-background-color, #fafafa);
        }
        
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
          border-radius: 50%;
          font-size: 1.2em;
          flex-shrink: 0;
        }
        
        .task-result.success {
          background: rgba(76, 175, 80, 0.1);
        }
        
        .task-result.penalty {
          background: rgba(244, 67, 54, 0.1);
        }
        
        .task-points.earned {
          color: var(--success-color, #4CAF50);
          font-weight: bold;
        }
        
        .task-points.penalty {
          color: var(--error-color, #f44336);
          font-weight: bold;
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
        
        /* Styles pour les tâches compactes */
        .task-list-compact {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .task-compact {
          display: flex;
          align-items: center;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 8px;
          padding: 8px 12px;
          border: 1px solid var(--divider-color, #e0e0e0);
          min-height: 48px;
          gap: 12px;
          position: relative;
        }
        
        /* Liserets colorés selon le statut de retard */
        .task-compact.on-time, points-earned {
          border-left: 4px solid #4caf50; /* Vert pour à l'heure */
        }
        
        .task-compact.pending {
          border-left: 4px solid #ff9800; /* Orange pour en attente de validation */
        }
        
        .task-compact.delayed, points-lost {
          border-left: 4px solid #f44336; /* Rouge pour en retard */
        }
        
        /* Liseret vert pour les tâches réussies dans la carte enfant */
        .task-compact.success-border {
          border-left: 4px solid #4caf50; /* Vert pour les tâches réussies */
        }
        
        .task-icon-compact {
          font-size: 1.5em;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .task-icon-compact img {
          width: 32px !important;
          height: 32px !important;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .task-icon-compact ha-icon {
          width: 32px !important;
          height: 32px !important;
        }
        
        .task-main-compact {
          flex: 1;
          min-width: 0;
        }
        
        .task-name-compact {
          font-weight: 500;
          color: var(--primary-text-color, #212121);
          font-size: 1em;
          line-height: 1.2;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .task-name-row-compact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        
        .task-points-compact {
          font-size: 0.85em;
          font-weight: 500;
        }
        
        .task-action-compact {
          flex-shrink: 0;
        }
        
        .btn-compact {
          background: var(--primary-color, #3f51b5);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 0.8em;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 70px;
        }
        
        .btn-compact.btn-complete {
          background: var(--success-color, #4CAF50);
        }
        
        .btn-compact.btn-validate {
          background: var(--warning-color, #FF9800);
        }
        
        .btn-compact:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .btn-compact:active {
          transform: scale(0.95);
        }
        
        /* Indicateurs de statut pour les tâches */
        .status-indicator {
          font-size: 0.8em;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
          text-align: center;
        }
        
        .status-indicator.pending {
          background-color: #fff3e0;
          color: #f57c00;
          border: 1px solid #ffcc02;
        }
        
        .status-indicator.completed {
          background-color: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #4caf50;
        }
        
        /* Responsive pour tâches compactes */
        @media (max-width: 400px) {
          .task-compact {
            padding: 6px 8px;
            gap: 8px;
            min-height: 44px;
          }
          
          .task-icon-compact {
            width: 28px;
            height: 28px;
            font-size: 1.3em;
          }
          
          .task-icon-compact img {
            width: 28px !important;
            height: 28px !important;
          }
          
          .task-icon-compact ha-icon {
            width: 28px !important;
            height: 28px !important;
          }
          
          .task-name-compact {
            font-size: 0.9em;
          }
          
          .btn-compact {
            padding: 4px 8px;
            font-size: 0.75em;
            min-width: 60px;
          }
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
          border-radius: 16px;
          padding: 24px;
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
          border-radius: 50%;
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
          padding: 12px 24px;
          border: none;
          border-radius: 20px;
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
        return this.renderBonusTab();
      case 'rewards':
        return this.renderRewardsTab(rewards, child.points);
      default:
        return this.renderTasksTab(taskCategories.todo.concat(taskCategories.pending));
    }
  }

  // Onglet des tâches actives
  renderTasksTab(tasks) {
    if (tasks.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🎉</div>
          <div class="empty-text">Toutes les tâches sont terminées !</div>
          <div class="empty-subtext">Bravo ! Tu as tout fini.</div>
        </div>
      `;
    }

    return `
      <div class="task-list-compact">
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
            <div class="task-compact ${task.status} ${delayClass}">
              <div class="task-icon-compact">${this.safeGetCategoryIcon(task, '📋')}</div>
              <div class="task-main-compact">
                <div class="task-name-compact">${task.name}</div>
                <div class="task-points-compact">
                  ${this.config && this.config.child_id ? `
                    ${task.points > 0 ? `<div><span style="color: #4CAF50; font-weight: bold;">+${task.points} points</span></div>` : ''}
                    ${task.penalty_points > 0 ? `<div><span style="color: #f44336; font-weight: bold;">-${task.penalty_points} points</span></div>` : ''}
                    ${task.coins > 0 ? `<div><span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span></div>` : ''}
                  ` : `
                    ${task.points > 0 ? `+${task.points}` : ''}${task.coins > 0 ? ` +${task.coins}c` : ''} ${task.penalty_points ? `| -${task.penalty_points}` : ''}
                  `}
                </div>
              </div>
              <div class="task-action-compact">
                ${task.status === 'todo' ? `
                  <button class="btn-compact btn-complete" 
                          data-action="complete_task" 
                          data-id="${task.id}">Terminé</button>
                ` : task.status === 'pending_validation' ? `
                  ${this.config && this.config.child_id ? `
                    <span class="status-indicator pending">En attente de validation</span>
                  ` : `
                    <button class="btn-compact btn-validate" 
                            data-action="validate_task"
                            data-id="${task.id}">Validation</button>
                  `}
                ` : `
                  <span class="status-indicator completed">✓ Validée</span>
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
      return `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <div class="empty-text">Aucune tâche passée</div>
          <div class="empty-subtext">Tes tâches terminées apparaîtront ici.</div>
        </div>
      `;
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
            <div class="task-list-compact">
              ${completedTasks.map(task => `
                <div class="task-compact completed ${isChildCard ? 'success-border' : ''}">
                  <div class="task-icon-compact">${this.safeGetCategoryIcon(task, '📋')}</div>
                  <div class="task-main-compact">
                    <div class="task-name-row-compact">
                      <div class="task-name-compact">${task.name}</div>
                      ${task.last_validated_at ? `<div class="task-validation-compact" style="font-style: italic; font-size: 0.8em; color: var(--secondary-text-color);">Validée le ${new Date(task.last_validated_at).toLocaleDateString('fr-FR')}</div>` : ''}
                    </div>
                    <div class="task-points-compact">
                      ${task.points > 0 ? `<div><span style="color: #4CAF50; font-weight: bold;">+${task.points} points</span></div>` : ''}
                      ${task.coins > 0 ? `<div><span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span></div>` : ''}
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
            <div class="task-list-compact">
              ${missedTasks.map(task => `
                <div class="task-compact missed">
                  <div class="task-icon-compact">${this.safeGetCategoryIcon(task, '📋')}</div>
                  <div class="task-main-compact">
                    <div class="task-name-compact">${task.name}</div>
                    <div class="task-points-compact">
                      -<span class="points-lost">${task.penalty_points ? task.penalty_points : Math.floor(task.points / 2)}</span> points
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

  // Onglet bonus
  renderBonusTab() {
    const allTasks = this.getTasks();
    // Filtrer uniquement les tâches bonus (frequency='none')
    const bonusTasks = allTasks.filter(task => task.frequency === 'none');
    
    if (bonusTasks.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">⭐</div>
          <div class="empty-text">Aucune tâche bonus</div>
          <div class="empty-subtext">Les tâches avec fréquence "Aucune" apparaîtront ici</div>
        </div>
      `;
    }

    return `
      <div class="task-list-compact">
        ${bonusTasks.map(task => this.renderBonusTaskCard(task)).join('')}
      </div>
    `;
  }

  // Méthode pour afficher une carte de tâche bonus
  renderBonusTaskCard(task) {
    const child = this.getChild();
    if (!child) return '';

    // Déterminer le statut de la tâche pour cet enfant
    const childStatus = task.child_statuses && task.child_statuses[child.id] 
      ? task.child_statuses[child.id].status 
      : 'todo';

    // Déterminer la classe de style selon le statut (même logique que les tâches normales)
    let delayClass = '';
    if (childStatus === 'pending_validation') {
      delayClass = 'pending';
    } else if (childStatus === 'validated') {
      delayClass = 'on-time';
    } else {
      delayClass = 'on-time'; // Les tâches bonus n'ont pas de retard
    }

    return `
      <div class="task-compact ${childStatus} ${delayClass}">
        <div class="task-icon-compact">${this.safeGetCategoryIcon(task, '📋')}</div>
        <div class="task-main-compact">
          <div class="task-name-compact">${task.name}</div>
          <div class="task-points-compact">
            ${this.config && this.config.child_id ? `
              ${task.points > 0 ? `<div><span style="color: #4CAF50; font-weight: bold;">+${task.points} points</span></div>` : ''}
              ${task.coins > 0 ? `<div><span style="color: #9C27B0; font-weight: bold;">+${task.coins} coins</span></div>` : ''}
            ` : `
              ${task.points > 0 ? `+${task.points}` : ''}${task.coins > 0 ? ` +${task.coins}c` : ''}
            `}
          </div>
        </div>
        <div class="task-action-compact">
          ${childStatus === 'todo' ? `
            <button class="btn-compact btn-complete" 
                    data-action="complete_task" 
                    data-id="${task.id}">Terminé</button>
          ` : childStatus === 'pending_validation' ? `
            ${this.config && this.config.child_id ? `
              <span class="status-indicator pending">En attente de validation</span>
            ` : `
              <button class="btn-compact btn-validate" 
                      data-action="validate_task"
                      data-id="${task.id}">Validation</button>
            `}
          ` : `
            <span class="status-indicator completed">✓ Validée</span>
            ${childStatus === 'validated' ? `
              <button class="btn-compact btn-complete" 
                      data-action="complete_task" 
                      data-id="${task.id}" 
                      style="margin-top: 4px;">Refaire</button>
            ` : ''}
          `}
        </div>
      </div>
    `;
  }

  // Onglet des récompenses
  renderRewardsTab(rewards, childPoints) {
    if (rewards.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">🎁</div>
          <div class="empty-text">Aucune récompense</div>
          <div class="empty-subtext">Les récompenses apparaîtront ici.</div>
        </div>
      `;
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
      <div class="rewards-filters">
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
              ${reward.cost > 0 ? `${reward.cost}p` : ''}${reward.coin_cost > 0 ? `${reward.cost > 0 ? ' + ' : ''}${reward.coin_cost}c` : ''}
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
              ${reward.cost > 0 ? `${reward.cost}p` : ''}${reward.coin_cost > 0 ? `${reward.cost > 0 ? ' + ' : ''}${reward.coin_cost}c` : ''}
              ${reward.cost === 0 && reward.coin_cost === 0 ? 'Gratuit' : ''}
            </div>
            ${reward.min_level && reward.min_level > 1 ? `<div class="reward-level" style="opacity: 0.5">Niveau ${reward.min_level}+</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  generateCosmeticDataFromName(rewardName) {
    // Générer des données cosmétiques basées sur le nom de la récompense
    if (!rewardName) return null;
    
    const name = rewardName.toLowerCase();
    
    // Avatars
    if (name.includes('avatar')) {
      return {
        type: 'avatar',
        catalog_data: { emoji: '👤' }
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
      let gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
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
    // Debug temporaire
    if (rewardName && rewardName.includes('Océan')) {
      console.log('DEBUG Océan cosmetic data:', cosmeticData);
    }
    
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
    
    // Debug temporaire 
    if (rewardName && rewardName.includes('Océan')) {
      console.log('DEBUG Océan normalized type:', cosmeticType, 'catalog_data:', catalogData);
    }
    
    switch (cosmeticType) {
      case 'avatar':
        if (catalogData.emoji) {
          return `<div class="cosmetic-avatar-preview">${catalogData.emoji}</div>`;
        }
        if (catalogData.pixel_art) {
          return `<img class="cosmetic-pixel-art-preview" src="${catalogData.pixel_art}" alt="${catalogData.name}" />`;
        }
        return '👤';
        
      case 'background':
        if (catalogData.css_gradient) {
          return `<div class="cosmetic-background-preview" style="background: ${catalogData.css_gradient}; width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1);"></div>`;
        }
        return '🖼️';
        
      case 'outfit':
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
        return `<div class="cosmetic-theme-preview" style="width: 24px; height: 24px; border-radius: 4px; background: linear-gradient(135deg, ${themePrimaryColor} 0%, ${themeSecondaryColor} 100%); border: 1px solid rgba(0,0,0,0.1);"></div>`;
        
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
        border-radius: 16px;
        padding: 24px;
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
        border-radius: 50%;
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
      .btn-modal {
        padding: 12px 24px;
        border: none;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 1em;
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
        <div class="reward-modal-icon">${this.safeGetCategoryIcon(reward, '🎁')}</div>
        <div class="reward-modal-name">${reward.name}</div>
        <div class="reward-modal-price">${reward.cost} points${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''}</div>
        ${reward.description ? `<div class="reward-modal-description">${reward.description}</div>` : ''}
        <div class="reward-modal-actions">
          <button class="btn-modal btn-modal-cancel" data-action="close_modal">Annuler</button>
          <button class="btn-modal btn-modal-purchase" 
                  data-action="claim_reward" 
                  data-id="${reward.id}"
                  ${!canAfford ? 'disabled' : ''}>
            ${canAfford ? `Acheter (${reward.cost} points${reward.coin_cost > 0 ? ` + ${reward.coin_cost} coins` : ''})` : 'Pas assez de monnaie'}
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
        .config-section {
          margin-top: 24px;
          padding: 16px;
          border: 1px solid var(--divider-color, #e0e0e0);
          border-radius: 8px;
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
          padding: 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4CAF50, #8BC34A);
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
          border-radius: 50%;
        }
        .preview-name {
          font-size: 1.2em;
          font-weight: 600;
          flex: 1;
        }
        .preview-level {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
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
          padding: 12px 16px;
          background: var(--card-background-color, white);
          border: 2px solid var(--divider-color, #e0e0e0);
          border-radius: 12px;
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
          border-radius: 16px;
          padding: 24px;
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
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8em;
          font-weight: 500;
          margin-left: auto;
        }
        
        .cosmetic-category {
          margin-bottom: 32px;
          background: var(--secondary-background-color, #fafafa);
          border-radius: 12px;
          padding: 24px;
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
          border-radius: 16px;
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
          background: #f8f9fa;
          border-radius: 8px;
          position: relative;
        }
        
        .avatar-preview {
          font-size: 3em;
        }
        
        .pixel-art-preview {
          max-width: 64px;
          max-height: 64px;
          image-rendering: pixelated;
        }
        
        .background-preview {
          width: 60px;
          height: 40px;
          border-radius: 8px;
          border: 2px solid rgba(255,255,255,0.8);
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
        
        .theme-color {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
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
          padding: 2px 8px;
          border-radius: 12px;
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
        
        .cost-points {
          background: #2196f3;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 500;
        }
        
        .cost-coins {
          background: #ff9800;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
          font-weight: 500;
        }
        
        .empty-category-message {
          text-align: center;
        }
        
        .empty-category-message .hint {
          font-size: 0.85em;
          opacity: 0.7;
          margin-top: 8px;
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

    // Fire config-changed event
    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
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