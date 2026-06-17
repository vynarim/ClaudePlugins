---
name: ship
description: >-
  Envoie les changements du repo ClaudePlugins sur GitHub : stage, commit (message Conventional
  Commits avec le trailer Co-Authored-By), puis push. À invoquer quand l'utilisateur veut committer
  et/ou pousser ses modifications. Déclenche sur : « ship », « commit », « push », « envoie sur le
  repo », « pousse les changements », « commit + push », « envoie ça sur GitHub ».
---

# ship — Committer et pousser le repo ClaudePlugins

Skill interne au projet ClaudePlugins. Regroupe l'envoi des changements pour que Claude **ne committe
pas automatiquement** après chaque tâche : les modifications restent en attente, et c'est `/ship` qui
les envoie sur demande.

## Procédure

1. **Montrer ce qui va partir** :
   ```
   git -C "d:\Perso\ClaudePlugins" status --short
   git -C "d:\Perso\ClaudePlugins" diff --stat
   ```
   Résumer en une ligne ce qui change. S'il n'y a rien à committer, le dire et s'arrêter.

2. **Stager** les fichiers pertinents (`git add <chemins>` ou `git add -A` si tout est voulu).
   Ne pas stager de fichiers hors sujet ou sensibles.

3. **Proposer un message de commit** au format Conventional Commits, cohérent avec l'historique du
   repo (`type(scope): description`), en français ou anglais selon le ton des commits récents.
   Types courants : `feat`, `fix`, `docs`, `chore`, `refactor`.
   Terminer le message par le trailer :
   ```
   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
   ```
   > Adapter le nom du modèle au modèle réellement utilisé pour la session.

4. **Committer** (heredoc pour un message multi-lignes) :
   ```bash
   git -C "d:\Perso\ClaudePlugins" commit -m "$(cat <<'EOF'
   type(scope): description

   Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
   EOF
   )"
   ```

5. **Pousser** : `git -C "d:\Perso\ClaudePlugins" push`. Confirmer le résultat (branche, hash court).

## Notes

- Si plusieurs changements sans rapport sont en attente, proposer de les **découper en commits
  séparés** plutôt qu'un commit fourre-tout.
- Les warnings `LF will be replaced by CRLF` sont normaux sous Windows — les ignorer.
- Ne jamais `--force` ni réécrire l'historique sans demande explicite.
- Brancher si on n'est pas sur `main` n'est pas nécessaire ici : ce repo travaille directement sur
  `main` (cf. historique).
