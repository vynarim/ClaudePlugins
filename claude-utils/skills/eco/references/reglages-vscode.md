# Réglages VS Code / Claude Code pour l'économie de tokens

Réglages et commandes utiles. Vérifier les noms exacts dans `code.claude.com/docs` car ils peuvent
évoluer ; les principes restent valables.

## Commandes slash à connaître

| Commande | Quand |
|---|---|
| `/context` | Voir le remplissage du contexte. Intervenir à **40–50 %**. |
| `/usage` ou `/status` | Voir la conso 5 h + hebdo et les heures de reset. |
| `/clear` | Bascule vers un sujet **sans rapport** (autre feature/bug/repo). |
| `/compact` | Élaguer en **restant** sur le même sujet (guider la compaction). |
| `/rename` | Nommer la session avant un `/clear` pour la retrouver. |
| `/resume` | Reprendre une session nommée. |
| `/model` | Changer de modèle en cours de session (léger pour l'exécution, haut de gamme pour l'archi). |
| `/config` | Fixer un modèle par défaut et d'autres réglages. |

## Status line (usage en continu)

Configurer une status line affichant l'usage évite les mauvaises surprises de fin de session : on voit
le quota fondre en temps réel et on déclenche `/compact` ou `/clear` au bon moment. Voir la doc de
configuration de la status line dans `code.claude.com/docs`.

## Variables d'environnement

- `MAX_THINKING_TOKENS` : plafonne le budget de réflexion par tour (p. ex. `10000`). Utile si les
  sessions partent en longues divagations coûteuses sur des tâches simples.

À placer selon ta configuration (settings du projet ou variables d'environnement du shell). Garder une
valeur raisonnable : trop bas nuit aux tâches d'architecture qui ont besoin de réfléchir.

## Hygiène pool partagé (rappel)

Claude Code, le chat Claude.ai et Cowork partagent le **même** budget d'abonnement. Éviter de lancer
un agent long sur le repo *pendant* qu'on discute en parallèle dans le chat : on dépense deux fois dans
le même seau. Séparer : chat pour réfléchir/rédiger, Claude Code pour coder, pas en simultané.

## Quand basculer vers l'API

Un compte Console/API n'a **ni** fenêtre 5 h **ni** plafond hebdo (facturation au token). Pour des
charges lourdes répétables ou de la CI, router une partie du travail vers l'API peut libérer le quota
d'abonnement pour le travail interactif. Depuis le 15 juin 2026, l'usage non interactif sur abonnement
puise de toute façon dans un crédit mensuel séparé.
