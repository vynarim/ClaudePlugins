# Leçons de méthode — catalogue ClaudePlugins

Ce qui a été appris à ses dépens et n'a pas besoin d'être rechargé à chaque prompt.
Le `CLAUDE.md` pointe ici ; il ne garde que les décisions qui engagent une action *aujourd'hui*.

## Un contrôle maison ment de trois façons en PowerShell 5.1

Les trois ont été rencontrées pour de vrai :

1. **Lecture ANSI par défaut** — tout motif accentué échoue, d'où les 16 skills rendues en `MANQUE`.
2. **`description` repliée sur plusieurs lignes** — « À utiliser quand » coupé se lit comme absent.
3. **BOM** écrit par `Set-Content -Encoding UTF8` — trois octets invisibles font échouer le `^---` du
   frontmatter, donc « name absent » sur une skill intacte.

D'où `coherence.mjs` et `liens.mjs` écrits en Node, pas en PowerShell.

**Corollaire de méthode : un garde-fou se prouve dans les deux sens** — vert sur l'arbre réel *et*
rouge sur une copie cassée exprès. C'est ce second test qui a trouvé le BOM.

## Une trace de handoff se vérifie contre git avant d'être crue

Trois fois plutôt qu'une, et à chaque fois le contrôle coûtait 3 secondes :

- **15/08** — la trace envoyait shipper « 12 fichiers Nemesis dont `ReclaimBanner.jsx` » : déjà
  commités, disparus de l'arbre.
- **16/08** — le bloc d'état de ClaudePlugins annonçait « rien n'est commité, 8 fichiers dans l'arbre »
  alors qu'il était **lui-même** le dernier commit (`0b21c29`).
- **16/08** — le même bloc donnait `functions/lib/throttle.js` non suivi alors que `functions/index.js`
  l'importait déjà : le fichier était suivi, l'arbre Nemesis propre et à jour.

La trace décrit l'état au moment où elle a été écrite, pas l'état courant. `git status` d'abord,
lecture du bloc ensuite.

## Ce qui reste hors du garde-fou CI, faute d'être automatisable

- Les deux emplacements de `QUICKSTART.md`, que le comptage ne distingue pas.
- Le jugement sur le contenu d'une skill.
- L'étape « six déclarations » cherche une **sous-chaîne** : une absence est une certitude, une
  présence ne l'est pas. Resserrer sur une frontière de mot ferait rougir des déclarations légitimes,
  et un garde-fou qui rougit à tort est désactivé la semaine suivante.
- Même raison pour la longueur > 150 lignes, rendue en *signalement* et non en défaut (`audit` fait
  214 lignes).

## Deux règles de permissions tranchées

- Une entrée d'un fichier **versionné** ne se supprime pas parce que le poste la couvre : les
  6 `Bash(git …:*)` sont seules sur un poste qui clone.
- Un `ask` posé au poste **écrase** un `allow` que le projet s'est donné exprès — d'où la suppression,
  et non le passage en `ask`, des 4 entrées de déploiement LudEvent.

Les limites du détecteur d'ombrage sont dans [perms-notes.md](perms-notes.md).
