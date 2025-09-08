# CLAUDE-UX.md

Ce document contient les spécifications d'amélioration UX pour la carte Kids Tasks Card afin de moderniser l'interface avec des interactions tactiles intuitives.

## 🎯 Objectifs d'amélioration

### 1. Interface tactile moderne
- Supprimer les boutons "Modifier" et "Supprimer" visibles
- Implémenter des interactions gestuelles naturelles
- Améliorer l'expérience utilisateur sur mobile et tablette

### 2. Interactions intuitives
- **Clic simple** sur un item pour l'éditer
- **Appui long** pour supprimer (avec confirmation)
- **Gestes de glissement** pour valider/rejeter les tâches

## 📱 Spécifications techniques

### A. Modifications des listes de tâches et récompenses

#### Éléments concernés dans `kids-tasks-card.js`:
- **Tâches** (ligne ~4223-4224) : Retirer boutons "Modifier" et "Supprimer"
- **Récompenses** (ligne ~4298-4299) : Retirer boutons "Modifier" et "Supprimer"

#### Nouvelle structure HTML:
```html
<div class="task-item clickable-item long-press-item" 
     data-id="${task.id}" 
     data-action="edit-task"
     data-delete-action="remove-task">
  <!-- Contenu de la tâche -->
  <div class="task-content">
    <!-- Informations existantes -->
  </div>
  
  <!-- État de confirmation (masqué par défaut) -->
  <div class="delete-confirmation hidden">
    <button class="confirm-delete">Supprimer</button>
    <button class="cancel-delete">Annuler</button>
  </div>
</div>
```

### B. Interface de validation des tâches

#### Éléments concernés:
- **Tâches en attente** dans `renderValidationTask()` (ligne ~4333)

#### Nouvelle structure pour les validations:
```html
<div class="validation-task swipeable-item" data-task-id="${task.id}">
  <!-- Contenu existant de la tâche -->
  <div class="task-content">
    <!-- Informations de la tâche -->
  </div>
  
  <!-- Actions révélées par glissement -->
  <div class="swipe-actions-left">
    <button class="reject-action" data-action="reject-task">
      <span class="icon">✗</span>
      <span class="label">Rejeter</span>
    </button>
  </div>
  
  <div class="swipe-actions-right">
    <button class="validate-action" data-action="validate-task">
      <span class="icon">✓</span>
      <span class="label">Valider</span>
    </button>
  </div>
</div>
```

## 🎨 Styles CSS à ajouter

### Classes pour interactions tactiles

```css
/* === COMPOSANTS CLIQUABLES === */
.clickable-item {
  cursor: pointer;
  transition: all var(--kt-transition-fast);
}

.clickable-item:hover {
  background-color: var(--kt-surface-variant);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--kt-shadow-light);
}

.clickable-item:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px var(--kt-shadow-light);
}

/* === APPUI LONG === */
.long-press-item {
  position: relative;
}

.long-press-item.long-pressing {
  animation: pulse 0.6s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.delete-confirmation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(244, 67, 54, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--kt-space-md);
  border-radius: var(--kt-radius-md);
  z-index: 10;
}

.delete-confirmation.hidden {
  display: none;
}

.confirm-delete {
  background: var(--kt-error);
  color: white;
  border: none;
  padding: var(--kt-space-sm) var(--kt-space-md);
  border-radius: var(--kt-radius-sm);
  font-weight: 600;
}

.cancel-delete {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: var(--kt-space-sm) var(--kt-space-md);
  border-radius: var(--kt-radius-sm);
  font-weight: 600;
}

/* === GESTES DE GLISSEMENT === */
.swipeable-item {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
}

.swipe-actions-left,
.swipe-actions-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  transition: all var(--kt-transition-medium);
}

.swipe-actions-left {
  left: 0;
  background: var(--kt-error);
}

.swipe-actions-right {
  right: 0;
  background: var(--kt-success);
}

.swipeable-item.swiping-left .swipe-actions-left,
.swipeable-item.swiping-right .swipe-actions-right {
  opacity: 1;
}

.swipeable-item .task-content {
  position: relative;
  z-index: 2;
  background: var(--card-background-color, white);
  transition: transform var(--kt-transition-medium);
}

.swipeable-item.swiping-left .task-content {
  transform: translateX(-80px);
}

.swipeable-item.swiping-right .task-content {
  transform: translateX(80px);
}

.reject-action,
.validate-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: white;
  font-size: var(--kt-font-size-sm);
  padding: var(--kt-space-sm);
  border-radius: var(--kt-radius-sm);
  min-width: 60px;
  cursor: pointer;
  transition: all var(--kt-transition-fast);
}

.reject-action:hover,
.validate-action:hover {
  background: rgba(255, 255, 255, 0.2);
}

.reject-action .icon,
.validate-action .icon {
  font-size: 20px;
  font-weight: bold;
}

/* === FEEDBACK VISUEL === */
.task-item.editing {
  outline: 2px solid var(--kt-primary);
  outline-offset: 2px;
}

.validation-task.validated {
  animation: slideOutRight 0.3s ease-out forwards;
}

.validation-task.rejected {
  animation: slideOutLeft 0.3s ease-out forwards;
}

@keyframes slideOutRight {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideOutLeft {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}
```

