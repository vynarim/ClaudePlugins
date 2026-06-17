# ClaudePlugins — marketplace interne `dev-tools`

Dépôt-catalogue (marketplace **`dev-tools`**) des plugins Claude Code internes. Contient pour l'instant
le plugin **`claude-utils`** (boîte à outils de skills génériques + hook fenêtre 5 h).

## Vocabulaire (4 noms à ne pas confondre)

| Élément | Nom | Où |
|---|---|---|
| Repo GitHub | `ClaudePlugins` | github.com/vynarim/ClaudePlugins |
| Marketplace | `dev-tools` | champ `name` de `.claude-plugin/marketplace.json` |
| Plugin | `claude-utils` | dossier `claude-utils/` |
| Skill | `eco` | `claude-utils/skills/eco/` (invocable via `/eco`) |

L'install se réfère au couple **plugin@marketplace** : `claude-utils@dev-tools`.

## Structure

```
.
├── .claude-plugin/marketplace.json
├── claude-utils/                ← le plugin
│   ├── .claude-plugin/plugin.json
│   ├── skills/eco/
│   └── hooks/
├── examples/
│   └── project.claude-settings.json   ← à committer dans Azalee / LudEvent
├── DEPLOYMENT.md
└── README.md
```

## Installation rapide (sur un poste)

```
/plugin marketplace add vynarim/ClaudePlugins
/plugin install claude-utils@dev-tools
/reload-plugins
```

Voir **DEPLOYMENT.md** pour le détail, la recommandation par projet, et le cycle de mise à jour.
