# claude-powerplatform

Plugin Claude Code pour développer des **Power Apps (Code Apps)** dans VS Code : diagnostic du poste
et cycle de publication, avec gestion des pièges classiques (PATH périmé sous Claude Code, certificat
CA corporate, activation des Code Apps, auth pac).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `pp-diag` | `/pp-diag` | Diagnostic : toolchain (node/npm/pac/git), PATH, certificat, auth pac, activation Code Apps |
| `pp-ship` | `/pp-ship` | Publication : recharge le PATH, `npm run build`, `pac code push --solutionName`, traduction des erreurs |

## Configuration par projet

Les skills lisent leur config dans le `CLAUDE.md` du projet Power Apps : environnement cible, nom de
solution, dossier de l'app, certificat, connexions OAuth. Gabarit prêt à coller dans
[skills/pp-diag/references/claude-md-template.md](skills/pp-diag/references/claude-md-template.md).

## Périmètre

**Automatisé** : diagnostic, correctif du PATH (session), build, push, traduction des erreurs pac.

**Hors périmètre** (étapes manuelles, sans CLI) :
- Installation de Node / pac CLI
- Activation des « Power Apps code apps » dans le Power Platform Admin Center
- Création des connexions OAuth (SharePoint, Outlook) dans le maker portal

Ces étapes sont documentées par `pp-diag` quand elles bloquent, mais ne sont pas exécutées par le
plugin.

## Prérequis

- VS Code sous Windows, shell PowerShell
- Node, npm, pac (Power Platform CLI), git installés
- Un environnement Power Platform avec les Code Apps activées
