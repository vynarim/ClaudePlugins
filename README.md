# ClaudePlugins — marketplace interne `dev-tools`

Dépôt-catalogue de plugins Claude Code. Contient le plugin **`claude-utils`** : une boîte à outils
de skills génériques pour travailler efficacement avec Claude Code dans VS Code et GitHub.

## Skills disponibles

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — limites 5 h et hebdo, choix de modèle, routines de session |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet |

Le plugin embarque aussi un hook `UserPromptSubmit` qui estime l'âge de la fenêtre 5 h glissante
et affiche une alerte ~30 min avant le reset, pour finir ou borner la tâche à temps.

## Installation rapide

Repo public — aucune authentification requise.

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Les projets configurés (qui déclarent la marketplace dans leur `.claude/settings.json`) proposent
l'installation automatiquement au moment du trust du dossier.

## Documentation

- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin et de ses composants
