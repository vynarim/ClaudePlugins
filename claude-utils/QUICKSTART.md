# QUICKSTART — installer claude-utils sur un nouveau poste

Guide pas-à-pas pour mettre `claude-utils` sur un PC neuf et prendre en main ses skills. Une fois
installé, le plugin est disponible dans **tous** tes projets sur ce poste (pas besoin de le
réinstaller par projet).

> Contexte : VS Code sous Windows, shell PowerShell. Repo public — aucune authentification requise.

## Étape 0 — Prérequis (hors plugin)

- **Claude Code** installé — vérifie : `claude --version`
- **Node.js** dans le PATH — vérifie : `node --version` (requis par le hook fenêtre 5 h)

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
- `/hooks` → le hook `UserPromptSubmit` (alerte fenêtre 5 h) est listé.
- Tape `/` : les skills `/eco`, `/pr-draft`, `/session-brief`, `/update-plugins` sont proposées.

## Étape 3 — Prendre en main les skills

| Quand | Commande | Ce qu'elle fait |
|---|---|---|
| Tu reprends une session / un projet | `/session-brief` | Brief de reprise : git status, PRs ouvertes, mémoire projet. |
| Tu veux ouvrir une PR | `/pr-draft` | Génère titre + corps structuré de PR GitHub depuis le diff courant. |
| Tu surveilles ta conso de tokens | `/eco` | Discipline tokens/contexte (limites 5 h/hebdo, choix de modèle). |
| Une nouvelle version est publiée | `/update-plugins` | Met à jour les plugins dev-tools sur le poste. |

Le hook fenêtre 5 h tourne tout seul : il prévient ~30 min avant le reset estimé. Réglages
(facultatifs) dans le [README du plugin](README.md#réglages-du-hook-variables-denvironnement-optionnelles).

## Mettre à jour plus tard

```powershell
claude plugin marketplace update dev-tools        # rafraîchit le catalogue
claude plugin update claude-utils@dev-tools       # applique la dernière version
```

Puis recharge la fenêtre. Avec `claude-utils` déjà installé, la skill `/update-plugins` enchaîne ces
deux étapes pour toi. Détails et dépannage : [INSTALL.md](../INSTALL.md).
