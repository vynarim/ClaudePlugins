# INSTALL.md — installer les plugins de la marketplace `dev-tools`

Ce repo expose la marketplace `dev-tools`, qui contient plusieurs plugins (voir [README.md](README.md)
pour la liste à jour). On enregistre la marketplace une fois, puis on installe les plugins voulus.

## Prérequis

- **Claude Code** installé (`claude --version`)
- **Node.js** dans le PATH (`node --version`) — requis par certains plugins (ex. le hook de `claude-utils`)

---

## Méthode 1 — automatique (projet déjà configuré)

Si le projet (ex. `horizon-app`, `stellar-api`…) déclare déjà la marketplace dans son
`.claude/settings.json`, l'installation se fait en trois clics :

1. Ouvre le projet dans VS Code et accepte le **trust du dossier** quand Claude Code le demande.
2. Claude Code détecte la marketplace et les plugins déclarés — accepte la proposition d'installation.
3. Recharge la fenêtre : `Ctrl+Shift+P` → *Developer: Reload Window*.

Le trust du dossier n'est pas une formalité : il autorise l'exécution de code (hooks). N'accepte que
pour des projets de confiance.

---

## Méthode 2 — manuelle (premier poste, ou projet sans configuration)

Une fois installés manuellement, les plugins sont disponibles dans **tous** tes projets sur ce poste.

Dans le terminal (PowerShell) — enregistre la marketplace, puis installe les plugins voulus :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
claude plugin install claude-powerplatform@dev-tools
```

> Tu n'es pas obligé de tout installer : n'installe que les plugins dont tu as besoin. La liste
> complète et à jour est dans le [README.md](README.md).

Ou depuis une session Claude Code ouverte (les commandes commençant par `/` ne fonctionnent que
dans l'invite Claude, pas dans PowerShell) :

```
/plugin marketplace add vynarim/ClaudePlugins
/plugin install <plugin>@dev-tools
/reload-plugins
```

Recharge ensuite la fenêtre VS Code.

---

## Vérifier l'installation

Dans une session Claude Code :

- `/plugin` → onglet *Installed* : chaque plugin installé (`…@dev-tools`) présent et activé
- `/hooks` → les hooks éventuels du plugin sont listés (ex. `UserPromptSubmit` pour `claude-utils`)
- Tape `/` : les skills des plugins installés doivent être proposées (ex. `/eco`, `/pp-diag`)

---

## Mettre à jour

```powershell
claude plugin marketplace update dev-tools
```

Met à jour la marketplace **et tous ses plugins installés** d'un coup. L'auto-update est désactivé
par défaut pour les marketplaces tierces — lance cette commande après chaque release.

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

**Un plugin n'apparaît pas dans les extensions VS Code**
Normal — un plugin Claude Code est distinct d'une extension VS Code. Gère-les via `/plugin` en
session ou `claude plugin list` dans le terminal.

**Dépannage propre à un plugin**
Les particularités (réglages d'un hook, variables d'environnement, prérequis spécifiques) sont
documentées dans le README de chaque plugin :
- [claude-utils/README.md](claude-utils/README.md)
- [claude-powerplatform/README.md](claude-powerplatform/README.md)
