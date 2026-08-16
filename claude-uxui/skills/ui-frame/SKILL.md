---
name: ui-frame
description: >-
  Fait qu'une application conçue pour le téléphone s'affiche correctement sur un écran large : cadre
  portrait centré, ratio conservé, fond neutre autour — sans rien changer sur mobile. Vérifie d'abord
  le profil du projet et s'arrête si l'application n'est pas mobile-only. Traite les pièges qui font
  échouer un cadre posé à la main : scroll appliqué au mauvais conteneur, éléments `position: fixed`
  qui dérivent avec le contenu, portails qui sortent du cadre, unités `vh` calculées contre la vraie
  fenêtre, breakpoints JS qui lisent la largeur de l'écran et non celle de l'application. Détecte un
  cadre déjà posé et bascule alors en réalignement au lieu d'en proposer un second. À utiliser quand
  une application mobile s'étire sur toute la largeur d'un écran PC, ou quand un cadre existant se
  déforme, rogne une modale ou laisse dériver la nav. Déclenche sur : « ui-frame », « cadre
  téléphone », « mon app est illisible sur PC », « affiche l'app dans un cadre mobile », « l'app
  s'étire sur tout l'écran », « simuler un téléphone sur desktop », « mobile-only sur grand écran »,
  « centrer l'app dans un cadre », « le cadre se déforme », « ma modale est coupée sur PC », « la nav
  décolle quand je scrolle ».
---

# ui-frame — cadre téléphone verrouillé sur écran large

Une application dessinée pour 400 px de large affichée sur 1400 px n'est pas « un peu large » : les
lignes deviennent illisibles, les cibles tactiles filent aux deux extrémités, la nav du bas flotte au
milieu de nulle part. La corriger vraiment demanderait une version desktop. Le cadre verrouillé est
l'autre réponse : l'application garde ses proportions de téléphone, centrée, et **rien ne change sur
mobile**.

Le cadre tient en une media query. Ce qui rate, ce sont les cinq échappées : scroll posé au mauvais
endroit, `position: fixed`, portails, unités viewport ailleurs dans les feuilles de style, et JS qui
croit que la fenêtre est l'application. Elles ne se voient pas au premier coup d'œil — elles se voient
une semaine plus tard, sur une modale rognée.

## Étape 0 — Le profil, puis l'état. Avant toute chose

Deux questions dans cet ordre, et **aucune ligne écrite** avant d'y avoir répondu à voix haute.

```powershell
Select-String -Path index.html -Pattern 'name="viewport"'            # a) gabarit mobile déclaré ?
Select-String -Path src\**\*.css -Pattern '@media' | Measure-Object  # a) combien de breakpoints ?
Select-String -Path src -Recurse -Pattern 'aspect-ratio|translateZ|--app-frame-h|--app-h|--app-w'
```

**a) Le profil.** `viewport` mobile + zéro ou une media query + layout en colonne = **mobile-only**,
le cadre a du sens. Des breakpoints desktop et des grilles multi-colonnes = **responsive** : le cadre
annulerait ce travail, **s'arrêter et le dire**. Pas de `viewport`, largeurs en px larges =
**desktop**, hors périmètre.

**b) Le cadre est-il déjà là ?** Un projet mobile-only l'a souvent déjà, posé à la main, sous d'autres
noms de propriétés. Rien dans une media query desktop = mode **poser**, étapes 1 à 6. Un cadre trouvé,
quel que soit le nommage = mode **réaligner** : sauter l'étape 2, faire les étapes 3 à 6 sur
l'existant, et **ne jamais remplacer le bloc par le gabarit** — une implémentation en place a absorbé
des contraintes qu'on ne redécouvrira pas. Grille de comparaison terme à terme :
[references/cadre-telephone.md](references/cadre-telephone.md) § « Réaligner un cadre existant ».

Si `.claude/uxui-notes.md` existe, il tranche ([gabarit](references/uxui-notes-template.md)) : profil,
seuil, gabarit de cadre, nom du conteneur qui défile. Sinon, **demander confirmation du profil et du
mode détectés** — c'est le seul garde-fou avant une modification qui touche toutes les pages à la fois.

## Étape 1 — Les trois rôles à repérer

Ni deux, ni un seul. Les confondre est la cause d'échec n°1 :

1. **Le point d'entrée** — `index.html` et la feuille de style chargée partout.
2. **Le conteneur racine** — `#root`, `#app`. Il devient le cadre : hauteur fixée, `overflow: hidden`,
   il ne défile **jamais**.
3. **Le conteneur qui défile** — enfant direct, porte l'en-tête et l'écran courant. Il n'inclut ni la
   nav, ni les toasts, ni les modales, qui sont ses **frères** et non ses enfants.

## Étape 2 — Poser le cadre *(mode « poser » seulement)*

Media query desktop (seuil ~600 px), ratio portrait via `aspect-ratio`, et **la hauteur prise comme
le `min()` de trois plafonds** — hauteur de fenêtre, largeur de fenêtre, largeur mobile de référence
du projet — la largeur s'en déduisant par le ratio. Le réflexe `height: 90dvh` + `max-width: 90vw`
**casse le ratio** sur une fenêtre haute et étroite : la hauteur reste pendant que la largeur est
écrasée, et le cadre s'aplatit.

