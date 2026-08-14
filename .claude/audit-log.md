# Journal d'audit — ClaudePlugins

Écrit et tenu à jour par la skill `/audit`. **Ne pas renuméroter à la main** : les ids sont stables à
vie, c'est ce qui permet à deux audits successifs de se compléter au lieu de se contredire. Un
constat qui revient après correction reprend **son** id, il n'en reçoit pas un neuf.

Statuts : `ouvert` · `corrigé` (réparé et re-vérifié — **jamais figé**, son test est rejoué aux runs
suivants) · `écarté` (faux positif, avec la raison — ne sera plus remonté) · `accepté` (vrai mais
assumé — pas remonté dans le rapport, mais re-testé quand même).

## Constats

| id | Grav | Constat | Lieu | Vérif | Statut | Corrigé en | Ouvert le | Re-testé le |
|---|---|---|---|---|---|---|---|---|
| CONF-01 | 🟠 | GitHub CLI absent des prérequis du QUICKSTART (chemin « poste neuf ») alors qu'INSTALL.md l'exige | `claude-utils/QUICKSTART.md` étape 0 | `grep -c 'gh auth status' claude-utils/QUICKSTART.md` ≥ 1 **et** `grep -c 'Rien d.autre — le plugin' claude-utils/README.md` = 0 | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-02 | 🟠 | `"license": "MIT"` déclaré au manifeste, aucun fichier LICENSE dans le dépôt public | `claude-utils/.claude-plugin/plugin.json:23` | `test -f LICENSE` et sa 1re ligne cohérente avec le champ `license` du `plugin.json` | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-03 | 🟠 | Chemin de publication sans garde : le seul contrôle mécanique du dépôt (validation JSON) n'est sur aucun chemin automatique | `CLAUDE.md:35` ⇄ `DEPLOYMENT.md:49` | `grep -c 'valider les JSON' CLAUDE.md` ≥ 1 **et** `grep -ci 'JSON.parse' claude-utils/skills/ship/SKILL.md` ≥ 1 | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-04 | 🟡 | `keywords` divergents entre `plugin.json` et `marketplace.json` | les deux manifestes | `node -e "const a=require('./claude-utils/.claude-plugin/plugin.json').keywords,b=require('./.claude-plugin/marketplace.json').plugins[0].keywords;console.log(JSON.stringify(a)===JSON.stringify(b))"` → `true` | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-05 | 🟡 | Seule règle d'autorisation du repo portant sur une forme (`git -C <abs>`) que `/ship` interdit → règle morte | `.claude/settings.json` | `grep -c 'git -C' .claude/settings.json` = 0 | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-06 | 🟡 | `.claude/settings.local.json` non ignoré alors que `/ship` fait `git add -A` | `.gitignore` | `git check-ignore .claude/settings.local.json` → sortie non vide | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |
| CONF-07 | 🟡 | Liste des fichiers à resynchroniser dupliquée et divergente entre `DEPLOYMENT.md` et `skill-new` | `DEPLOYMENT.md:33` ⇄ `.claude/skills/skill-new/SKILL.md:76` | `grep -c 'DEPLOYMENT.md' .claude/skills/skill-new/SKILL.md` ≥ 1 (renvoi, pas de copie) et `DEPLOYMENT.md` point 4 reste la seule liste numérotée | corrigé | v2.4.0 | 2026-08-14 | 2026-08-14 |

Tout ce qui est trouvé entre ici, y compris ce que le rapport n'a pas eu la place de détailler : le
journal est exhaustif, le rapport ne détaille que le haut du panier. C'est ce qui fait que l'audit
suivant reprend la file au lieu d'en tirer une nouvelle.

**Colonne `Vérif`** — le test qui décide, à lui seul, si le constat tient toujours. C'est elle que
`/audit regression` rejoue des semaines plus tard.

**Colonne `Corrigé en`** — version où le correctif a atterri. Sert à ne re-tester que ce qui a bougé
depuis : `git log -1 --format=%h -- <lieu>`.

## Écartés & acceptés

| id | Constat | Pourquoi il ne sera plus remonté | Le |
|---|---|---|---|
| CONF-A1 | Aucune CI (`.github/` inexistant), aucun test automatisé | Assumé : `.claude/audit-notes.md` § « Déjà couvert par les tests » déclare le dépôt sans automatisation. La part qui était un vrai risque a été traitée en CONF-03 (validation JSON dans `/ship`). | 2026-08-14 |
| CONF-A2 | Le dépôt ne déclare pas lui-même la marketplace dans son `.claude/settings.json`, contrairement au gabarit `examples/` | Délibéré : `DEPLOYMENT.md` interdit le double scope user + project. Le dépôt source n'a pas à s'auto-installer. | 2026-08-14 |

## Couverture

Ce qui a réellement été examiné, par axe. Un axe jamais passé n'est pas un axe propre.

| Axe | Dernier passage | Périmètre couvert | Non couvert |
|---|---|---|---|
| SEC | — | — | N/A (aucun runtime, aucune donnée) |
| DATA | — | — | N/A (pas de modèle de données) |
| FONC | — | — | jamais passé |
| PERF | — | — | jamais passé |
| PROP | — | — | jamais passé |
| CONF | 2026-08-14 | 13/14 unités : les 2 manifestes (JSON validés), `README.md`, `INSTALL.md`, `DEPLOYMENT.md`, `CLAUDE.md`, `claude-utils/README.md`, `QUICKSTART.md`, `examples/project.claude-settings.json`, `.claude/settings.json`, `.gitignore`/`.gitattributes`, `docs/` (README + index.html sur ses mentions factuelles du catalogue), absence de CI/tests | `.vscode/settings.json` (réglages éditeur, hors axe) · état **déployé** de GitHub Pages non vérifié (`gh` non authentifié sur ce poste) · contenu des 8 `SKILL.md` hors renvois (relève de FONC/PROP) · mise en forme de `docs/index.html` (hors périmètre par les notes) |

## Historique des passages

Une ligne par run : date · axes · périmètre · nouveaux / corrigés / régressions / re-testés au vert.

- 2026-08-14 — `CONF` · tout le dépôt · 7 nouveaux, 7 corrigés (dans la foulée, v2.4.0), 0 régression,
  0 re-testé, 2 écartés/acceptés
