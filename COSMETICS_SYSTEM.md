# Système de Récompenses Cosmétiques - Kids Tasks Manager

## Vue d'ensemble

Ce document décrit l'architecture complète du système de cosmétiques pour Kids Tasks Manager, permettant aux enfants de personnaliser leur avatar et leur interface avec des récompenses visuelles et fonctionnelles.

## Architecture des Cosmétiques

### 1. Cosmétiques AVATAR

Personnalisation du personnage de l'enfant avec plusieurs couches superposables.

#### Types de cosmétiques avatar

**Base (obligatoire)**
- Avatar de base du personnage
- Images PNG avec transparence
- Exemples : astronaute, pirate, ninja, princesse, chevalier

**Outfit (optionnel)**
- Vêtements, costumes, armures
- Layer superposé sur la base
- Exemples : combinaison spatiale, cape de super-héros, robe de princesse

**Companion (optionnel)**
- Animal de compagnie ou créature
- Positionné à côté de l'avatar
- Exemples : robot, dragon, chat, chien, licorne

**Effect (optionnel)**
- Effets visuels CSS ou animations
- Exemples : aura lumineuse, particules, lueur, étincelles

**Accessoires (futur)**
- Éléments additionnels : chapeau, arme, bouclier, masque
- Multiples layers possibles

#### Rendu avatar composite

```html
<div class="kt-avatar-composite">
  <!-- Layer 1 : Base (z-index: 10) -->
  <img src="/local/kids-tasks/avatar/base/astronaut.png" class="avatar-base">

  <!-- Layer 2 : Outfit (z-index: 20) -->
  <img src="/local/kids-tasks/avatar/outfit/spacesuit.png" class="avatar-layer outfit">

  <!-- Layer 3 : Companion (z-index: 5, positionné à côté) -->
  <img src="/local/kids-tasks/avatar/companion/robot.png" class="avatar-companion">

  <!-- Layer 4 : Effect (z-index: 30, CSS) -->
  <div class="avatar-effect glow-effect"></div>
</div>
```

---

### 2. Cosmétiques de CARTE

Personnalisation de l'interface de la carte enfant.

#### Background (Fond d'écran)

**Types :**
- **Image statique** : JPG/PNG en fond
- **Gradient CSS** : Dégradés de couleurs
- **Pattern répétitif** : Motifs qui se répètent
- **Vidéo** (optionnel futur) : Vidéo en boucle

**Exemples :**
```json
{
  "id": "bg_space",
  "type": "image",
  "data": "/local/kids-tasks/backgrounds/space.jpg"
}

{
  "id": "bg_ocean",
  "type": "gradient",
  "data": "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)"
}
```

#### Theme (Thème de couleurs)

Modification des couleurs de l'interface via CSS custom properties.

**Variables modifiables :**
- `--kt-primary` : Couleur principale
- `--kt-success` : Couleur de succès
- `--kt-progress-bg` : Couleur des barres de progression
- `--kt-button-color` : Couleur des boutons

**Exemple :**
```json
{
  "id": "theme_fire",
  "colors": {
    "--kt-primary": "#ff6b6b",
    "--kt-success": "#ffa500",
    "--kt-progress-bg": "linear-gradient(90deg, #ff4500, #ff8c00)"
  }
}
```

#### Animation (Effets animés)

Animations déclenchées par des événements.

**Types :**
- **Particules** : Confettis, étoiles, feu d'artifice
- **Transitions** : Effet de slide, fade entre vues
- **Hover** : Effets au survol des éléments

**Triggers :**
- `task_complete` : Tâche terminée
- `level_up` : Passage de niveau
- `reward_claimed` : Récompense réclamée

#### Progress Bar (Style des barres)

Personnalisation visuelle des jauges de progression.

**Styles :**
- **Neon** : Effet néon lumineux
- **Pixel** : Style retrogaming 8-bit
- **Gradient** : Dégradés colorés
- **Striped** : Rayures animées

---

### 3. Cosmétiques SPÉCIAUX

Fonctionnalités uniques et avancées.

#### Sound (Effets sonores)

Sons personnalisés pour les événements.

**Types :**
- Son de complétion de tâche
- Son de level up
- Son de réclamation de récompense
- Musique d'ambiance (optionnel)

**Implémentation :**
```json
{
  "id": "sound_fanfare",
  "sound_url": "/local/kids-tasks/sounds/fanfare.mp3",
  "trigger": "task_complete",
  "volume": 0.7
}
```

#### Badge (Badge spécial)

Badge affiché à côté du nom de l'enfant.

**Exemples :**
- 🏆 Champion
- ⭐ Super Star
- 🔥 En feu
- 👑 Roi/Reine des tâches

#### Title (Titre personnalisé)

