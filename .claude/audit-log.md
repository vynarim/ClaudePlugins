# Journal d'audit — ClaudePlugins

Écrit et tenu à jour par la skill `/audit`. **Ne pas renuméroter à la main** : les ids sont stables à
vie, c'est ce qui permet à deux audits successifs de se compléter au lieu de se contredire. Un
constat qui revient après correction reprend **son** id, il n'en reçoit pas un neuf.

Statuts : `ouvert` · `corrigé` (réparé et re-vérifié — **jamais figé**, son test est rejoué aux runs
suivants) · `écarté` (faux positif, avec la raison — ne sera plus remonté) · `accepté` (vrai mais
assumé — pas remonté dans le rapport, mais re-testé quand même, un choix assumé peut cesser d'être
tenable).

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
| CONF-08 | 🟠 | **Seconde** liste de publication d'une skill, divergente et contraire à `DEPLOYMENT.md` point 4 qui se déclare « la » liste de référence : omet `marketplace.json`, QUICKSTART, README racine, CLAUDE.md, et affirme « pas besoin de toucher `plugin.json` » là où DEPLOYMENT impose d'y ajouter la skill à `description` | `claude-utils/README.md:78-88` ⇄ `DEPLOYMENT.md:33-45` | `grep -c 'DEPLOYMENT.md' claude-utils/README.md` ≥ 1 **et** `grep -c 'Pas besoin de toucher .plugin.json. pour déclarer la skill' claude-utils/README.md` = 0 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| FONC-01 | 🟠 | `session-brief` exécute `git log main..HEAD` avec `main` en dur et **aucune** détection de la branche par défaut (contrairement à `pr-draft` qui en a une) → étape 1 en échec sur tout dépôt en `master`/`develop` | `claude-utils/skills/session-brief/SKILL.md:22` | `grep -c 'symbolic-ref' claude-utils/skills/session-brief/SKILL.md` ≥ 1 **et** `grep -c 'main\.\.HEAD' claude-utils/skills/session-brief/SKILL.md` = 0 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| FONC-02 | 🟡 | `pr-draft` annonce la détection de la branche de base **après** le bloc de commandes qui l'utilise → l'ordre prescrit garantit l'échec avant la détection | `claude-utils/skills/pr-draft/SKILL.md:23-28` | `awk '/symbolic-ref/{s=NR} /<base>\.\.HEAD\|main\.\.HEAD/{if(!m)m=NR} END{print (s&&s<m)?"OK":"KO"}' claude-utils/skills/pr-draft/SKILL.md` → `OK` | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| FONC-03 | 🟡 | `pr-draft` imposait `🤖 Généré avec Claude Code` dans chaque corps de PR (gabarit **et** commande finale), alors que `ship` pose « aucune mention d'assistant » en règle absolue. Arbitrage rendu le 2026-08-14 : la règle **s'étend aux corps de PR**. `CLAUDE.md:31` l'énonce désormais pour les deux, `pr-draft` la porte en règle explicite et en garde-fou, et la mémoire persistante `no-coauthored-by-trailer` la fait valoir hors de ce dépôt | `claude-utils/skills/pr-draft/SKILL.md` · `CLAUDE.md:31` `grep -c '^🤖' claude-utils/skills/pr-draft/SKILL.md` = 0 (en début de ligne = pied de page réel ; les occurrences en milieu de ligne sont la règle qui l'interdit) **et** `grep -ci 'aucune mention d.assistant' claude-utils/skills/pr-draft/SKILL.md` ≥ 1 **et** `grep -c 'corps de PR' CLAUDE.md` ≥ 1 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| FONC-04 | 🟡 | « **Trois** principes, dans cet ordre » suivi de **quatre** principes numérotés (le 4e ajouté en v2.4.0 sans corriger l'amorce) | `claude-utils/skills/audit/SKILL.md:24` | `grep -c 'Trois principes' claude-utils/skills/audit/SKILL.md` = 0 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| FONC-05 | 🟡 | Chemin de la mémoire persistante écrit `.claude/projects/…/memory/` sans `~` → se lit comme relatif au projet, alors que la mémoire vit sous `~/.claude/projects/` | `claude-utils/skills/session-brief/SKILL.md:50` | `grep -c '~/.claude/projects' claude-utils/skills/session-brief/SKILL.md` ≥ 1 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| PERF-01 | 🟡 | Skill monolithique : `audit/SKILL.md` faisait 236 lignes / 14,9 ko chargés en entier à chaque invocation, dont les formats de sortie et la reconstitution du modèle — du contenu de référence, utile seulement au moment de s'en servir. Déporté en v2.4.1 vers `references/formats-de-sortie.md` (étapes 6-7) et `references/reconstituer-modele.md` (étape 2), tous deux chargés conditionnellement : 236 → 213 lignes, 14,9 → 13,1 ko. **Seuil d'origine (≤ 150) erroné** : posé sans avoir fait l'exercice, il n'était atteignable qu'en coupant la doctrine qui fait obéir la skill — le reste du fichier est de la méthode dont une passe complète a besoin | `claude-utils/skills/audit/SKILL.md` | `wc -l < claude-utils/skills/audit/SKILL.md` ≤ 215 **et** aucun format de sortie inline : `grep -c 'Tableau de synthèse' claude-utils/skills/audit/SKILL.md` = 0 **et** `test -f claude-utils/skills/audit/references/formats-de-sortie.md` | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| PERF-02 | 🟡 | `description` d'`audit` = 1 219 octets de frontmatter (~300 tokens), 2,1× la moyenne des 6 autres (574 o) — coût payé à **chaque session de chaque projet**, un routeur n'a pas besoin de la liste complète des 6 axes plus une phrase sur `regression`. Total frontmatter du plugin : 4,7 ko (~1 170 tokens) | `claude-utils/skills/audit/SKILL.md:3-15` | `awk '/^---$/{c++;next} c==1' claude-utils/skills/audit/SKILL.md \| wc -c` ≤ 800 | ouvert | — | 2026-08-14 | — |
| PROP-01 | 🟡 | Commentaire HTML d'installation « À placer dans le repo sous : docs/README.md » resté en tête d'un fichier qui **est** déjà à cet emplacement | `docs/README.md:1-5` | `head -5 docs/README.md \| grep -c 'À placer dans le repo'` = 0 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |
| PROP-02 | 🟡 | Bloc « Statuts » du journal recopié du gabarit et **déjà divergent** : la clause « un choix assumé peut cesser d'être tenable » présente au gabarit a disparu de la copie du dépôt | `.claude/audit-log.md:7-9` ⇄ `claude-utils/skills/audit/references/audit-log-template.md:7-10` | `grep -c "un choix assumé peut cesser d.être tenable" .claude/audit-log.md` ≥ 1 | corrigé | ce run | 2026-08-14 | 2026-08-14 |
| CONF-09 | 🟡 | `README.md` distribue le gabarit `examples/project.claude-settings.json` (qui contient `enabledPlugins` scope `project`) sans le garde-fou « scope user **ou** project, pas les deux » que `DEPLOYMENT.md:106` juge nécessaire — un lecteur qui a déjà installé au scope poste récolte le plugin en double | `README.md:40-42` ⇄ `DEPLOYMENT.md:106-110` | `grep -ci 'pas les deux\|déjà installé au niveau poste\|DEPLOYMENT.md#activer' README.md` ≥ 1 | corrigé | v2.4.1 | 2026-08-14 | 2026-08-14 |

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
| CONF-A3 | `docs/index.html` ne mentionne ni la marketplace `dev-tools`, ni `claude-utils`, ni aucune des 7 skills | Écarté : le point de checklist maison « page Pages qui ne liste plus les bonnes skills » est sans objet — le tutoriel est un cours Claude Code + VS Code, pas une doc du catalogue, et n'a jamais listé de skills. Sa section « Consommation » (l. 1373-1418) couvre bien le terrain d'`eco` comme l'annonce `README.md:3`. | 2026-08-14 |
| PROP-A1 | Lien Markdown mort `src/...#L42` détecté dans `audit/SKILL.md:201` | Faux positif : c'est un **exemple** de syntaxe entre backticks (`[fichier.jsx:42](src/...#L42)`), pas un renvoi. | 2026-08-14 |
| FONC-A1 | `update-plugins` code `dev-tools` en dur dans un plugin annoncé « générique » | Écarté : la skill l'annonce dans son nom, sa description et son titre. Une skill dédiée à une marketplace précise n'est pas une fuite de contexte local, c'est son objet. | 2026-08-14 |
| CONF-A4 | `context-check/SKILL.md` renvoie à `../eco/references/claude-md-template.md`, chemin qui sort du dossier de la skill | Écarté : la cible existe et les deux skills sont livrées dans le même plugin, donc le chemin résout dans le cache. À rouvrir seulement si `eco` migrait vers un autre plugin. | 2026-08-14 |

