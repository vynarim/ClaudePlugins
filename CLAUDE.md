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

Lot **2.8.0** écrit le 16/08/2026 : `perms`, `ci` (publiées) et `plugin-check` (interne). Resync des
six déclarations faite, versions alignées aux trois endroits. Reste la roadmap : `agents-sync` (#09),
et la migration des skills doublons de **Nemesis**, dernier dépôt concerné.

### À reprendre en premier

1. `/update-plugins` + rechargement de fenêtre — tant que le cache est en 2.7.0, `/perms` et `/ci`
   n'existent sur aucun poste, y compris celui-ci.
2. Essayer `/perms` sur le poste : c'est le cas le plus parlant (113 entrées, 85 ombrées).
3. **Nemesis** : shipper d'abord le chantier en cours (12 fichiers non commités, dont
   `ReclaimBanner.jsx` et `useReclaimActif.js`), *puis* migrer ses 4 skills doublons — l'inverse rend
   le commit de migration illisible.

### Dettes connues / à ne pas refaire

- **`ci` n'a pas de `ci-notes.md`, et c'est voulu** : elle lit `test-notes.md` (les étapes) et
  `deploy-notes.md` (cibles, secrets). Une skill qui réclame ses propres notes pour redire ce qui est
  écrit à côté fabrique la divergence qu'on passe ensuite son temps à réconcilier.
- **Un contrôle de cohérence écrit en PowerShell 5.1 ment deux fois** s'il n'est pas blindé : lecture
  en ANSI par défaut (tout motif accentué échoue → les 16 skills ressortent en `MANQUE`) et
  `description` de frontmatter repliée sur plusieurs lignes (« À utiliser quand » coupé se lit comme
  absent). Les deux pièges sont désormais traités dans `plugin-check`. Le contrôle de liens a été
  réécrit en Node pour la même raison — la version PowerShell décalait les résultats d'un fichier.
- **Ombrage de permissions : la portée compte autant que le motif.** Une entrée déclarée dans un
  projet ne peut pas ombrer une entrée du poste. Sans cette règle le détecteur annonçait 104 ombrages
  au lieu de 85, et supprimer sur cette base aurait rétabli des questions déjà réglées.
- Ouvert, non traité : `eco` et `update-plugins` n'ont pas de section « Ce que cette skill ne fait
  PAS », pourtant convention maison ; `eco` emploie en plus d'autres formulations de déclencheurs.

### État git

Branche `main`, à jour avec `origin/main` avant ce lot — 0 commit d'avance, 0 stash. Lot 2.8.0 en
attente de `/ship` : 6 fichiers modifiés (2 manifestes, `CLAUDE.md`, les 2 README, `QUICKSTART.md`) et
3 dossiers de skills non suivis (`perms`, `ci`, `plugin-check`).

## Docs

- [README.md](README.md) — présentation · [INSTALL.md](INSTALL.md) — installer · [DEPLOYMENT.md](DEPLOYMENT.md) — maintenir/publier