La hauteur va dans une **custom property** (`--app-frame-h`) définie **deux fois** : `100dvh` hors
media query, la hauteur du cadre dedans. Tout ce qui calculait en `vh` (étape 5) s'y branche alors en
une seule formule, valable des deux côtés du seuil.

CSS complet, valeurs et raisons de chacune : [references/cadre-telephone.md](references/cadre-telephone.md).

## Étape 3 — Séparer le cadre fixe du conteneur qui défile

**Piège contre-intuitif, et le plus coûteux.** Le `transform` posé sur le conteneur racine en fait le
bloc de confinement de ses descendants `fixed` — mais si ce même conteneur défile, ses descendants
`fixed` défilent **avec lui**, comme s'ils étaient en `position: absolute` : la nav du bas dérive dès
le premier coup de molette. Donc `overflow: hidden` sur le racine, `overflow-y: auto` sur le conteneur
de contenu, jamais les deux au même endroit. Vérification qui tranche —
`getBoundingClientRect()` d'un élément fixe avant et après un scroll molette : s'il bouge, le scroll
est sur le mauvais élément.

## Étape 4 — Les échappées

Trois recherches, dans cet ordre :

```powershell
Select-String -Path src -Pattern 'position:\s*fixed' -Recurse
Select-String -Path src -Pattern 'createPortal|Teleport' -Recurse
Select-String -Path src -Pattern '\d+(vh|dvh|vw)|innerWidth|innerHeight|matchMedia' -Recurse
```

- **`fixed`** — couverts par le confinement de l'étape 2, à condition d'être des descendants DOM du
  conteneur racine.
- **Portails** — un `createPortal(…, document.body)` échappe au cadre quelle que soit la CSS posée
  dessus. Le recibler vers le conteneur racine, **sans le supprimer** : il existe souvent pour une
  raison légitime (échapper au `transform` d'une animation de swipe).

## Étape 5 — Les unités et les seuils qui ignorent le cadre

Une `max-height: calc(100vh - 150px)` sur une modale se calcule contre la **vraie** fenêtre. Sur un
grand écran la modale tient sous son plafond, ne déclenche donc pas son scroll interne, et se fait
rogner en silence par l'`overflow: hidden` du cadre — bouton de fermeture compris, sans aucun moyen
d'y accéder. Remplacer par `var(--app-frame-h)`, **une seule fois, hors media query** : la propriété
vaut `100dvh` sous le seuil, donc la formule redonne le comportement mobile d'origine.

Deux pièges muets, détaillés dans [references/cadre-telephone.md](references/cadre-telephone.md) :
une `var()` non définie invalide la déclaration entière sans aucune erreur, et un ancêtre mis à
l'échelle (`zoom`, `scale()`) fait valoir `90dvh × facteur` à un `90dvh` écrit dessous.

Même logique en JS : un seuil de geste, un calcul de colonnes ou un mode « tablette » déclenché par
`innerWidth` part sur 1400 px au lieu des ~400 px du cadre. Corriger par Container Queries
(`@container`) ou par une mesure prise sur le conteneur, jamais sur le viewport.

## Étape 6 — Vérifier au navigateur

Redimensionner vraiment, pas seulement regarder. La matrice des tailles et ce qu'on doit voir à
chacune : [references/cadre-telephone.md](references/cadre-telephone.md) § « Vérification ». Le cas
qu'on oublie est la **fenêtre haute** : c'est là que les `vh` de l'étape 5 se manifestent.

Puis build de prod, et résumé des fichiers touchés.

## Ce que cette skill ne fait PAS

- Elle ne pose rien sans avoir annoncé le profil **et le mode** détectés, puis obtenu confirmation —
  un projet responsive ou desktop la fait **s'arrêter**, pas basculer en mode dégradé.
- Elle ne remplace jamais un cadre existant par son gabarit : une implémentation en place a absorbé
  des contraintes qu'on ne redécouvrira pas. Elle compare et signale.
- Elle ne crée aucun composant et ne refond aucun écran : CSS et HTML globaux, plus la cible d'un
  portail existant et les formules `vh` d'éléments individuels.
- Elle ne change **rien** en dessous du seuil : tout tient dans une media query desktop.
- Elle ne supprime pas un portail existant — elle le recible.
- Elle ne juge ni les couleurs, ni les contrastes, ni les cibles tactiles.
- Elle ne committe pas et ne déploie pas — c'est `/ship` et `/deploy`.

## Sortie attendue

Le profil et le **mode** (`poser` / `réaligner`), et sur quoi ils se fondent. Les trois rôles, nommés
par leur sélecteur réel. En mode réaligner, un tableau terme à terme existant ⇄ gabarit, avec ce qui
manque et pourquoi c'est un défaut — pas un diff brut. En mode poser, le diff CSS proposé. Le tableau
des échappées trouvées — élément · type (`fixed` / portail / `vh` / zoom / JS) · correctif — y compris
les lignes « rien trouvé », qui sont une information. Le résultat de la vérification taille par
taille, et ce qui n'a **pas** pu être vérifié.
