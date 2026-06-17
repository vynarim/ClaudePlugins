#!/usr/bin/env node
/*
 * eco — hook d'alerte de fenêtre 5 h pour Claude Code.
 *
 * Déclenché sur chaque UserPromptSubmit. Estime LOCALEMENT l'âge de la fenêtre
 * 5 h glissante (ancrée au premier prompt) et prévient quand le reset approche.
 *
 * ⚠️ Estimation locale uniquement. La vraie fenêtre est côté serveur et partagée
 * avec le chat Claude.ai / Cowork : ce hook ne la voit pas. Il suppose un usage
 * continu dans Claude Code. Source de vérité : la commande /usage.
 *
 * Aucune dépendance externe. En cas d'erreur, sort silencieusement (exit 0) pour
 * ne JAMAIS bloquer un prompt.
 *
 * Réglages (variables d'environnement, optionnelles) :
 *   ECO_WARN_BEFORE_MIN  minutes avant le reset où alerter (défaut : 30)
 *   ECO_WINDOW_MIN       durée de la fenêtre en minutes (défaut : 300 = 5 h)
 *   ECO_STATE_FILE       chemin du fichier d'état (défaut : ~/.claude/eco-window-state.json)
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

function intFromEnv(name, fallback) {
  const v = parseInt(process.env[name], 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

function main() {
  const WINDOW_MS = intFromEnv('ECO_WINDOW_MIN', 300) * 60 * 1000;
  const WARN_BEFORE_MS = intFromEnv('ECO_WARN_BEFORE_MIN', 30) * 60 * 1000;
  const stateFile =
    process.env.ECO_STATE_FILE ||
    path.join(os.homedir(), '.claude', 'eco-window-state.json');

  const now = Date.now();

  // Lecture de l'état précédent (tolérante aux fichiers absents/corrompus).
  let state = null;
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch (_) {
    state = null;
  }

  // Nouvelle fenêtre si aucun état, ou si la précédente a dépassé 5 h
  // (le rolling window se réarme au premier prompt suivant l'expiration).
  let windowStart;
  let warned;
  if (
    !state ||
    typeof state.windowStart !== 'number' ||
    now - state.windowStart >= WINDOW_MS
  ) {
    windowStart = now;
    warned = false;
  } else {
    windowStart = state.windowStart;
    warned = state.warned === true;
  }

  const elapsed = now - windowStart;
  const remaining = WINDOW_MS - elapsed;

  let shouldWarn = false;
  if (!warned && remaining <= WARN_BEFORE_MS && remaining > 0) {
    shouldWarn = true;
    warned = true;
  }

  // Persistance de l'état (échec silencieux : ne doit pas bloquer le prompt).
  try {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(
      stateFile,
      JSON.stringify({ windowStart, warned, lastSeen: now }),
      'utf8'
    );
  } catch (_) {
    /* on continue quand même */
  }

  if (!shouldWarn) {
    process.exit(0);
  }

  const remainingMin = Math.max(1, Math.round(remaining / 60000));
  const resetAt = new Date(windowStart + WINDOW_MS).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const userMsg =
    `⏳ eco — fenêtre 5 h : il reste ~${remainingMin} min avant le reset estimé ` +
    `(~${resetAt}). C'est une estimation locale : vérifie /usage pour la vraie ` +
    `valeur (le quota est partagé avec le chat). Bon moment pour finir la tâche ` +
    `en cours, /compact si tu restes dessus, ou /clear avant de repartir.`;

  // Sortie JSON : systemMessage (visible par l'utilisateur, coût 0 token) +
  // additionalContext minimal (pour que Claude relaie/agisse si besoin).
  const out = {
    systemMessage: userMsg,
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        `[eco] Fenêtre 5 h bientôt atteinte (~${remainingMin} min, estimation locale). ` +
        `Suggère brièvement à l'utilisateur de vérifier /usage et de finir/borner la tâche.`
    }
  };

  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

try {
  main();
} catch (_) {
  // Garde-fou ultime : ne jamais casser l'envoi d'un prompt.
  process.exit(0);
}
