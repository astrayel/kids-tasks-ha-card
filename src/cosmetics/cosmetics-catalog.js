// Kids Tasks - Default Cosmetics Catalog
// Contains all available cosmetic items for avatar customization

/**
 * Default Cosmetics Catalog
 * To be used by the avatar builder and reward system
 */
export const CosmeticsCatalog = {
  version: '1.0.0',

  // Hair styles
  hair: [
    { id: 'short-brown', name: 'Cheveux courts bruns', rarity: 'common', cost: 0 },
    { id: 'short-blonde', name: 'Cheveux courts blonds', rarity: 'common', cost: 50 },
    { id: 'long-brown', name: 'Cheveux longs bruns', rarity: 'common', cost: 100 },
    { id: 'long-blonde', name: 'Cheveux longs blonds', rarity: 'common', cost: 100 },
    { id: 'curly-black', name: 'Cheveux bouclés noirs', rarity: 'rare', cost: 150 },
    { id: 'ponytail', name: 'Queue de cheval', rarity: 'rare', cost: 150 }
  ],

  // Eye styles
  eyes: [
    { id: 'happy', name: 'Yeux joyeux', rarity: 'common', cost: 0 },
    { id: 'neutral', name: 'Yeux neutres', rarity: 'common', cost: 50 },
    { id: 'excited', name: 'Yeux excités', rarity: 'rare', cost: 100 }
  ],

  // Outfits
  outfits: [
    { id: 'tshirt-blue', name: 'T-shirt bleu', rarity: 'common', cost: 0 },
    { id: 'tshirt-red', name: 'T-shirt rouge', rarity: 'common', cost: 50 },
    { id: 'tshirt-green', name: 'T-shirt vert', rarity: 'common', cost: 50 },
    { id: 'dress-pink', name: 'Robe rose', rarity: 'rare', cost: 150 },
    { id: 'hoodie-gray', name: 'Sweat à capuche gris', rarity: 'rare', cost: 150 }
  ],

  // Accessories
  accessories: [
    { id: 'none', name: 'Aucun', rarity: 'common', cost: 0 },
    { id: 'glasses', name: 'Lunettes', rarity: 'common', cost: 100 },
    { id: 'hat-pirate', name: 'Chapeau de pirate', rarity: 'epic', cost: 300 },
    { id: 'crown', name: 'Couronne', rarity: 'legendary', cost: 500 },
    { id: 'headphones', name: 'Casque audio', rarity: 'rare', cost: 200 }
  ],

  // Skin tones
  skinTones: [
    { id: 'light', name: 'Claire', cost: 0 },
    { id: 'medium', name: 'Moyenne', cost: 0 },
    { id: 'tan', name: 'Hâlée', cost: 0 },
    { id: 'dark', name: 'Foncée', cost: 0 }
  ],

  // Rarity definitions
  rarities: {
    common: { label: 'Commun', color: '#9e9e9e' },
    rare: { label: 'Rare', color: '#2196f3' },
    epic: { label: 'Épique', color: '#9c27b0' },
    legendary: { label: 'Légendaire', color: '#ff9800' }
  }
};

/**
 * Create rewards from cosmetics catalog
 * @param {Object} hass - Home Assistant instance
 */
export async function createCosmeticRewards(hass) {
  const rewardsCreated = [];

  // Create hair rewards
  for (const hair of CosmeticsCatalog.hair) {
    if (hair.cost > 0) {
      try {
        await hass.callService('kids_tasks', 'add_reward', {
          name: hair.name,
          description: `Débloquez la coiffure "${hair.name}"`,
          category: 'cosmetic',
          cost: hair.cost,
          reward_type: 'cosmetic',
          cosmetic_data: {
            type: 'hair',
            id: hair.id
          }
        });
        rewardsCreated.push(hair.name);
      } catch (error) {
        console.error(`Erreur création récompense ${hair.name}:`, error);
      }
    }
  }

  // Create outfit rewards
  for (const outfit of CosmeticsCatalog.outfits) {
    if (outfit.cost > 0) {
      try {
        await hass.callService('kids_tasks', 'add_reward', {
          name: outfit.name,
          description: `Débloquez la tenue "${outfit.name}"`,
          category: 'cosmetic',
          cost: outfit.cost,
          reward_type: 'cosmetic',
          cosmetic_data: {
            type: 'outfit',
            id: outfit.id
          }
        });
        rewardsCreated.push(outfit.name);
      } catch (error) {
        console.error(`Erreur création récompense ${outfit.name}:`, error);
      }
    }
  }

  // Create accessory rewards
  for (const accessory of CosmeticsCatalog.accessories) {
    if (accessory.cost > 0) {
      try {
        await hass.callService('kids_tasks', 'add_reward', {
          name: accessory.name,
          description: `Débloquez l'accessoire "${accessory.name}"`,
          category: 'cosmetic',
          cost: accessory.cost,
          reward_type: 'cosmetic',
          cosmetic_data: {
            type: 'accessory',
            id: accessory.id
          }
        });
        rewardsCreated.push(accessory.name);
      } catch (error) {
        console.error(`Erreur création récompense ${accessory.name}:`, error);
      }
    }
  }

  return rewardsCreated;
}

/**
 * Get cosmetic by ID
 */
export function getCosmeticById(type, id) {
  const catalog = CosmeticsCatalog[type];
  if (!catalog) return null;
  return catalog.find(item => item.id === id);
}

/**
 * Get all cosmetics of a type
 */
export function getCosmeticsByType(type) {
  return CosmeticsCatalog[type] || [];
}

// Make globally available
if (typeof window !== 'undefined') {
  window.CosmeticsCatalog = CosmeticsCatalog;
  window.createCosmeticRewards = createCosmeticRewards;
  window.getCosmeticById = getCosmeticById;
  window.getCosmeticsByType = getCosmeticsByType;
}
