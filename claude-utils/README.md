# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**. Pensé
pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

> Installer sur un poste neuf et prendre en main les skills : [QUICKSTART.md](QUICKSTART.md).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte : une session = un objectif, `/clear` aux bascules, délégation aux sous-agents. |
| `audit` | `/audit` | Revue de code par axes (sécurité, données, métier, perf, propreté, config) : demande l'axe au démarrage, rend un diagnostic classé par gravité avec sa couverture, tient un journal pour que deux audits se complètent. Ne modifie aucun code. |
| `test` | `/test` | Joue la batterie de non-régression (lint, unitaires, build, puis les étapes lentes), rend un tableau ✅/❌ et déclare ce qui n'a pas été éprouvé. Ne committe rien, ne touche jamais la prod. |
| `ci` | `/ci` | Pose ou réaligne le garde-fou distant : un workflow GitHub Actions qui rejoue à la poussée la batterie de `/test`. N'écrit une étape que si son script existe, et ne déploie jamais ce qui garde la porte. |
| `doc` | `/doc` | Réaligne le README sur le dépôt, en deux axes : **fond** (la vérité vient des sources, écarts classés `périmé` / `absent` / `inventé`) et **forme** (`/doc forme` : ordre de lecture, aération, mermaid, encarts, captures inutilisées). |
| `context-check` | `/context-check` | Audite le `CLAUDE.md` du projet (longueur, sections à déporter) et propose la version condensée. |
| `kit-sync` | `/kit-sync` | Compare un socle partagé entre projets frères, classe chaque divergence (progrès à propager / adaptation légitime / dérive) et propose la propagation fichier par fichier. Ne fusionne rien en silence. |
| `perms` | `/perms` | Nettoie les listes de permissions (poste et projet) : entrées déjà couvertes par un motif plus large, entrées devenues impossibles à déclencher, gestes destructeurs laissés en `allow`. Ne relâche jamais une interdiction. |
| `ship` | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique du projet. Bumpe la version si `deploy-notes.md` le lui demande. |
| `deploy` | `/deploy` | Mise en production : bump, vérifications, contrôle anti-secrets, envoi via `ship`, déploiement cible par cible dans un ordre qui dépend du sens du changement, puis vérification en ligne. Lit `.claude/deploy-notes.md` — sans lui, elle s'arrête. |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| `handoff` | `/handoff` | Écrit la trace d'état de fin de session — état courant, trois points de reprise, dettes et fausses pistes, état git — dans le fichier que le projet utilise déjà. C'est ce que `session-brief` relit au démarrage suivant. |
| `update-plugins` | `/update-plugins` | Met à jour les plugins dev-tools sur le poste (`claude plugin update`). |

Le dossier `skills/` est auto-découvert ; chaque skill a son `SKILL.md` et, si besoin, ses fichiers
annexes dans `skills/<nom>/references/`.

## Utiliser `/audit`

La seule skill du plugin qui se configure et qui garde une trace d'un passage à l'autre.

| Commande | Effet |
|---|---|
| `/audit` | Demande l'axe puis le périmètre, et part. |
| `/audit sécurité` (ou `SEC`, `perf`, `code mort`…) | Un axe précis, sans question. |
| `/audit tout` | Les six axes. Coûteux — la skill annonce l'ordre de grandeur avant de lancer. |
| `/audit rapide` | Une passe, pas de sous-agents, ne remonte que 🔴 et 🟠. |
| `/audit delta` | Seulement ce qui a changé depuis le dernier passage. |
| `/audit regression` | Ne cherche rien de neuf : rejoue les tests des constats déjà `corrigé` ou `accepté` pour vérifier qu'ils tiennent toujours. Restreignable à un axe (`regression SEC`) ou à des ids (`regression CONF-03`). |

Les six axes : `SEC` sécurité & authentification · `DATA` données & modèle · `FONC` métier &
fiabilité · `PERF` performance & coût · `PROP` code mort & duplication · `CONF` config, déploiement &
tests. Chacun a sa checklist dans `skills/audit/references/axes/`, chargée seulement s'il est retenu.

**Deux fichiers, dans le `.claude/` du projet audité :**

