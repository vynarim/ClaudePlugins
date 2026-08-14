# Axe CONF — Config, déploiement & tests

Ce qui fait qu'un code juste dans le dépôt se comporte mal une fois déployé, et ce sur quoi on croit
être couvert sans l'être.

## Points d'entrée

`.env*` et leur documentation · fichiers de règles / policies / index et leur état déployé ·
`package.json` (scripts, dépendances, lockfile) · configuration CI · dossier de tests · `README`,
`CLAUDE.md` et guides d'installation.

## Checklist

1. **Variable d'environnement** lue mais nulle part documentée ni définie ; valeur par défaut
   silencieuse qui est dangereuse en production (mode debug, compte de test, URL locale).
2. **Écart dépôt ⇄ déployé** — règles, index ou fonctions modifiés dans le dépôt mais jamais
   redéployés ; champ utilisé par le code et absent des règles ou des index.
3. **Secret committé** — `.env` non ignoré, clé présente dans l'historique git, jeton dans un fichier
   d'exemple copié tel quel.
4. **Scripts cassés** — commande de `package.json` qui pointe vers un fichier absent, commande
   documentée dans le README qui n'existe plus, procédure d'installation qui ne passe plus.
5. **Environnements confondus** — même base ou même projet en dev et en prod, URL ou identifiant en
   dur au lieu d'une variable.
6. **CI en trompe-l'œil** — absente, ou verte pour de mauvaises raisons : tests non lancés, `|| true`,
   étape désactivée, échec non bloquant.
7. **Tests qui ne couvrent pas ce qu'on croit** — zone critique sans aucun test (règles de sécurité,
   calcul métier central, migration) ; test sans assertion ; mock qui remplace précisément ce qu'on
   voulait vérifier ; test `skip` ou `only` laissé en place.
8. **Dépendances** — lockfile absent ou désynchronisé du manifeste, version épinglée connue
   vulnérable, dépendance non maintenue sur un chemin critique.
9. **Documentation contradictoire** — deux fichiers qui donnent des consignes différentes sur la même
   procédure. Fréquent dès que la même chose est documentée deux fois.

## Faux positifs classiques

- Une valeur en dur volontairement publique (URL de site, identifiant de projet).
- L'absence de CI dans un dépôt personnel assumé sans automatisation.
- Une dépendance « inutilisée » qui sert en fait à un outil (types, plugin de build, peer dependency).

## Gravité sur cet axe

🔴 pour un secret exposé ou un écart dépôt ⇄ déployé qui laisse la production sans la protection
qu'on croit avoir. 🟠 pour une CI ou des tests qui donnent une fausse assurance. 🟡 pour la
documentation et l'hygiène.
