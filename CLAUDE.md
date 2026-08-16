# ClaudePlugins — index projet

Repo-catalogue de la **marketplace `dev-tools`** (plugins Claude Code). Repo public, **généraliste** :
outillage Claude Code transverse, sans domaine métier. Vocabulaire : repo `ClaudePlugins` ·
marketplace `dev-tools` · plugin `claude-utils` · skills `/<nom>`.

Les 14 skills publiées — `eco` · `audit` · `test` · `ci` · `doc` · `context-check` · `kit-sync` ·
`perms` · `ship` · `deploy` · `pr-draft` · `session-brief` · `handoff` · `update-plugins`. Rôle de
chacune et structure du repo : [README.md](README.md). *Cette liste est l'une des six déclarations
contrôlées par `coherence.mjs` : y ajouter toute nouvelle skill.*

## Règles du catalogue

- `audit`, `deploy`, `test`, `doc`, `kit-sync` et `perms` portent la méthode et lisent leurs
  spécificités dans `.claude/<nom>-notes.md` côté projet (gabarits dans
  `claude-utils/skills/<nom>/references/`). Sans ses notes, `deploy` **s'arrête** ; les autres
  tournent en mode dégradé.
- `ci` n'a **pas** de notes propres, et c'est voulu : elle lit `test-notes.md` et `deploy-notes.md`.
  Une skill qui réclame ses propres notes pour redire ce qui est écrit à côté fabrique la divergence.
- Journaux écrits sans demander : `.claude/audit-log.md`, `.claude/kit-log.md`.
- La description d'`eco` **ne doit pas** être ramenée au gabarit maison : c'est la seule skill
  proactive du plugin, l'aligner la rendrait réactive. Exception inscrite dans `plugin-check`
  § « Exceptions admises » **et** dans la table `EXCEPTIONS` de `coherence.mjs` — les deux bougent
  ensemble.

## Conventions

- **Pas de commit/push automatique.** Faire les modifs, puis attendre `/ship`.
  Voir [[no-auto-commit-ship-skill]].
- **Aucun trailer `Co-Authored-By`** ni mention d'assistant dans les messages de commit **ni dans les
  corps de PR**, quel que soit le dépôt. Voir [[no-coauthored-by-trailer]].
- Messages : `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`).
  Travail directement sur `main`.
- Publier = bump `version` du plugin + **valider les JSON touchés** (un manifeste cassé empêche le
  chargement du plugin sur tous les postes) + `/ship`, puis `/update-plugins` sur chaque poste.
  Procédure : [DEPLOYMENT.md](DEPLOYMENT.md).
- **`main` n'est pas protégée — tranché non, ne pas rouvrir.** Un `required_status_checks` rejette les
  poussées directes, impose un flux PR et casse `/ship`. Le garde-fou CI est **informatif, et c'est
  assumé** : sur un dépôt solo, la notification d'échec suffit.

## État courant

*Bloc remplacé à chaque `/handoff`, jamais empilé. **Le vérifier contre `git status` avant de le
croire** — il décrit l'état au moment où il a été écrit, pas l'état courant.*

2.8.1 publiée et commitée (`0b21c29`), arbre propre, ce poste à jour. Le garde-fou CI tient
3 contrôles : JSON, `coherence.mjs` (six déclarations · deux manifestes · frontmatter) et `liens.mjs`
— vus verts sur 3 runs (5 JSON, 16 skills, 0 lien mort).

### À reprendre en premier

1. **`agents-sync` (#09)** — seul chantier réellement ouvert. **Deux définitions en circulation, à
   trancher avant d'écrire une ligne** : cohérence `CLAUDE.md` ⇄ `AGENTS.md` (roadmap du 15/08,
   priorité 3, un seul projet concerné) *vs* alignement des définitions de sous-agents entre projets
   frères sur le modèle de `kit-sync` (validé à l'oral le 16/08). Ni le même périmètre ni la même
   urgence. Une `description` devinée est un routeur faux : la skill part à la place d'une autre.
2. **Nemesis** — arbre propre et à jour (`e564d30`), rien à committer. Restent deux chantiers :
   `.claude/skills/` y garde 4 doublons de `claude-utils` (`deploy`, `doc`, `ship`, `test`), et
   `/perms` n'y est jamais passé (pas de `perms-notes.md`).
3. **Autres postes** — `claude plugin marketplace update dev-tools` puis `claude plugin update
   claude-utils@dev-tools` (ou `/update-plugins`). Sans le second, le bump n'est pas appliqué.

## Détails déportés (lire seulement si pertinent)

- [.claude/lecons.md](.claude/lecons.md) — leçons de méthode : contrôles maison en PowerShell 5.1,
  vérifier une trace contre git, ce qui reste hors du garde-fou CI, règles de permissions tranchées
- [.claude/perms-notes.md](.claude/perms-notes.md) — limites du détecteur d'ombrage
- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer ·
  [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier

## Compact instructions

Conserver : l'État courant, les trois points de reprise, les décisions tranchées (`main` non
protégée, exception `eco`, `ci` sans notes) et les fichiers cibles. Supprimer : explorations sans
suite, sorties de commandes, hypothèses abandonnées.
