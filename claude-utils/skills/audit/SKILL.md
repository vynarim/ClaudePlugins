---
name: audit
description: >-
  Audit de code structuré par axes — sécurité & authentification, données & modèle, métier &
  fiabilité, performance & coût, propreté (code mort, duplication), config & tests. Demande l'axe et
  le périmètre au démarrage, reconstitue le modèle depuis le dépôt courant, rend un diagnostic classé
  par gravité en déclarant sa couverture, et tient un journal `.claude/audit-log.md` pour que deux
  audits successifs se complètent au lieu de se contredire. Chaque constat y garde le test qui l'a
  trouvé, rejouable des semaines plus tard pour vérifier qu'un correctif tient toujours
  (`/audit regression`). Ne modifie aucun code. À utiliser quand l'utilisateur veut une revue de son
  dépôt. Déclenche sur : « audit », « audite le code », « analyse le code », « revue de cohérence »,
  « revue de sécurité », « audit de perf », « cherche le code mort », « cherche les duplications »,
  « cherche les incohérences », « écarts entre le modèle et les formulaires », « qu'est-ce qui cloche
  dans l'app », « vérifie qu'il n'y a pas de régression », « reteste ce qui a été corrigé », « est-ce
  que le correctif tient toujours ».
---

# audit — revue de code par axes

Rend un **diagnostic** classé par gravité sur un ou plusieurs **axes** choisis au démarrage. Ne
modifie aucun code : les correctifs sont proposés, jamais appliqués. Seule écriture autorisée, et
elle est automatique : le journal `.claude/audit-log.md`.

Trois principes, dans cet ordre :

1. **Rien n'est codé en dur.** Modèle, entités, écrans : tout est reconstitué depuis le dépôt courant
   à chaque exécution. C'est ce qui rend la skill portable et l'empêche d'auditer une app imaginaire.
2. **La couverture se déclare.** Un rapport dit toujours ce qui a été examiné **et ce qui ne l'a pas
   été**. Un audit propre sur un périmètre partiel n'est pas une app saine.
3. **Deux audits se complètent.** Le journal porte des ids stables et reçoit *tout* ce qui est
   trouvé ; le rapport ne détaille que le haut de la file. Un run reprend l'état laissé par le
   précédent au lieu de retirer au sort de nouveaux constats.
4. **Un constat corrigé reste re-testable.** Chaque ligne du journal porte son **test de
   re-vérification** et la version où le correctif a atterri. Un `corrigé` n'est jamais figé : il
   sort du rapport tant qu'il passe, et rien n'empêche de le rejouer six mois plus tard.

## Axes

| id | Axe | Checklist |
|---|---|---|
| `SEC` | Sécurité & authentification | [references/axes/securite-auth.md](references/axes/securite-auth.md) |
| `DATA` | Données & modèle | [references/axes/donnees-modele.md](references/axes/donnees-modele.md) |
| `FONC` | Métier & fiabilité | [references/axes/metier-fiabilite.md](references/axes/metier-fiabilite.md) |
| `PERF` | Performance & coût | [references/axes/performance.md](references/axes/performance.md) |
| `PROP` | Propreté : code mort & duplication | [references/axes/proprete.md](references/axes/proprete.md) |
| `CONF` | Config, déploiement & tests | [references/axes/config-tests.md](references/axes/config-tests.md) |

**Ne charger que les fichiers des axes retenus.** Un axe sans objet ici (pas d'auth, pas de base,
site statique) se déclare N/A dans `.claude/audit-notes.md` : il n'est alors ni proposé ni audité. Un
projet peut aussi ajouter ses propres points de checklist à un axe depuis ses notes.

## Arguments

- *(aucun)* — **pose les questions de cadrage** (étape 0). Jamais de passe complète implicite.
- un **axe** : `SEC` `DATA` `FONC` `PERF` `PROP` `CONF`, ou son nom en clair (« sécurité », « perf »,
  « code mort », « duplication »…) — part directement, sans question.
