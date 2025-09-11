# Système de Cosmétiques Kids Tasks - Spécifications Complètes

## 📋 **Contexte et Problématique**

### **Situation Actuelle**
- Système de cosmétiques rudimentaire avec seulement des emojis (`👤`, `👔`)
- Dépendance aux URLs d'images de l'intégration (non accessibles)
- Fonction `generateCosmeticDataFromName()` très limitée
- Pas de gestion visuelle des cosmétiques équipés

### **Objectif**
Créer un système complet de cosmétiques (avatars, tenues, accessoires) comme récompenses, **sans dépendre d'URLs d'images externes**, inspiré d'Habitica mais avec un style moderne et flat design.

## 🎮 **Inspiration Habitica - Analyse**

### **Ce qui marche bien chez Habitica :**
- **Avatars par couches** : Peau + cheveux + yeux + vêtements + accessoires
- **Collections thématiques** : Événements saisonniers, récompenses spéciales
- **Rareté visuelle** : Couleurs distinctes pour commun/rare/épique/légendaire
- **Progression motivante** : Déblocage par achievements et événements
- **Aperçu instantané** : Prévisualisation avant achat
- **Style cohérent** : Design system unifié

### **Adaptation : "Habitica meets Flat Design"**
- Silhouettes arrondies, style material design
- Couleurs modernes et inclusives
- Animations CSS douces
- Intégration native avec le design system existant

## 🎨 **Architecture du Système**

### **1. Système d'Avatar par Couches CSS/SVG**

#### **Structure des Couches**
```html
<div class="kt-avatar-builder">
  <div class="avatar-preview">
    <svg class="avatar-base">
      <g class="body-layer"></g>      <!-- Base corporelle -->
      <g class="hair-layer"></g>      <!-- Cheveux -->
      <g class="eyes-layer"></g>      <!-- Yeux/visage -->
      <g class="outfit-layer"></g>    <!-- Vêtements -->
      <g class="accessory-layer"></g> <!-- Accessoires -->
    </svg>
  </div>
</div>
```

#### **Composants d'Avatar**
- **Base corporelle** : Silhouettes arrondies, tons de peau inclusifs
- **Cheveux** : 8-10 styles (court, long, bouclé, tresse) en SVG
- **Yeux** : Expressions diverses pour personnalité
- **Vêtements** : T-shirts, robes, costumes par overlay CSS
- **Accessoires** : Chapeaux, lunettes, bijoux en éléments flottants

### **2. Collections Thématiques**

#### **Collections Principales**
- **Quotidien** : Vêtements normaux (t-shirt, jean, robe)
- **Métiers** : Docteur, pompier, enseignant, astronaute
- **Fantaisie** : Pirate, princesse, super-héros, magicien
- **Saisons** : Halloween, Noël, été, hiver
- **Sports** : Football, natation, danse, arts martiaux

