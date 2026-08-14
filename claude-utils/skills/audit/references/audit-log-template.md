# Journal d'audit — <PROJET>

Écrit et tenu à jour par la skill `/audit`. **Ne pas renuméroter à la main** : les ids sont stables à
vie, c'est ce qui permet à deux audits successifs de se compléter au lieu de se contredire.

Statuts : `ouvert` · `corrigé` (re-vérifié au run suivant, puis figé) · `écarté` (faux positif, avec
la raison — ne sera plus remonté) · `accepté` (vrai mais assumé — ne sera plus remonté).

## Constats

| id | Grav | Constat | Lieu | Statut | Ouvert le | MàJ le |
|---|---|---|---|---|---|---|
| SEC-01 | 🔴 | … | `src/…:42` | ouvert | AAAA-MM-JJ | AAAA-MM-JJ |

Tout ce qui est trouvé entre ici, y compris ce que le rapport n'a pas eu la place de détailler : le
journal est exhaustif, le rapport ne détaille que le haut du panier. C'est ce qui fait que l'audit
suivant reprend la file au lieu d'en tirer une nouvelle.

## Écartés & acceptés

| id | Constat | Pourquoi il ne sera plus remonté | Le |
|---|---|---|---|
| … | … | … | AAAA-MM-JJ |

## Couverture

Ce qui a réellement été examiné, par axe. Un axe jamais passé n'est pas un axe propre.

| Axe | Dernier passage | Périmètre couvert | Non couvert |
|---|---|---|---|
| SEC | AAAA-MM-JJ | … | … |
| DATA | — | — | jamais passé |
| FONC | — | — | jamais passé |
| PERF | — | — | jamais passé |
| PROP | — | — | jamais passé |
| CONF | — | — | jamais passé |

## Historique des passages

Une ligne par run : date · axes · périmètre · nouveaux / corrigés / régressions.

- AAAA-MM-JJ — `SEC` · tout le dépôt · 6 nouveaux, 0 corrigé, 0 régression
