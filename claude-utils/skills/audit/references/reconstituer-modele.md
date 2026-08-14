# Reconstituer le modèle

Lu à l'**étape 2**, et seulement si l'un des axes `DATA`, `FONC` ou `SEC` est retenu. Pour `PERF`,
`PROP` et `CONF`, un survol suffit : ce fichier n'a pas à être chargé.

Objectif : une **note de modèle courte** (entité → champs → qui écrit), transmise ensuite à chaque
agent. Sans elle, l'analyse invente des champs et des écrans qui n'existent pas.

## Ordre de recherche

S'arrêter à ce que le dépôt possède réellement — ne pas chercher une couche qu'il n'a pas :

1. **Formes de départ** — seeds, fixtures, schémas déclarés, migrations.
2. **Écritures serveur** — quand le serveur écrit, c'est lui qui fixe la forme réelle, pas le client.
3. **Couche d'accès** — `db.js`, repository, ORM.
4. **État global & abonnements**.
5. **Règles & sécurité**.

Quand le projet a documenté les chemins réels de ces couches, ils sont dans son
`.claude/audit-notes.md`, § « Où vit le modèle » : les lire avant d'explorer.

## Ce qu'on note, par entité

- **Champs** présents.
- **Types** : nombre vs chaîne, format de date, tableaux d'ids, maps, booléens.
- **Id de document** : composite déterministe, ou généré ?
- **Qui écrit** : client ou serveur.

## Quand il n'y a pas de modèle

Un dépôt sans base ni runtime — catalogue de fichiers, site statique, documentation, dépôt d'outillage
— n'a pas de modèle à reconstituer. Le dire en une ligne et passer à l'étape 3, plutôt que d'en
inventer un. C'est typiquement le cas quand les notes projet déclarent `DATA` et `SEC` N/A.
