import { getUsersPageData } from "@/lib/firebase/api";
import ClientsClientPage from "./clients.client.page";

// interface PageProps {
//   searchParams: {
//     search?: string;
//   };
// }

export default async function ClientsPage() {
  
  const { stats, users } = await getUsersPageData({
    // search: searchParams.search,
  });

  return <ClientsClientPage initialStats={stats} initialUsers={users} />;
}