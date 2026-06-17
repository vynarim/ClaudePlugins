---
name: eco
description: >-
  Discipline de consommation de tokens et de contexte pour TOUS les projets Claude Code dans VS Code,
  quel que soit le langage ou la stack : React, PCF, Dataverse, PowerShell, Power Apps Code Apps,
  sites HTML/CSS/JS classiques, et tout autre projet de code. À utiliser DÈS QU'une session Claude Code
  démarre ou tourne sur un projet, même sans demande explicite : pour rester sous les limites de 5 h
  glissantes et hebdomadaires, garder le contexte propre, choisir le bon modèle, et préserver la
  qualité du raisonnement sur les longues sessions. Déclenche aussi quand l'utilisateur parle de
  « limites », « tokens », « quota », « contexte plein », « /compact », « /clear », « ça consomme »,
  « je sature », « rester efficient », ou se plaint de lenteur/dégradation en fin de session.
---

# eco — Économie de tokens dans Claude Code (VS Code)

Objectif : faire le maximum de travail utile avec le minimum de tokens, **sans sacrifier la qualité**.
Sur les abonnements (Pro/Max), deux contraintes se cumulent et partagent le **même pool** que le chat
Claude.ai et Cowork. Économiser les tokens, ce n'est pas affamer le modèle de contexte : c'est ne
garder que le contexte *pertinent*. Un contexte qui se remplit de bruit dégrade aussi la qualité du
raisonnement (« context rot ») — donc l'économie et la qualité vont dans le même sens.

## Comment marchent les limites (à garder en tête)

- **Fenêtre 5 h glissante** : démarre au **premier** message d'une session et court 300 minutes,
  peu importe le nombre de messages envoyés entre-temps. Comptabilise tous les tokens, entrée + sortie.
- **Plafond hebdomadaire** : budget de calcul sur 7 jours, par-dessus la fenêtre 5 h.
- **Pool partagé** : Claude Code, le chat Claude.ai et Cowork puisent dans le même budget
  d'abonnement. Faire tourner un agent sur le repo *pendant* qu'on discute dans le chat dépense deux
  fois dans le même seau → éviter le chevauchement.
- **Coût qui enfle en fin de session** : chaque nouveau message **renvoie tout l'historique** en
  tokens d'entrée. Le message 201 d'une session de 2 h coûte autant en entrée que les messages 1 à
  200 réunis. D'où l'effet « le quota fond dans le dernier quart d'heure ».

Conséquence pratique : la dépense ne dépend pas de la longueur d'un seul prompt, mais de la **taille
du contexte cumulé**. La discipline ci-dessous attaque cette racine.

## Routine de session (le réflexe par défaut)

**Au démarrage**
1. Lire le `CLAUDE.md` du projet (contexte persistant) plutôt que ré-explorer l'arborescence.
2. Cibler une tâche unique et bornée. Une session = un objectif.
3. Si la tâche est complexe, faire une passe « plan » courte (5–10 étapes) puis exécuter.

**En cours**
4. Surveiller le remplissage avec `/context`. **Point d'intervention : 40–50 %**, pas 90 %.
5. Référencer les fichiers précisément avec `@chemin/fichier` au lieu de demander de lire des
   dossiers entiers. Ne pas relire un fichier déjà en contexte.
6. Regrouper les opérations (lectures/édits liés) en un minimum d'allers-retours.

**Aux bascules de tâche**
7. `/clear` quand on passe à un sujet **sans rapport** (autre feature, autre repo, autre bug). Le
   petit coût de re-contextualisation est presque toujours inférieur au coût — en tokens *et en
   qualité* — de traîner du contexte mort. Utiliser `/rename` avant, puis `/resume` pour y revenir.
8. `/compact` quand on **reste sur le même sujet** mais qu'on veut élaguer les étapes intermédiaires.
   Toujours guider la compaction (voir ci-dessous). Compacter pendant que le cache est encore chaud,
   pas à 90 %+ (le résumé devient inexploitable ; dans ce cas, préférer `/clear` + `CLAUDE.md`).

**En fin de session**
9. Demander un court résumé d'état et l'enregistrer (`docs/progress.md` ou `session_summary.md`)
   pour reprendre sans tout réexpliquer la prochaine fois.

## Guider la compaction

Ne jamais lancer un `/compact` nu si on peut le cibler. Modèle d'instruction :

```
/compact Conserver : symptômes du bug en cours, étapes de repro, nom du test qui échoue,
fichiers cibles, décisions d'archi prises. Supprimer : hypothèses intermédiaires, logs non
pertinents, exploration abandonnée.
```

On peut aussi figer cette consigne dans le `CLAUDE.md` (section « Compact instructions ») pour qu'elle
s'applique automatiquement. ⚠️ Les compactions répétées dégradent la fidélité : après plusieurs
d'affilée, mieux vaut `/clear` + repartir du `CLAUDE.md` et des notes de progression.

## Choix du modèle (le plus gros levier après le contexte)

Adapter le modèle à la tâche avec `/model` (ou un défaut dans `/config`) :

