# Plan d'Architecture - Kids Tasks Cards v2.0

**Date**: 2025-11-23
**Objectif**: Compléter les 3 cartes Home Assistant pour un système complet de gestion de tâches enfants

---

## 🎯 VUE D'ENSEMBLE

### Cartes Finales

1. **Carte Enfant** (`child-card.js`) - Interface enfant interactive
2. **Carte Supervisor** (`supervisor-card.js`) - Interface parent pour validation et supervision
3. **Carte Manager** (`manager-card.js`) - Interface admin pour CRUD complet

### Architecture Technique

```
kids-tasks-ha-card/
├── src/
│   ├── card.js                      # Dashboard principal (existant)
│   ├── child-card.js                # Carte enfant (à enrichir)
│   ├── supervisor-card.js           # Carte supervisor (NOUVEAU)
│   ├── manager-card.js              # Carte manager (à compléter)
│   ├── base-card.js                 # Classe de base (existant)
│   ├── cosmetics/
│   │   ├── avatar-system.js         # Système d'avatar layers PNG (NOUVEAU)
│   │   ├── avatar-builder.js        # Interface personnalisation (NOUVEAU)
│   │   ├── cosmetic-manager.js      # Gestionnaire cosmétiques (NOUVEAU)
│   │   └── cache-manager.js         # Cache navigateur (NOUVEAU)
│   ├── forms/
│   │   ├── task-form.js             # Formulaire tâches (NOUVEAU)
│   │   ├── reward-form.js           # Formulaire récompenses (NOUVEAU)
│   │   ├── child-form.js            # Formulaire enfants (NOUVEAU)
│   │   └── habit-form.js            # Formulaire habitudes (NOUVEAU)
│   ├── utils.js                     # Utilitaires (existant)
│   ├── style-manager.js             # Styles (existant)
│   ├── logger.js                    # Logger (existant)
│   └── performance-monitor.js       # Monitoring (existant)
└── assets/
    └── avatars/                      # Assets PNG (NOUVEAU)
        ├── base/                     # Corps de base
        ├── hair/                     # Coiffures
        ├── eyes/                     # Yeux
        ├── outfits/                  # Tenues
        └── accessories/              # Accessoires
```

---

## 📱 CARTE 1: CARTE ENFANT (child-card.js)

### Fonctionnalités Existantes

✅ Affichage points, pièces, niveau
✅ Liste des tâches avec filtres
✅ Complétion de tâches
✅ Liste des récompenses disponibles
✅ Onglets (tâches, récompenses, historique)

### Fonctionnalités à Ajouter

#### A. Avatar Personnalisable Grande Taille
- **Position**: Partie gauche de la carte (30-40% de la largeur)
- **Composants**:
  - Avatar en layers PNG (corps + cheveux + yeux + tenue + accessoires)
  - Animation idle subtile (respiration, clignement)
  - Bouton "Personnaliser" pour ouvrir l'avatar builder
  - Cache des rendus pour performance

#### B. Tâches Enrichies
- **Horaire indicatif**: Afficher `deadline_time` si présent
- **Filtres étendus**:
  - À faire (todo)
  - Faites (completed/validated)
  - Bonus (frequency: none)
  - Habitudes (recurring avec streak count)
- **Vue des tâches du lendemain**: Nouveau filtre "Demain"
- **Indicateur validation**: Badge "En attente" pour pending_validation

#### C. Historique Détaillé
- **Points**: Liste des 20 dernières transactions
  - Date/heure
  - Action (tâche complétée, bonus, ajustement)
  - Montant (+/-)
  - Raison
- **Pièces**: Idem pour les coins
- **Graphique simple**: Évolution sur 7 jours (optionnel)

#### D. Récompenses Achetées
- **Nouvel onglet**: "Mes Récompenses"
- **Liste**: Récompenses réclamées (claimed_rewards dans historique)
- **Affichage**:
  - Nom de la récompense
  - Date d'achat
  - Coût payé
  - Type (réelle/cosmétique)

#### E. Streaks Habitudes
- **Affichage**: Badge avec 🔥 + nombre de jours
- **Calcul**: Basé sur `last_completed_at` et fréquence
- **Récompense**: Points bonus par streak (configurable)

### Layout Carte Enfant

