# Gabarit — section Power Platform du CLAUDE.md du projet

Coller cette section dans le `CLAUDE.md` du projet Power Apps. Les skills `pp-diag`, `pp-ship` et
`pp-setup` la lisent pour connaître l'environnement, la solution, le certificat et les connexions.
Remplacer les `<…>` par les valeurs réelles ; supprimer les lignes non applicables.

```markdown
## Power Platform (config plugin claude-powerplatform)

- Environnement : <nom lisible> — <https://orgXXXX.crm.dynamics.com/>
- Solution : <NomDeLaSolution>            # passé à `pac code push --solutionName`
- Dossier de la code app : <chemin relatif depuis la racine, ex. ./src ou .>
- Certificat CA corporate : <chemin .pem, ex. C:\Users\<moi>\corp-ca-bundle.pem>  # ou « aucun »
- Connexions OAuth (créées dans le maker portal) :
  - SharePoint : shared_sharepointonline / <connectionId>
  - Outlook    : shared_office365 / <connectionId>
```

## Notes

- **Environnement** : l'URL Dynamics sert à `pac auth create --environment "<url>"` et à vérifier que
  `pac org who` pointe le bon tenant.
- **Certificat** : nécessaire uniquement pour les `npm install` de dépendances à build natif sur un
  réseau à interception TLS. `npm run build` et `pac code push` n'en ont pas besoin. Mettre « aucun »
  hors réseau corporate.
- **Connexions OAuth** : ne se créent pas en CLI. Les créer une fois dans le maker portal, puis
  reporter ici leurs IDs pour les câbler dans le code de l'app.
- Garder cette section courte : le `CLAUDE.md` est injecté à chaque prompt (voir la skill `eco`).
