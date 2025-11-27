// Kids Tasks - Reward Form for CRUD operations

/**
 * Reward Form - Create and edit rewards
 * Used by Manager Card for comprehensive reward management
 */
class KidsTasksRewardForm {
  constructor(hass, config = {}) {
    this.hass = hass;
    this.config = config;
    this.onSubmit = config.onSubmit || null;
    this.onCancel = config.onCancel || null;
  }

  /**
   * Show form modal
   * @param {Object} reward - Existing reward data for edit mode, null for create
   */
  show(reward = null) {
    const isEdit = !!reward;
    const title = isEdit ? 'Modifier la récompense' : 'Créer une récompense';

    const content = this.renderForm(reward, isEdit);
    return this.showModal(content, title);
  }

  renderForm(reward, isEdit) {
    const categories = [
      { id: 'fun', label: '🎉 Loisir', icon: '🎉' },
      { id: 'screen_time', label: '📱 Écran', icon: '📱' },
      { id: 'outing', label: '🚗 Sortie', icon: '🚗' },
      { id: 'treat', label: '🍭 Friandise', icon: '🍭' },
      { id: 'privilege', label: '👑 Privilège', icon: '👑' },
      { id: 'toy', label: '🧸 Jouet', icon: '🧸' },
      { id: 'cosmetic', label: '🎨 Cosmétique', icon: '🎨' },
      { id: 'other', label: '📋 Autre', icon: '📋' }
    ];

    const cosmeticTypes = [
      { id: 'avatar', label: 'Avatar' },
      { id: 'hair', label: 'Coiffure' },
      { id: 'eyes', label: 'Yeux' },
      { id: 'outfit', label: 'Tenue' },
      { id: 'accessory', label: 'Accessoire' },
      { id: 'background', label: 'Fond' }
    ];

    return `
      <form id="reward-form" class="kt-form">
        ${isEdit ? `<input type="hidden" name="reward_id" value="${reward.id}">` : ''}

        <!-- Nom et description -->
        <div class="form-section">
          <h3>Informations générales</h3>

          <div class="form-field">
            <label class="form-label">Nom de la récompense *</label>
            <input type="text"
                   name="name"
                   class="form-input"
                   required
                   value="${reward?.name || ''}"
                   placeholder="Ex: 30 minutes de jeu vidéo">
          </div>

          <div class="form-field">
            <label class="form-label">Description</label>
            <textarea name="description"
                      class="form-textarea"
                      rows="3"
                      placeholder="Détails optionnels...">${reward?.description || ''}</textarea>
          </div>
        </div>

        <!-- Catégorie et type -->
        <div class="form-section">
          <h3>Catégorie et Type</h3>

          <div class="form-field">
            <label class="form-label">Catégorie *</label>
            <div class="category-grid">
              ${categories.map(cat => `
                <div class="category-option ${reward?.category === cat.id ? 'selected' : ''}"
                     data-category="${cat.id}"
                     onclick="rewardForm.selectCategory('${cat.id}')">
                  <div class="category-icon">${cat.icon}</div>
                  <div class="category-label">${cat.label}</div>
                </div>
              `).join('')}
            </div>
            <input type="hidden" name="category" value="${reward?.category || 'fun'}" required>
          </div>

          <div class="form-field">
            <label class="form-label">Icône personnalisée (optionnel)</label>
            <input type="text"
                   name="icon"
                   class="form-input"
                   value="${reward?.icon || ''}"
                   placeholder="Emoji ou mdi:icon-name">
          </div>

          <div class="form-field">
            <label class="form-label">Type de récompense *</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio"
                       name="reward_type"
                       value="real"
                       ${reward?.reward_type !== 'cosmetic' ? 'checked' : ''}
                       onchange="rewardForm.onTypeChange('real')">
                <span>Récompense réelle</span>
              </label>
              <label class="radio-option">
                <input type="radio"
                       name="reward_type"
                       value="cosmetic"
                       ${reward?.reward_type === 'cosmetic' ? 'checked' : ''}
                       onchange="rewardForm.onTypeChange('cosmetic')">
                <span>Cosmétique (avatar)</span>
              </label>
            </div>
          </div>

          <div class="form-field cosmetic-field ${reward?.reward_type === 'cosmetic' ? '' : 'hidden'}"
               id="cosmetic-type-field">
            <label class="form-label">Type de cosmétique</label>
            <select name="cosmetic_type" class="form-select">
              ${cosmeticTypes.map(type => `
                <option value="${type.id}"
                        ${reward?.cosmetic_data?.type === type.id ? 'selected' : ''}>
                  ${type.label}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-field cosmetic-field ${reward?.reward_type === 'cosmetic' ? '' : 'hidden'}"
               id="cosmetic-id-field">
            <label class="form-label">ID du cosmétique</label>
            <input type="text"
                   name="cosmetic_id"
                   class="form-input"
                   value="${reward?.cosmetic_data?.id || ''}"
                   placeholder="Ex: hair-long-blonde">
            <small>Correspond à l'ID dans le système d'avatar</small>
          </div>
        </div>

        <!-- Coûts -->
        <div class="form-section">
          <h3>Coûts</h3>

          <div class="form-row">
            <div class="form-field">
              <label class="form-label">Coût en Points 🎫 *</label>
              <input type="number"
                     name="cost"
                     class="form-input"
                     min="0"
                     required
                     value="${reward?.cost || 50}">
            </div>

            <div class="form-field">
              <label class="form-label">Coût en Pièces 🪙</label>
              <input type="number"
                     name="coin_cost"
                     class="form-input"
                     min="0"
                     value="${reward?.coin_cost || 0}">
            </div>

            <div class="form-field">
              <label class="form-label">Niveau minimum requis</label>
              <input type="number"
                     name="min_level"
                     class="form-input"
                     min="1"
                     value="${reward?.min_level || 1}">
            </div>
          </div>
        </div>

        <!-- Disponibilité -->
        <div class="form-section">
          <h3>Disponibilité</h3>

          <div class="form-field">
            <label class="checkbox-option">
              <input type="checkbox"
                     name="limited_quantity"
                     onchange="rewardForm.onLimitedChange(this.checked)"
                     ${reward?.limited_quantity ? 'checked' : ''}>
              <span>Quantité limitée</span>
            </label>
          </div>

          <div class="form-field ${reward?.limited_quantity ? '' : 'hidden'}" id="quantity-field">
            <label class="form-label">Quantité disponible</label>
            <input type="number"
                   name="remaining_quantity"
                   class="form-input"
                   min="0"
                   value="${reward?.remaining_quantity || 1}">
          </div>

          <div class="form-field">
            <label class="checkbox-option">
              <input type="checkbox"
                     name="active"
                     ${reward?.active !== false ? 'checked' : ''}>
              <span>Récompense active</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button"
                  class="btn btn-secondary"
                  onclick="rewardForm.cancel()">
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

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: var(--kt-space-sm);
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: var(--kt-space-sm);
          padding: var(--kt-space-sm);
          border: 1px solid var(--divider-color);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
        }

