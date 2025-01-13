import Link from "next/link";
import { notFound } from "next/navigation";



import { type Restaurant } from "~/lib/types/restaurant";
import { type MenuItem } from "~/lib/types/menuItem";


import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { fetchRestaurantById } from "~/services/restaurants";
import { fetchMenuItems } from "~/services/menuItems";
import { calculateRestaurantRevenue } from "~/services/restaurants";

// When async, use params like this!
interface RestaurantDetailsProps {
  params: { id: string };
}

export default async function RestaurantDetails({
  params,
}: RestaurantDetailsProps) {
  const restaurantId = Number(params?.id);

  if (isNaN(restaurantId)) {
    throw new Error("Invalid restaurant ID");
  }

  const restaurant: Restaurant | null = await fetchRestaurantById(restaurantId);
  if (!restaurant) {
    notFound();
  }

  const revenue: number = await calculateRestaurantRevenue(restaurantId);

  // Fetch menu items for the restaurant
  const menuItems: MenuItem[] = await fetchMenuItems(restaurantId);

  return (
    <div className="p-14">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {restaurant.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>     
            <p className="text-gray-600">Address: {restaurant.address}</p>
            <p className="text-gray-600">Phone: {restaurant.phone}</p>
          </div>


          <h3 className="mt-4 text-base font-semibold">Total Revenue : {revenue} TL</h3>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold">Menu</h2>

      {menuItems.length === 0 ? (
        <p className="text-gray-600">
          No menu items have been added for this restaurant yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Card
              key={item.item_id}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{item.price} TL</p>
                <Link href={`${item.restaurant_id}/menuItems/${item.item_id}`}>
                  <Button className="mt-4 w-full" variant="default">
                    Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4 border-b p-4">
        <Link href={`/dashboard/owner/${restaurant.restaurant_id}/addItem`}>
          <Button variant="default" className="px-4 py-2 text-sm">
            Add a New Item to Your Menu
          </Button>
        </Link>

        <Link href={`/dashboard/owner/${restaurant.restaurant_id}/orders`}>
          <Button variant="default" className="px-4 py-2 text-sm">
            View Orders
          </Button>
        </Link>

        <Link href={`/dashboard/owner/${restaurant.restaurant_id}/edit`}>
          <Button variant="default" className="px-4 py-2 text-sm">
            Edit Restaurant Information
          </Button>
        </Link>
      </div>
    </div>
  );
}
