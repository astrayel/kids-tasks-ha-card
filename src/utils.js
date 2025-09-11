// Kids Tasks Utilities - Shared helper functions

class KidsTasksUtils {
  
  // Icon rendering utility
  static renderIcon(iconData) {
    if (!iconData || iconData === '') return '📋';
    
    try {
      // If it's a URL (starts with http:// or https://)
      if (typeof iconData === 'string' && (iconData.startsWith('http://') || iconData.startsWith('https://'))) {
        return `<img src="${iconData}" class="icon-image" style="width: 1.2em; height: 1.2em; object-fit: cover; border-radius: 3px;" onerror="this.style.display='none'; this.insertAdjacentText('afterend', '📋');">`;
      }
      
      // If it's an MDI icon (starts with mdi:)
      if (typeof iconData === 'string' && iconData.startsWith('mdi:')) {
        return `<ha-icon icon="${iconData}" style="width: 1.2em; height: 1.2em;"></ha-icon>`;
      }
      
      // Otherwise, treat as emoji or plain text
      const iconString = iconData.toString();
      return iconString || '📋';
    } catch (error) {
      console.warn('Error in renderIcon:', error);
      return '📋';
    }
  }

  // Empty state component
  static emptySection(icon, text, subtext) {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <div class="empty-text">${text}</div>
        <div class="empty-subtext">${subtext}</div>
      </div>
    `;
  }

  // Category icon resolution
  static getCategoryIcon(categoryOrItem, dynamicIcons = {}, rewardIcons = {}) {
    // If it's an object (task/reward), check custom icon first
    if (typeof categoryOrItem === 'object' && categoryOrItem !== null) {
      if (categoryOrItem.icon) {
        return this.renderIcon(categoryOrItem.icon);
      }
      categoryOrItem = categoryOrItem.category;
    }

    // Dynamic icons from config
    if (categoryOrItem && dynamicIcons) {
      const category = categoryOrItem.toLowerCase();
      if (dynamicIcons[category]) {
        return this.renderIcon(dynamicIcons[category]);
      }
    }

    // Reward icons from config
    if (categoryOrItem && rewardIcons) {
      const category = categoryOrItem.toLowerCase();  
      if (rewardIcons[category]) {
        return this.renderIcon(rewardIcons[category]);
      }
    }

    // Default fallback
    return this.renderIcon('📋');
  }

  // Generate cosmetic data from reward name
  static generateCosmeticDataFromName(rewardName) {
    if (!rewardName) return null;
    
    const name = rewardName.toLowerCase();
    
    // Avatars
    if (name.includes('avatar') || name.includes('personnage')) {
      return {
        type: 'avatar',
        catalog_data: { emoji: '👤', default_avatar: true }
      };
    }
    
    // Backgrounds
    if (name.includes('fond') || name.includes('background') || name.includes('thème')) {
      return {
        type: 'background',
        catalog_data: { css_gradient: 'var(--kt-gradient-neutral)' }
      };
    }
    
    // Outfits
    if (name.includes('tenue') || name.includes('outfit') || name.includes('vêtement')) {
      return {
        type: 'outfit',
        catalog_data: { emoji: '👔', default_outfit: true }
      };
    }

    return null;
  }

  // Task statistics calculation
  static getTasksStatsForGauges(tasks, completedToday, isTaskActiveTodayFn) {
    const activeTasks = tasks.filter(task => 
      task.status === 'todo' && 
      isTaskActiveTodayFn && isTaskActiveTodayFn(task)
    );
    
    const totalTasksToday = activeTasks.length;
    const completedTasks = completedToday || 0;
    
    const progressPercent = totalTasksToday > 0 ? Math.round((completedTasks / totalTasksToday) * 100) : 0;
    
    return {
      completedToday: completedTasks,
      totalTasksToday,
      progressPercent,
      activeTasks
    };
  }

  // Format date for display
  static formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const diffTime = taskDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Aujourd\'hui';
      if (diffDays === -1) return 'Hier';
      if (diffDays === 1) return 'Demain';
      if (diffDays > 1 && diffDays <= 7) return `Dans ${diffDays} jours`;
      if (diffDays < -1 && diffDays >= -7) return `Il y a ${Math.abs(diffDays)} jours`;
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  }

  // Points formatting utility
  static formatPoints(points) {
    if (!points || points === 0) return '0';
    return points > 0 ? `+${points}` : points.toString();
  }

  // Currency class helper
  static getCurrencyClass(reward) {
    if (reward.cost > 0 && reward.coin_cost > 0) return 'dual-currency';
    if (reward.coin_cost > 0) return 'coins-only';
    return 'points-only';
  }

  // Mobile device detection
  static detectMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  }

  // Debounce utility for performance optimization
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle utility for performance optimization
  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Deep clone utility
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  // Safe property access utility
  static safeGet(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !current.hasOwnProperty(key)) {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current;
  }

  // Validation utility
  static isValidChild(child) {
    return child && 
           typeof child === 'object' && 
           child.id && 
           child.name;
  }

  static isValidTask(task) {
    return task && 
           typeof task === 'object' && 
           task.id && 
           task.name && 
           task.status;
  }

  static isValidReward(reward) {
    return reward && 
           typeof reward === 'object' && 
           reward.id && 
           reward.name && 
           (reward.cost > 0 || reward.coin_cost > 0);
  }

  // Error boundary utility
  static safeExecute(fn, fallbackValue = null, context = 'Unknown') {
    try {
      return fn();
    } catch (error) {
      console.warn(`Safe execute error in ${context}:`, error);
      return fallbackValue;
    }
  }
}

// ES6 export
export { KidsTasksUtils };