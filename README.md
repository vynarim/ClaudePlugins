# ClaudePlugins

> 📖 **[Tutoriel : Claude Code + VS Code (PWA → Firebase)](https://vynarim.github.io/ClaudePlugins/)** — l'essentiel en ~30 min, du démarrage du PC jusqu'au déploiement, avec une section « Consommation » qui complète le skill `eco`.

Marketplace interne `dev-tools` — catalogue de plugins Claude Code.

Ce dépôt héberge les plugins suivants :

| Plugin | Version | Pour quoi faire |
|---|---|---|
| [`claude-utils`](claude-utils/) | 2.3.0 | Boîte à outils générique : efficacité tokens, revue de code par axes, commit/push, PR GitHub, reprise de session, mise à jour des plugins |

## Plugin `claude-utils`

Boîte à outils générique, disponible dans tous tes projets une fois installée.
Pour l'installer sur un poste neuf et prendre en main les skills, suivre le
[QUICKSTART](claude-utils/QUICKSTART.md).

### Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — une session = un objectif, `/clear` aux bascules, délégation aux sous-agents |
| `audit` | `/audit` | Revue de code par axes (sécurité, données, métier, perf, propreté, config) : demande l'axe, classe par gravité, déclare sa couverture et tient un journal ; spécificités du dépôt dans `.claude/audit-notes.md` |
| `context-check` | `/context-check` | Audite le `CLAUDE.md` du projet et propose la version condensée |
| `ship` | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique |
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
l'installation automatiquement au moment du trust du dossier. Gabarit à copier :
[`examples/project.claude-settings.json`](examples/project.claude-settings.json).

Pour que les nouvelles versions arrivent seules, ajoute `"autoUpdate": true` à l'entrée `dev-tools`
de ton `~/.claude/settings.json` — l'option n'est pas exposée par le CLI, voir
[INSTALL.md](INSTALL.md#automatiser--loption-autoupdate). Sinon, `/update-plugins` fait le travail à
la demande.

Les plugins de ce repo **n'exécutent aucun code** (pas de hook, pas de serveur MCP) : ils n'apportent
que des skills.

## Structure du repo

| Chemin | Rôle |
|---|---|
| `.claude-plugin/marketplace.json` | Catalogue `dev-tools` — déclare les plugins publiés |
| `<plugin>/.claude-plugin/plugin.json` | Manifeste d'un plugin (`version` à bumper pour publier) |
| `<plugin>/skills/<nom>/SKILL.md` | Une skill (dossier `skills/` auto-découvert) |
| `examples/` | Gabarit de `.claude/settings.json` à copier dans un projet |
| `docs/` | Source du tutoriel publié sur GitHub Pages |
| `.claude/skills/` | Skills **internes** au repo (`skill-new`), non publiées |

## Documentation

- [**Tutoriel HTML**](https://vynarim.github.io/ClaudePlugins/) — prise en main Claude Code + VS Code, construction d'un site puis d'une PWA, déploiement Firebase, et bonnes pratiques de consommation de tokens
- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin générique
