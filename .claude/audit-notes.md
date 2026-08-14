# Notes d'audit — ClaudePlugins

Spécificités projet lues par la skill `/audit` (plugin `claude-utils`). La méthode, les checklists
d'axe et le format du rapport vivent dans la skill ; les constats et leur statut vivent dans
`.claude/audit-log.md`.

⚠️ **Ici il n'y a ni base, ni écran, ni runtime.** Ce qu'on audite, c'est la **cohérence d'un
catalogue** : manifestes, skills, docs et versions doivent dire la même chose, et une skill doit
pouvoir se déclencher puis tourner sur n'importe quel dépôt.

## Axes

| Axe | État | Pourquoi |
|---|---|---|
| `SEC` sécurité & auth | **N/A** | aucun runtime, aucune donnée, aucun droit |
| `DATA` données & modèle | **N/A** | pas de base ni de modèle de données |
| `FONC` métier & fiabilité | actif | « une skill se déclenche et fait ce qu'elle annonce » |
| `PERF` performance & coût | actif | restreint au coût en tokens de ce qu'une skill charge |
| `PROP` propreté | actif | renvois morts, contenu dupliqué entre docs |
| `CONF` config & tests | actif | versions, manifestes, publication, docs |

## Où vit le « modèle »

- `.claude-plugin/marketplace.json` — plugins déclarés, `description`, `keywords`, `metadata.version`
- `<plugin>/.claude-plugin/plugin.json` — `version` (c'est elle qui déclenche la mise à jour sur les
  postes), `description`, `keywords`
- `<plugin>/skills/<nom>/SKILL.md` — frontmatter `name` + `description`, et `references/` éventuels
- `.claude/skills/` — skills **internes**, non publiées (`skill-new`)
- Docs : `README.md` racine, `claude-utils/README.md`, `claude-utils/QUICKSTART.md`, `INSTALL.md`,
  `DEPLOYMENT.md`, `CLAUDE.md`, `examples/`, `docs/index.html` (page GitHub Pages autonome)

## Domaines

`manifestes` · `skills` · `docs`

## Points de checklist maison

- `FONC` — **Description qui ne déclenche pas.** C'est le seul élément chargé en permanence, et c'est
  sur lui seul que la skill part. Une `description` sans formulations réelles de l'utilisateur
  (« Déclenche sur : … ») donne une skill morte : présente dans `/`, jamais invoquée.
- `FONC` — **`name` du frontmatter ≠ nom du dossier**, ou `name` en collision avec une skill locale
  d'un projet consommateur (`ship`, `deploy`, `test`, `doc`…). La collision se voit chez le
  consommateur, pas ici — donc invisible depuis ce dépôt.
- `FONC` — **Fuite de contexte local dans une skill publiée** : chemin en dur, référence à ce dépôt,
  hypothèse de stack. Une skill de `claude-utils` doit tourner partout ; le spécifique appartient au
  fichier de notes du consommateur.
- `PERF` — **Skill monolithique** : contenu qui devrait vivre dans `references/` et n'être chargé
  qu'à la demande, chargé à chaque invocation.
- `PROP` — **Renvoi croisé mort** : une skill qui cite `/xxx` supprimée ou renommée, un `references/…`
  annoncé mais absent, un lien Markdown vers un fichier déplacé.
- `PROP` — **Même consigne écrite deux fois** dans deux docs, et déjà divergente. Classe de défaut la
  plus fréquente ici : tout est documenté deux fois.
- `CONF` — **Skill publiée mais non déclarée** : absente d'un des tableaux (`README.md` racine,
  `claude-utils/README.md`, `QUICKSTART.md`, liste du `CLAUDE.md`) ou des `description` de
  `plugin.json` / `marketplace.json`. Et l'inverse : une ligne de tableau pour une skill disparue.
- `CONF` — **Version non bumpée** alors que des fichiers de `<plugin>/skills/` ont changé depuis le
  dernier bump : les postes ne recevront rien. Vérifier aussi que `metadata.version` de
  `marketplace.json` et la colonne version du README racine suivent `plugin.json`.
- `CONF` — **`examples/` et `docs/index.html` périmés** : gabarit de `settings.json` sous une forme
  que `INSTALL.md` ne documente plus, page Pages qui ne liste plus les bonnes skills.
- `CONF` — **Skill interne exposée par erreur** dans `<plugin>/skills/`, ou skill publiable restée
  dans `.claude/skills/`.

## Déjà couvert par les tests

Rien d'automatisé — pas de tests ici. Le seul contrôle mécanique est la validation JSON :

```powershell
node -e "['.claude-plugin/marketplace.json','claude-utils/.claude-plugin/plugin.json'].forEach(f=>{JSON.parse(require('fs').readFileSync(f,'utf8'));console.log('OK '+f)})"
```

Le lancer avant de conclure : un JSON cassé empêche le chargement du plugin et rend tout le reste de
l'audit sans objet.

## Hors périmètre

- `docs/index.html` dans son détail de mise en forme — seul son contenu factuel compte.
- Le style rédactionnel des skills. On audite ce qui est faux ou contradictoire, pas ce qui pourrait
  être mieux tourné.
