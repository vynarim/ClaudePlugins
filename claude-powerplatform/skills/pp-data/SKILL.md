---
name: pp-data
description: >-
  Branche une Power App Code App à ses données : tables Dataverse et connecteurs Power Platform
  (Microsoft Teams, Office 365, SharePoint, SQL…) via pac code add-data-source, qui génère des
  modèles/services TypeScript typés sous src/generated/. À utiliser quand l'utilisateur veut relier
  son app à Dataverse, ajouter un connecteur (Teams, Outlook, SharePoint), connecter une source de
  données, ou gérer les sources d'une Code App. Déclenche sur : « pp-data », « relie à dataverse »,
  « ajoute un connecteur », « connecte Teams », « add-data-source », « brancher les données »,
  « connecter une table », « source de données power apps ».
---

# pp-data — Brancher Dataverse et les connecteurs

Objectif : ajouter à une Code App ses sources de données et obtenir des **services TypeScript typés**
prêts à consommer dans le React. Toutes les sources passent par `pac code add-data-source`.

Contexte : VS Code sous Windows, shell **PowerShell**. Statut **preview**.

## Prérequis

- Projet initialisé : `power.config.json` présent (sinon → `/pp-scaffold`).
- Authentifié sur le bon environnement (`pac org who` / `pac env select`). Doute → `/pp-diag`.

## Étape 1 — Connexion (pour les connecteurs, pas pour Dataverse)

- **Dataverse** : aucune connexion à créer, on lie directement par nom logique de table.
- **Connecteurs** (Teams, Office 365, SharePoint, SQL…) : il faut une **connexion**. La créer dans le
  maker portal (make.powerapps.com → Connexions → Nouvelle connexion) **ou** via le CLI (preview),
  puis récupérer son `apiName` et son `connectionId` :

```powershell
pac connection list
```

## Étape 2 — Découvrir datasets / tables (connecteurs tabulaires)

```powershell
pac code list-datasets -a <apiName> -c <connectionId>
pac code list-tables   -a <apiName> -c <connectionId> -d <dataset>
```

## Étape 3 — Ajouter la source

```powershell
# Dataverse (par nom logique de table) — pas de connectionId
pac code add-data-source -a dataverse -t <table-logical-name>

# Microsoft Teams (connecteur)
pac code add-data-source -a shared_teams -c <connectionId>

# Office 365 Users
pac code add-data-source -a shared_office365users -c <connectionId>

# SharePoint (liste = -t, site = -d)
pac code add-data-source -a shared_sharepointonline -c <connectionId> -t "<NomListe>" -d "https://contoso.sharepoint.com/sites/X"
```

**ALM (recommandé)** — pour une app portable Dev/Test/Prod, lier par **connection reference** plutôt
que par `connectionId` utilisateur :

```powershell
pac code add-data-source -a <apiName> -cr <connectionReferenceLogicalName> -s <solutionId>
```

## Étape 4 — Utiliser les services générés

`add-data-source` génère des modèles/services typés sous `src/generated/` (ex.
`src/generated/services/AccountsService.ts`). Ils exposent un CRUD typé :

- `getAll(options)`, `get(id)`, `create(record)`, `update(id, record)`, `delete(id)`
- Dataverse : délégation Filter/Sort/Top et pagination supportées.

Côté React, consommer ces services depuis les composants (UI découplée de l'accès données, cf.
`/pp-scaffold`). Ne pas écrire d'appels HTTP maison.

## Étape 5 — Modifier / supprimer une source

Pas de refresh sur changement de schéma : **delete puis re-add**.

```powershell
pac code delete-data-source -a <apiName> -ds <dataSourceName>
# puis refaire le add-data-source de l'étape 3
```

## Étape 6 — Renseigner le CLAUDE.md

Lister les sources ajoutées (table Dataverse, connecteurs + IDs ou connection refs) dans la section
Power Platform du `CLAUDE.md`. Gabarit : `../../references/claude-md-template.md` (racine du plugin).

## Limites connues (preview)

- Connecteurs **Excel Online** (Business / OneDrive) **non supportés**. Les autres connecteurs le sont.
- Dataverse non supporté : lookups polymorphes, FetchXML, clés alternées, CRUD de schéma/métadonnées,
  suppression de source Dataverse via le CLI.
- Statut preview : commandes susceptibles d'évoluer (`pac code` → CLI npm `@microsoft/power-apps`).

## Ce que cette skill ne fait PAS

- Elle ne crée pas le projet (→ `/pp-scaffold`) ni ne publie (→ `/pp-ship`).
- Elle ne code pas l'UI : elle fournit les services typés que l'UI consomme.
