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

```powershell
cd d:\DevPowerPlatform        # ou ton dossier de travail
npx degit github:microsoft/PowerAppsCodeApps/templates/vite test-codeapp
code d:\DevPowerPlatform\test-codeapp
```

Le template officiel Microsoft donne un SPA Vite/TS avec une `vite.config` conforme et le
`PowerProvider` déjà en place — le point de départ le plus sûr.

## Étape 2 — (Recommandé) créer le fichier PowerPlatform.md

La config du projet vit dans un fichier **`PowerPlatform.md`** à la racine (pas dans le `CLAUDE.md`).
Le crée à la racine du projet en y collant le contenu du gabarit
[references/powerplatform-md-template.md](references/powerplatform-md-template.md), puis remplace les
valeurs d'exemple (environnement, solution, dossier de l'app…) par celles du projet. `/pp-scaffold`
peut aussi le créer pour toi. Sans ce fichier, les skills n'ont aucune valeur à lire (`/pp-diag` le
signalera).

## Étape 3 — Lancer Claude Code dans ce dossier et dérouler les skills

Ouvrir une session Claude Code **dans ce projet**, puis dans l'ordre :

| # | Commande | Ce qui se passe |
|---|---|---|
| 1 | `/pp-diag` | Vérifie extensions, toolchain, auth pac. Corriger les ❌ avant de continuer. |
| 2 | `/pp-setup` (si diag rouge) | Guide sur ce qui manque (auth `pac auth create`, PATH, certificat…). |
| 3 | `/pp-scaffold` | `npm install`, vérifie SDK/PowerProvider, `pac code init --displayName "Test Code App"` → crée `power.config.json`. |
| 4 | `/pp-data` | Branche une source de test, ex. Dataverse : `pac code add-data-source -a dataverse -t account` → génère les services typés. |
| 5 | `/pp-ship` | `npm run build` + `pac code push --solutionName "<TaSolution>"`. |

## Étape 4 — Vérifier

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
