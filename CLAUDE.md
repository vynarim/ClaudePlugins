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

- **claude-utils** — générique : `eco` (discipline tokens/contexte), `pr-draft`, `session-brief`,
  `update-plugins`

Le plugin `claude-powerplatform` (skills `pp-*`, Code Apps) a été **retiré en v2.0.0** : le périmètre
est couvert par le plugin officiel Microsoft `code-apps-preview@power-platform-skills`. Récupérable
dans l'historique git au commit `712017e`.

## Conventions

- **Pas de commit/push automatique.** Faire les modifs, puis attendre `/ship` (skill interne :
  stage + commit Conventional Commits avec trailer Co-Authored-By + push). Voir [[no-auto-commit-ship-skill]].
- Messages de commit : `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`).
- Travail directement sur `main`.
- Publier une version = bump `version` du plugin + `/ship`. Côté postes : `claude plugin marketplace
  update dev-tools` (catalogue) puis `claude plugin update <plugin>@dev-tools` (applique le bump), ou
  la skill `/update-plugins`. `marketplace update` seul ne ré-upgrade pas. Détails dans
  [DEPLOYMENT.md](DEPLOYMENT.md).

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
