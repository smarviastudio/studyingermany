import type { AppContent } from './types';
import { lesenlab } from './lesenlab';
import { einbuergerungstest } from './einbuergerungstest';
import { dosebuddy } from './dosebuddy';
import { macromora } from './macromora';
import { babyname } from './babyname';
import { abctracing } from './abctracing';
import { cvmaker } from './cvmaker';
import { football } from './football';
import { kennzeichen } from './kennzeichen';

export const ALL_APPS: AppContent[] = [
  lesenlab,
  einbuergerungstest,
  dosebuddy,
  macromora,
  babyname,
  abctracing,
  cvmaker,
  football,
  kennzeichen,
];

export function getAppBySlug(slug: string): AppContent | undefined {
  return ALL_APPS.find((app) => app.slug === slug);
}

export { lesenlab, einbuergerungstest, dosebuddy, macromora, babyname, abctracing, cvmaker, football, kennzeichen };
