# Formats de sortie — rapport et journal

Lu à l'**étape 6**, quand l'analyse est finie et qu'il faut restituer. Deux formats : ce qui s'affiche
(le rapport) et ce qui reste (le journal).

## Le rapport

**Budget : 8 constats détaillés au maximum par axe**, les plus graves d'abord. Le reste part au
journal et sera détaillé au prochain passage — ne pas le perdre, ne pas l'étaler ici.

1. **Delta** en tête, une ligne : `X nouveaux · Y corrigés confirmés · Z régressions · R re-testés au
   vert · N restants au journal`. C'est ce qui montre que l'audit avance.
2. **Tableau de synthèse** : `id | Grav | Constat | Lieu | Vérifié`, trié du plus grave au moins
   grave, tous axes confondus.
3. **Détail par constat**, même numérotation, les 8 éléments du contrat de retour, avec des liens
   `[fichier.jsx:42](src/...#L42)` cliquables. Dense mais complet : quelqu'un qui n'a pas le code
   sous les yeux doit comprendre. Pour les 🟡, résumé + lieu + impact suffisent.
4. **Couverture** : par axe, `X/Y unités examinées` et **la liste de ce qui ne l'a pas été**. Section
   non négociable — c'est elle qui empêche de lire un rapport court comme un satisfecit. Y déclarer
   aussi tout écart de méthode (analyse menée sans agents, outil indisponible) : deux runs conduits
   différemment sont moins comparables, le rapport doit le dire.
5. **❌ Écartés ce run** : les faux positifs relus, avec la raison.
6. **Plan d'action** : `Prio | Action | Risque du correctif | Décision requise ?`, en séparant le lot
   « faible risque, corrigeable tout de suite » de ce qui demande un arbitrage produit.
7. **Clôture** : proposer de corriger d'abord les 🔴 vérifiés à faible risque, puis de relancer les
   tests, puis `/ship`. **Ne rien écrire dans le code sans l'accord de l'utilisateur.**

En mode `regression`, la sortie se réduit au delta, au tableau des items re-testés et aux régressions
détaillées : pas de plan d'action, pas de couverture par unité.

## Le journal

Écrire ou créer `.claude/audit-log.md`, sans demander — c'est un fichier d'audit, pas du code.
Gabarit : [audit-log-template.md](audit-log-template.md).

- **Tous** les constats du run, détaillés ou non, avec un id `<AXE>-<nn>` attribué à partir du plus
  grand numéro déjà présent pour cet axe. **Ne jamais renuméroter ni réattribuer l'existant** — un id
  vaut à vie, y compris pour un constat qui revient après avoir été corrigé.
- Pour chaque constat, son **test de re-vérification** (colonne `Vérif`) — c'est lui qui sera rejoué
  à l'étape 5 bis des runs suivants. Une ligne sans `Vérif` est une ligne qu'on ne saura pas
  re-tester.
- Statuts mis à jour : `corrigé` + `Corrigé en` (sha court ou version) pour ce qui a été re-vérifié
  comme réparé, `ouvert` de nouveau pour une régression (même id), `écarté` avec la raison pour les
  faux positifs de ce run. `Re-testé le` à la date du dernier passage au vert.
- La **couverture** par axe et une ligne d'historique du passage.

**Écrire un test qui ne se déclenche pas sur sa propre interdiction.** Un test qui cherche la chaîne
fautive (`grep -c '<chaîne>'` = 0) échouera dès que le correctif consiste à écrire une règle qui cite
cette chaîne pour l'interdire. Viser la **forme réelle** du défaut — ancrage en début de ligne,
chemin précis, structure — et non sa simple mention.

Proposer aussi, s'il manque, de créer `.claude/audit-notes.md` depuis
[audit-notes-template.md](audit-notes-template.md) — la passe en cours fournit justement de quoi le
remplir. Celui-là attend l'accord.
