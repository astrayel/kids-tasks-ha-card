// Accessibility Enhancement System for Kids Tasks Cards

import logger from './logger.js';

class KidsTasksAccessibility {
  constructor() {
    this.focusableElements = [];
    this.announcements = [];
    this.keyboardNavigation = new Map();
    this.setupGlobalAccessibility();
  }

  // Setup global accessibility features
  setupGlobalAccessibility() {
    // Create screen reader announcement region
    this.createAnnouncementRegion();
    
    // Setup global keyboard navigation
    this.setupGlobalKeyboardHandling();
    
    // Monitor for new cards
    this.observeCardElements();
  }

  // Create ARIA live region for announcements
  createAnnouncementRegion() {
    if (document.getElementById('kt-announcements')) return;

    const announceRegion = document.createElement('div');
    announceRegion.id = 'kt-announcements';
    announceRegion.setAttribute('aria-live', 'polite');
    announceRegion.setAttribute('aria-atomic', 'true');
    announceRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(announceRegion);
  }

  // Announce messages to screen readers
  announce(message, priority = 'polite') {
    const region = document.getElementById('kt-announcements');
    if (!region) return;

    // Set priority level
    region.setAttribute('aria-live', priority);
    
    // Clear and set message
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
      logger.debug(`Accessibility announcement: ${message}`);
    }, 100);

    // Track announcements
    this.announcements.push({
      message,
      priority,
      timestamp: Date.now()
    });

    // Keep only last 10 announcements
    if (this.announcements.length > 10) {
      this.announcements.shift();
    }
  }

  // Setup global keyboard handling
  setupGlobalKeyboardHandling() {
    document.addEventListener('keydown', (event) => {
      this.handleGlobalKeyboard(event);
    });
  }

  // Handle global keyboard events
  handleGlobalKeyboard(event) {
    const activeCard = event.target.closest('kids-tasks-card, kids-tasks-child-card');
    if (!activeCard) return;

    // F1: Show help/shortcuts
    if (event.key === 'F1') {
      event.preventDefault();
      this.showKeyboardHelp(activeCard);
      return;
    }

    // Escape: Close modals/overlays
    if (event.key === 'Escape') {
      this.handleEscape(activeCard);
      return;
    }

    // Tab navigation enhancement
    if (event.key === 'Tab') {
      this.handleTabNavigation(event, activeCard);
      return;
    }
  }

  // Show keyboard shortcuts help
  showKeyboardHelp(card) {
    const helpModal = this.createHelpModal();
    card.shadowRoot.appendChild(helpModal);
    
    // Focus first button
    const firstButton = helpModal.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }

    this.announce('Keyboard shortcuts help opened', 'assertive');
  }

  // Create help modal
  createHelpModal() {
    const modal = document.createElement('div');
    modal.className = 'kt-help-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'help-title');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="kt-help-overlay" onclick="this.closest('.kt-help-modal').remove()"></div>
      <div class="kt-help-content">
        <h2 id="help-title">Keyboard Shortcuts</h2>
        <div class="kt-help-shortcuts">
          <div class="kt-shortcut">
            <kbd>Tab</kbd>
            <span>Navigate between interactive elements</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Space</kbd> / <kbd>Enter</kbd>
            <span>Activate buttons and links</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Arrow Keys</kbd>
            <span>Navigate within lists and tabs</span>
          </div>
          <div class="kt-shortcut">
            <kbd>Escape</kbd>
            <span>Close modal or cancel action</span>
          </div>
          <div class="kt-shortcut">
            <kbd>F1</kbd>
            <span>Show this help</span>
          </div>
        </div>
        <div class="kt-help-actions">
          <button class="kt-btn kt-btn--primary" onclick="this.closest('.kt-help-modal').remove()">
            Close Help
          </button>
        </div>
      </div>
      <style>
        .kt-help-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kt-help-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        .kt-help-content {
          position: relative;
          background: white;
          border-radius: 8px;
          padding: 24px;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .kt-help-content h2 {
          margin: 0 0 16px 0;
          font-size: 1.25em;
          color: var(--kt-text, #1f2937);
        }
        .kt-help-shortcuts {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .kt-shortcut {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }
        .kt-shortcut kbd {
          background: var(--kt-surface-variant, #f3f4f6);
          border: 1px solid var(--kt-border, #d1d5db);
          border-radius: 4px;
          padding: 4px 8px;
          font-family: monospace;
          font-size: 0.9em;
          min-width: 80px;
          text-align: center;
        }
        .kt-shortcut span {
          color: var(--kt-text-secondary, #6b7280);
          flex: 1;
        }
        .kt-help-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
      </style>
    `;

    return modal;
  }

  // Handle escape key
  handleEscape(card) {
    // Close any open modals
    const modals = card.shadowRoot.querySelectorAll('.kt-help-modal, .kt-modal');
    if (modals.length > 0) {
      modals[modals.length - 1].remove();
      this.announce('Modal closed');
      return;
    }

    // Cancel any pending delete confirmations
    const confirmations = card.shadowRoot.querySelectorAll('.kt-delete-confirmation');
    confirmations.forEach(conf => conf.remove());
    
    if (confirmations.length > 0) {
      this.announce('Action cancelled');
    }
  }

  // Enhanced tab navigation
  handleTabNavigation(event, card) {
    const focusableElements = this.getFocusableElements(card.shadowRoot);
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    if (event.shiftKey) {
      // Shift+Tab: go backwards
      if (currentIndex === 0) {
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      }
    } else {
      // Tab: go forwards  
      if (currentIndex === focusableElements.length - 1) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    }
  }

  // Get all focusable elements in container
  getFocusableElements(container) {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(container.querySelectorAll(selectors.join(', ')))
      .filter(el => {
        const style = getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
  }

  // Observe for new card elements
  observeCardElements() {
    if (typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const cards = node.matches('kids-tasks-card, kids-tasks-child-card') 
              ? [node] 
              : Array.from(node.querySelectorAll('kids-tasks-card, kids-tasks-child-card'));
            
            cards.forEach(card => this.enhanceCardAccessibility(card));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Enhance individual card accessibility
  enhanceCardAccessibility(card) {
    if (!card.shadowRoot) return;

    // Add ARIA labels and roles
    this.addAriaLabels(card);
    
    // Setup keyboard navigation
    this.setupCardKeyboardNavigation(card);
    
    // Add focus management
    this.setupFocusManagement(card);
    
    logger.debug('Enhanced accessibility for', card.constructor.name);
  }

  // Add ARIA labels and roles
  addAriaLabels(card) {
    const shadowRoot = card.shadowRoot;

    // Main card container
    const cardContent = shadowRoot.querySelector('.card-content');
    if (cardContent && !cardContent.getAttribute('role')) {
      cardContent.setAttribute('role', 'region');
      cardContent.setAttribute('aria-label', card.config?.title || 'Kids Tasks Card');
    }

    // Navigation tabs
    const tabs = shadowRoot.querySelectorAll('.nav-button');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    });

    // Task/reward items
    const items = shadowRoot.querySelectorAll('.task-item, .reward-item, .child-card');
    items.forEach(item => {
      if (!item.getAttribute('role')) {
        item.setAttribute('role', 'article');
      }
      
      // Add accessible names
      const title = item.querySelector('.task-title, .reward-name, .child-name');
      if (title && !item.getAttribute('aria-label')) {
        item.setAttribute('aria-label', title.textContent);
      }
    });

    // Progress bars
    const progressBars = shadowRoot.querySelectorAll('.progress-fill');
    progressBars.forEach(progress => {
      const progressValue = progress.style.width || '0%';
      progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-valuenow', parseInt(progressValue));
      progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100');
      progress.setAttribute('aria-label', `Progress: ${progressValue}`);
    });
  }

  // Setup card-specific keyboard navigation
  setupCardKeyboardNavigation(card) {
    const shadowRoot = card.shadowRoot;

    // Arrow key navigation for tabs
    const tabs = shadowRoot.querySelectorAll('.nav-button[role="tab"]');
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (event) => {
        let newIndex;
        
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            newIndex = index > 0 ? index - 1 : tabs.length - 1;
            this.focusTab(tabs[newIndex]);
            break;
          case 'ArrowRight':
            event.preventDefault();
            newIndex = index < tabs.length - 1 ? index + 1 : 0;
            this.focusTab(tabs[newIndex]);
            break;
          case 'Home':
            event.preventDefault();
            this.focusTab(tabs[0]);
            break;
          case 'End':
            event.preventDefault();
            this.focusTab(tabs[tabs.length - 1]);
            break;
        }
      });
    });
  }

  // Focus tab and announce
  focusTab(tab) {
    // Update tabindex
    const allTabs = tab.parentNode.querySelectorAll('[role="tab"]');
    allTabs.forEach(t => t.setAttribute('tabindex', '-1'));
    tab.setAttribute('tabindex', '0');
    
    // Focus and announce
    tab.focus();
    this.announce(`${tab.textContent} tab selected`);
  }

  // Setup focus management
  setupFocusManagement(card) {
    const shadowRoot = card.shadowRoot;

    // Focus visible elements on interaction
    shadowRoot.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target && target.tagName === 'BUTTON') {
        // Announce button actions
        const action = target.dataset.action;
        const actionText = this.getActionAnnouncement(action, target);
        if (actionText) {
          this.announce(actionText);
        }
      }
    });

    // Skip to content functionality
    this.addSkipLinks(card);
  }

  // Add skip navigation links
  addSkipLinks(card) {
    const shadowRoot = card.shadowRoot;
    const cardContent = shadowRoot.querySelector('.card-content');
    if (!cardContent) return;

    const skipLink = document.createElement('a');
    skipLink.textContent = 'Skip to main content';
    skipLink.href = '#';
    skipLink.className = 'kt-skip-link';
    skipLink.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: 6px;
        top: 6px;
        width: auto;
        height: auto;
        overflow: visible;
        z-index: 1000;
        padding: 8px 12px;
        background: var(--kt-primary, #2563eb);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
      `;
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
    });

    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const mainContent = shadowRoot.querySelector('.main-content');
      if (mainContent) {
        mainContent.focus();
        this.announce('Skipped to main content');
      }
    });

    cardContent.insertBefore(skipLink, cardContent.firstChild);
  }

  // Get announcement text for actions
  getActionAnnouncement(action, element) {
    const actionMap = {
      'complete-task': 'Task completed',
      'uncomplete-task': 'Task marked as incomplete', 
      'claim-reward': 'Reward claimed',
      'validate-task': 'Task validated',
      'delete-task': 'Task deleted',
      'filter': `Filter applied: ${element.textContent}`,
      'switch-tab': `Switched to ${element.textContent} tab`,
      'view-child': `Viewing ${element.dataset.id} details`
    };

    return actionMap[action] || null;
  }

  // Public API for components
  announceToUser(message, priority = 'polite') {
    this.announce(message, priority);
  }

  enhanceCard(card) {
    this.enhanceCardAccessibility(card);
  }
}

// Global accessibility instance
const accessibility = new KidsTasksAccessibility();

// Export for use in components
export { KidsTasksAccessibility, accessibility };
export default accessibility;