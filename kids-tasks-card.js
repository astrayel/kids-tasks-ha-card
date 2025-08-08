/**
 * Kids Tasks Card - Lovelace custom card for Kids Tasks Manager integration
 * 
 * This card provides a comprehensive interface for managing children's tasks,
 * tracking progress, and handling rewards within Home Assistant.
 * 
 * @version 1.0.0
 * @author Kids Tasks Card Team
 * @license MIT
 */

import {
  LitElement,
  html,
  css,
  nothing,
} from "https://unpkg.com/lit@2.8.0/index.js?module";
import {
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from "https://unpkg.com/custom-card-helpers@1.9.0/dist/index.js?module";

// Card version for console logging
const CARD_VERSION = "1.0.0";
console.info(
  `%c  KIDS-TASKS-CARD \n%c  Version ${CARD_VERSION}    `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray"
);

// Main card class
class KidsTasksCard extends LitElement {
  constructor() {
    super();
    this.addEventListener('click', this._handleClick.bind(this));
  }

  // Define card properties
  static get properties() {
    return {
      hass: {},
      config: {},
      _helpers: {},
    };
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
  }

  // Get card size
  getCardSize() {
    return 6;
  }

  // Check if card should update
  shouldUpdate(changedProps) {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // Updated lifecycle
  updated(changedProps) {
    super.updated(changedProps);
    
    if (
      !this._helpers ||
      (changedProps.has('hass') && this.hass.language !== changedProps.get('hass')?.language)
    ) {
      this._loadHelpers();
    }
  }

  // Load card helpers
  async _loadHelpers() {
    this._helpers = await window.loadCardHelpers();
  }

  // Handle card clicks
  _handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const entityId = target.dataset.entityId;
    
    this._executeAction(action, entityId, target.dataset);
  }

  // Execute actions (service calls)
  async _executeAction(action, entityId, data = {}) {
    if (!this.hass) return;

    try {
      switch (action) {
        case 'complete_task':
          await this.hass.callService('kids_tasks', 'complete_task', {
            task_id: data.taskId,
          });
          break;
          
        case 'validate_task':
          await this.hass.callService('kids_tasks', 'validate_task', {
            task_id: data.taskId,
          });
          break;
          
        case 'claim_reward':
          await this.hass.callService('kids_tasks', 'claim_reward', {
            reward_id: data.rewardId,
            child_id: data.childId,
          });
          break;
          
        case 'reset_task':
          await this.hass.callService('kids_tasks', 'reset_task', {
            task_id: data.taskId,
          });
          break;
          
        default:
          console.warn('Unknown action:', action);
      }
    } catch (error) {
      console.error('Action failed:', error);
      // You could show a notification here
    }
  }

  // Get children data from Home Assistant entities
  _getChildrenData() {
    if (!this.hass) return [];

    const entities = this.hass.states;
    const children = [];

    // Find child entities (sensors with kids_tasks domain)
    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_')) {
        const entity = entities[entityId];
        if (entity.attributes.type === 'child') {
          children.push({
            id: entity.attributes.child_id,
            name: entity.attributes.friendly_name,
            points: entity.state,
            level: entity.attributes.level,
            avatar: entity.attributes.avatar,
            tasks: this._getChildTasks(entity.attributes.child_id),
          });
        }
      }
    });

    return children;
  }

  // Get tasks for a specific child
  _getChildTasks(childId) {
    if (!this.hass) return [];

    const entities = this.hass.states;
    const tasks = [];

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_task_')) {
        const entity = entities[entityId];
        if (entity.attributes.assigned_child_id === childId) {
          tasks.push({
            id: entity.attributes.task_id,
            name: entity.attributes.friendly_name,
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
  _getRewardsData() {
    if (!this.hass) return [];

    const entities = this.hass.states;
    const rewards = [];

    Object.keys(entities).forEach(entityId => {
      if (entityId.startsWith('sensor.kids_tasks_reward_')) {
        const entity = entities[entityId];
        rewards.push({
          id: entity.attributes.reward_id,
          name: entity.attributes.friendly_name,
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
    if (!this.config || !this.hass) {
      return html``;
    }

    const children = this._getChildrenData();
    const rewards = this.config.show_rewards ? this._getRewardsData() : [];

    return html`
      <ha-card header="${this.config.title}">
        <div class="card-content">
          ${children.length === 0
            ? html`<div class="no-data">No children found. Make sure the Kids Tasks integration is configured.</div>`
            : children.map(child => this._renderChild(child))
          }
          
          ${this.config.show_rewards && rewards.length > 0
            ? html`
              <div class="rewards-section">
                <h3>Available Rewards</h3>
                ${rewards.map(reward => this._renderReward(reward))}
              </div>
            `
            : nothing
          }
        </div>
      </ha-card>
    `;
  }

  // Render individual child
  _renderChild(child) {
    return html`
      <div class="child-section">
        <div class="child-header">
          <div class="child-info">
            ${child.avatar ? html`<span class="child-avatar">${child.avatar}</span>` : nothing}
            <h3>${child.name}</h3>
            <div class="child-stats">
              <span class="points">${child.points} points</span>
              <span class="level">Level ${child.level}</span>
            </div>
          </div>
        </div>
        
        <div class="tasks-grid">
          ${child.tasks.map(task => this._renderTask(task, child.id))}
        </div>
      </div>
    `;
  }

  // Render individual task
  _renderTask(task, childId) {
    const statusClass = task.status.replace(/\s+/g, '-').toLowerCase();
    
    return html`
      <div class="task-card status-${statusClass}">
        <div class="task-header">
          <span class="task-name">${task.name}</span>
          <span class="task-points">+${task.points}pts</span>
        </div>
        
        ${task.description ? html`<div class="task-description">${task.description}</div>` : nothing}
        
        <div class="task-actions">
          ${task.status === 'todo'
            ? html`
              <button
                class="action-button complete"
                data-action="complete_task"
                data-task-id="${task.id}"
              >
                Complete
              </button>
            `
            : nothing
          }
          
          ${task.status === 'pending_validation'
            ? html`
              <button
                class="action-button validate"
                data-action="validate_task" 
                data-task-id="${task.id}"
              >
                Validate
              </button>
              <button
                class="action-button reset"
                data-action="reset_task"
                data-task-id="${task.id}"
              >
                Reset
              </button>
            `
            : nothing
          }
          
          ${task.status === 'completed'
            ? html`<div class="task-completed">✓ Completed</div>`
            : nothing
          }
        </div>
      </div>
    `;
  }

  // Render individual reward
  _renderReward(reward) {
    return html`
      <div class="reward-card ${reward.available ? 'available' : 'unavailable'}">
        <div class="reward-header">
          <span class="reward-name">${reward.name}</span>
          <span class="reward-cost">${reward.cost} points</span>
        </div>
        
        ${reward.description ? html`<div class="reward-description">${reward.description}</div>` : nothing}
        
        ${reward.available
          ? html`
            <button
              class="action-button claim"
              data-action="claim_reward"
              data-reward-id="${reward.id}"
            >
              Claim Reward
            </button>
          `
          : html`<div class="reward-unavailable">Not Available</div>`
        }
      </div>
    `;
  }

  // Card styles
  static get styles() {
    return css`
      .card-content {
        padding: 16px;
      }

      .no-data {
        text-align: center;
        color: var(--secondary-text-color);
        padding: 20px;
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

      .child-info h3 {
        margin: 0;
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
        border-left: 4px solid var(--info-color);
      }

      .task-card.status-pending-validation {
        border-left: 4px solid var(--warning-color);
      }

      .task-card.status-completed {
        border-left: 4px solid var(--success-color);
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
        background: var(--accent-color);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .task-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }

      .task-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .action-button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .action-button.complete {
        background: var(--success-color);
        color: white;
      }

      .action-button.complete:hover {
        background: var(--success-color);
        opacity: 0.8;
      }

      .action-button.validate {
        background: var(--warning-color);
        color: white;
      }

      .action-button.validate:hover {
        background: var(--warning-color);
        opacity: 0.8;
      }

      .action-button.reset {
        background: var(--error-color);
        color: white;
      }

      .action-button.reset:hover {
        background: var(--error-color);
        opacity: 0.8;
      }

      .action-button.claim {
        background: var(--primary-color);
        color: white;
      }

      .action-button.claim:hover {
        background: var(--primary-color);
        opacity: 0.8;
      }

      .task-completed {
        color: var(--success-color);
        font-weight: 500;
        font-size: 14px;
      }

      .rewards-section {
        margin-top: 24px;
        border-top: 1px solid var(--divider-color);
        padding-top: 16px;
      }

      .rewards-section h3 {
        margin: 0 0 16px 0;
        color: var(--primary-text-color);
      }

      .reward-card {
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
        background: var(--primary-background-color);
      }

      .reward-card.unavailable {
        opacity: 0.6;
      }

      .reward-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .reward-name {
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .reward-cost {
        background: var(--accent-color);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }

      .reward-description {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
      }

      .reward-unavailable {
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 14px;
      }
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