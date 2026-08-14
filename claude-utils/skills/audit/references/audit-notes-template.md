# Notes d'audit — <PROJET>

Gabarit du fichier `.claude/audit-notes.md` lu par la skill `/audit`. Il porte **ce qui est propre au
projet** ; la méthode, la grille générique et le format du rapport vivent dans la skill.

Règle de survie : ce fichier doit rester court (~40 lignes). Tout ce qui vaut pour n'importe quel
dépôt n'a rien à y faire — c'est un bug de la skill, pas une note projet.

---

## Où vit le modèle

Les chemins réels, dans l'ordre où les lire. Supprimer les lignes sans objet.

- **Formes / seeds** → `...`
- **Écritures serveur** → `...` (ou : pas de serveur, tout est écrit par le client)
- **Couche d'accès** → `...`
- **État global & abonnements** → `...`
- **Règles & sécurité** → `...`
- **Écrans** → `...`

## Domaines (découpage des agents)

`domaine-1` · `domaine-2` · `domaine-3` — ce sont aussi les valeurs acceptées en argument de `/audit`.

## Pièges maison

Les classes d'erreur déjà rencontrées **ici**, celles qu'un auditeur générique ne devinerait pas.
Une ligne chacune, avec le symptôme concret.

- ...
- ...

## Déjà couvert par les tests

Ce que la batterie vérifie déjà : inutile de le re-signaler à la main s'il passe au vert.

- `...` — ...

## Faux positifs écartés

Constats déjà relus et invalidés, avec la raison. Évite de refaire le tour à chaque audit.

| Constat | Pourquoi ce n'en est pas un | Écarté le |
|---|---|---|
| ... | ... | AAAA-MM-JJ |

## Hors périmètre

Ce que l'audit ne doit pas traiter ici (code généré, dossier vendorisé, dette assumée et tracée
ailleurs).

- ...
