# Gabarit — section Power Platform du CLAUDE.md du projet

Gabarit partagé par toutes les skills du plugin `claude-powerplatform` (`pp-setup`, `pp-scaffold`,
`pp-data`, `pp-diag`, `pp-ship`). Coller cette section dans le `CLAUDE.md` du projet ; remplacer les
`<…>` ; supprimer les lignes non applicables.

```markdown
## Power Platform (config plugin claude-powerplatform)

- Environnement : <nom lisible> — <https://orgXXXX.crm.dynamics.com/>
- Solution : <NomDeLaSolution>              # pac code push --solutionName
- Préfixe éditeur (publisher) : <prefix>     # hérité de la solution cible
- Dossier de la code app : <chemin relatif, ex. .>
- App (pac code init) : displayName "<nom affiché>"   # marqueur = power.config.json
- SDK : @microsoft/power-apps                # ne pas figer la version (preview, évolue)
- Certificat CA corporate : <chemin .pem>    # ou « aucun » — utile seulement aux npm install
- Sources de données (pac code add-data-source → src/generated/) :
  - Dataverse : table <logicalName>
  - Teams : shared_teams / connectionId <id>            # ou connection ref <logicalName>
  - Office 365 Users : shared_office365users / <id>
```

## Notes

- **Environnement** : l'URL Dynamics sert à `pac auth create` / `pac env select` et à vérifier que
  l'org active est la bonne.
- **Solution & ALM** : `--solutionName` associe l'app à une solution. Pour la portabilité
  Dev/Test/Prod, préférer des **connection references** (`add-data-source -cr <logicalName> -s <solutionId>`)
  plutôt que des `connectionId` propres à un utilisateur. Le préfixe éditeur vient de la solution.
- **Certificat** : requis seulement pour les `npm install` de dépendances à build natif sur réseau à
  interception TLS. `npm run build`, `npm run dev` et `pac code push` n'en ont pas besoin.
- **Connexions** : créées dans le maker portal ou via le CLI (preview), puis câblées par
  `pac code add-data-source`. Récupérer les IDs avec `pac connection list`.
- **Fichiers générés** : `pac code add-data-source` produit des modèles/services TypeScript typés sous
  `src/generated/` (CRUD typé). Pas de refresh sur changement de schéma → delete + re-add.
- **Preview / dépréciation** : les Code Apps sont en preview (évolue ~mensuellement). Les commandes
  `pac code` sont amenées à être remplacées par le CLI npm embarqué dans `@microsoft/power-apps`
  (v1.0.4+). Ne pas figer de version.
- Garder cette section courte : le `CLAUDE.md` est injecté à chaque prompt (voir la skill `eco`).
