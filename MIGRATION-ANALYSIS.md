# Rapport d'Analyse Complète - Architecture Backend Kids Tasks HA

## DÉCOUVERTE CRITIQUE

**Le repository "habits" n'existe pas publiquement.** Il n'existe que 7 repositories dans le compte astrayel, et "habits" n'en fait pas partie. La branche `claude/migrate-kids-tasks-habits-*` est actuellement une branche de travail sans spécification publique du système "habits".

---

# PARTIE 1: ARCHITECTURE ACTUELLE - KIDS TASKS HA

## 1.1 Informations de Base

- **Domaine Home Assistant**: `kids_tasks`
- **Version**: 1.0.4
- **Minimum HA**: 2024.1.0
- **Type d'intégration**: Service-based (local_push)
- **Configuration**: Flow-based (UI configuration)
- **Repository**: https://github.com/astrayel/kids-tasks-ha

## 1.2 Structure du Projet Backend

```
custom_components/kids_tasks/
├── __init__.py              (3.3 KB)  - Initialisation et enregistrement services
├── manifest.json            (471 B)   - Configuration du domaine
├── const.py                 (2.4 KB)  - Constantes (statuts, catégories, événements)
├── models.py                (28.1 KB) - Classes de données (Child, Task, Reward, etc.)
├── coordinator.py           (70.3 KB) - Gestionnaire de données persistentes
├── services.py              (36.6 KB) - Implémentation des 40+ services
├── services.yaml            (20.8 KB) - Schéma YAML des services
├── sensor.py                (28.2 KB) - Entités sensor
├── button.py                (3.6 KB)  - Entités button
├── select.py                (3.1 KB)  - Entités select
├── number.py                (2.4 KB)  - Entités number
├── config_flow.py           (12.2 KB) - Configuration UI
├── translations/            - Multilingue (FR/EN)
├── cosmetics/               - Système de cosmétiques
└── __pycache__/
```

---

# PARTIE 2: MODÈLES DE DONNÉES

## 2.1 Child (Enfant)

```python
class Child:
    # Identification
    id: str                              # UUID unique
    name: str                            # Nom complet
    
    # Système de points et progression
    points: int                          # Points courants
    coins: int                           # Monnaie bonus
    level: int                           # Niveau de progression
    
    # Avatar et personnalisation
    avatar: str                          # Emoji ou URL
    avatar_type: str                     # "emoji", "person_entity", "custom"
    person_entity_id: str | None         # Lien vers entité person Home Assistant
    
    # Cosmétiques
    cosmetic_items: dict                 # Inventaire de cosmétiques
    cosmetic_collection: list            # Collections déblocées
    active_cosmetics: dict               # Cosmétiques équipés actuellement
    
    # Personnalisation de la carte enfant
    card_gradient_start: str             # Couleur gradient
    card_gradient_end: str               # Couleur gradient
    card_customizations: dict            # Autres personnalisations
    
    # Historique et métadonnées
    points_history: list[PointsHistoryEntry]  # 20 dernières transactions
    created_at: datetime                 # Date de création
    
    # Méthodes principales
    add_points(points, reason)           # Ajouter des points
    set_points(points, description)      # Définir les points
    add_coins(coins, reason)             # Ajouter des coins
    remove_coins(coins, reason)          # Retirer des coins
    add_level(description)               # Monter de niveau
    set_level(level, description)        # Définir le niveau
    add_cosmetic_item(item_id)           # Ajouter un cosmétique
    activate_cosmetic(cosmetic_id)       # Équiper un cosmétique
    get_active_cosmetics()               # Récupérer les cosmétiques équipés
    get_effective_avatar()               # Avatar final (cosmétique ou défaut)
```

## 2.2 Task (Tâche)

