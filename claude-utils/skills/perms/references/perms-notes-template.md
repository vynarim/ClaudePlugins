# perms-notes — arbitrages de permissions de ce projet

Ce que `/perms` a proposé de changer et qu'on a décidé de **garder tel quel**. Sans ce fichier, le
passage suivant re-propose exactement les mêmes lignes.

Une ligne par entrée gardée : le motif, la raison, la date. Une raison qui tient en « c'est pratique »
n'en est pas une — c'est le signe qu'il fallait accepter le passage en `ask`.

| Entrée | Fichier | Gardée en `allow` parce que | Date |
|---|---|---|---|
| `Bash(rm *)` | `.claude/settings.json` | (exemple) la batterie de tests nettoie ses artefacts à chaque run ; la restreindre relance une question à chaque `/test` | 2026-08-16 |

## Hors périmètre

Ce que `/perms` ne doit pas toucher dans ce projet — chemins, outils, serveurs MCP dont les
permissions sont pilotées ailleurs (script d'installation, politique d'équipe, gabarit partagé).

- (aucun pour l'instant)

## Politique du projet

Quelques lignes sur ce que ce dépôt considère comme normal : qui a le droit de déployer depuis une
session, si les suppressions sont attendues, si `settings.local.json` sert à quelque chose ici.

- (à remplir)
