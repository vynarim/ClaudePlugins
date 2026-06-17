# ClaudePlugins

Marketplace interne `dev-tools` — catalogue de plugins Claude Code.

Ce dépôt héberge plusieurs plugins Claude Code :

| Plugin | Pour quoi faire |
|---|---|
| [`claude-utils`](claude-utils/) | Boîte à outils générique : efficacité tokens, PR GitHub, reprise de session |
| [`claude-powerplatform`](claude-powerplatform/) | Développer des Power Apps (Code Apps) dans VS Code |

## Plugin `claude-utils`

### Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — limites 5 h et hebdo, choix de modèle, routines de session |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet |

### Hook

Un hook `UserPromptSubmit` estime l'âge de la fenêtre 5 h glissante et affiche une alerte ~30 min
avant le reset, pour finir ou borner la tâche à temps.

## Plugin `claude-powerplatform`

### Skills

Couvre le parcours complet : scaffold React → Dataverse/connecteurs → déploiement en Code App.

| Skill | Invocation | Rôle |
|---|---|---|
| `pp-setup` | `/pp-setup` | Mise en place du poste : extensions VS Code, toolchain, certificat, activation Code Apps, auth |
| `pp-scaffold` | `/pp-scaffold` | Maquette React → Code App : Vite/TS, SDK, PowerProvider, `pac code init` |
| `pp-data` | `/pp-data` | Brancher Dataverse et les connecteurs (Teams, O365) via `pac code add-data-source` |
| `pp-diag` | `/pp-diag` | Diagnostic poste + projet : extensions, toolchain, SDK, auth, certificat |
| `pp-ship` | `/pp-ship` | Publication : `npm run build` + `pac code push --solutionName` |

La config par projet (environnement, solution, certificat, sources) est lue dans le `CLAUDE.md` du
projet. Détails dans [claude-powerplatform/README.md](claude-powerplatform/README.md).

## Installation rapide

Repo public — aucune authentification requise.

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
claude plugin install claude-powerplatform@dev-tools
```

Installe seulement les plugins voulus. Les projets configurés (qui déclarent la marketplace dans leur
`.claude/settings.json`) proposent l'installation automatiquement au moment du trust du dossier.

## Documentation

- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin générique
- [claude-powerplatform/README.md](claude-powerplatform/README.md) — détails du plugin Power Platform
