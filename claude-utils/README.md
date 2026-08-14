# Plugin `claude-utils`

Boîte à outils générique pour Claude Code : un conteneur de **skills internes réutilisables**. Pensé
pour grossir — chaque nouvelle capacité est une skill de plus sous `skills/`.

> Installer sur un poste neuf et prendre en main les skills : [QUICKSTART.md](QUICKSTART.md).

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `eco` | `/eco` | Discipline tokens/contexte : une session = un objectif, `/clear` aux bascules, délégation aux sous-agents. |
| `audit` | `/audit` | Revue de code par axes (sécurité, données, métier, perf, propreté, config) : demande l'axe au démarrage, rend un diagnostic classé par gravité avec sa couverture, tient un journal pour que deux audits se complètent. Ne modifie aucun code. |
| `context-check` | `/context-check` | Audite le `CLAUDE.md` du projet (longueur, sections à déporter) et propose la version condensée. |
| `ship` | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique du projet. |
| `pr-draft` | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| `session-brief` | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
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
