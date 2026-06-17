# INSTALL.md — installer `claude-utils`

## Prérequis

- **Claude Code** installé (`claude --version`)
- **Node.js** dans le PATH (`node --version`) — requis par le hook d'alerte 5 h

---

## Méthode 1 — automatique (projet déjà configuré)

Si le projet (ex. `horizon-app`, `stellar-api`…) déclare déjà la marketplace dans son
`.claude/settings.json`, l'installation se fait en trois clics :

1. Ouvre le projet dans VS Code et accepte le **trust du dossier** quand Claude Code le demande.
2. Claude Code détecte la marketplace et le plugin déclarés — accepte la proposition d'installation.
3. Recharge la fenêtre : `Ctrl+Shift+P` → *Developer: Reload Window*.

Le trust du dossier n'est pas une formalité : il autorise l'exécution du hook Node. N'accepte que
pour des projets de confiance.

---

## Méthode 2 — manuelle (premier poste, ou projet sans configuration)

Une fois installé manuellement, le plugin est disponible dans **tous** tes projets sur ce poste.

Dans le terminal (PowerShell) :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Ou depuis une session Claude Code ouverte (les commandes commençant par `/` ne fonctionnent que
dans l'invite Claude, pas dans PowerShell) :

```
/plugin marketplace add vynarim/ClaudePlugins
/plugin install claude-utils@dev-tools
/reload-plugins
```

Recharge ensuite la fenêtre VS Code.

---

## Vérifier l'installation

Dans une session Claude Code :

- `/plugin` → onglet *Installed* : `claude-utils@dev-tools` présent et activé
- `/hooks` → un hook `UserPromptSubmit` listé (c'est l'alerte 5 h)
- `/eco`, `/pr-draft`, `/session-brief` → chaque skill doit être proposée

---

## Mettre à jour

```powershell
claude plugin marketplace update dev-tools
```

L'auto-update est désactivé par défaut pour les marketplaces tierces. Lance cette commande après
chaque release pour récupérer les nouvelles versions.

---

## Dépannage

**Erreur JSON au trust du projet** (`Settings file failed to parse`)
Le `.claude/settings.json` contient un BOM (encodage UTF-8 avec marqueur invisible). Réécris-le
sans BOM :
```powershell
$json = Get-Content ".\.claude\settings.json" -Raw
[System.IO.File]::WriteAllText("$PWD\.claude\settings.json", $json, (New-Object System.Text.UTF8Encoding($false)))
```

**`/plugin marketplace add` échoue**
Vérifie l'orthographe exacte : `vynarim/ClaudePlugins` (sensible à la casse). En fallback, l'URL
complète fonctionne aussi :
```powershell
claude plugin marketplace add https://github.com/vynarim/ClaudePlugins.git
```

**Le plugin n'apparaît pas dans les extensions VS Code**
Normal — un plugin Claude Code est distinct d'une extension VS Code. Gère-le via `/plugin` en
session ou `claude plugin list` dans le terminal.

**Le hook 5 h ne se déclenche jamais**
Vérifie que `node --version` répond et que `/hooks` liste un `UserPromptSubmit`. Pour tester sans
attendre 4 h 30, ajoute ces variables d'environnement **avant** de lancer `claude` :
```powershell
$env:ECO_WINDOW_MIN = "5"; $env:ECO_WARN_BEFORE_MIN = "4"
Remove-Item "$HOME\.claude\eco-window-state.json" -ErrorAction SilentlyContinue
```
Envoie 2–3 messages ; l'alerte `⏳ eco — fenêtre 5 h…` doit apparaître. Nettoie ensuite les
variables et le fichier d'état.

**Réglages du hook**
Variables d'environnement optionnelles : `ECO_WARN_BEFORE_MIN` (défaut 30), `ECO_WINDOW_MIN`
(défaut 300), `ECO_STATE_FILE` (défaut `~/.claude/eco-window-state.json`).