        .radio-option:hover {
          background: var(--kt-surface-variant);
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
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

        .form-field small {
          display: block;
          margin-top: var(--kt-space-xs);
          font-size: 0.85em;
          color: var(--secondary-text-color);
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
          <button class="kt-modal-close" onclick="rewardForm.cancel()">✕</button>
        </div>
        <div class="kt-modal-content">
          ${content}
        </div>
      </div>

      <style>
        .kt-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .kt-modal {
          background: white;
          border-radius: var(--kt-radius-lg, 8px);
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .kt-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--kt-space-lg, 16px);
          border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }

        .kt-modal-header h2 {
          margin: 0;
        }

        .kt-modal-close {
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          color: var(--secondary-text-color);
        }

        .kt-modal-close:hover {
          color: var(--primary-text-color);
        }

        .kt-modal-content {
          padding: 0;
        }
      </style>
    `;

    document.body.appendChild(dialog);

    // Bind form submission
    const form = dialog.querySelector('#reward-form');
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

  onTypeChange(type) {
    const cosmeticFields = document.querySelectorAll('.cosmetic-field');
    cosmeticFields.forEach(field => {
      if (type === 'cosmetic') {
        field.classList.remove('hidden');
      } else {
        field.classList.add('hidden');
      }
    });
  }

  onLimitedChange(isLimited) {
    const quantityField = document.getElementById('quantity-field');
    if (quantityField) {
      if (isLimited) {
        quantityField.classList.remove('hidden');
      } else {
        quantityField.classList.add('hidden');
      }
    }
  }

  async submit(form) {
    const formData = new FormData(form);
    const rewardData = {
      name: formData.get('name'),
      description: formData.get('description') || '',
      category: formData.get('category'),
      icon: formData.get('icon') || null,
      cost: parseInt(formData.get('cost')) || 0,
      coin_cost: parseInt(formData.get('coin_cost')) || 0,
      min_level: parseInt(formData.get('min_level')) || 1,
      reward_type: formData.get('reward_type') || 'real',
      limited_quantity: formData.get('limited_quantity') === 'on',
      active: formData.get('active') !== null
    };

    // Cosmetic data
    if (rewardData.reward_type === 'cosmetic') {
      rewardData.cosmetic_data = {
        type: formData.get('cosmetic_type'),
        id: formData.get('cosmetic_id')
      };
    }

    // Limited quantity
    if (rewardData.limited_quantity) {
      rewardData.remaining_quantity = parseInt(formData.get('remaining_quantity')) || 1;
    }

    const isEdit = !!formData.get('reward_id');
    if (isEdit) {
      rewardData.reward_id = formData.get('reward_id');
    }

    try {
      const service = isEdit ? 'update_reward' : 'add_reward';
      await this.hass.callService('kids_tasks', service, rewardData);

      if (this.onSubmit) {
        this.onSubmit(rewardData);
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
}

// Export for ES6
export { KidsTasksRewardForm };

// Global instance for callbacks
if (typeof window !== 'undefined') {
  window.rewardForm = null;
}
