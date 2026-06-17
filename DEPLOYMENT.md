# DEPLOYMENT.md — maintenir le plugin `claude-utils`

Guide mainteneur : ajouter une skill, publier une version, activer le plugin dans un projet.

---

## Ajouter une skill

1. Crée `claude-utils/skills/<nom>/SKILL.md`.
2. Le dossier `skills/` est auto-découvert — pas de modification de `plugin.json` requise.
3. Passe à **Publier une version** ci-dessous.

---

## Publier une version

1. Incrémente `version` dans `claude-utils/.claude-plugin/plugin.json`.
2. `git commit` + `git push`.
3. Sur chaque poste : `claude plugin marketplace update dev-tools` (ou `/plugin marketplace update dev-tools` en session).

L'auto-update est désactivé par défaut pour les marketplaces tierces.

---

## Activer le plugin dans un projet (Azalee, LudEvent…)

Committe `.claude/settings.json` à la racine du projet (gabarit dans `examples/`) :

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

Au trust du dossier, Claude Code propose l'installation à l'utilisateur. Ce n'est pas une installation forcée silencieuse.

Si le projet a déjà un `.claude/settings.json`, fusionne les clés — ne remplace pas le fichier entier.

---

## Sécurité

Le hook Node s'exécute avec les privilèges de l'utilisateur. N'installe que depuis ce repo interne. Après toute install ou mise à jour : `/reload-plugins` ou redémarrage de VS Code.
