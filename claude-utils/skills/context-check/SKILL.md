---
name: context-check
description: >-
  Audite le CLAUDE.md du projet courant — longueur, sections à déporter dans docs/, état courant
  absent, compact instructions manquantes — et propose une version condensée. À utiliser quand
  l'utilisateur veut vérifier ou alléger la mémoire projet injectée à chaque prompt. Déclenche sur :
  « context-check », « audite mon CLAUDE.md », « mon CLAUDE.md est trop long », « allège la mémoire
  projet », « condense le CLAUDE.md », « vérifie ma mémoire projet », « pourquoi mes prompts coûtent
  cher ».
---

# context-check — Audit du CLAUDE.md d'un projet

Le `CLAUDE.md` est le seul fichier **réinjecté à chaque prompt** de chaque session : son coût est
multiplié par le nombre de messages. C'est aussi le premier fichier à dériver, parce qu'on y ajoute
sans jamais retirer. Cette skill applique à un projet donné la discipline décrite par `eco`.

## Procédure

**Étape 1 — Localiser et mesurer**

Lire le `CLAUDE.md` à la racine. S'il n'existe pas : le signaler, proposer de le créer depuis le
gabarit `../eco/references/claude-md-template.md`, et s'arrêter.

Relever le nombre de lignes. Repères : **< 50 lignes = sain**, 50–100 = à surveiller, **> 100 = à
condenser**. Estimer grossièrement le coût (~1 token pour 4 caractères) et le rappeler *par prompt*,
pas en absolu — c'est la multiplication qui parle.

**Étape 2 — Classer chaque section**

| Verdict | Critère |
|---|---|
| **Garder** | Sert à *chaque* tâche : résumé du projet, stack, conventions actives, état courant, pointeurs vers `docs/`. |
| **Déporter** | Vrai mais consulté rarement : architecture détaillée, historique, notes de migration, procédures de déploiement, listes exhaustives de fichiers. → `docs/`, référencé en une ligne. |
| **Supprimer** | Redondant avec le code, le `README` ou l'historique git ; TODO périmés ; instructions génériques que Claude applique déjà (« écris du code propre », « respecte le style »). |

Signaler aussi les manques :
- pas de section **État courant** → impossible de reprendre après un `/clear` sans réexpliquer ;
- pas de **Compact instructions** → les `/compact` automatiques élaguent à l'aveugle ;
- pointeurs vers des fichiers `docs/` **qui n'existent pas** (vérifier l'existence des chemins cités).

**Étape 3 — Rendre le verdict**

```
## Audit CLAUDE.md — <projet>

<N> lignes (~<T> tokens) — <sain | à surveiller | à condenser>, réinjecté à chaque prompt.

### À déporter
- « <titre de section> » (<n> lignes) → docs/<fichier>.md

### À supprimer
- « <titre> » — <raison en quelques mots>

### Manquant
- <section absente et ce qu'elle coûte>

### Après condensation
<N> lignes → ~<M> lignes
```

**Étape 4 — Proposer la réécriture**

Sur demande — ou si le verdict est « à condenser » — produire la version condensée complète, alignée
sur le gabarit `../eco/references/claude-md-template.md`, et le contenu des fichiers `docs/` à créer.
**Rien n'est écrit sans validation explicite** : le `CLAUDE.md` est un fichier que l'utilisateur relit
souvent, il doit reconnaître sa formulation.

Ne jamais déporter du contenu sans créer le fichier cible et le lien qui y mène : un pointeur mort
coûte plus cher qu'une section trop longue.

## Ce que cette skill ne fait PAS

- Elle ne modifie aucun fichier sans validation explicite.
- Elle n'explore pas le code source — seulement le `CLAUDE.md`, l'existence des fichiers `docs/`
  cités, et le `README` si une redondance est suspectée.
- Elle ne touche pas au `CLAUDE.md` global (`~/.claude/CLAUDE.md`) sauf demande explicite.
- Elle n'audite pas la mémoire persistante ni les settings — seulement la mémoire projet.

## Sortie attendue

Le bloc d'audit de l'étape 3, lisible en 15 secondes, puis la proposition de réécriture si elle est
demandée ou justifiée.
