import { Header } from "@/components/layout/header";
import { VentsView } from "@/components/vents/vents-view";
import { getRecentVents } from "@/lib/vents";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const recentVents = getRecentVents(50);

  // Serialize dates for client component
  const initialVents = recentVents.map((v) => ({
    id: v.id,
    content: v.content,
    latitude: v.latitude,
    longitude: v.longitude,
    createdAt: v.createdAt.toISOString(),
    expiresAt: v.expiresAt.toISOString(),
  }));

  return (
    <>
      <Header />
      <VentsView initialVents={initialVents} />
    </>
  );
}
