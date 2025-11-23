# Kids Tasks Card - Guide de Tests

**Date**: 2025-11-23
**Version**: 2.0.0
**Statut**: Prêt pour tests

---

## 📋 APERÇU

Ce document détaille le plan de tests complet pour valider l'implémentation des cartes Kids Tasks (Child, Supervisor, Manager).

### Prérequis
- ✅ Home Assistant 2024.1.0+
- ✅ Intégration [Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha) installée
- ✅ Au moins 2 enfants configurés dans l'intégration
- ✅ Quelques tâches et récompenses créées

---

## 🎯 TESTS PAR CARTE

### 1. CARTE ENFANT (kids-tasks-child-card)

#### Configuration de Test
```yaml
type: custom:kids-tasks-child-card
child_id: "emma"  # ou UUID de l'enfant
title: "Emma"
show_avatar: true
show_progress: true
show_rewards: true
show_completed: true
```

#### Tests Fonctionnels

##### 1.1 Avatar Grande Taille
- [ ] **Test**: L'avatar s'affiche à 300x300px
- [ ] **Test**: L'avatar utilise le système SVG (si disponible)
- [ ] **Test**: L'avatar affiche un emoji si SVG indisponible
- [ ] **Test**: Les cosmétiques équipés sont visibles (cheveux, tenue, accessoires)
- [ ] **Test**: Le bouton "🎨 Personnaliser" est présent
- [ ] **Résultat attendu**: Avatar clair, lisible, bien proportionné

##### 1.2 Statistiques
- [ ] **Test**: Points affichés avec icône 🎫
- [ ] **Test**: Pièces affichées avec icône 🪙
- [ ] **Test**: Niveau affiché avec icône ⭐
- [ ] **Test**: Barre de progression vers niveau suivant
- [ ] **Résultat attendu**: Stats à jour, formatées correctement

##### 1.3 Filtres de Tâches
- [ ] **Test**: Filtre "À faire" affiche uniquement tâches `status: todo`
- [ ] **Test**: Filtre "Faites" affiche tâches complétées/validées
- [ ] **Test**: Filtre "Bonus" affiche tâches `frequency: none`
- [ ] **Test**: Filtre "🔥 Habitudes" affiche tâches récurrentes
- [ ] **Test**: Filtre "📅 Demain" fonctionne (si implémenté)
- [ ] **Test**: Filtre "Toutes" affiche toutes les tâches
- [ ] **Test**: Navigation entre filtres sans erreur
- [ ] **Résultat attendu**: Filtres appliqués correctement

##### 1.4 Affichage des Tâches
- [ ] **Test**: Nom de la tâche affiché
- [ ] **Test**: Horaire limite affiché si présent (⏰ HH:MM)
- [ ] **Test**: Badge 🔥 avec compteur de streak pour habitudes
- [ ] **Test**: Badge "👀 Validation" si `validation_required: true`
- [ ] **Test**: Récompenses affichées (+XX 🎫, +XX 🪙)
- [ ] **Test**: Bouton ✓ pour compléter la tâche
- [ ] **Résultat attendu**: Toutes les infos visibles et claires

##### 1.5 Complétion de Tâche
- [ ] **Test**: Clic sur ✓ → appelle `kids_tasks.complete_task`
- [ ] **Test**: Notification de succès affichée
- [ ] **Test**: Tâche passe à "Faites" ou "En attente de validation"
- [ ] **Test**: Points/pièces ajoutés immédiatement (si pas validation)
- [ ] **Résultat attendu**: Action fluide, feedback clair

##### 1.6 Calcul des Streaks
- [ ] **Test**: Tâche daily complétée aujourd'hui → streak = 1+
- [ ] **Test**: Tâche daily pas faite depuis 2 jours → streak = 0
- [ ] **Test**: Tâche weekly dans les 7 jours → streak maintenu
- [ ] **Résultat attendu**: Calcul correct des streaks

##### 1.7 Onglet "Récompenses"
- [ ] **Test**: Affiche toutes les récompenses disponibles
- [ ] **Test**: Coût affiché en points/pièces
- [ ] **Test**: Récompenses désactivées si pas assez de monnaie
- [ ] **Test**: Clic sur récompense → achète avec `claim_reward`
- [ ] **Test**: Confirmation ou notification d'achat
- [ ] **Résultat attendu**: Shop fonctionnel

##### 1.8 Onglet "Mes Récompenses"
- [ ] **Test**: Affiche historique des récompenses achetées
- [ ] **Test**: Date d'achat formatée correctement
- [ ] **Test**: Nom de la récompense affiché
- [ ] **Résultat attendu**: Historique complet et lisible

