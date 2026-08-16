// Contrôle des liens relatifs des SKILL.md, pour /plugin-check.
//
// Deux sens : les liens qui ne mènent nulle part, et les fichiers de `references/` que plus aucun
// SKILL.md ne cite — chargés par personne, donc morts sans que rien ne le signale.
//
// L'ancrage sur `](` et non sur `(` est délibéré : une parenthèse de phrase autour d'un lien
// markdown — « (gabarit dans [x](y)) » — fait capturer n'importe quoi à un motif plus naïf.
//
// Usage : node liens.mjs [dossier de skills …]   (défaut : les deux dossiers du repo)

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

// Les dossiers de skills des plugins sont découverts, pas énumérés : une liste en dur ici ferait
// qu'un plugin ajouté plus tard échapperait au contrôle sans que rien ne le signale.
const plugins = readdirSync('.', { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  .map((e) => e.name)
  .filter((n) => existsSync(join(n, '.claude-plugin', 'plugin.json')))
  .sort();

const racines = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [...plugins.map((p) => `${p}/skills`), '.claude/skills'];

const skills = [];
for (const racine of racines) {
  if (!existsSync(racine)) continue;
  for (const nom of readdirSync(racine)) {
    const md = join(racine, nom, 'SKILL.md');
    if (existsSync(md)) skills.push({ nom, racine, md, dir: join(racine, nom) });
  }
}

let morts = 0;
let orphelins = 0;

for (const s of skills) {
  const texte = readFileSync(s.md, 'utf8');
  const cites = new Set();

  // Les liens ne se cherchent que HORS code : un `](` montré en exemple dans une phrase, ou une
  // commande citée dans un bloc, ne sont pas des liens. Le contrôle des orphelins, lui, garde le
  // texte entier — c'est justement dans les blocs de commande que les gabarits sont appelés.
  const sansCode = texte.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');

  for (const m of sansCode.matchAll(/\]\(([^)\n]+)\)/g)) {
    const cible = m[1].trim().split('#')[0];
    if (!cible || /^(https?:|mailto:)/.test(cible)) continue;
    const chemin = resolve(dirname(s.md), cible);
    cites.add(chemin);
    if (!existsSync(chemin)) {
      console.log(`LIEN MORT   ${s.nom.padEnd(14)} ${cible}`);
      morts++;
    }
  }

  const refs = join(s.dir, 'references');
  if (!existsSync(refs)) continue;
  // Un fichier peut être appelé autrement que par un lien markdown — cité en clair, ou passé en
  // argument dans un bloc de commande. Le nom seul suffit donc à le considérer comme référencé :
  // mieux vaut manquer un orphelin que d'en signaler un qui n'en est pas, à chaque passage.
  const parcourir = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) parcourir(p);
      else if (!cites.has(resolve(p)) && !texte.includes(e)) {
        console.log(`ORPHELIN    ${s.nom.padEnd(14)} ${relative(s.dir, p)}`);
        orphelins++;
      }
    }
  };
  parcourir(refs);
}

console.log(`\n${skills.length} skills · ${morts} lien(s) mort(s) · ${orphelins} orphelin(s)`);
process.exit(morts ? 1 : 0);
