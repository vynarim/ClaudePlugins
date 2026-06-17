---
name: pp-setup
description: >-
  Guide d'installation et de configuration complet d'un poste VS Code pour développer des Power Apps
  (Code Apps) avec Claude Code : extensions VS Code (Power Platform Tools, Claude Code), toolchain
  (Node/npm/pac), quirk du PATH, certificat CA corporate, activation des Code Apps dans l'Admin
  Center, auth pac, connexions aux connecteurs. Exécute les étapes automatisables et guide pas-à-pas
  les étapes manuelles (web UI, maker portal). À utiliser pour préparer une machine, onboarder un
  développeur, ou débloquer une étape de setup. Déclenche sur : « pp-setup », « configure mon poste
  pour power platform », « installe la toolchain power apps », « comment activer les code apps »,
  « setup pac de zéro », « onboarding power platform », « première mise en place power apps ».
---

# pp-setup — Mettre en place un poste Power Platform (Code Apps) de zéro

Objectif : amener une machine VS Code de rien à un poste prêt à créer une Code App. La création du
projet est ensuite faite par `/pp-scaffold`, le branchement des données par `/pp-data`, la publication
par `/pp-ship`.

Certaines étapes sont automatisables (Claude les exécute), d'autres sont strictement manuelles (web
UI, maker portal) — Claude les guide alors pas-à-pas et **attend la confirmation** avant de continuer.

Contexte : VS Code sous Windows, shell **PowerShell**, souvent sans droits admin et derrière un proxy
d'entreprise à interception TLS. Statut **preview**.

## Vue d'ensemble (l'ordre compte)

```
0. Extensions VS Code              → vérifiable (code --list-extensions)
1. Toolchain (Node/npm/pac/git)    → installable, partiellement manuel (ZIP/winget)
2. Quirk du PATH                   → automatisable (correctif session)
3. Certificat CA corporate         → semi-auto (export Windows → bundle PEM)
4. Activer les Code Apps           → MANUEL (Admin Center, web UI)
5. Auth pac + sélection env        → automatisable
6. Connexions aux connecteurs      → maker portal ou CLI (preview)
→ ensuite : /pp-scaffold (créer l'app) · /pp-data (brancher) · /pp-ship (publier)
```

Avant de commencer, lancer `/pp-diag` : il dit déjà quelles étapes sont OK. N'attaquer que les ❌.

## 0. Extensions VS Code

```powershell
code --list-extensions | Select-String -Pattern "powerplatform-vscode|claude-code"
```

- **Power Platform Tools** (`microsoft-IsvExpTools.powerplatform-vscode`) — **requis** : embarque le
  `pac` CLI dans le terminal VS Code, build/deploy de solutions. Installer via la vue Extensions ou :
  ```powershell
  code --install-extension microsoft-IsvExpTools.powerplatform-vscode
  ```
- **Claude Code for VS Code** (`anthropic.claude-code`, *ID présumé*) — **requis**. Si absent alors que
  Claude Code tourne, relever l'ID réel dans `code --list-extensions` et l'ajuster.

## 1. Installer la toolchain (sans droits admin)

`git` est souvent déjà présent. Pour le reste :

- **Node.js** — si l'install winget MSI échoue (UAC non validable en shell non-interactif), télécharger
  le **ZIP officiel**, l'extraire dans le profil (ex. `%LOCALAPPDATA%\nodejs`) et l'ajouter au **PATH
  utilisateur**.
- **npm** vient avec Node.
- **pac** — soit via l'extension Power Platform Tools (recommandé, déjà fait à l'étape 0), soit
  `winget install Microsoft.PowerAppsCLI` puis `pac install latest`.

Vérifier (après l'étape 2 si non reconnu) : `node --version; npm --version; pac --version; git --version`

## 2. Régler le quirk du PATH

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

À refaire à chaque session Claude Code tant que nécessaire (un terminal frais voit les outils
automatiquement).

## 3. Régler le certificat SSL corporate

Sur réseau à interception TLS, Node ne connaît pas la racine CA → les `npm install` à build natif
(ex. `keytar`, tiré par `@microsoft/power-apps`) échouent sur `unable to get local issuer certificate`.

1. Exporter les certificats racines Windows vers un bundle PEM (ex. `%USERPROFILE%\corp-ca-bundle.pem`).
2. Avant chaque `npm install` : `$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\corp-ca-bundle.pem"`

⚠️ Variable **session-scopée**, à redéfinir à chaque shell. `build`, `dev` et `pac code push` n'en ont
**pas** besoin — seulement les installs.

## 4. Activer les Code Apps dans l'environnement — ⚠️ MANUEL

Pas de CLI. **Power Platform Admin Center** → l'environnement → **Settings** → **Product** →
**Features** → activer **« Power Apps code apps »** → Save. Sans ça, `pac code push` échoue avec
`HTTP 403 CodeAppOperationNotAllowedInEnvironment`.

→ Guider l'utilisateur vers cet écran et **attendre confirmation** avant de continuer.

> Licence : les utilisateurs finaux d'une Code App ont besoin d'une licence **Power Apps Premium**.

## 5. Authentifier pac et sélectionner l'environnement

```powershell
pac auth create --environment "<url-dynamics>"   # --deviceCode en shell non-interactif
pac env select --environment "<url-ou-id>"
pac org who                                       # confirme l'org active
```

> Un **Service Principal ne peut pas créer ni posséder** une Code App — utiliser un compte utilisateur
> pour la création.

## 6. Connexions aux connecteurs

Pour les connecteurs (Teams, Office 365, SharePoint…), une **connexion** est nécessaire. La créer dans
le **maker portal** (make.powerapps.com → Connexions) ou via le **CLI** (preview), puis récupérer
`apiName` + `connectionId` (`pac connection list`). Le câblage effectif dans l'app se fait ensuite avec
`/pp-data` (`pac code add-data-source`). Dataverse ne nécessite **pas** de connexion.

## Renseigner le CLAUDE.md du projet

À l'issue du setup, remplir la section Power Platform du `CLAUDE.md` (environnement, solution, dossier
app, certificat, sources). Gabarit : `../../references/claude-md-template.md` (racine du plugin).

## Suite

Poste prêt → `/pp-scaffold` pour créer la Code App, puis `/pp-data` et `/pp-ship`.

## Sortie attendue

Progression étape par étape : pour chaque étape, soit Claude l'exécute et rapporte, soit il guide
l'action manuelle et attend confirmation. À la fin : récap de ce qui est en place + la section
CLAUDE.md proposée.

## En résumé

extensions VS Code → install Node/npm/pac sans admin → fix PATH → fix certificat corporate →
**activer Code Apps (manuel)** → auth pac + select env → connexions → puis `/pp-scaffold`.
