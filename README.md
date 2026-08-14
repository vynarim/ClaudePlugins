# ClaudePlugins

> 📖 **[Tutoriel : Claude Code + VS Code (PWA → Firebase)](https://vynarim.github.io/ClaudePlugins/)** — l'essentiel en ~30 min, du démarrage du PC jusqu'au déploiement, avec une section « Consommation » qui complète le skill `eco`.

Marketplace interne `dev-tools` — catalogue de plugins Claude Code.

Ce dépôt héberge les plugins suivants :

| Plugin | Pour quoi faire |
|---|---|
| [`claude-utils`](claude-utils/) | Boîte à outils générique : efficacité tokens, PR GitHub, reprise de session |

## Plugin `claude-utils`

Boîte à outils générique, disponible dans tous tes projets une fois installée.
Pour l'installer sur un poste neuf et prendre en main les skills, suivre le
[QUICKSTART](claude-utils/QUICKSTART.md).

### Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — une session = un objectif, `/clear` aux bascules, ciblage des lectures |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet |
| `update-plugins` | `/update-plugins` | Met à jour les plugins dev-tools sur le poste (`claude plugin update`) |

## Installation rapide

Repo public — aucune authentification requise.

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Les projets configurés (qui déclarent la marketplace dans leur `.claude/settings.json`) proposent
l'installation automatiquement au moment du trust du dossier.

## Documentation

- [**Tutoriel HTML**](https://vynarim.github.io/ClaudePlugins/) — prise en main Claude Code + VS Code, construction d'un site puis d'une PWA, déploiement Firebase, et bonnes pratiques de consommation de tokens
- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin générique
