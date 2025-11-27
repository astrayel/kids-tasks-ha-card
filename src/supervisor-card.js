// Kids Tasks Supervisor Card - Parent validation and supervision interface

import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksUtils } from './utils.js';

/**
 * Supervisor Card - For parents to validate tasks and supervise children
 * Features:
 * - Task validation queue
 * - Children overview
 * - Quick actions (add/remove points, give cosmetics)
 * - Global history with undo capability
 */
class KidsTasksSupervisorCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentView = 'validations';
    this.historyFilter = 'all';
    this.selectedChild = null;
  }

  setConfig(config) {
    this.config = {
      title: 'Supervision',
      show_navigation: true,
      ...config
    };
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    // Check for validation changes
    const oldPending = this.getPendingValidations(oldHass);
    const newPending = this.getPendingValidations(newHass);

    if (oldPending.length !== newPending.length) return true;

    // Check for child state changes
    const oldChildren = Object.keys(oldHass.states).filter(id =>
      id.startsWith('sensor.kidtasks_') && id.endsWith('_points')
    );
    const newChildren = Object.keys(newHass.states).filter(id =>
      id.startsWith('sensor.kidtasks_') && id.endsWith('_points')
    );

    if (oldChildren.length !== newChildren.length) return true;

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
        ${window.KidsTasksStyleManager ? window.KidsTasksStyleManager.getTaskStyles() : ''}

        /* Supervisor-specific styles */
        .validation-alert {
          background: linear-gradient(135deg, var(--kt-warning) 0%, var(--kt-warning-light) 100%);
          color: white;
          padding: var(--kt-space-md);
          border-radius: var(--kt-radius-md);
          margin-bottom: var(--kt-space-lg);
          font-weight: 600;
          text-align: center;
        }

        .validation-item {
          background: var(--kt-surface);
          border: 2px solid var(--kt-surface-variant);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          margin-bottom: var(--kt-space-md);
          position: relative;
          overflow: hidden;
        }

        .validation-item .task-info {
          display: flex;
          align-items: center;
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-sm);
        }

        .validation-item .task-name {
          font-weight: 600;
          font-size: 1.1em;
          color: var(--primary-text-color);
        }

        .validation-item .task-meta {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          margin-bottom: var(--kt-space-sm);
        }

        .validation-item .child-badge {
          display: inline-block;
          background: var(--kt-primary);
          color: white;
          padding: 2px 8px;
          border-radius: var(--kt-radius-sm);
          font-size: 0.85em;
          font-weight: 600;
        }

        .validation-actions {
          display: flex;
          gap: var(--kt-space-sm);
          justify-content: flex-end;
        }

        .btn-validate {
          background: var(--kt-success);
          color: white;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-lg);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .btn-validate:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        .btn-reject {
          background: var(--kt-error);
          color: white;
          border: none;
          padding: var(--kt-space-sm) var(--kt-space-lg);
          border-radius: var(--kt-radius-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .btn-reject:hover {
          background: #d32f2f;
          transform: translateY(-2px);
        }

        /* Swipeable validation items */
        .validation-item.kt-swipeable-item.swiping-left::before {
          content: '✗ Rejeter';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kt-error);
          color: white;
          font-weight: 600;
          font-size: 1.1em;
        }

        .validation-item.kt-swipeable-item.swiping-right::before {
          content: 'Valider ✓';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--kt-success);
          color: white;
          font-weight: 600;
          font-size: 1.1em;
        }

        /* Quick actions panel */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--kt-space-md);
          margin-bottom: var(--kt-space-lg);
        }

        .quick-action-btn {
          background: var(--kt-surface);
          border: 2px solid var(--kt-primary);
          padding: var(--kt-space-lg);
          border-radius: var(--kt-radius-md);
          cursor: pointer;
          transition: all var(--kt-transition-fast);
          text-align: center;
        }

        .quick-action-btn:hover {
          background: var(--kt-primary);
          color: white;
          transform: translateY(-2px);
        }

        .quick-action-icon {
          font-size: 2em;
          margin-bottom: var(--kt-space-xs);
        }

        .quick-action-label {
          font-weight: 600;
        }

        /* History item */
        .history-item {
          background: var(--kt-surface);
          border-left: 4px solid var(--kt-primary);
          padding: var(--kt-space-md);
          margin-bottom: var(--kt-space-sm);
          border-radius: var(--kt-radius-sm);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-item.points-add {
          border-left-color: var(--kt-success);
        }

        .history-item.points-remove {
          border-left-color: var(--kt-error);
        }

        .history-content {
          flex: 1;
        }

        .history-action {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .history-details {
          font-size: 0.9em;
          color: var(--secondary-text-color);
        }

        .history-undo {
          background: var(--kt-surface-variant);
          border: none;
          padding: var(--kt-space-xs) var(--kt-space-sm);
          border-radius: var(--kt-radius-sm);
          cursor: pointer;
          font-size: 0.9em;
        }

        .history-undo:hover {
          background: var(--kt-error);
          color: white;
        }
      </style>
    `;
  }

  renderNavigation() {
    const tabs = [
      { id: 'validations', label: '✅ Validations', badge: this.getPendingValidations(this._hass).length },
      { id: 'children', label: '👦 Enfants' },
      { id: 'actions', label: '⚡ Actions' },
      { id: 'history', label: '📜 Historique' }
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
            ${tab.badge ? `<span class="badge">${tab.badge}</span>` : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderCurrentView() {
    switch (this.currentView) {
      case 'validations':
        return this.renderValidationsView();
      case 'children':
        return this.renderChildrenView();
      case 'actions':
        return this.renderActionsView();
      case 'history':
        return this.renderHistoryView();
      default:
        return this.renderValidationsView();
    }
  }

  renderValidationsView() {
    const pending = this.getPendingValidations(this._hass);

    if (pending.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <div class="empty-text">Aucune validation en attente</div>
          <div class="empty-subtext">Toutes les tâches ont été validées !</div>
        </div>
      `;
    }

    return `
      <div class="validation-alert">
        ⚠️ ${pending.length} tâche${pending.length > 1 ? 's' : ''} en attente de validation
      </div>

      <div class="validations-list">
        ${pending.map(item => this.renderValidationItem(item)).join('')}
      </div>
    `;
  }

  renderValidationItem(item) {
    const timeAgo = this.getTimeAgo(item.completed_at);

    return `
      <div class="validation-item kt-swipeable-item" data-task-id="${item.task_id}" data-child-id="${item.child_id}">
        <div class="task-info">
          <div class="item-icon">${this.getCategoryIcon(item)}</div>
          <div class="task-name">${item.task_name}</div>
        </div>

        <div class="task-meta">
          <span class="child-badge">${item.child_name}</span>
          <span>Complétée ${timeAgo}</span>
          <span>+${item.points} 🎫</span>
          ${item.coins > 0 ? `<span>+${item.coins} 🪙</span>` : ''}
        </div>

        <div class="validation-actions">
          <button class="btn-reject" data-action="reject-task" data-task-id="${item.task_id}" data-child-id="${item.child_id}">
            ✗ Rejeter
          </button>
          <button class="btn-validate" data-action="validate-task" data-task-id="${item.task_id}">
            ✓ Valider
          </button>
        </div>
      </div>
    `;
  }

  renderChildrenView() {
    const children = this.getChildren();

    return `
      <div class="children-grid">
        ${children.map(child => this.renderChildCard(child)).join('')}
      </div>
    `;
  }

  renderChildCard(child) {
    const stats = this.getChildStats(child);

    return `
      <div class="child-card hover-card" data-action="view-child" data-id="${child.child_id || child.id}">
        <div class="child-avatar">${this.getAvatar(child, '👶')}</div>
        <div class="child-name">${child.name}</div>
        <div class="child-stats">
          <div class="stat">
            <div class="stat-value">${child.points || 0}</div>
            <div class="stat-label">🎫 Points</div>
          </div>
          <div class="stat">
            <div class="stat-value">${child.coins || 0}</div>
            <div class="stat-label">🪙 Pièces</div>
          </div>
          <div class="stat">
            <div class="stat-value">${child.level || 1}</div>
            <div class="stat-label">Niveau</div>
          </div>
        </div>
        <div class="child-progress">
          <div class="progress-label">Tâches aujourd'hui</div>
          <div class="progress-value">${stats.completedToday} / ${stats.totalToday}</div>
        </div>
      </div>
    `;
  }

  renderActionsView() {
    const children = this.getChildren();

    return `
      <div class="quick-actions">
        <div class="quick-action-btn" data-action="add-points">
          <div class="quick-action-icon">➕🎫</div>
          <div class="quick-action-label">Ajouter Points</div>
        </div>

        <div class="quick-action-btn" data-action="remove-points">
          <div class="quick-action-icon">➖🎫</div>
          <div class="quick-action-label">Retirer Points</div>
        </div>

        <div class="quick-action-btn" data-action="add-coins">
          <div class="quick-action-icon">➕🪙</div>
          <div class="quick-action-label">Ajouter Pièces</div>
        </div>

        <div class="quick-action-btn" data-action="give-cosmetic">
          <div class="quick-action-icon">🎨</div>
          <div class="quick-action-label">Donner Cosmétique</div>
        </div>
      </div>

      <div class="children-list">
        <h3>Enfants</h3>
        ${children.map(child => `
          <div class="child-item hover-card" data-action="show-child-actions" data-id="${child.child_id || child.id}">
            <div class="item-icon">${this.getAvatar(child, '👶')}</div>
            <div class="child-info">
              <div class="child-name">${child.name}</div>
              <div class="child-stats-inline">
                ${child.points || 0} 🎫 · ${child.coins || 0} 🪙 · Niv ${child.level || 1}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderHistoryView() {
    // Get combined history from all children
    const history = this.getGlobalHistory();

    if (history.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">📜</div>
          <div class="empty-text">Aucun historique</div>
        </div>
      `;
    }

    return `
      <div class="history-filters">
        <select class="history-filter-select" data-action="filter-history">
          <option value="all">Tous les enfants</option>
          ${this.getChildren().map(child => `
            <option value="${child.child_id || child.id}">${child.name}</option>
          `).join('')}
        </select>
      </div>

      <div class="history-list">
        ${history.map(entry => this.renderHistoryItem(entry)).join('')}
      </div>
    `;
  }

  renderHistoryItem(entry) {
    const className = entry.points_delta > 0 ? 'points-add' : 'points-remove';

    return `
      <div class="history-item ${className}">
        <div class="history-content">
          <div class="history-action">
            ${entry.child_name}: ${entry.description}
          </div>
          <div class="history-details">
            ${entry.points_delta > 0 ? '+' : ''}${entry.points_delta} 🎫
            · ${this.formatDateTime(entry.timestamp)}
          </div>
        </div>
        <button class="history-undo" data-action="undo-transaction" data-entry-id="${entry.id}">
          ↶ Annuler
        </button>
      </div>
    `;
  }

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-view':
        this.currentView = id;
        this.render();
        break;
      case 'validate-task':
        this.validateTask(event.target.dataset.taskId);
        break;
      case 'reject-task':
        this.rejectTask(event.target.dataset.taskId, event.target.dataset.childId);
        break;
      case 'view-child':
        this.showChildDetails(id);
        break;
      case 'add-points':
        this.showAddPointsModal();
        break;
      case 'remove-points':
        this.showRemovePointsModal();
        break;
      case 'add-coins':
        this.showAddCoinsModal();
        break;
      case 'give-cosmetic':
        this.showGiveCosmeticModal();
        break;
      case 'undo-transaction':
        this.undoTransaction(id);
        break;
      case 'filter-history':
        this.historyFilter = event.target.value;
        this.render();
        break;
      default:
        console.warn('Unknown action in supervisor card:', action);
    }
  }

  async validateTask(taskId) {
    try {
      await this._hass.callService('kids_tasks', 'validate_task', {
        task_id: taskId
      });
      this.showNotification('Tâche validée !', 'success');
      setTimeout(() => this.render(), 500);
    } catch (error) {
      this.showNotification(`Erreur: ${error.message}`, 'error');
    }
  }

  async rejectTask(taskId, childId) {
    const reason = prompt('Raison du rejet (optionnel):');
    try {
      await this._hass.callService('kids_tasks', 'reject_task', {
        task_id: taskId,
        child_id: childId,
        reason: reason || 'Tâche non conforme'
      });
      this.showNotification('Tâche rejetée', 'warning');
      setTimeout(() => this.render(), 500);
    } catch (error) {
      this.showNotification(`Erreur: ${error.message}`, 'error');
    }
  }

  showAddPointsModal() {
    const children = this.getChildren();
    const content = `
      <form id="add-points-form">
        <ha-select name="child_id" label="Enfant" required>
          ${children.map(child => `
            <ha-list-item value="${child.child_id || child.id}">${child.name}</ha-list-item>
          `).join('')}
        </ha-select>

        <ha-textfield name="points" type="number" label="Points" required min="1" value="10"></ha-textfield>

        <ha-textarea name="reason" label="Raison" required placeholder="Ex: Bon comportement"></ha-textarea>

        <div class="form-actions">
          <ha-button class="btn-secondary" onclick="this.closest('ha-dialog').close()">Annuler</ha-button>
          <ha-button class="btn-primary" onclick="supervisorCard.submitAddPoints()">Ajouter</ha-button>
        </div>
      </form>
    `;

    this.showModal(content, 'Ajouter des Points');
  }

  async submitAddPoints() {
    const dialog = document.querySelector('ha-dialog');
    const form = dialog.querySelector('form');
    const childId = form.querySelector('[name="child_id"]').value;
    const points = parseInt(form.querySelector('[name="points"]').value);
    const reason = form.querySelector('[name="reason"]').value;

    try {
      await this._hass.callService('kids_tasks', 'add_points', {
        child_id: childId,
        points: points,
        reason: reason
      });
      this.showNotification(`${points} points ajoutés !`, 'success');
      dialog.close();
      setTimeout(() => this.render(), 500);
    } catch (error) {
      this.showNotification(`Erreur: ${error.message}`, 'error');
    }
  }

  getPendingValidations(hass) {
    if (!hass) return [];

    const pending = [];
    const taskEntities = Object.keys(hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => hass.states[id]);

    taskEntities.forEach(entity => {
      if (entity.state === 'pending_validation') {
        const taskId = entity.entity_id.replace('sensor.kidtasks_task_', '');
        const childStatuses = entity.attributes.child_statuses || {};

        Object.entries(childStatuses).forEach(([childId, status]) => {
          if (status.status === 'pending_validation') {
            const child = this.getChildFromHass(hass, childId);
            pending.push({
              task_id: taskId,
              task_name: entity.attributes.friendly_name || 'Tâche',
              child_id: childId,
              child_name: child?.name || childId,
              completed_at: status.completed_at,
              points: entity.attributes.points || 0,
              coins: entity.attributes.coins || 0,
              category: entity.attributes.category,
              icon: entity.attributes.icon
            });
          }
        });
      }
    });

    return pending.sort((a, b) =>
      new Date(a.completed_at) - new Date(b.completed_at)
    );
  }

  getGlobalHistory() {
    const children = this.getChildren();
    const history = [];

    children.forEach(child => {
      const childHistory = child.points_history || [];
      childHistory.forEach(entry => {
        history.push({
          ...entry,
          child_id: child.child_id || child.id,
          child_name: child.name
        });
      });
    });

    // Sort by timestamp (newest first)
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Apply filter
    if (this.historyFilter && this.historyFilter !== 'all') {
      return history.filter(entry => entry.child_id === this.historyFilter);
    }

    return history.slice(0, 50); // Limit to 50 items
  }

  getTimeAgo(timestamp) {
    if (!timestamp) return 'récemment';

    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'à l\'instant';
    if (diffMins < 60) return `il y a ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `il y a ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `il y a ${diffDays}j`;
  }

  formatDateTime(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-supervisor-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-supervisor',
      title: 'Supervision',
      show_navigation: true
    };
  }
}

// ES6 export
export { KidsTasksSupervisorCard };

// Global reference for modal callbacks
if (typeof window !== 'undefined') {
  window.supervisorCard = null;
}
