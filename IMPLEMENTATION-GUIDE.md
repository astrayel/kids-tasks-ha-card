# Guide d'Implémentation - Migration Frontend vers Habits

## RÉSUMÉ EXÉCUTIF

**Situation**: Le backend `kids-tasks-ha` existe et fonctionne bien. Un nouveau système "habits" est planifié (branche de migration visible) mais non encore publiquement disponible.

**Action Recommandée**: 
1. Anticiper la migration en créant une couche d'abstraction
2. Préparer le code frontend pour supporter les deux systèmes
3. Attendre la spécification publique du système "habits" pour finalement migrer

---

## SECTION 1: POINTS CLÉS D'INTÉGRATION ACTUELS

### 1.1 Pattern de Service Appel (Actuellement)

**Partout dans le code:**
```javascript
hass.callService('kids_tasks', 'complete_task', { ... })
```

**Problème**: Hardcoding du domaine et des noms de services

### 1.2 IDs d'Entités (Actuellement)

**Patterns utilisés**:
```
sensor.kidtasks_emma_points
sensor.kidtasks_emma_level
sensor.kidtasks_task_abc123
button.kidtasks_validate_abc123
```

**Problème**: Pattern `kidtasks_*` partout

### 1.3 Labels et Termes (Actuellement)

**Dans l'UI**: "Enfant", "Tâche", "Points", "Récompense"
**Problème**: Spécifique aux enfants, pas générique

---

## SECTION 2: STRATÉGIE DE MIGRATION PROGRESSIVE

### Phase 1: Créer une Couche d'Abstraction (NOW - Semaine 1-2)

```javascript
// file: src/services/backend-adapter.js

class BackendAdapter {
  constructor(hass, config = {}) {
    this.hass = hass;
    this.domain = config.domain || 'kids_tasks';
    this.useAliases = config.useAliases || false;
    
    // Mapping des services (pour support futur)
    this.serviceMap = {
      'completeTask': 'complete_task',
      'validateTask': 'validate_task',
      'addPoints': 'add_points',
      'claimReward': 'claim_reward',
    };
    
    // Mapping des entités
    this.entityPrefix = config.entityPrefix || 'kidtasks';
  }
  
  /**
   * Effectue un appel service
   * @param {string} serviceName - Nom du service (camelCase)
   * @param {object} data - Données du service
   */
  async callService(serviceName, data) {
    const snakeService = this.serviceMap[serviceName] || 
                        this._camelToSnake(serviceName);
    return this.hass.callService(this.domain, snakeService, data);
  }
  
  /**
   * Construit un ID d'entité
   */
  buildEntityId(type, identifier) {
    return `sensor.${this.entityPrefix}_${identifier}`;
  }
  
  /**
   * Récupère l'état d'une entité
   */
  getEntityState(type, identifier) {
    const entityId = this.buildEntityId(type, identifier);
    return this.hass.states[entityId];
  }
  
  _camelToSnake(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}

export default BackendAdapter;
```

### Phase 2: Utiliser l'Adapteur dans les Cartes (Semaine 2-3)

```javascript
// file: src/child-card.js (exemple d'utilisation)

class ChildCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
    // Créer l'adapteur avec support futur
    this.backend = new BackendAdapter(this.hass, {
      domain: config.backend_domain || 'kids_tasks',
      entityPrefix: config.backend_prefix || 'kidtasks',
    });
  }
  
  async completeTask(taskId, childId) {
    return this.backend.callService('completeTask', {
      task_id: taskId,
      child_id: childId,
    });
  }
  
  getChildPoints(childName) {
    const state = this.backend.getEntityState('points', `${childName}_points`);
    return state?.state || '0';
  }
}
```

### Phase 3: Configuration Dynamique (Semaine 3-4)

