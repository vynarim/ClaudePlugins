---
name: skill-new
description: >-
  Crée une nouvelle skill dans le repo ClaudePlugins : choix du plugin ou du scope interne, frontmatter
  avec déclencheurs, squelette de SKILL.md, puis rappel des fichiers à resynchroniser (manifeste,
  marketplace, README). À utiliser quand l'utilisateur veut ajouter une skill à ce repo. Déclenche
  sur : « skill-new », « nouvelle skill », « ajoute une skill », « crée une skill », « scaffolde une
  skill », « je veux une skill qui… ».
---

# skill-new — Créer une skill dans ClaudePlugins

Skill **interne** au repo. Produit une skill conforme aux conventions maison et évite l'oubli
classique : la skill est écrite, mais jamais déclarée ni publiée.

## Procédure

**Étape 1 — Cadrer avant d'écrire**

Établir, en interrogeant l'utilisateur si nécessaire :

1. **Le nom** — kebab-case, verbe ou substantif court (`pr-draft`, `context-check`). C'est ce que
   l'utilisateur tapera après `/`.
2. **Le déclenchement** — les phrases réelles qu'il emploierait. Sans elles la skill existe mais ne
   part jamais.
3. **La destination** :
   - `claude-utils/skills/<nom>/` — **publiée**, disponible sur tous les postes et tous les projets.
   - `.claude/skills/<nom>/` — **interne**, ne sert qu'à ce repo (comme cette skill-ci).
   Trancher sur un critère unique : est-ce que ça a du sens dans un autre dépôt ?
4. **Les limites** — ce que la skill ne doit pas faire (modifier des fichiers, pousser, explorer
   l'arborescence…).

Vérifier qu'aucune skill existante ne couvre déjà le besoin — élargir une skill en place vaut mieux
qu'en créer une neuvième.

**Étape 2 — Écrire le frontmatter**

```yaml
---
name: <nom-kebab-case>
description: >-
  <Ce que fait la skill, en une phrase.> À utiliser quand <situation>.
  Déclenche sur : « <phrase 1> », « <phrase 2> », « <phrase 3> »…
---
```

La `description` est le **routeur**, pas de la documentation : elle est le seul élément chargé en
permanence, et c'est sur elle seule que la skill se déclenche ou non. Y mettre les formulations
réelles de l'utilisateur, en français. Une description vague = une skill morte.

**Étape 3 — Écrire le corps**

Structure maison, dans cet ordre :

```markdown
# <nom> — <titre court>

<Objectif en une à trois phrases : ce que ça produit, pourquoi ça existe.>

## Procédure
**Étape 1 — <titre>** … (commandes exactes en bloc, pas de « explorer le projet »)

## Ce que cette skill ne fait PAS
- <garde-fous>

## Sortie attendue
<Le format du résultat.>
```

La section **« Ce que cette skill ne fait PAS »** n'est pas décorative : c'est elle qui empêche la
skill de partir en exploration ou de committer sans qu'on lui demande. Ne pas la sauter.

Viser ~100 lignes. Ce qui déborde (gabarits, tableaux de référence, procédures annexes) part dans
`skills/<nom>/references/` et n'est lu que quand la skill y renvoie.

**Étape 4 — Resynchroniser (uniquement si la skill est publiée)**

Une skill interne s'arrête à l'étape 3. Une skill dans `claude-utils/` doit en plus être **déclarée
partout où la liste des skills existe**, sinon elle est publiée mais invisible.

La liste de référence vit dans [DEPLOYMENT.md](../../../DEPLOYMENT.md), § « Ajouter une skill à un
plugin existant », point 4 : **la lire et la suivre point par point**, plutôt que de la recopier ici
— une seconde copie diverge, et ce sont justement ses derniers points qu'on oublie. Elle couvre les
deux manifestes (dont le bump de `version` et les `keywords`), les trois docs et le `CLAUDE.md`.

Valider les JSON touchés :

```powershell
node -e "['.claude-plugin/marketplace.json','claude-utils/.claude-plugin/plugin.json'].forEach(f=>{JSON.parse(require('fs').readFileSync(f,'utf8'));console.log('OK '+f)})"
```

**Étape 5 — Rappeler la suite**

La skill n'est pas active tant que la fenêtre n'a pas été rechargée (*Developer: Reload Window* ou
`/reload-plugins`). Puis `/ship` pour publier — **pas de commit automatique**.

## Ce que cette skill ne fait PAS

- Elle ne committe pas et ne pousse pas — c'est `/ship`.
- Elle ne bumpe pas la version sans le dire explicitement à l'utilisateur.
- Elle ne crée pas de `references/` « au cas où » : seulement si le contenu déborde réellement.

## Sortie attendue

Le chemin du `SKILL.md` créé, la liste des fichiers resynchronisés (ou « aucun — skill interne »), et
le rappel du rechargement de fenêtre.
