import HubPage, { hubMetadata } from '@/components/HubPage';
import { ISOLATORS } from '@/lib/hubs';

export async function generateMetadata() {
  return hubMetadata(ISOLATORS);
}

export default function Page() {
  return <HubPage cfg={ISOLATORS} />;
}
