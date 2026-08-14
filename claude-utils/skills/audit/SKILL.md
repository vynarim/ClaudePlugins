---
name: audit
description: >-
  Audit de cohérence d'un dépôt : confronte le modèle de données réel — tel qu'il est écrit dans le
  code, pas dans une spec — au comportement des écrans, formulaires, handlers et règles de sécurité,
  puis rend un diagnostic classé par gravité (bugs, champs hors-modèle, états incohérents,
  cascades/orphelins, validations et droits manquants). Read-only : ne modifie aucun code. À utiliser
  quand l'utilisateur veut une revue de cohérence ou de sécurité. Déclenche sur : « audit », « audite
  le code », « analyse le code », « cherche les incohérences », « écarts entre le modèle et les
  formulaires », « revue de cohérence », « revue de sécurité », « qu'est-ce qui cloche dans l'app ».
---

# audit — cohérence modèle ⇄ code

Produit un **diagnostic** des écarts entre le modèle de données réel et ce que font réellement les
écrans, les handlers et les règles. **Read-only** : la skill n'écrit aucun code ; elle termine en
*proposant* les correctifs.

Principe non négociable : **le modèle métier n'est jamais codé en dur ici**. Il est reconstitué depuis
le dépôt courant à chaque exécution — c'est ce qui rend la skill portable et ce qui l'empêche
d'auditer une app imaginaire.

## Arguments

- *(défaut)* — analyse **approfondie** de toute l'app : agents parallèles + auto-vérification.
- `rapide` / `ciblé` — une seule passe, lectures ciblées, économe en tokens.
- un **domaine nommé** — restreint le périmètre (les domaines du projet sont listés dans ses notes).

## Procédure

**Étape 0 — Charger les spécificités du projet**

Lire `.claude/audit-notes.md` s'il existe : où vit le modèle ici, pièges maison, domaines à découper,
faux positifs déjà écartés, ce que la batterie de tests couvre déjà. Ces notes **complètent** la
grille générique, elles ne la remplacent pas. Lire aussi le `CLAUDE.md` du projet. Ne pas explorer
au-delà à ce stade.

Pas de fichier de notes ? Auditer quand même, et **proposer de le créer en clôture** à partir de
[references/audit-notes-template.md](references/audit-notes-template.md) — la passe en cours fournit
justement de quoi le remplir.

**Étape 1 — Reconstituer le modèle**

Chercher dans cet ordre, en s'arrêtant à ce que le dépôt possède réellement :

1. **Formes de départ** — seeds et fixtures (exports `INITIAL_*`, `seedData`), schémas déclarés
   (Prisma, zod, types TS), migrations SQL.
2. **Écritures serveur** — Cloud Functions, routes API, handlers : quand le serveur écrit, c'est lui
   qui fixe la forme réelle des documents, pas le client.
3. **Couche d'accès** — `db.js`, repository, ORM : comment passent les écritures (`create`/`update`/
   `remove`, patch vs set, opérations sur tableaux).
4. **État global & abonnements** — `App.jsx`, store, hooks : ce qui est lu, filtré, dérivé.
5. **Règles & sécurité** — `firestore.rules`, policies, middlewares d'autorisation.

Noter par entité : **champs**, **types** (nombre vs chaîne, format de date, tableaux d'ids, maps,
booléens), **id de document** (composite déterministe ?), et **qui écrit** (client ou serveur).

Produire une **note de modèle courte** (entité → champs → qui écrit). Elle sert de référence à toute
la suite ; sans elle, l'analyse invente.

**Étape 2 — Confronter le code au modèle**

*Mode défaut* : lancer plusieurs agents `general-purpose` **en parallèle**, un par domaine, chacun
recevant la note de modèle + la grille + les notes projet. Découpage type, à adapter : création/
édition de contenu · gestion & admin · cœur applicatif (handlers, état global, temps réel) ·
sécurité (règles confrontées à ce que le client écrit vraiment).

*Mode rapide/ciblé* : pas d'agent, lectures ciblées, même grille.

### Grille de recherche

1. **Champs hors-modèle** écrits par un formulaire ou un handler ; à l'inverse, champs du modèle
   jamais lus ni édités (code mort). Classe la plus fréquente après un renommage fait d'un seul côté.
2. **Types incohérents** — nombre stocké en `""`, `Number("") → 0` au lieu de vide, date mal
   formatée, tableau traité comme scalaire.
3. **États exclusifs** (`approved`/`refused`/`archived`, `lobby`/`playing`/`ended`) — l'exclusivité
   est-elle garantie à l'écriture ? chaque écran re-filtre-t-il correctement (listes, KPI, planning) ?
