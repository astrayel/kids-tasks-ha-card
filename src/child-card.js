// Kids Tasks Child Card - Individual child view

import { KidsTasksBaseCard } from './base-card.js';

class KidsTasksChildCard extends KidsTasksBaseCard {
  constructor() {
    super();
    this.currentTab = 'tasks';
    this.tasksFilter = 'active';
  }

  setConfig(config) {
    if (!config || !config.child_id) {
      throw new Error('Configuration invalide : child_id requis');
    }
    this.config = {
      child_id: config.child_id,
      title: config.title || 'Mes Tâches',
      show_avatar: config.show_avatar !== false,
      show_progress: config.show_progress !== false,
      show_rewards: config.show_rewards !== false,
      show_completed: config.show_completed !== false,
      show_cosmetics: config.show_cosmetics !== false,
      ...config
    };
    if (this._initialized && this._hass) {
      this.render();
    }
  }

  shouldUpdate(oldHass, newHass) {
    if (!oldHass) return true;

    const oldChild = this.getChildFromHass(oldHass, this.config.child_id);
    const newChild = this.getChildFromHass(newHass, this.config.child_id);
    if (JSON.stringify(oldChild) !== JSON.stringify(newChild)) return true;

    const relevant = Object.keys(newHass.states).filter(
      id => id.startsWith('sensor.kidtasks_task_') || id.startsWith('sensor.kidtasks_reward_')
    );
    for (const entityId of relevant) {
      const o = oldHass.states[entityId];
      const n = newHass.states[entityId];
      if (!o || !n || o.state !== n.state ||
          JSON.stringify(o.attributes) !== JSON.stringify(n.attributes)) {
        return true;
      }
    }
    return false;
  }