- `.claude/audit-notes.md` — **optionnel, à toi.** Axes sans objet ici, chemins où vit le modèle,
  découpage en domaines, pièges maison, hors périmètre. Gabarit dans
  `skills/audit/references/audit-notes-template.md`. Sans lui l'audit tourne quand même, il connaît
  juste moins le terrain.
- `.claude/audit-log.md` — **écrit par la skill**, sans demander. Tous les constats, avec un id
  stable (`SEC-03`), un statut (`ouvert` · `corrigé` · `écarté` · `accepté`), le **test qui permet de
  le rejouer** et la version où le correctif a atterri. C'est le seul fichier qu'elle modifie : elle
  ne touche jamais au code.

**Enchaîner les passages.** Le rapport ne détaille que les huit constats les plus graves par axe,
mais le journal reçoit tout. Tu corriges, tu relances : la skill re-vérifie les `corrigés`, saute ce
qui est marqué `écarté`, et détaille la suite de la file au lieu d'en retirer une nouvelle. Chaque
rapport s'ouvre sur `nouveaux · corrigés · régressions · re-testés · restants` et se termine par ce
qui **n'a pas** été examiné.

**Non-régression.** Un `corrigé` n'est pas figé : son test reste dans le journal et est rejoué aux
passages suivants, pas seulement au premier. Un correctif qui casse trois versions plus tard rouvre
**le même id** — pas un constat neuf — et remonte dans le rapport même si d'autres sont plus graves.
`/audit regression` fait ce seul travail, pour une fraction du coût d'une passe.

Méthode complète : [skills/audit/SKILL.md](skills/audit/SKILL.md).

## Les notes projet — `deploy`, `test`, `doc`, `kit-sync`, `perms`

Ces skills portent la **méthode** ; ce qui varie d'un dépôt à l'autre vit dans un fichier de notes du
projet, sur le modèle d'`audit-notes.md`. C'est ce qui leur permet de servir n'importe quel dépôt
sans en connaître aucun.

| Skill | Fichier | Sans lui |
|---|---|---|
| `deploy` | `.claude/deploy-notes.md` | **la skill s'arrête** — une commande de déploiement inventée ne se rattrape pas |
| `test` | `.claude/test-notes.md` | tourne quand même, en déduisant les étapes de `package.json` |
| `doc` | `.claude/doc-notes.md` | tourne quand même, en reconstituant la carte à chaque passage |
| `kit-sync` | `.claude/kit-notes.md` | demande une fois le projet frère et le chemin du socle, puis tourne — la comparaison est en lecture seule |
| `perms` | `.claude/perms-notes.md` | tourne quand même, mais re-propose à chaque passage les entrées qu'on a décidé de garder |

**`ci` ne crée pas un sixième fichier de notes** : les étapes qu'elle doit rejouer sont déjà décrites
dans `test-notes.md`, les cibles et les secrets dans `deploy-notes.md`. Une skill qui réclame ses
propres notes pour redire ce qui est écrit à côté fabrique la divergence qu'on passe ensuite son temps
à réconcilier.

Deux skills tiennent en plus un **journal**, écrit sans demander parce que c'est un fichier
d'arbitrage et non du code : `.claude/audit-log.md` (les constats et leur test de re-vérification) et
`.claude/kit-log.md` (les divergences de socle déjà arbitrées, pour ne pas les resignaler).

Gabarits dans `skills/<nom>/references/<nom>-notes-template.md`. Chaque skill propose de créer le
sien en fin de run quand il manque.

**`ship` lit une seule ligne de `deploy-notes.md`** — le champ « Bumpé par » — pour savoir s'il doit
incrémenter la version au moment de committer. C'est le seul endroit où une skill lit les notes d'une
autre, et c'est voulu : la règle de version d'un projet n'existe qu'à un seul exemplaire, qu'elle
soit appliquée à l'envoi ou au déploiement. Un dépôt qui ne déclare rien ne se voit rien bumper.

### Migrer une skill locale de même nom

`deploy`, `test` et `doc` sont des noms courants : un projet qui avait déjà écrit la sienne se
retrouve avec **deux skills pour le même geste**. Le namespace les distingue quand on les tape
(`/deploy` locale, `/claude-utils:deploy`), mais le déclenchement par description, lui, a deux
candidates aux formulations identiques — et rien ne garantit laquelle part.

Migrer plutôt que cohabiter, dans cet ordre :

