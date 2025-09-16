// Error Boundary System for Kids Tasks Cards

import logger from './logger.js';

class KidsTasksErrorBoundary {
  constructor() {
    this.errors = new Map(); // Track errors by component
    this.retryAttempts = new Map(); // Track retry counts
    this.setupGlobalErrorHandling();
  }

  // Setup global error handling
  setupGlobalErrorHandling() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error, event.filename, event.lineno);
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason, 'Promise', 0);
      event.preventDefault(); // Prevent console spam
    });
  }

  // Handle global errors
  handleGlobalError(error, source = 'Unknown', line = 0) {
    // Only handle errors from our components
    if (source && !source.includes('kids-tasks') && !source.includes('KidsTask')) {
      return;
    }

    logger.error(`Global error caught: ${error.message || error}`, {
      source,
      line,
      stack: error.stack
    });

    // Try to gracefully recover
    this.attemptRecovery(error);
  }

  // Wrap component methods with error boundary
  wrapComponent(component, methodName) {
    const originalMethod = component[methodName];
    if (!originalMethod) return;

    const componentKey = `${component.constructor.name}.${methodName}`;

    component[methodName] = (...args) => {
      try {
        return originalMethod.apply(component, args);
      } catch (error) {
        return this.handleComponentError(component, methodName, error, args);
      }
    };
  }

  // Handle component-specific errors
  handleComponentError(component, methodName, error, args = []) {
    const componentKey = `${component.constructor.name}.${methodName}`;
    const errorKey = `${componentKey}:${error.message}`;

    // Track error occurrence
    const errorCount = (this.errors.get(errorKey) || 0) + 1;
    this.errors.set(errorKey, errorCount);

    logger.error(`Component error in ${componentKey}:`, error);

    // Implement error recovery strategies
    return this.recoverFromError(component, methodName, error, errorCount);
  }

  // Error recovery strategies
  recoverFromError(component, methodName, error, errorCount) {
    const componentKey = component.constructor.name;

    // Strategy 1: Retry with exponential backoff (up to 3 attempts)
    if (errorCount <= 3 && methodName !== 'render') {
      const delay = Math.pow(2, errorCount) * 100; // 100ms, 200ms, 400ms
      setTimeout(() => {
        try {
          logger.debug(`Retrying ${componentKey}.${methodName} (attempt ${errorCount})`);
          component[methodName]?.();
        } catch (retryError) {
          logger.warn(`Retry failed for ${componentKey}.${methodName}:`, retryError);
        }
      }, delay);
      return null;
    }

    // Strategy 2: Fallback rendering for render errors
    if (methodName === 'render' || methodName === 'smartRender') {
      return this.renderErrorFallback(component, error);
    }

    // Strategy 3: Safe mode for critical errors
    if (errorCount > 5) {
      this.enterSafeMode(component, error);
      return null;
    }

    // Strategy 4: Reset component state
    if (methodName.includes('set') || methodName.includes('update')) {
      return this.resetComponentState(component, error);
    }

    return null;
  }

  // Render error fallback UI
  renderErrorFallback(component, error) {
    if (!component.shadowRoot) return;

    const errorId = Date.now().toString(36);
    const isRetryable = !error.message.includes('fatal');

    component.shadowRoot.innerHTML = `
      <div class="kt-error-boundary" data-error-id="${errorId}">
        <style>
          .kt-error-boundary {
            padding: var(--kt-space-lg, 16px);
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 1px solid #fca5a5;
            border-radius: var(--kt-radius-md, 8px);
            color: var(--kt-error, #dc2626);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .kt-error-title {
            font-size: 1.1em;
            font-weight: 600;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .kt-error-message {
            font-size: 0.9em;
            margin: 0 0 16px 0;
            opacity: 0.8;
            line-height: 1.4;
          }
          .kt-error-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .kt-error-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            transition: all 0.2s;
          }
          .kt-error-btn--retry {
            background: var(--kt-primary, #2563eb);
            color: white;
          }
          .kt-error-btn--retry:hover {
            background: var(--kt-primary-dark, #1d4ed8);
          }
          .kt-error-btn--reset {
            background: var(--kt-surface-variant, #f3f4f6);
            color: var(--kt-text, #374151);
          }
          .kt-error-btn--reset:hover {
            background: var(--kt-surface-hover, #e5e7eb);
          }
          .kt-error-details {
            margin-top: 12px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.8em;
            display: none;
          }
          .kt-error-toggle {
            color: var(--kt-primary, #2563eb);
            text-decoration: underline;
            cursor: pointer;
            font-size: 0.8em;
          }
          @media (max-width: 480px) {
            .kt-error-boundary {
              padding: 12px;
            }
            .kt-error-actions {
              flex-direction: column;
            }
            .kt-error-btn {
              width: 100%;
              text-align: center;
            }
          }
        </style>
        
        <div class="kt-error-title">
          ⚠️ Oops! Something went wrong
        </div>
        
        <div class="kt-error-message">
          We encountered an issue loading this card. This is usually temporary.
        </div>
        
        <div class="kt-error-actions">
          ${isRetryable ? `
            <button class="kt-error-btn kt-error-btn--retry" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('retry'))">
              🔄 Try Again
            </button>
          ` : ''}
          <button class="kt-error-btn kt-error-btn--reset" onclick="this.closest('.kt-error-boundary').dispatchEvent(new CustomEvent('reset'))">
            🔧 Reset Card
          </button>
          <span class="kt-error-toggle" onclick="
            const details = this.parentNode.parentNode.querySelector('.kt-error-details');
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
            this.textContent = details.style.display === 'block' ? 'Hide details' : 'Show details';
          ">Show details</span>
        </div>
        
        <div class="kt-error-details">
          <strong>Component:</strong> ${component.constructor.name}<br>
          <strong>Error:</strong> ${error.message}<br>
          <strong>Time:</strong> ${new Date().toLocaleString()}
        </div>
      </div>
    `;

    // Add error recovery event listeners
    const errorBoundary = component.shadowRoot.querySelector('.kt-error-boundary');
    
    errorBoundary.addEventListener('retry', () => {
      logger.debug('User requested retry for', component.constructor.name);
      component.smartRender?.(true) || component.render?.();
    });

    errorBoundary.addEventListener('reset', () => {
      logger.debug('User requested reset for', component.constructor.name);
      this.resetComponentState(component, error);
    });

    return errorBoundary;
  }

  // Reset component to safe state
  resetComponentState(component, error) {
    try {
      // Clear internal state
      if (component._lastRenderState) component._lastRenderState = null;
      if (component._refreshTimeout) {
        clearTimeout(component._refreshTimeout);
        component._refreshTimeout = null;
      }

      // Reset to default config
      if (component.setConfig && component.constructor.getStubConfig) {
        const defaultConfig = component.constructor.getStubConfig();
        component.setConfig(defaultConfig);
      }

      logger.info(`Reset component state for ${component.constructor.name}`);

      // Try to render again
      setTimeout(() => {
        component.smartRender?.(true) || component.render?.();
      }, 100);

    } catch (resetError) {
      logger.error('Failed to reset component state:', resetError);
      this.enterSafeMode(component, resetError);
    }
  }

  // Enter safe mode (minimal functionality)
  enterSafeMode(component, error) {
    logger.warn(`Entering safe mode for ${component.constructor.name}`);

    if (component.shadowRoot) {
      component.shadowRoot.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #666;">
          <div style="font-size: 2em; margin-bottom: 8px;">🛡️</div>
          <div style="font-weight: bold; margin-bottom: 4px;">Safe Mode</div>
          <div style="font-size: 0.9em;">This card is experiencing issues and has been disabled for stability.</div>
        </div>
      `;
    }
  }

  // Attempt automatic recovery
  attemptRecovery(error) {
    // Find affected components
    const cards = document.querySelectorAll('kids-tasks-card, kids-tasks-child-card');
    
    cards.forEach(card => {
      if (card.shadowRoot && card.shadowRoot.innerHTML.includes('kt-error-boundary')) {
        // Card already in error state, try to recover
        setTimeout(() => {
          if (card.smartRender) {
            card.smartRender(true);
          }
        }, 2000);
      }
    });
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      totalErrors: 0,
      errorsByComponent: {},
      recentErrors: []
    };

    for (const [errorKey, count] of this.errors.entries()) {
      const [component] = errorKey.split('.');
      stats.totalErrors += count;
      stats.errorsByComponent[component] = (stats.errorsByComponent[component] || 0) + count;
    }

    return stats;
  }

  // Clear error history
  clearErrors() {
    this.errors.clear();
    this.retryAttempts.clear();
    logger.info('Error history cleared');
  }
}

// Global error boundary instance
const errorBoundary = new KidsTasksErrorBoundary();

// Auto-wrap common methods
export function withErrorBoundary(component) {
  const methodsToWrap = ['render', 'setConfig', 'set hass', 'handleAction', 'connectedCallback'];
  
  methodsToWrap.forEach(method => {
    errorBoundary.wrapComponent(component, method);
  });
  
  return component;
}

export { KidsTasksErrorBoundary, errorBoundary };
export default errorBoundary;