##### 1.9 Onglet "Historique"
- [ ] **Test**: Affiche historique des actions (tâches, points, achats)
- [ ] **Test**: Tri chronologique (plus récent en haut)
- [ ] **Test**: Filtrage par type d'action si disponible
- [ ] **Résultat attendu**: Timeline claire

---

### 2. CARTE SUPERVISOR (kids-tasks-supervisor)

#### Configuration de Test
```yaml
type: custom:kids-tasks-supervisor
title: "Supervision Parentale"
show_navigation: true
```

#### Tests Fonctionnels

##### 2.1 File de Validation
- [ ] **Test**: Affiche toutes les tâches `status: pending_validation`
- [ ] **Test**: Tri par date (plus anciennes en premier)
- [ ] **Test**: Affiche enfant, nom tâche, points/pièces
- [ ] **Test**: Temps écoulé depuis complétion affiché
- [ ] **Résultat attendu**: Queue organisée et informative

##### 2.2 Validation de Tâche
- [ ] **Test**: Clic sur ✅ → appelle `kids_tasks.validate_task`
- [ ] **Test**: Notification "Tâche validée !"
- [ ] **Test**: Tâche disparaît de la queue
- [ ] **Test**: Points/pièces ajoutés à l'enfant
- [ ] **Résultat attendu**: Validation immédiate, feedback clair

##### 2.3 Rejet de Tâche
- [ ] **Test**: Clic sur ❌ → demande raison
- [ ] **Test**: Appelle `kids_tasks.reject_task` avec raison
- [ ] **Test**: Notification "Tâche rejetée"
- [ ] **Test**: Tâche retourne à "À faire" pour l'enfant
- [ ] **Résultat attendu**: Rejet fonctionnel avec raison

##### 2.4 Gestes Swipe (si implémenté)
- [ ] **Test**: Swipe droite → valide
- [ ] **Test**: Swipe gauche → rejette
- [ ] **Test**: Animation fluide
- [ ] **Résultat attendu**: Gestes naturels et rapides

##### 2.5 Vue Enfants
- [ ] **Test**: Grille avec tous les enfants
- [ ] **Test**: Stats affichées (points, pièces, niveau)
- [ ] **Test**: Tâches du jour : complétées / total
- [ ] **Test**: Clic sur enfant → détails ou actions
- [ ] **Résultat attendu**: Vue d'ensemble claire

##### 2.6 Actions Rapides
- [ ] **Test**: Bouton "Ajouter Points" → modal
- [ ] **Test**: Sélection enfant + montant + raison
- [ ] **Test**: Appelle `kids_tasks.add_points`
- [ ] **Test**: Bouton "Retirer Points" fonctionnel
- [ ] **Test**: Bouton "Ajouter Pièces" fonctionnel
- [ ] **Test**: Bouton "Donner Cosmétique" → catalogue
- [ ] **Résultat attendu**: Actions immédiates, feedback confirmé

##### 2.7 Historique Global
- [ ] **Test**: Affiche historique de tous les enfants
- [ ] **Test**: Filtrage par enfant
- [ ] **Test**: Bouton "Annuler" sur actions récentes (si disponible)
- [ ] **Résultat attendu**: Vision complète des actions familiales

---

### 3. CARTE MANAGER (kids-tasks-manager)

#### Configuration de Test
```yaml
type: custom:kids-tasks-manager
title: "Administration"
show_navigation: true
```

#### Tests Fonctionnels

##### 3.1 Gestion des Enfants
- [ ] **Test**: Liste tous les enfants
- [ ] **Test**: Bouton "Ajouter un enfant" → formulaire
- [ ] **Test**: Champs : nom, emoji, niveau, points, pièces
- [ ] **Test**: Soumission → appelle `kids_tasks.add_child`
- [ ] **Test**: Bouton "Éditer" → formulaire pré-rempli
- [ ] **Test**: Soumission édition → `kids_tasks.update_child`
- [ ] **Test**: Bouton "Supprimer" → confirmation + `kids_tasks.remove_child`
- [ ] **Résultat attendu**: CRUD complet fonctionnel

