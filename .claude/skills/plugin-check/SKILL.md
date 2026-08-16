---
name: plugin-check
description: >-
  Vérifie la cohérence du catalogue de ce repo avant publication : chaque skill est-elle déclarée dans
  les six endroits que liste DEPLOYMENT.md, les deux manifestes disent-ils la même chose, les versions
  sont-elles alignées, les liens vers `references/` pointent-ils sur des fichiers qui existent. Rend un
  tableau des manques et les correctifs exacts, sans rien appliquer sans accord. À utiliser avant un
  `/ship` qui publie une version, ou après avoir ajouté une skill. Déclenche sur : « plugin-check »,
  « vérifie le catalogue », « est-ce que la skill est bien déclarée partout », « cohérence des
  manifestes », « avant de publier », « contrôle avant ship », « les versions sont-elles alignées »,
  « la skill n'apparaît pas ».
---

# plugin-check — cohérence du catalogue avant publication

Skill **interne** au repo. Une skill peut être parfaitement écrite et rester invisible : le dossier
`skills/` est auto-découvert, mais tout le reste — la description du manifeste, la marketplace, les
trois docs, le `CLAUDE.md` — est tenu à la main. Ce sont toujours les derniers points de la liste
qu'on oublie, et le symptôme arrive une semaine plus tard, sur un autre poste.

La liste de référence est celle de [DEPLOYMENT.md](../../../DEPLOYMENT.md), § « Ajouter une skill à un
plugin existant », point 4. **La relire à chaque passage** plutôt que de la recopier ici : une seconde
copie diverge, et c'est exactement le défaut que cette skill est censée trouver.

## Étape 1 — Les six déclarations

```powershell
$skills = Get-ChildItem claude-utils\skills -Directory | Select-Object -ExpandProperty Name
$cibles = @(
  'claude-utils\.claude-plugin\plugin.json',
  '.claude-plugin\marketplace.json',
  'claude-utils\README.md',
  'claude-utils\QUICKSTART.md',
  'README.md',
  'CLAUDE.md'
)
foreach ($s in $skills) {
  $manque = $cibles | Where-Object { -not (Select-String -Path $_ -Pattern ([regex]::Escape($s)) -Quiet) }
  if ($manque) { "$s -> MANQUE dans : $($manque -join ', ')" } else { "$s ok" }
}
```

**Portée du contrôle** : une absence est une certitude, une présence ne l'est pas. `test`, `doc` ou
`ci` sont des mots courants — la commande les trouve dans une phrase quelconque. Toute skill signalée
« ok » dont la déclaration est récente se re-vérifie à l'œil, dans la bonne liste.

Deux endroits échappent au comptage automatique, tous deux dans `QUICKSTART.md` : la ligne du tableau
« quelle skill pour quoi », **et** l'énumération des skills proposées par `/` à l'étape « Vérifier ».
La seconde est celle qu'on oublie.

## Étape 2 — Les deux manifestes

```powershell
node -e "const a=require('./claude-utils/.claude-plugin/plugin.json'),m=require('./.claude-plugin/marketplace.json'),b=m.plugins.find(p=>p.name==='claude-utils');console.log('description :',a.description===b.description?'identiques':'DIVERGENTES');console.log('keywords    :',JSON.stringify(a.keywords)===JSON.stringify(b.keywords)?'identiques':'DIVERGENTS');console.log('versions    : plugin',a.version,'| marketplace.metadata',m.metadata.version)"
```

Deux manifestes qui divergent donnent une recherche incohérente selon le fichier interrogé. La
version, elle, se lit à trois endroits : `plugin.json`, `metadata.version` de la marketplace, et la
colonne version du tableau des plugins du [README racine](../../../README.md). Les trois doivent
coïncider.

## Étape 3 — Frontmatter et convention maison

```powershell
Get-ChildItem claude-utils\skills, .claude\skills -Recurse -Filter SKILL.md | ForEach-Object {
  $d = $_.Directory.Name
  # -Encoding UTF8 et écrasement des retours à la ligne : sans les deux, ce contrôle ment.
  $t = (Get-Content $_.FullName -Raw -Encoding UTF8) -replace '\s+', ' '
  $nom  = if ($t -match 'name:\s*(\S+)') { $Matches[1] } else { '(absent)' }
  $decl = if ($t -match 'Déclenche sur')   { 'ok' } else { 'MANQUE' }
  $util = if ($t -match 'À utiliser')      { 'ok' } else { 'MANQUE' }
  $pas  = if ($t -match 'ne fait PAS')     { 'ok' } else { 'MANQUE' }
  "{0,-14} name={1,-14} declenche={2,-6} utiliser={3,-6} nePasFaire={4}" -f $d, $nom, $decl, $util, $pas
}
```

