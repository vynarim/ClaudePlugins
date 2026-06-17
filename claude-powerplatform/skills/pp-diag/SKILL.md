---
name: pp-diag
description: >-
  Diagnostic d'un poste et d'un projet pour le développement Power Apps (Code Apps) avec Claude Code
  dans VS Code : vérifie les extensions VS Code requises (Power Platform Tools, Claude Code), la
  toolchain (node, npm, pac, git) dans le PATH, le SDK @microsoft/power-apps et power.config.json côté
  projet, l'authentification pac sur le bon environnement, le certificat CA corporate, et signale les
  causes des erreurs courantes. À utiliser quand l'utilisateur veut savoir si sa machine/son projet
  est prêt pour Power Platform, quand une commande pac/build échoue, ou avant un pac code push.
  Déclenche sur : « pp-diag », « diagnostic power platform », « ma machine est prête pour pac ? »,
  « pac ne marche pas », « pourquoi pac code push échoue », « vérifie ma config power apps ».
---

# pp-diag — Diagnostic poste + projet Power Platform (Code Apps)

Objectif : vérifier en quelques commandes que le poste **et** le projet sont opérationnels pour
développer et publier une Power App Code App, et pointer la cause exacte quand quelque chose cloche.

Contexte : VS Code sous Windows, shell **PowerShell**.

## Lire la config du projet

Lire la section Power Platform du `CLAUDE.md` (gabarit : `../../references/claude-md-template.md`,
racine du plugin) : environnement attendu, solution, dossier de l'app, certificat, sources de données.
Si absente, le signaler : le diagnostic reste possible mais sans valeurs attendues à confronter.

## Les vérifications

### 0. Extensions VS Code

```powershell
code --list-extensions | Select-String -Pattern "powerplatform-vscode|claude-code"
```

- **`microsoft-IsvExpTools.powerplatform-vscode`** (Power Platform Tools) — fournit et embarque `pac`
  dans le terminal VS Code. **Requis.**
- **`anthropic.claude-code`** (Claude Code for VS Code) — **requis.**

Si `code` n'est pas reconnu : la commande CLI VS Code n'est pas dans le PATH (Command Palette →
« Shell Command: Install 'code' command in PATH »).

### 1. Toolchain dans le PATH

```powershell
node --version; npm --version; pac --version; git --version
```

Références connues OK : Node LTS (≥ 18/20), pac ≥ 2.8 (≥ 1.46 minimum pour Dataverse). Si une commande
n'est pas reconnue → vérif 2 avant de conclure à une absence d'install.

### 2. Quirk du PATH (cause n°1 des faux négatifs)

Les outils ajoutés au PATH **après** le lancement de Claude Code ne sont pas visibles (environnement
figé au démarrage). Recharger dans la session :

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Puis refaire la vérif 1. Si les outils apparaissent, c'était bien le PATH périmé.

### 3. Projet : SDK et marqueur Code App

Dans le dossier de l'app :

```powershell
Test-Path power.config.json                          # le dossier est-il une Code App ?
npm ls @microsoft/power-apps 2>$null                 # le SDK est-il installé ?
```

- `power.config.json` absent → projet non initialisé (`pac code init`, voir `/pp-scaffold`).
- SDK absent → `npm install @microsoft/power-apps` (voir `/pp-scaffold`).

### 4. Certificat CA corporate

Sur réseau à interception TLS, les `npm install` à build natif échouent sur `unable to get local
issuer certificate`. Si le `CLAUDE.md` indique un certificat :

```powershell
Test-Path $env:NODE_EXTRA_CA_CERTS
```

Si vide/faux, le re-pointer (session-scopée) : `$env:NODE_EXTRA_CA_CERTS = "<chemin .pem>"`. Inutile
pour `build`/`dev`/`push` — uniquement pour les installs.

### 5. Authentification pac sur le bon environnement

```powershell
pac auth list
pac org who
```

`pac org who` doit pointer l'URL attendue (celle du `CLAUDE.md`). Sinon :

```powershell
pac auth create --environment "<url-dynamics>"   # --deviceCode si shell non-interactif
pac env select --environment "<url-ou-id>"
```

### 6. Activation des Code Apps côté environnement

Non vérifiable en CLI (réglage web). Symptôme d'activation manquante au push :
`HTTP 403 CodeAppOperationNotAllowedInEnvironment`. Renvoyer vers Admin Center → environnement →
Settings → Product → Features → « Power Apps code apps » (voir `/pp-setup`).

## Sortie attendue

```
## Diagnostic Power Platform — <projet>

- [✅/❌] Extensions VS Code : Power Platform Tools, Claude Code
- [✅/❌] Toolchain : node <v>, npm <v>, pac <v>, git <v>
- [✅/❌] PATH : outils visibles (sinon : PATH rechargé → refaire)
- [✅/❌] Projet : power.config.json présent, @microsoft/power-apps installé
- [✅/❌] Certificat CA : <chemin> présent et pointé (ou « non requis »)
- [✅/❌] Auth pac : connecté à <url> (attendu : <url>)
- [ℹ️]   Code Apps activées : non vérifiable en CLI (symptôme = HTTP 403 au push)

### Verdict
<Prêt / Action requise : … (commande exacte pour chaque ❌)>
```
