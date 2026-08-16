# perms-notes — arbitrages de permissions de ce projet

Ce que `/perms` a proposé de changer et qu'on a décidé de **garder tel quel**. Sans ce fichier, le
passage suivant re-propose exactement les mêmes lignes.

Une ligne par entrée gardée : le motif, la raison, la date. Une raison qui tient en « c'est pratique »
n'en est pas une — c'est le signe qu'il fallait accepter le passage en `ask`.

| Entrée | Fichier | Gardée en `allow` parce que | Date |
|---|---|---|---|
| `Bash(git status:*)` | `.claude/settings.json` | **fichier versionné, dépôt public** : c'est la base de lecture git de quiconque clone. Le détecteur la dit ombrée par le `Bash(git *)` du poste — vrai *sur ce poste seulement* | 2026-08-16 |
| `Bash(git diff:*)` | `.claude/settings.json` | idem | 2026-08-16 |
| `Bash(git log:*)` | `.claude/settings.json` | idem | 2026-08-16 |
| `Bash(git branch:*)` | `.claude/settings.json` | idem | 2026-08-16 |
| `Bash(git ls-files:*)` | `.claude/settings.json` | idem | 2026-08-16 |
| `Bash(git show:*)` | `.claude/settings.json` | idem | 2026-08-16 |
| `Read(//c/Program Files/Microsoft/**)` | poste | l'OpenJDK que réclame l'émulateur Firebase y est installé — vérifié présent | 2026-08-16 |
| `Edit(/.claude/skills/objectifs-export/**)` | poste | la skill existe toujours dans Nemesis — vérifié | 2026-08-16 |
| `Edit(/.claude/skills/objectifs-import/**)` | poste | idem | 2026-08-16 |
| `mcp__plugin_firebase_firebase__firebase_validate_security_rules` | poste | validation en lecture seule, ne publie rien | 2026-08-16 |
| `Bash(touch docs/.nojekyll)` | poste | `docs/` sert le tutoriel GitHub Pages de ce dépôt | 2026-08-16 |

**La règle que ces six premières lignes portent** : le détecteur raisonne « ce poste ». Un fichier
versionné se juge sur les *autres* postes, où le motif large qui l'ombre ici n'existe pas. Une entrée
de projet partagé n'est jamais supprimable au seul motif qu'elle fait doublon avec la liste locale.

## Hors périmètre

Ce que `/perms` ne doit pas toucher dans ce projet — chemins, outils, serveurs MCP dont les
permissions sont pilotées ailleurs (script d'installation, politique d'équipe, gabarit partagé).

- `PowerShell(Set-ExecutionPolicy *)` — hors de la grille fermée de l'étape 3, mais c'est un réglage
  machine et la wildcard porte aussi sur `-Scope`. Signalé à chaque passage, jamais proposé.
- Les listes des projets frères (Nemesis, EscaleAzur, LudEvent, BrandMyStudio). Elles se trient
  depuis leur propre dépôt, pas d'ici.

## Politique du projet

- **`ask` plutôt que `deny`, toujours.** Un `deny` bloque même sur demande explicite ; on finit par
  l'enlever à chaud, et le garde-fou n'a jamais servi.
- **Une entrée de projet ne se supprime pas parce que le poste la couvre.** Voir ci-dessus.
- **Une commande spécifique à un projet n'a rien à faire dans la liste du poste.** Les quatre entrées
  de déploiement de LudEvent y publiaient des règles Firestore en production depuis n'importe quel
  dépôt ayant un `scripts/publish-rules.mjs`. Retirées le 16/08/2026 : LudEvent les autorise chez
  lui, ce qui suffit. Un `ask` posé au poste aurait été pire — il aurait écrasé le `allow` que
  LudEvent s'est donné exprès.
- Pas de `settings.local.json` ici, et rien ne le réclame : ce dépôt ne contient aucune permission
  qui dépende d'un poste.

## Passage du 16/08/2026

113 → 56 entrées côté poste, `additionalDirectories` 8 → 7, 8 entrées ajoutées en `ask`
(`sed -i`, `git reset --hard`, `git push --force`, `git rm` × 2 shells, `firebase deploy`).
Fichier projet inchangé.

Trois choses apprises, à ne pas redécouvrir :

1. **Le détecteur rate les ombrages de motifs `Read`/`Edit`.** Il exige un préfixe littéral, et
   `//c/Users/jgall/.claude/**` ne préfixe pas `//c/Users/jgall/.claude/plugins/**`. Trouvé à l'œil.
2. **Une commande composée n'est pas ombrée par le motif de son premier segment.** Le harness découpe
   sur `&&` et `;` : `Bash(cd *)` ne couvre pas `cd <projet> && git rm …`. Les neuf entrées de ce
   type ont été retirées comme chaînes à usage unique, pas comme redondances — la distinction compte,
   parce que la première justification coûte au pire une question et la seconde prétendait ne rien
   coûter.
3. **Les doublons exacts vivent entre le poste et les *autres* projets**, que `/perms` ne charge pas
   quand il tourne ici. Zéro doublon vu depuis ce dépôt, alors qu'il en existe au moins deux
   (`Bash(node --input-type=module -e ' *)` poste ⇄ EscaleAzur, la ligne `deploy-hosting.mjs`
   poste ⇄ LudEvent). Un passage par dépôt ne les verra jamais.
