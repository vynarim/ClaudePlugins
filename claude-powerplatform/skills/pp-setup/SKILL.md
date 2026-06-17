---
name: pp-setup
description: >-
  Guide d'installation et de configuration complet d'un poste VS Code pour développer des Power Apps
  (Code Apps) avec Claude Code, de zéro à un premier pac code push : toolchain (Node/npm/pac), quirk
  du PATH, certificat CA corporate, activation des Code Apps dans l'Admin Center, auth pac, connexions
  OAuth. Exécute les étapes automatisables et guide pas-à-pas les étapes manuelles (web UI, maker
  portal). À utiliser pour préparer une machine, onboarder un développeur, ou débloquer une étape de
  setup. Déclenche sur : « pp-setup », « configure mon poste pour power platform », « installe la
  toolchain power apps », « comment activer les code apps », « setup pac de zéro », « onboarding
  power platform », « première mise en place power apps ».
---

# pp-setup — Mettre en place un poste Power Platform (Code Apps) de zéro

Objectif : amener une machine VS Code de rien à un premier `pac code push` réussi. Certaines étapes
sont automatisables (Claude les exécute), d'autres sont strictement manuelles (web UI, maker portal) —
Claude les guide alors pas-à-pas et attend la confirmation avant de continuer.

Contexte : VS Code sous Windows, shell **PowerShell**, souvent sans droits admin et derrière un proxy
d'entreprise à interception TLS.

> Cette skill prépare le terrain ; une fois en place, le cycle quotidien passe par `/pp-ship`
> (publier) et `/pp-diag` (diagnostiquer). La config par projet va dans le `CLAUDE.md` — voir
> `references/claude-md-template.md`.

## Vue d'ensemble (l'ordre compte)

```
1. Toolchain (Node/npm/pac/git)   → installable, partiellement manuel (ZIP/winget)
2. Quirk du PATH                   → automatisable (correctif session)
3. Certificat CA corporate         → semi-auto (export Windows → bundle PEM)
4. Activer les Code Apps           → MANUEL (Admin Center, web UI)
5. Auth pac sur l'environnement    → automatisable
6. Connexions OAuth                → MANUEL (maker portal)
7. Premier build + push            → automatisable (= /pp-ship)
```

Avant de commencer, lancer `/pp-diag` : il dit déjà quelles étapes sont OK et lesquelles manquent.
Inutile de tout refaire — n'attaquer que les étapes ❌.

## 1. Installer la toolchain

`git` est souvent déjà présent. Pour le reste, **sans droits admin** :

- **Node.js** — si l'install winget MSI échoue (la fenêtre UAC d'élévation ne peut pas être validée
  en shell non-interactif), contourner en téléchargeant le **ZIP officiel**, l'extraire dans le profil
  utilisateur (ex. `%LOCALAPPDATA%\nodejs`) et l'ajouter au **PATH utilisateur** (sans droits admin).
- **npm** vient avec Node.
- **pac (Power Platform CLI)** — via `winget install Microsoft.PowerAppsCLI` (un bootstrapper), puis
  `pac install latest`. S'installe sous `%LOCALAPPDATA%\Microsoft\PowerAppsCLI`.

Vérifier (après l'étape 2 si une commande n'est pas reconnue) :

```powershell
node --version; npm --version; pac --version; git --version
```

## 2. Régler le quirk du PATH

Les outils ajoutés au PATH **après** le lancement de Claude Code ne sont pas visibles : les appels
PowerShell héritent d'un environnement figé. Recharger dans la session courante :

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Un terminal ouvert frais (hors Claude Code) voit les outils automatiquement. À refaire à chaque
session Claude Code tant que c'est nécessaire.

## 3. Régler le certificat SSL corporate

Sur un réseau à interception TLS, le proxy présente une racine CA que Node ne connaît pas → les
`npm install` de paquets à build natif (ex. `keytar`, tiré par `@microsoft/power-apps`) échouent sur
`unable to get local issuer certificate`.

1. Exporter les certificats racines Windows vers un bundle PEM (ex. `%USERPROFILE%\corp-ca-bundle.pem`).
2. Avant chaque `npm install`, pointer Node dessus :

```powershell
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\corp-ca-bundle.pem"
```

⚠️ Variable **session-scopée** (le classifieur d'auto-approbation peut bloquer la persistance en
variable User) → à redéfinir à chaque nouveau shell. `npm run build`, `npm run dev` et `pac code push`
n'en ont **pas** besoin — seulement les installs de dépendances.

## 4. Activer les Code Apps dans l'environnement — ⚠️ MANUEL

Pas de CLI pour ça. Dans **Power Platform Admin Center** → l'environnement cible → **Settings** →
**Product** → **Features** → activer **« Power Apps code apps »**.

Sans cette activation, `pac code push` échoue avec `HTTP 403 CodeAppOperationNotAllowedInEnvironment`.

→ Guider l'utilisateur vers cet écran et **attendre sa confirmation** que c'est activé avant de
continuer.

## 5. Authentifier pac sur l'environnement

Connecter pac à l'environnement cible (URL Dynamics du `CLAUDE.md`, ex.
`https://orgXXXX.crm.dynamics.com/`) :

```powershell
pac auth create --environment "<url-dynamics>"
pac org who   # confirme l'environnement actif
```

## 6. Les connexions OAuth — ⚠️ MANUEL

Les connexions aux data sources (SharePoint `shared_sharepointonline`, Outlook `shared_office365`…)
**ne se créent pas en CLI** (OAuth interactif). À faire une fois dans le **maker portal**, puis
récupérer leurs **IDs de connexion** pour les câbler dans le code de l'app.

→ Guider l'utilisateur vers le maker portal, puis reporter les IDs obtenus dans la section Power
Platform du `CLAUDE.md` (gabarit dans `references/claude-md-template.md`).

## 7. Premier build + push

Une fois tout en place, le cycle de publication (identique à `/pp-ship`) :

```powershell
# PATH (étape 2) déjà rechargé dans la session
npm run build
pac code push --solutionName "<NomDeLaSolution>"
```

## Renseigner le CLAUDE.md du projet

À l'issue du setup, remplir la section Power Platform du `CLAUDE.md` (environnement, solution, dossier
de l'app, certificat, IDs de connexion) pour que `/pp-diag` et `/pp-ship` fonctionnent sans
re-demander. Gabarit : `references/claude-md-template.md`.

## Sortie attendue

Une progression étape par étape : pour chaque étape, soit Claude l'exécute et rapporte le résultat,
soit il guide l'action manuelle et attend confirmation. À la fin : récapitulatif de ce qui est en
place, et la section CLAUDE.md proposée à coller.

## En résumé

install Node/npm/pac sans admin → fix PATH → fix certificat corporate → **activer Code Apps côté
environnement (manuel)** → auth pac → **connexions OAuth manuelles (maker portal)** → build + push.
