// Kids Tasks - Task Form for CRUD operations

/**
 * Task Form - Create and edit tasks
 * Used by Manager Card for comprehensive task management
 */
class KidsTasksTaskForm {
  constructor(hass, config = {}) {
    this.hass = hass;
    this.config = config;
    this.onSubmit = config.onSubmit || null;
    this.onCancel = config.onCancel || null;
  }

  /**
   * Show form modal
   * @param {Object} task - Existing task data for edit mode, null for create
   */
  show(task = null) {
    const isEdit = !!task;
    const title = isEdit ? 'Modifier la tâche' : 'Créer une tâche';

    const content = this.renderForm(task, isEdit);
    return this.showModal(content, title);
  }

  renderForm(task, isEdit) {
    const children = this.getChildren();
    const categories = [
      { id: 'bedroom', label: '🛏️ Chambre', icon: '🛏️' },
      { id: 'bathroom', label: '🛁 Salle de bain', icon: '🛁' },
      { id: 'kitchen', label: '🍽️ Cuisine', icon: '🍽️' },
      { id: 'homework', label: '📚 Devoirs', icon: '📚' },
      { id: 'outdoor', label: '🌳 Extérieur', icon: '🌳' },
      { id: 'pets', label: '🐾 Animaux', icon: '🐾' },
      { id: 'other', label: '📋 Autre', icon: '📋' }
    ];

    const frequencies = [
      { id: 'daily', label: 'Quotidienne' },
      { id: 'weekly', label: 'Hebdomadaire' },
      { id: 'monthly', label: 'Mensuelle' },
      { id: 'once', label: 'Une fois' },
      { id: 'none', label: 'Bonus (pas de récurrence)' }
    ];

    const weekDays = [
      { id: '0', label: 'Lun' },
      { id: '1', label: 'Mar' },
      { id: '2', label: 'Mer' },
      { id: '3', label: 'Jeu' },
      { id: '4', label: 'Ven' },
      { id: '5', label: 'Sam' },
      { id: '6', label: 'Dim' }
    ];

    return `
      <form id="task-form" class="kt-form">
        ${isEdit ? `<input type="hidden" name="task_id" value="${task.id}">` : ''}

        <!-- Nom et description -->
        <div class="form-section">
          <h3>Informations générales</h3>

          <div class="form-field">
            <label class="form-label">Nom de la tâche *</label>
            <input type="text"
                   name="name"
                   class="form-input"
                   required
                   value="${task?.name || ''}"
                   placeholder="Ex: Ranger ma chambre">
          </div>

          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea name="description"
                      class="form-textarea"
                      rows="3"
                      placeholder="Détails optionnels...">${task?.description || ''}</textarea>
          </div>
        </div>

        <!-- Catégorie et icône -->
        <div class="form-section">
          <h3>Catégorie</h3>

          <div class="form-field">
            <label class="form-label">Catégorie *</label>
            <div class="category-grid">
              ${categories.map(cat => `
                <div class="category-option ${task?.category === cat.id ? 'selected' : ''}"
                     data-category="${cat.id}"
                     onclick="taskForm.selectCategory('${cat.id}')">
                  <div class="category-icon">${cat.icon}</div>
                  <div class="category-label">${cat.label}</div>
                </div>
              `).join('')}
            </div>
            <input type="hidden" name="category" value="${task?.category || 'other'}" required>
          </div>

          <div class="form-field">
            <label class="form-label">Icône personnalisée (optionnel)</label>
            <input type="text"
                   name="icon"
                   class="form-input"
                   value="${task?.icon || ''}"
                   placeholder="Emoji ou mdi:icon-name">
          </div>
        </div>

        <!-- Récompenses -->
        <div class="form-section">
          <h3>Récompenses</h3>

          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Points 🎫</label>
              <input type="number"
                     name="points"
                     class="form-input"
                     min="0"
                     value="${task?.points || 10}">
            </div>

            <div class="form-field">
              <label class="form-label">Pièces 🪙</label>
              <input type="number"
                     name="coins"
                     class="form-input"
                     min="0"
                     value="${task?.coins || 0}">
            </div>

            <div class="form-field">
              <label class="form-label">Pénalité (si non faite)</label>
              <input type="number"
                     name="penalty_points"
                     class="form-input"
                     min="0"
                     value="${task?.penalty_points || 0}">
            </div>
          </div>
        </div>

        <!-- Fréquence -->
        <div class="form-section">
          <h3>Fréquence</h3>

          <div class="form-field">
            <label class="form-label">Fréquence *</label>
            <select name="frequency"
                    class="form-select"
                    onchange="taskForm.onFrequencyChange(this.value)"
                    required>
              ${frequencies.map(freq => `
                <option value="${freq.id}"
                        ${task?.frequency === freq.id ? 'selected' : ''}>
                  ${freq.label}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-field weekly-days ${task?.frequency === 'weekly' ? '' : 'hidden'}"
               id="weekly-days-field">
            <label class="form-label">Jours de la semaine</label>
            <div class="weekdays-grid">
              ${weekDays.map(day => `
                <label class="weekday-option">
                  <input type="checkbox"
                         name="weekly_days"
                         value="${day.id}"
                         ${task?.weekly_days?.includes(parseInt(day.id)) ? 'checked' : ''}>
                  <span>${day.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-field">
            <label class="form-label">Heure limite (optionnel)</label>
            <input type="time"
                   name="deadline_time"
                   class="form-input"
                   value="${task?.deadline_time || ''}">
          </div>
        </div>

        <!-- Assignation -->
        <div class="form-section">
          <h3>Assignation</h3>

          <div class="form-field">
            <label class="form-label">Enfants assignés *</label>
            <div class="children-checkboxes">
              ${children.map(child => `
                <label class="checkbox-option">
                  <input type="checkbox"
                         name="assigned_child_ids"
                         value="${child.child_id || child.id}"
                         ${task?.assigned_child_ids?.includes(child.child_id || child.id) ? 'checked' : ''}>
                  <span>${child.avatar || '👶'} ${child.name}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Options -->
        <div class="form-section">
          <h3>Options</h3>

          <div class="form-field">
            <label class="checkbox-option">
              <input type="checkbox"
                     name="validation_required"
                     ${task?.validation_required ? 'checked' : ''}>
              <span>Validation parentale requise</span>
            </label>
          </div>

          <div class="form-field">
            <label class="checkbox-option">
              <input type="checkbox"
                     name="active"
                     ${task?.active !== false ? 'checked' : ''}>
              <span>Tâche active</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button"
                  class="btn btn-secondary"
                  onclick="taskForm.cancel()">
            Annuler
          </button>
          <button type="submit"
                  class="btn btn-primary">
            ${isEdit ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>

      <style>
        .kt-form {
          max-width: 600px;
          padding: var(--kt-space-lg);
        }

        .form-section {
          margin-bottom: var(--kt-space-xl);
        }

        .form-section h3 {
          margin-bottom: var(--kt-space-md);
          color: var(--primary-text-color);
          font-size: 1.1em;
        }

        .form-field {
          margin-bottom: var(--kt-space-md);
        }

        .form-label {
          display: block;
          margin-bottom: var(--kt-space-xs);
          font-weight: 600;
          color: var(--secondary-text-color);
        }

        .form-input,
        .form-textarea,
        .form-select {
          width: 100%;
          padding: var(--kt-space-sm);
          border: 1px solid var(--divider-color);
          border-radius: var(--kt-radius-sm);
          font-size: 1em;
          font-family: inherit;
        }

        .form-textarea {
          resize: vertical;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--kt-space-md);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: var(--kt-space-sm);
        }

        .category-option {
          padding: var(--kt-space-md);
          border: 2px solid var(--divider-color);
          border-radius: var(--kt-radius-md);
          text-align: center;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .category-option:hover {
          border-color: var(--kt-primary);
          background: var(--kt-surface-variant);
        }

        .category-option.selected {
          border-color: var(--kt-primary);
          background: var(--kt-primary);
          color: white;
        }

        .category-icon {
          font-size: 2em;
          margin-bottom: var(--kt-space-xs);
        }

        .category-label {
          font-size: 0.85em;
          font-weight: 600;
        }

        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: var(--kt-space-xs);
        }

        .weekday-option {
          text-align: center;
          padding: var(--kt-space-sm);
          border: 1px solid var(--divider-color);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
        }

        .weekday-option input[type="checkbox"] {
          display: none;
        }

        .weekday-option input[type="checkbox"]:checked + span {
          background: var(--kt-primary);
          color: white;
          padding: 4px 8px;
          border-radius: var(--kt-radius-sm);
        }

        .children-checkboxes {
          display: flex;
          flex-direction: column;
          gap: var(--kt-space-sm);
        }

        .checkbox-option {
          display: flex;
          align-items: center;
          gap: var(--kt-space-sm);
          padding: var(--kt-space-sm);
          border: 1px solid var(--divider-color);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
        }

        .checkbox-option:hover {
          background: var(--kt-surface-variant);
        }

        .checkbox-option input[type="checkbox"] {
          width: 20px;
          height: 20px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--kt-space-md);
          margin-top: var(--kt-space-xl);
          padding-top: var(--kt-space-lg);
          border-top: 1px solid var(--divider-color);
        }

        .btn {
          padding: var(--kt-space-sm) var(--kt-space-lg);
          border: none;
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .btn-primary {
          background: var(--kt-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--kt-primary-dark);
        }

        .btn-secondary {
          background: var(--kt-surface-variant);
          color: var(--primary-text-color);
        }

        .btn-secondary:hover {
          background: var(--divider-color);
        }

        .hidden {
          display: none !important;
        }
      </style>
    `;
  }

  showModal(content, title) {
    // Create modal (Home Assistant dialog or custom)
    const dialog = document.createElement('div');
    dialog.className = 'kt-modal-overlay';
    dialog.innerHTML = `
      <div class="kt-modal">
        <div class="kt-modal-header">
          <h2>${title}</h2>
          <button class="kt-modal-close" onclick="taskForm.cancel()">✕</button>
        </div>
        <div class="kt-modal-content">
          ${content}
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    // Bind form submission
    const form = dialog.querySelector('#task-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submit(form);
    });

    return dialog;
  }

  selectCategory(categoryId) {
    const options = document.querySelectorAll('.category-option');
    options.forEach(opt => opt.classList.remove('selected'));

    const selected = document.querySelector(`[data-category="${categoryId}"]`);
    if (selected) {
      selected.classList.add('selected');
    }

    document.querySelector('input[name="category"]').value = categoryId;
  }

  onFrequencyChange(frequency) {
    const weeklyDaysField = document.getElementById('weekly-days-field');
    if (weeklyDaysField) {
      if (frequency === 'weekly') {
        weeklyDaysField.classList.remove('hidden');
      } else {
        weeklyDaysField.classList.add('hidden');
      }
    }
  }

  async submit(form) {
    const formData = new FormData(form);
    const taskData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      category: formData.get('category'),
      icon: formData.get('icon') || null,
      points: parseInt(formData.get('points')) || 0,
      coins: parseInt(formData.get('coins')) || 0,
      penalty_points: parseInt(formData.get('penalty_points')) || 0,
      frequency: formData.get('frequency'),
      deadline_time: formData.get('deadline_time') || null,
      validation_required: formData.get('validation_required') === 'on',
      active: formData.get('active') !== null,
      assigned_child_ids: formData.getAll('assigned_child_ids')
    };

    // Weekly days
    if (taskData.frequency === 'weekly') {
      taskData.weekly_days = formData.getAll('weekly_days').map(d => parseInt(d));
    }

    const isEdit = !!formData.get('task_id');
    if (isEdit) {
      taskData.task_id = formData.get('task_id');
    }

    try {
      const service = isEdit ? 'update_task' : 'add_task';
      await this.hass.callService('kids_tasks', service, taskData);

      if (this.onSubmit) {
        this.onSubmit(taskData);
      }

      this.close();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  }

  cancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.close();
  }

  close() {
    const overlay = document.querySelector('.kt-modal-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  getChildren() {
    if (!this.hass) return [];

    const children = [];
    Object.keys(this.hass.states).forEach(entityId => {
      if (entityId.startsWith('sensor.kidtasks_') && entityId.endsWith('_points')) {
        const entity = this.hass.states[entityId];
        if (entity && entity.state !== 'unavailable') {
          const childId = entityId.replace('sensor.kidtasks_', '').replace('_points', '');
          children.push({
            id: childId,
            child_id: entity.attributes.child_id || childId,
            name: entity.attributes.friendly_name || childId,
            avatar: entity.attributes.avatar || '👶',
            ...entity.attributes
          });
        }
      }
    });

    return children.sort((a, b) => a.name.localeCompare(b.name));
  }
}

// Export for ES6
export { KidsTasksTaskForm };

// Global instance for callbacks
if (typeof window !== 'undefined') {
  window.taskForm = null;
}
