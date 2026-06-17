# claude-powerplatform

Plugin Claude Code pour développer des **Power Apps (Code Apps)** dans VS Code : diagnostic du poste
et cycle de publication, avec gestion des pièges classiques (PATH périmé sous Claude Code, certificat
CA corporate, activation des Code Apps, auth pac).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `pp-setup` | `/pp-setup` | Mise en place d'un poste de zéro : toolchain, PATH, certificat, activation Code Apps, auth pac, connexions OAuth |
| `pp-diag` | `/pp-diag` | Diagnostic : toolchain (node/npm/pac/git), PATH, certificat, auth pac, activation Code Apps |
| `pp-ship` | `/pp-ship` | Publication : recharge le PATH, `npm run build`, `pac code push --solutionName`, traduction des erreurs |

## Configuration par projet

Les skills lisent leur config dans le `CLAUDE.md` du projet Power Apps : environnement cible, nom de
solution, dossier de l'app, certificat, connexions OAuth. Gabarit prêt à coller dans
[skills/pp-diag/references/claude-md-template.md](skills/pp-diag/references/claude-md-template.md).

## Périmètre

**Automatisé** : diagnostic, correctif du PATH (session), build, push, traduction des erreurs pac.

**Manuel mais guidé** (étapes sans CLI, `pp-setup` guide pas-à-pas et attend confirmation) :
- Installation de Node / pac CLI (ZIP/winget sans droits admin)
- Activation des « Power Apps code apps » dans le Power Platform Admin Center
- Création des connexions OAuth (SharePoint, Outlook) dans le maker portal

Ces étapes ne sont pas exécutées par le plugin, mais `pp-setup` les détaille et `pp-diag` les
signale quand elles bloquent.

## Prérequis

- VS Code sous Windows, shell PowerShell
- Node, npm, pac (Power Platform CLI), git installés
- Un environnement Power Platform avec les Code Apps activées