```
┌─────────────────────────────────────────────┐
│  [Avatar Grande Taille]  │ [Stats Enfant]   │
│  [Animations]            │ Points: 450 🎫   │
│  [Équipements]           │ Pièces: 120 🪙   │
│  [Compagnon?]            │ Niveau: 5        │
│                          │                  │
│  [Personnaliser]         │ [Barre XP]       │
├──────────────────────────┴──────────────────┤
│  [Tâches] [Récompenses] [Historique] [Mes Récompenses] │
├──────────────────────────────────────────────┤
│  [Filtres: À faire | Faites | Bonus | Habitudes | Demain] │
├──────────────────────────────────────────────┤
│  📝 Ranger ma chambre     ⏰ 18:00  [✓]     │
│  🧺 Mettre le linge       ⏰ 19:00  [✓]     │
│  📚 Faire mes devoirs     🔥 5 jours [✓]    │
│  🐕 Promener le chien                [✓]    │
└──────────────────────────────────────────────┘
```

---

## 👨‍👩‍👧 CARTE 2: CARTE SUPERVISOR (supervisor-card.js)

### Objectif
Interface parent pour **valider** les tâches et **superviser** les enfants sans accéder au CRUD complet.

### Fonctionnalités

#### A. Vue des Validations en Attente
- **Liste prioritaire**: Tâches avec `status: pending_validation`
- **Affichage**:
  - Nom de la tâche
  - Enfant concerné
  - Date/heure de complétion
  - Points à attribuer
  - Actions: ✅ Valider / ❌ Rejeter
- **Gestes tactiles**: Swipe left (rejeter) / Swipe right (valider)

#### B. Vue par Enfant
- **Grille des enfants**: Cartes résumé avec avatar
- **Pour chaque enfant**:
  - Avatar
  - Nom
  - Points, Pièces, Niveau
  - Tâches complétées aujourd'hui
  - Bouton "Voir détails"

#### C. Actions Rapides
- **Ajouter/Retirer Points**: Formulaire modal rapide
  - Sélection enfant
  - Montant points/pièces
  - Raison
- **Ajouter Cosmétique**: Donner un cosmétique à un enfant
  - Sélection enfant
  - Sélection cosmétique du catalogue
  - Confirmation