4. **Cascades & orphelins** — supprimer un parent laisse-t-il des enfants (sous-collections,
   références `xxxId`, conversations) ? le libellé de confirmation dit-il la vérité ?
5. **Validations & limites** — capacité vs effectif, bornes absentes, fin avant début, chevauchement,
   valeur négative. Attention aux **créneaux qui passent minuit** : comparer `HH:MM` brut sans
   ajouter un jour quand fin < début fausse durées et chevauchements.
6. **Id de document déterministe** — respecté partout (création, toggle, suppression) ? `update` sur
   un document qui peut ne pas exister ?
7. **Droits** — rôle global vs rôle par entité ; auto-promotion ; chemins détournés (un import de
   fichier qui injecte un flag privilégié sans le garde-fou de l'UI). Les **états lecture seule**
   doivent être gardés dans **chaque handler d'écriture**, pas seulement masqués côté affichage.
8. **Autorité serveur vs client** — quelles écritures passent par le serveur (qui contourne les
   règles) et lesquelles sont directes ? une écriture sensible faite côté client ? des règles trop
   permissives qui laissent modifier un champ réservé au serveur ?
9. **Compteurs & agrégats** — initialisation manquante, double comptage, deux endroits qui
   recalculent la même chose et divergent.
10. **Valeurs par défaut divergentes** d'un point d'entrée à l'autre (création vs affichage).
11. **Sources dupliquées** — copie générée non régénérée ou non déployée, prédicat métier redupliqué
    à la main d'un côté, liste réécrite en dur alors qu'elle est dérivée ailleurs.
12. **Logique morte, conditions impossibles, races** — lecture suivie d'une écriture non
    transactionnelle, id séquentiel `max+1` en temps réel.

**Retour exigé de chaque agent**, pour chaque constat — les 7 éléments, pas un télégramme :
`fichier:ligne` + **citation** du code décisif · **ce qui se passe** (l'écran ou le bouton concret, en
langage simple) · **pourquoi c'est un problème** (la règle du modèle violée) · **scénario
reproductible** · **impact observable** · **piste de correction** en une ligne · **classe**
`[SÉCURITÉ]` / `[BUG]` / `[INCOHÉRENCE]` / `[MINEUR]`.

**Étape 3 — Auto-vérifier avant d'affirmer**

Relire **soi-même** au `fichier:ligne` tous les `[SÉCURITÉ]` et les `[BUG]` les plus sévères : un
agent peut halluciner une ligne, un champ ou une règle. Marquer **✅ vérifié** vs *rapporté*. Un faux
positif coûte plus cher qu'un oubli.

Si le projet a une batterie d'intégrité, la lancer plutôt que re-signaler à la main ce qu'elle couvre.

**Étape 4 — Restituer**

- **Tableau par catégorie** : ⚠️ Sécurité → 🔴 Bugs confirmés → 🟠 Incohérences → 🟡 Mineurs / code
  mort. Colonnes `# | Constat | Lieu | Impact | Vérifié`, trié du plus grave au moins grave.
- **Détail par constat** (même numérotation), reprenant les 7 éléments, avec des liens
  `[fichier.jsx:42](src/...#L42)` cliquables. Dense mais complet : quelqu'un qui n'a pas le code sous
  les yeux doit comprendre. Pour les 🟡, un résumé + lieu + impact suffisent.
- **❌ Écartés** : les faux positifs relus, avec la raison — c'est ce qui évite de refaire le tour au
  prochain audit ; proposer de les recopier dans `.claude/audit-notes.md`.
- **Synthèse actionnable** : `Prio | Action | Risque du correctif | Décision requise ?`, en séparant
  le lot « faible risque, corrigeable tout de suite » de ce qui demande un arbitrage produit.
- **Clôture** : proposer de corriger d'abord sécurité + bugs confirmés à faible risque, puis de
  relancer les tests du projet, puis `/ship`. **Ne rien écrire sans l'accord de l'utilisateur.**

## Ce que cette skill ne fait PAS

- Elle n'écrit, ne corrige et ne committe rien — même un correctif d'une ligne attend l'accord.
- Elle ne présume aucun nom d'entité, d'écran ou de champ : tout vient du dépôt courant.
- Elle n'explore pas hors du périmètre demandé ; en mode approfondi elle délègue la largeur aux
  agents et ne relit elle-même que pour vérifier.
- Elle n'affirme rien qui ne s'appuie sur une ligne réelle relue.

## Sortie attendue

La note de modèle (courte), puis le rapport classé, la section des faux positifs écartés, et la
synthèse priorisée. Aucun fichier modifié.