- `tout` — les 6 axes. Coûteux : annoncer l'ordre de grandeur avant de lancer.
- `rapide` — un seul axe, une passe, pas d'agents, plancher de gravité 🟠.
- un **domaine** du projet (listés dans ses notes) — restreint le périmètre, axes demandés ensuite.
- `delta` — n'examine que ce qui a changé depuis le dernier passage inscrit au journal.
- `regression` — **ne cherche rien de neuf** : rejoue les tests de re-vérification des constats
  `corrigé` et `accepté` du journal (étape 5 bis). Peut être restreint à un axe (`regression SEC`) ou
  à des ids (`regression CONF-03 CONF-05`). Coût d'un ordre de grandeur inférieur à une passe.

## Étape 0 — Cadrer

Si un argument fixe déjà l'axe, sauter cette étape. Sinon poser **les trois questions d'un coup**
(`AskUserQuestion` — 4 options maximum par question, d'où ce découpage) :

1. **Axes métier** *(multi)* : `Passe complète (les 6 axes)` · `Sécurité & authentification` ·
   `Données & modèle` · `Métier & fiabilité`
2. **Axes qualité** *(multi)* : `Aucun` · `Performance & coût` · `Propreté (code mort, duplication)` ·
   `Config, déploiement & tests`
3. **Périmètre** *(simple)* : `Tout le dépôt` · `Un domaine` (options construites depuis les domaines
   déclarés dans les notes projet) · `Ce qui a changé depuis le dernier audit`

Ne rien lire du dépôt avant la réponse — sauf `.claude/audit-notes.md`, et uniquement pour en tirer
la liste des domaines et les axes N/A.

## Étape 1 — Charger le contexte projet

- `.claude/audit-notes.md` — où vit le modèle ici, domaines, pièges maison, axes N/A, points de
  checklist maison, hors périmètre, ce que les tests couvrent déjà. Ces notes **complètent** les
  checklists d'axe, elles ne les remplacent pas.
- `.claude/audit-log.md` — constats ouverts, `écartés` (à ne plus remonter), `acceptés` et `corrigés`
  (à re-tester, chacun avec son **test de re-vérification** et la version où le correctif a atterri),
  couverture des passages précédents, dernier numéro attribué par axe.
- Le `CLAUDE.md` du projet.

Ne pas explorer au-delà à ce stade. Fichiers absents : continuer, ils seront créés en fin de run à
partir de [references/audit-notes-template.md](references/audit-notes-template.md) et
[references/audit-log-template.md](references/audit-log-template.md).

## Étape 2 — Reconstituer le modèle

Obligatoire pour `DATA`, `FONC` et `SEC` ; réduit à un survol pour `PERF`, `PROP` et `CONF`.

Chercher dans cet ordre, en s'arrêtant à ce que le dépôt possède réellement : **formes de départ**
(seeds, fixtures, schémas déclarés, migrations) → **écritures serveur** (quand le serveur écrit,
c'est lui qui fixe la forme réelle, pas le client) → **couche d'accès** (`db.js`, repository, ORM) →
**état global & abonnements** → **règles & sécurité**.

Noter par entité : **champs**, **types** (nombre vs chaîne, format de date, tableaux d'ids, maps,
booléens), **id de document** (composite déterministe ?), **qui écrit** (client ou serveur).

Produire une **note de modèle courte** (entité → champs → qui écrit). Elle est transmise à chaque
agent ; sans elle, l'analyse invente.

## Étape 3 — Inventorier le périmètre

Avant d'analyser, **lister les unités** que le périmètre contient : écrans, handlers, routes,
fonctions serveur, fichiers de règles. Par `Glob` et par la table de routes — sans les lire. Cette
liste est le dénominateur de la couverture ; elle est reprise telle quelle dans le rapport et dans le
journal. Sans elle, impossible de dire ce qui n'a pas été vu, et l'audit suivant recommence au
hasard.

## Étape 4 — Analyser, un agent par axe

*Mode normal* : un agent `general-purpose` **par axe retenu**, lancés en parallèle. Chacun reçoit :
la note de modèle · **son seul** fichier d'axe · l'inventaire du périmètre · les notes projet · la
liste des constats déjà `écartés` (à ne pas resignaler) · les `corrigés` et `acceptés` de son axe
**avec leur test de re-vérification**, à rejouer avant toute recherche neuve. Le découpage est
**toujours celui des axes**, jamais improvisé : c'est ce qui rend deux runs comparables.

*Mode `rapide`* : pas d'agent, lectures ciblées, même checklist, plancher 🟠.

**Contrat de retour de chaque agent** — pour chaque constat, les 8 éléments, pas un télégramme :

`fichier:ligne` + **citation** du code décisif · **le point de checklist** qui l'a trouvé (`SEC-4`) ·
**ce qui se passe**, en langage simple, sur l'écran ou le bouton concret · **pourquoi c'est un
problème** (la règle violée) · **scénario reproductible** · **impact observable** · **piste de
correction** en une ligne · **gravité** selon le barème ci-dessous · le **test de re-vérification**
(voir ci-dessous).

**Test de re-vérification** — obligatoire, un par constat. C'est ce qui rend le constat rejouable
sans le re-déduire : une commande qui répond seule (`grep -n "…" src/x.js`, `test -f LICENSE`, un
test de la batterie), ou à défaut `fichier:ligne` + **ce qu'on doit y lire** pour conclure que c'est
réparé. Formulé pour que « ça passe » soit sans ambiguïté. Un constat sans test de re-vérification
est un constat qu'on retrouvera au hasard.

Et, en fin de retour : **la couverture** — quelles unités de l'inventaire ont été réellement
examinées, lesquelles ne l'ont pas été, et pourquoi (budget, hors sujet pour l'axe).

## Barème de gravité

La gravité est **impact × probabilité d'atteinte**, pas une impression. Si le scénario d'atteinte ne
s'écrit pas, ce n'est pas 🔴.

- 🔴 **Critique** — données perdues, exposées ou durablement fausses ; droit contournable ; chemin
  nominal cassé.
- 🟠 **Majeur** — comportement faux sur un cas limite réellement atteignable, ou fausse assurance
  (test, CI, défense en profondeur absente).
- 🟡 **Mineur** — gêne, dette, code mort, duplication sans divergence constatée.

Chaque fichier d'axe précise ce que ces trois niveaux veulent dire pour lui.

## Étape 5 — Vérifier avant d'affirmer

Relire **soi-même**, au `fichier:ligne`, tous les 🔴, ainsi que tout constat annoncé comme
**régression** d'un item `corrigé` : un agent peut halluciner une ligne, un champ ou une règle.
Marquer **✅ vérifié** vs *rapporté*. Un faux positif coûte plus cher qu'un oubli.

Si le projet a une batterie d'intégrité ou de tests, la lancer plutôt que resignaler à la main ce
qu'elle couvre.

## Étape 5 bis — Re-tester les corrigés (non-régression)

Rejouer les **tests de re-vérification** des constats `corrigé` et `accepté` des axes retenus. À
faire à **chaque** run, pas seulement au suivant : un correctif validé une fois peut casser trois
versions plus tard.

Prioriser par ce qui a bougé — un lieu inchangé depuis le correctif ne peut pas avoir régressé :

```bash
git log -1 --format=%h -- <fichier du constat>   # comparer à la colonne « Corrigé en »
```

Trois issues, et une seule règle : **l'id ne change jamais**.

- Le test passe → reste `corrigé` (ou `accepté`), colonne `Re-testé le` mise à jour. Rien dans le
  rapport, sauf le compteur du delta.
- Le test échoue → **régression** : l'item repasse `ouvert` sous **son id d'origine**, est relu
  soi-même au `fichier:ligne` (étape 5), et est détaillé dans le rapport même si d'autres constats
  sont plus graves. Ne jamais lui donner un id neuf : c'est ce qui ferait perdre l'historique.
- Le test ne peut pas être rejoué (outil absent, dépendance non authentifiée, environnement absent) →
  `non re-testé`, avec la raison, et il compte comme non couvert.

**Mode `regression`** : le run s'arrête là. Pas d'étape 2, 3 ni 4 — aucune recherche neuve, aucun
agent. Sortie réduite au delta, au tableau des items re-testés et aux régressions détaillées.

## Étape 6 — Restituer

**Budget : 8 constats détaillés au maximum par axe**, les plus graves d'abord. Le reste part au
journal et sera détaillé au prochain passage — ne pas le perdre, ne pas l'étaler ici.

1. **Delta** en tête, une ligne : `X nouveaux · Y corrigés confirmés · Z régressions · R re-testés au
   vert · N restants au journal`. C'est ce qui montre que l'audit avance.
2. **Tableau de synthèse** : `id | Grav | Constat | Lieu | Vérifié`, trié du plus grave au moins
   grave, tous axes confondus.
3. **Détail par constat**, même numérotation, les 8 éléments, avec des liens
   `[fichier.jsx:42](src/...#L42)` cliquables. Dense mais complet : quelqu'un qui n'a pas le code
   sous les yeux doit comprendre. Pour les 🟡, résumé + lieu + impact suffisent.
4. **Couverture** : par axe, `X/Y unités examinées` et **la liste de ce qui ne l'a pas été**. Section
   non négociable — c'est elle qui empêche de lire un rapport court comme un satisfecit.
5. **❌ Écartés ce run** : les faux positifs relus, avec la raison.
6. **Plan d'action** : `Prio | Action | Risque du correctif | Décision requise ?`, en séparant le lot
   « faible risque, corrigeable tout de suite » de ce qui demande un arbitrage produit.
7. **Clôture** : proposer de corriger d'abord les 🔴 vérifiés à faible risque, puis de relancer les
   tests, puis `/ship`. **Ne rien écrire dans le code sans l'accord de l'utilisateur.**

## Étape 7 — Mettre à jour le journal

Automatique, sans demander — c'est un fichier d'audit, pas du code. Écrire ou créer
`.claude/audit-log.md` :

- **Tous** les constats du run, détaillés ou non, avec un id `<AXE>-<nn>` attribué à partir du plus
  grand numéro déjà présent pour cet axe. **Ne jamais renuméroter ni réattribuer l'existant** — un id
  vaut à vie, y compris pour un constat qui revient après avoir été corrigé.
- Pour chaque constat, son **test de re-vérification** (colonne `Vérif`) — c'est lui qui sera rejoué
  à l'étape 5 bis des runs suivants. Une ligne sans `Vérif` est une ligne qu'on ne saura pas re-tester.
- Statuts mis à jour : `corrigé` + `Corrigé en` (sha court ou version) pour ce qui a été re-vérifié
  comme réparé, `ouvert` de nouveau pour une régression (même id), `écarté` avec la raison pour les
  faux positifs de ce run. `Re-testé le` à la date du dernier passage au vert.
- La **couverture** par axe et une ligne d'historique du passage.

Proposer aussi, s'il manque, de créer `.claude/audit-notes.md` depuis le gabarit — la passe en cours
fournit justement de quoi le remplir. Celui-là attend l'accord.

## Ce que cette skill ne fait PAS

- Elle ne modifie, ne corrige et ne committe aucun code — même un correctif d'une ligne attend
  l'accord. Sa seule écriture est le journal.
- Elle ne présume aucun nom d'entité, d'écran ou de champ : tout vient du dépôt courant.
- Elle ne charge pas les axes qu'on ne lui a pas demandés, et n'explore pas hors du périmètre.
- Elle ne rend jamais un rapport sans sa section couverture.
- Elle n'affirme rien qui ne s'appuie sur une ligne réelle relue.
