# Axe PERF — Performance & coût

Ne remonter un constat qu'avec un **ordre de grandeur plausible** : combien de lignes, combien de
requêtes, à quelle fréquence. Une optimisation vraie sur 20 lignes de jeu de test n'est pas un
constat.

## Points d'entrée

Requêtes et abonnements · boucles qui contiennent un appel réseau ou une lecture · listes et
tableaux affichés · effets et hooks · chargement initial de l'app · configuration du bundle.

## Checklist

1. **N+1** — requête ou lecture déclenchée dans une boucle, ou par ligne de liste.
2. **Requête non bornée** — pas de `limit`, pas de pagination, collection entière chargée pour en
   afficher dix ou pour compter.
3. **Filtrage ou tri côté client** sur un volume qui grandit, alors que la source sait le faire.
4. **Abonnements temps réel** non désabonnés (fuite), ou re-souscrits à chaque rendu faute de
   dépendances stables.
5. **Recalcul lourd à chaque rendu** — tri, filtre, agrégation non mémoïsés ; dépendances de hooks
   trop larges ; objet ou fonction recréé et passé en prop.
6. **Sur-lecture** — charger un document entier pour un champ, refetch complet après une écriture que
   l'abonnement pousse déjà, requête relancée à chaque frappe sans anti-rebond.
7. **Écritures en rafale non groupées** alors qu'un batch ou une transaction est disponible.
8. **Chargement initial** — dépendance lourde importée pour une seule fonction, absence de découpage
   sur une route rare, travail fait au démarrage qui pourrait être différé.
9. **Assets** — image servie en pleine résolution pour une vignette, police ou icône chargée
   entièrement pour trois glyphes.
10. **Coût facturé** — là où la facture suit les lectures/écritures ou les appels d'API tierce,
    repérer les schémas qui multiplient les unités facturées (abonnement large, polling, relecture).

## Faux positifs classiques

- Micro-optimisation sur un volume borné par construction (liste de statuts, menu).
- Absence de mémoïsation sur un composant qui rend rarement.
- « Requête dans une boucle » sur une boucle de deux éléments connus.

## Gravité sur cet axe

🔴 seulement si l'app devient inutilisable ou la facture anormale à un volume déjà atteint ou proche.
🟠 pour ce qui se dégradera clairement avec la croissance prévue. 🟡 pour le reste, y compris les
fuites d'abonnement sans effet visible aujourd'hui.
