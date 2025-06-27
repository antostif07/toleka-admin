import { getAnalyticsData } from "@/lib/firebase/api";
import AnalyticsClientPage from "./analytics.client.page";

// interface PageProps {
//   searchParams: Promise<{
//     period?: 'day' | 'week' | 'month';
//   }>;
// }

export default async function AnalyticsPage(
  // { searchParams }: PageProps
) {
  // const { period } = await searchParams;
  // const p = period || 'week'; // Période par défaut : 7 jours

  // On récupère toutes les données nécessaires en un seul appel
  const analyticsData = await getAnalyticsData();

  return (
    <AnalyticsClientPage initialData={analyticsData} />
  );
}