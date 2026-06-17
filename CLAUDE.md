# ClaudePlugins — index projet

Repo-catalogue de la **marketplace `dev-tools`** (plugins Claude Code). Repo public.
Vocabulaire : repo `ClaudePlugins` · marketplace `dev-tools` · plugins ci-dessous · skills `/<nom>`.

## Structure

- `.claude-plugin/marketplace.json` — déclare les plugins de la marketplace
- `<plugin>/.claude-plugin/plugin.json` — manifeste d'un plugin (`version` à bumper pour publier)
- `<plugin>/skills/<nom>/SKILL.md` — skills (dossier `skills/` auto-découvert)
- `<plugin>/references/` — fichiers annexes partagés (ex. gabarits)
- `.claude/skills/ship/` — skill **interne** au repo (non publiée)

## Plugins

- **claude-utils** — générique : `eco` (tokens/contexte + hook 5 h), `pr-draft`, `session-brief`
- **claude-powerplatform** — Power Apps Code Apps : `pp-setup`, `pp-scaffold`, `pp-data`, `pp-diag`,
  `pp-ship`. Config par projet lue dans le CLAUDE.md du projet cible. Statut preview, voir
  `claude-powerplatform/QUICKSTART.md`.

## Conventions

- **Pas de commit/push automatique.** Faire les modifs, puis attendre `/ship` (skill interne :
  stage + commit Conventional Commits avec trailer Co-Authored-By + push). Voir [[no-auto-commit-ship-skill]].
- Messages de commit : `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`).
- Travail directement sur `main`.
- Publier une version = bump `version` du plugin + `/ship`, puis `claude plugin marketplace update dev-tools` côté postes.

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
