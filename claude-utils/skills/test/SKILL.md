---
name: test
description: >-
  Joue la batterie de non-régression du dépôt courant — lint, unitaires, build, puis les étapes
  lentes (règles sur émulateur, E2E) — et rend un tableau ✅/❌ par étape. Ne touche jamais la
  production, ne committe rien, et déclare ce que la batterie n'a pas éprouvé. À utiliser quand
  l'utilisateur veut valider une modification, ou avant un /ship. Déclenche sur : « test »,
  « lance les tests », « joue la batterie », « vérifie la non-régression », « valide », « est-ce que
  ça casse quelque chose », « ça passe encore ? ».
---

# test — batterie de non-régression du dépôt courant

Valider qu'une modification n'a pas introduit de régression, **sans jamais toucher la production ni
une base réelle**. Diagnostic seul : en cas d'échec, localiser la cause et proposer un correctif
minimal — le commit relève de `/ship`.

Deux principes :

1. **Un vert peut mentir.** Une suite qui ne charge pas les vraies règles, un runner qui annonce
   « 10 passés » sans avoir exécuté un test interne, une étape sautée « parce que le lot ne la
   concerne pas » : chacun de ces cas a déjà laissé passer une régression en production. Ce qui rend
   un vert crédible se déclare (étape 3).
2. **Ce qui n'est pas couvert se dit.** Une batterie verte sur un périmètre partiel n'est pas une
   app saine.

## Étape 0 — Découvrir les étapes

Lire `.claude/test-notes.md` s'il existe : il déclare les commandes, leur ordre, ce que chacune
couvre, les pré-requis des étapes lentes et les pièges maison.

**Absent** : ne pas s'arrêter — déduire les étapes des scripts de `package.json` (ou de l'outil de
build du projet) et le dire dans le rapport. Proposer en fin de run de créer le fichier depuis
[references/test-notes-template.md](references/test-notes-template.md) : c'est lui qui rendra les
runs suivants comparables.

Ordre par défaut, du plus rapide au plus lent :

| # | Étape | Ce qu'elle attrape |
|---|---|---|
| 1 | lint | erreurs de style et de syntaxe |
| 2 | unitaires hors ligne | logique pure, intégrité du modèle |
| 3 | typecheck | contrats de types |
| 4 | build | imports cassés, erreurs de compilation sur **tous** les écrans |
| 5 | règles / intégration sur émulateur | droits réellement appliqués |
| 6 | E2E | parcours réel dans un navigateur |

**S'arrêter à la première étape qui échoue.** Les suivantes diagnostiqueraient un état déjà cassé.

## Étape 1 — Choisir le périmètre

Si les notes portent une table « ce que j'ai touché → ce que je dois rejouer », la suivre. Sinon,
règle par défaut :

- modification **d'interface seule** → étapes 1 à 4 suffisent le plus souvent ;
- modification touchant **droits, règles, modèle de données ou logique serveur** → les étapes lentes
  ne sont pas optionnelles ;
- **avant une livraison** → tout, sans condition. Un lot qui ne touche aucun fichier de règles peut
  parfaitement casser les droits qu'elles appliquent, et cela ne se verrait qu'en ligne.

## Étape 2 — Demander avant les commandes longues

Les étapes qui démarrent un émulateur, un navigateur ou un serveur de dev sont longues et ont des
pré-requis (runtime Java, émulateurs lancés en parallèle, certificat d'entreprise). **Demander
confirmation avant de les lancer** si l'utilisateur ne les a pas explicitement demandées.

Sans son pré-requis, une étape lente doit **échouer proprement** — jamais se rabattre sur la
production. Si les notes signalent qu'elle peut basculer sur une base réelle, ne pas la lancer.

## Étape 3 — Vérifier que le vert veut dire quelque chose

Pour chaque étape verte, contrôler le signe déclaré dans les notes qui prouve qu'elle a réellement
travaillé : nombre de tests attendu, ligne d'en-tête confirmant que les vraies règles ont été
chargées, message d'initialisation citant la base de test. **Un compte de tests inférieur à
l'attendu est un échec**, pas un succès plus rapide.

Si un tel signe n'est pas déclaré et que l'étape est structurellement susceptible de mentir, le dire
dans le rapport plutôt que de conclure.

## Étape 4 — Rapporter

```
## Batterie de non-régression — <projet>

| Étape | Résultat | Détail |
|---|---|---|
| lint | ✅ | 0 erreur |
| unitaires | ✅ | 161/161 |
| build | ✅ | — |
| règles (émulateur) | ❌ | 2 échecs — tests/rules.test.mjs:112 |
| E2E | ⏭️ | non lancée — <raison> |

**Non couvert** : <ce que la batterie ne touche pas, et qui pourrait donc casser sans rien allumer>
```

Une étape non lancée est `⏭️`, jamais `✅`, et sa raison est écrite. En cas d'échec : localiser la
cause, citer `fichier:ligne`, proposer un correctif minimal — **et ne rien committer**.

Rappeler ce que rien ne couvre encore quand la modification touche ces zones : la batterie sera verte
sans avoir rien éprouvé, et c'est le moment de le dire, pas après la mise en ligne.

## Ajouter un test

Suivre la convention du projet (emplacement, runner, style d'assertion) plutôt que d'en introduire
une nouvelle. Deux règles qui valent partout :

- **Un test par règle métier**, pas par ligne de code.
- **Le message d'assertion doit désigner l'enregistrement fautif**, sinon le diagnostic coûte plus
  cher que le test ne rapporte.

Si l'énumération des fichiers de test est manuelle quelque part, y inscrire le nouveau fichier — un
test jamais lancé est pire qu'un test absent.

## Ce que cette skill ne fait PAS

- Elle ne touche jamais la production ni une base réelle, et ne lance pas une étape qui pourrait y
  basculer.
- Elle ne committe rien, ne pousse rien, ne déploie rien — même après un vert complet.
- Elle n'applique pas de correctif sans accord : elle le propose.
- Elle ne déclare pas `✅` une étape qu'elle n'a pas lancée.
- Elle n'invente pas de commande : ce qu'elle n'a pas trouvé, elle le dit.

## Sortie attendue

Le tableau de l'étape 4, avec la ligne « non couvert ». Puis, en cas d'échec, la cause localisée et
le correctif minimal proposé.
