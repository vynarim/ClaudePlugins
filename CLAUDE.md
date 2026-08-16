# ClaudePlugins — index projet

Repo-catalogue de la **marketplace `dev-tools`** (plugins Claude Code). Repo public.
Vocabulaire : repo `ClaudePlugins` · marketplace `dev-tools` · plugins ci-dessous · skills `/<nom>`.

## Structure

- `.claude-plugin/marketplace.json` — déclare les plugins de la marketplace
- `<plugin>/.claude-plugin/plugin.json` — manifeste d'un plugin (`version` à bumper pour publier)
- `<plugin>/skills/<nom>/SKILL.md` — skills (dossier `skills/` auto-découvert)
- `<plugin>/skills/<nom>/references/` — fichiers annexes d'une skill (ex. gabarits)
- `examples/` — gabarit de `.claude/settings.json` à copier dans un projet consommateur
- `docs/` — source du tutoriel publié via GitHub Pages (`index.html` autonome)
- `.claude/skills/` — skills **internes** au repo (`skill-new`, `plugin-check`), non publiées
- `.claude/audit-notes.md` — axes actifs et checklist maison de `/audit` ici (cohérence du catalogue,
  pas un modèle de données) ; `.claude/audit-log.md` — journal des constats, écrit par la skill

## Plugins

- **claude-utils** — générique : `eco` (discipline tokens/contexte), `audit` (revue de code par axes :
  sécurité, données, métier, perf, propreté, config — extensible par `.claude/audit-notes.md` côté
  projet), `test` (non-régression locale), `ci` (garde-fou GitHub Actions à la poussée), `doc`
  (README ⇄ dépôt, axes `fond` et `forme`), `context-check` (audit du `CLAUDE.md`), `kit-sync`
  (socle partagé entre projets frères), `perms` (ménage des listes de permissions), `ship`
  (commit + push, bump si les notes le déclarent), `deploy` (mise en production), `pr-draft`,
  `session-brief`, `handoff` (trace de fin de session, relue par `session-brief`), `update-plugins`

  `deploy`, `test`, `doc`, `kit-sync` et `perms` portent la méthode et lisent leurs spécificités dans
  `.claude/<nom>-notes.md` côté projet, comme `audit`. Gabarits dans
  `claude-utils/skills/<nom>/references/`. Sans ses notes, `deploy` **s'arrête** ; les autres
  tournent en mode dégradé. `ci` n'a pas de notes propres : elle lit `test-notes.md` et
  `deploy-notes.md`. Deux journaux écrits sans demander : `audit-log.md`, `kit-log.md`.

Repo **généraliste** : outillage Claude Code transverse, sans domaine métier particulier.

## Conventions

- **Pas de commit/push automatique.** Faire les modifs, puis attendre `/ship` (skill de
  `claude-utils` : stage + commit Conventional Commits + push). Voir [[no-auto-commit-ship-skill]].
- **Aucun trailer `Co-Authored-By`** ni mention d'assistant dans les messages de commit **ni dans les
  corps de PR**, quel que soit le dépôt. Voir [[no-coauthored-by-trailer]].
- Messages de commit : `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`).
- Travail directement sur `main`.
- Publier une version = bump `version` du plugin + **valider les JSON touchés** (un manifeste cassé
  empêche le chargement du plugin sur tous les postes) + `/ship`. Côté postes : `claude plugin marketplace
  update dev-tools` (catalogue) puis `claude plugin update <plugin>@dev-tools` (applique le bump), ou
  la skill `/update-plugins`. `marketplace update` seul ne ré-upgrade pas. Détails dans
  [DEPLOYMENT.md](DEPLOYMENT.md).

## État courant

*Bloc remplacé à chaque `/handoff`, jamais empilé — il est chargé à chaque prompt.*

Lot **2.8.1 entièrement préparé et vérifié, mais rien n'est commité** — toute la session vit dans
8 fichiers de l'arbre de travail. Le garde-fou CI passe de 2 à 3 contrôles : `coherence.mjs` (nouveau,
étapes 1–3 de `plugin-check` : six déclarations, deux manifestes, frontmatter) est appelé par la skill
*et* par le workflow. Les deux inconnues de la session précédente sont levées : le workflow **a été vu
tourner** (3 runs verts, logs lus — 5 JSON, 16 skills, 0 lien mort) et `main` **n'est pas protégée**
(404 ; tranché, voir dettes).

### À reprendre en premier

1. **`/ship` ici, avant tout le reste** : 7 fichiers modifiés + `coherence.mjs` non suivi. Rien de
   cette session n'a survécu à git. Puis sur chaque poste `claude plugin marketplace update dev-tools`
   puis `claude plugin update claude-utils@dev-tools` — sans le second, le bump n'est pas appliqué.
2. **Nemesis** : `/test` d'abord, puis **un commit unique des 8 entrées**. `functions/lib/throttle.js`
   est **non suivi** alors que [`functions/index.js`](../Nemesis/functions/index.js) l'importe déjà —
   committer `index.js` seul met sur `main` des Cloud Functions qui ne démarrent plus. Ensuite
   seulement : les 4 skills doublons, puis `/perms` (7 lignes de la grille de danger).
