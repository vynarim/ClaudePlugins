# Notes de test — <PROJET>

Spécificités projet lues par la skill `/test` (plugin `claude-utils`). La méthode et le format du
rapport vivent dans la skill — ne pas les recopier ici.

## Étapes

| # | Commande | Ce qu'elle couvre | Durée | Pré-requis |
|---|---|---|---|---|
| 1 | `<npm run lint>` | <…> | <s> | — |
| 2 | `<npm test>` | <logique pure, hors ligne — sûr à tout moment> | <s> | — |
| 3 | `<npm run build>` | <compile tous les écrans> | <s> | — |
| 4 | `<npm run test:rules>` | <droits réellement appliqués> | <min> | <émulateurs + JDK 21+> |
| 5 | `<npm run test:e2e>` | <parcours réel à N joueurs> | <min> | <émulateurs lancés en parallèle> |

## Ce qui rend chaque vert crédible

<Pour chaque étape susceptible de passer sans avoir travaillé, le signe à contrôler :>

- `<npm test>` — **<N> tests attendus**. Un total inférieur = un fichier non lancé, pas un run
  rapide. <Préciser si l'énumération des fichiers est manuelle dans `package.json`.>
- `<npm run test:e2e>` — la ligne `<🔒 règles chargées dans l'émulateur : …>` doit apparaître en
  tête de sortie. Sans elle, les tests ne valent que pour un backend **sans règles**.
  <Précédent qui a motivé le garde-fou : …>

## Périmètre → étapes à rejouer

| Ce que le lot touche | Étapes |
|---|---|
| <interface seule, styles, composants> | 1–3 |
| <modèle de données, `src/data/`> | 1–4 |
| <règles, droits, logique serveur, `functions/`> | 1–5 |
| <avant livraison> | tout, sans condition |

## Cloisonnement

<Comment la batterie est empêchée de toucher la production : base de test nommée, émulateurs,
variables d'environnement. Ce qui se passe si le pré-requis manque — l'étape doit échouer proprement,
jamais basculer sur la prod.>

<Suites supprimées et pourquoi, pour qu'elles ne soient pas recréées à l'identique.>

## Ce que rien ne couvre encore

<À dire quand la modification touche ces fichiers : la batterie sera verte sans avoir rien éprouvé.>

- `<functions/mailer.js>` — <l'expédition réelle ; un test qui poserait un faux client ne
  vérifierait que sa propre imitation>
- `<src/push.js>` — <non importable sous le runner : tire un module qui lit les variables de build>

## Ajouter un test

<Emplacement, runner, squelette minimal, et la convention socle/métier si le projet en a une.>

```js
<squelette>
```

<Si l'énumération des fichiers de test est manuelle, le rappeler ici.>
