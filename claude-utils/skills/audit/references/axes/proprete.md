# Axe PROP — Propreté : code mort & duplication

Deux familles qui se traitent ensemble parce qu'elles se répondent : ce qui ne sert plus, et ce qui
sert en double.

Règle de restitution propre à cet axe : **la duplication ne se signale que si une divergence est
constatée ou probable**. Deux copies identiques et stables sont un choix, pas un défaut. Le constat
utile est « ces deux copies ne disent déjà plus la même chose », ou « la prochaine correction n'en
touchera qu'une ».

## Points d'entrée

Exports et imports · table de routes vs écrans existants · `package.json` vs imports réels ·
fichiers générés et leur source · constantes et listes en dur · prédicats métier (`isX`, `canY`)
répétés.

## Checklist — code mort

1. **Export jamais importé**, composant jamais monté, écran non routé, route non atteignable depuis
   l'UI.
2. **Fonction, handler ou prop** référencés nulle part ; paramètre toujours passé avec la même
   valeur.
3. **Feature flag mort** — toujours vrai ou toujours faux, branche `if (false)`, bloc commenté en
   masse laissé « au cas où ».
4. **Dépendance déclarée non utilisée**, et l'inverse : dépendance utilisée sans être déclarée
   (elle marche par transitivité, jusqu'au jour où elle disparaît).
5. **Fichier, asset, traduction ou variable d'env orphelins** — plus personne ne les référence.

## Checklist — duplication

6. **Même prédicat métier réécrit** à deux endroits — comparer les deux versions : disent-elles déjà
   des choses différentes ?
7. **Source générée non régénérée ou non déployée** — le fichier généré diverge de sa source, ou la
   copie déployée n'est pas celle du dépôt.
8. **Constante ou liste réécrite en dur** alors qu'elle est dérivée ailleurs (statuts, rôles, libellés,
   ordres de tri).
9. **Deux composants ou écrans quasi identiques** dont un seul a reçu le dernier correctif.
10. **Règle de validation dupliquée client/serveur** — normal en soi, défaut dès que les deux bornes
    ne coïncident plus.

## Faux positifs classiques

- Un export destiné à une API publique, un point d'entrée de plugin, un fichier chargé par
  convention (routes de framework, tests, scripts) : non référencé ne veut pas dire mort.
- Une duplication assumée et documentée (frontière entre deux modules qu'on ne veut pas coupler).
- Du code appelé dynamiquement (chaîne, `require` calculé, injection) : vérifier avant d'affirmer.

## Gravité sur cet axe

Jamais 🔴 seul — sauf si le code mort masque un vrai défaut (un garde de sécurité désormais
inatteignable, une branche de sécurité rendue inopérante par un flag mort). 🟠 pour une divergence
active entre deux copies. 🟡 pour le reste.