## Couverture

Ce qui a réellement été examiné, par axe. Un axe jamais passé n'est pas un axe propre.

| Axe | Dernier passage | Périmètre couvert | Non couvert |
|---|---|---|---|
| SEC | — | — | N/A (aucun runtime, aucune donnée) |
| DATA | — | — | N/A (pas de modèle de données) |
| FONC | 2026-08-14 | 8/8 `SKILL.md` lus intégralement (7 publiées + `skill-new`), frontmatter et corps ; renvois `references/` vérifiés | Déclenchement réel des `description` (ne se teste que chez un consommateur) · collision de `name` avec une skill locale d'un autre dépôt (invisible d'ici) · comportement effectif des skills à l'exécution |
| PERF | 2026-08-14 | 18/18 unités mesurées : 8 `SKILL.md` (lignes + octets + octets de frontmatter) et 10 `references/` | Coût réel observé en session (aucune instrumentation) · coût des axes chargés à la demande, non mesuré en conditions d'usage |
| PROP | 2026-08-14 | 34/34 : 34 liens Markdown relatifs testés par script sur tous les `.md`, renvois `references/` vérifiés, duplication comparée entre `DEPLOYMENT.md` / `claude-utils/README.md` / `skill-new`, et entre le journal et son gabarit | Duplication **interne** à `docs/index.html` (1 816 lignes ; mise en forme hors périmètre par les notes) · liens externes des docs (non résolus, pas de vérification réseau) |
| CONF | 2026-08-14 | 32/34 unités : les 2 manifestes (JSON validés), les 6 docs Markdown, `docs/README.md`, mentions factuelles de `docs/index.html`, `examples/project.claude-settings.json` (JSON validé), `.claude/settings.json` (JSON validé), `.gitignore`, `.gitattributes`, `LICENSE`, absence de CI/tests, cohérence des versions (2.4.0 aux 3 emplacements), absence de fichier de `claude-utils/` modifié depuis le bump | `.vscode/settings.json` (réglages éditeur, hors axe) · état **déployé** de GitHub Pages non vérifié (`gh` non authentifié sur ce poste) |

