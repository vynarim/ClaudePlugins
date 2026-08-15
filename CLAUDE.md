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
- `.claude/skills/` — skills **internes** au repo (`skill-new`), non publiées
- `.claude/audit-notes.md` — axes actifs et checklist maison de `/audit` ici (cohérence du catalogue,
  pas un modèle de données) ; `.claude/audit-log.md` — journal des constats, écrit par la skill

## Plugins

- **claude-utils** — générique : `eco` (discipline tokens/contexte), `audit` (revue de code par axes :
  sécurité, données, métier, perf, propreté, config — extensible par `.claude/audit-notes.md` côté
  projet), `test` (non-régression), `doc` (README ⇄ code), `context-check` (audit du `CLAUDE.md`),
  `ship` (commit + push, bump si les notes le déclarent), `deploy` (mise en production), `pr-draft`,
  `session-brief`, `update-plugins`

  `deploy`, `test` et `doc` portent la méthode et lisent leurs spécificités dans
  `.claude/<nom>-notes.md` côté projet, comme `audit`. Gabarits dans
  `claude-utils/skills/<nom>/references/`. Sans ses notes, `deploy` **s'arrête** ; les deux autres
  tournent en mode dégradé.

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

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
