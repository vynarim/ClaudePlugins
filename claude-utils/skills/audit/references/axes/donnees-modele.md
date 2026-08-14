# Axe DATA — Données & modèle

Confronte le modèle réel — celui qui est écrit dans le code, jamais celui d'une spec — à ce que les
formulaires, les handlers et les écrans font vraiment. Exige la note de modèle de l'étape 2 : sans
elle, cet axe invente.

## Points d'entrée

Seeds et fixtures (`INITIAL_*`, `seedData`) · schémas déclarés (Prisma, zod, types TS, migrations
SQL) · écritures serveur · couche d'accès (`db.js`, repository, ORM) · formulaires et handlers de
soumission · sélecteurs et dérivations de l'état global.

## Checklist

1. **Champ hors-modèle** écrit par un formulaire ou un handler — la classe la plus fréquente après un
   renommage fait d'un seul côté.
2. **Champ du modèle jamais lu ni édité** — soit c'est du code mort, soit c'est l'autre moitié du
   renommage ci-dessus.
3. **Types incohérents** — nombre stocké en `""`, `Number("") → 0` au lieu de vide, date tantôt
   `Timestamp` tantôt chaîne, tableau traité comme scalaire, booléen à trois états
   (`true`/`false`/`undefined`) lu comme deux.
4. **Id de document déterministe** — respecté partout (création, toggle, suppression) ? `update` sur
   un document qui peut ne pas exister encore ?
5. **Cascades & orphelins** — supprimer un parent laisse-t-il des enfants (sous-collections,
   références `xxxId`, fichiers, conversations) ? Le libellé de confirmation dit-il la vérité sur ce
   qui va disparaître ?
6. **Compteurs & agrégats** — initialisation manquante, double comptage, deux endroits qui
   recalculent la même valeur et peuvent diverger.
7. **Valeurs par défaut divergentes** d'un point d'entrée à l'autre : création vs affichage vs
   import vs seed.
8. **Rétro-compatibilité** — les documents créés avant l'ajout d'un champ existent toujours ; le code
   suppose-t-il sa présence sans garde ?
9. **Dénormalisation non synchronisée** — libellé, nom ou compteur recopié dans un autre document et
   jamais mis à jour quand la source change.
10. **Unicité et intégrité référentielle supposées** mais non garanties à l'écriture (deux entités
    peuvent-elles porter la même clé ? un `xxxId` peut-il pointer dans le vide ?).

## Faux positifs classiques

- Un champ absent du seed mais écrit plus tard par un handler n'est pas hors-modèle.
- Un champ optionnel réellement traité comme optionnel partout n'est pas une incohérence.
- Une donnée dérivée volontairement recalculée à l'affichage n'est pas une dénormalisation.

## Gravité sur cet axe

🔴 quand la donnée écrite est **durablement fausse ou perdue** (orphelins, écrasement, type qui
casse un calcul). 🟠 quand un écran affiche faux mais que la donnée reste saine. 🟡 pour un champ
mort ou une divergence sans effet observé.
