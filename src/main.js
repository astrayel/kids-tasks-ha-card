// Kids Tasks Card v2.0 - Main Entry Point
// This file imports all modular components and registers them with Home Assistant

import { KidsTasksStyleManagerV2 as KidsTasksStyleManager } from './style-manager-v2.js';
import { KidsTasksUtils } from './utils.js';
import { KidsTasksBaseCard } from './base-card.js';
import { KidsTasksCard } from './card-optimized.js';
import { KidsTasksChildCard } from './child-card.js';
import { 
  KidsTasksCardEditor, 
  KidsTasksChildCardEditor 
} from './editors.js';
import logger from './logger.js';
import performanceMonitor from './performance-monitor.js';
import errorBoundary, { withErrorBoundary } from './error-boundary.js';
import accessibility from './accessibility.js';

// Development logging
if (__DEV__) {
  logger.info('🛠️ Kids Tasks Card - Development Mode');
  logger.info('📦 Loading modular components...');
}

// Initialize global styles
KidsTasksStyleManager.injectGlobalStyles();

// Make utilities globally available for components
window.KidsTasksUtils = KidsTasksUtils;
window.KidsTasksStyleManager = KidsTasksStyleManager;

// Register custom elements with error boundaries
// Use -dev suffix in development to avoid conflicts with production
const cardSuffix = __DEV__ ? '-dev' : '';
const mainCardType = `kids-tasks-card${cardSuffix}`;
const childCardType = `kids-tasks-child-card${cardSuffix}`;

customElements.define(mainCardType, withErrorBoundary(KidsTasksCard));
customElements.define(childCardType, withErrorBoundary(KidsTasksChildCard));
customElements.define(`kids-tasks-card-editor${cardSuffix}`, KidsTasksCardEditor);
customElements.define(`kids-tasks-child-card-editor${cardSuffix}`, KidsTasksChildCardEditor);

// Register with Home Assistant card picker
window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: mainCardType,
    name: `Kids Tasks Card${__DEV__ ? ' (Dev)' : ''}`,
    description: 'Manage children\'s tasks and rewards with an engaging interface',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  },
  {
    type: childCardType,
    name: `Kids Tasks Child Card${__DEV__ ? ' (Dev)' : ''}`,
    description: 'Individual child view for tasks and rewards',
    preview: true,
    documentationURL: 'https://github.com/astrayel/kids-tasks-card'
  }
);

// Development hot reload support
if (__DEV__ && typeof window !== 'undefined') {
  // Enable hot reload in development
  window.addEventListener('beforeunload', () => {
    logger.debug('🔄 Kids Tasks Card - Hot reload triggered');
  });
  
  // Auto-reload when served from development server
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    let reloadCheckInterval;
    let lastModified = Date.now();
    
    // Check for updates every 2 seconds
    const checkForUpdates = async () => {
      try {
        const response = await fetch(window.location.href, { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        
        const newLastModified = response.headers.get('last-modified');
        if (newLastModified && newLastModified !== lastModified) {
          logger.debug('🔄 Hot reload: File changed, reloading...');
          window.location.reload();
        }
      } catch (error) {
        // Ignore network errors during development
      }
    };
    
    // Start checking after a delay to avoid initial false positives
    setTimeout(() => {
      reloadCheckInterval = setInterval(checkForUpdates, 2000);
    }, 5000);
    
    // Clean up interval on unload
    window.addEventListener('beforeunload', () => {
      if (reloadCheckInterval) {
        clearInterval(reloadCheckInterval);
      }
    });
  }
  
  // Listen for Rollup live reload messages
  if (typeof EventSource !== 'undefined') {
    try {
      const eventSource = new EventSource('http://localhost:35729/livereload');
      eventSource.onmessage = function(event) {
        if (event.data === 'reload') {
          logger.debug('🔄 Live reload triggered');
          window.location.reload();
        }
      };
      
      eventSource.onerror = function() {
        // Silently ignore - live reload server might not be running
        eventSource.close();
      };
    } catch (error) {
      // Live reload not available, use fallback polling
    }
  }
  
  // Expose components for debugging
  window.KidsTasksCard = KidsTasksCard;
  window.KidsTasksChildCard = KidsTasksChildCard;
  window.KidsTasksBaseCard = KidsTasksBaseCard;
  
  // Development utilities
  window.KidsTasksDebug = {
    reloadCard: (cardElement) => {
      if (cardElement && cardElement.setConfig && cardElement.hass) {
        cardElement.setConfig(cardElement.config);
        cardElement.hass = cardElement.hass;
        logger.debug('🔄 Card reloaded manually');
      }
    },
    
    reloadAllCards: () => {
      const selector = __DEV__ ? 'kids-tasks-card-dev, kids-tasks-child-card-dev' : 'kids-tasks-card, kids-tasks-child-card';
      document.querySelectorAll(selector).forEach(card => {
        window.KidsTasksDebug.reloadCard(card);
      });
      logger.debug('🔄 All cards reloaded');
    },
    
    inspectCard: (cardElement) => {
      logger.debug('🔍 Card inspection:', {
        element: cardElement,
        config: cardElement.config,
        hass: cardElement._hass,
        children: cardElement.getChildren?.()
      });
    },

    // Performance debugging
    performance: {
      report: () => performanceMonitor?.generateReport(),
      toggle: () => performanceMonitor?.toggle(),
      clear: () => performanceMonitor?.destroy()
    },

    // Error debugging  
    errors: {
      stats: () => errorBoundary.getErrorStats(),
      clear: () => errorBoundary.clearErrors()
    },

    // Accessibility debugging
    accessibility: {
      enhance: (card) => accessibility.enhanceCard(card),
      announce: (message) => accessibility.announceToUser(message)
    },

    // System info
    systemInfo: () => {
      const selector = __DEV__ ? 'kids-tasks-card-dev, kids-tasks-child-card-dev' : 'kids-tasks-card, kids-tasks-child-card';
      return {
        cards: document.querySelectorAll(selector).length,
        performance: performanceMonitor?.generateReport()?.summary,
        errors: errorBoundary.getErrorStats(),
        memory: performance.memory ? {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
        } : null
      };
    }
  };
  
  logger.info('🛠️ Development utilities available as window.KidsTasksDebug');
}

// Version info
const version = process.env.VERSION || '2.0.0';
const mode = __PROD__ ? 'production' : 'development';

logger.info(`Kids Tasks Card v${version} loaded successfully!`);

if (__DEV__) {
  logger.info('🎯 Mode: Development with hot reload');
  logger.info('🏗️ Architecture: Modular ES6 components');
  logger.info('⚡ Performance: Optimized rendering pipeline');
  logger.info('🎨 Styles: Consolidated CSS variables');
}

// Export for potential external use
export {
  KidsTasksCard,
  KidsTasksChildCard,
  KidsTasksBaseCard,
  KidsTasksStyleManager,
  KidsTasksUtils
};