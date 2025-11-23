# Kids Tasks Card - Home Assistant Lovelace Card

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/astrayel/kids-tasks-ha-card)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **Système complet de gestion de tâches pour enfants avec avatars personnalisables, récompenses et supervision parentale.**

## 🎯 Fonctionnalités

### 📱 Carte Enfant
- **Avatar grande taille** personnalisable avec cosmétiques
- **Système de points et pièces** avec progression par niveaux
- **Tâches quotidiennes** avec filtres avancés (À faire, Bonus, Habitudes)
- **Streaks** pour les habitudes 🔥
- **Récompenses** à débloquer et historique d'achats
- **Horaires indicatifs** pour les tâches

### 👨‍👩‍👧 Carte Supervisor (Parent)
- **File de validation** pour approuver les tâches des enfants
- **Gestes swipe** pour valider/rejeter rapidement
- **Vue d'ensemble** de tous les enfants
- **Actions rapides** : ajout/retrait points, attribution cosmétiques
- **Historique global** avec possibilité d'annulation

### ⚙️ Carte Manager (Administration)
- **CRUD complet** pour enfants, tâches et récompenses
- **Formulaires intuitifs** avec catégories visuelles
- **Gestion cosmétiques** (avatars, tenues, accessoires)
- **Configuration avancée** : fréquence, assignation multi-enfants, validation

### 🎨 Système d'Avatars
- **Rendu SVG** léger et performant
- **20+ cosmétiques** (cheveux, yeux, tenues, accessoires)
- **Cache intelligent** pour performances optimales
- **Animations** subtiles (respiration, clignement)

---

## 📦 Installation

### Via HACS (Recommandé)

1. Ouvrez HACS dans Home Assistant
2. Allez dans "Frontend"
3. Cliquez sur le menu (⋮) et sélectionnez "Custom repositories"
4. Ajoutez `https://github.com/astrayel/kids-tasks-ha-card`
5. Catégorie : "Lovelace"
6. Cliquez sur "Add"
7. Recherchez "Kids Tasks Card" et installez

### Installation Manuelle

