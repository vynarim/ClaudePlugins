# Axe FONC — Métier & fiabilité

Les règles que l'app est censée tenir, et ce qui arrive quand le chemin nominal n'est pas suivi.

## Points d'entrée

Handlers de soumission et d'action · machines à états et champs de statut · calculs de dates,
durées, montants, capacités · `try/catch` et `.catch` · effets et abonnements · boutons qui
déclenchent une écriture.

## Checklist

1. **États exclusifs** (`approved`/`refused`/`archived`, `lobby`/`playing`/`ended`) — l'exclusivité
   est-elle garantie à l'écriture ? Chaque écran re-filtre-t-il correctement (listes, KPI, planning,
   exports) ?
2. **Transitions interdites atteignables** — revenir de `ended` à `playing`, re-valider une commande
   déjà payée, rouvrir un dossier clos.
3. **Validations & bornes** — capacité vs effectif, fin avant début, chevauchement, valeur négative,
   quantité nulle, borne présente à la création mais absente à l'édition.
4. **Créneaux qui passent minuit** — comparer `HH:MM` brut sans ajouter un jour quand fin < début
   fausse durées et détections de chevauchement.
5. **Dates & fuseaux** — `new Date("YYYY-MM-DD")` interprété en UTC puis affiché en local (décalage
   d'un jour), heure d'été, comparaison entre une date locale et un horodatage serveur.
6. **Erreurs avalées** — `catch {}` vide, `.catch(console.log)`, échec d'écriture qui laisse l'UI
   afficher un succès, message d'erreur générique qui masque un cas métier.
7. **Asynchrone mal tenu** — `await` manquant, promesse non attendue dans une boucle d'écriture,
   `Promise.all` qui abandonne à la première erreur en laissant l'état à moitié écrit.
8. **Races & doubles écritures** — lecture puis écriture non transactionnelle, id séquentiel `max+1`
   en temps réel, bouton de soumission non désactivé pendant l'envoi, double clic qui crée deux
   enregistrements.
9. **Idempotence** — un retry, un rechargement ou un webhook rejoué produisent-ils un doublon ?
10. **États de chargement / vide / erreur** — écran qui affiche « 0 » alors qu'il ne sait pas encore,
    liste vide indiscernable d'un échec de chargement.
11. **Logique morte ou impossible** — condition qui ne peut jamais être vraie, branche placée après
    un retour anticipé, garde qui teste une variable déjà normalisée en amont.

## Faux positifs classiques

- Une absence de transaction sur une écriture qu'un seul acteur peut déclencher n'est pas une race.
- Un `catch` qui remonte volontairement à un gestionnaire global n'est pas une erreur avalée.
- Une validation dupliquée client + serveur est normale (voir axe PROP pour la divergence).

## Gravité sur cet axe

🔴 si le chemin nominal casse, ou si l'utilisateur peut produire un état métier interdit. 🟠 pour un
cas limite réellement atteignable — écrire le scénario. 🟡 si le scénario demande une manipulation
que personne ne fera.
