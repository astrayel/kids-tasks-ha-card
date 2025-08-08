/**
 * Kids Tasks Card - Simple version without external dependencies
 * 
 * @version 1.0.0
 * @author Kids Tasks Card Team
 * @license MIT
 */

// Card version for console logging
const CARD_VERSION = "1.0.0";
console.info(
  `%c  KIDS-TASKS-CARD \n%c  Version ${CARD_VERSION}    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);

// Main card class - using vanilla custom elements
class KidsTasksCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Set configuration
  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this.config = {
      title: config.title || 'Kids Tasks',
      show_completed: config.show_completed !== false,
      show_rewards: config.show_rewards !== false,
      child_filter: config.child_filter || [],
      ...config,
    };

    this.render();
  }

  // Set Home Assistant object
  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  // Get card size
  getCardSize() {
    return 6;
  }

  // Handle button clicks
  handleAction(action, data = {}) {
    if (!this._hass) return;

    try {
      switch (action) {
        case 'complete_task':
          this._hass.callService('kids_tasks', 'complete_task', {
            task_id: data.taskId,
          });
          break;
          
        case 'validate_task':
          this._hass.callService('kids_tasks', 'validate_task', {
            task_id: data.taskId,
          });
          break;
          
        case 'claim_reward':
          this._hass.callService('kids_tasks', 'claim_reward', {
            reward_id: data.rewardId,
            child_id: data.childId,
          });
          break;
          
        case 'reset_task':
          this._hass.callService('kids_tasks', 'reset_task', {
            task_id: data.taskId,
          });
          break;

        case 'add_child':
          // Open a simple prompt for now
          const childName = prompt('Enter child name:');
          if (childName) {
            this._hass.callService('kids_tasks', 'add_child', {
              name: childName,
              avatar: '👶',
              initial_points: 0,
            });
          }
          break;
          
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Action failed:', error);
    }
  }

  // Get children data from Home Assistant entities
  getChildrenData() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const children = [];

    // Find child entities
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_') && entities[entityId].attributes.type === 'child') {
        const entity = entities[entityId];
        children.push({
          id: entity.attributes.child_id,
          name: entity.attributes.friendly_name || entity.attributes.name,
          points: entity.state,
          level: entity.attributes.level,
          avatar: entity.attributes.avatar,
          tasks: this.getChildTasks(entity.attributes.child_id),
        });
      }
    });

    return children;
  }

  // Get tasks for a specific child
  getChildTasks(childId) {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const tasks = [];

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_task_')) {
        const entity = entities[entityId];
        if (entity.attributes.assigned_child_id === childId) {
          tasks.push({
            id: entity.attributes.task_id,
            name: entity.attributes.friendly_name || entity.attributes.name,
            status: entity.state,
            points: entity.attributes.points,
            category: entity.attributes.category,
            description: entity.attributes.description,
            validation_required: entity.attributes.validation_required,
          });
        }
      }
    });

    return tasks;
  }

  // Get rewards data
  getRewardsData() {
    if (!this._hass) return [];

    const entities = this._hass.states;
    const rewards = [];

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_reward_')) {
        const entity = entities[entityId];
        rewards.push({
          id: entity.attributes.reward_id,
          name: entity.attributes.friendly_name || entity.attributes.name,
          cost: entity.attributes.cost,
          category: entity.attributes.category,
          description: entity.attributes.description,
          available: entity.state === 'available',
        });
      }
    });

    return rewards;
  }

  // Render the card
  render() {
    if (!this.config) return;

    const children = this.getChildrenData();
    const rewards = this.config.show_rewards ? this.getRewardsData() : [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .card {
          background: var(--card-background-color, #fff);
          border-radius: 8px;
          box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
          padding: 16px;
        }
        
        .card-header {
          font-size: 1.2em;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--primary-text-color);
        }
        
        .no-data {
          text-align: center;
          color: var(--secondary-text-color);
          padding: 20px;
        }
        
        .add-child-button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin: 8px;
        }
        
        .add-child-button:hover {
          opacity: 0.8;
        }
        
        .child-section {
          margin-bottom: 24px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          padding: 16px;
          background: var(--card-background-color);
        }
        
        .child-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .child-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .child-avatar {
          font-size: 24px;
        }
        
        .child-name {
          font-size: 1.1em;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        .child-stats {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: var(--secondary-text-color);
        }
        
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }
        
        .task-card {
          border: 1px solid var(--divider-color);
          border-radius: 6px;
          padding: 12px;
          background: var(--primary-background-color);
        }
        
        .task-card.status-todo {
          border-left: 4px solid var(--info-color, #2196F3);
        }
        
        .task-card.status-pending-validation {
          border-left: 4px solid var(--warning-color, #FF9800);
        }
        
        .task-card.status-completed {
          border-left: 4px solid var(--success-color, #4CAF50);
          opacity: 0.8;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .task-name {
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        .task-points {
          background: var(--accent-color, #FF5722);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .task-actions {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-top: 8px;
        }
        
        .action-button {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }
        
        .action-button.complete {
          background: var(--success-color, #4CAF50);
          color: white;
        }
        
        .action-button.validate {
          background: var(--warning-color, #FF9800);
          color: white;
        }
        
        .action-button.reset {
          background: var(--error-color, #F44336);
          color: white;
        }
        
        .task-completed {
          color: var(--success-color, #4CAF50);
          font-weight: 500;
        }
      </style>
      
      <div class="card">
        <div class="card-header">${this.config.title}</div>
        
        ${children.length === 0 ? `
          <div class="no-data">
            <p>Aucun enfant trouvé. Commencez par ajouter votre premier enfant !</p>
            <button class="add-child-button" onclick="this.getRootNode().host.handleAction('add_child')">
              Ajouter votre premier enfant
            </button>
          </div>
        ` : `
          ${children.map(child => `
            <div class="child-section">
              <div class="child-header">
                <div class="child-info">
                  ${child.avatar ? `<span class="child-avatar">${child.avatar}</span>` : ''}
                  <div class="child-name">${child.name}</div>
                  <div class="child-stats">
                    <span>${child.points} points</span>
                    <span>Niveau ${child.level}</span>
                  </div>
                </div>
              </div>
              
              <div class="tasks-grid">
                ${child.tasks.map(task => `
                  <div class="task-card status-${task.status.replace(/\s+/g, '-').toLowerCase()}">
                    <div class="task-header">
                      <span class="task-name">${task.name}</span>
                      <span class="task-points">+${task.points}pts</span>
                    </div>
                    
                    <div class="task-actions">
                      ${task.status === 'todo' ? `
                        <button class="action-button complete" 
                          onclick="this.getRootNode().host.handleAction('complete_task', {taskId: '${task.id}'})">
                          Terminer
                        </button>
                      ` : ''}
                      
                      ${task.status === 'pending_validation' ? `
                        <button class="action-button validate" 
                          onclick="this.getRootNode().host.handleAction('validate_task', {taskId: '${task.id}'})">
                          Valider
                        </button>
                        <button class="action-button reset" 
                          onclick="this.getRootNode().host.handleAction('reset_task', {taskId: '${task.id}'})">
                          Recommencer
                        </button>
                      ` : ''}
                      
                      ${task.status === 'completed' ? `
                        <div class="task-completed">✓ Terminé</div>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
          
          <button class="add-child-button" onclick="this.getRootNode().host.handleAction('add_child')">
            Ajouter un enfant
          </button>
        `}
      </div>
    `;
  }
}

// Register the card
customElements.define('kids-tasks-card', KidsTasksCard);

// Add to custom card registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'kids-tasks-card',
  name: 'Kids Tasks Card',
  description: 'A custom card for managing children\'s tasks and rewards',
  preview: true,
  documentationURL: 'https://github.com/astrayel/kids-tasks-card',
});