- **Haiku** → tâches simples : formatage, petits édits, questions sur du code existant, renommages.
- **Sonnet** → défaut pour l'essentiel du dev. Bon rapport qualité/coût.
- **Opus** → réservé aux décisions d'architecture, au raisonnement multi-étapes vraiment complexe.

Pattern « plan/exécution » : faire le **plan** avec un modèle haut de gamme (court), puis **exécuter**
les étapes avec un modèle moins coûteux. Le modèle cher n'est utilisé que là où il apporte le plus.

Penser aussi à plafonner le budget de réflexion si les sessions partent en longues divagations :
variable d'environnement `MAX_THINKING_TOKENS` (p. ex. `10000`) dans les réglages.

## CLAUDE.md : un index, pas une encyclopédie

Le `CLAUDE.md` est injecté en tokens d'entrée à **chaque** prompt : sa taille compte plus que tout
autre fichier. Le garder court (viser **< 50 lignes / ~5k tokens**), assez bref pour être relu d'un
coup d'œil. S'il déborde, déporter les détails moins critiques dans `docs/` (p. ex.
`docs/architecture.md`, `docs/conventions-pcf.md`) et n'y pointer qu'au besoin.

Voir `references/claude-md-template.md` pour un gabarit prêt à remplir.

## Habitudes de prompting (côté utilisateur)

Le prompting précis économise des allers-retours, donc des tokens :
- **Nommer les fichiers** concernés (`@src/components/Foo.tsx`) plutôt que « cherche dans le projet ».
- **Énoncer le résultat attendu** et les invariants (critères d'acceptation, état actuel) dès le départ.
- **Éviter l'exploration ouverte** (« regarde un peu partout et dis-moi ») qui aspire le contexte.
- **Une tâche par fil.** Quand le sujet change, on `/clear` plutôt que d'empiler.

## Surveillance du quota

- `/usage` ou `/status` dans Claude Code, ou **Réglages > Usage** sur Claude.ai, pour le tableau de
  bord combiné (consommation 5 h + hebdo et heures de reset par limite).
- Configurer la **status line** pour afficher l'usage en continu (voir `references/reglages-vscode.md`).
- Vérifier *avant* une tâche lourde. Si on est déjà à ~70 % de l'hebdo un mercredi, c'est un problème
  de planification : étaler le travail ou basculer une partie sur l'API (un compte Console/API n'a ni
  fenêtre 5 h ni plafond hebdo, mais se facture au token).

## Cas particulier : usage non interactif (depuis le 15 juin 2026)

L'usage non interactif sur abonnement (Agent SDK, `claude -p`, GitHub Actions, apps tierces
authentifiées avec l'abonnement) ne **concurrence plus** les sessions interactives : il puise dans un
**crédit mensuel séparé**. Une fois ce crédit épuisé, les requêtes basculent vers les crédits API au
tarif standard (si activés) ou s'arrêtent. Utile pour la CI/cron sans grignoter la fenêtre 5 h, mais
budget mensuel propre et non reportable. Vérifier les montants par plan dans la doc officielle, car
ils évoluent.

## Checklist express

ALWAYS, en pratique :
1. Lire `CLAUDE.md` au lieu de réexplorer. Le garder court.
2. Une session = un objectif borné. `/clear` à chaque bascule de sujet.
3. Surveiller `/context` ; intervenir à 40–50 %.
4. `@fichier` ciblé, jamais de dossier entier ; ne pas relire ce qui est déjà en contexte.
5. Bon modèle pour la tâche (Haiku/Sonnet/Opus) ; plan haut de gamme, exécution économique.
6. `/compact` guidé tant que le cache est chaud ; sinon `/clear` + notes de progression.
7. Ne pas chevaucher chat et Claude Code (pool partagé).
8. Enregistrer un résumé d'état en fin de session.

## Hook d'alerte fenêtre 5 h (fourni par le plugin)

Ce plugin embarque un hook `UserPromptSubmit` (`hooks/scripts/eco-window-check.js`) qui estime l'âge
de la fenêtre 5 h glissante et affiche une alerte quand le reset approche (~30 min avant par défaut),
invitant à finir la tâche, `/compact` ou `/clear`.

C'est une **estimation locale** : la vraie fenêtre est côté serveur et partagée avec le chat
Claude.ai / Cowork, donc elle peut avoir démarré ailleurs. Toujours croiser avec `/usage` — le hook
est un rappel, pas une source de vérité. Réglages via variables d'environnement :
`ECO_WARN_BEFORE_MIN` (minutes avant le reset, défaut 30), `ECO_WINDOW_MIN` (durée, défaut 300),
`ECO_STATE_FILE` (chemin de l'état). Voir le README du plugin.

## Notes de version

Les chiffres exacts (multiplicateurs des limites, promotions hebdo temporaires, crédits mensuels) ont
changé plusieurs fois en 2026 et restent susceptibles d'évoluer. En cas de doute sur un montant précis,
consulter `code.claude.com/docs` et la page d'usage de Claude.ai plutôt que de se fier à une valeur figée
ici. Les *mécanismes* (fenêtre 5 h glissante, plafond hebdo, pool partagé, coût qui enfle avec le
contexte) sont stables.