  render() {
    if (!this._hass || !this.config) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this._getThemeStyles()}
        <div class="kt-dark-card"><div class="kt-loading-dark">Chargement...</div></div>
      `;
      return;
    }

    const child = this.getChild();
    if (!child) {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this._getThemeStyles()}
        <div class="kt-dark-card">
          <div class="kt-empty-dark">
            <div class="kt-empty-icon">👤</div>
            <div>Enfant non trouvé (ID: ${this.config.child_id})</div>
          </div>
        </div>
      `;
      return;
    }

    try {
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this._getThemeStyles()}
        <div class="kt-dark-card">
          ${this._renderHeader(child)}
          ${this._renderStatsGrid(child)}
          ${this._renderTabNav()}
          <div class="kt-tab-body">
            ${this._renderTabContent(child)}
          </div>
        </div>
      `;
    } catch (err) {
      console.error('KidsTasksChildCard render error:', err);
      this.shadowRoot.innerHTML = `
        ${this.getCommonStyles()}
        ${this._getThemeStyles()}
        <div class="kt-dark-card">
          <div class="kt-empty-dark">Erreur : ${err.message}</div>
        </div>
      `;
    }
  }

  // ── Theme ─────────────────────────────────────────────────────────────────

  _getThemeStyles() {
    return `
      <style>
        :host {
          --kt-dp-bg:       #1E0B3B;
          --kt-dp-section:  #2C1654;
          --kt-dp-accent:   #3D1F7A;
          --kt-dp-purple:   #7B3FA0;
          --kt-dp-border:   rgba(123,63,160,0.3);
          --kt-dp-white:    #FFFFFF;
          --kt-dp-muted:    rgba(255,255,255,0.60);
          --kt-dp-stat-sz:  2.2em;
        }

        .kt-dark-card {
          background: var(--kt-dp-bg);
          color: var(--kt-dp-white);
          overflow: hidden;
        }

        /* ── Header ── */
        .kt-child-header {
          background: linear-gradient(135deg, var(--kt-dp-section) 0%, var(--kt-dp-accent) 100%);
          padding: var(--kt-space-md) var(--kt-space-lg);
          display: flex;
          align-items: center;
          gap: var(--kt-space-md);
          border-bottom: 1px solid var(--kt-dp-border);
        }

        .kt-avatar-circle {
          width: 60px;
          height: 60px;
          background: var(--kt-dp-bg);
          border: 2px solid var(--kt-dp-purple);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8em;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px rgba(123,63,160,0.2);
          overflow: hidden;
        }

        .kt-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .kt-child-name {
          font-size: 1.4em;
          font-weight: 700;
          color: var(--kt-dp-white);
          line-height: 1.2;
        }

        .kt-child-level {
          display: inline-block;
          margin-top: 4px;
          background: var(--kt-dp-purple);
          color: white;
          font-size: 0.78em;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
        }

        /* ── Stats 2×2 grid ── */
        .kt-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: var(--kt-dp-border);
          border-top: 1px solid var(--kt-dp-border);
        }

        .kt-stat-cell {
          background: var(--kt-dp-section);
          padding: var(--kt-space-md) var(--kt-space-lg);
          text-align: center;
        }

        .kt-stat-num {
          display: block;
          font-size: var(--kt-dp-stat-sz);
          font-weight: 700;
          color: var(--kt-dp-white);
          line-height: 1.1;
        }

        .kt-stat-lbl {
          display: block;
          font-size: 0.70em;
          color: var(--kt-dp-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* ── Tab navigation ── */
        .kt-tab-nav {
          display: flex;
          background: var(--kt-dp-section);
          padding: var(--kt-space-sm);
          gap: var(--kt-space-xs);
          border-top: 1px solid var(--kt-dp-border);
        }

        .kt-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--kt-dp-muted);
          padding: var(--kt-space-xs) 4px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78em;
          transition: all var(--kt-transition-fast);
          white-space: nowrap;
        }

        .kt-tab-btn.active {
          background: var(--kt-dp-purple);
          color: white;
          box-shadow: 0 2px 8px rgba(123,63,160,0.4);
        }

        .kt-tab-btn:hover:not(.active) {
          background: var(--kt-dp-accent);
          color: white;
        }

        /* ── Tab body ── */
        .kt-tab-body {
          padding: var(--kt-space-md);
          background: var(--kt-dp-bg);
          min-height: 120px;
        }

        /* ── Filter chips ── */
        .kt-filter-row {
          display: flex;
          gap: var(--kt-space-xs);
          margin-bottom: var(--kt-space-md);
          flex-wrap: wrap;
        }

        .kt-chip {
          background: var(--kt-dp-section);
          border: 1px solid var(--kt-dp-border);
          color: var(--kt-dp-muted);
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 0.78em;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .kt-chip.active {
          background: var(--kt-dp-purple);
          border-color: var(--kt-dp-purple);
          color: white;
        }

        /* ── Task items ── */
        .kt-task-row {
          display: flex;
          align-items: center;
          gap: var(--kt-space-sm);
          background: var(--kt-dp-section);
          border: 1px solid var(--kt-dp-border);
          border-radius: var(--kt-radius-md);
          padding: 10px var(--kt-space-md);
          margin-bottom: var(--kt-space-sm);
          transition: border-color var(--kt-transition-fast);
        }

        .kt-task-row:hover { border-color: var(--kt-dp-purple); }

        .kt-status-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .kt-status-dot.todo               { background: #FF9800; }
        .kt-status-dot.pending_validation  { background: #2196F3; }
        .kt-status-dot.completed           { background: #4CAF50; }
        .kt-status-dot.validated           { background: #4CAF50; }

        .kt-task-info { flex: 1; min-width: 0; }

        .kt-task-name {
          font-weight: 600;
          color: var(--kt-dp-white);
          font-size: 0.92em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kt-task-desc {
          font-size: 0.78em;
          color: var(--kt-dp-muted);
          margin-top: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .kt-pts-badge {
          background: var(--kt-dp-purple);
          color: white;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 0.75em;
          font-weight: 700;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .kt-complete-btn {
          background: #4CAF50;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95em;
          font-weight: 700;
          flex-shrink: 0;
          transition: all var(--kt-transition-fast);
        }

        .kt-complete-btn:hover {
          background: #45a049;
          transform: scale(1.1);
        }

        .kt-status-icon { font-size: 1em; flex-shrink: 0; color: var(--kt-dp-muted); }

        /* ── Reward items ── */
        .kt-reward-row {
          display: flex;
          align-items: center;
          gap: var(--kt-space-md);
          background: var(--kt-dp-section);
          border: 1px solid var(--kt-dp-border);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          margin-bottom: var(--kt-space-sm);
          cursor: pointer;
          transition: border-color var(--kt-transition-fast);
        }

        .kt-reward-row:hover:not(.kt-disabled) { border-color: var(--kt-dp-purple); }

        .kt-reward-row.kt-disabled {
          opacity: 0.45;
          cursor: default;
        }

        .kt-reward-icon { font-size: 1.7em; flex-shrink: 0; }
        .kt-reward-info { flex: 1; min-width: 0; }

        .kt-reward-name {
          font-weight: 600;
          color: var(--kt-dp-white);
          font-size: 0.92em;
        }

        .kt-reward-desc {
          font-size: 0.78em;
          color: var(--kt-dp-muted);
          margin-top: 1px;
        }

        .kt-reward-cost {
          background: #FFD700;
          color: #1a1a1a;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.75em;
          font-weight: 700;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* ── Section labels ── */
        .kt-section-label {
          font-size: 0.72em;
          color: var(--kt-dp-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: var(--kt-space-sm);
          margin-top: var(--kt-space-md);
        }
        .kt-section-label:first-child { margin-top: 0; }

        /* ── Cosmetics grid ── */
        .kt-cosmetics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--kt-space-sm);
          margin-bottom: var(--kt-space-md);
        }

        .kt-cosmetic-slot {
          aspect-ratio: 1;
          background: var(--kt-dp-section);
          border: 2px solid var(--kt-dp-border);
          border-radius: var(--kt-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4em;
          cursor: pointer;
          transition: all var(--kt-transition-fast);
        }

        .kt-cosmetic-slot:hover:not(.kt-locked) {
          border-color: var(--kt-dp-purple);
          transform: scale(1.05);
        }

        .kt-cosmetic-slot.kt-equipped {
          border-color: #4CAF50;
          background: rgba(76,175,80,0.12);
        }

        .kt-cosmetic-slot.kt-locked {
          opacity: 0.35;
          cursor: default;
        }

        /* ── History items ── */
        .kt-history-row {
          display: flex;
          align-items: center;
          gap: var(--kt-space-md);
          background: var(--kt-dp-section);
          border: 1px solid var(--kt-dp-border);
          border-radius: var(--kt-radius-md);
          padding: var(--kt-space-md);
          margin-bottom: var(--kt-space-sm);
        }

        .kt-history-icon { font-size: 1.3em; flex-shrink: 0; }
        .kt-history-info { flex: 1; min-width: 0; }

        .kt-history-desc {
          font-weight: 600;
          font-size: 0.88em;
          color: var(--kt-dp-white);
        }

        .kt-history-date {
          font-size: 0.75em;
          color: var(--kt-dp-muted);
          margin-top: 2px;
        }

        .kt-pts-pos { color: #4CAF50; font-weight: 700; font-size: 0.88em; flex-shrink: 0; }
        .kt-pts-neg { color: #F44336; font-weight: 700; font-size: 0.88em; flex-shrink: 0; }

        /* ── Empty / Loading ── */
        .kt-empty-dark {
          text-align: center;
          padding: var(--kt-space-xl);
          color: var(--kt-dp-muted);
        }

        .kt-empty-icon { font-size: 2.4em; opacity: 0.5; margin-bottom: var(--kt-space-sm); }
        .kt-empty-hint { font-size: 0.8em; margin-top: var(--kt-space-xs); opacity: 0.6; }

        .kt-loading-dark {
          text-align: center;
          padding: var(--kt-space-lg);
          color: var(--kt-dp-muted);
          font-style: italic;
        }

        @media (max-width: 480px) {
          .kt-cosmetics-grid { grid-template-columns: repeat(3, 1fr); }
          .kt-tab-btn { font-size: 0.70em; padding: 4px 2px; }
          .kt-stat-num { font-size: 1.8em; }
        }
      </style>
    `;
  }

  // ── Header ────────────────────────────────────────────────────────────────

  _renderHeader(child) {
    return `
      <div class="kt-child-header">
        <div class="kt-avatar-circle">${this.getAvatar(child, '👶')}</div>
        <div>
          <div class="kt-child-name">${child.name}</div>
          <span class="kt-child-level">Niveau ${child.level || 1}</span>
        </div>
      </div>
    `;
  }

  // ── Stats grid ────────────────────────────────────────────────────────────

  _renderStatsGrid(child) {
    const tasks = this.getChildTasks(child.child_id || child.id);
    const today = new Date().toDateString();
    const doneToday = tasks.filter(t =>
      (t.status === 'completed' || t.status === 'validated') &&
      t.completed_at && new Date(t.completed_at).toDateString() === today
    ).length;

    const rewards = this.getRewards().filter(r => (r.min_level || 1) <= (child.level || 1));
    const affordable = rewards.filter(r =>
      (r.cost || 0) <= (child.points || 0) && (r.coin_cost || 0) <= (child.coins || 0)
    ).length;

    return `
      <div class="kt-stats-grid">
        <div class="kt-stat-cell">
          <span class="kt-stat-num">${child.points || 0}</span>
          <span class="kt-stat-lbl">Points</span>
        </div>
        <div class="kt-stat-cell">
          <span class="kt-stat-num">${doneToday}</span>
          <span class="kt-stat-lbl">Tâches aujourd'hui</span>
        </div>
        <div class="kt-stat-cell">
          <span class="kt-stat-num">${child.coins || 0}</span>
          <span class="kt-stat-lbl">Pièces</span>
        </div>
        <div class="kt-stat-cell">
          <span class="kt-stat-num">${affordable}</span>
          <span class="kt-stat-lbl">Récompenses dispo</span>
        </div>
      </div>
    `;
  }

  // ── Tab navigation ────────────────────────────────────────────────────────

  _renderTabNav() {
    const tabs = [
      { id: 'tasks',     label: '✅ Tâches',      always: true },
      { id: 'rewards',   label: '🎁 Récompenses', show: this.config.show_rewards },
      { id: 'cosmetics', label: '🎨 Cosmétiques', show: this.config.show_cosmetics },
      { id: 'history',   label: '📈 Historique',  show: this.config.show_completed }
    ].filter(t => t.always || t.show !== false);

    return `
      <div class="kt-tab-nav">
        ${tabs.map(t => `
          <button
            class="kt-tab-btn ${this.currentTab === t.id ? 'active' : ''}"
            data-action="switch-tab"
            data-id="${t.id}"
          >${t.label}</button>
        `).join('')}
      </div>
    `;
  }

  // ── Tab content router ────────────────────────────────────────────────────

  _renderTabContent(child) {
    switch (this.currentTab) {
      case 'tasks':     return this._renderTasksTab(child);
      case 'rewards':   return this._renderRewardsTab(child);
      case 'cosmetics': return this._renderCosmeticsTab(child);
      case 'history':   return this._renderHistoryTab(child);
      default:          return this._renderTasksTab(child);
    }
  }

  // ── Tasks tab ─────────────────────────────────────────────────────────────

  _renderTasksTab(child) {
    const tasks = this.getChildTasks(child.child_id || child.id);
    const filtered = this.filterTasks(tasks, this.tasksFilter, 'child');

    const filterButtons = [
      { id: 'active',    label: 'Actives' },
      { id: 'bonus',     label: 'Bonus' },
      { id: 'completed', label: 'Terminées' },
      { id: 'all',       label: 'Toutes' }
    ].map(f => `
      <button
        class="kt-chip ${this.tasksFilter === f.id ? 'active' : ''}"
        data-action="filter-tasks"
        data-filter="${f.id}"
      >${f.label}</button>
    `).join('');

    if (filtered.length === 0) {
      return `
        <div class="kt-filter-row">${filterButtons}</div>
        <div class="kt-empty-dark">
          <div class="kt-empty-icon">📝</div>
          <div>Aucune tâche pour ce filtre</div>
        </div>
      `;
    }

    return `
      <div class="kt-filter-row">${filterButtons}</div>
      ${filtered.map(t => this._renderTaskRow(t)).join('')}
    `;
  }

  _renderTaskRow(task) {
    const statusClass = task.status || 'todo';

    let actionHtml;
    if (task.status === 'todo') {
      actionHtml = `<button class="kt-complete-btn" data-action="complete-task" data-id="${task.id}" title="Marquer terminée">✓</button>`;
    } else if (task.status === 'pending_validation') {
      actionHtml = `<span class="kt-status-icon" title="En attente de validation">⏳</span>`;
    } else {
      actionHtml = `<span class="kt-status-icon" title="Terminée">✅</span>`;
    }

    return `
      <div class="kt-task-row">
        <div class="kt-status-dot ${statusClass}"></div>
        <div class="kt-task-info">
          <div class="kt-task-name">${task.name}</div>
          ${task.description ? `<div class="kt-task-desc">${task.description}</div>` : ''}
        </div>
        <span class="kt-pts-badge">+${task.points || 0} 🎫</span>
        ${actionHtml}
      </div>
    `;
  }

  // ── Rewards tab ───────────────────────────────────────────────────────────

  _renderRewardsTab(child) {
    const rewards = this.getRewards().filter(r => (r.min_level || 1) <= (child.level || 1));

    if (rewards.length === 0) {
      return `
        <div class="kt-empty-dark">
          <div class="kt-empty-icon">🎁</div>
          <div>Aucune récompense disponible</div>
        </div>
      `;
    }

    const affordable = rewards.filter(r =>
      (r.cost || 0) <= (child.points || 0) && (r.coin_cost || 0) <= (child.coins || 0)
    );
    const locked = rewards.filter(r =>
      (r.cost || 0) > (child.points || 0) || (r.coin_cost || 0) > (child.coins || 0)
    );

    return `
      ${affordable.length > 0 ? `
        <div class="kt-section-label">Disponibles — ${affordable.length}</div>
        ${affordable.map(r => this._renderRewardRow(r, child, true)).join('')}
      ` : ''}
      ${locked.length > 0 ? `
        <div class="kt-section-label">Pas encore accessibles</div>
        ${locked.map(r => this._renderRewardRow(r, child, false)).join('')}
      ` : ''}
    `;
  }

  _renderRewardRow(reward, child, canAfford) {
    const icon = this.getCategoryIcon(reward);
    let cost = '';
    if (reward.cost > 0) cost += `${reward.cost} 🎫`;
    if (reward.coin_cost > 0) cost += ` ${reward.coin_cost} 🪙`;

    return `
      <div class="kt-reward-row ${canAfford ? '' : 'kt-disabled'}"
           ${canAfford ? `data-action="claim-reward" data-id="${reward.id}"` : ''}>
        <span class="kt-reward-icon">${icon}</span>
        <div class="kt-reward-info">
          <div class="kt-reward-name">${reward.name}</div>
          ${reward.description ? `<div class="kt-reward-desc">${reward.description}</div>` : ''}
        </div>
        <span class="kt-reward-cost">${cost}</span>
      </div>
    `;
  }

  // ── Cosmetics tab ─────────────────────────────────────────────────────────

  _renderCosmeticsTab(child) {
    const cosmetics = this.getRewards().filter(r =>
      r.reward_type === 'cosmetic' || r.category === 'cosmetic' || r.cosmetic_data
    );

    if (cosmetics.length === 0) {
      return `
        <div class="kt-empty-dark">
          <div class="kt-empty-icon">🎨</div>
          <div>Aucun cosmétique disponible</div>
          <div class="kt-empty-hint">Complète des tâches pour débloquer des cosmétiques !</div>
        </div>
      `;
    }

    const equippedIds = child.equipped_cosmetics || [];
    const equipped  = cosmetics.filter(c => equippedIds.includes(c.id));
    const available = cosmetics.filter(c =>
      !equippedIds.includes(c.id) &&
      (c.min_level || 1) <= (child.level || 1) &&
      (c.cost || 0) <= (child.points || 0)
    );
    const locked = cosmetics.filter(c =>
      !equippedIds.includes(c.id) &&
      ((c.min_level || 1) > (child.level || 1) || (c.cost || 0) > (child.points || 0))
    );

    return `
      ${equipped.length > 0 ? `
        <div class="kt-section-label">Équipés</div>
        <div class="kt-cosmetics-grid">
          ${equipped.map(c => this._renderCosmeticSlot(c, 'equipped')).join('')}
        </div>
      ` : ''}
      ${available.length > 0 ? `
        <div class="kt-section-label">Disponibles</div>
        <div class="kt-cosmetics-grid">
          ${available.map(c => this._renderCosmeticSlot(c, 'available')).join('')}
        </div>
      ` : ''}
      ${locked.length > 0 ? `
        <div class="kt-section-label">À débloquer</div>
        <div class="kt-cosmetics-grid">
          ${locked.map(c => this._renderCosmeticSlot(c, 'locked')).join('')}
        </div>
      ` : ''}
    `;
  }

  _renderCosmeticSlot(cosmetic, state) {
    const isLocked   = state === 'locked';
    const isEquipped = state === 'equipped';
    const icon = this.getCategoryIcon(cosmetic);
    return `
      <div
        class="kt-cosmetic-slot ${isEquipped ? 'kt-equipped' : ''} ${isLocked ? 'kt-locked' : ''}"
        ${!isLocked ? `data-action="equip-cosmetic" data-id="${cosmetic.id}" title="${cosmetic.name}"` : `title="${cosmetic.name} (verrouillé)"`}
      >${icon}</div>
    `;
  }

  // ── History tab ───────────────────────────────────────────────────────────

  _renderHistoryTab(child) {
    const placeholderId = `hist-${(child.child_id || child.id || '').replace(/[^a-z0-9]/gi, '_')}`;
    setTimeout(() => this._loadHistory(child, placeholderId), 50);
    return `<div class="kt-loading-dark" id="${placeholderId}">Chargement de l'historique…</div>`;
  }

  async _loadHistory(child, placeholderId) {
    const el = this.shadowRoot?.getElementById(placeholderId);
    if (!el) return;

    try {
      const history = await this.getChildHistory(child.child_id || child.id);

      if (!history || history.length === 0) {
        el.className = '';
        el.innerHTML = `
          <div class="kt-empty-dark">
            <div class="kt-empty-icon">📈</div>
            <div>Aucun historique</div>
          </div>
        `;
        return;
      }

      el.className = '';
      el.innerHTML = history.slice(0, 15).map(entry => {
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const delta = entry.points_delta || 0;
        return `
          <div class="kt-history-row">
            <span class="kt-history-icon">${this.getActionIcon(entry.action_type)}</span>
            <div class="kt-history-info">
              <div class="kt-history-desc">${entry.description || 'Action'}</div>
              <div class="kt-history-date">${dateStr} à ${timeStr}</div>
            </div>
            <span class="${delta >= 0 ? 'kt-pts-pos' : 'kt-pts-neg'}">${delta >= 0 ? '+' : ''}${delta} 🎫</span>
          </div>
        `;
      }).join('');
    } catch (err) {
      if (el) {
        el.className = '';
        el.innerHTML = `<div class="kt-empty-dark">Erreur lors du chargement</div>`;
      }
    }
  }

  // ── Action handler ────────────────────────────────────────────────────────

  handleAction(action, id, event) {
    switch (action) {
      case 'switch-tab':
        this.currentTab = id;
        this.render();
        break;
      case 'filter-tasks':
        this.tasksFilter = id;
        this.render();
        break;
      case 'complete-task':
        this._completeTask(id);
        break;
      case 'claim-reward':
        this._claimReward(id);
        break;
      case 'equip-cosmetic':
        this._equipCosmetic(id);
        break;
      default:
        console.warn('KidsTasksChildCard: unknown action', action);
    }
  }

  // ── Service calls ─────────────────────────────────────────────────────────

  async _completeTask(taskId) {
    try {
      await this._hass.callService('kids_tasks', 'complete_task', {
        task_id: taskId,
        child_id: this.config.child_id
      });
    } catch (err) {
      console.error('Error completing task:', err);
    }
  }

  async _claimReward(rewardId) {
    try {
      await this._hass.callService('kids_tasks', 'claim_reward', {
        reward_id: rewardId,
        child_id: this.config.child_id
      });
    } catch (err) {
      console.error('Error claiming reward:', err);
    }
  }

  async _equipCosmetic(cosmeticId) {
    try {
      await this._hass.callService('kids_tasks', 'equip_cosmetic', {
        cosmetic_id: cosmeticId,
        child_id: this.config.child_id
      });
    } catch (err) {
      console.error('Error equipping cosmetic:', err);
    }
  }

  // ── Data access ───────────────────────────────────────────────────────────

  getChild() {
    return this.getChildFromHass(this._hass, this.config.child_id);
  }

  getChildFromHass(hass, childIdOrName) {
    const pointsEntities = Object.keys(hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_') && id.endsWith('_points'));

    for (const entityId of pointsEntities) {
      const e = hass.states[entityId];
      const name = e.attributes.friendly_name;
      if (name === childIdOrName || name?.toLowerCase() === childIdOrName?.toLowerCase()) {
        const realId = e.attributes.child_id || entityId.replace('sensor.kidtasks_', '').replace('_points', '');
        return {
          id: realId,
          child_id: e.attributes.child_id || realId,
          name: name || realId,
          points: parseInt(e.state) || 0,
          coins: e.attributes.coins || 0,
          level: e.attributes.level || 1,
          ...e.attributes
        };
      }
    }

    const direct = hass.states[`sensor.kidtasks_${childIdOrName}_points`];
    if (direct) {
      return {
        id: childIdOrName,
        child_id: direct.attributes.child_id || childIdOrName,
        name: direct.attributes.friendly_name || childIdOrName,
        points: parseInt(direct.state) || 0,
        coins: direct.attributes.coins || 0,
        level: direct.attributes.level || 1,
        ...direct.attributes
      };
    }

    return null;
  }

  getChildTasks(childId) {
    if (!this._hass) return [];

    return Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_task_'))
      .map(id => this._hass.states[id])
      .filter(entity => {
        if (!entity.attributes) return false;
        const ids = entity.attributes.assigned_child_ids ||
                    entity.attributes.assigned_children ||
                    (entity.attributes.assigned_child_id ? [entity.attributes.assigned_child_id] : []);
        const arr = Array.isArray(ids) ? ids : [ids];
        return arr.includes(childId);
      })
      .map(entity => ({
        id: entity.entity_id.replace('sensor.kidtasks_task_', ''),
        name: entity.attributes.friendly_name || 'Tâche',
        description: entity.attributes.description,
        status: entity.state,
        points: entity.attributes.points || 0,
        category: entity.attributes.category,
        icon: entity.attributes.icon,
        completed_at: entity.attributes.completed_at,
        ...entity.attributes
      }));
  }

  getRewards() {
    if (!this._hass) return [];

    return Object.keys(this._hass.states)
      .filter(id => id.startsWith('sensor.kidtasks_reward_'))
      .map(id => this._hass.states[id])
      .map(entity => ({
        id: entity.entity_id.replace('sensor.kidtasks_reward_', ''),
        name: entity.attributes.friendly_name || 'Récompense',
        description: entity.attributes.description,
        cost: entity.attributes.cost || 0,
        coin_cost: entity.attributes.coin_cost || 0,
        min_level: entity.attributes.min_level || 1,
        category: entity.attributes.category,
        icon: entity.attributes.icon,
        reward_type: entity.attributes.reward_type,
        cosmetic_data: entity.attributes.cosmetic_data,
        ...entity.attributes
      }));
  }

  // ── Config helpers ────────────────────────────────────────────────────────

  static getConfigElement() {
    const suffix = window.KidsTasksCardSuffix || '';
    return document.createElement(`kids-tasks-child-card-editor${suffix}`);
  }

  static getStubConfig() {
    return {
      type: 'custom:kids-tasks-child-card',
      child_id: 'child1',
      show_avatar: true,
      show_progress: true,
      show_rewards: true,
      show_completed: true,
      show_cosmetics: true
    };
  }
}

export { KidsTasksChildCard };
