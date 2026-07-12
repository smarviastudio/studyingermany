/**
 * Route prefixes of the standalone app marketing pages (no site nav, footer or chatbot).
 *
 * Single source of truth for client-side chrome suppression — kept as a tiny
 * standalone module so client components can import it without pulling the
 * full app content (icons, guides) into the bundle.
 *
 * `src/content/apps/index.ts` asserts at module load that this list matches
 * the registered apps, so a new app page can't silently keep the site chrome.
 */
export const APP_PAGE_PREFIXES = [
  '/apps',
  '/lesenlab-german-reading-app',
  '/einbuergerungstest-2026-app',
  '/dosebuddy-pill-reminder-app',
  '/macromora-ai-calorie-tracker',
  '/baby-name-matcher-app',
  '/abc-letter-tracing-app',
  '/cv-maker-resume-builder-app',
  '/world-cup-2026-schedule-app',
  '/kennzeichen-scanner-app',
] as const;

export function isAppPage(pathname: string): boolean {
  return APP_PAGE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}
