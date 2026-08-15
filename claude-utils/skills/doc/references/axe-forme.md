# Axe forme — l'ergonomie de la page

Chargé uniquement quand l'axe `forme` est retenu. Cet axe **ne lit pas le code** : il travaille sur la
page elle-même — ordre de lecture, aération, illustration. Son risque n'est pas d'affirmer du faux,
c'est de rendre une page terne ou illisible ; il se joue une fois, pas à chaque lot.

> **Un README court n'est pas un README à réparer.** Une page de 70 lignes qui dit ce qu'elle a à
> dire est finie. L'axe forme ne rallonge rien : il déplie, replie et illustre ce qui existe déjà.

## Étape F1 — Mesurer avant de toucher

Trois chiffres, pris avant toute modification, et repris tels quels dans le rapport :

```bash
wc -l README.md                       # longueur
grep -c '^\s*[-*] ' README.md         # puces
grep -c '^!\[\|<img\|<picture' README.md   # images
grep -c '<details' README.md          # sections repliées
grep -c '^```mermaid' README.md       # diagrammes
grep -c '^> \[!' README.md            # encarts natifs GitHub
```

Puis vérifier si le dépôt possède des **images qu'il n'affiche pas** — c'est le gisement le plus
courant :

```bash
ls docs/screenshots/ docs/img/ assets/ public/ 2>/dev/null
```

Un dépôt qui a des captures et ne les montre pas est le premier cas à corriger.

## Étape F2 — Structure : l'ordre de lecture

| Règle | Pourquoi |
|---|---|
| **Une phrase avant tout le reste** : ce que c'est, pour qui, quel problème ça règle. | Pas de sommaire, pas de badge, pas de logo avant d'avoir dit ça. Un lecteur qui ne sait pas ce qu'il regarde ne lit pas la suite. |
| **Une image dans le premier écran** — capture, logo ou diagramme. | C'est la règle la plus violée. Quelque chose qui n'est pas du texte, tout de suite. |
| **Démarrer en trois commandes**, juste après. | Le lecteur veut essayer, pas comprendre l'architecture. |
| **Le reste descend ou se replie** : architecture, modèle de données, déploiement. | Ce sont des sections de référence, pas d'accueil. |

## Étape F3 — Aération : la règle anti-mur

- **Jamais plus de 7 puces consécutives** sans une respiration : un tableau, une image, un titre, un
  encart. Une liste de 78 puces n'est pas lue, elle est survolée.
- **Une liste imbriquée devient un tableau.** Deux niveaux de puces signalent presque toujours des
  données à deux colonnes qui s'ignorent.
- **Le détail se replie** dans `<details><summary>…</summary>` plutôt que de s'étaler. C'est ce qui
  permet à une page longue de rester praticable — la longueur seule n'est pas le défaut, l'étalement
  l'est.
- **Les encarts natifs** sortent l'avertissement du flux sans image ni HTML :

  ```markdown
  > [!NOTE] — une précision utile      > [!TIP] — un raccourci
  > [!WARNING] — un piège coûteux      > [!IMPORTANT] — un prérequis
  ```

## Étape F4 — Illustration : ce qui marche sur GitHub

- **Mermaid en bloc de code** — GitHub le rend nativement. Un diagramme d'architecture qui vit dans
  le Markdown ne se périme pas comme un PNG exporté, et se relit dans une diff. À préférer
  systématiquement à une image pour un flux, une arborescence ou une machine à états.
- **Double thème** pour les schémas et captures, sans quoi un fond blanc devient illisible pour la
  moitié des lecteurs :

  ```markdown
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/img/schema-dark.svg">
    <img alt="<description>" src="docs/img/schema.svg">
  </picture>
  ```

  Un `alt` décrivant le contenu, jamais « schéma ».
- **Badges : quatre maximum, et informatifs** — version, licence, état du build, couverture. Pas de
  rangée décorative de technologies.
- **Emoji comme repère, pas comme décoration** : sur les titres de section de premier niveau, jamais
  en tête de chaque puce.

## Étape F5 — Restituer

Le rapport de l'axe forme donne, dans cet ordre :

1. **Les mesures avant/après** (longueur, puces, images, `details`, mermaid, encarts).
2. **Les déplacements effectués** — quelle section a bougé, et où. C'est le seul changement qui
   surprend un relecteur habitué à la page : il se liste explicitement.
3. **Les illustrations ajoutées** — et les images du dépôt restées inutilisées, avec leur chemin.
4. **Ce qui a été laissé tel quel**, et pourquoi.

## Ce que l'axe forme ne fait PAS

- Il **ne réécrit aucune affirmation factuelle**. S'il croise une section fausse, il la signale et
  renvoie à l'axe fond — il n'a pas lu le code, il n'est pas en position de trancher.
- Il ne remplace pas un README court par un README long.
- Il n'ajoute pas d'image qui n'existe pas : il utilise celles du dépôt, ou produit du mermaid.
- Il ne change ni la langue, ni le ton, ni le niveau de titre du document.