## ⚙️ Logique JavaScript à implémenter

### 1. Gestionnaire d'événements tactiles

```javascript
// === INTERACTIONS TACTILES ===
initTouchInteractions() {
  // Gestion du clic simple pour édition
  this.addClickListeners();
  
  // Gestion de l'appui long pour suppression
  this.addLongPressListeners();
  
  // Gestion des gestes de glissement pour validation
  this.addSwipeListeners();
}

addClickListeners() {
  this.addEventListener('click', (e) => {
    const clickableItem = e.target.closest('.clickable-item');
    if (clickableItem && !clickableItem.classList.contains('long-pressing')) {
      const action = clickableItem.dataset.action;
      const id = clickableItem.dataset.id;
      
      if (action && id) {
        this.handleAction(action, { id: id });
      }
    }
  });
}

addLongPressListeners() {
  let longPressTimer = null;
  let isLongPressing = false;
  
  this.addEventListener('pointerdown', (e) => {
    const longPressItem = e.target.closest('.long-press-item');
    if (longPressItem) {
      isLongPressing = false;
      longPressTimer = setTimeout(() => {
        isLongPressing = true;
        longPressItem.classList.add('long-pressing');
        this.showDeleteConfirmation(longPressItem);
        navigator.vibrate && navigator.vibrate(50); // Retour haptique
      }, 500); // 500ms pour l'appui long
    }
  });
  
  this.addEventListener('pointerup', (e) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    
    // Nettoyer l'état d'appui long après un délai
    setTimeout(() => {
      const longPressingItems = this.querySelectorAll('.long-pressing');
      longPressingItems.forEach(item => {
        item.classList.remove('long-pressing');
      });
    }, 100);
  });
  
  this.addEventListener('pointermove', (e) => {
    // Annuler l'appui long si l'utilisateur bouge trop
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });
}

showDeleteConfirmation(item) {
  const confirmation = item.querySelector('.delete-confirmation');
  if (confirmation) {
    confirmation.classList.remove('hidden');
    
    // Gérer les boutons de confirmation
    const confirmBtn = confirmation.querySelector('.confirm-delete');
    const cancelBtn = confirmation.querySelector('.cancel-delete');
    
    confirmBtn.onclick = () => {
      const deleteAction = item.dataset.deleteAction;
      const id = item.dataset.id;
      if (deleteAction && id) {
        this.handleAction(deleteAction, { id: id });
      }
      this.hideDeleteConfirmation(item);
    };
    
    cancelBtn.onclick = () => {
      this.hideDeleteConfirmation(item);
    };
    
    // Auto-masquer après 3 secondes
    setTimeout(() => {
      this.hideDeleteConfirmation(item);
    }, 3000);
  }
}

hideDeleteConfirmation(item) {
  const confirmation = item.querySelector('.delete-confirmation');
  if (confirmation) {
    confirmation.classList.add('hidden');
  }
  item.classList.remove('long-pressing');
}

addSwipeListeners() {
  let startX = 0;
  let currentX = 0;
  let isTracking = false;
  let currentItem = null;
  
  this.addEventListener('pointerdown', (e) => {
    const swipeableItem = e.target.closest('.swipeable-item');
    if (swipeableItem) {
      startX = e.clientX;
      currentX = startX;
      isTracking = true;
      currentItem = swipeableItem;
      swipeableItem.style.transition = 'none';
    }
  });
  
  this.addEventListener('pointermove', (e) => {
    if (!isTracking || !currentItem) return;
    
    e.preventDefault();
    currentX = e.clientX;
    const deltaX = currentX - startX;
    const taskContent = currentItem.querySelector('.task-content');
    
    // Limiter le mouvement
    const maxSwipe = 80;
    const clampedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX));
    
    taskContent.style.transform = `translateX(${clampedDelta}px)`;
    
    // Afficher/masquer les actions selon la direction
    if (clampedDelta < -20) {
      currentItem.classList.add('swiping-left');
      currentItem.classList.remove('swiping-right');
    } else if (clampedDelta > 20) {
      currentItem.classList.add('swiping-right');
      currentItem.classList.remove('swiping-left');
    } else {
      currentItem.classList.remove('swiping-left', 'swiping-right');
    }
  });
  
  this.addEventListener('pointerup', (e) => {
    if (!isTracking || !currentItem) return;
    
    const deltaX = currentX - startX;
    const threshold = 40;
    
    // Restaurer les transitions
    currentItem.style.transition = '';
    const taskContent = currentItem.querySelector('.task-content');
    taskContent.style.transition = '';
    
    if (Math.abs(deltaX) < threshold) {
      // Revenir à la position originale
      this.resetSwipePosition(currentItem);
    } else if (deltaX > threshold) {
      // Glissement vers la droite - montrer l'action de validation
      this.showSwipeAction(currentItem, 'right');
    } else if (deltaX < -threshold) {
      // Glissement vers la gauche - montrer l'action de rejet
      this.showSwipeAction(currentItem, 'left');
    }
    
    isTracking = false;
    currentItem = null;
  });
}

resetSwipePosition(item) {
  const taskContent = item.querySelector('.task-content');
  taskContent.style.transform = '';
  item.classList.remove('swiping-left', 'swiping-right');
}

showSwipeAction(item, direction) {
  item.classList.add(`swiping-${direction}`);
  
  // Auto-reset après 3 secondes si pas d'action
  setTimeout(() => {
    if (item.classList.contains(`swiping-${direction}`)) {
      this.resetSwipePosition(item);
    }
  }, 3000);
  
  // Gérer les clics sur les boutons d'action
  const actionButton = item.querySelector(direction === 'left' ? '.reject-action' : '.validate-action');
  if (actionButton) {
    actionButton.onclick = () => {
      const taskId = item.dataset.taskId;
      const action = actionButton.dataset.action;
      
      if (taskId && action) {
        this.handleValidationAction(action, taskId);
        this.animateTaskAction(item, direction);
      }
    };
  }
}

handleValidationAction(action, taskId) {
  if (action === 'validate-task') {
    this._hass.callService('kids_tasks', 'validate_task', {
      task_id: taskId
    });
  } else if (action === 'reject-task') {
    this._hass.callService('kids_tasks', 'reject_task', {
      task_id: taskId
    });
  }
}

animateTaskAction(item, direction) {
  item.classList.add(direction === 'left' ? 'rejected' : 'validated');
  
  // Retirer l'élément après l'animation
  setTimeout(() => {
    item.remove();
  }, 300);
}
```

