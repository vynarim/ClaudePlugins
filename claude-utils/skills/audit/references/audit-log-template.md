# Journal d'audit — <PROJET>

Écrit et tenu à jour par la skill `/audit`. **Ne pas renuméroter à la main** : les ids sont stables à
vie, c'est ce qui permet à deux audits successifs de se compléter au lieu de se contredire. Un
constat qui revient après correction reprend **son** id, il n'en reçoit pas un neuf.

Statuts : `ouvert` · `corrigé` (réparé et re-vérifié — **jamais figé**, son test est rejoué aux runs
suivants) · `écarté` (faux positif, avec la raison — ne sera plus remonté) · `accepté` (vrai mais
assumé — pas remonté dans le rapport, mais re-testé quand même, un choix assumé peut cesser d'être
tenable).

## Constats

| id | Grav | Constat | Lieu | Vérif | Statut | Corrigé en | Ouvert le | Re-testé le |
|---|---|---|---|---|---|---|---|---|
| SEC-01 | 🔴 | … | `src/…:42` | `grep -n "…" src/…` → doit être vide | ouvert | — | AAAA-MM-JJ | — |

Tout ce qui est trouvé entre ici, y compris ce que le rapport n'a pas eu la place de détailler : le
journal est exhaustif, le rapport ne détaille que le haut du panier. C'est ce qui fait que l'audit
suivant reprend la file au lieu d'en tirer une nouvelle.

**Colonne `Vérif`** — le test qui décide, à lui seul, si le constat tient toujours. Une commande dont
la sortie tranche, ou `fichier:ligne` + ce qu'on doit y lire. C'est elle que `/audit regression`
rejoue des semaines plus tard ; sans elle, un constat corrigé ne se re-teste pas, il se re-devine.

**Colonne `Corrigé en`** — sha court ou version où le correctif a atterri. Sert à ne re-tester que ce
qui a bougé depuis : `git log -1 --format=%h -- <lieu>`.

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

Une ligne par run : date · axes · périmètre · nouveaux / corrigés / régressions / re-testés au vert.

- AAAA-MM-JJ — `SEC` · tout le dépôt · 6 nouveaux, 0 corrigé, 0 régression, 0 re-testé