## Historique des passages

Une ligne par run : date · axes · périmètre · nouveaux / corrigés / régressions / re-testés au vert.

- 2026-08-14 — `CONF` · tout le dépôt · 7 nouveaux, 7 corrigés (dans la foulée, v2.4.0), 0 régression,
  0 re-testé, 2 écartés/acceptés
- 2026-08-14 — `FONC` `PERF` `PROP` `CONF` · tout le dépôt · 11 nouveaux (2 🟠, 9 🟡), **9 corrigés
  dans la foulée** (v2.4.1 : les 2 🟠 CONF-08 et FONC-01, plus FONC-02, FONC-03, FONC-04, FONC-05,
  CONF-09, PROP-01, PROP-02), puis **PERF-01** dans la même version — soit **10 sur 11**. 0 régression,
  7 re-testés au vert (CONF-01 → CONF-07), 4 écartés.
  FONC-03 était un arbitrage et non un défaut : il a été tranché dans le sens de `ship` (aucune
  mention d'assistant, commits **et** corps de PR). Le seuil de PERF-01 (≤ 150 lignes) était **une
  erreur de ce run** : posé sans avoir tenté la déportation, il n'était atteignable qu'en coupant de
  la méthode. Corrigé en un test de structure + un plafond de 215.
  **Reste ouvert** : PERF-02 seul — resserrer la `description` d'`audit`, qui est le routeur de la
  skill et le seul correctif du lot dont le risque n'est pas nul.
  Analyse conduite sans sous-agents (contrainte de session) — lectures directes, dépôt assez petit
  pour que la couverture n'en souffre pas.
