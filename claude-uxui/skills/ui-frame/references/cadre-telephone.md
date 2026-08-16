# Cadre téléphone — CSS de référence et vérification

Annexe de `ui-frame`. Chargée seulement quand la skill y renvoie (étapes 2, 5 et 6).

Ce gabarit n'est pas théorique : il est repris d'une application en production, après correction des
défauts que les variantes plus naïves ont fait apparaître. Chaque écart par rapport à la version
« évidente » est justifié plus bas — ne pas le simplifier sans avoir lu pourquoi.

## Le bloc CSS

À poser dans la feuille de style **globale** — celle qui est chargée par toutes les pages — et nulle
part ailleurs. Un cadre déclaré dans le CSS d'un composant ne s'applique pas aux écrans qui ne le
montent pas.

```css
/* HORS media query : la propriété existe toujours, mobile compris, où elle vaut le viewport réel.
   C'est ce qui permet aux modales et panneaux d'écrire UNE seule formule
   `calc(var(--app-frame-h) - Npx)`, valable des deux côtés du seuil. */
#root {
  --app-frame-h: 100dvh;
}

@media (min-width: 600px) {
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100dvh;
    background: #050409; /* neutre, distinct du fond de l'application */
  }

  #root {
    --app-ratio: 412 / 915;
    --app-max-w: 480px;

    /* Hauteur = le PLUS PETIT des trois plafonds, et la largeur s'en déduit par le ratio :
         1. 90 % de la hauteur de fenêtre ;
         2. la hauteur qui donnerait pile 90 % de la largeur de fenêtre (fenêtre haute et étroite) ;
         3. la hauteur qui donnerait pile la largeur mobile de référence (fenêtre haute tout court).
       Voir « Pourquoi min() et pas max-width » plus bas. */
    --app-frame-h-raw: min(
      90dvh,
      calc(90vw * 915 / 412),
      calc(var(--app-max-w) * 915 / 412)
    );
    --app-frame-h: var(--app-frame-h-raw);

    position: relative;
    min-height: 0; /* écrase un éventuel min-height: 100vh posé sur #root hors media query */
    aspect-ratio: var(--app-ratio);
    height: var(--app-frame-h);
    width: auto;
    max-width: min(90vw, var(--app-max-w)); /* filet : ne devrait jamais avoir à intervenir */
    overflow: hidden;
    border: 1.5px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.65);
    transform: translateZ(0);
  }

  /* L'enfant unique — le composant racine de l'application. Il porte presque toujours un
     `min-height: 100vh` (souvent en style inline) hérité du plein écran mobile : sans cette
     contrainte, il dépasse la hauteur du cadre et le surplus est rogné par `overflow: hidden`,
     hors de portée du scroll interne. */
  #root > * {
    width: 100%;
    height: 100%;
    min-height: 100%;
  }

  /* Rails de défilement masqués sur tout ce qui défile DANS le cadre. Viser les descendants plutôt
     qu'une classe nommée : le conteneur qui défile change de nom d'un projet à l'autre, et les
     listes et modales internes défilent aussi. Le scroll reste actif — molette, trackpad, tactile. */
  #root * {
    scrollbar-width: none;      /* Firefox */
    -ms-overflow-style: none;   /* Edge legacy */
  }
  #root *::-webkit-scrollbar {
    display: none;              /* Chrome / Safari / Edge */
  }
}
```

> **Duplication assumée.** Le ratio est écrit deux fois : en `412 / 915` pour `aspect-ratio`, en
> `915 / 412` dans les `calc()`. `aspect-ratio` attend un rapport, `calc()` un nombre — l'un ne se
> déduit pas de l'autre en CSS. Les changer **ensemble**, ou le cadre et sa hauteur cessent de
> décrire la même chose.

## Réaligner un cadre existant

Un projet mobile-only a souvent déjà son cadre, posé à la main, sous d'autres noms de propriétés
(`--app-h` / `--app-w` au lieu de `--app-frame-h` / `--app-ratio`, cadre porté par `#root > *` au lieu
de `#root`). **Ne pas renommer, ne pas remplacer le bloc** : une implémentation en place a absorbé
des contraintes qu'on ne redécouvrira pas — un plafond calé sur une maquette, une compensation de
zoom, un contournement d'un composant tiers. Comparer terme à terme, signaler, laisser trancher.

