import { fetchAllRestaurants } from "~/services/restaurants";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

export default async function CustomerDashboard() {
  const restaurants = await fetchAllRestaurants();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-14">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.restaurant_id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {restaurant.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{restaurant.address}</p>
            <a href={`/${restaurant.restaurant_id}`}>
              <Button className="mt-4 w-full" variant="default">
                Detayları Gör
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