#### **Système de Rareté**
- **Commun** (gris #9e9e9e) : Couleurs basiques, pas d'effets
- **Rare** (vert #4caf50) : Bordure colorée subtile
- **Épique** (bleu #2196f3) : Gradient + animation douce
- **Légendaire** (or #ffc107) : Effets de particules CSS + aura

### **3. Structure de Données**

#### **Format des Cosmétiques**
```javascript
const cosmeticItem = {
  id: "pirate_hat_001",
  name: "Chapeau de Pirate",
  type: "accessory", // avatar, outfit, accessory, background
  category: "fantasy",
  rarity: "epic",
  unlock_condition: {
    type: "achievement",
    requirement: "complete_10_tasks"
  },
  asset_data: {
    svg_path: "accessories/hats/pirate.svg",
    css_classes: ["pirate-hat", "animated"],
    position: { x: 0, y: -20 }
  },
  compatible_with: ["all_outfits"],
  exclusive_with: ["other_hats"]
};
```

#### **Collections JSON**
```javascript
const cosmeticCollections = {
  "daily": {
    items: {
      "tshirt-red": { rarity: "common", type: "outfit" },
      "jeans-blue": { rarity: "common", type: "outfit" }
    }
  },
  "fantasy": {
    items: {
      "pirate-hat": { rarity: "epic", type: "accessory" },
      "princess-crown": { rarity: "legendary", type: "accessory" }
    }
  }
};
```

## 🛠️ **Plan d'Implémentation**

### **Phase 1: Mockups et Prototypes**

#### **Mockups à Créer**
1. **Avatar Builder** (`mockups/avatar-builder.html`)
   - Interface style Habitica avec aperçu central
   - Panneaux latéraux pour catégories
   - Style flat design moderne

2. **Collection d'Avatars** (`mockups/avatar-layers.html`)
   - Démonstration des couches SVG
   - Assemblage technique des éléments

3. **Child Card Intégrée** (`mockups/child-card-cosmetics.html`)
   - Avatar complet dans la carte enfant
   - Mode compact et détaillé

4. **Système de Récompenses** (`mockups/cosmetic-rewards.html`)
   - Animation de drop d'items
   - Catalogue et filtres

5. **Collections Thématiques** (`mockups/cosmetic-collections.html`)
   - Visualisation des différentes collections

#### **Structure CSS des Mockups**
```css
.kt-avatar-builder {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: var(--kt-space-lg);
  padding: var(--kt-space-lg);
}

.avatar-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--kt-surface-variant);
  border-radius: var(--kt-radius-lg);
  padding: var(--kt-space-xl);
}

.avatar-base {
  width: 200px;
  height: 200px;
  transition: all var(--kt-transition-medium);
}

/* Système de rareté */
.rarity-common { border: 2px solid #9e9e9e; }
.rarity-rare { border: 2px solid #4caf50; }
.rarity-epic { 
  border: 2px solid #2196f3;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
}
.rarity-legendary { 
  border: 2px solid #ffc107;
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 15px rgba(255, 193, 7, 0.5); }
  to { box-shadow: 0 0 25px rgba(255, 193, 7, 0.8); }
}
```

### **Phase 2: Architecture du Système**

#### **Classes Principales**
```javascript
class KidsTasksAvatarBuilder {
  generateAvatar(childData) {
    return {
      base: this.generateBody(childData.skin_tone),
      hair: this.generateHair(childData.hair_style, childData.hair_color),
      eyes: this.generateEyes(childData.eye_color),
      outfit: this.combineOutfit(childData.equipped_cosmetics)
    };
  }
  
  combineOutfit(equippedItems) {
    // Logique de combinaison des éléments
    // Gestion des incompatibilités
    // Génération du CSS final
  }
}

class KidsTasksCosmeticManager {
  constructor() {
    this.collections = {};
    this.childInventories = new Map();
    this.preloadedAssets = new Map();
  }
  
  loadCollection(collectionName) {
    // Chargement lazy des collections
  }
  
  unlockItem(childId, itemId) {
    // Déblocage d'un cosmétique
    // Vérification des conditions
    // Mise à jour de l'inventaire
  }
  
  equipItem(childId, itemId) {
    // Équipement d'un cosmétique
    // Vérification des compatibilités
    // Mise à jour de l'apparence
  }
}
```

### **Phase 3: Intégration dans les Cartes**

#### **Modification des Cards Existantes**
```javascript
// Dans child-card.js
getAvatar(child) {
  if (child.cosmetics && child.cosmetics.equipped) {
    return this.cosmeticManager.renderAvatar(child.cosmetics);
  }
  // Fallback vers emoji
  return child.avatar || child.cosmetics?.avatar?.emoji || '👤';
}

// Nouvel onglet cosmétiques
renderCosmeticsTab(child) {
  return `
    <div class="cosmetics-tab">
      <div class="avatar-display">
        ${this.renderFullAvatar(child)}
      </div>
      <div class="cosmetic-inventory">
        ${this.renderInventory(child.id)}
      </div>
      <button class="kt-btn kt-btn--primary" data-action="open-avatar-builder">
        Personnaliser
      </button>
    </div>
  `;
}
```

### **Phase 4: Système de Déblocage**

#### **Intégration avec les Récompenses**
```javascript
// Modification du système de récompenses existant
class KidsTasksRewardSystem {
  async completeTask(taskId, childId) {
    // Logique existante...
    
    // Nouveau : Check cosmetic rewards
    const cosmeticReward = this.checkCosmeticReward(taskId);
    if (cosmeticReward) {
      await this.unlockCosmetic(childId, cosmeticReward);
      this.showCosmeticUnlockAnimation(cosmeticReward);
    }
  }
  
  checkCosmeticReward(taskId) {
    // Logique pour déterminer si une tâche donne un cosmétique
    // Basé sur la difficulté, catégorie, achievements, etc.
  }
}
```

## 📱 **Interface Utilisateur**

### **Avatar Builder Interface**
```html
<div class="kt-avatar-builder">
  <!-- Panneau gauche : Catégories -->
  <div class="cosmetic-categories">
    <button class="category-btn active" data-category="hair">Cheveux</button>
    <button class="category-btn" data-category="eyes">Yeux</button>
    <button class="category-btn" data-category="outfit">Tenues</button>
    <button class="category-btn" data-category="accessory">Accessoires</button>
  </div>
  
  <!-- Centre : Aperçu avatar -->
  <div class="avatar-preview">
    <div class="avatar-container">
      <!-- Avatar SVG généré dynamiquement -->
    </div>
    <div class="avatar-controls">
      <button class="kt-btn kt-btn--secondary">Réinitialiser</button>
      <button class="kt-btn kt-btn--primary">Sauvegarder</button>
    </div>
  </div>
  
  <!-- Panneau droit : Items de la catégorie -->
  <div class="cosmetic-items">
    <div class="items-grid">
      <!-- Items générés dynamiquement -->
    </div>
  </div>
</div>
```

### **Animation de Déblocage**
```css
@keyframes unlock-item {
  0% { 
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  50% { 
    transform: scale(1.2) rotate(0deg);
    opacity: 1;
  }
  100% { 
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.cosmetic-unlock {
  animation: unlock-item 0.8s ease-out;
}
```

## 🔧 **Aspects Techniques**

### **Optimisation Performance**
- **Lazy loading** des assets SVG
- **Cache** des rendus générés
- **Sprites CSS** pour les petits éléments
- **Compression** des données cosmétiques

### **Compatibilité**
- **Fallback** vers emojis si SVG non supporté
- **Responsive** design pour mobile
- **Accessibilité** avec ARIA labels

### **Structure de Fichiers**
```
src/
├── cosmetics/
│   ├── cosmetic-manager.js       # Gestionnaire principal
│   ├── avatar-builder.js         # Constructeur d'avatars
│   ├── collections/              # Collections de cosmétiques
│   │   ├── daily.json
│   │   ├── fantasy.json
│   │   └── seasonal.json
│   ├── assets/                   # Assets SVG
│   │   ├── hair/
│   │   ├── outfits/
│   │   └── accessories/
│   └── styles/                   # CSS spécialisé
│       ├── avatar-builder.css
│       └── cosmetic-effects.css
├── mockups/                      # Prototypes HTML
│   ├── avatar-builder.html
│   ├── avatar-layers.html
│   ├── child-card-cosmetics.html
│   ├── cosmetic-rewards.html
│   └── cosmetic-collections.html
└── COSMETICS-SYSTEM.md          # Cette documentation
```

## 🎯 **Prochaines Étapes**

1. **Créer les mockups HTML** pour validation UX
2. **Développer le système de couches SVG** de base
3. **Intégrer dans child-card.js** existante
4. **Créer les premières collections** (quotidien + fantaisie)
5. **Système de déblocage** lié aux tâches
6. **Interface de personnalisation** complète

## 💡 **Notes d'Implémentation**

### **Compatibilité avec l'Existant**
- Réutiliser les classes CSS du design system
- Garder la compatibilité avec les emojis actuels
- Intégrer progressivement dans les cartes existantes

### **Évolutivité**
- Système modulaire pour ajouter facilement nouvelles collections
- API pour import/export de cosmétiques personnalisés
- Structure pour futurs cosmétiques animés

### **Considérations UX**
- Interface intuitive inspirée des jeux
- Feedback visuel immédiat
- Progression claire et motivante
- Accessibilité pour tous les âges

---

**Dernière mise à jour :** 2025-09-11  
**Status :** Spécifications complètes - Prêt pour implémentation des mockups