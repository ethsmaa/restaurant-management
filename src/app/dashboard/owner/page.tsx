import Link from "next/link";
import { fetchRestaurants } from "~/services/restaurants";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Logout } from "~/components/Logout";

export default async function OwnerDashboard() {
  try {
    const restaurants = await fetchRestaurants();

    return (
      <div className="p-14">
        <h1 className="mb-8 text-2xl font-bold">Restaurant Management</h1>

        {restaurants.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">
              You don&apos;t have any restaurants yet. Click the button below to add a new restaurant.
            </p>
            <Link href="/dashboard/owner/add">
              <Button className="mt-6" variant="default">
                Add New Restaurant
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.restaurant_id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {restaurant.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  <Link href={`/dashboard/owner/${restaurant.restaurant_id}`}>
                    <Button className="mt-4 w-full" variant="default">
                      Manage
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          {restaurants.length !== 0 && (
            <Link href="/dashboard/owner/add">
              <Button className="w-full sm:w-auto" variant="default">
                Add New Restaurant
              </Button>
            </Link>
          )}
        </div>

        <div className="mt-4">
          <Logout />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <p className="text-center text-red-600">
        Unauthorized access. Please log in.
      </p>
    );
  }
}
