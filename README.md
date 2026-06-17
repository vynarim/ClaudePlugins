# ClaudePlugins — marketplace interne `dev-tools`

Dépôt-catalogue de plugins Claude Code. Contient le plugin **`claude-utils`**.

## Skills disponibles

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — limites 5 h et hebdo, choix de modèle |
| `pr-draft` | `/pr-draft` | Génère titre + corps de PR GitHub depuis le diff courant |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet |

Inclut aussi un hook `UserPromptSubmit` qui alerte ~30 min avant le reset estimé de la fenêtre 5 h.

## Installation

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Repo public — aucune authentification requise. Voir [INSTALL.md](INSTALL.md) pour les détails et le dépannage.

## Pour aller plus loin

- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin
