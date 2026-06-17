# Gabarit du fichier PowerPlatform.md (racine du projet)

La config du projet vit dans un fichier **`PowerPlatform.md` à la racine du projet** (pas dans le
`CLAUDE.md`). Les skills `pp-setup`, `pp-scaffold`, `pp-data`, `pp-diag`, `pp-ship` le lisent quand
elles en ont besoin. (`/pp-scaffold` peut le créer automatiquement s'il n'existe pas encore.)

Pourquoi un fichier dédié plutôt que le `CLAUDE.md` : (1) c'est plus **clair** — le nom dit ce que
c'est ; (2) c'est plus **économe** — le `CLAUDE.md` est injecté à chaque prompt, alors que
`PowerPlatform.md` n'est lu qu'au moment où une skill `pp-*` en a besoin.

**Ajouter un pointeur dans le `CLAUDE.md`** (s'il existe) pour que Claude sache où regarder même hors
skill :

```markdown
- Config Power Platform → voir [PowerPlatform.md](PowerPlatform.md)
```

> Ce gabarit est volontairement très commenté : il s'adresse à des **citizen devs** Power Apps, pas
> à des développeurs de métier. Chaque champ explique ce qu'il est et **où trouver la valeur**. En cas
> de doute, demande simplement à Claude (ex. « où je trouve le nom unique de ma solution ? »).

Contenu à mettre dans `PowerPlatform.md` :

```markdown
# Power Platform — config du projet (plugin claude-powerplatform)
# Remplace chaque valeur d'exemple par celle de TON projet. Garde les commentaires (lignes « # ») :
# ils servent de mémo. Les lignes inutiles peuvent être supprimées.

- Nom de l'environnement : Nom de l'environnement
  # Nom lisible, celui affiché dans le centre d'administration Power Platform. Sert juste à t'y
  # retrouver (pas utilisé par les commandes).
- URL de l'environnement : https://exemple.crm.dynamics.com/
  # L'adresse de ton organisation Dynamics — c'est CE QUE pac utilise (auth, env select, init).
  # ⚠️ Ne la devine pas : récupère-la avec « pac env list » (ou la barre d'adresse sur
  #   make.powerapps.com). Attention à la région : .crm.dynamics.com (Amérique du Nord),
  #   .crm.dynamics.com (France), etc.

- Solution : NomDeLaSolution
  # Une « solution » est le conteneur qui regroupe ton app et ses éléments dans Power Platform.
  # ⚠️ Mets le NOM UNIQUE, PAS le « nom d'affichage » : le nom unique n'a NI TIRET NI ESPACE.
  # • Où le trouver : make.powerapps.com → Solutions → ouvre la tienne → colonne/champ « Nom ».
  # • Elle doit DÉJÀ EXISTER et être NON managée. La commande de publication NE LA CRÉE PAS :
  #   crée-la d'abord dans le maker portal (Solutions → Nouvelle solution).

- Préfixe éditeur (publisher) : prefix
  # Petit code (2 à 8 lettres minuscules) ajouté automatiquement devant tes éléments.
  # Il vient de l'« éditeur » que tu choisis en créant la solution. Information seulement ici.

- Dossier de la code app : .
  # L'emplacement du code de l'app dans le projet. « . » = à la racine du projet (cas habituel).

- App (pac code init) : displayName "Nom affiché de l'app"
  # Le nom de ton app tel qu'il apparaîtra dans Power Apps.
  # Il est défini par la commande d'initialisation (pac code init), qui crée le fichier
  # power.config.json — ce fichier prouve que le dossier est bien une « Code App ».

- SDK : @microsoft/power-apps
  # Bibliothèque technique de Power Apps. À laisser tel quel ; ne pas figer la version (preview).

- Certificat CA corporate : aucun
  # Utile UNIQUEMENT sur un réseau d'entreprise qui inspecte le trafic Internet. Sinon : « aucun ».
  # Symptôme si besoin : une installation (npm install) échoue avec
  # « unable to get local issuer certificate ». Dans ce cas, mets ici le chemin d'un fichier .pem
  # (la skill /pp-setup explique comment l'obtenir).

- Tables Dataverse existantes à utiliser :
  # Tables DÉJÀ PRÉSENTES dans l'environnement, que l'app doit utiliser (pas créer). /pp-data les
  # connecte une par une et génère le code d'accès dans src/generated/.
  # ⚠️ Indique le NOM LOGIQUE de la table, PAS son nom d'affichage.
  #   Où le trouver : make.powerapps.com → Tables → ouvre la table → Propriétés → « Nom logique »
  #   (en minuscules, parfois préfixé : account, contact, cr123_projet…). « Comptes » ne marche pas.
  #   Ajoute autant de lignes « - » que de tables ; supprime les exemples ci-dessous.
  - account                                           # ex. table standard « Comptes »
  - contact                                           # ex. table standard « Contacts »

- Connecteurs à utiliser :
  # Sources autres que Dataverse (Teams, Office 365…). /pp-data les connecte aussi (génère le code).
  # Renseigne apiName / connectionId (récupérés via « pac connection list »).
  - Teams : shared_teams / connectionId <id>          # connecteur Microsoft Teams
  - Office 365 Users : shared_office365users / <id>   # connecteur Office 365
```

## Notes

- **Environnement** : l'URL Dynamics sert à `pac auth create` / `pac env select` et à vérifier que
  l'org active est la bonne.
- **Solution & ALM** : `--solutionName` attend le **nom unique** de la solution (pas le nom
  d'affichage) — alphanumérique + underscores, ni tiret ni espace. La solution doit **déjà exister**
  et être **non managée** : `pac code push` ne la crée pas. La créer une fois dans le maker portal
  (Solutions → Nouvelle solution), avec un **éditeur** dont le préfixe de personnalisation fait
  **2 à 8 caractères minuscules**. Pour la portabilité Dev/Test/Prod, préférer des **connection
  references** (`add-data-source -cr <logicalName> -s <solutionId>`) plutôt que des `connectionId`
  propres à un utilisateur.
- **Certificat** : requis seulement pour les `npm install` de dépendances à build natif sur réseau à
  interception TLS. `npm run build`, `npm run dev` et `pac code push` n'en ont pas besoin.
- **Connexions** : créées dans le maker portal ou via le CLI (preview), puis câblées par
  `pac code add-data-source`. Récupérer les IDs avec `pac connection list`.
- **Fichiers générés** : `pac code add-data-source` produit des modèles/services TypeScript typés sous
  `src/generated/` (CRUD typé). Pas de refresh sur changement de schéma → delete + re-add.
- **Preview / dépréciation** : les Code Apps sont en preview (évolue ~mensuellement). Les commandes
  `pac code` sont amenées à être remplacées par le CLI npm embarqué dans `@microsoft/power-apps`
  (v1.0.4+). Ne pas figer de version.
