# ClaudePlugins — index projet

Repo-catalogue de la **marketplace `dev-tools`** (plugins Claude Code). Repo public, **généraliste** :
outillage Claude Code transverse, sans domaine métier. Vocabulaire : repo `ClaudePlugins` ·
marketplace `dev-tools` · plugins `claude-utils` et `claude-uxui` · skills `/<nom>`.

**Deux plugins, deux axes.** `claude-utils` = le **processus** de développement (commit, tests,
publication, permissions, docs). `claude-uxui` = le **produit** affiché à l'utilisateur (mise en page,
ergonomie). Une skill se range par cet axe, pas par affinité de sujet — mélanger les deux brouille le
routeur des deux plugins.

`claude-utils`, 14 skills — `eco` · `audit` · `test` · `ci` · `doc` · `context-check` · `kit-sync` ·
`perms` · `ship` · `deploy` · `pr-draft` · `session-brief` · `handoff` · `update-plugins`.
`claude-uxui`, 1 skill — `ui-frame`. Rôle de chacune et structure du repo : [README.md](README.md).
*Ces listes sont l'une des déclarations contrôlées par `coherence.mjs` : y ajouter toute nouvelle
skill.*

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
- Côté `claude-uxui` : **un seul** fichier de notes pour tout le plugin (`.claude/uxui-notes.md`), pas
  un par skill, et un préfixe `ui-` obligatoire sur les noms de skills. Sans préfixe, `frame` ou
  `viewport` sont des mots trop courants — l'étape 1 de `coherence.mjs` cherche par sous-chaîne et les
  « trouve » dans n'importe quelle phrase, déclarant présente une skill déclarée nulle part.
- **Une skill ne se déplace pas d'un plugin à l'autre.** Les postes qui ont installé le premier gardent
  leur copie et se retrouvent avec deux skills pour le même geste, aux descriptions identiques. D'où
  un plugin dès la première skill de son axe, plutôt qu'un regroupement plus tard.
- Le nombre de cibles de déclaration **dépend du plugin** : 6 pour `claude-utils` (il a un
  `QUICKSTART.md`), 5 pour `claude-uxui`. `coherence.mjs` découvre les plugins et retire les cibles
  absentes au lieu de rougir.
- `marketplace.metadata.version` est la version du **catalogue**, pas celle d'un plugin. Chaque plugin
  a la sienne, contrôlée contre sa ligne du README racine.

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

`claude-utils` 2.8.1 publiée et commitée (`0b21c29`). **Second plugin `claude-uxui` 0.1.0 posé mais
non commité ni publié** : une skill, `ui-frame`. Catalogue passé à 2.9.0. Le garde-fou CI tient
3 contrôles : JSON, `coherence.mjs` (déclarations · manifestes · frontmatter) et `liens.mjs`.
`coherence.mjs` et `liens.mjs` **découvrent** désormais les plugins au lieu de les énumérer.

### À reprendre en premier

1. **Publier `claude-uxui`** — relire `ui-frame` (jamais éprouvée sur un vrai dépôt), puis `/ship`. Le
   premier terrain d'essai est une app mobile-only : la skill doit **s'arrêter** sur un dépôt
   `responsive`, c'est ce comportement-là qu'il faut vérifier en premier, pas le cadre lui-même.
   Ensuite `claude plugin install claude-uxui@dev-tools` — c'est un **nouveau** plugin, `update` ne
   l'installe pas.
2. **`agents-sync` (#09)** — chantier ouvert. **Deux définitions en circulation, à
   trancher avant d'écrire une ligne** : cohérence `CLAUDE.md` ⇄ `AGENTS.md` (roadmap du 15/08,
   priorité 3, un seul projet concerné) *vs* alignement des définitions de sous-agents entre projets
   frères sur le modèle de `kit-sync` (validé à l'oral le 16/08). Ni le même périmètre ni la même
   urgence. Une `description` devinée est un routeur faux : la skill part à la place d'une autre.
3. **Nemesis** — arbre propre et à jour (`e564d30`), rien à committer. Restent deux chantiers :
   `.claude/skills/` y garde 4 doublons de `claude-utils` (`deploy`, `doc`, `ship`, `test`), et
   `/perms` n'y est jamais passé (pas de `perms-notes.md`).
4. **Autres postes** — `claude plugin marketplace update dev-tools` puis `claude plugin update
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
