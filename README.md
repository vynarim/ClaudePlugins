# ClaudePlugins

> 📖 **[Tutoriel : Claude Code + VS Code (PWA → Firebase)](https://vynarim.github.io/ClaudePlugins/)** — l'essentiel en ~30 min, du démarrage du PC jusqu'au déploiement, avec une section « Consommation » qui complète le skill `eco`.

Marketplace interne `dev-tools` — catalogue de plugins Claude Code.

Ce dépôt héberge les plugins suivants :

| Plugin | Version | Pour quoi faire |
|---|---|---|
| [`claude-utils`](claude-utils/) | 2.8.1 | Boîte à outils générique : efficacité tokens, revue de code par axes, non-régression locale et distante, documentation (fond et forme), audit du `CLAUDE.md`, alignement d'un socle partagé, ménage des permissions, commit/push, mise en production, PR GitHub, reprise et clôture de session, mise à jour des plugins |

## Plugin `claude-utils`

Boîte à outils générique, disponible dans tous tes projets une fois installée.
Pour l'installer sur un poste neuf et prendre en main les skills, suivre le
[QUICKSTART](claude-utils/QUICKSTART.md).

### Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte — une session = un objectif, `/clear` aux bascules, délégation aux sous-agents |
| `audit` | `/audit` | Revue de code par axes (sécurité, données, métier, perf, propreté, config) : demande l'axe, classe par gravité, déclare sa couverture et tient un journal ; `/audit regression` rejoue les correctifs passés ; spécificités du dépôt dans `.claude/audit-notes.md` |
| `test` | `/test` | Batterie de non-régression : tableau ✅/❌ par étape, et ce que la batterie n'a **pas** éprouvé ; étapes déclarées dans `.claude/test-notes.md`. Ne committe rien, ne touche jamais la prod |
| `ci` | `/ci` | Garde-fou distant, pendant de `/test` : un workflow GitHub Actions qui rejoue la batterie à la poussée. N'écrit une étape que si son script existe réellement, ne déploie rien, et distingue le voyant du garde-fou (un check non exigé n'empêche aucune poussée) |
| `doc` | `/doc` | Réaligne le README sur le dépôt, en deux axes : **fond** (écarts classés `périmé` / `absent` / `inventé`, structure préservée) et **forme** (`/doc forme` : ordre de lecture, aération, mermaid, encarts) ; carte des sources dans `.claude/doc-notes.md` |
| `context-check` | `/context-check` | Audite le `CLAUDE.md` du projet et propose la version condensée |
| `kit-sync` | `/kit-sync` | Compare un socle partagé entre projets frères : divergence mesurée fichier par fichier, classée progrès / adaptation légitime / dérive, propagation proposée jamais appliquée en silence ; `.claude/kit-notes.md` + journal `kit-log.md` |
| `perms` | `/perms` | Ménage des listes de permissions (poste et projet) : entrées ombrées par un motif plus large, entrées périmées (chemins de scratchpad, versions figées), gestes destructeurs en `allow` proposés en `ask` — jamais en `deny`. Arbitrages conservés dans `.claude/perms-notes.md` |
| `ship` | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique ; bumpe la version si `.claude/deploy-notes.md` le lui demande |
| `deploy` | `/deploy` | Mise en production : bump, vérifications, envoi via `ship`, déploiement cible par cible, vérification en ligne. Cibles déclarées dans `.claude/deploy-notes.md` |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet |
| `handoff` | `/handoff` | Trace d'état de fin de session — état courant, trois points de reprise, dettes et fausses pistes, état git — écrite dans le fichier que le projet utilise déjà, et relue par `session-brief` |
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

⚠️ Scope `user` **ou** scope `project`, pas les deux. Si tu as déjà lancé les deux commandes ci-dessus
(scope poste), déclarer en plus le plugin dans le `.claude/settings.json` d'un projet crée une seconde
installation et le fait apparaître **en double** dans `/plugin`. Le gabarit sert aux dépôts partagés,
où il propose l'install à ceux qui ne l'ont pas — voir
[DEPLOYMENT.md](DEPLOYMENT.md#activer-des-plugins-dans-un-projet).

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
| `<plugin>/skills/<nom>/references/` | Annexes d'une skill : gabarits de notes projet, checklists d'axes |
| `examples/` | Gabarit de `.claude/settings.json` à copier dans un projet |
| `docs/` | Source du tutoriel publié sur GitHub Pages |
| `.claude/skills/` | Skills **internes** au repo (`skill-new`, `plugin-check`), non publiées |

## Documentation

- [**Tutoriel HTML**](https://vynarim.github.io/ClaudePlugins/) — prise en main Claude Code + VS Code, construction d'un site puis d'une PWA, déploiement Firebase, et bonnes pratiques de consommation de tokens
- [INSTALL.md](INSTALL.md) — installer, vérifier, mettre à jour, dépanner
- [DEPLOYMENT.md](DEPLOYMENT.md) — ajouter une skill, publier une version, activer dans un projet
- [claude-utils/README.md](claude-utils/README.md) — détails du plugin générique