```python
class Task:
    # Identification
    id: str                              # UUID unique
    name: str                            # Nom de la tâche
    description: str                     # Description détaillée
    
    # Catégorisation et récompense
    category: str                        # bedroom, bathroom, kitchen, homework, outdoor, pets, other
    icon: str                            # Emoji ou icône Material Design
    points: int                          # Points attribués
    coins: int                           # Coins bonus attribués
    
    # Assignation multi-enfant
    assigned_child_ids: list[str]        # IDs des enfants assignés
    child_statuses: dict[str, TaskChildStatus]  # Statut par enfant
    
    # Paramètres de récurrence
    frequency: str                       # daily, weekly, monthly, once, none
    weekly_days: list[int]               # Pour weekly: [0-6]
    deadline_time: str | None            # Heure limite (HH:MM)
    
    # Validation
    validation_required: bool             # Validation parentale requise?
    
    # Statut et contrôle
    active: bool                         # Tâche active?
    suspended: bool                      # Tâche suspendue?
    
    # Temporal
    due_date: date | None                # Date limite
    last_completed_at: datetime | None   # Dernière complètion
    deadline_passed: bool                # Deadline dépassée?
    
    # Pénalités
    penalty_points: int                  # Points à déduire si non complétée
    
    # Méthodes principales
    complete_for_child(child_id)         # Marquer complétée pour un enfant
    validate_for_child(child_id)         # Valider pour un enfant
    get_status_for_child(child_id)       # Récupérer le statut pour un enfant
    reset()                              # Réinitialiser tous les enfants
    check_deadline()                     # Vérifier les dates limites
    suspend(until_date)                  # Suspendre la tâche
    resume()                             # Reprendre
    is_available()                       # Est disponible maintenant?
```

## 2.3 TaskChildStatus (Statut par Enfant)

```python
class TaskChildStatus:
    # État de complètion
    child_id: str                        # Enfant concerné
    status: str                          # todo, in_progress, completed, 
                                        # pending_validation, validated, failed
    
    # Timestamps
    completed_at: datetime | None        # Quand complétée
    validated_at: datetime | None        # Quand validée
    penalty_applied_at: datetime | None  # Quand la pénalité appliquée
    
    # Pénalités
    penalty_applied: bool                # Pénalité appliquée?
    
    # Historique de validation
    validation_history: list[dict]       # Historique des validations
```

## 2.4 Reward (Récompense)

```python
class Reward:
    # Identification
    id: str                              # UUID unique
    name: str                            # Nom de la récompense
    description: str                     # Description
    category: str                        # fun, screen_time, outing, treat, privilege, toy, other
    icon: str                            # Emoji ou icône
    
    # Système de coût
    cost: int                            # Coût en points
    coin_cost: int                       # Coût en coins (bonus)
    
    # Disponibilité
    active: bool                         # Récompense disponible?
    limited_quantity: bool               # Quantité limitée?
    remaining_quantity: int | None       # Quantité restante
    
    # Type
    reward_type: str                     # "real" ou "cosmetic"
    cosmetic_data: dict | None           # Données si cosmétique
    
    # Méthodes
    can_claim(child_points, child_coins) # Peut être réclamée?
    claim()                              # Décrémenter la quantité
```

## 2.5 PointsHistoryEntry (Historique)

```python
class PointsHistoryEntry:
    timestamp: datetime                  # Moment de la transaction
    action_type: str                     # Type d'action
    points_delta: int                    # Changement (+/-)
    description: str                     # Description
    related_entity_id: str | None        # ID task/reward concernée
    related_entity_name: str | None      # Nom lisible
    child_id: str                        # Enfant concerné
```

---

# PARTIE 3: CONSTANTES ET ÉNUMÉRATIONS

## 3.1 Statuts de Tâches
- `todo` - À faire
- `in_progress` - En cours
- `completed` - Complétée
- `pending_validation` - En attente de validation
- `validated` - Validée et complète
- `failed` - Échouée

## 3.2 Fréquences
- `daily` - Quotidienne
- `weekly` - Hebdomadaire
- `monthly` - Mensuelle
- `once` - Une seule fois
- `none` - Pas de récurrence (bonus)

## 3.3 Catégories de Tâches
- `bedroom` (🛏️)
- `bathroom` (🛁)
- `kitchen` (🍽️)
- `homework` (📚)
- `outdoor` (🌳)
- `pets` (🐾)
- `other` (📋)

## 3.4 Catégories de Récompenses
- `fun` (🎉)
- `screen_time` (📱)
- `outing` (🚗)
- `treat` (🍭)
- `privilege` (👑)
- `toy` (🧸)
- `other` (📋)

