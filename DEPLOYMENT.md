# DEPLOYMENT.md — déployer le plugin `claude-utils`

Guide pas-à-pas : créer le repo GitHub, le publier comme marketplace `dev-tools`, installer le plugin
`claude-utils` sur un poste, et faire en sorte qu'Azalee et LudEvent le **recommandent** aux développeurs.

> Remplace partout `vynarim` par ton compte/organisation GitHub. Adapte le nom de repo
> `ClaudePlugins` si tu en choisis un autre. Les noms **marketplace = `dev-tools`**, **plugin = `claude-utils`**
> et **skill = `eco`** sont fixés dans les manifestes ; l'install se fait sur `claude-utils@dev-tools`.

---

## 1. Préparer le dépôt en local

Le contenu de ce dossier est déjà structuré pour servir de **racine de repo** (`.claude-plugin/` et
`claude-utils/` à la racine). Place-toi dedans :

```powershell
cd C:\chemin\vers\ce-dossier
git init
git add .
git commit -m "feat: marketplace dev-tools + plugin claude-utils v1.0.0 (skill eco)"
git branch -M main
```

## 2. Pousser sur le repo GitHub

Le repo existe déjà : https://github.com/vynarim/ClaudePlugins. S'il est **vide** (créé sans README ni
.gitignore), branche le remote et pousse :

```powershell
git remote add origin https://github.com/vynarim/ClaudePlugins.git
git push -u origin main
```

> S'il contient déjà un commit (README créé à l'init côté GitHub), fais d'abord
> `git pull --rebase origin main` avant le `push`, ou écrase avec `git push -u --force origin main`
> si le repo est encore vierge de ton côté.

Alternative pour un futur repo, avec GitHub CLI : `gh repo create <nom> --public --source=. --remote=origin --push`.

## 3. Installer sur CE poste

Dans Claude Code (VS Code) :

```
/plugin marketplace add vynarim/ClaudePlugins
/plugin install claude-utils@dev-tools
/reload-plugins
```

Notes :
- Repo **public** → `marketplace add` ne demande aucune authentification. En cas d'échec, vérifie
  l'orthographe (`vynarim/ClaudePlugins`, sensible à la casse) et que le repo n'est pas vide ; au besoin
  l'URL git complète marche aussi : `/plugin marketplace add https://github.com/vynarim/ClaudePlugins.git`.
- Épingler une version : pointer un tag, ex. `git@github.com:vynarim/ClaudePlugins.git#v1.0.0`.

### Vérifier

- `/plugin` → onglet *Installed* : `claude-utils@dev-tools` présent et activé.
- `/eco` doit être proposé, et `/hooks` doit lister le hook `UserPromptSubmit`.
- En cas de souci : onglet *Errors* de `/plugin`, ou lance Claude Code avec `--debug`.

Pour disposer de `claude-utils` dans **tous** tes projets sur ce poste, installe-le au scope *user*
(défaut). La recommandation par projet (étape 4) sert surtout aux autres postes/développeurs.

## 4. Recommander le plugin dans Azalee et LudEvent

Quand un développeur ouvre le projet et **fait confiance** au dossier, Claude Code lui propose
d'installer la marketplace et le plugin s'il ne les a pas. Dans **chaque** repo de projet, committe
`.claude/settings.json` (gabarit dans `examples/`) :

```json
{
  "extraKnownMarketplaces": {
    "dev-tools": {
      "source": { "source": "github", "repo": "vynarim/ClaudePlugins" }
    }
  },
  "enabledPlugins": {
    "claude-utils@dev-tools": { "enabled": true, "scope": "project" }
  }
}
```

```powershell
# à la racine du repo Azalee, puis idem pour LudEvent
New-Item -ItemType Directory -Force -Path ".\.claude" | Out-Null
Copy-Item "C:\chemin\vers\ce-dossier\examples\project.claude-settings.json" ".\.claude\settings.json"
git add .claude/settings.json
git commit -m "chore: recommander le plugin claude-utils (marketplace dev-tools)"
git push
```

- `extraKnownMarketplaces` fait connaître la marketplace au projet.
- `enabledPlugins` (scope `project`) pré-active `claude-utils` une fois installé.

⚠️ C'est une **proposition au moment du trust**, pas une installation silencieuse forcée. L'install
imposée sans interaction passe par les *managed settings* d'entreprise, pas par un repo de projet.

> Si un projet a déjà un `.claude/settings.json`, **fusionne** les clés `extraKnownMarketplaces` et
> `enabledPlugins` dans l'existant au lieu d'écraser le fichier.

## 5. Faire évoluer le plugin

### Ajouter une skill générique
1. Crée `claude-utils/skills/<nom>/SKILL.md` (+ références éventuelles). Le dossier `skills/` est
   auto-découvert : pas besoin de modifier `plugin.json`.
2. Passe à l'étape « publier » ci-dessous.

### Publier une nouvelle version
1. **Incrémente `version`** dans `claude-utils/.claude-plugin/plugin.json` ET dans
   `.claude-plugin/marketplace.json` (le bump déclenche la détection côté postes).
2. `git commit` + `git push`.
3. Sur les postes :

```
/plugin marketplace update dev-tools
/reload-plugins
```

L'auto-update est **désactivé par défaut** pour une marketplace tierce (non officielle) ; active-le par marketplace dans
`/plugin`, ou demande à l'équipe de lancer la commande ci-dessus après une release.

## 6. Sécurité — à dire à l'équipe

Un plugin exécute du code arbitraire avec les privilèges de l'utilisateur (ici, le hook Node). N'ajoutez
et n'installez que depuis ce repo interne. Le « trust » du dossier projet autorise l'exécution : ce
n'est pas une formalité. Node.js doit être présent sur chaque poste (déjà requis par Claude Code).
Après toute install/màj : `/reload-plugins` ou redémarrage pour activer les changements de hook.