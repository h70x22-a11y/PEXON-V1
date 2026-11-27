import HubPage, { hubMetadata } from '@/components/HubPage';
import { CONDUITS } from '@/lib/hubs';

export async function generateMetadata() {
  return hubMetadata(CONDUITS);
}

export default function Page() {
  return <HubPage cfg={CONDUITS} />;
}
