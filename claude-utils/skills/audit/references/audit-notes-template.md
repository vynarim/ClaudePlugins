# Notes d'audit — <PROJET>

Gabarit du fichier `.claude/audit-notes.md` lu par la skill `/audit`. Il porte **ce qui est propre au
projet** ; la méthode, les checklists d'axe et le format du rapport vivent dans la skill. Les constats
et leur statut vivent dans `.claude/audit-log.md`, écrit par la skill — ne rien recopier ici.

Règle de survie : ce fichier doit rester court (~40 lignes). Tout ce qui vaut pour n'importe quel
dépôt n'a rien à y faire — c'est un bug de la skill, pas une note projet.

---

## Axes

Les axes sans objet ici ne seront ni proposés ni audités. Justifier en trois mots.

| Axe | État | Pourquoi |
|---|---|---|
| `SEC` sécurité & auth | actif | |
| `DATA` données & modèle | actif | |
| `FONC` métier & fiabilité | actif | |
| `PERF` performance & coût | actif | |
| `PROP` propreté | actif | |
| `CONF` config & tests | actif | |

## Où vit le modèle

Les chemins réels, dans l'ordre où les lire. Supprimer les lignes sans objet.

- **Formes / seeds** → `...`
- **Écritures serveur** → `...` (ou : pas de serveur, tout est écrit par le client)
- **Couche d'accès** → `...`
- **État global & abonnements** → `...`
- **Règles & sécurité** → `...`
- **Écrans** → `...`

## Domaines

`domaine-1` · `domaine-2` · `domaine-3` — ce sont aussi les valeurs acceptées en argument de `/audit`
et les options proposées quand on restreint le périmètre.

## Points de checklist maison

Les classes d'erreur déjà rencontrées **ici**, celles qu'un auditeur générique ne devinerait pas.
Une ligne chacune, rattachée à un axe, avec le symptôme concret.

- `SEC` — ...
- `FONC` — ...

## Déjà couvert par les tests

Ce que la batterie vérifie déjà : inutile de le resignaler à la main s'il passe au vert.

- `...` — ...

## Hors périmètre

Ce que l'audit ne doit pas traiter ici (code généré, dossier vendorisé, dette assumée et tracée
ailleurs).

- ...
