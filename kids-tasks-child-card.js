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

  async handleAction(action, id = null) {
    if (!this._hass) {
      this.showNotification('Home Assistant non disponible', 'error');
      return;
    }

    // Validation des paramètres
    if (!id && (action === 'complete_task' || action === 'claim_reward')) {
      this.showNotification('ID manquant pour cette action', 'error');
      return;
    }

    if (!this.config.child_id && action === 'claim_reward') {
      this.showNotification('ID enfant manquant', 'error');
      return;
    }

    try {
      switch (action) {
        case 'complete_task':
          await this._hass.callService('kids_tasks', 'complete_task', {
            task_id: id,
          });
          this.showNotification('Tâche marquée comme terminée ! 🎉', 'success');
          break;
          
        case 'claim_reward':
          // Vérifier que l'enfant a assez de points
          const child = this.getChild();
          const reward = this.getRewards().find(r => r.id === id);
          
          if (!child) {
            this.showNotification('Informations enfant introuvables', 'error');
            return;
          }
          
          if (!reward) {
            this.showNotification('Récompense introuvable', 'error');
            return;
          }
          
          if (child.points < reward.cost) {
            this.showNotification(`Il te manque ${reward.cost - child.points} points pour cette récompense`, 'warning');
            return;
          }
          
          await this._hass.callService('kids_tasks', 'claim_reward', {
            reward_id: id,
            child_id: this.config.child_id,
          });
          this.showNotification('Récompense échangée ! 🎁', 'success');
          break;
          
        default:
          console.warn('Action inconnue:', action);
          this.showNotification('Action non reconnue', 'warning');
      }
    } catch (error) {
      console.error('Action échouée:', error);
      
      // Messages d'erreur plus précis
      let errorMessage = 'Une erreur est survenue';
      if (error.message) {
        if (error.message.includes('not found')) {
          errorMessage = 'Élément non trouvé';
        } else if (error.message.includes('insufficient')) {
          errorMessage = 'Points insuffisants';
        } else if (error.message.includes('service')) {
          errorMessage = 'Service indisponible';
        } else {
          errorMessage = error.message;
        }
      }
      
      this.showNotification(errorMessage, 'error');
    }
  }

  // Récupérer les données de l'enfant spécifique
  getChild() {
    if (!this._hass) return null;

    const entities = this._hass.states;
    
    // Chercher l'entité de points de cet enfant
    const pointsEntity = Object.values(entities).find(entity => 
      entity.attributes && 
      entity.attributes.type === 'child' && 
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
    return {
      type: 'form',
      schema: [
        {
          name: 'child_id',
          required: true,
          selector: {
            text: {
              placeholder: 'ID de l\'enfant (ex: abc-123-def)'
            }
          }
        },
        {
          name: 'title', 
          default: 'Mes Tâches',
          selector: {
            text: {}
          }
        },
        {
          name: 'show_avatar',
          default: true,
          selector: {
            boolean: {}
          }
        },
        {
          name: 'show_progress',
          default: true,
          selector: {
            boolean: {}
          }
        },
        {
          name: 'show_rewards',
          default: true,
          selector: {
            boolean: {}
          }
        }
      ]
    };
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

// Enregistrer le composant
customElements.define('kids-tasks-child-card', KidsTasksChildCard);

// Ajouter à la liste des cartes personnalisées
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'kids-tasks-child-card',
  name: 'Kids Tasks Child Card',
  description: 'Carte individuelle pour chaque enfant avec ses tâches et progrès',
  preview: true,
  documentationURL: 'https://github.com/astrayel/kids-tasks-card',
});