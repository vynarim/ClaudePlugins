# Plugin `claude-uxui`

Skills UX/UI génériques pour Claude Code. Pensé pour grossir — chaque nouvelle capacité est une skill
de plus sous `skills/`.

## Pourquoi un plugin séparé de `claude-utils`

Les deux plugins portent deux axes différents, et les mélanger brouille le routeur des deux :

| | `claude-utils` | `claude-uxui` |
|---|---|---|
| Objet | le **processus** de développement | le **produit** affiché à l'utilisateur |
| Exemples | commit, non-régression, publication, permissions, README | mise en page, ergonomie, adaptation aux écrans |
| Question posée | « comment je travaille sur ce dépôt ? » | « à quoi ressemble l'application ? » |

Un dépôt sans interface n'a aucune raison d'installer `claude-uxui` ; un dépôt d'infrastructure non
plus. C'est ce qui justifie la séparation plutôt qu'une quinzième skill dans `claude-utils`.

> Une skill ne se déplace pas d'un plugin à l'autre après coup : les postes qui ont installé le
> premier gardent leur copie locale et se retrouvent avec **deux** skills pour le même geste, aux
> descriptions identiques — sans garantie sur celle qui part. D'où un plugin dès la première skill.

## Skills

| Skill | Invocation | Rôle |
|---|---|---|
| `ui-frame` | `/ui-frame` | Affiche une application mobile-only dans un cadre téléphone centré sur écran large : ratio portrait conservé, fond neutre autour, **rien de changé sous le seuil**. Traite les cinq échappées qui font rater un cadre posé à la main — scroll sur le mauvais conteneur, `position: fixed` qui dérive, portail hors cadre, `vh` calculé contre la vraie fenêtre, breakpoint JS qui lit la largeur de l'écran. |

Le dossier `skills/` est auto-découvert ; chaque skill a son `SKILL.md` et, si besoin, ses fichiers
annexes dans `skills/<nom>/references/`.

Convention de nommage : préfixe `ui-`. Sans lui, des noms comme `frame` ou `viewport` sont des mots
trop courants — le contrôle de cohérence du catalogue les « trouve » dans n'importe quelle phrase et
déclare une skill présente alors qu'elle n'est déclarée nulle part.

## Le fichier de notes — `.claude/uxui-notes.md`

**Un seul fichier pour tout le plugin**, pas un par skill : le profil d'un projet ne change pas selon
la skill qui le lit, et deux fichiers qui décrivent la même application finissent par se contredire.
Gabarit dans [`skills/ui-frame/references/uxui-notes-template.md`](skills/ui-frame/references/uxui-notes-template.md).

Il porte le **profil** (`mobile-only` · `mobile-first` · `responsive` · `desktop`), les sélecteurs
d'ancrage, le gabarit de cadre, les portails connus et les arbitrages déjà rendus.

Facultatif : sans lui, la skill détecte le profil et demande confirmation. Avec lui, elle ne repose
plus la question à chaque passage.

## Le garde-fou de profil

C'est la particularité de ce plugin, et sa raison d'exister sous cette forme. Une consigne de mise en
page appliquée au mauvais projet ne dégrade pas le résultat : elle casse la page. Chaque skill
commence donc par établir le profil, l'**annoncer**, et **s'arrêter** si le profil ne correspond pas —
jamais basculer en mode dégradé.

Concrètement, pour `ui-frame` : un dépôt qui a déjà des breakpoints desktop et des grilles
multi-colonnes est `responsive`. Y poser un cadre téléphone annulerait ce travail. La skill le dit et
n'écrit rien.

## Prérequis

Claude Code. Le plugin n'exécute aucun code — pas de hook, pas de serveur MCP, pas de variable
d'environnement : il n'apporte que des skills. La vérification finale de `ui-frame` se fait au
navigateur, manuellement ou via un serveur MCP navigateur si le poste en a un.

## Ajouter une nouvelle skill

1. Crée `skills/<nouveau-nom>/SKILL.md` (frontmatter `name` + `description`), préfixe `ui-`.
2. Ajoute ses fichiers de référence dans `skills/<nouveau-nom>/references/` si le contenu déborde.
3. **Déclare-la partout où la liste des skills existe**, bumpe la version, publie : la procédure
   complète vit dans [DEPLOYMENT.md](../DEPLOYMENT.md), § « Ajouter une skill à un plugin existant ».
   C'est **la** liste de référence — la suivre point par point plutôt que d'en tenir une seconde ici.

Pistes retenues pour la suite, dans l'ordre : `ui-viewport` (unités `vh`/`vw` mal placées,
`env(safe-area-inset-*)` absent sur encoche, breakpoints internes à un composant), `ui-a11y`
(contraste, cibles tactiles, focus visible, `prefers-reduced-motion`), `ui-review` (captures à
plusieurs tailles de fenêtre, rapport comparé). La frontière avec l'axe `PERF` de
`claude-utils:/audit` est à tenir : une skill qui redit ce qui est écrit à côté fabrique la
divergence.

## Historique

- **0.1.0** — première version. Une skill : `ui-frame`. Le plugin naît séparé de `claude-utils` parce
  que les deux axes — processus et produit — n'ont pas les mêmes déclencheurs, et parce qu'une skill
  ne se déplace pas entre plugins sans laisser un doublon sur les postes déjà à jour. Le gabarit CSS
  n'est pas écrit de zéro : il est **remonté** d'une application en production, après constat que
  trois projets frères avaient chacun leur variante et que la plus aboutie corrigeait un défaut que
  les deux autres portaient encore — `height: 90dvh` + `max-width` casse le ratio sur fenêtre haute
  et étroite, là où un `min()` à trois termes fait absorber les trois contraintes par la hauteur. D'où
  aussi le mode **réaligner** : sur un dépôt qui a déjà son cadre, la skill compare terme à terme au
  lieu d'en proposer un second, parce qu'une implémentation en place a absorbé des contraintes qu'on
  ne redécouvrira pas.
