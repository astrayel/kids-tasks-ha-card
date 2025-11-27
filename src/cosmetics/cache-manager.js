// Kids Tasks Cache Manager - LocalStorage-based caching for avatars and cosmetics

/**
 * Cache Manager for avatar renders and cosmetic data
 * Uses LocalStorage with expiration and size limits
 */
class KidsTasksCacheManager {
  constructor(prefix = 'kt_cache_', maxAge = 7 * 24 * 60 * 60 * 1000) {
    this.prefix = prefix;
    this.maxAge = maxAge; // Default 7 days
    this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit
  }

  /**
   * Get cached avatar
   * @param {String} childId - Child identifier
   * @param {String} cosmeticsHash - Hash of equipped cosmetics
   * @returns {String|null} Cached SVG or null
   */
  getCachedAvatar(childId, cosmeticsHash) {
    const key = `${this.prefix}avatar_${childId}_${cosmeticsHash}`;
    return this.get(key);
  }

  /**
   * Cache avatar render
   */
  cacheAvatar(childId, cosmeticsHash, svg) {
    const key = `${this.prefix}avatar_${childId}_${cosmeticsHash}`;
    return this.set(key, svg);
  }

  /**
   * Get item from cache
   */
  get(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp, version } = JSON.parse(cached);

      // Check expiration
      if (Date.now() - timestamp > this.maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      // Check version (optional, for future migrations)
      if (version !== this.getVersion()) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  }

  /**
   * Set item in cache
   */
  set(key, data) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        version: this.getVersion()
      };

      const serialized = JSON.stringify(cacheItem);

      // Check size before storing
      if (serialized.length > 100 * 1024) { // 100KB per item max
        console.warn('Cache item too large, skipping:', key);
        return false;
      }

      // Check total storage size
      if (this.getTotalSize() + serialized.length > this.maxStorageSize) {
        this.evictOldest();
      }

      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn('Cache write error:', error);
      // Try to free space and retry once
      if (error.name === 'QuotaExceededError') {
        this.evictOldest(5); // Evict 5 oldest items
        try {
          localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now(),
            version: this.getVersion()
          }));
          return true;
        } catch (retryError) {
          console.error('Cache still full after eviction');
          return false;
        }
      }
      return false;
    }
  }

  /**
   * Remove item from cache
   */
  remove(key) {
    localStorage.removeItem(key);
  }

  /**
   * Clear all cache items with our prefix
   */
  clearAll() {
    const keys = this.getAllKeys();
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Clear expired items
   */
  clearExpired() {
    const keys = this.getAllKeys();
    let cleared = 0;

    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp > this.maxAge) {
            localStorage.removeItem(key);
            cleared++;
          }
        }
      } catch (error) {
        // Remove corrupted items
        localStorage.removeItem(key);
        cleared++;
      }
    });

    return cleared;
  }

  /**
   * Evict oldest items
   */
  evictOldest(count = 1) {
    const keys = this.getAllKeys();
    const items = [];

    // Get all items with timestamps
    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          items.push({ key, timestamp });
        }
      } catch (error) {
        // Remove corrupted items immediately
        localStorage.removeItem(key);
      }
    });

    // Sort by timestamp (oldest first)
    items.sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest items
    for (let i = 0; i < Math.min(count, items.length); i++) {
      localStorage.removeItem(items[i].key);
    }
  }

  /**
   * Get all cache keys
   */
  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get total cache size
   */
  getTotalSize() {
    let total = 0;
    this.getAllKeys().forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length;
      }
    });
    return total;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const keys = this.getAllKeys();
    const stats = {
      itemCount: keys.length,
      totalSize: this.getTotalSize(),
      maxSize: this.maxStorageSize,
      percentUsed: (this.getTotalSize() / this.maxStorageSize * 100).toFixed(2) + '%',
      oldestItem: null,
      newestItem: null
    };

    // Find oldest and newest
    let oldest = Date.now();
    let newest = 0;

    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (timestamp < oldest) oldest = timestamp;
          if (timestamp > newest) newest = timestamp;
        }
      } catch (error) {
        // Ignore errors
      }
    });

    if (oldest !== Date.now()) {
      stats.oldestItem = new Date(oldest).toISOString();
    }
    if (newest !== 0) {
      stats.newestItem = new Date(newest).toISOString();
    }

    return stats;
  }

  /**
   * Get current version for cache invalidation
   */
  getVersion() {
    return 'v1.0';
  }

  /**
   * Check if cache is available
   */
  isAvailable() {
    try {
      const test = '__kt_cache_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export for ES6
export { KidsTasksCacheManager };

// Global instance
if (typeof window !== 'undefined') {
  window.KidsTasksCacheManager = KidsTasksCacheManager;
  // Create default instance
  window.kidsTasksCache = new KidsTasksCacheManager();
}
