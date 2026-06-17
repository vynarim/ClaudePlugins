# INSTALL.md — installer `claude-utils`

## Prérequis

- Claude Code installé (`claude --version`)
- Node.js dans le PATH (`node --version`) — requis par le hook

---

## Méthode 1 — automatique (projet configuré)

Si le projet (Azalee, LudEvent…) a déjà un `.claude/settings.json` avec la marketplace :

1. Ouvre le projet dans VS Code et accepte le **trust du dossier**.
2. Claude Code propose d'installer la marketplace et le plugin — accepte.
3. Recharge la fenêtre : `Ctrl+Shift+P` → *Developer: Reload Window*.

---

## Méthode 2 — manuelle

Dans le terminal (PowerShell) ou dans une session Claude Code (remplace `claude` par `/plugin`) :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Puis recharge VS Code.

---

## Vérifier

Dans une session Claude Code :

- `/plugin` → onglet *Installed* : `claude-utils@dev-tools` présent et activé
- `/hooks` → un hook `UserPromptSubmit` listé
- `/eco` (ou `/pr-draft`, `/session-brief`) → skill proposée

---

## Mettre à jour

```powershell
claude plugin marketplace update dev-tools
```

---

## Dépannage

**Erreur JSON au trust du projet** (`Settings file failed to parse`)
Le fichier `.claude/settings.json` contient un BOM. Réécris-le en UTF-8 sans BOM :
```powershell
$json = Get-Content ".\.claude\settings.json" -Raw
[System.IO.File]::WriteAllText("$PWD\.claude\settings.json", $json, (New-Object System.Text.UTF8Encoding($false)))
```

**`/plugin marketplace add` échoue**
Vérifie l'orthographe exacte : `vynarim/ClaudePlugins` (sensible à la casse). URL complète en fallback :
```powershell
claude plugin marketplace add https://github.com/vynarim/ClaudePlugins.git
```

**Le plugin n'apparaît pas dans les extensions VS Code**
Normal — un plugin Claude Code n'est pas une extension VS Code. Gère-le via `/plugin` ou `claude plugin list`.

**Le hook 5 h ne se déclenche jamais**
Vérifie que `node --version` répond et que `/hooks` liste un `UserPromptSubmit`.
Test rapide (avant de lancer `claude`) :
```powershell
$env:ECO_WINDOW_MIN = "5"; $env:ECO_WARN_BEFORE_MIN = "4"
Remove-Item "$HOME\.claude\eco-window-state.json" -ErrorAction SilentlyContinue
```
Envoie 2–3 messages ; l'alerte doit apparaître. Nettoie ensuite les variables.

**Réglages du hook**
`ECO_WARN_BEFORE_MIN` (défaut 30), `ECO_WINDOW_MIN` (défaut 300), `ECO_STATE_FILE` (défaut `~/.claude/eco-window-state.json`).