Ce qui est vérifié : `name` identique au nom du dossier — sinon la skill se charge sous un autre nom
que celui qu'on tape ; une `description` qui porte « À utiliser » **et** « Déclenche sur : », puisque
c'est le routeur et que sans formulations réelles la skill existe sans jamais partir ; la section
« Ce que cette skill ne fait PAS » ; et la longueur, à signaler au-delà de ~150 lignes — ce qui
déborde a sa place dans `references/`.

**Deux pièges, sans lesquels ce contrôle rend un rapport entièrement faux.** PowerShell 5.1 lit les
fichiers en ANSI par défaut : sans `-Encoding UTF8`, aucun motif accentué ne correspond et les seize
skills ressortent en `MANQUE`. Et la `description` du frontmatter est repliée sur plusieurs lignes :
sans écraser les blancs, « À utiliser quand » coupé entre deux lignes se lit comme absent. Un contrôle
qui échoue toujours ne contrôle rien — celui qui réussit toujours non plus.

### Exceptions admises

Un écart arbitré ne se resignale pas — sans quoi le rapport se remplit de constats qu'on a déjà
tranchés, et on cesse de le lire.

| Skill | Écart | Pourquoi il reste |
|---|---|---|
| `eco` | description hors gabarit : « À utiliser **DÈS QU'**une session démarre […] même sans demande explicite », puis « Déclenche **aussi** quand… » | C'est la seule skill **proactive** du plugin. Le gabarit maison décrit une skill réactive, déclenchée par une phrase de l'utilisateur ; l'y ramener ferait qu'`eco` ne partirait plus qu'après un « je sature » — c'est-à-dire trop tard. Le « aussi » est porteur : les phrases sont un déclencheur **supplémentaire**, pas la condition. |

Ajouter une ligne ici plutôt que de « corriger » une skill est le bon geste quand l'écart est un
choix. Une exception sans raison écrite n'en est pas une : c'est un défaut qu'on a renoncé à traiter.

## Étape 4 — Les liens et les orphelins

```powershell
node ".claude\skills\plugin-check\references\liens.mjs"
```

Le script traite les deux sens : les liens relatifs qui ne mènent nulle part, et les fichiers de
`references/` que plus aucun `SKILL.md` ne cite — chargés par personne, donc soit le lien manque, soit
le fichier est un reste. Il sort en `1` s'il reste un lien mort.

Deux choix à connaître pour lire sa sortie : il s'ancre sur `](` et non sur `(`, parce qu'une
parenthèse de phrase autour d'un lien fait capturer n'importe quoi à un motif plus naïf ; et il
considère un fichier comme cité si **son nom** apparaît dans le `SKILL.md`, même hors lien — un
gabarit passé en argument dans un bloc de commande est référencé, il ne serait pas honnête de le
signaler à chaque passage.

## Étape 5 — Rendre

Tableau skill × six déclarations, puis les correctifs **exacts** : le fichier, la ligne à ajouter, le
texte proposé. Rien n'est appliqué avant accord.

## Ce que cette skill ne fait PAS

- Elle ne modifie aucun fichier sans accord explicite, et n'en corrige jamais six d'un coup en silence.
- Elle ne bumpe pas la version : c'est une décision de publication, pas un défaut de cohérence.
- Elle ne juge pas le **contenu** d'une skill — sa méthode, sa pertinence : c'est `/audit`.
- Elle ne crée pas de skill — c'est `/skill-new`.
- Elle ne committe pas et ne pousse pas — c'est `/ship`.

## Sortie attendue

Le tableau des six déclarations avec ✅/❌ par skill, l'état des manifestes (descriptions, keywords,
les trois versions), les liens morts et les fichiers orphelins de `references/`, puis la liste
ordonnée des correctifs à appliquer. Et, en fin de rapport, ce que le contrôle **n'a pas** pu
trancher automatiquement — au premier chef les présences trouvées par simple recherche de mot.
