// Production-safe logging system

class KidsTasksLogger {
  constructor() {
    this.isDevelopment = __DEV__ || false;
    this.isDebugEnabled = this.isDevelopment || localStorage.getItem('kt-debug') === 'true';
    this.logLevels = {
      error: 0,
      warn: 1, 
      info: 2,
      debug: 3
    };
    this.currentLevel = this.isDevelopment ? 3 : 1; // debug in dev, warn+ in prod
  }

  // Production-safe error logging (always enabled)
  error(message, ...args) {
    if (this.currentLevel >= this.logLevels.error) {
      console.error(`🔴 [Kids Tasks] ${message}`, ...args);
    }
  }

  // Production-safe warning logging 
  warn(message, ...args) {
    if (this.currentLevel >= this.logLevels.warn) {
      console.warn(`🟡 [Kids Tasks] ${message}`, ...args);
    }
  }

  // Info logging (development only by default)
  info(message, ...args) {
    if (this.currentLevel >= this.logLevels.info) {
      console.info(`🔵 [Kids Tasks] ${message}`, ...args);
    }
  }

  // Debug logging (development only)
  debug(message, ...args) {
    if (this.currentLevel >= this.logLevels.debug && this.isDebugEnabled) {
      console.debug(`🟢 [Kids Tasks] ${message}`, ...args);
    }
  }

  // Performance logging
  perf(component, action, duration) {
    if (this.isDebugEnabled && duration !== undefined) {
      this.debug(`⏱️ ${component}.${action}: ${duration.toFixed(2)}ms`);
    }
  }

  // Group logging for complex operations
  group(title, callback) {
    if (this.isDebugEnabled) {
      console.group(`📁 [Kids Tasks] ${title}`);
      try {
        callback();
      } finally {
        console.groupEnd();
      }
    } else {
      callback();
    }
  }

  // Toggle debug mode
  toggleDebug() {
    this.isDebugEnabled = !this.isDebugEnabled;
    localStorage.setItem('kt-debug', this.isDebugEnabled.toString());
    this.info(`Debug mode ${this.isDebugEnabled ? 'enabled' : 'disabled'}`);
  }

  // Set log level
  setLevel(level) {
    if (level in this.logLevels) {
      this.currentLevel = this.logLevels[level];
      this.info(`Log level set to: ${level}`);
    }
  }
}

// Global logger instance
const logger = new KidsTasksLogger();

// Expose debug toggle in development
if (__DEV__ && typeof window !== 'undefined') {
  window.ktLogger = logger;
  window.ktDebug = () => logger.toggleDebug();
}

// Replace all console.* calls with logger in production
export const devLog = {
  error: (...args) => logger.error(...args),
  warn: (...args) => logger.warn(...args),
  info: (...args) => logger.info(...args),
  debug: (...args) => logger.debug(...args),
  log: (...args) => logger.debug(...args), // Map console.log to debug
  group: (title, callback) => logger.group(title, callback),
  perf: (component, action, duration) => logger.perf(component, action, duration)
};

export { KidsTasksLogger, logger };
export default logger;