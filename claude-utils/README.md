# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**. Pensé
pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

> Installer sur un poste neuf et prendre en main les skills : [QUICKSTART.md](QUICKSTART.md).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte : une session = un objectif, `/clear` aux bascules, ciblage des lectures. |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| `update-plugins` | `/update-plugins` | Met à jour les plugins dev-tools sur le poste (`claude plugin update`). |

Le dossier `skills/` est auto-découvert ; chaque skill a son `SKILL.md` et ses `references/`.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`).
2. Ajoute ses fichiers de référence à côté si besoin.
3. Incrémente `version` dans `.claude-plugin/plugin.json`.
4. Commit + push ; les postes mettent à jour via `claude plugin marketplace update dev-tools` puis
   `claude plugin update claude-utils@dev-tools` (ou la skill `/update-plugins`).

Pas besoin de toucher `plugin.json` pour déclarer la skill : le dossier `skills/` est auto-découvert.

## Historique

- **2.0.0** — suppression du hook `eco-window-check.js` (estimation locale de la fenêtre 5 h),
  remplacé par l'extension VS Code *Claude Code Usage* et la commande `/usage`, qui lisent l'usage
  réel au lieu de l'estimer. Le plugin n'exécute plus de code.
