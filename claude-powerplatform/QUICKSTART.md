# QUICKSTART — créer une Code App de zéro

Guide pas-à-pas pour créer une Power App (Code App) de zéro avec le plugin `claude-powerplatform`,
du dossier vide au déploiement dans une solution. Sert aussi à tester le plugin de bout en bout.

> Contexte : VS Code sous Windows, shell PowerShell. Les Code Apps sont en **preview**.

## Étape 0 — Une seule fois (prérequis hors plugin)

```powershell
# 1. Installer le plugin (si pas déjà fait)
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-powerplatform@dev-tools

# 2. Installer les 2 extensions VS Code
code --install-extension microsoft-IsvExpTools.powerplatform-vscode
code --install-extension anthropic.claude-code
```

Puis recharger VS Code (`Ctrl+Shift+P` → *Developer: Reload Window*).

**Activer les Code Apps sur l'environnement** (manuel, indispensable) : Power Platform Admin Center →
l'environnement → Settings → Product → Features → **« Power Apps code apps »** → activer → Save.
Sans ça, le push final échoue en `HTTP 403 CodeAppOperationNotAllowedInEnvironment`.

**À avoir sous la main** : l'URL de l'environnement (`https://orgXXXX.crm.dynamics.com/`) et le nom
d'une solution non managée (ou en créer une dans le maker portal). Les utilisateurs finaux d'une Code
App ont besoin d'une licence **Power Apps Premium**.

## Étape 1 — Créer le dossier projet et l'ouvrir

Lance ces commandes **dans le terminal intégré d'une nouvelle fenêtre VS Code** (menu *Terminal →
Nouveau terminal*, profil **PowerShell**). C'est important : le terminal VS Code hérite du PATH à jour
(notamment `pac`, fourni par l'extension Power Platform Tools), contrairement à un terminal ouvert
avant l'installation des outils.

```powershell
cd d:\DevPowerPlatform        # ou ton dossier de travail
npx degit github:microsoft/PowerAppsCodeApps/templates/vite test-codeapp
code d:\DevPowerPlatform\test-codeapp
```

> Si `code` n'ouvre rien (« code n'est pas reconnu… »), c'est que le CLI VS Code n'est pas dans le
> PATH. Deux options : **Fichier → Ouvrir le dossier** depuis VS Code, ou installer le CLI via
> `Ctrl+Shift+P` → **« Shell Command: Install 'code' command in PATH »** puis relancer la commande.

À l'ouverture, **fais confiance au dossier** et accepte l'installation du plugin si elle est proposée,
puis recharge la fenêtre (*Developer: Reload Window*).

Le template officiel Microsoft donne un SPA Vite/TS avec une `vite.config` conforme et le
`PowerProvider` déjà en place — le point de départ le plus sûr.

## Étape 2 — Lancer Claude Code dans ce dossier et dérouler les skills

La config du projet vivra dans un fichier **`PowerPlatform.md`** à la racine (pas dans le `CLAUDE.md`).
Tu n'as pas à le créer à la main : **`/pp-scaffold` le crée** avec des valeurs d'exemple commentées,
puis te demande d'aller le remplir avant de continuer.

Ouvrir une session Claude Code **dans ce projet**, puis dans l'ordre :

| # | Commande | Ce qui se passe |
|---|---|---|
| 1 | `/pp-diag` | Vérifie extensions, toolchain, auth pac. Corriger les ❌ avant de continuer. |
| 2 | `/pp-setup` (si diag rouge) | Guide sur ce qui manque (auth `pac auth create`, PATH, certificat…). |
| 3 | `/pp-scaffold` | Crée **`PowerPlatform.md`** (tu le remplis : env, solution…) et un `.claude/settings.json` (allow-list diag), `npm install`, vérifie SDK/PowerProvider, `pac code init` → `power.config.json`. |
| 4 | `/pp-data` | Branche une source de test, ex. Dataverse : `pac code add-data-source -a dataverse -t account` → génère les services typés. |
| 5 | `/pp-ship` | `npm run build` + `pac code push --solutionName "<TaSolution>"`. |

> `/pp-scaffold` ajoute une **allow-list** des commandes de diagnostic en lecture seule dans
> `.claude/settings.json`, pour que `/pp-diag` tourne **sans demande d'autorisation**. Les commandes
> qui modifient (install, init, push) demandent toujours confirmation. Exemple complet (marketplace +
> plugins + allow-list) : [examples/powerplatform.claude-settings.json](../examples/powerplatform.claude-settings.json).

## Étape 3 — Vérifier

- **En local** : `npm run dev` (port 3000) — l'app tourne avec le SDK.
  Gotcha (déc. 2025) : Chrome/Edge peuvent bloquer public→localhost ; autoriser l'accès réseau local
  si besoin.
- **Après le push** : `pac code push` renvoie une **URL Power Apps** ; l'ouvrir pour voir l'app
  déployée dans l'environnement.

## Dépannage rapide

- `pac` non reconnu → PATH périmé : relancer `/pp-diag` (recharge le PATH dans la session).
- `HTTP 403 CodeAppOperationNotAllowedInEnvironment` → Code Apps non activées (étape 0).
- `power.config.json` introuvable au push → projet non initialisé : refaire `/pp-scaffold`.
- `unable to get local issuer certificate` pendant `npm install` → certificat CA non pointé (`/pp-setup`).
