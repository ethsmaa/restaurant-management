import { fetchAllRestaurants } from "~/services/restaurants";
import RestaurantGrid from "~/components/RestaurantGrid"; // client component

export default async function CustomerDashboard() {
  const initialRestaurants = await fetchAllRestaurants(); // ilk veri

  return (
    <div>
      <RestaurantGrid initialRestaurants={initialRestaurants} />
    </div>
  );
}