##### 3.2 CRUD Tâches (TaskForm)
- [ ] **Test**: Bouton "Ajouter une tâche" → modal TaskForm
- [ ] **Test**: Champ "Nom" requis
- [ ] **Test**: Champ "Description" optionnel
- [ ] **Test**: Grille de catégories visuelle (🛏️ Chambre, 🛁 SdB, etc.)
- [ ] **Test**: Sélection icône personnalisée (emoji ou mdi:)
- [ ] **Test**: Champs points/pièces/pénalité
- [ ] **Test**: Select fréquence (daily/weekly/monthly/once/none)
- [ ] **Test**: Si weekly → checkboxes jours de la semaine
- [ ] **Test**: Champ horaire limite (HH:MM)
- [ ] **Test**: Assignation multi-enfants (checkboxes)
- [ ] **Test**: Checkbox "Validation requise"
- [ ] **Test**: Checkbox "Tâche active"
- [ ] **Test**: Bouton "Enregistrer" → `kids_tasks.add_task`
- [ ] **Test**: Notification "Tâche créée !"
- [ ] **Test**: Édition tâche existante → formulaire pré-rempli
- [ ] **Test**: Soumission édition → `kids_tasks.update_task`
- [ ] **Test**: Annulation ferme modal sans sauvegarder
- [ ] **Résultat attendu**: Formulaire complet, intuitif, sans erreur

##### 3.3 CRUD Récompenses (RewardForm)
- [ ] **Test**: Bouton "Ajouter une récompense" → modal RewardForm
- [ ] **Test**: Champ "Nom" requis
- [ ] **Test**: Champ "Description" optionnel
- [ ] **Test**: Grille de catégories (🎉 Loisir, 📱 Écran, etc.)
- [ ] **Test**: Select type : Réelle / Cosmétique
- [ ] **Test**: Si cosmétique → select type (hair/eyes/outfit/accessory)
- [ ] **Test**: Si cosmétique → champ ID cosmétique
- [ ] **Test**: Champs coût points/pièces
- [ ] **Test**: Champ niveau minimum requis
- [ ] **Test**: Checkbox "Quantité limitée"
- [ ] **Test**: Si limitée → champ quantité disponible
- [ ] **Test**: Checkbox "Récompense active"
- [ ] **Test**: Bouton "Enregistrer" → `kids_tasks.add_reward`
- [ ] **Test**: Notification "Récompense créée !"
- [ ] **Test**: Édition récompense → formulaire pré-rempli
- [ ] **Test**: Soumission édition → `kids_tasks.update_reward`
- [ ] **Résultat attendu**: Formulaire complet, support cosmétiques

##### 3.4 Gestion Cosmétiques
- [ ] **Test**: Onglet "Cosmétiques" affiche catalogue
- [ ] **Test**: Liste des cosmétiques par type (cheveux, yeux, tenues, accessoires)
- [ ] **Test**: Bouton "Créer Récompenses Cosmétiques" → `createCosmeticRewards()`
- [ ] **Test**: Confirmation de création
- [ ] **Résultat attendu**: Catalogue visible, création batch possible

---

### 4. CARTE DASHBOARD (kids-tasks-card)

#### Configuration de Test
```yaml
type: custom:kids-tasks-card
title: "Tableau de Bord Familial"
show_navigation: true
show_completed: false
show_rewards: true
```

#### Tests Fonctionnels
- [ ] **Test**: Affiche vue d'ensemble de tous les enfants
- [ ] **Test**: Navigation entre enfants
- [ ] **Test**: Résumé des tâches du jour
- [ ] **Test**: Statistiques familiales
- [ ] **Résultat attendu**: Vue globale claire

---

## 🎨 TESTS SYSTÈME AVATAR

### 5.1 Génération SVG
- [ ] **Test**: Avatar généré en SVG (<svg> tag)
- [ ] **Test**: Taille configurée respectée (200px, 300px)
- [ ] **Test**: Layers rendus dans l'ordre (base, hair, eyes, outfit, accessory)
- [ ] **Test**: Couleurs de peau appliquées correctement
- [ ] **Résultat attendu**: SVG valide, bien formé

### 5.2 Cache Avatar
- [ ] **Test**: Premier rendu → génération complète
- [ ] **Test**: Second rendu → récupération du cache
- [ ] **Test**: Cache in-memory (Map) fonctionne
- [ ] **Test**: Cache localStorage fonctionne
- [ ] **Test**: Expiration après 7 jours
- [ ] **Test**: Éviction LRU si cache plein
- [ ] **Résultat attendu**: Performance optimisée