```javascript
// file: src/config-schema.js

const CONFIG_SCHEMA = {
  // Options existantes...
  
  // Nouvelles options (future-proof)
  backend: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        default: 'kids_tasks',
        description: 'Domain de l\'intégration (kids_tasks ou habits)',
      },
      entityPrefix: {
        type: 'string',
        default: 'kidtasks',
        description: 'Préfixe des entités (kidtasks ou habits)',
      },
      servicePrefix: {
        type: 'string',
        default: 'kids_tasks',
        description: 'Préfixe des services',
      },
    },
  },
};
```

### Phase 4: Support Dual Backend (Semaine 4-5)

```javascript
// file: src/dual-backend-manager.js

class DualBackendManager {
  constructor(hass, config) {
    this.hass = hass;
    
    // Détecter quel backend est disponible
    const hasHabits = this._checkBackendAvailable('habits');
    const hasKidsTasks = this._checkBackendAvailable('kids_tasks');
    
    this.activeBackend = config.preferredBackend || 
                        (hasHabits ? 'habits' : 'kids_tasks');
    
    // Créer adapteurs pour les deux
    this.habitsAdapter = new BackendAdapter(hass, {
      domain: 'habits',
      entityPrefix: 'habits',
    });
    
    this.kidsTasksAdapter = new BackendAdapter(hass, {
      domain: 'kids_tasks',
      entityPrefix: 'kidtasks',
    });
    
    this.currentAdapter = this.activeBackend === 'habits' ?
                         this.habitsAdapter : this.kidsTasksAdapter;
  }
  
  async callService(serviceName, data) {
    return this.currentAdapter.callService(serviceName, data);
  }
  
  _checkBackendAvailable(domain) {
    // Vérifier si un service du domaine est disponible
    const services = this.hass.services[domain];
    return !!services && Object.keys(services).length > 0;
  }
}
```

---

## SECTION 3: FICHIERS À MODIFIER (ESTIMATION)

### Fichiers Critiques (Haute Priorité)

| Fichier | Modifications | Effort |
|---------|---------------|--------|
| `src/main.js` | Initialiser BackendAdapter | 30 min |
| `src/base-card.js` | Utiliser adapter pour tous les callService | 2h |
| `src/card.js` | Adapter les queries d'entités | 1.5h |
| `src/child-card.js` | Adapter le rendu enfant | 2h |
| `src/manager-card.js` | Adapter l'interface admin | 1.5h |
| `src/editors.js` | Ajouter options backend | 1h |

**Total estimé**: 8-9 heures

### Fichiers Secondaires (Moyenne Priorité)

| Fichier | Modifications | Effort |
|---------|---------------|--------|
| `src/style-manager.js` | Aucune (CSS indépendant) | 0 |
| `src/accessibility.js` | Aucune (a11y indépendant) | 0 |

---

## SECTION 4: EXEMPLES DE REFACTORISATION

### Avant (Tightly Coupled)

```javascript
// src/card.js (AVANT - mauvais)
class KidsTasksCard extends HTMLElement {
  async setupSensors() {
    const pointsSensor = this.hass.states['sensor.kidtasks_emma_points'];
    const levelSensor = this.hass.states['sensor.kidtasks_emma_level'];
    const tasksSensor = this.hass.states['sensor.kidtasks_task_abc123'];
  }
  
  async completeTask(taskId, childId) {
    return this.hass.callService('kids_tasks', 'complete_task', {
      task_id: taskId,
      child_id: childId,
    });
  }
  
  async validateTask(taskId) {
    return this.hass.callService('kids_tasks', 'validate_task', {
      task_id: taskId,
    });
  }
}
```

### Après (Loosely Coupled)

