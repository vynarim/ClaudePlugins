---
name: pp-scaffold
description: >-
  Transforme une idée ou une maquette React en projet Power Apps Code App prêt à publier : SPA
  Vite + TypeScript, SDK @microsoft/power-apps, composant PowerProvider, vite.config conforme, et
  initialisation via pac code init (power.config.json). À utiliser quand l'utilisateur veut créer une
  Code App, démarrer une app Power Platform en code, transformer une maquette React en Code App, ou
  initialiser un projet code-first Power Apps. Déclenche sur : « pp-scaffold », « crée une code app »,
  « nouveau projet power apps en code », « initialise une code app », « pac code init », « maquette
  react en power app », « scaffold code app ».
---

# pp-scaffold — D'une maquette React à une Code App

Objectif : produire la structure d'une Power App Code App (SPA Vite + TypeScript branchée au SDK
Power Platform), puis l'initialiser avec `pac code init`. Le branchement aux données (Dataverse,
connecteurs) est ensuite fait par `/pp-data` ; la publication par `/pp-ship`.

Contexte : VS Code sous Windows, shell **PowerShell**. Statut **preview** — voir les notes de
dépréciation plus bas.

## Prérequis (sinon → `/pp-setup`)

- `pac`, `node` (LTS), `npm` dans le PATH ; extensions VS Code en place.
- Authentifié sur le bon environnement : `pac auth create` puis `pac env select --environment <url>`.
- Lancer `/pp-diag` en cas de doute.

## Étape 1 — Choisir le point de départ

**A. Depuis le template officiel Microsoft** (le plus sûr — config Vite déjà conforme) :

```powershell
npx degit github:microsoft/PowerAppsCodeApps/templates/vite <mon-app>
cd <mon-app>
npm install
```

**B. Depuis une maquette React existante / from scratch** : s'assurer que c'est un **SPA Vite +
TypeScript**, puis ajouter les pièces Power Platform (étape 2).

> Si un `npm install` échoue sur `unable to get local issuer certificate` (réseau corporate), pointer
> le certificat avant de relancer : `$env:NODE_EXTRA_CA_CERTS = "<chemin .pem>"` (voir `/pp-setup`).

## Étape 2 — Les pièces Power Platform (si départ B)

1. **SDK** : `npm install @microsoft/power-apps` (ne pas figer la version — preview).
2. **PowerProvider** : ajouter `src/PowerProvider.tsx` (provider qui initialise le SDK ; repris du dépôt
   `microsoft/PowerAppsCodeApps`) et **envelopper l'app** avec, à la racine du rendu (`main.tsx`).
3. **vite.config.ts** : config conforme Code Apps (le template A la fournit) — dev server attendu sur
   le **port 3000**, base path adéquat.
4. **Scripts `package.json`** :
   - `dev` lance le serveur SDK local **et** Vite (ex. `"dev": "start pac code run && vite"`).
   - `build` = `"tsc -b && vite build"`.

## Étape 3 — Initialiser la Code App

À la racine du projet :

```powershell
pac code init --displayName "<nom affiché de l'app>"
# --environment <url> si différent de l'org active ; --description, --buildPath… au besoin
```

Génère `power.config.json` (métadonnées de l'app) — c'est le marqueur que le dossier est une Code App.

## Étape 4 — Générer / adapter la maquette React

Claude génère ici les composants React de la maquette selon le besoin métier. Contraintes Code Apps à
respecter :

- SPA mono-page ; pas d'API serveur maison — les données passent par les **services générés** (ajoutés
  par `/pp-data`, sous `src/generated/`).
- L'arbre de rendu reste enveloppé par `PowerProvider`.
- Garder l'UI découplée de l'accès données (composants ↔ services typés) pour faciliter le câblage.

## Étape 5 — Exécution locale

```powershell
npm run dev   # lance pac code run + Vite (port 3000)
```

> Gotcha (depuis déc. 2025) : Chrome/Edge bloquent par défaut les requêtes public→localhost. Le dev
> local peut nécessiter d'autoriser l'accès réseau local dans le navigateur (ou `allow="local-network-access"`
> sur les iframes).

## Étape 6 — Renseigner le CLAUDE.md

Reporter dans la section Power Platform du `CLAUDE.md` : dossier de l'app, displayName, solution
cible. Gabarit partagé : `../../references/claude-md-template.md` (racine du plugin).

## Suite

- Brancher les données : `/pp-data`.
- Publier dans la solution : `/pp-ship`.

## Ce que cette skill ne fait PAS

- Elle n'ajoute pas les sources de données (→ `/pp-data`).
- Elle ne publie pas (→ `/pp-ship`).
- Elle n'active pas les Code Apps sur l'environnement (réglage Admin Center, → `/pp-setup`).

## Notes de dépréciation

Les commandes `pac code` sont transitoires : à terme remplacées par le CLI npm embarqué dans
`@microsoft/power-apps` (v1.0.4+). Vérifier la doc officielle si une commande `pac code` ne répond plus
comme attendu.
