# INSTALL.md — installer le plugin `claude-utils` (guide développeur)

Ce guide s'adresse aux **développeurs** qui veulent utiliser le plugin `claude-utils` dans Claude Code.
Si tu es le mainteneur du repo (créer/publier/mettre à jour le plugin), vois plutôt `DEPLOYMENT.md`.

---

## Ce que le plugin apporte

- **Skill `eco`** : discipline de consommation de tokens et de contexte (rester sous les limites 5 h
  glissantes / hebdomadaires, garder le contexte propre, choisir le bon modèle). Se déclenche
  automatiquement sur les sessions de code, ou à la demande via `/eco`.
- **Hook « fenêtre 5 h »** : t'alerte (par défaut ~30 min avant) quand le reset estimé de la fenêtre
  5 h approche, pour finir/borner ta tâche. C'est une estimation locale — la vraie valeur reste `/usage`.

---

## Prérequis

1. **Claude Code installé** (CLI `claude` ou extension VS Code). Vérifie : `claude --version`.
2. **Node.js installé et dans le PATH** — le hook est un script Node. Vérifie : `node --version`.

Le repo `vynarim/ClaudePlugins` est **public** : aucun accès particulier ni authentification GitHub
n'est nécessaire pour l'installer. `git`/`gh` ne sont même pas requis côté dev pour utiliser le plugin.

> Les commandes ci-dessous sont en **PowerShell (Windows)**. Sur macOS/Linux, les commandes `claude …`
> et les commandes internes `/…` sont identiques ; seules les commandes système (chemins, variables
> d'environnement) changent.

---

## Méthode 1 — automatique, en ouvrant un projet (recommandée)

Les projets internes (Azalee, LudEvent, …) déclarent déjà ce plugin dans leur `.claude/settings.json`.
Tu n'as donc quasiment rien à faire :

1. Clone le projet et ouvre-le dans VS Code.
2. À l'ouverture, Claude Code te demande de **faire confiance** au dossier — accepte.
3. Comme le projet enregistre la marketplace `dev-tools` et le plugin `claude-utils`, Claude Code te
   **propose de les installer**. Accepte.
4. Recharge la fenêtre : `Ctrl+Shift+P` → « Developer: Reload Window ».

C'est tout. Passe à la section **Vérifier l'installation**.

> Le « trust » du dossier n'est pas une formalité : il autorise l'exécution de code (le hook). N'accepte
> que pour des projets internes de confiance.

---

## Méthode 2 — manuelle (premier poste, ou projet sans configuration)

À faire une seule fois par poste ; le plugin devient ensuite disponible dans **tous** tes projets.

### Le plus simple : depuis le terminal (PowerShell)

Ces commandes ne se tapent PAS comme des commandes shell classiques au hasard : ce sont des
sous-commandes de l'outil `claude`. Une par ligne :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Puis recharge la fenêtre VS Code (« Developer: Reload Window ») ou relance `claude`.

### Variante : dans une session Claude Code interactive

Lance d'abord la session (`claude` dans le terminal, ou le panneau de l'extension), **puis** tape les
commandes internes une par une, en validant à chaque fois :

```
/plugin marketplace add vynarim/ClaudePlugins
```
```
/plugin install claude-utils@dev-tools
```
```
/reload-plugins
```

> ⚠️ Ne colle pas les trois lignes d'un coup, et n'écris pas `claude` à l'intérieur d'une session déjà
> ouverte. Les commandes commençant par `/` ne fonctionnent QUE dans l'invite de Claude Code, jamais
> dans le terminal PowerShell brut.

---

## Vérifier l'installation

Dans une session Claude Code (ouverte sur un projet) :

