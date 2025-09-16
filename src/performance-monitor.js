// Performance Monitoring and Profiling System

class KidsTasksPerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTimes: [],
      domUpdates: [],
      eventHandlers: [],
      memoryUsage: [],
      componentCounts: {}
    };
    
    this.observers = {
      mutation: null,
      performance: null,
      resize: null
    };
    
    this.isEnabled = __DEV__ || localStorage.getItem('kt-debug-performance') === 'true';
    this.startTime = performance.now();
    
    if (this.isEnabled) {
      this.initializeMonitoring();
    }
  }

  // Initialize performance monitoring
  initializeMonitoring() {
    this.setupMutationObserver();
    this.setupPerformanceObserver();
    this.setupMemoryMonitoring();
    
    if (__DEV__) {
      console.info('🔍 Performance monitoring enabled');
    }
  }

  // Track render performance
  trackRender(componentName, startTime, endTime) {
    if (!this.isEnabled) return;
    
    const renderTime = endTime - startTime;
    this.metrics.renderTimes.push({
      component: componentName,
      duration: renderTime,
      timestamp: Date.now()
    });

    // Keep only last 100 render measurements
    if (this.metrics.renderTimes.length > 100) {
      this.metrics.renderTimes.shift();
    }

    // Warn about slow renders (>16ms = below 60fps)
    if (renderTime > 16 && __DEV__) {
      console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  }

  // Track DOM updates
  trackDOMUpdate(operation, elementCount = 1) {
    if (!this.isEnabled) return;
    
    this.metrics.domUpdates.push({
      operation,
      elementCount,
      timestamp: Date.now()
    });

    // Keep only last 50 DOM updates
    if (this.metrics.domUpdates.length > 50) {
      this.metrics.domUpdates.shift();
    }
  }

  // Track event handler registrations
  trackEventHandler(event, component, action = 'add') {
    if (!this.isEnabled) return;
    
    this.metrics.eventHandlers.push({
      event,
      component,
      action,
      timestamp: Date.now()
    });

    // Count active event handlers
    if (!this.metrics.componentCounts[component]) {
      this.metrics.componentCounts[component] = { events: 0 };
    }
    
    this.metrics.componentCounts[component].events += action === 'add' ? 1 : -1;
  }

  // Setup mutation observer for DOM changes
  setupMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;
    
    this.observers.mutation = new MutationObserver((mutations) => {
      let totalChanges = 0;
      mutations.forEach(mutation => {
        totalChanges += mutation.addedNodes.length + mutation.removedNodes.length;
      });
      
      if (totalChanges > 0) {
        this.trackDOMUpdate('mutation', totalChanges);
      }
    });

    // Observe document changes
    this.observers.mutation.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }

  // Setup performance observer for long tasks
  setupPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') return;
    
    try {
      this.observers.performance = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      
      this.observers.performance.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      // Long task API not supported, skip
    }
  }

  // Memory monitoring
  setupMemoryMonitoring() {
    if (!performance.memory) return;
    
    const measureMemory = () => {
      if (!this.isEnabled) return;
      
      this.metrics.memoryUsage.push({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });

      // Keep only last 20 memory measurements
      if (this.metrics.memoryUsage.length > 20) {
        this.metrics.memoryUsage.shift();
      }
    };

    // Measure every 10 seconds
    setInterval(measureMemory, 10000);
    measureMemory(); // Initial measurement
  }

  // Render timing decorator
  wrapRender(component, originalRender) {
    if (!this.isEnabled) return originalRender;
    
    return function(...args) {
      const startTime = performance.now();
      const result = originalRender.apply(this, args);
      const endTime = performance.now();
      
      window.KidsTasksPerformanceMonitor?.trackRender(
        component.constructor.name, 
        startTime, 
        endTime
      );
      
      return result;
    };
  }

  // Generate performance report
  generateReport() {
    if (!this.isEnabled) return null;
    
    const now = Date.now();
    const last5Minutes = now - (5 * 60 * 1000);
    
    // Filter recent metrics
    const recentRenders = this.metrics.renderTimes.filter(r => r.timestamp > last5Minutes);
    const recentDOMUpdates = this.metrics.domUpdates.filter(d => d.timestamp > last5Minutes);
    const recentMemory = this.metrics.memoryUsage.slice(-5);

    // Calculate averages
    const avgRenderTime = recentRenders.length > 0 
      ? recentRenders.reduce((sum, r) => sum + r.duration, 0) / recentRenders.length 
      : 0;

    const memoryTrend = recentMemory.length > 1 
      ? recentMemory[recentMemory.length - 1].used - recentMemory[0].used 
      : 0;

    return {
      summary: {
        uptime: Math.round((now - this.startTime) / 1000),
        avgRenderTime: Math.round(avgRenderTime * 100) / 100,
        totalRenders: recentRenders.length,
        domUpdates: recentDOMUpdates.length,
        memoryTrend: Math.round(memoryTrend / 1024), // KB
        activeComponents: Object.keys(this.metrics.componentCounts).length
      },
      details: {
        slowRenders: recentRenders.filter(r => r.duration > 16),
        componentBreakdown: this.metrics.componentCounts,
        memoryUsage: recentMemory
      }
    };
  }

  // Public methods for manual profiling
  startProfile(name) {
    if (!this.isEnabled) return null;
    return { name, startTime: performance.now() };
  }

  endProfile(profile) {
    if (!this.isEnabled || !profile) return;
    const duration = performance.now() - profile.startTime;
    console.log(`⏱️ ${profile.name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  // Enable/disable monitoring
  toggle(enabled = !this.isEnabled) {
    this.isEnabled = enabled;
    localStorage.setItem('kt-debug-performance', enabled.toString());
    
    if (enabled && !this.observers.mutation) {
      this.initializeMonitoring();
    }
    
    console.info(`🔍 Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Cleanup
  destroy() {
    if (this.observers.mutation) {
      this.observers.mutation.disconnect();
    }
    if (this.observers.performance) {
      this.observers.performance.disconnect();
    }
    
    this.metrics = {
      renderTimes: [],
      domUpdates: [],
      eventHandlers: [],
      memoryUsage: [],
      componentCounts: {}
    };
  }
}

// Global singleton instance
let performanceMonitor;

// Auto-initialize if in development mode
if (typeof window !== 'undefined') {
  performanceMonitor = new KidsTasksPerformanceMonitor();
  window.KidsTasksPerformanceMonitor = performanceMonitor;
  
  // Dev tools integration
  if (__DEV__) {
    window.ktPerf = {
      report: () => performanceMonitor.generateReport(),
      toggle: () => performanceMonitor.toggle(),
      clear: () => performanceMonitor.destroy()
    };
    
    console.info('🛠️ Performance tools available: window.ktPerf');
  }
}

export { KidsTasksPerformanceMonitor };
export default performanceMonitor;