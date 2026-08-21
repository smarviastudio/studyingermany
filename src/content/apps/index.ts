import type { AppContent } from './types';
import { APP_PAGE_PREFIXES } from './slugs';
import { lesenlab } from './lesenlab';
import { einbuergerungstest } from './einbuergerungstest';
import { dosebuddy } from './dosebuddy';
import { macromora } from './macromora';
import { babyname } from './babyname';
import { abctracing } from './abctracing';
import { cvmaker } from './cvmaker';
import { football } from './football';
import { kennzeichen } from './kennzeichen';
import { schreibcoach } from './schreibcoach';
import { amtsbrief } from './amtsbrief';
import { vorfahrt } from './vorfahrt';
import { hundefuehrerschein } from './hundefuehrerschein';
import { muenzcheck } from './muenzcheck';
import { parkspot } from './parkspot';
import { hush } from './hush';
import { portionpal } from './portionpal';
import { littlegenius } from './littlegenius';
import { airfryer } from './airfryer';
import { couplegoals } from './couplegoals';

export const ALL_APPS: AppContent[] = [
  lesenlab,
  einbuergerungstest,
  schreibcoach,
  amtsbrief,
  vorfahrt,
  hundefuehrerschein,
  muenzcheck,
  dosebuddy,
  macromora,
  portionpal,
  airfryer,
  babyname,
  couplegoals,
  abctracing,
  littlegenius,
  cvmaker,
  parkspot,
  hush,
  football,
  kennzeichen,
];

// Keep slugs.ts (used client-side to suppress site chrome) in sync with the registry.
for (const app of ALL_APPS) {
  if (!APP_PAGE_PREFIXES.includes(`/${app.slug}` as (typeof APP_PAGE_PREFIXES)[number])) {
    throw new Error(`App slug "/${app.slug}" is missing from src/content/apps/slugs.ts APP_PAGE_PREFIXES`);
  }
}

export function getAppBySlug(slug: string): AppContent | undefined {
  return ALL_APPS.find((app) => app.slug === slug);
}

export {
  lesenlab,
  einbuergerungstest,
  dosebuddy,
  macromora,
  babyname,
  abctracing,
  cvmaker,
  football,
  kennzeichen,
  schreibcoach,
  amtsbrief,
  vorfahrt,
  hundefuehrerschein,
  muenzcheck,
  parkspot,
  hush,
  portionpal,
  littlegenius,
  airfryer,
  couplegoals,
};
