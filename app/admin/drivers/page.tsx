import { getDrivers } from "@/lib/firebase/api";
import DriversClientPage from "./drivers.client.page";

// Interface pour les searchParams de la page
// interface PageProps {
//   searchParams: {
//     search?: string;
//     status?: string;
//   };
// }

export default async function DriversPage(
  // { searchParams }: PageProps
) {
  // const { search, status } = await searchParams;
  const drivers = await getDrivers({
    // search: search,
    // status: status,
  });

  console.log(drivers, "drivers found in page.tsx");
  
  
  // Passer les données récupérées au composant client
  return <DriversClientPage initialDrivers={drivers} />;
}