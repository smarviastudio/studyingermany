import { AppLandingPage } from '@/components/apps/AppLandingPage';
import { buildAppMetadata } from '@/lib/appPages';
import { portionpal as app } from '@/content/apps';

export const metadata = buildAppMetadata(app);

export default function Page() {
  return <AppLandingPage app={app} />;
}
