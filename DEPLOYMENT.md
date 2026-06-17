# DEPLOYMENT.md — maintenir la marketplace `dev-tools`

Guide mainteneur : ajouter un plugin, ajouter une skill à un plugin, publier une version, activer des
plugins dans un projet. S'applique à **tous** les plugins du repo (`claude-utils`,
`claude-powerplatform`, et ceux à venir).

---

## Ajouter un nouveau plugin

1. Crée un dossier `<nom-du-plugin>/` à la racine du repo, avec :
   - `<nom-du-plugin>/.claude-plugin/plugin.json` (manifeste : `name`, `version`, `description`…)
   - `<nom-du-plugin>/skills/<skill>/SKILL.md` (au moins une skill)
   - `<nom-du-plugin>/README.md` (rôle, skills, prérequis)
2. Déclare le plugin dans la marketplace `.claude-plugin/marketplace.json` (ajoute une entrée au
   tableau `plugins` : `name`, `source: "./<nom-du-plugin>"`, `description`, `keywords`).
3. Ajoute une ligne au tableau des plugins dans le [README.md](README.md) racine.
4. Valide le JSON, commit, push (voir « Publier »).

> Convention de nommage : préfixe `claude-` pour les plugins (`claude-utils`,
> `claude-powerplatform`). Les skills d'un même plugin partagent souvent un préfixe court
> (`pp-diag`, `pp-ship`…).

---

## Ajouter une skill à un plugin existant

1. Crée `<plugin>/skills/<nom>/SKILL.md` avec le frontmatter `name` et `description`.
2. Le dossier `skills/` est auto-découvert par le harness — pas de modification de `plugin.json` requise.
3. Incrémente la version du plugin et publie (section suivante).

---

## Publier une version

1. Incrémente `version` dans `<plugin>/.claude-plugin/plugin.json` (le plugin modifié).
2. Valide les manifestes JSON touchés, par exemple :
   ```powershell
   node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('OK')"
   ```
3. `git commit` + `git push`.
4. Sur chaque poste : `claude plugin marketplace update dev-tools` (ou `/plugin marketplace update dev-tools`
   en session, suivi de `/reload-plugins`).

L'auto-update étant désactivé par défaut pour les marketplaces tierces, les développeurs doivent
lancer cette commande manuellement après chaque release.

---

## Activer des plugins dans un projet

Committe `.claude/settings.json` à la racine du projet (gabarit dans `examples/`). Enregistre la
marketplace une fois, puis active les plugins voulus :

```json
{
  "extraKnownMarketplaces": {
    "dev-tools": {
      "source": { "source": "github", "repo": "vynarim/ClaudePlugins" }
    }
  },
  "enabledPlugins": {
    "claude-utils@dev-tools": { "enabled": true, "scope": "project" },
    "claude-powerplatform@dev-tools": { "enabled": true, "scope": "project" }
  }
}
```

N'active que les plugins pertinents pour le projet (ex. `claude-powerplatform` seulement sur un projet
Power Apps).

Quand un développeur ouvre le projet et fait confiance au dossier, Claude Code lui propose d'installer
la marketplace et les plugins s'il ne les a pas encore. Ce n'est pas une installation silencieuse
forcée — c'est une proposition.

Si le projet a déjà un `.claude/settings.json`, **fusionne** les clés `extraKnownMarketplaces` et
`enabledPlugins` dans l'existant au lieu de remplacer le fichier.

---

## Sécurité

Un plugin peut exécuter du code avec les privilèges de l'utilisateur (hooks Node, etc.). N'installe
que depuis ce repo interne. Après toute install ou mise à jour : `/reload-plugins` ou redémarrage de
VS Code pour activer les changements.