### 2. Intégration dans le cycle de vie du composant

```javascript
connectedCallback() {
  super.connectedCallback();
  this.initTouchInteractions();
}

updated(changedProps) {
  super.updated(changedProps);
  
  // Réinitialiser les interactions après mise à jour
  if (changedProps.has('_hass') || changedProps.has('config')) {
    this.initTouchInteractions();
  }
}
```

## 🔧 Modifications à apporter

### Étapes d'implémentation:

1. **Supprimer les boutons existants**
   - Retirer les boutons "Modifier" des tâches (ligne ~4223)
   - Retirer les boutons "Supprimer" des tâches (ligne ~4224)
   - Retirer les boutons "Modifier" des récompenses (ligne ~4298)
   - Retirer les boutons "Supprimer" des récompenses (ligne ~4299)

2. **Ajouter les nouvelles classes CSS**
   - Intégrer les styles dans `KidsTasksStyleManager.getCoreKTStyles()`
   
3. **Modifier la structure HTML**
   - Ajouter les classes `clickable-item` et `long-press-item` aux conteneurs
   - Ajouter la classe `swipeable-item` aux tâches de validation
   - Intégrer les éléments de confirmation et d'action

4. **Implémenter la logique JavaScript**
   - Ajouter les méthodes de gestion tactile
   - Intégrer dans le cycle de vie du composant
   - Connecter aux actions existantes

### Points d'attention:

- **Accessibilité**: Conserver les interactions clavier pour l'accessibilité
- **Performance**: Optimiser les événements tactiles pour éviter les conflits
- **Compatibilité**: Tester sur différents navigateurs et appareils
- **Feedback visuel**: Assurer un retour visuel clair pour chaque interaction

## 📝 Tests recommandés

1. **Tests tactiles**:
   - Clic simple sur tâche/récompense → ouverture édition
   - Appui long sur tâche/récompense → confirmation suppression
   - Glissement gauche sur tâche en validation → rejet
   - Glissement droite sur tâche en validation → validation

2. **Tests d'accessibilité**:
   - Navigation au clavier
   - Lecteurs d'écran
   - Contrastes des couleurs

3. **Tests de compatibilité**:
   - iOS Safari
   - Android Chrome
   - Desktop Chrome/Firefox/Edge
   - Tablettes et téléphones

Cette implémentation modernisera l'interface utilisateur avec des interactions naturelles et intuitives, améliorant significativement l'expérience utilisateur sur tous les appareils.