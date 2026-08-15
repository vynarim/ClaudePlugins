# QUICKSTART — installer claude-utils sur un nouveau poste

Guide pas-à-pas pour mettre `claude-utils` sur un PC neuf et prendre en main ses skills. Une fois
installé, le plugin est disponible dans **tous** tes projets sur ce poste (pas besoin de le
réinstaller par projet).

> Contexte : VS Code sous Windows, shell PowerShell. Repo public — aucune authentification requise.

## Étape 0 — Prérequis (hors plugin)

- **Claude Code** installé — vérifie : `claude --version`
- **GitHub CLI** installé **et authentifié** — `gh --version`, puis `gh auth status` qui doit répondre
  *Logged in*. `/pr-draft` ne fonctionne pas du tout sans lui et `/session-brief` perd sa section
  « PRs ouvertes ». L'échec ressemble à un bug de la skill (`gh: command not found`) :

  ```powershell
  winget install GitHub.cli
  gh auth login
  ```

Ce sont des outils **machine**, à installer sur chaque poste. Le plugin, lui, n'exécute aucun code
(pas de hook, pas de serveur MCP) : il n'apporte que des skills.

## Étape 1 — Installer le plugin

Dans un terminal **PowerShell** :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Puis recharge la fenêtre VS Code (`Ctrl+Shift+P` → *Developer: Reload Window*) ou `/reload-plugins`
dans une session Claude Code.

> Si `marketplace add` échoue, l'URL complète marche aussi :
> `claude plugin marketplace add https://github.com/vynarim/ClaudePlugins.git`

## Étape 2 — Vérifier

Dans une session Claude Code :

- `/plugin` → onglet *Installed* : `claude-utils@dev-tools` présent et activé.
- Tape `/` : les skills `/eco`, `/audit`, `/test`, `/doc`, `/context-check`, `/ship`, `/deploy`,
  `/pr-draft`, `/session-brief`, `/update-plugins` sont proposées.

## Étape 3 — Prendre en main les skills

| Quand | Commande | Ce qu'elle fait |
|---|---|---|
| Tu reprends une session / un projet | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| Tu veux valider avant d'envoyer | `/test` | Joue la batterie de non-régression et rend un tableau ✅/❌, avec ce qu'elle n'a pas éprouvé. Ne committe rien. |
| Tes modifs sont prêtes à partir | `/ship` | Commit + push : découpe en commits cohérents, message aligné sur l'historique. Bumpe la version si le projet l'a déclaré dans `.claude/deploy-notes.md`. |
| Tu veux mettre en ligne | `/deploy` | Bump, vérifications, envoi via `/ship`, déploiement cible par cible, vérification en ligne. Demande un `.claude/deploy-notes.md` dans le projet. |
| Le README ne dit plus la vérité | `/doc` | Réaligne le README sur le code : classe les écarts `périmé` / `absent` / `inventé`, sans redessiner la page. |
| Tu veux ouvrir une PR | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. Nécessite `gh` authentifié (étape 0). |
| Tu surveilles ta conso de tokens | `/eco` | Discipline tokens/contexte (limites 5 h/hebdo, choix de modèle, sous-agents). |
| Tu veux faire relire ton code | `/audit` | Demande l'axe (sécurité, données, métier, perf, propreté, config) et le périmètre, puis rend un diagnostic classé par gravité. |
| Ton `CLAUDE.md` a grossi | `/context-check` | Audite la mémoire projet et propose la version condensée. |
| Une nouvelle version est publiée | `/update-plugins` | Met à jour les plugins dev-tools sur le poste. |

Pour suivre la consommation réelle (fenêtre 5 h + hebdo) : `/usage` ou `/status` en session, et en
continu l'extension VS Code **Claude Code Usage** (`growthjack.claude-code-usage`) ou une status
line. `/eco` détaille ces réglages.

## Mettre à jour plus tard

```powershell
claude plugin marketplace update dev-tools        # rafraîchit le catalogue
claude plugin update claude-utils@dev-tools       # applique la dernière version
```

Puis recharge la fenêtre. Avec `claude-utils` déjà installé, la skill `/update-plugins` enchaîne ces
deux étapes pour toi.

Pour ne plus y penser, active `autoUpdate` sur la marketplace dans ton `~/.claude/settings.json` : les
plugins se mettent à jour au démarrage. Détails, limites et dépannage :
[INSTALL.md](../INSTALL.md#automatiser--loption-autoupdate).
