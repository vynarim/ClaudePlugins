---
name: kit-sync
description: >-
  Compare le socle partagé (kit, template, dossier commun) entre deux projets frères nés du même
  modèle, classe chaque divergence en progrès à propager / adaptation locale légitime / dérive
  accidentelle, et propose la propagation fichier par fichier. Ne fusionne jamais rien en silence et
  tient un journal `.claude/kit-log.md` pour ne pas resignaler les écarts déjà arbitrés. À utiliser
  quand un correctif fait d'un côté doit remonter de l'autre, ou quand deux forks du même socle ont
  dérivé. Déclenche sur : « kit-sync », « compare le socle », « synchronise le kit », « propage le
  correctif à l'autre projet », « diff entre les deux projets », « le socle a divergé », « aligner
  les projets frères », « remonter le fix dans le template », « qu'est-ce qui a changé entre les deux
  apps ».
---

# kit-sync — tenir aligné un socle partagé entre projets frères

Il existe toujours une skill pour **forker** un modèle, jamais pour faire **remonter** un correctif.
Résultat : un bug corrigé dans la messagerie d'un projet n'atteindra jamais son jumeau, et le socle
diverge jusqu'à ce que la propagation devienne impossible.

Quatre principes :

1. **Toute divergence n'est pas une dérive.** Trois seaux, jamais deux : un progrès à propager, une
   adaptation locale légitime, une dérive que personne ne sait expliquer.
2. **Rien n'est fusionné en silence.** La skill propose, fichier par fichier ; l'utilisateur tranche.
   C'est la même règle qu'`audit`.
3. **Ce qui est encore identique est le capital.** Les fichiers à zéro ligne d'écart sont ce qui rend
   la synchronisation encore possible ; ils se protègent avant qu'on ne rattrape les autres.
4. **Un arbitrage rendu ne se rejoue pas.** Une adaptation déclarée légitime part au journal et n'est
   plus resignalée au passage suivant.

## Étape 0 — Charger les notes du projet

Lire `.claude/kit-notes.md` : chemin du socle, projet **source de vérité**, modules qu'un projet
assume seul, adaptations déjà arbitrées.

**Absent** : demander en une seule question le chemin du projet frère et celui du socle, puis
continuer — la comparaison est en lecture seule, elle ne risque rien. Proposer en fin de run de créer
le fichier depuis [references/kit-notes-template.md](references/kit-notes-template.md).

Lire aussi `.claude/kit-log.md` s'il existe : les écarts déjà classés `légitime` n'ont pas à être
re-arbitrés.

## Étape 1 — Inventorier et mesurer

Lister les fichiers des deux côtés, puis mesurer la divergence de chacun :

```bash
diff -rq "<A>/<socle>" "<B>/<socle>"                      # présents des deux côtés / d'un seul
diff -u "<A>/<socle>/<f>" "<B>/<socle>/<f>" | grep -c '^[+-][^+-]'   # lignes divergentes
```

Rendre un **tableau trié par divergence décroissante** : fichier · lignes A · lignes B · lignes
divergentes. C'est la carte de la dette, et le seul chiffre qui dise si le socle est encore un socle.

Les fichiers présents d'un **seul** côté forment une catégorie à part : un module qu'un projet a pris
seul n'est ni un progrès ni une dérive tant que l'autre ne le réclame pas. Les lister sans les
classer.

## Étape 2 — Classer, en s'appuyant sur l'historique

Le tri ne se devine pas à la lecture du diff : il se lit dans les commits des deux côtés.

```bash
git -C "<A>" log --oneline -5 -- "<socle>/<f>"
git -C "<B>" log --oneline -5 -- "<socle>/<f>"
```

| Seau | Signature | Ce qu'on en fait |
|---|---|---|
| 🟢 **Progrès à propager** | un commit nommé d'un côté (`fix:`, `feat:`), rien en face | proposer le portage, dans ce sens-là |
| 🔵 **Adaptation locale légitime** | le projet a une bonne raison — thème, périmètre fonctionnel, contrainte propre | journaliser, ne plus resignaler |
| 🔴 **Dérive accidentelle** | aucun commit explicatif d'aucun côté ; les deux versions font la même chose autrement | proposer le réalignement sur la source de vérité |

Un **même défaut corrigé d'un seul côté** est le cas le plus coûteux du lot : il se signale en tête
de rapport, quel que soit le nombre de lignes en jeu.

## Étape 3 — Proposer la propagation, dans l'ordre

- **Du plus petit écart au plus grand.** Un fichier à 8 lignes d'écart se porte sûrement ; un fichier
  à 400 ne se fusionne pas d'un coup — il se traite **correctif par correctif nommé**, ou pas du
  tout. Proposer un gros merge d'un bloc, c'est garantir qu'il ne sera jamais fait.
- **Un fichier à la fois**, avec le sens de propagation explicite (`A → B`) et le diff exact soumis
  avant écriture.
- **Ce qui est identique se déclare** : nommer les fichiers encore alignés, pour qu'on sache ce qu'on
  a à perdre.
- Après écriture, renvoyer à `/test` du côté receveur. Un portage de socle non testé est une
  régression en attente.

## Étape 4 — Journaliser

Écrire `.claude/kit-log.md` automatiquement — c'est un fichier d'arbitrage, pas du code. Une ligne
par écart traité : fichier, seau, décision, sens de propagation, date. Gabarit :
[references/kit-log-template.md](references/kit-log-template.md).

Sans ce journal, chaque passage re-soumet les mêmes adaptations légitimes et la skill devient un
bruit qu'on finit par ignorer.

## Ce que cette skill ne fait PAS

- Elle ne fusionne, ne renomme et ne déplace rien sans accord explicite, fichier par fichier.
- Elle ne touche **jamais** au code métier : seulement aux chemins déclarés comme socle.
- Elle ne committe pas, dans aucun des deux dépôts — c'est `/ship`, côté par côté.
- Elle ne juge pas de l'architecture du socle et ne propose pas de refonte : elle compare deux copies
  de la même chose.
- Elle ne résout pas les conflits à la place de l'utilisateur quand les deux côtés ont bougé.

## Sortie attendue

Le tableau de divergence trié, le classement en trois seaux avec la justification tirée des commits,
la liste des fichiers encore identiques, et un plan de propagation ordonné du plus sûr au plus
lourd — chaque ligne portant son sens (`A → B`) et son coût.
