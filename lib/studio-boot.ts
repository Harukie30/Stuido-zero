/**
 * In-memory only (resets on hard refresh).
 * Soft navigations back to `/` set this so the studio boot does not replay.
 */
let skipNextStudioBoot = false;

export function skipStudioBootOnce() {
  skipNextStudioBoot = true;
}

export function consumeSkipStudioBoot() {
  if (!skipNextStudioBoot) return false;
  skipNextStudioBoot = false;
  return true;
}
