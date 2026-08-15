# Notes de socle — <PROJET>

Spécificités projet lues par la skill `/kit-sync` (plugin `claude-utils`). La méthode vit dans la
skill — ne pas la recopier ici.

## Le socle

| | |
|---|---|
| **Chemin ici** | `<src/kit/>` |
| **Projet frère** | `<NOM>` — `<C:/chemin/absolu/vers/le/projet>` |
| **Source de vérité** | `<lequel des deux fait foi, et pourquoi — le plus récent n'est pas forcément le bon>` |
| **Origine commune** | `<le modèle dont les deux sont issus, et le document qui trace la frontière socle/métier>` |

## Ce qui est socle, et ce qui ne l'est pas

- **Socle** — `<messaging/>`, `<identity/>`, `<ui/>`, `<auth.js>`, `<theme.js>`, `<utils.js>`…
- **Métier, jamais comparé** — `<src/screens/>`, `<src/domain/>`, les écrans propres au produit.
- **Frontière écrite dans** `<docs/TEMPLATE.md>` — <si elle existe : la citer plutôt que la
  paraphraser>.

## Modules pris seul par un projet

<Un module qu'un seul des deux possède : ni progrès ni dérive tant que l'autre ne le réclame pas.>

- `<badges/>` — <projet, depuis quand, pourquoi l'autre ne l'a pas>
- `<navigation/>` — <…>

## Adaptations locales légitimes

<Les écarts déjà arbitrés, pour qu'ils ne soient pas resignalés. Le journal `kit-log.md` les tient à
jour ; ceux qui sont structurels ont leur place ici.>

- `<theme.js>` — <charte graphique différente : divergence permanente et voulue>
- `<messaging/useMessaging.js>` — <l'un a des salons publics, l'autre non>

## Après un portage

- Batterie à rejouer côté receveur : `</test>`, ou <les commandes exactes>
- <Pièges connus : fichier généré à régénérer, dépendance à installer, clé de config à ajouter>