1. **Écrire les notes d'abord**, en vidant la skill locale de son spécifique : cibles, commandes,
   URL, secrets, pièges maison → `.claude/<nom>-notes.md` (gabarit dans
   `skills/<nom>/references/`). Ce qui reste dans la skill locale est de la méthode, donc déjà
   couvert par la version générique.
2. **Vérifier que les notes seront versionnées.** Beaucoup de projets ignorent `.claude/*` avec une
   liste blanche : un fichier de notes non déclaré y est ignoré en silence, et la skill s'arrête sur
   un clone neuf ou sur un autre poste — exactement ce que la migration voulait éviter.

   ```bash
   git status --short .claude/   # le fichier doit apparaître, en ??
   ```

   **C'est `git status` qui tranche, pas `git check-ignore`.** Dans un dépôt en liste blanche —
   le cas courant, et celui où ce contrôle sert vraiment — `check-ignore -v` affiche la ligne
   `!.claude/…-notes.md` qui **dé-ignore** le fichier : une sortie non vide qu'on lit comme un échec
   alors que tout va bien. Il rend son verdict par son code de sortie (0 = ignoré), pas par ce qu'il
   affiche. Un fichier absent de `git status` est un fichier qui ne partira pas.

3. **Mettre le poste à jour avant de supprimer quoi que ce soit** : `/update-plugins` puis
   rechargement de fenêtre. Tant que le cache est sur une version antérieure, supprimer la skill
   locale laisse le projet **sans aucune** skill pour ce geste.
4. **Comparer** : lancer la skill du plugin et vérifier qu'elle fait bien ce que faisait la locale.
   Un garde-fou maison oublié dans la migration ne se manifestera qu'en ligne.
5. **Supprimer la skill locale** une fois la comparaison faite.

Ce qui n'a **pas** vocation à migrer : une skill locale qui manipule un format de données maison ou
un écran précis. Elle ne doublonne rien et reste à sa place.

**`/ship` et `/deploy` sont séparés, et l'ordre compte.** `ship` commit et pousse, sans jamais rien
mettre en ligne ; `deploy` déploie, et appelle la procédure de `ship` au passage — parce que ce qui
part en ligne doit correspondre à un commit identifiable, sinon le retour arrière est impossible.
Un dépôt qui publie par CI est le seul cas où pousser met de fait en ligne : `deploy` le signale
avant de pousser au lieu de déployer à la main.

## Prérequis et dépannage

