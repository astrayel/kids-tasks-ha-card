// Kids Tasks Manager Card - Administration interface

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

class KidsTasksManagerCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'children';
    this.taskFilter = 'active';
  }

  setConfig(config) {
    this.config = {
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true,
      ...config
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    // Check for task/reward entity changes
    const oldTaskEntities = Object.keys(oldHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));
    const newTaskEntities = Object.keys(newHass.states).filter(id => id.startsWith('sensor.kidtasks_task_'));

    if (oldTaskEntities.length !== newTaskEntities.length) return true;

    // Check for state changes in tasks/rewards
    for (const entityId of oldTaskEntities) {
      const oldEntity = oldHass.states[entityId];
      const newEntity = newHass.states[entityId];
      if (!newEntity || oldEntity.state !== newEntity.state ||
          JSON.stringify(oldEntity.attributes) !== JSON.stringify(newEntity.attributes)) {
        return true;
      }
    }

    // Check rewards
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

  render() {
    if (!this._hass) {
      this.shadowRoot.innerHTML = '<div class="kt-loading">Chargement...</div>';
      return;
    }

    this.shadowRoot.innerHTML = `
      ${this.getStyles()}
      <div class="card-content kids-tasks-scope">
        <div class="card-header">
          ${this.config.show_navigation ? this.renderNavigation() : ''}
        </div>

        <div class="main-content">
          ${this.renderCurrentView()}
        </div>
      </div>
    `;
  }

  getStyles() {
    return `
      ${this.getCommonStyles()}
      <style>
        /* Include task and reward styles */
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getTaskStyles() : ''}
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getRewardStyles() : ''}

        /* Manager-specific styles */

        .section {
          margin-bottom: var(--kt-space-lg);
        }

        .section h2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--kt-space-md);
          color: var(--primary-text-color);
        }


        .task-item.inactive {
          opacity: 0.6;
          background: var(--kt-surface-variant);
        }

        .task-item.out-of-period {
          border-left: 4px solid var(--kt-warning);
        }

        .task-main, .reward-main {
          flex: 1;
        }


        .task-rewards {
          display: flex;
          gap: var(--kt-space-xs);
          align-items: center;
        }

        .reward-points, .reward-coins {
          background: var(--kt-success);
          color: white;
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          font-size: 0.8em;
        }

        .reward-coins {
          background: var(--kt-coins-color);
        }

        /* Manager responsive overrides */
        @media (max-width: 768px) {
          .nav-tabs {
            flex-wrap: wrap;
          }

          .filters {
            justify-content: center;
          }
        }
      </style>
    `;
  }

  renderNavigation() {
    const tabs = [
      { id: 'children', label: '👦🏻 Enfants' },
      { id: 'tasks', label: '📝 Tâches' },
      { id: 'rewards', label: '🎁 Récompenses' },
      { id: 'cosmetics', label: '🎨 Cosmétiques' }
    ];

    return `
      <div class="navigation">
        ${tabs.map(tab => `
          <button
            class="nav-button ${this.currentView === tab.id ? 'active' : ''}"
            data-action="switch-view"
            data-id="${tab.id}"
          >
            ${tab.label}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'children':
        return this.renderChildrenView();
      case 'tasks':
        return this.renderTasksView();
      case 'rewards':
        return this.renderRewardsView();
      case 'cosmetics':
        return this.renderCosmeticsView();
      default:
        return this.renderChildrenView();
    }
  }

  renderChildrenView() {
    const children = this.getChildren();
    return `
    <div class="children-grid">
        ${children.map(child => this.renderChild(child)).join('')}
    </div>
    `;

  }

  renderTasksView() {
    const allTasks = this.getTasks();
    const tasks = this.filterTasks(allTasks, this.taskFilter);

    return `
      <div class="section">
        <h2>
          Gestion des tâches
          <ha-button class="add-btn" data-action="add-task">Ajouter</ha-button>
        </h2>

        <div class="filters">
          ${this.renderTaskFilters()}
        </div>

        ${tasks.length > 0 ? `
          <div class="task-list">
            ${tasks.map(task => this.renderTaskItem(task)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">📝</div>
            <p>Aucune tâche ${this.getFilterLabel(this.taskFilter)}</p>
            ${this.taskFilter === 'active' ? '<ha-button class="add-btn" data-action="add-task">Créer votre première tâche</ha-button>' : ''}
          </div>
        `}
      </div>
    `;
  }

  renderTaskFilters() {
    const filters = [
      { id: 'all', label: 'Toutes' },
      { id: 'active', label: 'Actives' },
      { id: 'bonus', label: 'Bonus' },
      { id: 'inactive', label: 'Désactivées' },
      { id: 'out-of-period', label: 'Hors période' }
    ];

    return super.renderTaskFilters({
      filters,
      filterProperty: 'taskFilter',
      actionName: 'filter-tasks',
      wrapper: false
    });
  }

  renderTaskItem(task) {
    const childName = this.formatAssignedChildren(task);
    const taskIcon = this.getCategoryIcon(task);

    return `
      <div class="task-item kt-swipeable-item ${task.active === false ? 'inactive' : ''} ${!this.isTaskInPeriod(task) ? 'out-of-period' : ''}"
           data-action="edit-task" data-id="${task.id}">
        <div class="item-icon">${taskIcon}</div>
        <div class="task-main">
          <div class="task-name">${task.name}</div>
          <div class="task-meta">
            <span>👤${childName}</span>
            <span>📅${this.getFrequencyLabel(task.frequency)}</span>
            <span>📂${this.getCategoryLabel(task.category)}</span>
          </div>
          ${task.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${task.description}</div>` : ''}
        </div>
        <div class="task-rewards">
          ${task.points > 0 ? `<span class="reward-points">+${task.points} 🎫</span>` : ''}
          ${task.coins > 0 ? `<span class="reward-coins">+${task.coins} 🪙</span>` : ''}
        </div>
      </div>
    `;
  }

  renderRewardsView() {
    const rewards = this.getRewards();

    return `
      <div class="section">
        <h2>
          Gestion des récompenses
          <ha-button class="add-btn" data-action="add-reward">Ajouter</ha-button>
        </h2>
        ${rewards.length > 0 ? `
          <div class="reward-list">
            ${rewards.map(reward => this.renderRewardItem(reward)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">🎁</div>
            <p>Aucune récompense créée</p>
            <ha-button class="add-btn" data-action="add-reward">Créer votre première récompense</ha-button>
          </div>
        `}
      </div>
    `;
  }

  renderRewardItem(reward) {
    const rewardIcon = this.getCategoryIcon(reward);

    return `
      <div class="reward-item kt-swipeable-item"
           data-action="edit-reward" data-id="${reward.id}">
        <div class="item-icon">${rewardIcon}</div>
        <div class="reward-main">
          <div class="reward-name">${reward.name}</div>
          <div class="reward-meta">
            <span>💰 ${reward.cost} 🎫${reward.coin_cost > 0 ? ` + ${reward.coin_cost} 🪙` : ''}</span>
            <span>📂 ${this.getCategoryLabel(reward.category)}</span>
            ${reward.remaining_quantity !== null ? `<span>📦 ${reward.remaining_quantity} restant(s)</span>` : ''}
          </div>
          ${reward.description ? `<div style="margin-top: 4px; font-size: 0.9em;">${reward.description}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderCosmeticsView() {
    const allRewards = this.getRewards();
    const cosmeticsRewards = allRewards.filter(r =>
      r.cosmetic_data || r.reward_type === 'cosmetic' || r.category === 'cosmetic'
    );

    if (cosmeticsRewards.length === 0) {
      return `
        <div class="section">
          <h2>🎨 Cosmétiques</h2>
          <div class="empty-state">
            <div class="empty-state-icon">🎨</div>
            <p>Aucun cosmétique disponible</p>
            <p style="font-size: 0.9em; opacity: 0.8;">Créez des récompenses de type cosmétique pour les voir apparaître ici.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="section">
        <h2>🎨 Cosmétiques</h2>
        <div class="reward-list">
          ${cosmeticsRewards.map(cosmetic => this.renderRewardItem(cosmetic)).join('')}
        </div>
      </div>
    `;
  }


  handleAction(action, id, event) {
    console.log(`Action=${action}`);
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'filter-tasks':
        this.taskFilter = event.target.dataset.filter;
        this.render();
        break;
      case 'add-task':
        this.handleAddTask();
        break;
      case 'edit-task':
        this.handleEditTask(id);
        break;
      case 'add-reward':
        this.handleAddReward();
        break;
      case 'edit-reward':
        this.handleEditReward(id);
        break;
      case 'edit-child':
        this.showChildForm(id);
        break;
      case 'show-child-history':
        this.showChildHistory(id);
        break;
      case 'remove-child':
        this.handleRemoveChild(id);
        break;
      default:
        if (__DEV__) {
          console.warn('Unknown action in manager card:', action);
        }
    }
  }

  // CRUD operations - placeholder implementations
  async handleAddTask() {
    console.info('Add task requested');
    // TODO: Implement task creation dialog/service call
  }

  async handleEditTask(taskId) {
    console.info('Edit task:', taskId);
    // TODO: Implement task edit dialog/service call
  }

  async handleAddReward() {
    console.info('Add reward requested');
    // TODO: Implement reward creation dialog/service call
  }

  async handleEditReward(rewardId) {
    console.info('Edit reward:', rewardId);
    // TODO: Implement reward edit dialog/service call
  }

  showChildForm(editChildId = null) {
    const children = this.getChildren();
    const child = editChildId ? children.find(c => c.child_id === editChildId || c.id === editChildId) : null;
    const isEdit = !!child;
    const persons = this.getPersonEntities();

    const avatarOptions = ['👶', '👧', '👦', '🧒', '🧸', '🎈', '⭐', '🌟', '🏆', '🎯'];

    const content = `
      <form>
        ${isEdit ? `<input type="hidden" name="child_id" value="${child.child_id || child.id}">` : ''}

        <ha-textfield
          label="Nom de l'enfant *"
          name="name"
          required
          value="${isEdit ? child.name : ''}"
          placeholder="Prénom de l'enfant">
        </ha-textfield>

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

          ${persons.length > 0 ? `
          <div id="person_entity-config" style="display: ${isEdit && child.avatar_type === 'person_entity' ? 'block' : 'none'};">
            <ha-select
              label="Personne liée"
              name="person_entity_id"
              value="${isEdit ? child.person_entity_id || '' : ''}">
              <ha-list-item value="">Aucune liaison</ha-list-item>
              ${persons.map(person => `
                <ha-list-item value="${person.entity_id}" ${isEdit && child.person_entity_id === person.entity_id ? 'selected' : ''}>
                  ${person.name}
                </ha-list-item>
              `).join('')}
            </ha-select>
          </div>
          ` : ''}
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
              max="99">
            </ha-textfield>
            <ha-textfield
              label="Points"
              name="points"
              type="number"
              value="${child.points || 0}"
              min="0">
            </ha-textfield>
            <ha-textfield
              label="Pièces"
              name="coins"
              type="number"
              value="${child.coins || 0}"
              min="0">
            </ha-textfield>
          </div>
        `}

        <div class="dialog-actions">
          <ha-button type="button" class="btn btn-secondary" onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button type="button" class="btn btn-primary" onclick="this.closest('ha-dialog')._cardInstance.submitChildForm(${isEdit})">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;

    const dialog = this.showModal(content, isEdit ? 'Modifier l\'enfant' : 'Ajouter un enfant');

    // Configuration des interactions avatar
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

  // Note: showChildHistory is now handled by base-card.js

  handleRemoveChild(childId) {
    const child = this.getChildren().find(c => c.child_id === childId || c.id === childId);
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
        child_id: childId,
        force_remove_entities: true
      });
    }
  }

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
    const dialog = document.querySelector('ha-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('form');
    if (!form) return;

    // Récupérer les valeurs des composants HA
    const name = form.querySelector('[name="name"]').value;
    const person_entity_id = form.querySelector('[name="person_entity_id"]')?.value || null;
    const avatar_type = form.querySelector('[name="avatar_type"]').value;

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

    if (!isEdit) {
      serviceData.initial_points = parseInt(form.querySelector('[name="initial_points"]')?.value || '0');
    } else {
      const childId = form.querySelector('[name="child_id"]').value;
      serviceData.child_id = childId;

      const newLevel = parseInt(form.querySelector('[name="level"]')?.value || '1');
      const newPoints = parseInt(form.querySelector('[name="points"]')?.value || '0');
      const newCoins = parseInt(form.querySelector('[name="coins"]')?.value || '0');

      // Pour l'édition, on utilise update_child
      const success = await this.callService('kids_tasks', 'update_child', serviceData);

      if (success) {
        // Ajuster les points et pièces si nécessaire
        const children = this.getChildren();
        const currentChild = children.find(c => (c.child_id || c.id) === childId);

        if (currentChild) {
          const pointsDiff = newPoints - (currentChild.points || 0);
          const coinsDiff = newCoins - (currentChild.coins || 0);

          if (pointsDiff !== 0) {
            await this.callService('kids_tasks', 'adjust_points', {
              child_id: childId,
              points: pointsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }

          if (coinsDiff !== 0) {
            await this.callService('kids_tasks', 'adjust_coins', {
              child_id: childId,
              coins: coinsDiff,
              reason: 'Ajustement manuel par admin'
            });
          }
        }
      }
/*    } else {
      await this.callService('kids_tasks', 'add_child', serviceData);*/
    }

    dialog.close();
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

  // Configuration
  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-manager-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-manager',
      title: 'Gestion Tâches & Récompenses',
      show_navigation: true
    };
  }
}

// ES6 export
export { KidsTasksManagerCard };