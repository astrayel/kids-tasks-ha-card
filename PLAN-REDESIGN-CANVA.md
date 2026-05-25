# Plan de redesign — Kids Tasks Card (inspiré du mockup Canva)

## Contexte

Le mockup Canva (`DAHKVfzpgnc` — "Infographie - Kids Tasks Manager UI") définit un style visuel :
- Fond **violet sombre profond** (`#1E0B3B` / `#2C1654`)
- Sections en **violet moyen** (`#3D1F7A`)
- Stats affichées en **grands chiffres blancs** avec label en dessous
- Grille **2×2** pour les statistiques clés
- Typographie **grasse et contrastée**
- Séparateurs en pointillés violet clair
- Texte blanc / blanc semi-transparent

## Fichiers concernés

| Fichier | Rôle | Modifications prévues |
|---|---|---|
| `src/child-card.js` | Carte individuelle d'un enfant | OUI — principal |
| `src/style-manager.js` | Variables CSS globales | OUI — ajout du thème sombre |
| `src/card.js` | Carte wrapper principale | À évaluer après child-card |
| `src/manager-card.js` | Carte manager parent | À évaluer après child-card |

## Ce qui NE change PAS

- `shouldUpdate()` — détection des changements hass
- `set hass()` dans base-card.js — déclencheur de `smartRender()`
- `_setupSmartRefresh()` + `_getDataHash()` — refresh 30s avec hash
- `_setupVisibilityDetection()` — pause refresh page cachée
- `connectedCallback()` / `disconnectedCallback()` — lifecycle
- `handleAction()` — routing des actions
- `completeTask()` / `claimReward()` — appels services HA
- `getChild()` / `getChildTasks()` / `getRewards()` / `getChildStats()` — accès données

---

## Modifications détaillées : `src/child-card.js`

### 1. `getChildSpecificStyles()` — remplacer entièrement

Ajouter les variables de thème sombre dans `:host` puis réécrire les classes :

```css
:host {
  --kt-dark-bg: #1E0B3B;
  --kt-dark-section: #2D1254;
  --kt-dark-accent: #6B35A8;
  --kt-dark-border: rgba(107, 53, 168, 0.35);
  --kt-dark-text: #FFFFFF;
  --kt-dark-text-muted: rgba(255, 255, 255, 0.65);
  --kt-dark-separator: rgba(107, 53, 168, 0.4);
  --kt-dark-stat-num: #FFFFFF;
  --kt-dark-tab-active: #6B35A8;
  --kt-dark-tab-inactive: rgba(107, 53, 168, 0.2);
  --kt-dark-task-bg: rgba(45, 18, 84, 0.8);
  --kt-dark-task-border: rgba(107, 53, 168, 0.25);
}

.child-card-container {
  background: var(--kt-dark-bg);
  border-radius: var(--kt-radius-lg);
  overflow: hidden;
  color: var(--kt-dark-text);
}
```

Classes à réécrire :
- `.child-header` → fond `--kt-dark-section`, layout flex horizontal (avatar à gauche, infos à droite)
- `.child-name` → texte blanc, police 1.4rem bold
- `.child-level` → texte muted, `0.85rem`
- `.kt-stats-grid` → grille 2×2, séparée par `--kt-dark-border`
- `.kt-stat-box` → fond `--kt-dark-section`, centré
- `.kt-stat-number` → `2.5rem`, bold, blanc
- `.kt-stat-label` → `0.7rem`, muted
- `.kt-dotted-separator` → `border-top: 2px dotted var(--kt-dark-separator)`
- `.tabs` / `.tab-button` → pills arrondis, fond violet semi-transparent, actif en `--kt-dark-accent`
- `.task-item` → fond `--kt-dark-task-bg`, bordure `--kt-dark-task-border`, texte blanc
- `.task-status.*` → conserver les couleurs sémantiques (green/orange/blue) mais sur fond sombre
- `.task-points` → badge violet clair
- `.filter-btn` → style sombre, actif en `--kt-dark-accent`
- `.reward-item` → même traitement que `.task-item`
- `.empty-state` → texte muted sur fond sombre

