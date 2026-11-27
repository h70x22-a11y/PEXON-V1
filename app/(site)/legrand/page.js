import HubPage, { hubMetadata } from '@/components/HubPage';
import { LEGRAND } from '@/lib/hubs';

export async function generateMetadata() {
  return hubMetadata(LEGRAND);
}

export default function Page() {
  return <HubPage cfg={LEGRAND} />;
}
