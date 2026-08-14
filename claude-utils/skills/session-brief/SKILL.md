---
name: session-brief
description: >-
  Brief de début ou de reprise de session : git status, PRs GitHub ouvertes, mémoire récente du projet.
  À utiliser quand l'utilisateur reprend le travail et veut savoir où il en est rapidement.
  Déclenche sur : « session-brief », « brief de session », « où j'en suis », « reprendre le travail »,
  « qu'est-ce qui est en cours », « fais-moi un résumé du projet », « reprends le contexte »,
  « donne-moi l'état du projet », ou en début de session sans tâche précisée.
---

# session-brief — Brief de reprise de session

Objectif : en moins de 30 secondes, donner à l'utilisateur une vue complète de l'état courant du
projet pour qu'il puisse reprendre sans réexpliquer le contexte.

## Procédure

**Étape 1 — État git local**

D'abord la branche de base — ne jamais supposer `main` :

```
git symbolic-ref --short refs/remotes/origin/HEAD   # ex. « origin/master » → base = master
```

Retirer le préfixe `origin/` pour obtenir `<base>`. Sans remote ou sans réponse, se rabattre sur
`main`. Puis :

```
git status --short
git log <base>..HEAD --oneline
git stash list
```

Résumer en 2–3 lignes :
- Branche courante et nb de commits d'avance sur `<base>`
- Fichiers modifiés non commités (unstaged/staged/untracked)
- Stash en attente le cas échéant

**Étape 2 — PRs GitHub ouvertes**

```
gh pr list --state open --author "@me"
gh pr list --state open --assignee "@me"
```

Lister les PRs ouvertes (numéro, titre, état). Si aucune : le mentionner brièvement.

**Étape 3 — Mémoire projet**

Lire `CLAUDE.md` à la racine du projet s'il existe (ou le résumer s'il est déjà en contexte).
Lire aussi `docs/progress.md` ou `session_summary.md` s'ils existent — ce sont les notes de fin de
session recommandées par la skill `eco`.

Ne pas explorer l'arborescence au-delà de ces fichiers connus.

**Étape 4 — Mémoire persistante Claude Code**

Si de la mémoire personnelle est disponible (ex. fichiers dans `~/.claude/projects/…/memory/`),
lire `MEMORY.md` pour identifier les entrées de type `project` récentes concernant ce dépôt.

**Étape 5 — Composer le brief**

Format de sortie :

```
## Brief de session — <nom du projet> (<date>)

### Git
- Branche : `<branche>` — <N> commit(s) en avance sur main
- Modifs non commitées : <liste courte ou « aucune »>

### PRs ouvertes
- #<N> <titre> — <état>
- (aucune)

### Contexte projet
<2–4 lignes tirées de CLAUDE.md / progress.md : objectif courant, décisions importantes, prochaine étape connue>

### Suggestion
<Une action concrète et immédiate pour reprendre : « continuer sur #42 », « committer les changements
en cours », « résoudre le conflit sur feature/X », etc.>
```

Règles :
- Rester **factuel et court**. Pas de reformulation du CLAUDE.md en entier.
- Si aucun élément remarquable dans une section, l'écrire en une ligne (`aucune PR ouverte`).
- La suggestion doit être actionnable, pas générique.

## Ce que cette skill ne fait PAS

- Elle n'explore pas le code source du projet.
- Elle ne lance pas les tests ou le build.
- Elle ne modifie aucun fichier.
- Elle ne fait pas de diff complet (seulement `--stat` si nécessaire pour préciser une modif).

## Sortie attendue

Un bloc structuré, lisible en 10 secondes, qui permet de reprendre le travail sans poser de questions.
