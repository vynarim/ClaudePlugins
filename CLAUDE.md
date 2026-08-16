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

Lot **2.8.0** en ligne (`7b0017f`), plus trois commits du 16/08/2026 **sans bump** : `189f3f1`
(sections « ne fait PAS » d'`eco` et `update-plugins`), `2991400` (`perms-notes.md`), `21e9a07`
(garde-fou CI). Conséquence à ne pas perdre : ces retouches sont sur `main` mais **n'atteignent aucun
poste** tant que `claude-utils` reste en 2.8.0 — elles partent avec le prochain lot. `/perms` a tourné
pour de vrai ici (113 → 56 entrées, 8 `ask` posés) ; le garde-fou CI, lui, **n'a jamais été vu tourner**.

### À reprendre en premier

1. `gh auth login`, puis `gh run list --limit 3` : le run déclenché par `21e9a07` est le premier et
   personne ne l'a observé. Ensuite `gh api repos/vynarim/ClaudePlugins/branches/main/protection --jq
   '.required_status_checks.contexts'` — un `404` veut dire que le workflow informe sans rien
   empêcher, et qu'une poussée rouge entre quand même.
2. **Nemesis** : shipper d'abord le chantier en cours (12 fichiers non commités, dont
   `ReclaimBanner.jsx` et `useReclaimActif.js`), *puis* migrer ses 4 skills doublons, *puis* `/perms`
   — il coche 7 lignes de la grille de danger qu'EscaleAzur, même métier, ne coche pas.
3. `agents-sync` (#09), dernière skill de la roadmap.

### Dettes connues / à ne pas refaire

- **`ci` n'a pas de `ci-notes.md`, et c'est voulu** : elle lit `test-notes.md` et `deploy-notes.md`.
  Une skill qui réclame ses propres notes pour redire ce qui est écrit à côté fabrique la divergence
  qu'on passe ensuite son temps à réconcilier.
- **Un contrôle de cohérence en PowerShell 5.1 ment deux fois** s'il n'est pas blindé : lecture ANSI
  par défaut (tout motif accentué échoue → les 16 skills en `MANQUE`) et `description` repliée sur
  plusieurs lignes (« À utiliser quand » coupé se lit comme absent). Traités dans `plugin-check` ; le
  contrôle de liens a été réécrit en Node pour la même raison.
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
  sature », trop tard. Exception inscrite dans `plugin-check`, § « Exceptions admises ».
- **Le garde-fou CI ne rejoue que 2 des 4 étapes de `plugin-check`** (JSON, liens). Les six
  déclarations et le frontmatter vivent en PowerShell dans un `SKILL.md` ; l'étape 2 existe en
  `node -e` mais **imprime sans jamais sortir en erreur**, donc verte quoi qu'il arrive. Le chemin
  propre est un `coherence.mjs` à côté de `liens.mjs`, appelé par la skill *et* par le workflow —
  surtout pas une seconde copie de la logique dans le YAML.

### État git

Branche `main`, à jour avec `origin/main` (`21e9a07`) — 0 commit d'avance, 0 stash. Seul ce bloc est
non commité. Aucun bump depuis 2.8.0.

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
