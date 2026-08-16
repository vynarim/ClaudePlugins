// Pré-filtre d'ombrage pour /perms.
//
// Repère deux choses dans les listes `permissions.allow` : les doublons exacts entre fichiers, et
// les entrées couvertes par un motif plus large de la même liste ou d'une liste plus large.
//
// Il compare des MOTIFS, pas la sémantique exacte du harness : ce qu'il propose se relit avant
// suppression, et ce qu'il ne trouve pas n'est pas une preuve d'absence.
//
// Usage : node ombrage.mjs <settings.json> [<settings.json> …]   (du plus large au plus précis)

import { readFileSync } from 'node:fs';

const analyser = (brut) => {
  const m = /^([A-Za-z_][\w-]*)\((.*)\)$/s.exec(brut);
  return m ? { brut, outil: m[1], arg: m[2] } : { brut, outil: brut, arg: null };
};

// `a` couvre-t-il `b` ? L'outil doit être le même : Bash et PowerShell sont deux listes disjointes.
const couvre = (a, b) => {
  if (a.brut === b.brut) return false;
  if (a.outil.endsWith('*')) return b.outil.startsWith(a.outil.slice(0, -1)); // mcp__serveur__*
  if (a.outil !== b.outil) return false;
  if (a.arg === null) return true; // outil nu : couvre tous ses motifs
  if (b.arg === null) return false;
  return a.arg.endsWith('*') && b.arg.startsWith(a.arg.slice(0, -1));
};

const fichiers = process.argv.slice(2);
if (!fichiers.length) {
  console.error('usage : node ombrage.mjs <settings.json> [<settings.json> …]');
  process.exit(2);
}

const entrees = [];
for (const [rang, f] of fichiers.entries()) {
  const json = JSON.parse(readFileSync(f, 'utf8'));
  const allow = json.permissions?.allow ?? [];
  for (const e of allow) entrees.push({ fichier: f, rang, ...analyser(e) });
  console.log(`[${rang}] ${f} : ${allow.length} entrées`);
}

// La portée compte autant que le motif : un `Read` nu déclaré dans un projet ne couvre rien en
// dehors de ce projet. Les fichiers étant passés du plus large au plus précis, seul un fichier de
// rang inférieur ou égal peut ombrer.
const ombre = (a, b) => a.rang <= b.rang && couvre(a, b);

const doublons = [];
const ombrees = [];
for (const b of entrees) {
  if (entrees.some((a) => a !== b && a.brut === b.brut) && !doublons.some((d) => d.brut === b.brut)) {
    doublons.push(b);
  }
  const parents = [...new Map(entrees.filter((a) => ombre(a, b)).map((p) => [p.brut, p])).values()];
  if (parents.length) ombrees.push({ ...b, parents });
}

console.log(`\n=== doublons exacts (${doublons.length}) ===`);
for (const d of doublons) console.log(`  ${d.brut}`);

console.log(`\n=== ombrées (${ombrees.length}) ===`);
for (const o of ombrees) {
  const par = o.parents.map((p) => `${p.brut} [${p.rang}]`).join('  ,  ');
  console.log(`  [${o.rang}] ${o.brut}\n        ← ${par}`);
}