### 2. `renderHeader(child)` — nouveau layout

**Avant** : centré, avatar emoji, stats en badges inline  
**Après** : layout en deux zones

```
┌─────────────────────────────────┐
│ [avatar]  Emma                  │
│           Niveau 7              │
├─────────────────────────────────┤ ← dotted separator
│   245      │     3              │
│  Points    │  Tâches auj.       │
│────────────┼────────────────────│
│    42      │     5              │
│  Pièces    │  Récompenses       │
└─────────────────────────────────┘
```

HTML cible :
```html
<div class="child-header">
  <div class="child-header__top">
    <div class="child-avatar">${this.getAvatar(child, '👶')}</div>
    <div class="child-header__info">
      <div class="child-name">${child.name}</div>
      <div class="child-level">Niveau ${child.level || 1}</div>
    </div>
  </div>
  <div class="kt-dotted-separator"></div>
  <div class="kt-stats-grid">
    <div class="kt-stat-box">
      <span class="kt-stat-number">${child.points || 0}</span>
      <span class="kt-stat-label">Points</span>
    </div>
    <div class="kt-stat-box">
      <span class="kt-stat-number">${stats.completedToday}</span>
      <span class="kt-stat-label">Tâches auj.</span>
    </div>
    <div class="kt-stat-box">
      <span class="kt-stat-number">${child.coins || 0}</span>
      <span class="kt-stat-label">Pièces</span>
    </div>
    <div class="kt-stat-box">
      <span class="kt-stat-number">${rewardsCount}</span>
      <span class="kt-stat-label">Récompenses</span>
    </div>
  </div>
  ${config.show_progress ? this.renderProgress(stats, child) : ''}
</div>
```

Note : `rewardsCount` = `this.getChildRewards(child.child_id).length`

### 3. `renderTabs()` — pills arrondis

Remplacer `.card-header` / `.navigation` / `.nav-button` par `.tabs` / `.tab-button` (déjà dans les styles) avec les nouvelles classes sombres. Pas de changement de logique.

### 4. `renderTaskItem(task)` — fond sombre

Ajouter classe `dark-theme` ou cibler directement via les styles `:host` (shadow DOM = isolation totale). Pas besoin de changer le HTML structure, juste les styles CSS.

### 5. `renderRewardItem(reward, child)` — fond sombre

Même chose que task-item.

---

## Modifications détaillées : `src/style-manager.js`

Ajouter dans `getOptimizedGlobalStyles()` un bloc de variables sombres en commentaire conditionnel :

```css
/* Dark theme extension (used by child-card) */
--kt-theme-dark-bg: #1E0B3B;
--kt-theme-dark-section: #2D1254;
--kt-theme-dark-accent: #6B35A8;
```

Ces variables sont facultatives car elles peuvent aussi rester dans `:host` du child-card.

---

## Ordre d'exécution

1. Cloner le repo `kids-tasks-ha-card` localement
2. Checkout branche `claude/wonderful-carson-jg0EO`
3. Modifier `src/child-card.js` :
   - `getChildSpecificStyles()` — thème sombre complet
   - `renderHeader(child)` — nouveau layout 2 zones
   - `renderTabs()` — pills arrondis
4. Build : `npm run build`
5. Vérifier `dist/kids-tasks-card.js` généré
6. Commit + push sur `claude/wonderful-carson-jg0EO`
7. Évaluer si `card.js` / `manager-card.js` ont besoin du même traitement

---

## Références

- **Mockup Canva** : `https://www.canva.com/design/DAHKVfzpgnc/` (design ID: `DAHKVfzpgnc`)
- **Branche de travail** : `claude/wonderful-carson-jg0EO` dans `astrayel/kids-tasks-ha-card`
- **Fichier principal** : `src/child-card.js`
- **Contrainte principale** : ne pas toucher à `astrayel/kids-tasks-ha` (intégration HA)
