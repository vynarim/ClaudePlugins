---
name: update-plugins
description: >-
  Met à jour les plugins Claude Code de la marketplace dev-tools sur ce poste : rafraîchit le
  catalogue puis applique la dernière version de chaque plugin installé (commande native
  claude plugin update), et rappelle qu'un redémarrage est nécessaire. À utiliser quand l'utilisateur
  veut mettre à jour un plugin de la marketplace dev-tools (claude-utils…) après une nouvelle version.
  Déclenche sur : « update-plugins », « mets à jour le plugin », « mettre à jour les plugins »,
  « update plugin », « nouvelle version du plugin », « récupère la dernière version du plugin ».
---

# update-plugins — Mettre à jour les plugins dev-tools sur ce poste

Objectif : appliquer la dernière version publiée d'un (ou de tous les) plugin(s) de la marketplace
`dev-tools`, sans avoir à retenir la séquence exacte.

> Pourquoi une skill : `claude plugin marketplace update` rafraîchit seulement le **catalogue** ; il
> ne met **pas** à jour un plugin déjà installé. C'est `claude plugin update <plugin>` qui applique la
> nouvelle version. Cette skill enchaîne les deux.

## Procédure

1. **Rafraîchir le catalogue** de la marketplace :
   ```powershell
   claude plugin marketplace update dev-tools
   ```

2. **Déterminer les cibles.**
   - Si l'utilisateur a nommé un plugin (ex. `claude-utils`), ne mettre à jour que celui-là.
   - Sinon, lister les plugins installés et mettre à jour ceux de `@dev-tools` :
     ```powershell
     claude plugin list
     ```

3. **Mettre à jour** chaque plugin cible (commande native ; `-s user` par défaut) :
   ```powershell
   claude plugin update <plugin>@dev-tools
   ```
   La sortie confirme le passage de version (ex. « updated from 2.0.0 to 2.1.0 »). Si elle indique que
   le plugin est déjà à jour alors qu'une nouvelle version est attendue, vérifier que la version a bien
   été **bumpée** côté repo (le mécanisme compare les numéros de version).

4. **Rappeler le redémarrage.** La mise à jour ne s'applique qu'après un **redémarrage** : recharger la
   fenêtre VS Code (`Ctrl+Shift+P` → *Developer: Reload Window*) ou `/reload-plugins`. La skill ne peut
   pas recharger la fenêtre elle-même.

## Ce que cette skill ne fait PAS

- Elle ne recharge pas la fenêtre et ne redémarre rien : tant que le rechargement n'est pas fait à la
  main, la session continue de tourner sur l'ancien payload — c'est le piège habituel, la commande
  répond « updated » et rien ne change.
- Elle n'**installe** pas un plugin absent du poste (`claude plugin install`) et n'active pas un
  plugin désactivé.
- Elle ne redescend pas de version : `update` ne gère pas le downgrade, qui passe par `uninstall`
  puis `install`.
- Elle ne met à jour que les plugins de `dev-tools` — ceux des autres marketplaces ne sont pas
  touchés, même installés sur le même poste.
- Elle ne touche pas au dépôt de la marketplace : aucun manifeste édité, aucune version bumpée. Un
  plugin annoncé « déjà à jour » alors qu'on attend mieux est un **bump manquant côté repo**, pas un
  échec de la skill.

## Sortie attendue

Confirmer, par plugin, l'ancienne et la nouvelle version (ou « déjà à jour »), puis rappeler de
recharger la fenêtre.

## Notes

- Ne pas confondre avec `claude plugin marketplace update` (catalogue) — c'est `claude plugin update`
  (plugin installé) qui applique réellement la nouvelle version.
- **Pour ne plus avoir à lancer cette skill après chaque publication** : ajouter `"autoUpdate": true`
  à l'entrée de la marketplace dans `extraKnownMarketplaces` (`~/.claude/settings.json`), ce qui met à
  jour la marketplace et ses plugins installés au démarrage. L'option n'est exposée par aucune commande
  du CLI. La skill reste utile pour appliquer un bump *tout de suite* sans attendre un redémarrage.
  Détails : [INSTALL.md](https://github.com/vynarim/ClaudePlugins/blob/main/INSTALL.md#automatiser--loption-autoupdate).
- Alternative si `update` se comporte mal : `claude plugin uninstall <plugin>@dev-tools` puis
  `claude plugin install <plugin>@dev-tools`.
- Cette skill agit au scope **user** par défaut ; préciser `-s project`/`local` si le plugin a été
  installé à un autre scope.
