import HubPage, { hubMetadata } from '@/components/HubPage';
import { FLOOR_BOXES } from '@/lib/hubs';

export async function generateMetadata() {
  return hubMetadata(FLOOR_BOXES);
}

export default function Page() {
  return <HubPage cfg={FLOOR_BOXES} />;
}
