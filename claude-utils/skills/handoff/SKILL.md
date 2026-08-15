---
name: handoff
description: >-
  Écrit la trace d'état de fin de session dans le fichier que le projet utilise déjà (ROADMAP,
  CHANTIERS, docs/progress.md, section « État courant » du CLAUDE.md) : où en est le chantier, les
  trois points à reprendre en premier, les dettes et les fausses pistes à ne pas refaire, l'état git
  réel. C'est ce que `session-brief` relira au prochain démarrage. Ne committe rien, n'invente rien.
  À utiliser quand l'utilisateur s'arrête, bascule de sujet, ou avant un `/clear`. Déclenche sur :
  « handoff », « fin de session », « je m'arrête là », « on reprend demain », « note où j'en suis »,
  « laisse une trace », « écris l'état », « mets à jour le ROADMAP », « note ce qui reste à faire »,
  « avant de clear ».
---

# handoff — écrire la trace de fin de session

Objectif : qu'une session suivante reprenne **sans réexpliquer**, et surtout **sans refaire** ce qui
a déjà été essayé sans succès. La boucle existe déjà des deux côtés — `eco` recommande de laisser une
trace, `session-brief` déclare la relire au démarrage — mais rien ne l'écrit. C'est cette skill.

Trois principes :

1. **Écrire dans le fichier que le projet utilise déjà.** Aucun nouveau fichier de convention n'est
   imposé : un projet qui tient un `ROADMAP.md` continue avec son `ROADMAP.md`.
2. **L'état vient de git, pas de l'impression de la session.** Ce qui n'est pas commité n'est pas
   fait — c'est la ligne la plus utile de la trace, et celle qu'on oublie.
3. **Ce qui n'a pas marché vaut ce qui a marché.** Une fausse piste non écrite sera reprise à
   l'identique dans trois jours.

## Étape 1 — Trouver le fichier d'état

Ordre de recherche, sans explorer au-delà :

```bash
ls docs/progress.md ROADMAP.md CHANTIERS.md chantiers.md TODO*.md session_summary.md 2>/dev/null
grep -n "État courant\|Etat courant\|À reprendre" CLAUDE.md 2>/dev/null
```

- **Un seul candidat** → c'est lui.
- **Plusieurs** → prendre le plus récemment modifié (`git log -1 --format=%ci -- <fichier>`) et
  **dire lequel** a été retenu ; ne pas écrire dans deux fichiers à la fois.
- **Aucun** → proposer, sans trancher seul : la section « État courant » du `CLAUDE.md` pour un
  projet dont l'état tient en quelques lignes, `docs/progress.md` sinon — c'est celui qu'`eco`
  recommande et que `session-brief` cherche.

## Étape 2 — Reconstituer l'état réel

```bash
git symbolic-ref --short refs/remotes/origin/HEAD   # base ; sans réponse, se rabattre sur main
git status --short
git log <base>..HEAD --oneline
git stash list
```

Trois catégories, à ne pas confondre dans la trace : **commité et poussé** · **commité non poussé** ·
**modifié non commité** (le travail le plus fragile — il ne survit pas à un `git checkout` distrait).

Ne jamais écrire « fait » pour du travail non commité : écrire « en cours, non commité, dans
`<fichier>` ».

## Étape 3 — Écrire les quatre blocs

Toujours ces quatre-là, dans cet ordre, adaptés au style du fichier hôte :

```markdown
## État courant
<2 à 4 lignes : où en est le chantier, ce qui vient d'être livré, ce qui est en vol.>

## À reprendre en premier
1. <action concrète — `fichier:ligne` ou commande exacte>
2. <…>
3. <…>

## Dettes connues / à ne pas refaire
- <fausse piste explorée, et **pourquoi** elle ne marche pas>
- <contournement temporaire en place, et ce qu'il masque>
- <décision prise et sa raison, pour ne pas la rejouer>

## État git
Branche `<x>` — <N> commit(s) d'avance sur `<base>` · <fichiers non commités> · <stash>
```

**Trois points de reprise au maximum.** Une liste de dix n'est pas un point de reprise, c'est un
arriéré : le reste vit dans le suivi de tâches du projet, pas ici.

**Remplacer, ne pas empiler.** Le bloc précédent est écrasé — un fichier d'état qui grossit à chaque
session redevient du contexte à charger, exactement ce qu'`eco` cherche à éviter. Seule exception :
un fichier explicitement tenu en journal daté, où l'on ajoute une entrée en tête.

Ne rien recopier du diff : la trace dit **où** et **pourquoi**, le code dit quoi.

## Étape 4 — Boucler

- **Vérifier que le fichier partira** : beaucoup de projets ignorent `.claude/*` ou `docs/*` en liste
  blanche. `git status --short <fichier>` doit le montrer — un fichier absent de la sortie est un
  fichier que le prochain clone n'aura pas.
- Proposer `/ship` s'il reste des modifications non commitées. **Ne pas committer soi-même.**
- Rappeler que `/session-brief` relira ce fichier au prochain démarrage, et que `/clear` est sans
  risque une fois la trace écrite.

## Ce que cette skill ne fait PAS

- Elle n'invente aucun avancement : ce qu'elle écrit vient de la session en cours et de git.
- Elle ne committe pas, ne pousse pas, ne déploie pas.
- Elle ne crée pas un fichier de convention nouveau sans accord explicite.
- Elle ne recopie pas le diff et ne réécrit pas le `CLAUDE.md` au-delà de sa section d'état.
- Elle n'explore pas le code : elle lit git et le fichier d'état.

## Sortie attendue

Le chemin du fichier mis à jour, les quatre blocs tels qu'écrits, et — si le fichier n'est pas suivi
par git — l'avertissement correspondant.