```javascript
// src/card.js (APRÈS - bon)
class KidsTasksCard extends HTMLElement {
  constructor() {
    super();
    this.backend = null; // Sera initialisé dans setHass()
  }
  
  setHass(hass) {
    this.hass = hass;
    if (!this.backend) {
      this.backend = new BackendAdapter(hass, this.getBackendConfig());
    }
  }
  
  getBackendConfig() {
    return {
      domain: this.config.backend?.domain || 'kids_tasks',
      entityPrefix: this.config.backend?.entityPrefix || 'kidtasks',
    };
  }
  
  async setupSensors() {
    const pointsSensor = this.backend.getEntityState('points', 'emma_points');
    const levelSensor = this.backend.getEntityState('level', 'emma_level');
    const tasksSensor = this.backend.getEntityState('task', 'abc123');
  }
  
  async completeTask(taskId, childId) {
    return this.backend.callService('completeTask', {
      task_id: taskId,
      child_id: childId,
    });
  }
  
  async validateTask(taskId) {
    return this.backend.callService('validateTask', {
      task_id: taskId,
    });
  }
}
```

---

## SECTION 5: SYSTÈME DE LABELS DYNAMIQUES

### Configuration des Labels

```javascript
// src/labels.js

const LABELS = {
  kids_tasks: {
    entity: 'Enfant',
    entityPlural: 'Enfants',
    activity: 'Tâche',
    activityPlural: 'Tâches',
    currency: 'Points',
    bonusCurrency: 'Coins',
    reward: 'Récompense',
    rewardPlural: 'Récompenses',
  },
  habits: {
    entity: 'Utilisateur',
    entityPlural: 'Utilisateurs',
    activity: 'Habitude',
    activityPlural: 'Habitudes',
    currency: 'Points',
    bonusCurrency: 'Coins',
    reward: 'Récompense',
    rewardPlural: 'Récompenses',
  },
};

class LabelManager {
  constructor(backendDomain = 'kids_tasks') {
    this.backend = backendDomain;
    this.labels = LABELS[backendDomain] || LABELS['kids_tasks'];
  }
  
  getLabel(key) {
    return this.labels[key] || key;
  }
  
  format(template, data = {}) {
    let result = template;
    Object.entries(data).forEach(([key, value]) => {
      result = result.replace(`{{${key}}}`, this.getLabel(value));
    });
    return result;
  }
}

export default LabelManager;
```

### Utilisation

```javascript
const labelMgr = new LabelManager(this.backend.domain);

// Afficher: "Ranger la Tâche" ou "Faire l'Habitude"
const text = labelMgr.format(
  'Valider la {{activity}}',
  { activity: 'activity' }
);
```

---

## SECTION 6: DÉTECTION AUTOMATIQUE DU BACKEND

```javascript
// src/utils/backend-detector.js

async function detectAvailableBackends(hass) {
  const services = hass.services || {};
  
  return {
    habits: !!services.habits && 
            Object.keys(services.habits).length > 0,
    kids_tasks: !!services.kids_tasks && 
               Object.keys(services.kids_tasks).length > 0,
  };
}

async function getPreferredBackend(hass, userPreference = null) {
  const available = await detectAvailableBackends(hass);
  
  // 1. Préférence utilisateur
  if (userPreference && available[userPreference]) {
    return userPreference;
  }
  
  // 2. Habits (nouveau système)
  if (available.habits) {
    return 'habits';
  }
  
  // 3. Kids Tasks (système legacy)
  if (available.kids_tasks) {
    return 'kids_tasks';
  }
  
  // 4. Aucun système disponible
  throw new Error('Aucun backend de tâches détecté');
}
```

---

## SECTION 7: TESTS DE COMPATIBILITÉ

```javascript
// src/tests/backend-compatibility.test.js

describe('Backend Compatibility', () => {
  it('should work with kids_tasks domain', async () => {
    const adapter = new BackendAdapter(mockHass, {
      domain: 'kids_tasks',
    });
    
    const result = await adapter.callService('completeTask', {
      task_id: 'test-task',
      child_id: 'test-child',
    });
    
    expect(result).toBeDefined();
  });
  
  it('should detect and switch backends', async () => {
    const manager = new DualBackendManager(mockHass, {
      preferredBackend: 'kids_tasks',
    });
    
    expect(manager.currentAdapter.domain).toBe('kids_tasks');
  });
  
  it('should handle missing services gracefully', async () => {
    const detector = new BackendDetector(mockHasNeitherBackend);
    
    expect(() => detector.getPreferredBackend())
      .toThrow('Aucun backend');
  });
});
```

