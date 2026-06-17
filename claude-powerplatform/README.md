# claude-powerplatform

Plugin Claude Code pour développer des **Power Apps (Code Apps)** dans VS Code, du scaffold React au
déploiement en solution. Il couvre le parcours complet — créer une maquette React, la relier à
Dataverse et aux connecteurs (Teams, Office 365…), puis déployer en Code App — et gère les pièges
classiques (extensions VS Code, PATH périmé sous Claude Code, certificat CA corporate, activation des
Code Apps, auth pac).

> Statut : les Power Apps Code Apps sont en **preview**. Les commandes `pac code` sont transitoires
> (remplacement progressif par le CLI npm embarqué dans `@microsoft/power-apps`). Le plugin ne fige
> aucune version ; vérifier la doc officielle en cas de doute.

## Skills (dans l'ordre du parcours)

| Skill | Invocation | Rôle |
|---|---|---|
| `pp-setup` | `/pp-setup` | Mise en place du poste : extensions VS Code, toolchain, PATH, certificat, activation Code Apps, auth pac, connexions |
| `pp-scaffold` | `/pp-scaffold` | Maquette React → Code App : SPA Vite/TS, SDK `@microsoft/power-apps`, PowerProvider, `pac code init` |
| `pp-data` | `/pp-data` | Brancher les données : `pac code add-data-source` (Dataverse + connecteurs Teams/O365), services typés générés |
| `pp-diag` | `/pp-diag` | Diagnostic poste + projet : extensions, toolchain, SDK, `power.config.json`, auth, certificat |
| `pp-ship` | `/pp-ship` | Publication : recharge le PATH, `npm run build`, `pac code push --solutionName` |

## Extensions VS Code requises

- **Power Platform Tools** (`microsoft-IsvExpTools.powerplatform-vscode`) — embarque le `pac` CLI.
- **Claude Code for VS Code** (`anthropic.claude-code`, identifiant présumé — à confirmer sur le poste).

`pp-setup` et `pp-diag` vérifient leur présence via `code --list-extensions`.

## Configuration par projet

Les skills lisent leur config dans le `CLAUDE.md` du projet (environnement, solution, dossier de
l'app, certificat, sources de données). Gabarit partagé prêt à coller :
[references/claude-md-template.md](references/claude-md-template.md).

## Périmètre

**Automatisé** : vérif extensions, diagnostic, fix PATH (session), scaffold du projet, `pac code init`,
`pac code add-data-source`, build, `pac code push`, traduction des erreurs.

**Manuel mais guidé** (étapes sans CLI fiable, le plugin guide et attend confirmation) :
- Installation de Node / pac (ZIP/winget sans droits admin)
- Activation des « Power Apps code apps » dans le Power Platform Admin Center
- Création des connexions aux connecteurs (maker portal — ou CLI en preview)

## Prérequis

- VS Code sous Windows, shell PowerShell
- Node.js LTS, pac (Power Platform CLI ≥ 1.46 pour Dataverse), git
- Un environnement Power Platform avec les Code Apps activées
- Licence **Power Apps Premium** pour les utilisateurs finaux de l'app
