# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**, plus des
hooks transverses. Pensé pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte (limites 5 h/hebdo, choix de modèle). Se déclenche aussi automatiquement sur les sessions de code. |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| `update-plugins` | `/update-plugins` | Met à jour les plugins dev-tools sur le poste (`claude plugin update`). |

Le dossier `skills/` est auto-découvert ; chaque skill a son `SKILL.md` et ses `references/`.

## Hook fenêtre 5 h

`hooks/scripts/eco-window-check.js` (`UserPromptSubmit`) : estimation **locale** qui prévient ~30 min
avant le reset estimé de la fenêtre 5 h (réglable, voir plus bas). La vraie valeur reste `/usage`.
Échec silencieux : n'interrompt jamais un prompt.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`).
2. Ajoute ses fichiers de référence à côté si besoin.
3. Incrémente `version` dans `.claude-plugin/plugin.json`.
4. Commit + push ; les postes mettent à jour via `claude plugin marketplace update dev-tools` puis
   `claude plugin update claude-utils@dev-tools` (ou la skill `/update-plugins`).

Pas besoin de toucher `plugin.json` pour déclarer la skill : le dossier `skills/` est auto-découvert.

## Réglages du hook (variables d'environnement, optionnelles)

| Variable | Rôle | Défaut |
|---|---|---|
| `ECO_WARN_BEFORE_MIN` | Minutes avant le reset où alerter | `30` |
| `ECO_WINDOW_MIN` | Durée de la fenêtre, en minutes | `300` (5 h) |
| `ECO_STATE_FILE` | Chemin du fichier d'état | `~/.claude/eco-window-state.json` |
