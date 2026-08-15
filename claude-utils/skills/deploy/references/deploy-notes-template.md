# Notes de déploiement — <PROJET>

Spécificités projet lues par la skill `/deploy` (plugin `claude-utils`). La méthode, l'ordre des
étapes et les garde-fous vivent dans la skill — ne pas les recopier ici. Ce fichier ne contient que
ce que la skill ne peut pas deviner.

## Enjeu

<Ce qu'un déploiement raté coûte **ici**, concrètement. C'est ce qui justifie l'ordre des étapes et
les vérifications qui les précèdent — sans quoi la procédure se contourne le jour où elle gêne.
Ex. : application en production avec des données de clients réels ; une règle trop stricte coupe
l'accès à tout le monde ; telle fonction cassée enferme le dernier administrateur dehors.>

## Cible et régime

- **URL de production** : <https://…>
- **Projet / compte** : <identifiant du projet cloud, alias, site>
- **Régime d'autorisation** : `confirmation-par-commande` | `invocation-vaut-accord`
- **Déploiement par CI ?** : non | oui — <fichier du workflow>, déclenché par une poussée sur
  <branche>. Dans ce cas `/ship` met de fait en ligne : le dire avant de pousser.
- **Shell** : <PowerShell | bash> — <raison si contrainte, ex. git absent du PATH du bash>

## Version

- **Fichier** : `<src/version.js>` — `<export const APP_VERSION = "X.Y.Z">`
- **Reporté aussi dans** : `<package.json>` | —
- **Bumpé par** : cette skill | `/ship` | `<npm run bump>`
- **Règle d'incrément** : <sémantique classique, ou règle maison — décrire les paliers>
- **Contrôle « la version est dans le bundle »** : <commande qui **lit** le numéro depuis le fichier
  de version puis le cherche dans le build — jamais un numéro écrit en dur>

## Vérifications avant déploiement

| Commande | Ce qu'elle couvre | Obligatoire avant livraison |
|---|---|---|
| `<npm run lint>` | <…> | oui |
| `<npm test>` | <…> | oui |
| `<npm run test:rules>` | <droits réellement appliqués> | oui — même si le lot ne touche pas les règles |
| `<npm run build>` | <compile tous les écrans> | oui |

<Si le projet a une skill `/test`, l'appeler plutôt que de dupliquer la liste ici.>

## Ne jamais committer

`<service-account.json>` · `<winroots.pem>` · `<.env>` · `<functions/.env>` · `<node_modules>` ·
`<dist>` · <données réelles : fichiers d'import, exports clients…>

<Contrôle spécifique si le dépôt est public et contient des données de démonstration : commande qui
doit ne rien renvoyer.>

## Secrets du poste

<Où vivent les fichiers d'identification et le bundle CA, comment ils sont générés, et le rappel
qu'ils sont gitignorés donc absents d'un nouveau clone. **Toujours les référencer en relatif** — le
chemin du projet diffère d'un PC à l'autre.>

## Cibles

| Cible | Commande | Quand |
|---|---|---|
| <hébergement> | `<…>` | <modif d'interface — le cas courant> |
| <fonctions> | `<…>` | <si `functions/` a changé> |
| <règles> | `<…>` | <si les règles ont changé> |
| <index> | `<…>` | <ajout ou modif d'index> |

**Pièges d'ordre propres au projet** : <ex. telle commande n'emporte pas les index ; telle cible
déploie sur deux bases à la fois ; telle fonction ne doit jamais être supprimée.>

## Sonde en ligne

<Le geste exact qui prouve que la nouvelle version est servie et se comporte bien : commande qui lit
le numéro de version dans le bundle publié, message attendu en console, écran à ouvrir, appel réel à
tester. Préciser ce qu'il faut voir pour conclure.>

<Si les règles ont bougé : quel compte non privilégié utiliser, et quel geste refaire.>

## Rollback

<Comment revenir en arrière : redéploiement du build précédent, sauvegarde à prendre avant, cibles
qui ne se rejouent pas à l'identique.>
