---
name: doc
description: >-
  Réaligne le README du dépôt courant sur ce que fait réellement le code : reconstitue la vérité
  depuis les sources avant d'écrire, corrige le contenu section par section sans toucher à la
  structure existante, et ne documente que ce qui existe. À utiliser après un lot qui change le
  comportement ou l'architecture. Déclenche sur : « doc », « mets à jour la doc », « mets à jour le
  README », « régénère la doc », « documente », « le README est périmé », « réaligne la
  documentation ».
---

# doc — réaligner le README sur le code

Objectif : que le `README.md` reflète **fidèlement** le dépôt tel qu'il est — rien d'inventé, rien
de périmé. C'est l'axe **fond**. La forme (hiérarchie, illustrations, lisibilité) est un axe
distinct, à venir : cette skill ne réorganise pas la page.

Trois principes :

1. **La vérité vient du code, pas du README.** On ne corrige jamais un README en le relisant : on
   le confronte aux sources. Le README est le document le plus périmé du dépôt, c'est précisément
   pour ça qu'on l'ouvre.
2. **La structure existante est préservée.** Ordre des sections, style des titres, ton, langue :
   on met à jour le contenu, on ne redessine pas la page.
3. **Ce qui n'existe pas ne se documente pas.** En cas de doute, lire le fichier concerné plutôt
   que supposer.

## Étape 0 — Charger les notes du projet

Lire `.claude/doc-notes.md` s'il existe : il porte la carte **section du README → fichier qui fait
foi**, les fichiers annexes qui dérivent, et ce qui ne doit jamais atterrir dans un dépôt public.

**Absent** : continuer — la carte se reconstitue à l'étape 1 — et proposer en fin de run de créer le
fichier depuis [references/doc-notes-template.md](references/doc-notes-template.md). C'est lui qui
évitera de re-déduire la carte au prochain passage.

## Étape 1 — Reconstituer la vérité depuis les sources

**Toujours avant d'écrire une ligne.** Pour chaque section du README, ouvrir la ou les sources qui
font foi. Ordre de recherche par défaut, quand les notes ne disent rien :

| Ce que la section annonce | Où est la vérité |
|---|---|
| Fonctionnalités, écrans | le dossier des écrans / routes, la table de routage |
| Rôles et droits | la logique d'autorisation côté client **et** les règles côté serveur |
| Déclencheurs, tâches planifiées | les fonctions serveur — lister exactement celles qui existent |
| Modèle de données | les règles d'accès + ce que le serveur écrit réellement dans chaque document |
| Stack, scripts, versions | `package.json`, la config de build, le dossier `scripts/` |
| Installation | le fichier d'installation dédié s'il existe — **ne pas le dupliquer**, y renvoyer |
| Tests | la configuration du runner et le dossier de tests |

Les fichiers **générés** ne se documentent jamais comme des fichiers à éditer : nommer la commande
qui les produit et la source dont ils sortent.

## Étape 2 — Relever les écarts

Trois catégories, à traiter différemment :

- **Périmé** — le README décrit un comportement qui a changé. → corriger.
- **Absent** — une capacité réelle n'est documentée nulle part. → ajouter dans la section qui
  l'accueille ; ne créer une section que si aucune ne convient.
- **Inventé** — le README décrit quelque chose qui n'existe pas (ou plus). → retirer, et le
  **signaler explicitement** dans le rapport : c'est le seul écart qui a pu induire quelqu'un en
  erreur.

Mentionner comme telles les fonctionnalités **désactivées ou inactives** (dépendantes d'une clé
absente, d'un service non provisionné) plutôt que de les décrire comme disponibles.

## Étape 3 — Écrire

Conserver l'ordre des sections, le style des titres et la langue du README existant. Mettre à jour
le contenu de chaque section ; n'en ajouter une que si une vraie capacité n'a aucune place où être
documentée.

**Jamais de secret, jamais de donnée réelle.** Clés de service, jetons, identifiants : des
placeholders. Sur un dépôt public, aucune donnée de personne réelle — les exemples viennent des
données de démonstration anonymisées. Les valeurs publiques par nature (identifiant de projet, clé
d'API web qui part de toute façon dans le bundle) peuvent rester, si le projet l'assume déjà.

Quand le modèle de données est décrit, donner les **noms de champs exacts** : c'est ce que le
lecteur vient chercher.

## Étape 4 — Fichiers annexes

Un README n'est pas toujours la seule documentation. Vérifier les fichiers déclarés dans les notes
(contexte technique, guide d'installation, documents de `docs/`) : ils dérivent plus vite que le
README parce que personne ne les ouvre. Les mettre à jour dans la même passe si l'écart est
important ; sinon le signaler explicitement plutôt que de le corriger en silence.

## Étape 5 — Finaliser

- Vérifier qu'aucun **lien relatif n'est cassé** — un pointeur mort coûte plus cher qu'une section
  trop longue.
- **Doc seule = pas de déploiement.** Le proposer seulement si le lot embarque aussi du code.
- Proposer `/ship`. Ne pas committer.

## Ce que cette skill ne fait PAS

- Elle ne réorganise pas le README : ni l'ordre des sections, ni la mise en page, ni les
  illustrations. C'est l'axe forme, à venir.
- Elle n'écrit rien qu'elle n'ait vérifié dans une source relue.
- Elle n'écrit aucun secret ni aucune donnée réelle.
- Elle ne corrige pas le code quand elle trouve un écart : elle documente ce qui est, et signale
  l'anomalie.
- Elle ne committe pas et ne déploie pas.

## Sortie attendue

La liste des écarts relevés, classés `périmé` / `absent` / `inventé`, puis le README mis à jour. Les
fichiers annexes non traités sont nommés, avec l'écart constaté.