### 5.3 Cosmétiques
- [ ] **Test**: Cheveux courts bruns (default)
- [ ] **Test**: Cheveux longs blonds
- [ ] **Test**: Cheveux bouclés noirs
- [ ] **Test**: Yeux joyeux, neutres, excités
- [ ] **Test**: T-shirts (bleu, rouge, vert)
- [ ] **Test**: Robe rose, hoodie gris
- [ ] **Test**: Accessoires (lunettes, chapeau pirate, couronne, casque)
- [ ] **Résultat attendu**: Tous les cosmétiques visibles et distincts

### 5.4 Animations (si activées)
- [ ] **Test**: Animation de respiration (léger mouvement)
- [ ] **Test**: Clignement des yeux
- [ ] **Résultat attendu**: Animations subtiles, non intrusives

---

## 🎯 TESTS D'INTÉGRATION

### 6.1 Services Home Assistant
- [ ] **Test**: `kids_tasks.add_task` fonctionne
- [ ] **Test**: `kids_tasks.update_task` fonctionne
- [ ] **Test**: `kids_tasks.remove_task` fonctionne
- [ ] **Test**: `kids_tasks.complete_task` fonctionne
- [ ] **Test**: `kids_tasks.validate_task` fonctionne
- [ ] **Test**: `kids_tasks.reject_task` fonctionne
- [ ] **Test**: `kids_tasks.add_reward` fonctionne
- [ ] **Test**: `kids_tasks.update_reward` fonctionne
- [ ] **Test**: `kids_tasks.claim_reward` fonctionne
- [ ] **Test**: `kids_tasks.add_child` fonctionne
- [ ] **Test**: `kids_tasks.update_child` fonctionne
- [ ] **Test**: `kids_tasks.add_points` fonctionne
- [ ] **Résultat attendu**: Tous les services répondent sans erreur

### 6.2 État des Entités
- [ ] **Test**: Entités enfants récupérées via `hass.states`
- [ ] **Test**: Entités tâches récupérées
- [ ] **Test**: Entités récompenses récupérées
- [ ] **Test**: Mise à jour en temps réel après actions
- [ ] **Résultat attendu**: Synchronisation immédiate

### 6.3 Gestion d'Erreurs
- [ ] **Test**: Service call échoue → notification d'erreur affichée
- [ ] **Test**: Entité manquante → message d'erreur clair
- [ ] **Test**: Champ requis vide → validation côté client
- [ ] **Test**: Network error → retry ou message d'erreur
- [ ] **Résultat attendu**: Erreurs capturées, feedback utilisateur

---

## 📱 TESTS RESPONSIVE

### 7.1 Desktop (>1024px)
- [ ] **Test**: Cartes affichées en largeur complète
- [ ] **Test**: Avatar 300x300px visible
- [ ] **Test**: Grilles multi-colonnes pour tâches/récompenses
- [ ] **Résultat attendu**: Utilisation optimale de l'espace

### 7.2 Tablet (768px - 1024px)
- [ ] **Test**: Cartes adaptées en 2 colonnes
- [ ] **Test**: Avatar réduit à 200px si nécessaire
- [ ] **Test**: Navigation tactile fluide
- [ ] **Résultat attendu**: Layout adapté, lisible

### 7.3 Mobile (<768px)
- [ ] **Test**: Cartes en colonne unique
- [ ] **Test**: Avatar réduit à 150px
- [ ] **Test**: Boutons suffisamment grands pour touch
- [ ] **Test**: Scrolling vertical fluide
- [ ] **Résultat attendu**: Expérience mobile optimisée

---

## 🎨 TESTS CSS & STYLE

### 8.1 Variables CSS
- [ ] **Test**: `--kt-primary` appliqué aux boutons principaux
- [ ] **Test**: `--kt-success` appliqué aux validations
- [ ] **Test**: `--kt-error` appliqué aux rejets/erreurs
- [ ] **Test**: `--kt-warning` appliqué aux alertes
- [ ] **Test**: Espacement `--kt-space-*` cohérent
- [ ] **Test**: Bordures arrondies `--kt-radius-*` appliquées
- [ ] **Résultat attendu**: Thème cohérent, personnalisable

### 8.2 Dark Mode (si supporté)
- [ ] **Test**: Couleurs inversées en mode sombre
- [ ] **Test**: Contraste suffisant pour lisibilité
- [ ] **Test**: Avatar visible en dark mode
- [ ] **Résultat attendu**: Support dark mode natif

---

## ⚡ TESTS PERFORMANCE

### 9.1 Chargement Initial
- [ ] **Test**: Carte charge en <2 secondes
- [ ] **Test**: Avatar SVG généré en <200ms
- [ ] **Test**: Pas de flash de contenu non stylé (FOUC)
- [ ] **Résultat attendu**: Chargement fluide