- **Prérequis** : Claude Code, plus **GitHub CLI authentifié** (`gh auth status`) pour `/pr-draft` et
  `/session-brief` — détail au dernier point de cette section. Le plugin lui-même n'exécute aucun
  code (pas de hook, pas de serveur MCP, pas de variable d'environnement à régler), il n'apporte que
  des skills.
- **Une skill n'apparaît pas** après installation ou mise à jour : recharge la fenêtre VS Code
  (*Developer: Reload Window*) ou `/reload-plugins` — les plugins sont chargés à l'ouverture.
- **Une skill manque alors que le plugin est listé** : elle a probablement été ajoutée dans une
  version plus récente → `/update-plugins`, ou voir [INSTALL.md](../INSTALL.md#mettre-à-jour).
- `/pr-draft` et `/session-brief` interrogent GitHub via `gh pr list`. Sans
  [GitHub CLI](https://cli.github.com/) authentifié (`gh auth status`), seules ces étapes échouent :
  la partie git locale (diff, statut, commits) fonctionne quand même.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`).
2. Ajoute ses fichiers de référence dans `skills/<nouveau-nom>/references/` si le contenu déborde.
3. **Déclare-la partout où la liste des skills existe**, bumpe la version, publie : la procédure
   complète vit dans [DEPLOYMENT.md](../DEPLOYMENT.md), § « Ajouter une skill à un plugin existant ».
   C'est **la** liste de référence — la suivre point par point plutôt que d'en tenir une seconde ici,
   car ce sont justement ses derniers points qu'on oublie.

Le dossier `skills/` est auto-découvert : rien à ajouter dans `plugin.json` pour que la skill soit
**chargée**. Elle doit en revanche y être **décrite** — la `description` du manifeste est ce qui la
rend trouvable, et `DEPLOYMENT.md` en fait le premier point de la resynchronisation.

## Historique

- **2.8.1** — correctif de périmètre sur deux skills : `eco` et `update-plugins` disent maintenant ce
  qu'elles **ne** font **pas**, section que toutes les autres portaient déjà. Une skill dont le
  périmètre n'est pas borné se fait appeler à la place d'une autre — `update-plugins` pour un
  déploiement, `eco` pour une revue de code. Aucun comportement modifié par ailleurs.

- **2.8.0** — deux skills en plus : **`perms`** et **`ci`**, qui traitent chacune un garde-fou qu'on
  croit posé et qui ne l'est plus. `perms` part d'un constat mesuré sur le poste de développement :
  **113 entrées** dans la liste `allow` du poste, **76** dans celle d'un seul projet, dont **85
  ombrées** — déjà couvertes par un motif plus large — et une bonne part devenues impossibles à
  déclencher, puisqu'elles citent un chemin de scratchpad avec l'UUID d'une session morte, une version
  d'extension VS Code figée ou un fichier de travail effacé depuis. Le problème n'est pas le volume,
  c'est que les trois entrées qui autorisent en permanence un `rm -rf`, un `sed -i` ou un
  `firebase deploy` sont noyées dedans. La skill sépare donc ce qui se traite en masse de ce qui
  s'arbitre : **supprimer une entrée ombrée ne change aucun comportement** — le geste reste autorisé
  par le motif qui la couvrait — tandis que redescendre une entrée en `ask` en change un, et se
  décide ligne par ligne. Elle propose `ask` et jamais `deny`, qui bloque même sur demande explicite
  et finit contourné à la main dans l'urgence. Deux pièges sont traités dans le détecteur d'ombrage
  livré en `references/` : `Bash(…)` et `PowerShell(…)` sont **deux listes disjointes**, si bien qu'un
  poste qui emploie les deux shells voit des doublons qui n'en sont pas ; et la portée compte autant
  que le motif — un `Read` nu déclaré dans un projet ne couvre rien en dehors de ce projet, ce qui
  interdit à une entrée projet d'ombrer une entrée poste. Le détecteur est annoncé comme un
  pré-filtre : il compare des motifs, pas la sémantique du harness. `ci` est le pendant distant de
  `/test` : une batterie qui ne tourne que sur le poste de celui qui l'a écrite est sautée le jour où
  on est pressé, et c'est ce jour-là qu'elle aurait servi. Elle ne redéfinit pas la batterie, elle la
  rejoue — les étapes viennent de `test-notes.md` ou de `package.json`, et **aucune étape n'est écrite
  sans que son script existe** : un `npm run lint` dans un projet qui n'a pas ce script échoue au
  premier run, et un workflow rouge en permanence est désactivé la semaine suivante, laissant le dépôt
  moins protégé qu'avant. Elle ne déploie rien, et refuse en particulier d'écrire la publication des
  règles de sécurité dans un workflow — les voir changer sous l'effet d'une poussée est précisément ce
  qu'on évite. Deux points repris du seul workflow maison qui existait : `npm ci` et non `npm install`,
  et surtout **identifiant public ≠ secret** — une clé d'API web posée en `secrets` plutôt qu'en `vars`
  serait vide sans que rien n'échoue, le build passerait, et l'application publiée n'annoncerait
  aucune base. Enfin `ci` distingue le voyant du garde-fou : tant que le check n'est pas exigé par la
  protection de branche, une poussée rouge entre quand même, et la skill le dit au lieu de laisser
  croire le contraire. `ci` ne réclame pas ses propres notes : elle lit celles de `test` et de
  `deploy`.
- **2.7.0** — deux skills en plus et un axe : **`handoff`**, **`kit-sync`**, et l'axe **forme** de
  `doc`. `handoff` referme une boucle ouverte dans le plugin lui-même — `eco` recommandait de laisser
  une trace de fin de session, `session-brief` déclarait la relire, et rien ne l'écrivait. Elle écrit
  dans le fichier que le projet utilise **déjà** (`ROADMAP.md`, `CHANTIERS.md`, `docs/progress.md`,
  section « État courant » du `CLAUDE.md`) plutôt que d'imposer une convention de plus, prend l'état
  depuis git et non depuis l'impression de la session — ce qui n'est pas commité n'est pas fait — et
  garde un bloc **« à ne pas refaire »** : une fausse piste non écrite est reprise à l'identique trois
  jours plus tard. Trois points de reprise au maximum, et le bloc précédent est **remplacé**, pas
  empilé : un fichier d'état qui grossit redevient du contexte à charger. `kit-sync` traite le cas
  inverse du fork : il existait une skill pour forker un modèle, aucune pour faire **remonter** un
  correctif, et deux projets frères nés du même socle en étaient à 449 lignes de divergence sur un
  seul fichier. Elle mesure la dette fichier par fichier, classe chaque écart en **progrès à
  propager** / **adaptation légitime** / **dérive accidentelle** — le tri se lit dans les commits des
  deux côtés, pas dans le diff — et propose la propagation du plus petit écart au plus grand, un
  gros merge d'un bloc étant la garantie qu'il ne sera jamais fait. Les arbitrages partent dans
  `.claude/kit-log.md` pour ne pas être re-soumis. Enfin `doc` gagne son axe **forme**, annoncé en
  2.5.0 : ordre de lecture, règle anti-mur (jamais plus de 7 puces sans une respiration), diagrammes
  mermaid plutôt que PNG exportés, encarts natifs GitHub, captures que le dépôt possède sans les
  afficher. Deux axes et non deux skills, parce que les phrases de déclenchement sont indiscernables
  et que leurs consignes se contredisent — « préserver l'ordre des sections » contre « déplace,
  replie, convertis ». `/doc` reste le fond ; `/doc forme` ne lit pas le code et ne réécrit aucune
  affirmation factuelle.
- **2.5.1** — enseignements du premier projet migré vers les skills génériques. La procédure de
  migration gagne deux étapes que le pilote a fait apparaître : **vérifier que les notes seront
  versionnées** — beaucoup de projets ignorent `.claude/*` avec une liste blanche, où un fichier de
  notes non déclaré est ignoré en silence et la skill s'arrête sur un clone neuf — et **mettre le
  poste à jour avant de supprimer la skill locale**, faute de quoi le projet se retrouve sans aucune
  skill pour ce geste le temps que le cache suive. Le gabarit de `deploy-notes.md` gagne une section
  **Enjeu** : ce qu'un déploiement raté coûte dans ce projet précis. Elle manquait, alors que c'est
  elle qui fait qu'on ne contourne pas la procédure le jour où elle gêne.
- **2.5.0** — trois skills en plus : **`deploy`**, **`test`** et **`doc`**, extraites des copies
  locales que les projets avaient dû écrire chacun de leur côté — `deploy` existait en cinq
  exemplaires, `doc` et `test` en quatre. Ce qui différait entre les copies tenait dans une poignée
  de lignes de configuration ; il part dans un fichier de notes du projet, sur le modèle
  d'`audit-notes.md`. L'intérêt n'est pas de supprimer treize fichiers, c'est qu'une leçon apprise
  dans un dépôt profite désormais aux autres : `deploy` fait dépendre l'ordre règles/hébergement du
  **sens** du changement de droits (ajouter des droits → règles d'abord ; en retirer → hébergement
  d'abord, le client ancien ne survivant pas aux règles neuves), impose de **lire** le numéro de
  version plutôt que de l'écrire en dur dans le contrôle de bundle — un contrôle qui échoue toujours
  ne contrôle rien — et refuse de conclure depuis la sortie de l'outil de déploiement, qui annonce
  aussi bien `Deploy complete!` sur une cible vide que `Skipped` sur un composant fraîchement
  publié. `test` applique la symétrique : une étape non lancée est `⏭️`, jamais `✅`, un compte de
  tests inférieur à l'attendu est un échec, et le rapport se termine par ce que la batterie n'a pas
  éprouvé. `doc` ne traite que le **fond** — la vérité vient des sources, jamais du README relu — et
  classe les écarts en `périmé` / `absent` / `inventé` ; l'axe **forme** (hiérarchie, illustrations,
  lisibilité) viendra dans une version suivante. `ship` corrige au passage un renvoi devenu faux :
  la mise en production ne relève plus d'une skill locale au projet.
- **2.4.1** — correctifs issus de la passe `/audit` sur les axes métier, perf et propreté.
  `session-brief` et `pr-draft` **détectent la branche par défaut** (`git symbolic-ref`) au lieu de
  supposer `main` : le brief de reprise et la génération de PR partaient en erreur sur tout dépôt en
  `master` ou `develop`, `session-brief` n'ayant aucune garde et `pr-draft` la sienne écrite *après*
  les commandes qui l'utilisent. `session-brief` cherche aussi la mémoire persistante au bon endroit
  (`~/.claude/projects/…`, et non un chemin relatif au projet). Côté docs, la procédure d'ajout d'une
  skill n'existe plus qu'en un seul exemplaire — `DEPLOYMENT.md` — et le README racine rappelle la
  règle « scope user **ou** project, pas les deux » là où il distribue le gabarit. Enfin, la règle
  « aucune mention d'assistant » que `ship` applique aux messages de commit **s'étend aux corps de
  PR** : `pr-draft` n'ajoute plus de pied de page `🤖 Généré avec…`, ni dans son gabarit ni dans la
  commande `gh pr create` qu'elle affiche. Enfin `audit` s'allège : les formats de sortie (plan du
  rapport, colonnes du journal) et la reconstitution du modèle quittent le `SKILL.md` pour
  `references/formats-de-sortie.md` et `references/reconstituer-modele.md`, chargés seulement au
  moment de s'en servir — le second ne l'est jamais sur un dépôt sans modèle de données.
- **2.4.0** — `audit` gagne la **non-régression**. Chaque constat du journal porte désormais son
  **test de re-vérification** (une commande qui tranche, ou `fichier:ligne` + ce qu'on doit y lire) et
  la version où le correctif a atterri, ce qui rend un point re-testable des semaines plus tard sans
  le re-déduire. Un `corrigé` n'est plus figé après une re-vérification : il est rejoué à chaque
  passage, et une régression rouvre **son id d'origine** au lieu de créer un constat neuf.
  `/audit regression` ne fait que ça — pas d'exploration, pas d'agents, restreignable à un axe ou à
  des ids. `ship` valide au passage les `.json` qui partent : un manifeste cassé passait le commit
  sans rien dire.
- **2.3.0** — `audit` refondu en **revue par axes**. Six axes (`SEC` sécurité & auth, `DATA` données &
  modèle, `FONC` métier & fiabilité, `PERF` performance & coût, `PROP` code mort & duplication,
  `CONF` config & tests), chacun avec sa checklist fermée dans `skills/audit/references/axes/`,
  chargée seulement si l'axe est retenu. `/audit` sans argument commence par demander l'axe et le
  périmètre. Trois mécanismes règlent la non-convergence d'un audit à l'autre : un **inventaire du
  périmètre** dont le rapport doit déclarer la couverture, un **barème de gravité** écrit, et un
  **journal `.claude/audit-log.md`** à ids stables — il reçoit tout ce qui est trouvé pendant que le
  rapport ne détaille que les huit constats les plus graves par axe, si bien que le passage suivant
  reprend la file et affiche un delta (nouveaux / corrigés / régressions) au lieu de retirer au sort.
  Le journal est écrit automatiquement ; le code, lui, n'est toujours pas touché.
- **2.2.0** — skill `audit` : la méthode d'audit de cohérence, jusqu'ici recopiée à la main dans
  chaque projet. Le squelette (reconstitution du modèle, grille, auto-vérification, format du
  rapport) est générique ; les spécificités d'un dépôt vivent dans son `.claude/audit-notes.md`
  (gabarit dans `skills/audit/references/`). `ship` change aussi de règle sur deux points :
  **plus aucun trailer `Co-Authored-By`** ni mention d'assistant dans les messages de commit, et
  interdiction explicite de déployer — la mise en production relève d'une skill `deploy` locale au
  projet.
- **2.1.1** — documentation : l'option `autoUpdate` des marketplaces, qui met à jour les plugins au
  démarrage sans lancer `/update-plugins`. Aucune skill modifiée dans son fonctionnement.
- **2.1.0** — deux skills en plus : `ship` (commit + push, disponible sur tous les repos) et
  `context-check` (audit du `CLAUDE.md`). `eco` couvre en plus la délégation aux sous-agents, le mode
  plan, `/rewind` et la mémoire persistante.
- **2.0.0** — suppression du hook `eco-window-check.js` (estimation locale de la fenêtre 5 h),
  remplacé par l'extension VS Code *Claude Code Usage* et la commande `/usage`, qui lisent l'usage
  réel au lieu de l'estimer. Le plugin n'exécute plus de code.
