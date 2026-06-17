# ClaudePlugins — marketplace interne `dev-tools`

> 👉 **Développeur ? Commence ici : [INSTALL.md](INSTALL.md)** — installation en une commande.

Dépôt-catalogue (marketplace **`dev-tools`**) des plugins Claude Code internes. Contient pour l'instant
le plugin **`claude-utils`** (boîte à outils de skills génériques + hook fenêtre 5 h). Repo **public** :
l'installation ne demande aucune authentification.

## Vocabulaire (4 noms à ne pas confondre)

| Élément | Nom | Où |
|---|---|---|
| Repo GitHub | `ClaudePlugins` | github.com/vynarim/ClaudePlugins |
| Marketplace | `dev-tools` | champ `name` de `.claude-plugin/marketplace.json` |
| Plugin | `claude-utils` | dossier `claude-utils/` |
| Skill | `eco` | `claude-utils/skills/eco/` (invocable via `/eco`) |

L'install se réfère au couple **plugin@marketplace** : `claude-utils@dev-tools`.

## Structure

\```
.
├── .claude-plugin/marketplace.json
├── claude-utils/                ← le plugin
│   ├── .claude-plugin/plugin.json
│   ├── skills/eco/
│   │   ├── SKILL.md
│   │   └── references/
│   └── hooks/
│       ├── hooks.json
│       └── scripts/eco-window-check.js
├── examples/
│   └── project.claude-settings.json   ← à committer dans Azalee / LudEvent
├── INSTALL.md                  ← guide développeur (installer/utiliser)
├── DEPLOYMENT.md               ← guide mainteneur (publier/mettre à jour)
├── CHANGELOG.md
└── README.md
\```

## Documentation

| Tu es… | Tu veux… | Lis |
|---|---|---|
| Développeur | installer et utiliser le plugin sur ton poste | **[INSTALL.md](INSTALL.md)** |
| Mainteneur | créer le repo, publier, faire évoluer le plugin | **[DEPLOYMENT.md](DEPLOYMENT.md)** |
| Curieux | comprendre ce que contient le plugin | [claude-utils/README.md](claude-utils/README.md) |
| Tous | suivre les versions | [CHANGELOG.md](CHANGELOG.md) |

## Installation rapide (développeur)

Le plus souvent, **ouvre simplement le projet** (Azalee, LudEvent…) et accepte l'invite d'installation
au moment du « trust » du dossier. Sinon, en manuel depuis le terminal :

```powershell
claude plugin marketplace add vynarim/ClaudePlugins
claude plugin install claude-utils@dev-tools
```

Détails, vérifications et dépannage dans **[INSTALL.md](INSTALL.md)**.