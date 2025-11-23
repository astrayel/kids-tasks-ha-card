// Kids Tasks Avatar System - SVG-based avatar rendering with layers
// Supports dynamic cosmetics composition and caching

/**
 * Avatar System - Manages avatar generation with cosmetic layers
 * Uses SVG for lightweight, scalable avatars
 */
class KidsTasksAvatarSystem {
  constructor() {
    this.layers = ['base', 'hair', 'eyes', 'outfit', 'accessory'];
    this.renderCache = new Map();
    this.maxCacheSize = 50;
  }

  /**
   * Generate avatar SVG from equipped cosmetics
   * @param {Object} child - Child data with equipped cosmetics
   * @param {Object} options - Rendering options (size, animate, etc.)
   * @returns {String} SVG markup
   */
  generateAvatar(child, options = {}) {
    const {
      size = 200,
      animate = false,
      showAccessories = true
    } = options;

    // Get equipped cosmetics or use defaults
    const equipped = this.getEquippedCosmetics(child);
    const cacheKey = this.getCacheKey(child.id || child.child_id, equipped, options);

    // Check cache first
    if (this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey);
    }

    // Build SVG
    const svg = this.buildAvatarSVG(equipped, size, animate, showAccessories);

    // Cache result
    this.cacheAvatar(cacheKey, svg);