Titre affiché sous le nom de l'enfant.

**Exemples :**
- "🌟 Maître des Tâches 🌟"
- "⚡ L'Éclair ⚡"
- "🎯 Précision Absolue 🎯"

#### Power-up (Boosts temporaires)

Effets consommables à durée limitée.

**Types :**
- **Points Multiplier** : ×2 points pendant 24h
- **Shield** : Protection contre 1 pénalité
- **Vision** : Voir les récompenses secrètes
- **Freeze** : Geler les deadlines pendant 12h

**Structure :**
```json
{
  "id": "powerup_2x",
  "effect": "points_multiplier",
  "multiplier": 2.0,
  "duration_hours": 24,
  "consumable": true
}
```

#### Mascot (Mascotte interactive)

Personnage qui réagit aux actions de l'enfant.

**États :**
- **Neutre** : État par défaut
- **Heureux** : Tâche complétée
- **Triste** : Tâche manquée
- **Excité** : Level up

**Position :**
- Coin de la carte
- Flottant avec animation
- À côté de l'avatar

---

## Structure de Données

### Catalogue Backend (Python)

```python
COSMETIC_CATALOG = {
    # === AVATAR COSMETICS ===
    "avatar": {
        "base": {
            "astronaut": {
                "id": "avatar_astronaut",
                "name": "Astronaute",
                "description": "Un explorateur de l'espace",
                "category": "base",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/base/astronaut.png",
                "cost": 50,
                "coin_cost": 0,
                "min_level": 1,
                "rarity": "common",  # common, uncommon, rare, epic, legendary
                "tags": ["space", "science"]
            },
            "pirate": {
                "id": "avatar_pirate",
                "name": "Pirate",
                "description": "Un aventurier des mers",
                "category": "base",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/base/pirate.png",
                "cost": 50,
                "min_level": 1,
                "rarity": "common",
                "tags": ["adventure", "ocean"]
            }
        },
        "outfit": {
            "spacesuit": {
                "id": "outfit_spacesuit",
                "name": "Combinaison spatiale",
                "description": "Pour explorer les étoiles",
                "category": "outfit",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/outfit/spacesuit.png",
                "layer_order": 10,
                "cost": 30,
                "coin_cost": 5,
                "rarity": "uncommon",
                "compatible_with": ["astronaut"],  # Compatible avec quels avatars base
                "tags": ["space"]
            },
            "pirate_coat": {
                "id": "outfit_pirate_coat",
                "name": "Manteau de pirate",
                "category": "outfit",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/outfit/pirate_coat.png",
                "layer_order": 10,
                "cost": 30,
                "coin_cost": 5,
                "rarity": "uncommon",
                "compatible_with": ["pirate"],
                "tags": ["adventure", "ocean"]
            }
        },
        "companion": {
            "robot": {
                "id": "companion_robot",
                "name": "Robot compagnon",
                "description": "Un fidèle assistant mécanique",
                "category": "companion",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/companion/robot.png",
                "position": "right",  # left, right, top, bottom
                "animation": "float",  # float, bounce, pulse
                "cost": 75,
                "coin_cost": 10,
                "min_level": 3,
                "rarity": "rare",
                "tags": ["space", "technology"]
            },
            "parrot": {
                "id": "companion_parrot",
                "name": "Perroquet",
                "description": "Un oiseau bavard",
                "category": "companion",
                "subcategory": "avatar",
                "image_url": "/local/kids-tasks/avatar/companion/parrot.png",
                "position": "left",
                "animation": "bounce",
                "cost": 75,
                "coin_cost": 10,
                "min_level": 3,
                "rarity": "rare",
                "tags": ["adventure", "ocean"]
            }
        },
        "effect": {
            "glow": {
                "id": "effect_glow",
                "name": "Aura lumineuse",
                "description": "Une lueur mystique",
                "category": "effect",
                "subcategory": "avatar",
                "effect_type": "css",  # css, animation, particle
                "css_class": "avatar-glow-effect",
                "css_properties": {
                    "box-shadow": "0 0 20px rgba(0, 200, 255, 0.8)",
                    "animation": "pulse 2s infinite"
                },
                "cost": 40,
                "coin_cost": 8,
                "rarity": "uncommon",
                "tags": ["magic", "light"]
            },
            "sparkles": {
                "id": "effect_sparkles",
                "name": "Étincelles",
                "description": "Des particules scintillantes",
                "category": "effect",
                "subcategory": "avatar",
                "effect_type": "particle",
                "particle_config": {
                    "type": "sparkle",
                    "count": 20,
                    "duration": "continuous"
                },
                "cost": 60,
                "coin_cost": 12,
                "min_level": 5,
                "rarity": "rare",
                "tags": ["magic", "celebration"]
            }
        }
    },

    # === CARD COSMETICS ===
    "card": {
        "background": {
            "space": {
                "id": "bg_space",
                "name": "Espace étoilé",
                "description": "Un fond galactique immersif",
                "category": "background",
                "subcategory": "card",
                "type": "image",
                "data": "/local/kids-tasks/backgrounds/space.jpg",
                "cost": 60,
                "coin_cost": 10,
                "min_level": 2,
                "rarity": "uncommon",
                "tags": ["space", "dark"]
            },
            "ocean_gradient": {
                "id": "bg_ocean",
                "name": "Océan",
                "description": "Un dégradé aquatique apaisant",
                "category": "background",
                "subcategory": "card",
                "type": "gradient",
                "data": "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)",
                "cost": 40,
                "coin_cost": 6,
                "rarity": "common",
                "tags": ["ocean", "blue", "calm"]
            },
            "forest": {
                "id": "bg_forest",
                "name": "Forêt enchantée",
                "category": "background",
                "subcategory": "card",
                "type": "image",
                "data": "/local/kids-tasks/backgrounds/forest.jpg",
                "cost": 60,
                "coin_cost": 10,
                "rarity": "uncommon",
                "tags": ["nature", "green"]
            }
        },
        "theme": {
            "fire": {
                "id": "theme_fire",
                "name": "Thème Feu",
                "description": "Des couleurs ardentes",
                "category": "theme",
                "subcategory": "card",
                "colors": {
                    "--kt-primary": "#ff6b6b",
                    "--kt-success": "#ffa500",
                    "--kt-progress-bg": "linear-gradient(90deg, #ff4500, #ff8c00)",
                    "--kt-button-color": "#ff4500"
                },
                "cost": 80,
                "coin_cost": 15,
                "min_level": 4,
                "rarity": "rare",
                "tags": ["fire", "red", "orange"]
            },
            "ice": {
                "id": "theme_ice",
                "name": "Thème Glace",
                "description": "Des teintes glacées",
                "category": "theme",
                "subcategory": "card",
                "colors": {
                    "--kt-primary": "#4dd0e1",
                    "--kt-success": "#80deea",
                    "--kt-progress-bg": "linear-gradient(90deg, #4dd0e1, #80deea)",
                    "--kt-button-color": "#26c6da"
                },
                "cost": 80,
                "coin_cost": 15,
                "min_level": 4,
                "rarity": "rare",
                "tags": ["ice", "blue", "cold"]
            }
        },
        "animation": {
            "confetti": {
                "id": "anim_confetti",
                "name": "Confettis",
                "description": "Explosion de confettis colorés",
                "category": "animation",
                "subcategory": "card",
                "trigger": "task_complete",
                "animation_type": "particle",
                "particle_config": {
                    "type": "confetti",
                    "count": 50,
                    "duration": 3,
                    "colors": ["#ff0000", "#00ff00", "#0000ff", "#ffff00"]
                },
                "cost": 50,
                "coin_cost": 8,
                "rarity": "uncommon",
                "tags": ["celebration", "colorful"]
            },
            "fireworks": {
                "id": "anim_fireworks",
                "name": "Feu d'artifice",
                "description": "Spectacle pyrotechnique",
                "category": "animation",
                "subcategory": "card",
                "trigger": "level_up",
                "animation_type": "particle",
                "particle_config": {
                    "type": "fireworks",
                    "count": 5,
                    "duration": 5
                },
                "cost": 100,
                "coin_cost": 20,
                "min_level": 5,
                "rarity": "epic",
                "tags": ["celebration", "spectacular"]
            }
        },
        "progress_bar": {
            "neon": {
                "id": "bar_neon",
                "name": "Barre néon",
                "description": "Style néon lumineux",
                "category": "progress_bar",
                "subcategory": "card",
                "css_class": "progress-neon",
                "css_properties": {
                    "border-radius": "10px",
                    "box-shadow": "0 0 10px currentColor",
                    "animation": "pulse-glow 1s infinite alternate"
                },
                "cost": 45,
                "coin_cost": 7,
                "rarity": "uncommon",
                "tags": ["modern", "glow"]
            },
            "pixel": {
                "id": "bar_pixel",
                "name": "Barre Pixel",
                "description": "Style retrogaming 8-bit",
                "category": "progress_bar",
                "subcategory": "card",
                "css_class": "progress-pixel",
                "css_properties": {
                    "border-radius": "0",
                    "image-rendering": "pixelated",
                    "border": "2px solid #000"
                },
                "cost": 45,
                "coin_cost": 7,
                "rarity": "uncommon",
                "tags": ["retro", "gaming"]
            }
        }
    },

    # === SPECIAL COSMETICS ===
    "special": {
        "sound": {
            "success_fanfare": {
                "id": "sound_fanfare",
                "name": "Fanfare de victoire",
                "description": "Un son triomphal",
                "category": "sound",
                "subcategory": "special",
                "sound_url": "/local/kids-tasks/sounds/fanfare.mp3",
                "trigger": "task_complete",
                "volume": 0.7,
                "cost": 30,
                "coin_cost": 5,
                "rarity": "common",
                "tags": ["celebration", "triumph"]
            },
            "level_up_chime": {
                "id": "sound_levelup",
                "name": "Chime de level up",
                "category": "sound",
                "subcategory": "special",
                "sound_url": "/local/kids-tasks/sounds/levelup.mp3",
                "trigger": "level_up",
                "volume": 0.8,
                "cost": 40,
                "coin_cost": 6,
                "rarity": "uncommon",
                "tags": ["gaming", "achievement"]
            }
        },
        "badge": {
            "champion": {
                "id": "badge_champion",
                "name": "Champion",
                "description": "Badge de champion",
                "category": "badge",
                "subcategory": "special",
                "icon": "🏆",
                "color": "#ffd700",
                "position": "next_to_name",
                "cost": 100,
                "coin_cost": 20,
                "min_level": 5,
                "rarity": "epic",
                "tags": ["achievement", "gold"]
            },
            "star": {
                "id": "badge_star",
                "name": "Super Star",
                "category": "badge",
                "subcategory": "special",
                "icon": "⭐",
                "color": "#ffeb3b",
                "position": "next_to_name",
                "cost": 80,
                "coin_cost": 15,
                "min_level": 3,
                "rarity": "rare",
                "tags": ["achievement", "bright"]
            }
        },
        "title": {
            "task_master": {
                "id": "title_master",
                "name": "Maître des Tâches",
                "description": "Titre ultime de productivité",
                "category": "title",
                "subcategory": "special",
                "display_text": "🌟 Maître des Tâches 🌟",
                "position": "under_name",
                "cost": 120,
                "coin_cost": 25,
                "min_level": 10,
                "rarity": "legendary",
                "tags": ["achievement", "mastery"]
            },
            "lightning": {
                "id": "title_lightning",
                "name": "L'Éclair",
                "description": "Pour les plus rapides",
                "category": "title",
                "subcategory": "special",
                "display_text": "⚡ L'Éclair ⚡",
                "position": "under_name",
                "cost": 90,
                "coin_cost": 18,
                "min_level": 6,
                "rarity": "epic",
                "tags": ["speed", "achievement"]
            }
        },
        "powerup": {
            "double_points": {
                "id": "powerup_2x",
                "name": "Points x2",
                "description": "Double les points pendant 24h",
                "category": "powerup",
                "subcategory": "special",
                "duration_hours": 24,
                "effect": "points_multiplier",
                "multiplier": 2.0,
                "cost": 150,
                "coin_cost": 30,
                "consumable": true,
                "min_level": 5,
                "rarity": "epic",
                "tags": ["boost", "temporary"]
            },
            "shield": {
                "id": "powerup_shield",
                "name": "Bouclier Anti-Pénalité",
                "description": "Protège d'une pénalité",
                "category": "powerup",
                "subcategory": "special",
                "effect": "penalty_immunity",
                "uses": 1,
                "cost": 100,
                "coin_cost": 20,
                "consumable": true,
                "min_level": 3,
                "rarity": "rare",
                "tags": ["protection", "safety"]
            },
            "vision": {
                "id": "powerup_vision",
                "name": "Vision Secrète",
                "description": "Révèle les récompenses cachées pendant 48h",
                "category": "powerup",
                "subcategory": "special",
                "duration_hours": 48,
                "effect": "reveal_secrets",
                "cost": 80,
                "coin_cost": 15,
                "consumable": true,
                "min_level": 4,
                "rarity": "rare",
                "tags": ["discovery", "temporary"]
            }
        },
        "mascot": {
            "dragon": {
                "id": "mascot_dragon",
                "name": "Dragon",
                "description": "Un dragon loyal",
                "category": "mascot",
                "subcategory": "special",
                "image_url": "/local/kids-tasks/mascots/dragon.png",
                "position": "corner_bottom_right",
                "size": "medium",
                "reactions": {
                    "idle": "/local/kids-tasks/mascots/dragon_idle.png",
                    "task_complete": "/local/kids-tasks/mascots/dragon_happy.png",
                    "task_missed": "/local/kids-tasks/mascots/dragon_sad.png",
                    "level_up": "/local/kids-tasks/mascots/dragon_excited.png"
                },
                "animation": "float",
                "cost": 200,
                "coin_cost": 40,
                "min_level": 8,
                "rarity": "legendary",
                "tags": ["companion", "fantasy"]
            },
            "robot_buddy": {
                "id": "mascot_robot",
                "name": "Robot Buddy",
                "category": "mascot",
                "subcategory": "special",
                "image_url": "/local/kids-tasks/mascots/robot.png",
                "position": "corner_bottom_left",
                "size": "small",
                "reactions": {
                    "idle": "/local/kids-tasks/mascots/robot_idle.png",
                    "task_complete": "/local/kids-tasks/mascots/robot_thumbsup.png",
                    "task_missed": "/local/kids-tasks/mascots/robot_worried.png"
                },
                "animation": "bounce",
                "cost": 150,
                "coin_cost": 30,
                "min_level": 6,
                "rarity": "epic",
                "tags": ["companion", "technology"]
            }
        }
    }
}
```

