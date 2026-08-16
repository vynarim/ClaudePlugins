---
name: perms
description: >-
  Remet de l'ordre dans les listes de permissions de Claude Code (poste et projet) : repère les
  entrées déjà couvertes par un motif plus large, celles devenues impossibles à déclencher (chemins
  de scratchpad, versions figées, fichiers disparus), et celles qui autorisent en permanence un geste
  destructeur — suppression, réécriture en place, mise en ligne — pour proposer de les redescendre en
  `ask`. Ne supprime rien sans accord et ne relâche jamais une interdiction. À utiliser quand la liste
  `allow` est devenue illisible ou qu'on ne sait plus ce qu'elle autorise. Déclenche sur : « perms »,
  « nettoie les permissions », « ma liste allow a explosé », « trop de permissions », « range mes
  autorisations », « dédoublonne les permissions », « settings.json permissions », « qu'est-ce que
  j'ai autorisé », « une commande dangereuse est autorisée », « pourquoi Claude ne me demande plus
  rien ».
---

# perms — remettre de l'ordre dans les listes de permissions

Une liste `allow` ne fait que grossir. Chaque « Yes, and don't ask again » y écrit une ligne — souvent
la commande exacte de l'instant, avec son chemin de scratchpad, son UUID de session et sa version
d'outil figée. Personne ne la relit. Au bout de quelques mois elle passe la centaine d'entrées, dont
la moitié ne peut plus jamais correspondre à quoi que ce soit, et les trois qui autorisent une
suppression sans confirmation sont noyées dedans.

Trois principes :

1. **Supprimer une entrée redondante ne change aucun comportement.** Le geste reste autorisé par le
   motif large qui la couvrait déjà. C'est ce qui rend ce lot-là sûr, et c'est le seul qu'on traite
   en masse.
2. **Redescendre une entrée en `ask` change le comportement.** C'est un arbitrage, pas du ménage :
   il revient à l'utilisateur, ligne par ligne.
3. **Le but n'est pas d'avoir moins de questions.** Une skill de nettoyage qui élargit les motifs
   pour se faire oublier a produit l'inverse de ce qu'on lui demandait.

## Étape 0 — Rassembler les listes qui s'appliquent

Trois fichiers, du plus large au plus précis :

```powershell
$env:USERPROFILE\.claude\settings.json   # poste : s'applique à tous les projets
.claude\settings.json                    # projet : versionné, donc partagé
.claude\settings.local.json              # projet : local, non versionné
```

Les lire **ensemble**, jamais un seul : c'est leur superposition qui fabrique la redondance. Annoncer
lequel est versionné avant de proposer quoi que ce soit — retirer une entrée d'un fichier partagé se
fera sentir chez les autres, retirer la même d'un `.local.json` n'engage que ce poste.

## Étape 1 — L'ombrage

Une entrée est **ombrée** quand un motif plus large, dans la même liste ou dans celle du poste, la
couvre déjà.

```powershell
node "<chemin de la skill>/references/ombrage.mjs" "$env:USERPROFILE\.claude\settings.json" ".claude\settings.json"
```

**Piège n°1 : `Bash(…)` et `PowerShell(…)` sont deux listes disjointes.** `Bash(node *)` ne couvre pas
`PowerShell(node scripts/x.mjs)`. Sur un poste qui emploie les deux shells — le cas ici — une bonne
part des doublons apparents n'en sont pas, et les supprimer rétablit des questions qu'on croyait
réglées.

Le détecteur est un **pré-filtre** : il compare des motifs, pas la sémantique exacte du harness. Ce
qu'il propose se relit à l'œil avant d'être supprimé, et ce qu'il ne trouve pas n'est pas une preuve
d'absence.

## Étape 2 — La péremption

Une entrée qui vise quelque chose de disparu ne protège plus rien et ne servira plus jamais.
Signatures : un chemin de scratchpad (`AppData\Local\Temp\claude\…` + UUID de session), une version
figée dans un chemin (`anthropic.claude-code-2.1.215-…`), un fichier de travail (`_c.js`,
`probe-tmp.mjs`, `bench.mjs`), un dossier supprimé depuis.

Vérifier plutôt que présumer — `Test-Path` sur le chemin cité par l'entrée. Passer
`additionalDirectories` au même crible : un dossier effacé y reste indéfiniment, et rien ne le
signale.

## Étape 3 — Le danger

Grille fermée. Ce qui n'a pas sa place en `allow` :

| Motif | Pourquoi |
|---|---|
| suppression — `rm *`, `Remove-Item *`, `git rm` | irréversible, et le motif large porte sur tout le dépôt |
| réécriture en place — `sed -i`, `Set-Content` | modifie des fichiers sans qu'aucun diff soit relu |
| arrêt de processus — `taskkill`, `Stop-Process` | tue autre chose que prévu dès que le motif s'élargit |
| mise en ligne — `firebase deploy*`, `npm publish` | met en production sans confirmation |
| perte de travail commité — `reset --hard`, `push --force` | détruit ce que git était censé garantir |
| outil nu sans motif — `Write`, `Edit`, `Bash` | autorise l'outil entier, pas un geste |

Proposer **`ask`**, jamais `deny` : `deny` bloque même sur demande explicite et transforme un
garde-fou en impasse, qu'on finit par contourner en éditant le fichier sous le coup de l'urgence.

## Étape 4 — La divergence entre projets frères

Deux dépôts qui font le même métier n'ont pas de raison d'avoir des politiques opposées — l'un met
`firebase deploy*` en `ask`, son jumeau l'a en `allow` et ne le sait pas. Signaler l'écart, laisser
trancher ; si le tri revient à chaque passage, c'est `/kit-sync` qui porte l'alignement.

## Étape 5 — Appliquer, un fichier à la fois

Dans cet ordre : les ombrées, les périmées, puis les arbitrages un par un. Sauvegarde avant écriture,
JSON validé après :

```powershell
Copy-Item .claude\settings.json .claude\settings.json.bak
node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));console.log('OK')" .claude\settings.json
```

Un `settings.json` cassé n'est pas une config en moins : le harness ne charge plus ni les permissions
ni les plugins qu'il déclare. Recharger la fenêtre ensuite — les réglages sont lus au démarrage de la
session.

Les entrées **gardées volontairement** partent dans `.claude/perms-notes.md`
([gabarit](references/perms-notes-template.md)), sinon le passage suivant re-propose exactement les
mêmes et la skill devient un bruit qu'on ignore.

## Ce que cette skill ne fait PAS

- Elle ne supprime aucune entrée sans accord, et ne traite jamais un lot sans l'avoir affiché.
- Elle ne touche pas à `deny` : lever une interdiction n'est pas du ménage.
- Elle n'élargit jamais un motif, et n'en ajoute pas pour réduire le nombre de questions.
- Elle ne touche à aucune autre clé du fichier — `model`, `hooks`, `statusLine`, `enabledPlugins`,
  `extraKnownMarketplaces`, `additionalDirectories` mise à part au titre de l'étape 2.
- Elle ne lit pas ce qu'exécutent les commandes autorisées : elle juge des motifs, pas du code.
- Elle ne committe pas — c'est `/ship`.

## Sortie attendue

Le compte d'entrées par fichier, avant et après. Les trois seaux en tableau — entrée · seau · raison ·
ce qui la couvre. Les arbitrages en attente listés à part, chacun avec la conséquence du passage en
`ask`. Et la liste de ce qui est gardé volontairement, avec le motif, prêt pour `perms-notes.md`.