- `/plugin` → onglet *Installed* : `claude-utils@dev-tools` présent et **activé**.
- `/hooks` → un hook `UserPromptSubmit` doit être listé (c'est l'alerte 5 h).
- Tape `/` puis cherche `eco`, ou `/eco` directement : la skill doit être proposée
  (préfixée `claude-utils:eco`, signe qu'elle vient du plugin).

Depuis le terminal :

```powershell
claude plugin marketplace list   # doit lister "dev-tools"
claude plugin list               # doit lister "claude-utils"
```

Test rapide du comportement : en session, demande « Quelles instructions la skill eco te donne-t-elle ? ».
Elle doit te résumer la discipline de tokens (lecture ciblée, `/clear` aux bascules, choix du modèle…).

---

## Mettre à jour vers une nouvelle version

L'auto-update est **désactivé par défaut** pour les marketplaces tierces (non officielles) comme
celle-ci. Quand le mainteneur publie une
nouvelle version, récupère-la :

```powershell
claude plugin marketplace update dev-tools
```

Puis recharge la fenêtre VS Code (ou relance `claude`). En session, l'équivalent est
`/plugin marketplace update dev-tools` suivi de `/reload-plugins`.

---

## Dépannage (problèmes déjà rencontrés)

**« No conversation found with session ID … » à l'exécution d'une commande `/plugin` dans l'extension.**
Pépin d'état de session de l'extension VS Code, sans rapport avec le plugin. Solution : recharge la
fenêtre (« Developer: Reload Window »), puis relance — ou plus simple, fais l'install depuis le terminal
avec `claude plugin …`.

**« Settings file failed to parse … Invalid input » à l'ouverture d'un projet.**
Le `.claude/settings.json` du projet n'est pas un JSON valide, souvent à cause d'un **BOM** (marqueur
invisible en tête de fichier) écrit par `Set-Content -Encoding utf8`. Réécris-le en UTF-8 **sans BOM** :

```powershell
$json = Get-Content ".\.claude\settings.json" -Raw
[System.IO.File]::WriteAllText("$PWD\.claude\settings.json", $json, (New-Object System.Text.UTF8Encoding($false)))
```

Vérifie ensuite : `Get-Content ".\.claude\settings.json" -Raw | ConvertFrom-Json` ne doit lever aucune
erreur, et `[System.IO.File]::ReadAllBytes("$PWD\.claude\settings.json")[0..2]` doit afficher `123`
(et non `239 187 191`).

**« src refspec main does not match any » / « Updating an unborn branch ».**
Côté repo : aucun commit local. Les fichiers ne sont pas encore ajoutés (`git add .` puis `git commit`)
ou le dossier est vide. Sans rapport avec le plugin lui-même.

**Le plugin n'apparaît pas dans l'onglet *Extensions* de VS Code.**
Normal : un **plugin Claude Code n'est pas une extension VS Code**. Ce sont deux systèmes différents.
Gère-le via `/plugin` en session, ou `claude plugin list` au terminal.

**`/plugin marketplace add` échoue (marketplace introuvable).**
Le repo étant public, ce n'est pas un problème d'authentification. Vérifie l'orthographe exacte
(`vynarim/ClaudePlugins`, sensible à la casse) et que le repo distant n'est pas vide (le mainteneur
doit avoir poussé `.claude-plugin/marketplace.json` à la racine). Au besoin, l'URL git complète
fonctionne aussi : `claude plugin marketplace add https://github.com/vynarim/ClaudePlugins.git`.

**Le hook 5 h ne se déclenche jamais.**
Vérifie que `node --version` répond, et que `/hooks` liste bien un `UserPromptSubmit`. Pour tester sans
attendre 4 h 30, abaisse temporairement les seuils **avant** de lancer `claude` :

```powershell
$env:ECO_WINDOW_MIN = "5"; $env:ECO_WARN_BEFORE_MIN = "4"
Remove-Item "$HOME\.claude\eco-window-state.json" -ErrorAction SilentlyContinue
claude
# envoie 2-3 messages : l'alerte "⏳ eco — fenêtre 5 h…" doit apparaître.
# puis nettoie :
Remove-Item Env:ECO_WINDOW_MIN, Env:ECO_WARN_BEFORE_MIN -ErrorAction SilentlyContinue
Remove-Item "$HOME\.claude\eco-window-state.json" -ErrorAction SilentlyContinue
```

---

## FAQ

**Où est physiquement le fichier de la skill après installation ?**
Dans le cache des plugins, pas dans ton projet : `~/.claude/plugins/…/claude-utils/skills/eco/SKILL.md`.
Ne l'édite pas — il est écrasé à chaque mise à jour. La source est le repo `ClaudePlugins`.

**Réglages du hook ?**
Variables d'environnement optionnelles : `ECO_WARN_BEFORE_MIN` (défaut 30), `ECO_WINDOW_MIN`
(défaut 300), `ECO_STATE_FILE` (défaut `~/.claude/eco-window-state.json`).

**Le hook connaît-il mon vrai quota ?**
Non. C'est une estimation **locale** qui suppose un usage continu dans Claude Code et ignore le quota
partagé avec le chat Claude.ai / Cowork. Source de vérité : la commande `/usage`.

**Comment désinstaller / désactiver ?**
`claude plugin uninstall claude-utils@dev-tools`, ou en session `/plugin` → désactiver. Le hook échoue
toujours silencieusement : il n'interrompt jamais un prompt, même en cas de souci.