## 3.5 Événements Émis
- `kids_tasks_task_completed` - Tâche complétée
- `kids_tasks_task_validated` - Tâche validée
- `kids_tasks_level_up` - Passage de niveau
- `kids_tasks_reward_claimed` - Récompense réclamée

---

# PARTIE 4: SERVICES HOME ASSISTANT (40+)

## 4.1 Gestion des Enfants

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `add_child` | name, avatar, initial_points | Créer un enfant |
| `update_child` | child_id, name, avatar | Mettre à jour enfant |
| `remove_child` | child_id, force_remove_entities | Supprimer enfant |
| `list_children` | - | Lister tous les enfants |

## 4.2 Gestion des Tâches

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `add_task` | name, description, category, points, coins, frequency, assigned_child_ids, validation_required | Créer tâche |
| `update_task` | task_id, name, description, points, coins, category, frequency, assigned_child_ids, validation_required, active | Modifier tâche |
| `remove_task` | task_id | Supprimer tâche |
| `complete_task` | task_id, child_id, validation_required (override) | Marquer complétée |
| `validate_task` | task_id | Valider tâche |
| `reject_task` | task_id, reason | Rejeter tâche |
| `reset_task` | task_id | Réinitialiser tâche |
| `suspend_task` | task_id, until_date | Suspendre tâche |
| `resume_task` | task_id | Reprendre tâche |
| `list_tasks` | - | Lister toutes les tâches |
| `reset_all_daily_tasks` | - | Reset quotidiennes |
| `reset_all_weekly_tasks` | - | Reset hebdos |
| `reset_all_monthly_tasks` | - | Reset mensuelles |

## 4.3 Gestion des Points et Monnaie

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `add_points` | child_id, points, reason | Ajouter points |
| `remove_points` | child_id, points, reason | Retirer points |
| `set_points` | child_id, points, description | Définir points |
| `add_coins` | child_id, coins, reason | Ajouter coins |
| `remove_coins` | child_id, coins, reason | Retirer coins |
| `set_coins` | child_id, coins, description | Définir coins |
| `add_currency` | child_id, points, coins, reason | Ajouter points + coins |
| `set_level` | child_id, level, description | Définir niveau |

## 4.4 Gestion des Récompenses

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `add_reward` | name, description, cost, coin_cost, reward_type, icon, category, limited_quantity, cosmetic_data | Créer récompense |
| `update_reward` | reward_id, name, description, cost, coin_cost, category, icon, limited_quantity, remaining_quantity, active | Modifier récompense |
| `remove_reward` | reward_id | Supprimer récompense |
| `claim_reward` | reward_id, child_id | Réclamer récompense |

## 4.5 Cosmétiques

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `activate_cosmetic` | child_id, cosmetic_type, cosmetic_id | Équiper cosmétique |
| `load_cosmetics_catalog` | - | Charger catalogue cosmétiques |
| `create_cosmetic_rewards` | - | Créer récompenses cosmétiques |

## 4.6 Données et Sauvegarde

| Service | Paramètres | Description |
|---------|-----------|-------------|
| `backup_data` | include_history | Sauvegarder données |
| `restore_data` | backup_data | Restaurer données |
| `clear_all_data` | - | Effacer tout |
| `reset_penalties` | - | Réinitialiser pénalités |

---

# PARTIE 5: ENTITÉS HOME ASSISTANT CRÉÉES

## 5.1 Sensors (Capteurs)

### Par Enfant (création automatique)
- `sensor.kidtasks_{child_name}_points` - Points actuels
- `sensor.kidtasks_{child_name}_level` - Niveau
- `sensor.kidtasks_{child_name}_tasks_today` - Tâches complétées aujourd'hui
- `sensor.kidtasks_{child_name}_points_history` - Historique des points

### Globaux
- `sensor.kidtasks_pending_validations` - Tâches en attente validation
- `sensor.kidtasks_total_tasks_today` - Total tâches complétées
- `sensor.kidtasks_active_tasks` - Nombre tâches actives
- `sensor.kidtasks_task_{task_id}` - État d'une tâche
- `sensor.kidtasks_reward_{reward_id}` - Coût récompense
- `sensor.kidtasks_all_tasks_list` - Liste complète tâches
- `sensor.kidtasks_all_rewards_list` - Liste complète récompenses

