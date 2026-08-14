# INSTALL.md — installer les plugins de la marketplace `dev-tools`

Ce repo expose la marketplace `dev-tools`, qui contient plusieurs plugins (voir [README.md](README.md)
pour la liste à jour). On enregistre la marketplace une fois, puis on installe les plugins voulus.

## Prérequis

- **Claude Code** installé (`claude --version`)
- **GitHub CLI** installé **et authentifié** — `gh --version`, puis `gh auth status` qui doit
  répondre *Logged in*. Deux skills de `claude-utils` en dépendent : `pr-draft` ne fonctionne pas du
  tout sans lui, et `session-brief` perd sa section « PRs ouvertes » (le reste du brief marche).
  L'échec est silencieux — la skill part et s'arrête sur `gh: command not found`, ce qui ressemble à
  un bug de la skill. Installation :

  ```powershell
  winget install GitHub.cli
  gh auth login
  ```

  À refaire sur **chaque poste** : c'est un outil machine, rien dans le dépôt ne l'apporte.

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
- Tape `/` : les skills des plugins installés doivent être proposées (ex. `/eco`, `/session-brief`)

---

## Mettre à jour

Deux étapes : rafraîchir le **catalogue**, puis appliquer la nouvelle version au plugin **installé**.

```powershell
claude plugin marketplace update dev-tools      # rafraîchit le catalogue (ne met PAS à jour les plugins)
claude plugin update <plugin>@dev-tools         # applique la dernière version au plugin installé
```

Puis **redémarrer** pour appliquer : recharge la fenêtre VS Code (*Developer: Reload Window*) ou
`/reload-plugins`.

> ⚠️ `marketplace update` seul ne suffit pas : il rafraîchit le catalogue mais ne ré-upgrade pas un
> plugin déjà installé (auto-update désactivé par défaut pour les marketplaces tierces — voir
> « Automatiser » ci-dessous pour l'activer). C'est `claude plugin update` qui applique la nouvelle
> version. Avec le plugin `claude-utils` installé, la skill `/update-plugins` enchaîne ces étapes.
>
> Cas particuliers : un **nouveau** plugin pas encore installé → `claude plugin install <plugin>@dev-tools`.
> Un retour à une version **inférieure** (downgrade) n'est pas géré par `update` → `uninstall` puis
> `install`.

### Automatiser — l'option `autoUpdate`

Pour ne plus lancer ces commandes à la main, ajoute `"autoUpdate": true` à l'entrée de la marketplace
dans ton `~/.claude/settings.json`. C'est un réglage **poste** : il vaut pour tous tes projets.

```json
"extraKnownMarketplaces": {
  "dev-tools": {
    "source": { "source": "github", "repo": "vynarim/ClaudePlugins" },
    "autoUpdate": true
  }
}
```

Claude Code met alors à jour la marketplace **et ses plugins installés** au démarrage. Trois points à
connaître :

- Le CLI n'expose pas cette option — ni `claude plugin`, ni `claude plugin marketplace add`. Elle ne
  s'active qu'en éditant le `settings.json`.
- Une mise à jour ne s'applique jamais à une session déjà ouverte. Selon le moment où le
  téléchargement se termine au démarrage, la nouvelle version peut n'être active qu'au lancement
  suivant. Pour un bump que tu veux tout de suite, `/update-plugins` puis *Reload Window* reste le
  chemin sûr.
- Reprends la **même** forme de `source` que celle déjà enregistrée sur le poste (visible via
  `claude plugin marketplace list`). Décrire la même marketplace autrement — `github`/`repo` d'un
  côté, `git`/`url` de l'autre — peut être vu comme un changement de source et déclencher un
  re-clone.

L'option existe aussi dans le `.claude/settings.json` d'un projet, mais elle s'appliquerait à tous
ceux qui ouvrent le dépôt : garde-la dans ton settings poste.

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

**Une skill `/xxx` n'est pas reconnue (« No matching commands »)**
Cause la plus fréquente : le plugin qui la fournit n'est **pas installé** sur ce poste (l'avoir poussé
dans la marketplace ne suffit pas). Vérifie avec `claude plugin list` ; si le plugin manque,
`claude plugin install <plugin>@dev-tools`. S'il est listé mais la skill manque toujours, **recharge
la fenêtre** VS Code (*Developer: Reload Window*) — les plugins sont chargés à l'ouverture de la
fenêtre. Si la skill a été ajoutée dans une nouvelle version, voir « Mettre à jour » (ré-installer).

**Un plugin apparaît en double dans `/plugin` (onglet *Installed*)**
Il est installé **deux fois, à deux scopes** : une fois au niveau `user` (`claude plugin install …`),
une fois au niveau `project` — déclenché par un projet dont le `.claude/settings.json` déclare le
plugin dans `enabledPlugins`. Même version, même cache : c'est cosmétique, pas de double chargement.
Pour nettoyer, l'install `user` suffisant pour tous les projets :

1. Retire la ligne du plugin dans `enabledPlugins` du `.claude/settings.json` du projet concerné —
   sinon l'install projet revient au prochain trust du dossier.
2. Dans `~/.claude/plugins/installed_plugins.json`, supprime l'objet portant `"scope": "project"`
   dans le tableau du plugin (garde celui en `"scope": "user"`). Fais une copie du fichier avant.
3. Redémarre VS Code.

L'inverse marche aussi : si tu préfères le pilotage par projet, désinstalle la version `user`
(`claude plugin uninstall <plugin>@dev-tools`) et laisse le `settings.json` du projet faire le travail.

**Un plugin n'apparaît pas dans les extensions VS Code**
Normal — un plugin Claude Code est distinct d'une extension VS Code. Gère-les via `/plugin` en
session ou `claude plugin list` dans le terminal.

**Dépannage propre à un plugin**
Les particularités (variables d'environnement, prérequis spécifiques) sont documentées dans le README
de chaque plugin :
- [claude-utils/README.md](claude-utils/README.md)