    return svg;
  }

  /**
   * Get equipped cosmetics from child data
   */
  getEquippedCosmetics(child) {
    const equipped = {
      base: 'default',
      skin_tone: child.skin_tone || 'light',
      hair: child.active_cosmetics?.hair || 'short-brown',
      eyes: child.active_cosmetics?.eyes || 'happy',
      outfit: child.active_cosmetics?.outfit || 'tshirt-blue',
      accessory: child.active_cosmetics?.accessory || null
    };

    return equipped;
  }

  /**
   * Build complete avatar SVG
   */
  buildAvatarSVG(equipped, size, animate, showAccessories) {
    const layers = [];

    // Base layer (body silhouette)
    layers.push(this.renderBaseLayer(equipped.base, equipped.skin_tone));

    // Hair layer
    layers.push(this.renderHairLayer(equipped.hair));

    // Eyes/face layer
    layers.push(this.renderEyesLayer(equipped.eyes));

    // Outfit layer
    layers.push(this.renderOutfitLayer(equipped.outfit));

    // Accessory layer (optional)
    if (showAccessories && equipped.accessory) {
      layers.push(this.renderAccessoryLayer(equipped.accessory));
    }

    // Animations
    const animations = animate ? this.getAnimations() : '';

    return `
      <svg class="kt-avatar" width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.getGradients()}
          ${animations}
        </defs>
        <g class="avatar-container">
          ${layers.join('\n')}
        </g>
      </svg>
    `;
  }

  /**
   * Render base body layer
   */
  renderBaseLayer(baseType, skinTone) {
    const skinColors = {
      'light': '#fad6a5',
      'medium': '#d4a574',
      'tan': '#c68642',
      'dark': '#8d5524'
    };

    const fillColor = skinColors[skinTone] || skinColors.light;

    return `
      <g class="layer-base" data-layer="base">
        <!-- Body silhouette -->
        <ellipse cx="100" cy="140" rx="60" ry="50" fill="${fillColor}" />

        <!-- Head -->
        <circle cx="100" cy="70" r="45" fill="${fillColor}" />

        <!-- Neck -->
        <rect x="85" y="105" width="30" height="25" fill="${fillColor}" rx="5" />
      </g>
    `;
  }

  /**
   * Render hair layer
   */
  renderHairLayer(hairType) {
    const hairStyles = {
      'short-brown': { color: '#5d4037', path: 'M55,60 Q55,30 100,25 Q145,30 145,60 L140,70 Q100,20 60,70 Z' },
      'short-blonde': { color: '#fdd835', path: 'M55,60 Q55,30 100,25 Q145,30 145,60 L140,70 Q100,20 60,70 Z' },
      'long-brown': { color: '#5d4037', path: 'M55,60 Q55,30 100,25 Q145,30 145,60 L145,100 Q100,95 55,100 Z' },
      'long-blonde': { color: '#fdd835', path: 'M55,60 Q55,30 100,25 Q145,30 145,60 L145,100 Q100,95 55,100 Z' },
      'curly-black': { color: '#212121', path: 'M60,50 Q50,30 70,25 Q80,30 85,25 Q90,30 95,25 Q100,30 105,25 Q110,30 115,25 Q120,30 130,25 Q150,30 140,50 Z' },
      'ponytail': { color: '#8d6e63', path: 'M55,60 Q55,30 100,25 Q145,30 145,60 L140,70 Q100,20 60,70 Z M145,60 L165,80 Q170,90 160,95 L145,85 Z' }
    };

    const hair = hairStyles[hairType] || hairStyles['short-brown'];

    return `
      <g class="layer-hair" data-layer="hair">
        <path d="${hair.path}" fill="${hair.color}" />
      </g>
    `;
  }

  /**
   * Render eyes/face layer
   */
  renderEyesLayer(eyeType) {
    const eyeStyles = {
      'happy': `
        <ellipse cx="80" cy="70" rx="8" ry="10" fill="#212121" />
        <ellipse cx="120" cy="70" rx="8" ry="10" fill="#212121" />
        <ellipse cx="82" cy="68" rx="3" ry="3" fill="#ffffff" />
        <ellipse cx="122" cy="68" rx="3" ry="3" fill="#ffffff" />
        <path d="M75,85 Q100,95 125,85" stroke="#212121" stroke-width="3" fill="none" stroke-linecap="round" />
      `,
      'neutral': `
        <ellipse cx="80" cy="70" rx="8" ry="10" fill="#212121" />
        <ellipse cx="120" cy="70" rx="8" ry="10" fill="#212121" />
        <ellipse cx="82" cy="68" rx="3" ry="3" fill="#ffffff" />
        <ellipse cx="122" cy="68" rx="3" ry="3" fill="#ffffff" />
        <line x1="80" y1="85" x2="120" y2="85" stroke="#212121" stroke-width="2" stroke-linecap="round" />
      `,
      'excited': `
        <circle cx="80" cy="70" r="10" fill="#212121" />
        <circle cx="120" cy="70" r="10" fill="#212121" />
        <circle cx="82" cy="68" r="4" fill="#ffffff" />
        <circle cx="122" cy="68" r="4" fill="#ffffff" />
        <ellipse cx="100" cy="90" rx="15" ry="10" fill="#d32f2f" />
        <path d="M70,85 Q100,100 130,85" stroke="#212121" stroke-width="3" fill="none" stroke-linecap="round" />
      `
    };

    return `
      <g class="layer-eyes" data-layer="eyes">
        ${eyeStyles[eyeType] || eyeStyles.happy}
      </g>
    `;
  }

  /**
   * Render outfit layer
   */
  renderOutfitLayer(outfitType) {
    const outfits = {
      'tshirt-blue': { color: '#2196f3', secondary: '#1976d2' },
      'tshirt-red': { color: '#f44336', secondary: '#c62828' },
      'tshirt-green': { color: '#4caf50', secondary: '#388e3c' },
      'dress-pink': { color: '#e91e63', secondary: '#c2185b' },
      'hoodie-gray': { color: '#9e9e9e', secondary: '#616161' }
    };

    const outfit = outfits[outfitType] || outfits['tshirt-blue'];

    // Different shapes for different outfit types
    if (outfitType?.includes('dress')) {
      return `
        <g class="layer-outfit" data-layer="outfit">
          <!-- Dress -->
          <path d="M60,130 L70,115 L130,115 L140,130 L145,180 Q100,185 55,180 Z"
                fill="${outfit.color}" stroke="${outfit.secondary}" stroke-width="2" />
          <!-- Neckline -->
          <ellipse cx="100" cy="115" rx="15" ry="5" fill="${outfit.secondary}" />
        </g>
      `;
    } else if (outfitType?.includes('hoodie')) {
      return `
        <g class="layer-outfit" data-layer="outfit">
          <!-- Hoodie body -->
          <rect x="55" y="115" width="90" height="70" fill="${outfit.color}" rx="10" />
          <!-- Hood -->
          <path d="M60,115 Q60,100 75,95 Q100,90 125,95 Q140,100 140,115"
                fill="${outfit.secondary}" />
          <!-- Pocket -->
          <rect x="75" y="145" width="50" height="25" fill="${outfit.secondary}" rx="5" />
        </g>
      `;
    } else {
      // Default t-shirt
      return `
        <g class="layer-outfit" data-layer="outfit">
          <!-- T-shirt body -->
          <rect x="55" y="115" width="90" height="70" fill="${outfit.color}" rx="5" />
          <!-- Sleeves -->
          <ellipse cx="50" cy="125" rx="12" ry="20" fill="${outfit.color}" />
          <ellipse cx="150" cy="125" rx="12" ry="20" fill="${outfit.color}" />
          <!-- Collar -->
          <path d="M85,115 Q100,120 115,115" stroke="${outfit.secondary}"
                stroke-width="3" fill="none" stroke-linecap="round" />
        </g>
      `;
    }
  }

  /**
   * Render accessory layer
   */
  renderAccessoryLayer(accessoryType) {
    const accessories = {
      'hat-pirate': `
        <g transform="translate(100, 25)">
          <!-- Pirate hat -->
          <path d="M-40,0 L-30,-15 L30,-15 L40,0 Z" fill="#212121" />
          <ellipse cx="0" cy="-10" rx="8" ry="8" fill="#ffffff" />
          <text x="0" y="-7" text-anchor="middle" font-size="12" fill="#212121">☠</text>
        </g>
      `,
      'glasses': `
        <g class="accessory-glasses">
          <!-- Glasses frames -->
          <circle cx="80" cy="70" r="12" fill="none" stroke="#212121" stroke-width="2" />
          <circle cx="120" cy="70" r="12" fill="none" stroke="#212121" stroke-width="2" />
          <line x1="92" y1="70" x2="108" y2="70" stroke="#212121" stroke-width="2" />
        </g>
      `,
      'crown': `
        <g transform="translate(100, 20)">
          <!-- Crown -->
          <path d="M-30,0 L-25,-15 L-10,-5 L0,-15 L10,-5 L25,-15 L30,0 Z"
                fill="#ffd700" stroke="#ffa000" stroke-width="2" />
          <circle cx="-15" cy="-10" r="3" fill="#f44336" />
          <circle cx="0" cy="-12" r="3" fill="#f44336" />
          <circle cx="15" cy="-10" r="3" fill="#f44336" />
        </g>
      `,
      'headphones': `
        <g class="accessory-headphones">
          <path d="M55,60 Q55,30 100,25 Q145,30 145,60"
                fill="none" stroke="#212121" stroke-width="6" stroke-linecap="round" />
          <rect x="45" y="55" width="15" height="20" fill="#212121" rx="3" />
          <rect x="140" y="55" width="15" height="20" fill="#212121" rx="3" />
        </g>
      `
    };

    return `
      <g class="layer-accessory" data-layer="accessory">
        ${accessories[accessoryType] || ''}
      </g>
    `;
  }

  /**
   * Get SVG gradients definitions
   */
  getGradients() {
    return `
      <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
      </linearGradient>
    `;
  }

  /**
   * Get CSS animations for avatar
   */
  getAnimations() {
    return `
      <style>
        .kt-avatar .layer-eyes {
          animation: blink 4s infinite;
        }

        @keyframes blink {
          0%, 95%, 100% { opacity: 1; }
          96%, 98% { opacity: 0.1; }
        }

        .kt-avatar .avatar-container {
          animation: breathe 3s ease-in-out infinite;
          transform-origin: center;
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      </style>
    `;
  }

  /**
   * Generate cache key
   */
  getCacheKey(childId, equipped, options) {
    const equippedStr = JSON.stringify(equipped);
    const optionsStr = JSON.stringify(options);
    return `${childId}_${this.hashString(equippedStr + optionsStr)}`;
  }

  /**
   * Simple string hash function
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Cache avatar with LRU policy
   */
  cacheAvatar(key, svg) {
    // Simple LRU: remove oldest if cache is full
    if (this.renderCache.size >= this.maxCacheSize) {
      const firstKey = this.renderCache.keys().next().value;
      this.renderCache.delete(firstKey);
    }
    this.renderCache.set(key, svg);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.renderCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.renderCache.size,
      maxSize: this.maxCacheSize,
      keys: Array.from(this.renderCache.keys())
    };
  }
}

// Export for ES6
export { KidsTasksAvatarSystem };

// Global instance for backwards compatibility
if (typeof window !== 'undefined') {
  window.KidsTasksAvatarSystem = KidsTasksAvatarSystem;
}
