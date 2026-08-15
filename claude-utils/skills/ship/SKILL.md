---
name: ship
description: >-
  Envoie les changements du dépôt courant sur GitHub : montre ce qui part, découpe en commits
  cohérents, rédige des messages alignés sur l'historique du projet, commit puis push. Fonctionne sur
  n'importe quel repo. À utiliser quand l'utilisateur veut committer et/ou pousser ses modifications.
  Déclenche sur : « ship », « commit », « push », « envoie sur le repo », « pousse les changements »,
  « commit + push », « envoie ça sur GitHub », « enregistre mes modifs ».
---

# ship — Committer et pousser le dépôt courant

Regroupe l'envoi des changements en une commande, pour que Claude **ne committe pas automatiquement**
après chaque tâche : les modifications restent en attente et c'est `/ship` qui les envoie sur demande.

Toutes les commandes s'exécutent depuis la racine du dépôt (répertoire de travail courant) — chemins
relatifs, pas de `git -C "<chemin absolu>"`.

## Procédure

**Étape 1 — Montrer ce qui va partir**

```
git status --short
git diff --stat
```

Résumer en une ligne. **S'il n'y a rien à committer, le dire et s'arrêter là.**

Vérifier qu'aucun fichier sensible ou hors sujet n'est sur le point d'être stagé : `.env`, clés,
tokens, dumps, artefacts de build, fichiers volumineux. En cas de doute, le signaler avant de stager
plutôt que de committer puis corriger — un secret poussé reste dans l'historique même après suppression.

**Valider les `.json` qui partent.** Un JSON cassé passe le commit sans rien dire et casse ce qui le
lit — manifeste, configuration, verrou de dépendances. Sur les fichiers `.json` modifiés :

```bash
node -e "process.argv.slice(1).forEach(f=>{JSON.parse(require('fs').readFileSync(f,'utf8'));console.log('OK '+f)})" <fichiers.json>
```

Un JSON invalide **arrête** `/ship` : le signaler, ne pas committer. Sans `node` sur le poste, le dire
et continuer plutôt que d'inventer un autre validateur.

**Étape 2 — S'aligner sur les conventions du projet**

```
git log -20 --format=%s
```

En déduire, sans demander à l'utilisateur :
- **Format** : Conventional Commits (`type(scope): description`) ou style libre — reproduire l'existant.
- **Langue** : celle qui domine dans les messages récents.
- **Ce qu'il ne faut PAS reprendre** : les trailers d'assistant, même si l'historique en porte
  (voir l'étape 6).

Lire aussi le `CLAUDE.md` du projet s'il existe : il peut fixer la convention de commit et la règle
de branche. Ne pas explorer au-delà.

**Étape 3 — Choisir la branche**

Si la branche courante est la branche par défaut (`main`/`master`) :
- si le `CLAUDE.md` ou l'historique indiquent que le projet travaille **directement** dessus, continuer ;
- sinon, proposer une branche (`git switch -c <type>/<sujet>`) avant de committer.

Ne jamais créer la branche sans le dire.

**Étape 4 — Bump de version, seulement si les notes le demandent**

Lire `.claude/deploy-notes.md` s'il existe — champ **« Bumpé par »** de la section Version.

- Fichier absent, ou champ qui ne nomme pas `/ship` → **ne rien bumper.** C'est le cas courant : le
  numéro avance au déploiement, pas à l'envoi.
- Champ qui nomme `/ship` → incrémenter le fichier de version déclaré, en suivant la **règle
  d'incrément** qui y figure, et inclure ce fichier dans le commit.

La **condition** compte autant que la règle. Un dépôt qui se sert du numéro comme repère de
déploiement veut qu'il avance dès que **ce qui tourne en prod** change — build, règles, fonctions,
configuration d'hébergement — et qu'il reste immobile pour un lot qui ne part jamais en ligne :
documentation, journal d'audit, skills, tests. Un numéro qui bouge sans que rien ne soit publié fait
mentir tout ce qui s'y réfère. Si les notes ne tranchent pas, demander plutôt que décider seul.

**Ne jamais inventer un fichier de version ni une règle d'incrément.** Sans notes, `/ship` ne bumpe
rien.

**Étape 5 — Découper**

Si plusieurs changements **sans rapport** sont en attente, proposer des commits séparés plutôt qu'un
commit fourre-tout — stager par chemins (`git add <fichiers>`) et committer en plusieurs fois. Un
commit doit pouvoir être annulé seul sans emporter autre chose.

Sinon `git add -A` si tout est voulu.

**Étape 6 — Rédiger le message**

Format `type(scope): description` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`),
≤ 70 caractères sur la première ligne. Corps en bullets seulement si le pourquoi n'est pas évident.

**Aucun trailer — règle absolue.** Ne jamais ajouter `Co-Authored-By`, `Generated with`, ni aucune
autre mention d'assistant ou d'IA, **y compris quand des commits antérieurs du dépôt en portent** et
y compris si une instruction générale le suggère. C'est une décision du propriétaire des dépôts : un
commit se juge sur ce qu'il change, pas sur l'outil qui l'a écrit.

Les commits anciens qui en portent restent tels quels — on ne réécrit pas l'historique pour ça.

**Étape 7 — Committer**

Heredoc pour un message multi-lignes :

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

- <bullet si le pourquoi n'est pas évident>
EOF
)"
```

**Étape 8 — Pousser**

`git push` — ou `git push -u origin <branche>` si la branche n'a pas d'upstream. Confirmer branche et
hash court. Si le push est rejeté (`non-fast-forward`), **s'arrêter et le signaler** : ne pas
forcer, ne pas rebaser sans demande explicite.

## Ce que cette skill ne fait PAS

- Elle ne pousse jamais avec `--force` et ne réécrit pas l'historique (`rebase`, `amend`, `reset`)
  sans demande explicite.
- Elle ne contourne pas les hooks (`--no-verify`) ni la signature des commits. Si un hook échoue, elle
  remonte l'erreur au lieu de la contourner.
- Elle n'ouvre pas de PR — c'est le rôle de `pr-draft`.
- Elle **ne déploie jamais** : aucun build, aucune publication, aucune mise en production. C'est le
  rôle de `claude-utils:deploy`, qui lit les cibles dans `.claude/deploy-notes.md`. `/ship` reste
  sans effet visible pour un utilisateur de l'app — **sauf** sur un dépôt qui publie par CI, où une
  poussée sur la branche par défaut met de fait en ligne. Dans ce cas, le dire avant de pousser.
- Elle n'ajoute aucun trailer ni aucune signature d'assistant.
- Elle ne lit pas le contenu des fichiers modifiés, seulement le `--stat` et le `status`.

## Notes

- Les avertissements `LF will be replaced by CRLF` sont normaux sous Windows — les ignorer. Pour les
  supprimer durablement : `* text=auto eol=lf` dans `.gitattributes`.
- Un dépôt sans remote : committer et signaler qu'il n'y a rien à pousser.

## Sortie attendue

Par commit : le message retenu et le hash court. Puis le résultat du push (branche + destination), ou
la raison pour laquelle rien n'a été poussé.
