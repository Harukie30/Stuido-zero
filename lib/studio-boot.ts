/**
 * In-memory only — resets on hard refresh / full document load.
 * Soft client navigations (About, Games, back button) keep this module alive
 * so the studio boot screen does not replay.
 */
let studioBootCompleted = false;

export function isStudioBootCompleted() {
  return studioBootCompleted;
}

export function completeStudioBoot() {
  studioBootCompleted = true;
}