---

## SECTION 8: TABLEAU DE COMPATIBILITÉ

### Mapping des Services (Kids Tasks → Habits)

| Kids Tasks | Habits (Probable) | Paramètres |
|-----------|-------------------|-----------|
| add_child | add_user | name, avatar, initial_points |
| add_task | add_habit | name, description, frequency |
| complete_task | complete_habit / mark_habit_done | habit_id, user_id |
| validate_task | validate_habit / approve_habit | habit_id |
| claim_reward | claim_reward | reward_id, user_id |
| add_points | add_points / add_score | user_id, points, reason |

### Mapping des Entités

| Kids Tasks | Habits (Probable) |
|-----------|-------------------|
| sensor.kidtasks_* | sensor.habits_* |
| button.kidtasks_* | button.habits_* |
| select.kidtasks_* | select.habits_* |

---

## SECTION 9: CHECKLIST DE MIGRATION

### Avant de Commencer
- [ ] Revue du CLAUDE.md et architecture existante
- [ ] Compréhension des 40+ services kids_tasks
- [ ] Identification de tous les appels service dans le code
- [ ] Documentation des patterns d'entités utilisés

### Phase 1: Abstraction (1-2 semaines)
- [ ] Créer `src/services/backend-adapter.js`
- [ ] Implémenter BackendAdapter class
- [ ] Créer tests unitaires pour adapter
- [ ] Documenter la nouvelle architecture
- [ ] Code review des changements

### Phase 2: Refactorisation (2-3 semaines)
- [ ] Mettre à jour `src/main.js`
- [ ] Refactoriser `src/base-card.js`
- [ ] Refactoriser `src/card.js`
- [ ] Refactoriser `src/child-card.js`
- [ ] Refactoriser `src/manager-card.js`
- [ ] Tests d'intégration

### Phase 3: Support Dual (1 semaine)
- [ ] Implémenter DualBackendManager
- [ ] Auto-détection du backend
- [ ] Configuration utilisateur
- [ ] Tests de basculement

### Phase 4: Labels Dynamiques (1 semaine)
- [ ] Implémenter LabelManager
- [ ] Remplacer hardcoded labels
- [ ] Tests de traductions
- [ ] Documentation utilisateur

### Phase 5: Préparation Migration Finale
- [ ] Surveiller release de "habits"
- [ ] Analyser spécifications finales
- [ ] Adapter mapping des services
- [ ] Tests complets cross-backend
- [ ] Release notes

---

## SECTION 10: RESSOURCES ET RÉFÉRENCES

### Fichiers Clés du Projet
- `/home/user/kids-tasks-ha-card/CLAUDE.md` - Instructions complètes
- `/home/user/kids-tasks-ha-card/src/` - Code source
- `/home/user/kids-tasks-ha-card/temp_working_version.js` - Version de référence

### Documentation Backend
- `https://github.com/astrayel/kids-tasks-ha` - Backend source
- `https://github.com/astrayel/kids-tasks-ha/custom_components/kids_tasks/` - Composant HA
- Services YAML disponible dans le repo

### Status Actuel
- Backend `kids-tasks-ha`: Version 1.0.4 (stable)
- Frontend `kids-tasks-ha-card`: Dernière version (voir git)
- Backend "habits": Non disponible publiquement (futur)

---

## CONCLUSION

Cette stratégie permet:
1. **Compatibilité**: Continuer avec kids_tasks en production
2. **Flexibilité**: Adopter habits une fois disponible
3. **Zéro Impact**: Utilisateurs ne voient aucun changement
4. **Maintenance**: Code plus propre et moins hardcodé
5. **Testabilité**: Plus facile à tester chaque backend

**Temps Total Estimé**: 3-4 semaines pour l'implémentation complète

