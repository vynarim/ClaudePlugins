# Notes de documentation — <PROJET>

Spécificités projet lues par la skill `/doc` (plugin `claude-utils`). La méthode vit dans la skill —
ne pas la recopier ici.

## Carte : section du README → source qui fait foi

| Section | Où est la vérité |
|---|---|
| <Fonctionnalités> | `<src/screens/>` — <liste des écrans> |
| <Rôles & droits> | `<logique isAdmin dans src/App.jsx>` + `<firestore.rules>` |
| <Notifications> | `<functions/index.js>` — lister exactement les déclencheurs exportés |
| <Modèle de données> | `<firestore.rules>` + <ce que le serveur écrit réellement> |
| <Stack & architecture> | `<package.json>`, `<vite.config.js>`, arbo `<src/>` |
| <Scripts> | `<package.json>` + `<scripts/>` |
| <Installation> | `<SETUP.md>` — **y renvoyer, ne pas dupliquer** |
| <Tests> | `<tests/>` — voir la skill `/test` |

## Ordre des sections à préserver

`<# TITRE>` → `<## Aperçu>` → `<## Fonctionnalités>` → `<## Stack technique>` →
`<## Installation>` → `<## Scripts>` → `<## Déploiement>` → `<## Sécurité>`

## Fichiers annexes qui dérivent

- `<src/CONTEXTE.md>` — <contexte technique détaillé, distinct du README fonctionnel ; vérifier au
  minimum : …>
- `<docs/…>` — <…>

## Fichiers générés — ne jamais présenter comme éditables

- `<src/data/*.generated.js>` — produits par `<npm run gen>` depuis `<shared/…>`

## Ce qui ne doit jamais y figurer

<Dépôt public ou non. Secrets, jetons, clés de service. Données réelles de personnes — noms,
téléphones, montants : les exemples viennent des données de démonstration anonymisées.>

<Valeurs publiques par nature que le projet assume de laisser en clair : …>

## Pièges maison

<Distinctions que le README doit tenir et qui se perdent à chaque passage : dev/prod, base nommée,
fonctionnalité inactive tant qu'une clé manque, capacité retirée dont il reste des traces.>

<Documents supprimés volontairement, pour qu'ils ne soient pas recréés : …>