### 9.2 Rendu
- [ ] **Test**: Changement de filtre <100ms
- [ ] **Test**: Complétion tâche <500ms (incluant service call)
- [ ] **Test**: Pas de lag lors du scroll
- [ ] **Résultat attendu**: Interface réactive

### 9.3 Cache
- [ ] **Test**: Avatar en cache → <10ms
- [ ] **Test**: LocalStorage <5MB utilisé
- [ ] **Test**: Éviction LRU fonctionne sans bloquer UI
- [ ] **Résultat attendu**: Cache transparent, performant

---

## 🐛 TESTS DE RÉGRESSION

### 10.1 Ancienne Fonctionnalité (v1.x)
- [ ] **Test**: Carte principale (kids-tasks-card) toujours fonctionnelle
- [ ] **Test**: Configuration YAML v1.x compatible
- [ ] **Test**: Pas de breaking changes non documentés
- [ ] **Résultat attendu**: Migration transparente

### 10.2 Compatibilité Navigateurs
- [ ] **Test**: Chrome/Edge (Chromium 90+)
- [ ] **Test**: Firefox 88+
- [ ] **Test**: Safari 14+
- [ ] **Test**: Mobile Safari (iOS 14+)
- [ ] **Test**: Chrome Mobile (Android 10+)
- [ ] **Résultat attendu**: Fonctionne sur tous les navigateurs modernes

---

## 📊 CHECKLIST FINALE

### Avant Release
- [ ] Tous les tests fonctionnels passent
- [ ] Aucune erreur console JavaScript
- [ ] Aucun warning Home Assistant
- [ ] Documentation à jour (README.md, IMPLEMENTATION-SUMMARY.md)
- [ ] Screenshots/GIFs ajoutés
- [ ] CHANGELOG.md créé
- [ ] Version tagguée dans git
- [ ] Release GitHub publiée

### Tests Utilisateurs Réels
- [ ] Au moins 2 familles testent pendant 1 semaine
- [ ] Feedback collecté et intégré
- [ ] Issues GitHub triées et priorisées

---

## 🚀 COMMANDES DE TEST

### Build Production
```bash
npm run build
```

### Vérifier Taille Bundle
```bash
ls -lh dist/kids-tasks-card.js
# Objectif : <500KB
```

### Test Développement
```bash
npm run dev:full
# Ouvrir http://localhost:5173 dans HA
```

### Validation Syntax
```bash
npx eslint src/**/*.js
```

---

## 📝 RAPPORT DE TEST

**Template à remplir après tests:**

```markdown
# Rapport de Test - Kids Tasks Card v2.0.0

**Date**: [DATE]
**Testeur**: [NOM]
**Environnement**:
- HA Version: [VERSION]
- Navigateur: [NAVIGATEUR + VERSION]
- Appareil: [DEVICE]

## Résultats

### Carte Enfant
- Fonctionnalités testées: XX/XX ✅
- Bugs trouvés: [LISTE]
- Notes: [OBSERVATIONS]

### Carte Supervisor
- Fonctionnalités testées: XX/XX ✅
- Bugs trouvés: [LISTE]
- Notes: [OBSERVATIONS]

### Carte Manager
- Fonctionnalités testées: XX/XX ✅
- Bugs trouvés: [LISTE]
- Notes: [OBSERVATIONS]

### Système Avatar
- Tests passés: XX/XX ✅
- Performance: [OK/KO]
- Notes: [OBSERVATIONS]

## Conclusion
[AVIS GLOBAL] ✅ PRÊT / ⚠️ CORRECTIONS NÉCESSAIRES / ❌ BLOQUEURS
```

---

## 🎯 PRIORITÉS DE TEST

### Priorité HAUTE (Bloqueurs)
1. Complétion de tâches
2. Validation/rejet tâches
3. Achat de récompenses
4. CRUD tâches/récompenses
5. Affichage avatar

### Priorité MOYENNE (Important)
6. Filtres tâches
7. Calcul streaks
8. Onglet "Mes Récompenses"
9. Actions rapides supervisor
10. Cache avatar

### Priorité BASSE (Nice to have)
11. Animations avatar
12. Swipe gestures
13. Filtre "Demain"
14. Dark mode
15. Graphiques statistiques

---

**Document créé le 2025-11-23**
**Maintenu par**: Claude (Anthropic)
**Contact**: [GitHub Issues](https://github.com/astrayel/kids-tasks-ha-card/issues)