1. Téléchargez `kids-tasks-card.js` depuis [releases](https://github.com/astrayel/kids-tasks-ha-card/releases)
2. Copiez le fichier dans `/config/www/kids-tasks-card/`
3. Ajoutez la ressource dans Home Assistant :

```yaml
resources:
  - url: /local/kids-tasks-card/kids-tasks-card.js
    type: module
```

---

## ⚡ Configuration Rapide

### Prérequis

Cette carte nécessite l'intégration **[Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha)** installée et configurée.

### Exemple de Configuration

#### Carte Enfant
```yaml
type: custom:kids-tasks-child-card
child_id: "emma"  # Nom ou ID de l'enfant
title: "Emma"
show_avatar: true
show_progress: true
show_rewards: true
show_completed: true
```

#### Carte Supervisor
```yaml
type: custom:kids-tasks-supervisor
title: "Supervision Parentale"
show_navigation: true
```

#### Carte Manager
```yaml
type: custom:kids-tasks-manager
title: "Administration"
show_navigation: true
```

#### Dashboard Principal
```yaml
type: custom:kids-tasks-card
title: "Tableau de Bord Familial"
show_navigation: true
show_completed: false
show_rewards: true
```

---

## 🎮 Utilisation

### Pour les Enfants

1. **Consulter les tâches** : Onglet "Tâches" avec filtres
2. **Compléter une tâche** : Cliquer sur ✓
3. **Voir les récompenses** : Onglet "Récompenses"
4. **Acheter une récompense** : Cliquer sur la récompense souhaitée
5. **Personnaliser l'avatar** : Bouton "🎨 Personnaliser" (à venir)
6. **Suivre l'historique** : Onglet "Historique"

### Pour les Parents

#### Validation des Tâches
1. Ouvrir la **Carte Supervisor**
2. Onglet "Validations" : Liste des tâches en attente
3. **Valider** : Bouton ✓ ou swipe droite
4. **Rejeter** : Bouton ✗ ou swipe gauche (avec raison)

#### Gestion des Enfants
1. Ouvrir la **Carte Manager**
2. Onglet "Enfants"
3. Ajouter/Modifier/Supprimer des enfants
4. Ajuster points, pièces, niveau

#### Création de Tâches
1. Ouvrir la **Carte Manager**
2. Onglet "Tâches"
3. Bouton "Ajouter une tâche"
4. Remplir le formulaire :
   - Nom et description
   - Catégorie (visuelle)
   - Points et pièces
   - Fréquence (quotidienne, hebdo, etc.)
   - Enfants assignés
   - Validation requise ?

#### Création de Récompenses
1. Onglet "Récompenses"
2. Bouton "Ajouter une récompense"
3. Choisir type : Réelle ou Cosmétique
4. Définir coût et disponibilité

---

## 📚 Configuration Avancée

### Options Carte Enfant

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `child_id` | string | *requis* | ID ou nom de l'enfant |
| `title` | string | Nom enfant | Titre de la carte |
| `show_avatar` | boolean | `true` | Afficher l'avatar |
| `show_progress` | boolean | `true` | Afficher barre de progression |
| `show_rewards` | boolean | `true` | Afficher onglet récompenses |
| `show_completed` | boolean | `true` | Afficher onglet historique |

### Options Carte Supervisor

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `title` | string | "Supervision" | Titre de la carte |
| `show_navigation` | boolean | `true` | Afficher navigation onglets |

### Options Carte Manager

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `title` | string | "Gestion..." | Titre de la carte |
| `show_navigation` | boolean | `true` | Afficher navigation onglets |

---

## 🎨 Personnalisation CSS

### Variables CSS Disponibles

```css
:host {
  --kt-primary: #2196f3;
  --kt-success: #4caf50;
  --kt-error: #f44336;
  --kt-warning: #ff9800;
  --kt-info: #00bcd4;

  --kt-space-xs: 4px;
  --kt-space-sm: 8px;
  --kt-space-md: 16px;
  --kt-space-lg: 24px;
  --kt-space-xl: 32px;

  --kt-radius-sm: 4px;
  --kt-radius-md: 8px;
  --kt-radius-lg: 12px;

  --kt-coins-color: #ffc107;
}
```

---

## 🔧 Développement

### Setup

```bash
# Clone du repository
git clone https://github.com/astrayel/kids-tasks-ha-card.git
cd kids-tasks-ha-card

# Installation dépendances
npm install

# Développement avec hot reload
npm run dev:full

# Build production
npm run build
```

---

## 🐛 Dépannage

### La carte ne s'affiche pas

1. Vérifier que l'intégration `kids_tasks` est installée
2. Vider le cache du navigateur (Ctrl+F5)
3. Vérifier la console JavaScript (F12)
4. Confirmer la ressource dans `configuration.yaml`

### Les tâches ne s'affichent pas

1. Vérifier que des tâches sont créées dans l'intégration
2. Vérifier que l'enfant est bien assigné aux tâches
3. Confirmer le `child_id` dans la configuration

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add: Amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [Home Assistant](https://www.home-assistant.io/) pour la plateforme
- [HACS](https://hacs.xyz/) pour la distribution
- La communauté HA pour le support

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/astrayel/kids-tasks-ha-card/issues)
- **Discussions** : [GitHub Discussions](https://github.com/astrayel/kids-tasks-ha-card/discussions)

---

## 🗺️ Roadmap

### v2.1 (À venir)
- [ ] Avatar Builder modal complet
- [ ] Animations avancées
- [ ] Mode sombre natif
- [ ] Support multi-langues

### v3.0
- [ ] Mode offline (PWA)
- [ ] Système de compagnons
- [ ] Achievements
- [ ] Application mobile

---

**Développé avec ❤️ pour les familles qui utilisent Home Assistant**

Pour plus de détails techniques, consultez [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)