### Cosmétiques Appliqués à un Enfant

```python
# Structure stockée dans entity.attributes.cosmetics
child_cosmetics = {
    "owned": [
        # Liste des IDs de cosmétiques débloqués
        "avatar_astronaut",
        "outfit_spacesuit",
        "companion_robot",
        "bg_space",
        "theme_fire",
        "badge_star"
    ],

    "equipped": {
        "avatar": {
            "base": "avatar_astronaut",
            "outfit": "outfit_spacesuit",
            "companion": "companion_robot",
            "effect": None
        },
        "card": {
            "background": "bg_space",
            "theme": "theme_fire",
            "animation": None,
            "progress_bar": None
        },
        "special": {
            "sound": None,
            "badge": "badge_star",
            "title": None,
            "mascot": None
        }
    },

    "active_powerups": [
        {
            "id": "powerup_2x",
            "activated_at": "2025-10-09T10:00:00Z",
            "expires_at": "2025-10-10T10:00:00Z",
            "remaining_uses": None  # Pour les powerups à usage unique
        }
    ],

    "stats": {
        "total_owned": 6,
        "total_equipped": 5,
        "rarest_owned": "epic"
    }
}
```

---

## Implémentation Frontend

### Rendu Avatar Composite

```javascript
// Dans child-card.js ou base-card.js

renderAvatarWithCosmetics(child) {
    const cosmetics = child.cosmetics?.equipped?.avatar || {};
    const catalog = this.getCosmeticCatalog(); // Récupéré depuis sensor.kids_tasks_cosmetics

    let html = '<div class="kt-avatar-composite">';

    // Layer 1 : Base avatar (obligatoire)
    if (cosmetics.base) {
        const baseData = catalog.avatar.base[cosmetics.base];
        html += `<img src="${baseData.image_url}" class="avatar-base" alt="${baseData.name}">`;
    } else {
        html += '<div class="avatar-default">👤</div>';
    }

    // Layer 2 : Outfit (optionnel)
    if (cosmetics.outfit) {
        const outfitData = catalog.avatar.outfit[cosmetics.outfit];
        html += `<img src="${outfitData.image_url}"
                     class="avatar-layer outfit"
                     style="z-index: ${outfitData.layer_order}">`;
    }

    // Layer 3 : Companion (à côté)
    if (cosmetics.companion) {
        const companionData = catalog.avatar.companion[cosmetics.companion];
        html += `<img src="${companionData.image_url}"
                     class="avatar-companion avatar-companion-${companionData.position}"
                     data-animation="${companionData.animation}">`;
    }

    // Layer 4 : Effect (CSS)
    if (cosmetics.effect) {
        const effectData = catalog.avatar.effect[cosmetics.effect];
        if (effectData.effect_type === 'css') {
            html += `<div class="avatar-effect ${effectData.css_class}"></div>`;
        } else if (effectData.effect_type === 'particle') {
            html += this.renderParticleEffect(effectData);
        }
    }

    html += '</div>';
    return html;
}

// Application des cosmétiques de carte
applyCardCosmetics(child) {
    const cosmetics = child.cosmetics?.equipped?.card || {};
    const catalog = this.getCosmeticCatalog();
    const cardElement = this.shadowRoot.querySelector('.kidstask-card');

    if (!cardElement) return;

    // 1. Background
    if (cosmetics.background) {
        const bgData = catalog.card.background[cosmetics.background];
        if (bgData.type === 'image') {
            cardElement.style.backgroundImage = `url('${bgData.data}')`;
            cardElement.style.backgroundSize = 'cover';
            cardElement.style.backgroundPosition = 'center';
        } else if (bgData.type === 'gradient') {
            cardElement.style.background = bgData.data;
        }
    }

    // 2. Theme (couleurs)
    if (cosmetics.theme) {
        const themeData = catalog.card.theme[cosmetics.theme];
        Object.entries(themeData.colors).forEach(([property, value]) => {
            cardElement.style.setProperty(property, value);
        });
    }

    // 3. Progress bar style
    if (cosmetics.progress_bar) {
        const barData = catalog.card.progress_bar[cosmetics.progress_bar];
        const progressBars = cardElement.querySelectorAll('.progress-bar, .kt-gauge-fill');
        progressBars.forEach(bar => {
            bar.classList.add(barData.css_class);
            if (barData.css_properties) {
                Object.entries(barData.css_properties).forEach(([prop, val]) => {
                    bar.style[prop] = val;
                });
            }
        });
    }

    // 4. Animation (sera déclenchée par les événements)
    if (cosmetics.animation) {
        this._activeAnimation = cosmetics.animation;
    }
}

// Déclencher une animation cosmétique
triggerCosmeticAnimation(trigger) {
    const cosmetics = this.child?.cosmetics?.equipped?.card;
    if (!cosmetics?.animation) return;

    const catalog = this.getCosmeticCatalog();
    const animData = catalog.card.animation[cosmetics.animation];

    if (animData.trigger !== trigger) return;

    if (animData.animation_type === 'particle') {
        this.playParticleAnimation(animData.particle_config);
    }
}

// Système de particules (confettis, etc.)
playParticleAnimation(config) {
    const canvas = document.createElement('canvas');
    canvas.className = 'cosmetic-particles';
    canvas.width = this.offsetWidth;
    canvas.height = this.offsetHeight;
    this.shadowRoot.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Implémenter l'animation de particules
    // (Code d'animation canvas à développer)

    setTimeout(() => canvas.remove(), config.duration * 1000);
}

// Appliquer les cosmétiques spéciaux
applySpecialCosmetics(child) {
    const cosmetics = child.cosmetics?.equipped?.special || {};
    const catalog = this.getCosmeticCatalog();

    // Badge
    if (cosmetics.badge) {
        const badgeData = catalog.special.badge[cosmetics.badge];
        this.renderBadge(badgeData);
    }

    // Title
    if (cosmetics.title) {
        const titleData = catalog.special.title[cosmetics.title];
        this.renderTitle(titleData);
    }

    // Mascot
    if (cosmetics.mascot) {
        const mascotData = catalog.special.mascot[cosmetics.mascot];
        this.renderMascot(mascotData);
    }

    // Sons (seront joués lors des événements)
    if (cosmetics.sound) {
        this._activeSounds = cosmetics.sound;
    }
}

// Afficher les power-ups actifs
renderActivePowerups(child) {
    const powerups = child.cosmetics?.active_powerups || [];
    if (powerups.length === 0) return '';

    const now = new Date();

    return `
        <div class="active-powerups">
            ${powerups.map(powerup => {
                const expiresAt = new Date(powerup.expires_at);
                const remaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60)); // heures

                return `
                    <div class="powerup-indicator" data-id="${powerup.id}">
                        <span class="powerup-icon">⚡</span>
                        <span class="powerup-timer">${remaining}h</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}
```

### CSS pour les Cosmétiques

```css
/* Avatar Composite */
.kt-avatar-composite {
    position: relative;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-base {
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 10;
}

.avatar-layer.outfit {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.avatar-companion {
    position: absolute;
    width: 50%;
    height: 50%;
    object-fit: contain;
}

.avatar-companion-left {
    left: -30%;
    top: 50%;
    transform: translateY(-50%);
}

.avatar-companion-right {
    right: -30%;
    top: 50%;
    transform: translateY(-50%);
}

.avatar-companion[data-animation="float"] {
    animation: float 3s ease-in-out infinite;
}

.avatar-companion[data-animation="bounce"] {
    animation: bounce 2s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(-50%) translateY(0); }
    50% { transform: translateY(-50%) translateY(-10px); }
}

@keyframes bounce {
    0%, 100% { transform: translateY(-50%) scale(1); }
    50% { transform: translateY(-50%) scale(1.1); }
}

/* Effets d'avatar */
.avatar-glow-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    pointer-events: none;
    z-index: 30;
}

.avatar-glow-effect {
    box-shadow: 0 0 20px rgba(0, 200, 255, 0.8);
    animation: pulse-glow 2s infinite alternate;
}

@keyframes pulse-glow {
    from { box-shadow: 0 0 10px rgba(0, 200, 255, 0.4); }
    to { box-shadow: 0 0 30px rgba(0, 200, 255, 1); }
}

/* Progress bar styles */
.progress-neon {
    border-radius: 10px;
    box-shadow: 0 0 10px currentColor;
    animation: pulse-glow 1s infinite alternate;
}

.progress-pixel {
    border-radius: 0;
    image-rendering: pixelated;
    border: 2px solid #000;
}

/* Mascotte */
.mascot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 80px;
    height: 80px;
    z-index: 1000;
    pointer-events: none;
}

.mascot-container[data-animation="float"] {
    animation: float 3s ease-in-out infinite;
}

/* Badges et titres */
.child-badge {
    display: inline-block;
    margin-left: 8px;
    font-size: 1.2em;
    vertical-align: middle;
}

.child-title {
    display: block;
    font-size: 0.9em;
    color: var(--secondary-text-color);
    margin-top: 4px;
}

/* Power-ups actifs */
.active-powerups {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.powerup-indicator {
    background: var(--kt-primary);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Canvas pour particules */
.cosmetic-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}
```

---

## Plan d'Implémentation en 5 Phases

### Phase 1 : Infrastructure Backend (kids-task-ha)

**Durée estimée :** 2-3 jours

**Tâches :**
1. Créer `cosmetics_catalog.py` avec le catalogue complet
2. Ajouter le champ `cosmetics` dans le modèle Child
3. Créer un sensor `sensor.kids_tasks_cosmetics` exposant le catalogue
4. Implémenter la logique de déverrouillage (coût, niveau min, etc.)

**Services à créer :**
- `kids_tasks.claim_cosmetic` : Acheter/débloquer un cosmétique
- `kids_tasks.equip_cosmetic` : Équiper un cosmétique débloqué
- `kids_tasks.unequip_cosmetic` : Déséquiper
- `kids_tasks.activate_powerup` : Activer un power-up

**Données d'exemple :**
```python
# Dans const.py
DEFAULT_COSMETICS = {
    "avatar_default": {"category": "base", "cost": 0, "owned_by_default": True},
    "bg_default": {"category": "background", "cost": 0, "owned_by_default": True}
}
```

---

### Phase 2 : Infrastructure Fichiers

**Durée estimée :** 1 jour

**Structure à créer :**
```
/config/www/kids-tasks/
├── avatar/
│   ├── base/
│   │   ├── astronaut.png
│   │   ├── pirate.png
│   │   ├── ninja.png
│   │   └── princess.png
│   ├── outfit/
│   │   ├── spacesuit.png
│   │   ├── pirate_coat.png
│   │   └── ninja_mask.png
│   └── companion/
│       ├── robot.png
│       ├── parrot.png
│       └── dragon.png
├── backgrounds/
│   ├── space.jpg
│   ├── forest.jpg
│   ├── ocean.jpg
│   └── castle.jpg
├── sounds/
│   ├── fanfare.mp3
│   ├── levelup.mp3
│   └── complete.mp3
└── mascots/
    ├── dragon_idle.png
    ├── dragon_happy.png
    ├── robot_idle.png
    └── robot_thumbsup.png
```

**Assets de démarrage :**
- 4-5 avatars de base (PNG transparents, 512x512px)
- 3-4 outfits compatibles
- 2-3 companions
- 4-5 backgrounds (JPG 1920x1080px)
- 2-3 sons (MP3, <100kb)
- 1-2 mascots avec états (PNG 256x256px)

**Sources d'assets :**
- OpenGameArt.org (libre de droits)
- Kenney.nl (assets gratuits)
- Freesound.org (sons)
- Générer avec IA (Midjourney, DALL-E) si budget

---

### Phase 3 : Frontend Basique

**Durée estimée :** 3-4 jours

**3.1 Rendu avatar composite**
- Implémenter `renderAvatarWithCosmetics()` dans `base-card.js`
- Support des layers (base, outfit, companion)
- Animations CSS pour companions
- Effets CSS basiques

**3.2 Application cosmétiques carte**
- Implémenter `applyCardCosmetics()` dans `child-card.js`
- Background (image + gradient)
- Thèmes de couleurs (CSS variables)
- Style des progress bars

**3.3 UI de sélection (modal)**
- Créer modal "Boutique de Cosmétiques"
- Affichage par catégories (Avatar, Carte, Spéciaux)
- Filtres : owned/not owned, par rareté, par catégorie
- Prévisualisation en temps réel de l'avatar
- Boutons Acheter/Équiper/Déséquiper

**3.4 Indicateurs visuels**
- Badge de rareté (common, rare, epic, legendary)
- Icône de verrouillage pour cosmétiques non débloqués
- Indicateur "Équipé" sur les cosmétiques actifs
- Affichage du coût (points + coins)

---

### Phase 4 : Cosmétiques Spéciaux

**Durée estimée :** 3-4 jours

**4.1 Power-ups**
- Logique d'expiration (vérification périodique)
- Calcul des multiplicateurs côté backend
- Affichage des power-ups actifs avec timer
- Notification d'expiration

**4.2 Effets sonores**
- Player audio HTML5
- Gestion des triggers (task_complete, level_up)
- Option globale de mute/unmute
- Préchargement des sons au chargement de la carte

**4.3 Badges et titres**
- Affichage à côté du nom (badge)
- Affichage sous le nom (title)
- Style adapté au thème actif

**4.4 Mascotte interactive**
- Rendu dans un coin de la carte
- États émotionnels selon les événements
- Transition smooth entre états
- Animation idle en boucle

**4.5 Animations avancées**
- Système de particules Canvas
- Confettis (explosion colorée)
- Feu d'artifice (level up)
- Étincelles (effet avatar)

---

### Phase 5 : Polish & Tests

**Durée estimée :** 2-3 jours

**5.1 Tests unitaires**
- Tester chaque catégorie de cosmétique individuellement
- Tester les combinaisons (outfit + companion)
- Vérifier la compatibilité (outfit avec bon avatar)
- Tester les conditions (niveau min, coût)

**5.2 Performance**
- Optimiser le chargement des images (lazy loading)
- Compresser les assets
- Limiter les animations simultanées
- Caching des données du catalogue

**5.3 Fallbacks**
- Image manquante → placeholder
- Son non disponible → silencieux
- Cosmétique inconnu → défaut

**5.4 UX**
- Animations de transition fluides
- Feedback visuel lors de l'équipement
- Tutorial/introduction pour les nouveaux utilisateurs
- Tooltips explicatifs

**5.5 Documentation**
- Guide utilisateur : comment débloquer et équiper
- Guide développeur : comment ajouter de nouveaux cosmétiques
- Documentation du catalogue (format JSON)

---

## Priorités d'Implémentation

**Immédiat (MVP) :**
1. ✅ Phase 1 : Backend (catalogue + services)
2. ✅ Phase 2 : Infrastructure fichiers
3. ✅ Phase 3.1-3.2 : Rendu basique (avatar + carte)

**Court terme :**
4. Phase 3.3-3.4 : UI de sélection
5. Phase 4.1 : Power-ups

**Moyen terme :**
6. Phase 4.2-4.3 : Sons, badges, titres
7. Phase 4.4 : Mascotte

**Long terme :**
8. Phase 4.5 : Animations avancées
9. Phase 5 : Polish complet

---

## Évolutions Futures

### Système de craft
- Combiner plusieurs cosmétiques pour en créer un nouveau
- Recettes de craft à découvrir

### Cosmétiques saisonniers
- Thèmes de Noël, Halloween, etc.
- Disponibles uniquement pendant certaines périodes

### Cosmétiques légendaires
- Très rares, nécessitent des achievements spéciaux
- Effets visuels spectaculaires

### Partage de cosmétiques
- Option pour partager un cosmétique avec un autre enfant
- Système de prêt temporaire

### Éditeur de cosmétiques
- Permettre aux parents de créer des cosmétiques custom
- Upload d'images personnalisées
- Générateur de gradients

### Statistiques de cosmétiques
- Cosmétiques les plus populaires
- Historique des cosmétiques portés
- Collection complète (achievements)

---

## Notes Techniques

### Limites de taille
- Images avatar : max 512x512px, PNG transparent, <200kb
- Backgrounds : max 1920x1080px, JPG, <500kb
- Sons : MP3, <100kb, durée <3s
- Mascots : max 256x256px, PNG, <150kb

### Performance
- Lazy loading des images (IntersectionObserver)
- Préchargement des assets critiques
- Limiter à 3 animations simultanées max
- Throttle des événements de particules

### Accessibilité
- Alt text pour toutes les images
- Option de désactiver les animations
- Contraste des couleurs respecté (WCAG AA)
- Navigation au clavier dans la boutique

### Compatibilité
- Support navigateurs : Chrome 90+, Firefox 88+, Safari 14+
- Fallback pour navigateurs anciens (cosmétiques désactivés)
- Mode dégradé si WebGL non disponible (pas de particules)

---

## Conclusion

Ce système de cosmétiques offre une expérience de gamification riche et motivante pour les enfants, avec 3 catégories principales (Avatar, Carte, Spéciaux) et de nombreuses possibilités d'extension future.

**Avantages :**
- Motivation accrue pour compléter les tâches
- Personnalisation unique pour chaque enfant
- Système évolutif et extensible
- Support de multiples types d'assets (images, sons, CSS)

**Défis techniques :**
- Gestion des assets (stockage, chargement)
- Performance (nombreuses images et animations)
- Compatibilité entre cosmétiques

**Recommandation :** Implémenter progressivement en commençant par le MVP (avatar basique + backgrounds) puis étendre selon le succès et les retours utilisateurs.
