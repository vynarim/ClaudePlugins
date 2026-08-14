---
name: eco
description: >-
  Discipline de consommation de tokens et de contexte pour TOUS les projets Claude Code, quelle que
  soit la stack. À utiliser DÈS QU'une session démarre ou tourne sur un projet, même sans demande
  explicite : garder le contexte propre, rester sous les limites, et préserver la qualité du
  raisonnement sur les longues sessions. Déclenche aussi quand l'utilisateur parle de « limites »,
  « tokens », « quota », « contexte plein », « /compact », « /clear », « ça consomme », « je sature »,
  « rester efficient », ou se plaint de lenteur/dégradation en fin de session.
---

# eco — Économie de tokens dans Claude Code

## Le mécanisme (tout découle de là)

Chaque message **renvoie tout l'historique** en tokens d'entrée. Un fichier lu inutilement au message
5 est **re-facturé** aux messages 6, 7, 8… jusqu'au `/clear`. La dépense ne vient donc pas de la
longueur d'un prompt, mais de la **taille du contexte cumulé** — et ce même contexte, s'il se remplit
de bruit, dégrade aussi la qualité du raisonnement. Économie et qualité vont dans le même sens.

## Routine de session

**Au démarrage** — lire le `CLAUDE.md` du projet plutôt que ré-explorer l'arborescence. Une session =
**un objectif borné**. Si la tâche est complexe : passe « plan » courte, puis exécution.

**En cours** — surveiller `/context`, intervenir à **40–50 %**, pas à 90 %. Référencer les fichiers
avec `@chemin/fichier` au lieu de faire lire des dossiers entiers ; ne pas relire ce qui est déjà en
contexte. Regrouper les opérations liées en un minimum d'allers-retours.

**Aux bascules** — `/clear` dès qu'on passe à un sujet **sans rapport**. Le coût de
re-contextualisation est presque toujours inférieur à celui de traîner du contexte mort. `/rename`
avant, `/resume` pour y revenir. `/compact` seulement si on **reste** sur le même sujet.

**En fin de session** — enregistrer un court résumé d'état (`docs/progress.md`) pour reprendre sans
tout réexpliquer.

## Guider la compaction

Jamais de `/compact` nu si on peut le cibler :

```
/compact Conserver : symptômes du bug, étapes de repro, test qui échoue, fichiers cibles,
décisions d'archi. Supprimer : hypothèses intermédiaires, logs non pertinents, exploration
abandonnée.
```

Figer cette consigne dans le `CLAUDE.md` (section « Compact instructions ») pour qu'elle s'applique
seule. ⚠️ Les compactions répétées dégradent la fidélité : après plusieurs d'affilée, préférer
`/clear` + repartir du `CLAUDE.md`.

## Choix du modèle

Adapter le modèle à la tâche via `/model` : modèle léger pour formatage, petits édits et questions sur
du code existant ; modèle haut de gamme réservé à l'architecture et au raisonnement multi-étapes.
Pattern « plan/exécution » : planifier avec le modèle fort (court), exécuter avec le moins coûteux.

## CLAUDE.md : un index, pas une encyclopédie

Injecté en entrée à **chaque** prompt — sa taille compte plus que tout autre fichier. Viser
**< 50 lignes**. Ce qui déborde part dans `docs/` et n'est pointé qu'au besoin. Gabarit :
`references/claude-md-template.md`.

## Prompting (côté utilisateur)

Nommer les fichiers concernés plutôt que « cherche dans le projet ». Énoncer le résultat attendu et
les invariants dès le départ. Éviter l'exploration ouverte, qui aspire le contexte. Une tâche par fil.

## Surveillance du quota

`/usage` ou `/status` pour la conso 5 h + hebdo. En continu : extension VS Code **Claude Code Usage**
(`growthjack.claude-code-usage`) ou une status line configurée — préférer ces sources à toute
estimation locale, la fenêtre étant côté serveur et partagée avec le chat Claude.ai. Vérifier *avant*
une tâche lourde.

Détails (commandes, variables d'environnement, hygiène du pool partagé, bascule API) :
`references/reglages-vscode.md`.