#### D. Historique Global
- **Vue combinée**: Historique de tous les enfants
- **Filtres**:
  - Par enfant
  - Par type d'action
  - Par période (aujourd'hui, cette semaine, ce mois)
- **Actions**:
  - Voir détails
  - Annuler une transaction (avec confirmation)

### Layout Carte Supervisor

```
┌──────────────────────────────────────────────┐
│  [Validations] [Enfants] [Historique] [Actions] │
├──────────────────────────────────────────────┤
│  ⚠️ 3 tâches en attente de validation        │
├──────────────────────────────────────────────┤
│  📝 Ranger ma chambre - Emma                 │
│  Complétée il y a 5 min · +10 🎫            │
│  [← Rejeter]              [Valider →]       │
├──────────────────────────────────────────────┤
│  🧺 Mettre le linge - Lucas                  │
│  Complétée il y a 15 min · +8 🎫            │
│  [← Rejeter]              [Valider →]       │
└──────────────────────────────────────────────┘
```

---

## ⚙️ CARTE 3: CARTE MANAGER (manager-card.js)

### Fonctionnalités Existantes

✅ Navigation par onglets (Enfants, Tâches, Récompenses, Cosmétiques)
✅ Affichage listes
✅ Formulaire enfant (add/edit)
🚧 Placeholder pour add/edit tâches/récompenses

### Fonctionnalités à Ajouter

#### A. CRUD Enfants (Compléter)
✅ Création (existant)
✅ Édition (existant)
✅ Suppression (existant)
❌ **À ajouter**: Interface de gestion des cosmétiques par enfant
❌ **À ajouter**: Réinitialisation des points/niveau

#### B. CRUD Tâches (Implémenter)
- **Formulaire complet**:
  - Nom, description
  - Catégorie (avec icône)
  - Points, coins
  - Fréquence (daily, weekly, monthly, once, none)
  - Jours de la semaine (si weekly)
  - Heure limite (deadline_time)
  - Validation requise (checkbox)
  - Pénalité si non faite (points à déduire)
  - Assignation multi-enfants (checkboxes)
  - Actif/Inactif (toggle)
- **Actions**:
  - Éditer
  - Supprimer (avec confirmation)
  - Suspendre temporairement
  - Dupliquer

#### C. CRUD Récompenses (Implémenter)
- **Formulaire complet**:
  - Nom, description
  - Catégorie (avec icône)
  - Coût en points
  - Coût en pièces (optionnel)
  - Type (réelle / cosmétique)
  - Si cosmétique: Sélection du type (avatar, tenue, accessoire)
  - Quantité limitée (checkbox + nombre)
  - Niveau minimum requis
  - Active/Inactive (toggle)
- **Actions**:
  - Éditer
  - Supprimer (avec confirmation)
  - Dupliquer

#### D. CRUD Habitudes (Nouveau Concept?)
**Question**: Les habitudes sont-elles différentes des tâches récurrentes ?
- Si OUI: Créer un système séparé avec streak tracking
- Si NON: Utiliser les tâches récurrentes existantes avec un flag `habit: true`

**Proposition**: Utiliser les tâches récurrentes + badge "Habitude" + compteur streak

#### E. Gestion Cosmétiques
- **Catalogue**: Liste de tous les cosmétiques disponibles
- **Actions**:
  - Créer cosmétique (nom, type, asset PNG)
  - Éditer cosmétique
  - Supprimer cosmétique
  - Prévisualiser cosmétique
  - Attribuer à un enfant (sans coût)
- **Import/Export**: JSON des cosmétiques

### Layout Carte Manager

```
┌──────────────────────────────────────────────┐
│  [👦 Enfants] [📝 Tâches] [🎁 Récompenses] [🎨 Cosmétiques] │
├──────────────────────────────────────────────┤
│  [Filtres: Actives | Inactives | Bonus | Toutes] │
│  [+ Ajouter une tâche]                       │
├──────────────────────────────────────────────┤
│  📝 Ranger ma chambre                        │
│  👤 Emma, Lucas · 📅 Quotidienne · +10 🎫   │
│  [Éditer] [Dupliquer] [Suspendre] [Supprimer] │
├──────────────────────────────────────────────┤
│  🧺 Mettre le linge                          │
│  👤 Tous · 📅 Hebdo (L,M,V) · +8 🎫         │
│  [Éditer] [Dupliquer] [Suspendre] [Supprimer] │
└──────────────────────────────────────────────┘
```

---

## 🎨 SYSTÈME D'AVATAR (NOUVEAU)

### Architecture

```javascript
// cosmetics/avatar-system.js
class AvatarSystem {
  constructor() {
    this.layers = ['base', 'hair', 'eyes', 'outfit', 'accessory'];
    this.cache = new Map(); // Cache des rendus SVG
  }

  /**
   * Génère un avatar SVG à partir des cosmétiques équipés
   */
  generateAvatar(equippedCosmetics) {
    const cacheKey = this.getCacheKey(equippedCosmetics);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const svg = this.buildSVG(equippedCosmetics);
    this.cache.set(cacheKey, svg);
    return svg;
  }

  buildSVG(cosmetics) {
    // Construire le SVG avec les différentes couches
  }
}
```

### Format des Assets PNG

**Structure**:
```
assets/avatars/
├── base/
│   ├── body-1.png          # Silhouette simple
│   ├── body-2.png          # Silhouette alternative
│   └── skin-tones.json     # Variations de tons de peau
├── hair/
│   ├── short-1.png         # Cheveux courts
│   ├── long-1.png          # Cheveux longs
│   ├── curly-1.png         # Cheveux bouclés
│   └── ...
├── eyes/
│   ├── happy.png
│   ├── neutral.png
│   └── ...
├── outfits/
│   ├── tshirt-red.png
│   ├── dress-blue.png
│   └── ...
└── accessories/
    ├── hat-pirate.png
    ├── glasses.png
    └── ...
```

**Spécifications PNG**:
- Résolution: 200x200px (pour chaque layer)
- Format: PNG avec transparence (canal alpha)
- Style: Cartoon plat, couleurs vives
- Compatibilité: Superposition (z-index via ordre de rendu)

### Génération des Assets

**Option 1**: Générer avec IA (DALL-E, Midjourney)
- Prompt: "flat design cartoon avatar layer, transparent background, [description]"

**Option 2**: SVG inline avec CSS
- Plus léger, plus flexible
- Personnalisation des couleurs via CSS variables

**Recommandation**: Commencer avec SVG, migrer vers PNG si nécessaire

---

## 🗄️ SYSTÈME DE CACHE

### LocalStorage Cache

```javascript
// cosmetics/cache-manager.js
class CacheManager {
  constructor() {
    this.prefix = 'kt_avatar_';
    this.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours
  }

  getCachedAvatar(childId, cosmeticsHash) {
    const key = `${this.prefix}${childId}_${cosmeticsHash}`;
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const { svg, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > this.maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return svg;
  }

  cacheAvatar(childId, cosmeticsHash, svg) {
    const key = `${this.prefix}${childId}_${cosmeticsHash}`;
    localStorage.setItem(key, JSON.stringify({
      svg,
      timestamp: Date.now()
    }));
  }
}
```

---

## 📝 FORMULAIRES MODAUX

### Architecture Commune

```javascript
// forms/base-form.js
class BaseForm {
  constructor(hass, config = {}) {
    this.hass = hass;
    this.config = config;
  }

  show(data = null) {
    const isEdit = !!data;
    const content = this.renderForm(data, isEdit);
    const title = isEdit ? this.getEditTitle() : this.getAddTitle();

    return this.showModal(content, title);
  }

  renderForm(data, isEdit) {
    // À implémenter par les sous-classes
  }

  async submit(formData) {
    // À implémenter par les sous-classes
  }
}

// forms/task-form.js
class TaskForm extends BaseForm {
  renderForm(task, isEdit) {
    return `
      <form id="task-form">
        <ha-textfield name="name" label="Nom de la tâche" required
                     value="${task?.name || ''}"></ha-textfield>

        <ha-textarea name="description" label="Description"
                    value="${task?.description || ''}"></ha-textarea>

        <ha-select name="category" label="Catégorie" required>
          <ha-list-item value="bedroom">🛏️ Chambre</ha-list-item>
          <ha-list-item value="homework">📚 Devoirs</ha-list-item>
          <!-- ... -->
        </ha-select>

        <ha-textfield name="points" type="number" label="Points"
                     value="${task?.points || 0}"></ha-textfield>

        <ha-select name="frequency" label="Fréquence" required>
          <ha-list-item value="daily">Quotidienne</ha-list-item>
          <ha-list-item value="weekly">Hebdomadaire</ha-list-item>
          <ha-list-item value="once">Une fois</ha-list-item>
          <ha-list-item value="none">Bonus</ha-list-item>
        </ha-select>

        <ha-textfield name="deadline_time" type="time"
                     label="Heure limite (optionnel)"
                     value="${task?.deadline_time || ''}"></ha-textfield>

        <ha-switch name="validation_required"
                  ?checked="${task?.validation_required}">
          Validation parentale requise
        </ha-switch>

        <!-- Assignation multi-enfants -->
        <div class="children-checkboxes">
          ${this.renderChildrenCheckboxes(task?.assigned_child_ids)}
        </div>

        <div class="form-actions">
          <ha-button class="btn-secondary" onclick="this.closest('ha-dialog').close()">
            Annuler
          </ha-button>
          <ha-button class="btn-primary" onclick="this.submitForm()">
            ${isEdit ? 'Modifier' : 'Créer'}
          </ha-button>
        </div>
      </form>
    `;
  }

  async submit(formData) {
    const serviceData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      points: parseInt(formData.points),
      frequency: formData.frequency,
      assigned_child_ids: formData.assigned_child_ids,
      validation_required: formData.validation_required,
      deadline_time: formData.deadline_time || null
    };

    const service = formData.task_id ? 'update_task' : 'add_task';
    if (formData.task_id) {
      serviceData.task_id = formData.task_id;
    }

    await this.hass.callService('kids_tasks', service, serviceData);
  }
}
```

---

## 🔧 MODIFICATIONS BACKEND (Si Nécessaires)

### Streaks/Habitudes

**Option A**: Utiliser les tâches récurrentes existantes
- Ajouter un attribut `streak_count` calculé côté backend
- Logique: Comparer `last_completed_at` avec la fréquence
- Si complétée dans le délai attendu: incrémenter streak
- Si manquée: reset à 0

**Option B**: Créer un concept séparé "Habit"
- Nouvelle entité `Habit` distincte de `Task`
- Services: `add_habit`, `update_habit`, `complete_habit`
- Tracking automatique des streaks

**Recommandation**: Option A (plus simple, réutilise l'existant)

### Suspension Temporaire de Tâches

✅ Déjà disponible: `suspend_task` et `resume_task`
- Ajout UI dans le manager pour définir `until_date`

---

## 📊 PLAN D'IMPLÉMENTATION

### Phase 1: Infrastructure (2-3h)
1. ✅ Créer ARCHITECTURE-PLAN.md
2. Créer structure cosmetics/
3. Créer structure forms/
4. Implémenter AvatarSystem (SVG inline d'abord)
5. Implémenter CacheManager

### Phase 2: Carte Supervisor (3-4h)
1. Créer supervisor-card.js
2. Implémenter vue validations
3. Implémenter vue enfants
4. Implémenter actions rapides
5. Implémenter historique global
6. Ajouter gestes tactiles swipe

### Phase 3: Enrichir Carte Enfant (4-5h)
1. Intégrer AvatarSystem (grande taille)
2. Ajouter avatar builder modal
3. Ajouter filtres étendus (bonus, habitudes, demain)
4. Ajouter affichage horaires
5. Ajouter onglet "Mes Récompenses"
6. Implémenter streaks habitudes
7. Enrichir historique

### Phase 4: Compléter Carte Manager (4-5h)
1. Créer TaskForm (forms/task-form.js)
2. Créer RewardForm (forms/reward-form.js)
3. Intégrer formulaires dans manager-card.js
4. Implémenter toutes les actions CRUD
5. Ajouter gestion cosmétiques avancée
6. Ajouter fonctionnalité dupliquer

### Phase 5: Assets & Polish (2-3h)
1. Générer assets SVG cartoon (base, cheveux, yeux, tenues)
2. Créer catalogue de cosmétiques par défaut
3. Optimiser performances (lazy loading, cache)
4. Tests cross-browser
5. Documentation utilisateur

### Phase 6: Tests & Debug (2-3h)
1. Tester les 3 cartes individuellement
2. Tester les interactions entre cartes
3. Tester sur mobile/tablette
4. Corriger bugs
5. Optimisation finale

**Total Estimé**: 17-23 heures de développement

---

## 🎯 CRITÈRES DE SUCCÈS

### Carte Enfant
- [ ] Avatar grande taille visible avec équipements
- [ ] Personnalisation avatar fonctionnelle
- [ ] Tous les filtres de tâches fonctionnent
- [ ] Horaires indicatifs affichés
- [ ] Tâches du lendemain visibles
- [ ] Historique points/pièces détaillé
- [ ] Onglet "Mes Récompenses" fonctionnel
- [ ] Streaks habitudes affichés

### Carte Supervisor
- [ ] Validations en attente visibles
- [ ] Validation/Rejet fonctionnels
- [ ] Gestes swipe opérationnels
- [ ] Vue par enfant complète
- [ ] Actions rapides (ajouter points/cosmétiques)
- [ ] Historique global filtrable
- [ ] Annulation de transactions

### Carte Manager
- [ ] CRUD enfants complet
- [ ] CRUD tâches complet avec tous les paramètres
- [ ] CRUD récompenses complet
- [ ] Gestion cosmétiques fonctionnelle
- [ ] Suspension temporaire de tâches
- [ ] Duplication tâches/récompenses

### Système Avatar
- [ ] Rendu layers PNG/SVG
- [ ] Cache fonctionnel
- [ ] Interface personnalisation intuitive
- [ ] Catalogue cosmétiques chargé
- [ ] Performance optimale (<100ms rendu)

### Général
- [ ] Code maintenable et documenté
- [ ] Pas de redondance
- [ ] Compatible navigateurs modernes
- [ ] Responsive mobile/tablette
- [ ] Performances optimales (3 enfants, 30 tâches)

---

## 📚 RÉFÉRENCES

- Backend: `kids-tasks-ha` (https://github.com/astrayel/kids-tasks-ha)
- Services: Voir MIGRATION-ANALYSIS.md section "PARTIE 4"
- Styles: Voir style-manager.js
- UX: Voir CLAUDE-UX.md pour interactions tactiles

---

**Prêt pour implémentation !** 🚀
