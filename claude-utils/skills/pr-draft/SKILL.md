---
name: pr-draft
description: >-
  Génère un titre et un corps structuré de PR GitHub depuis le diff courant, prêt pour gh pr create.
  À utiliser quand l'utilisateur veut ouvrir une PR, rédiger la description d'une PR, ou préparer
  une PR GitHub depuis la branche courante. Déclenche sur : « prépare la PR », « génère la description
  de PR », « ouvre la PR », « crée la PR », « rédige la PR », « pr-draft », « push + PR »,
  « pull request », ou quand l'utilisateur demande à pousser ses changements vers GitHub.
---

# pr-draft — Génération d'une PR GitHub depuis le diff courant

Objectif : produire un titre et un corps de PR GitHub prêts à l'emploi, cohérents avec les commits
et les fichiers modifiés, sans nécessiter d'explications supplémentaires de l'utilisateur.

## Procédure

**Étape 1 — Collecter le contexte git**

Exécuter dans l'ordre (commandes courtes, non destructives) :

```
git log main..HEAD --oneline
git diff main..HEAD --stat
git status --short
```

Si la branche de base n'est pas `main`, détecter avec `git symbolic-ref refs/remotes/origin/HEAD`.

**Étape 2 — Lire le contexte projet (si disponible)**

- Lire `CLAUDE.md` s'il existe à la racine (max 50 lignes suffit).
- Ne pas explorer l'arborescence au-delà.

**Étape 3 — Générer le titre**

Format : `type(scope): description` (Conventional Commits).

- `type` : `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `ci`
- `scope` : le sous-système ou dossier principal impacté (optionnel si non évident)
- Description : en français ou en anglais selon la langue dominante des commits existants
- Max 70 caractères au total

**Étape 4 — Générer le corps**

Structure cible :

```
## Résumé
- <bullet 1 : ce que ça fait / pourquoi>
- <bullet 2 si pertinent>
- <bullet 3 si pertinent>

## Plan de test
- [ ] <vérification manuelle ou automatique clé>
- [ ] <cas limite si pertinent>

🤖 Généré avec [Claude Code](https://claude.com/claude-code)
```

Règles :
- Le résumé explique le **pourquoi**, pas seulement le **quoi** (le diff montre déjà le quoi).
- Le plan de test liste ce qu'on vérifie, pas ce qu'on a codé.
- 2–4 bullets maximum par section. Si le diff est trivial, 1 bullet suffit.
- Adapter la langue à celle des commits.

**Étape 5 — Vérifier si une PR existe déjà**

```
gh pr list --head <branche-courante> --state open
```

Si une PR est déjà ouverte : signaler le numéro et proposer de mettre à jour la description plutôt
que d'en créer une nouvelle.

**Étape 6 — Afficher la commande prête**

Afficher la commande complète à copier-coller :

```sh
gh pr create --title "titre généré" --body "$(cat <<'EOF'
## Résumé
- ...

## Plan de test
- [ ] ...

🤖 Généré avec [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Si la branche n'est pas encore poussée, ajouter `git push -u origin <branche>` avant.

## Ce que cette skill ne fait PAS

- Elle ne pousse pas, ne crée pas et n'ouvre pas la PR elle-même sans confirmation explicite.
- Elle ne lit pas tous les fichiers modifiés, seulement le stat (noms + volumes).
- Elle ne génère pas de reviewer, label ou milestone sauf demande explicite.

## Sortie attendue

Un bloc clair avec :
1. Le titre proposé (une ligne)
2. Le corps formaté (prêt à copier)
3. La commande `gh pr create` complète
4. Si nécessaire : le `git push` préalable