| À chercher dans l'existant | Absent = |
|---|---|
| `transform` (ou `filter`, `will-change`) sur le conteneur du cadre | **défaut** — pas de bloc de confinement : tout `position: fixed` se cale sur la fenêtre. Signature du contournement : les modales bornées « à 95 % de la largeur du cadre » au lieu d'être confinées |
| hauteur en `min()` à trois termes | **défaut** — ratio cassé sur fenêtre haute et étroite, ou cadre plus large que ce que l'application sait remplir |
| plafond de largeur en px | **défaut** — bandes de fond sur les côtés du contenu au-delà d'une certaine hauteur de fenêtre |
| bordure à contraste réel (~0.3 d'opacité) | **défaut** — un liseré proche du fond de page rend le cadre invisible ; le comparer au fond de **page**, pas à celui de l'application |
| `overflow: hidden` sur le conteneur du cadre, et lui seul | **défaut** — voir l'étape 3 |
| custom property de hauteur définie **hors** media query | **défaut** — les formules `calc(var(…) - Npx)` sont invalides sur mobile, donc silencieusement ignorées |
| propriété consommée quelque part sans être définie nulle part | **défaut silencieux** — la règle entière est ignorée, sans erreur. Vérifier dans les sources, pas dans un commentaire |

Deux projets nés du même geste divergent vite sur ces sept lignes. Quand c'est le cas entre projets
frères, c'est `claude-utils:/kit-sync` qui porte l'alignement — pas cette skill, qui ne regarde qu'un
dépôt à la fois.

## Pourquoi `min()` et pas simplement `max-width`

La version naïve — `height: 90dvh` + `aspect-ratio` + `max-width: 90vw` — **casse le ratio**. Sur une
fenêtre haute et étroite, la hauteur reste à 90 % pendant que `max-width` écrase la largeur : le cadre
s'aplatit en rectangle qui n'est plus un téléphone. C'est précisément le cas que le `max-width` était
censé traiter.

Le `min()` inverse la logique : c'est la **hauteur** qui absorbe les trois contraintes, et la largeur
en découle toujours par le ratio. Le `max-width` reste, en filet — s'il intervient, c'est qu'un terme
manque au `min()`.

Le troisième terme (`--app-max-w`) est celui qu'on oublie. Sans lui, une fenêtre assez haute pousse le
cadre au-delà de la largeur pour laquelle l'application a été dessinée. Les composants calés en dur
sur cette largeur (en-tête, nav, barres de filtres) se recentrent alors **en dedans** du cadre, et le
fond de page apparaît en bandes sur les côtés du contenu. Poser cette valeur à la largeur mobile de
référence du projet, pas à un chiffre rond.

## Pourquoi chaque valeur

| Déclaration | Raison |
|---|---|
| `min-width: 600px` | En dessous, **aucun effet**. C'est ce qui garantit que le mobile ne bouge pas. |
| `--app-frame-h` définie **deux fois** | Hors media query = le viewport réel (mobile) ; dedans = la hauteur du cadre. Une seule formule côté modales, valable des deux côtés. |
| `dvh` et non `vh` | Sur mobile, `vh` inclut la barre d'URL rétractable et fait dépasser le contenu. L'unité doit rester cohérente des deux côtés du seuil. |
| `412 / 915` | Gabarit de téléphone courant. À remplacer par celui du projet s'il est déclaré dans les notes. |
| `border-radius: 24px` | 40 px lit comme une bulle de discussion, pas comme un téléphone. |
| `border` à **0.3** d'opacité | Un liseré à faible contraste ou une simple `box-shadow` ne se détachent pas d'un fond sombre : le cadre paraît absent alors qu'il est là. Comparer la couleur du liseré à celle du fond de page, pas à celle de l'application. |
| `background` du `body` | Distinct du fond de l'application, et **sans** son dégradé ou sa texture — sinon le cadre s'y fond. |
| `overflow: hidden` | Sur le conteneur racine **uniquement**. Voir l'étape 3 de la skill. |
| `transform: translateZ(0)` | Crée le bloc de confinement CSS des descendants `fixed`. Sans lui, la nav du bas se colle au bas de la **fenêtre**, hors du cadre. |
| `min-height: 0` | Annule un `min-height: 100vh` posé sur `#root` hors media query, qui empêcherait la hauteur du cadre de s'appliquer. |

## Le piège du zoom et des transformations d'ancêtre

Générique, et il ne se voit qu'à l'usage : **toute mise à l'échelle portée par un ancêtre — `zoom`,
`transform: scale()` — décorrèle les unités de fenêtre de ce qu'on croit mesurer.** Un `90dvh` écrit
sous un ancêtre zoomé n'est pas divisé par le zoom, mais son résultat, lui, est mis à l'échelle par
lui : il vaut donc `90dvh × zoom`, et un panneau calé dessus déborde du cadre par le bas.

Symptôme : la modale tient parfaitement sur un poste, dépasse sur un autre — le second a un zoom
d'interface actif.

Correctif : recalculer la propriété **à l'intérieur** du sous-arbre mis à l'échelle, en divisant par
le facteur.

```css
/* Le cadre lui-même est HORS du sous-arbre zoomé : il garde la valeur brute. */
#root > .sous-arbre-zoome {
  --app-frame-h: calc(var(--app-frame-h-raw) / var(--app-zoom, 1));
}
```

Le repli `, 1` n'est pas décoratif : sans lui, la formule est invalide partout où la variable de zoom
n'est pas posée, et la propriété disparaît en silence. Ne poser ce bloc que si le projet a réellement
un zoom global — le déclarer dans `.claude/uxui-notes.md` § « Contraintes propres au projet ».

## Les unités viewport ailleurs

```css
.modale-ou-panneau {
  max-height: calc(var(--app-frame-h) - 150px);
}
```

**Hors media query, une seule fois.** C'est l'intérêt de définir `--app-frame-h: 100dvh` par défaut :
sur mobile la formule redonne exactement le comportement d'origine, et il n'y a pas deux règles à
maintenir en parallèle.

⚠️ `var(--app-frame-h)` sans définition rend la déclaration entière invalide et la règle est
**silencieusement ignorée** — pas d'erreur, pas de repli visible. Vérifier que la propriété est bien
posée sur un ancêtre de l'élément qui la consomme, dans les **sources** et pas seulement dans un
commentaire.

## Vérification

Redimensionner réellement la fenêtre du navigateur, cas par cas.

| Taille | Ce qu'on doit voir |
|---|---|
| 1400 × 900 | Cadre portrait centré, bordure et arrondi nettement visibles, ~90 % de la hauteur |
| 1400 × 1300 | Le cadre **grandit** en largeur et en hauteur, ratio inchangé — jusqu'au plafond `--app-max-w`, après quoi il cesse de grandir **sans** se déformer |
| 700 × 1200 | Fenêtre haute et étroite : c'est le deuxième terme du `min()` qui mord, le ratio tient toujours |
| 390 × 844 | Identique à avant : plein écran, aucun cadre, aucune bordure |

Puis, sur une **fenêtre PC haute** (c'est là que les pièges se manifestent) :

- **La modale la plus longue de l'application** — entièrement dans le cadre, bouton de fermeture
  compris, rognée ni en haut ni en bas.
- **Un écran plus long que le cadre, scrollé à la molette jusqu'en bas** — la nav et les éléments
  fixes restent collés au cadre, ils ne dérivent pas avec le contenu.
- **Une modale, un toast, une bannière** — comparer leurs bords **réels** à ceux du cadre, pas
  l'impression visuelle de centrage. Un élément passé par un portail paraît souvent centré alors
  qu'il est centré sur la fenêtre.
- **Les côtés du contenu** — si des bandes du fond de page apparaissent entre le contenu et le
  cadre alors que l'en-tête et la nav, eux, vont bord à bord, le cadre est plus large que ce que
  l'application sait remplir : le troisième terme du `min()` manque ou est trop grand.

Les deux contrôles qui tranchent, en console :

```js
// 1. Le scroll est-il sur le bon conteneur ? (étape 3)
const avant = document.querySelector('.nav-fixe').getBoundingClientRect().top;
// scroller à la molette, puis :
document.querySelector('.nav-fixe').getBoundingClientRect().top === avant;   // false = mauvais conteneur

// 2. La propriété est-elle réellement définie ? (et pas seulement citée en commentaire)
getComputedStyle(document.querySelector('#root')).getPropertyValue('--app-frame-h');  // '' = absente
```
