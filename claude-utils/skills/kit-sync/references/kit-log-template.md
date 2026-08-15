# Journal de socle — <PROJET>

Écrit par la skill `/kit-sync`. Un écart arbitré ne se re-soumet pas au passage suivant : c'est ce
fichier qui l'empêche.

## Écarts arbitrés

| Fichier | Seau | Décision | Sens | Le | Raison |
|---|---|---|---|---|---|
| `messaging/MessagingCenter.jsx` | 🟢 progrès | porté | `A → B` | 2026-08-16 | correctif d'accusé de lecture fait d'un seul côté |
| `theme.js` | 🔵 légitime | laissé divergent | — | 2026-08-16 | chartes graphiques distinctes, divergence permanente |
| `shared/index.jsx` | 🔴 dérive | à traiter | `A → B` | 2026-08-16 | 248 lignes, aucun commit explicatif — à porter par correctif nommé |

Seaux : 🟢 progrès à propager · 🔵 adaptation locale légitime · 🔴 dérive accidentelle.
Décisions : `porté` · `laissé divergent` · `à traiter` · `refusé`.

## Fichiers encore identiques

<La liste, à la date du dernier passage. C'est le capital : un fichier qui sort de cette liste sans
raison est une dérive qui commence.>

- `auth.js`, `messaging/fcm.js`, `useZoom.js` — identiques au <2026-08-16>

## Passages

| Date | Sens comparé | Fichiers comparés | Divergence totale | Porté |
|---|---|---|---|---|
| 2026-08-16 | `<A>` ↔ `<B>` | 11 | 449 lignes | 0 |