## 5.2 Buttons (Boutons)

- `button.kidtasks_complete_{task_id}` - Compléter tâche (OBSOLÈTE)
- `button.kidtasks_validate_{task_id}` - Valider tâche

## 5.3 Selects (Sélecteurs)

- `select.kidtasks_status_{task_id}` - Sélectionner statut (todo, in_progress, completed, pending_validation, validated, failed)

## 5.4 Attributs des Sensors

### Sensor Points Enfant
- `level` - Niveau actuel
- `points_to_next_level` - Points pour prochain niveau
- `child_id` - ID enfant
- `name` - Nom enfant
- `coins` - Coins actuels
- `avatar` - Avatar enfant
- `person_entity_id` - Lien person entity
- `avatar_type` - Type avatar
- `card_gradient_start` - Couleur gradient
- `card_gradient_end` - Couleur gradient

### Sensor Tâche
- `task_details` - Détails complets
- `assigned_children` - Liste enfants assignés
- `child_statuses` - Statut par enfant
- `frequency` - Fréquence
- `deadline_info` - Infos deadline

---

# PARTIE 6: ARCHITECTURE DE STOCKAGE

## 6.1 Coordinateur (Data Manager)

```python
class KidsTasksDataUpdateCoordinator:
    store: Store                         # Stockage persistant HA
    children: dict[str, Child]
    tasks: dict[str, Task]
    rewards: dict[str, Reward]
    
    # Suivi des resets automatiques
    last_daily_reset: datetime | None
    last_weekly_reset: datetime | None
    last_monthly_reset: datetime | None
    
    # Verrous pour opérations concurrentes
    _reset_in_progress: bool
```

## 6.2 Stockage Home Assistant

- **Clé de stockage**: `kids_tasks.storage`
- **Version**: 1
- **Format**: JSON persistant dans `/config/.storage/`
- **Mise à jour**: Via `async_handle_coordinator_update()`

---

# PARTIE 7: ENTITÉS FRONTEND (kids-tasks-ha-card)

## 7.1 Types de Cartes Disponibles

```yaml
custom:kids-tasks-card           # Dashboard principal
custom:kids-tasks-manager        # Interface parentale
custom:kids-tasks-forms          # Formulaires création
custom:kids-tasks-complete       # Interface complètion
custom:kids-tasks-data           # Visualisation données
```

## 7.2 Configuration Actuelles

```yaml
# Configuration simple
type: custom:kids-tasks-card
title: "Kids Tasks Dashboard"

# Configuration avancée
type: custom:kids-tasks-card
title: "Kids Tasks Dashboard"
show_completed: true
show_rewards: true
child_filter: ["child_id_1", "child_id_2"]

# Mode spécifique enfant
type: custom:kids-tasks-child-card
child_id: "emma-001"
show_avatar: true
show_progress: true
show_rewards: true
show_completed: true
```

---

# PARTIE 8: INTÉGRATION FRONTEND-BACKEND

## 8.1 Appel de Services depuis Frontend

```javascript
// Exemple: Compléter une tâche
await hass.callService('kids_tasks', 'complete_task', {
  task_id: 'task-uuid',
  child_id: 'child-uuid',
  validation_required: false
});

// Ajouter des points
await hass.callService('kids_tasks', 'add_points', {
  child_id: 'child-uuid',
  points: 50,
  reason: 'Bonus pour bonne comportement'
});

// Réclamer récompense
await hass.callService('kids_tasks', 'claim_reward', {
  reward_id: 'reward-uuid',
  child_id: 'child-uuid'
});
```

## 8.2 Accès aux Données

```javascript
// Via state entities
const childPoints = hass.states['sensor.kidtasks_emma_points'].state;
const childAttribs = hass.states['sensor.kidtasks_emma_points'].attributes;

// Via événements
hass.connection.addEventListener('kids_tasks_task_completed', (event) => {
  console.log(event.data.child_name, 'a complété', event.data.task_name);
});
```

---

# PARTIE 9: SYSTÈME DE COSMÉTIQUES

## 9.1 Architecture Cosmétiques

