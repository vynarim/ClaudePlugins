# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**. Pensé
pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

> Installer sur un poste neuf et prendre en main les skills : [QUICKSTART.md](QUICKSTART.md).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte : une session = un objectif, `/clear` aux bascules, délégation aux sous-agents. |
| `context-check` | `/context-check` | Audite le `CLAUDE.md` du projet (longueur, sections à déporter) et propose la version condensée. |
| `ship` | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique du projet. |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| `update-plugins` | `/update-plugins` | Met à jour les plugins dev-tools sur le poste (`claude plugin update`). |

Le dossier `skills/` est auto-découvert ; chaque skill a son `SKILL.md` et, si besoin, ses fichiers
annexes dans `skills/<nom>/references/`.

## Prérequis et dépannage

- **Prérequis** : Claude Code installé. Rien d'autre — le plugin n'exécute aucun code (pas de hook,
  pas de serveur MCP, pas de variable d'environnement à régler), il n'apporte que des skills.
- **Une skill n'apparaît pas** après installation ou mise à jour : recharge la fenêtre VS Code
  (*Developer: Reload Window*) ou `/reload-plugins` — les plugins sont chargés à l'ouverture.
- **Une skill manque alors que le plugin est listé** : elle a probablement été ajoutée dans une
  version plus récente → `/update-plugins`, ou voir [INSTALL.md](../INSTALL.md#mettre-à-jour).
- `/pr-draft` et `/session-brief` interrogent GitHub via `gh pr list`. Sans
  [GitHub CLI](https://cli.github.com/) authentifié (`gh auth status`), seules ces étapes échouent :
  la partie git locale (diff, statut, commits) fonctionne quand même.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`).
2. Ajoute ses fichiers de référence à côté si besoin.
3. Incrémente `version` dans `.claude-plugin/plugin.json`.
4. Commit + push ; les postes mettent à jour via `claude plugin marketplace update dev-tools` puis
   `claude plugin update claude-utils@dev-tools` (ou la skill `/update-plugins`). Ceux qui ont activé
   `autoUpdate` sur la marketplace n'ont rien à lancer — voir
   [INSTALL.md](../INSTALL.md#automatiser--loption-autoupdate).

Pas besoin de toucher `plugin.json` pour déclarer la skill : le dossier `skills/` est auto-découvert.

## Historique

- **2.1.0** — deux skills en plus : `ship` (commit + push, disponible sur tous les repos) et
  `context-check` (audit du `CLAUDE.md`). `eco` couvre en plus la délégation aux sous-agents, le mode
  plan, `/rewind` et la mémoire persistante.
- **2.0.0** — suppression du hook `eco-window-check.js` (estimation locale de la fenêtre 5 h),
  remplacé par l'extension VS Code *Claude Code Usage* et la commande `/usage`, qui lisent l'usage
  réel au lieu de l'estimer. Le plugin n'exécute plus de code.
