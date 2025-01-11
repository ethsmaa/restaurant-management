import { fetchRestaurantById } from "~/services/restaurants";
import { fetchMenuItems } from "~/services/menuItems";
import { type Restaurant } from "~/lib/types/restaurant";
import { type MenuItem } from "~/lib/types/menuItem";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

// async oldugunda paramsi boyle al!!!
interface RestaurantDetailsProps {
  params: { id: string };
}

export default async function RestaurantDetails({
  params,
}: RestaurantDetailsProps) {
  const restaurantId = Number(params?.id);

  if (isNaN(restaurantId)) {
    throw new Error("Geçersiz restoran ID'si");
  }

  const restaurant: Restaurant | null = await fetchRestaurantById(restaurantId);
  if (!restaurant) {
    notFound();
  }

  // restoranin menu ogelerini cek
  const menuItems: MenuItem[] = await fetchMenuItems(restaurantId);

  return (
    <div className="p-14">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {restaurant.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Adres: {restaurant.address}</p>
          <p className="text-gray-600">Telefon: {restaurant.phone}</p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold">Menü</h2>

      {menuItems.length === 0 ? (
        <p className="text-gray-600">
          Bu restoran için henüz menü öğesi eklenmemiş.
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
                    Detaylar
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
            Menüne Yeni Bir Yemek Ekle
          </Button>
        </Link>

        <Link href={`/dashboard/owner/${restaurant.restaurant_id}/orders`}>
          <Button variant="default" className="px-4 py-2 text-sm">
            Siparişleri Görüntüle
          </Button>
        </Link>

        <Link href={`/dashboard/owner/${restaurant.restaurant_id}/edit`}>
          <Button variant="default" className="px-4 py-2 text-sm">
            Restoran Bilgilerini Düzenle
          </Button>
        </Link>
      </div>
    </div>
  );
}