- Type: `avatar`, `outfit`, `accessory`, `background`, `theme`
- Format: Données JSON stockées dans `cosmetic_data`
- Déblocage: Via récompenses ou achievements
- Équipement: Via service `activate_cosmetic`

## 9.2 Récompenses Cosmétiques

```python
reward = {
  "id": "cosmetic-pirate-hat",
  "name": "Chapeau de Pirate",
  "reward_type": "cosmetic",
  "cost": 200,
  "cosmetic_data": {
    "type": "accessory",
    "emoji": "🏴‍☠️"
  }
}
```

---

# PARTIE 10: ÉVÉNEMENTS ET AUTOMATIONS

## 10.1 Événements Disponibles

```yaml
# Tâche complétée
event: kids_tasks_task_completed
data:
  child_id: "uuid"
  child_name: "Emma"
  task_id: "uuid"
  task_name: "Ranger chambre"
  points: 15
  coins: 0

# Tâche validée
event: kids_tasks_task_validated
data:
  child_id: "uuid"
  child_name: "Emma"
  task_id: "uuid"
  task_name: "Ranger chambre"

# Passage de niveau
event: kids_tasks_level_up
data:
  child_id: "uuid"
  child_name: "Emma"
  new_level: 5

# Récompense réclamée
event: kids_tasks_reward_claimed
data:
  child_id: "uuid"
  reward_id: "uuid"
  reward_name: "30 min d'écran"
  points_spent: 100
```

---

# PARTIE 11: SPÉCIFICATION DU SYSTÈME "HABITS"

## SITUATION ACTUELLE
Le repository "habits" n'existe pas publiquement. Basé sur le nom de branche et l'architecture existante, voici la migration probable:

## 11.1 Migration Conceptuelle Probable

### Changement de Terminologie
- **"Kids Tasks" → "Habits"** (généralisation au-delà des enfants)
- **"Task" → "Habit"** (habitudes plutôt que tâches)
- **Domain**: `kids_tasks` → `habits` (probable)

### Généralisations Anticipées

**De**: Système enfant-centrique
**Vers**: Système utilisateur générique (enfants, adolescents, parents)

### Évolutions Probables

1. **Multi-utilisateurs avancés**
   - Pas limité aux enfants
   - Support parents comme utilisateurs autonomes
   - Rôles (enfant, ado, parent)

2. **Habitudes vs Tâches**
   - Concept étendu au-delà des "tâches" (faire son lit)
   - Inclut les habitudes (exercice quotidien, lecture)
   - Suivi de progression différencié

3. **Système de Gamification Amélioré**
   - Points, coins, niveaux (existant)
   - Achievements (nouveau)
   - Streaks/Combos (nouveau)
   - Leaderboards (nouveau)

4. **Récompenses Avancées**
   - Cosmétiques améliorés (SVG/animations)
   - Récompenses immatérielles (badges)
   - Déblocages basés sur achievements

5. **Analytics et Statistiques**
   - Graphiques de progression
   - Tendances d'habitudes
   - Comparaisons temporelles

---

# PARTIE 12: MATRICE DE MIGRATION FRONTEND

## 12.1 Points de Changement Anticipated

| Aspect | Enfant (kids-tasks) | Habitant (habits) | Impact Frontend |
|--------|-----------------|--------------|-----------------|
| **Domaine Service** | `kids_tasks` | `habits` (probable) | Mettre à jour tous `callService()` |
| **Entité ID** | `kidtasks_*` | `habits_*` (probable) | Mettre à jour tous les IDs |
| **Entités Principale** | child-centric | user-centric | Restructurer queries |
| **Concept** | "Task" | "Habit" | Renommer UI/labels |
| **Types Utilisateurs** | Enfants uniquement | Multi-rôles | Ajouter contrôles rôles |
| **Services Noms** | `add_task` | `add_habit` (probable) | Refactoriser appels |
| **Cosmétiques** | JSON simple | SVG/Animations | Mettre à jour rendu |
| **Points/Coins** | 2 devises | Possiblement > 2 | Adapter UI |
| **Validation** | Parentale seulement | Possiblement peer/auto | Adapter logique |

---