3. **`agents-sync` (#09)** — **deux définitions en circulation, à trancher avant d'écrire une ligne.**
   La roadmap du 15/08 dit « cohérence `CLAUDE.md` ⇄ `AGENTS.md`, priorité 3, **un seul projet
   concerné** ». Le 16/08, une autre lecture a été validée à l'oral : aligner les définitions de
   **sous-agents** (`agents/`, `.claude/agents/`) entre projets frères, sur le modèle de `kit-sync`.
   Les deux ne décrivent ni le même périmètre ni la même urgence. Trancher d'abord — une
   `description` devinée est un routeur faux, et la skill part à la place d'une autre.

### Dettes connues / à ne pas refaire

- **Protéger `main` : tranché non, ne pas rouvrir.** Un `required_status_checks` fait rejeter les
  poussées directes (le check ne peut pas être vert avant le push), donc impose un flux PR, contredit
  « travail directement sur `main` » et casse `/ship`. Le garde-fou est **informatif, et c'est
  assumé** : une poussée rouge entre, la notification d'échec suffit sur un dépôt solo.
- **Une trace de handoff se vérifie contre git avant d'être crue.** Celle du 16/08 envoyait shipper
  « 12 fichiers Nemesis dont `ReclaimBanner.jsx` » : déjà commités, disparus de l'arbre. Un
  `git status` de 3 secondes a évité de travailler sur un chantier fantôme.
- **`ci` n'a pas de `ci-notes.md`, et c'est voulu** : elle lit `test-notes.md` et `deploy-notes.md`.
  Une skill qui réclame ses propres notes pour redire ce qui est écrit à côté fabrique la divergence
  qu'on passe ensuite son temps à réconcilier.
- **Un contrôle maison ment de trois façons en PowerShell 5.1**, et les trois ont été rencontrées pour
  de vrai : lecture ANSI par défaut (tout motif accentué échoue → les 16 skills en `MANQUE`),
  `description` repliée sur plusieurs lignes (« À utiliser quand » coupé se lit comme absent), et
  **BOM** écrit par `Set-Content -Encoding UTF8` (trois octets invisibles qui font échouer le `^---` du
  frontmatter, donc « name absent » sur une skill intacte). D'où `coherence.mjs` et `liens.mjs` en
  Node. Corollaire de méthode : **un garde-fou se prouve dans les deux sens** — vert sur l'arbre réel
  *et* rouge sur une copie cassée exprès. C'est ce second test qui a trouvé le BOM.
- **Ce qui reste hors du garde-fou CI, faute d'être automatisable** : les deux emplacements de
  `QUICKSTART.md` que le comptage ne distingue pas, et le jugement sur le contenu d'une skill. Par
  ailleurs l'étape « six déclarations » cherche une **sous-chaîne** — une absence est une certitude,
  une présence ne l'est pas. Resserrer sur une frontière de mot ferait rougir des déclarations
  légitimes, et un garde-fou qui rougit à tort est désactivé la semaine suivante. Même raison pour la
  longueur > 150 lignes, rendue en *signalement* et non en défaut (`audit` fait 214 lignes).
- **Le détecteur d'ombrage est un pré-filtre, et le premier vrai passage l'a montré trois fois** : il
  rate les motifs `Read`/`Edit` (`/**` ne préfixe pas littéralement `/plugins/**`), il donne pour
  ombrée une commande composée dont seul le premier segment est couvert alors que le harness découpe
  sur `&&`, et les doublons exacts vivent entre le poste et les *autres* projets — invisibles depuis
  un seul dépôt. Détail dans [.claude/perms-notes.md](.claude/perms-notes.md), pas ici.
- **Deux règles de permissions tranchées** : une entrée d'un fichier **versionné** ne se supprime pas
  parce que le poste la couvre (les 6 `Bash(git …:*)` sont seules sur un poste qui clone) ; et un
  `ask` posé au poste **écrase** un `allow` que le projet s'est donné exprès — d'où la suppression, et
  non le passage en `ask`, des 4 entrées de déploiement LudEvent.
- **La description d'`eco` ne doit pas être ramenée au gabarit maison** : c'est la seule skill
  proactive du plugin. L'aligner la rendrait réactive — elle ne partirait plus qu'après un « je
  sature », trop tard. Exception inscrite dans `plugin-check` § « Exceptions admises », **et** dans la
  table `EXCEPTIONS` de `coherence.mjs` — les deux doivent bouger ensemble.

### État git

Branche `main`, à jour avec `origin/main` (`ac52af8`) — 0 commit d'avance, 0 stash. **Non commité :**
`marketplace.json`, `plugin.json`, `README.md` racine, `claude-utils/README.md` (bump 2.8.0 → 2.8.1 aux
trois emplacements + historique), `plugin-check/SKILL.md`, `garde-fou.yml`, ce `CLAUDE.md`, et
`coherence.mjs` **non suivi**. Batterie rejouée localement avant écriture : JSON ✅ · cohérence ✅ ·
liens ✅.

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
