# CLAUDE.md

Cartes Lovelace pour l'intégration
[Kids Tasks Manager](https://github.com/astrayel/kids-tasks-ha).

## Architecture

Sources modulaires ES6 dans `src/`, compilées par Rollup vers
`dist/kids-tasks-card.js`.

```
src/
├── main.js              point d'entrée, enregistre les custom elements
├── base-card.js         classe socle : données, styles, gestes, modales, droits
├── card.js              custom:kids-tasks-card — tableau de bord général
├── child-card.js        custom:kids-tasks-child-card — vue enfant
├── supervisor-card.js   custom:kids-tasks-supervisor — validation parentale
├── manager-card.js      custom:kids-tasks-manager — administration
├── editors.js           éditeurs visuels de configuration
├── forms/               formulaires tâche et récompense
├── cosmetics/           avatars SVG, cache, catalogue
├── style-manager.js     injection CSS globale, variables --kt-*
└── accessibility.js · performance-monitor.js · error-boundary.js · logger.js
```

Les cartes étendent `HTMLElement` et rendent via `innerHTML` dans un shadow
root — **pas** LitElement, malgré ce que d'anciennes notes ont pu dire.

## Build et tests

- **Ne jamais lancer de build** (`npm run build`, `npm run dev`) : la CI
  GitHub Actions compile `src/` et commite `dist/` à chaque push. Modifier les
  sources et laisser faire.
- `npm test` lance `scripts/check-service-calls.js` : vérifie que chaque
  service `kids_tasks` appelé par les cartes existe réellement dans
  l'intégration. Trois noms de services fantômes ont vécu des mois dans ce
  dépôt — ce contrôle est là pour que ça ne recommence pas.
- Après une modification de `services.yaml` côté intégration :
  `npm run sync:services` régénère `tests/service-contract.json`.

## Contrat avec l'intégration

Les cartes lisent les entités `sensor.kidtasks_*` et appellent les services
`kids_tasks.*`. Deux règles à respecter :

- **Les identifiants viennent des attributs**, jamais de l'`entity_id`.
  `entity.attributes.task_id`, pas `entity_id.replace('sensor.kidtasks_task_', '')` :
  les tirets des UUID deviennent des underscores dans un `entity_id`, et l'id
  reconstruit ne correspond alors à aucune tâche.
- **Le statut d'un enfant vient de `child_statuses[childId]`**, pas de
  `entity.state`, qui porte le statut global de la tâche. Sur une tâche
  partagée, l'état global reflète ce qu'ont fait les frères et sœurs.

Toute action ciblant un enfant précis passe un `child_id` : valider ou
rejeter sans lui agit sur tous les enfants assignés à la tâche.

## Droits

`isParent()` (dans `base-card.js`) masque les vues parentales sur un compte
non-administrateur. **C'est du confort d'affichage, pas une protection** : la
garde réelle est côté serveur, dans l'intégration. Voir `docs/permissions.md`
du dépôt de l'intégration.

## Style de code

- ES6+, classes, pas de dépendance runtime
- CSS via `KidsTasksStyleManager` et variables `--kt-*`, thème HA respecté
- Avant d'ajouter une fonction, vérifier avec Grep qu'un équivalent n'existe
  pas déjà dans `base-card.js` — c'est là que vit le commun.

## Installation

Voir `README.md`. En résumé : HACS en dépôt personnalisé (catégorie Lovelace),
ou copie manuelle de `dist/kids-tasks-card.js` puis déclaration de la ressource.

## Dépannage

- **Carte absente du sélecteur** : ressource Lovelace non déclarée, ou cache
  navigateur.
- **Un bouton ne fait rien** : console du navigateur. Un service refusé
  indique le régime de droits de l'appelant.
- **« Enfant non trouvé »** : le `child_id` de la config ne correspond à aucun
  enfant ; le relire dans les attributs de `sensor.kidtasks_<prénom>_points`.