# PARTIE 13: RECOMMANDATIONS POUR LA MIGRATION FRONTEND

## 13.1 Stratégie de Migration Recommandée

### Phase 1: Abstraction des Services
```javascript
// Créer une couche d'abstraction
class HabitService {
  async completeHabit(habitId, userId) {
    return this.hass.callService(
      this.config.domain,  // habits ou kids_tasks
      'complete_habit',    // ou complete_task
      { habit_id: habitId, user_id: userId }
    );
  }
}
```

### Phase 2: Mapping des Entités
```javascript
// Configuration du mapping
const ENTITY_MAP = {
  points: 'habit_points',      // ou kidtasks_points
  level: 'habit_level',        // ou kidtasks_level
  habits: 'all_habits_list',   // ou all_tasks_list
};
```

### Phase 3: Gestion des IDs Dynamiques
```javascript
// Utiliser patterns plutôt que valeurs hardcoded
const entityId = `sensor.${this.domain}_${userId}_points`;
```

### Phase 4: Refactorisation des Labels
```javascript
// Labels dynamiques basés sur système
const labels = {
  task: this.isHabits ? 'Habitude' : 'Tâche',
  child: this.isHabits ? 'Utilisateur' : 'Enfant',
};
```

## 13.2 Impacts sur les Fichiers Source

### Fichiers à Modifier (Estimation)
- `src/base-card.js` - Appels services
- `src/card.js` - Configuration entités
- `src/child-card.js` - Rendu enfant → utilisateur
- `src/manager-card.js` - Gestion administration
- `src/main.js` - Intégration principale
- `src/editors.js` - Editeur configuration

### Fichiers Probablement Inchangés
- `src/style-manager.js` - CSS reste compatible
- `src/accessibility.js` - Accessibilité indépendante

---

# PARTIE 14: TABLEAU COMPARATIF COMPLET

## Services Kids Tasks vs Habits (Prédiction)

```
Kids Tasks Services (40+) → Habits Services (probable)

add_child               → add_user ou add_habit_user
add_task               → add_habit
complete_task          → complete_habit ou mark_habit
validate_task          → validate_habit
claim_reward           → claim_reward (inchangé probablement)
add_points             → add_score ou add_points
```

---

# PARTIE 15: PRIORITÉS DE MIGRATION

## Critique (Must-Have)
1. [ ] Mettre à jour domaine service de `kids_tasks` → `habits`
2. [ ] Mettre à jour les IDs d'entités `kidtasks_*` → `habits_*`
3. [ ] Mettre à jour les noms de services
4. [ ] Adapter la structure enfant → utilisateur

## Important (Should-Have)
5. [ ] Mettre à jour les labels UI (tâche → habitude)
6. [ ] Adapter les rôles utilisateurs
7. [ ] Mettre à jour les catégories si différentes
8. [ ] Supporter les cosmétiques améliorés

## Nice-To-Have (Could-Have)
9. [ ] Ajouter support achievements
10. [ ] Implémenter streaks/combos UI
11. [ ] Ajouter leaderboards
12. [ ] Graphiques avancés

---

# CONCLUSION & PROCHAINES ÉTAPES

## Constatations Clés
1. Le système `kids-tasks-ha` est bien structuré et modulaire
2. Architecture entièrement basée sur services (bon pour migration)
3. Système d'entités dynamique (favorable pour refacto)
4. Frontend actuel fortement couplé au domaine `kids_tasks`

## Risques Identifiés
1. **Dépendance au domaine**: Tous les appels services hardcodent `kids_tasks`
2. **IDs d'entités**: Pattern `kidtasks_*` partout dans le code
3. **Labels**: Termes "enfant" et "tâche" dans l'UI
4. **Configuration**: Éditeur assume structure enfant-centric

## Points Forts Existants
1. Architecture modulaire (facilite refacto)
2. Design system cohérent
3. Cosmétiques système en place
4. Support multi-enfants déjà présent
5. Code relativement bien organisé

## Recommandation Finale
- **Créer une couche d'abstraction** pour le backend avant migration
- **Paramétrer tous les noms** de domaine/services
- **Maintenir compatibilité** avec `kids_tasks` pendant transition
- **Planifier communication** utilisateurs avant breaking change

