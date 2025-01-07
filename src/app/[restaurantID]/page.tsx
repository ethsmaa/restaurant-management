import { fetchRestaurantById } from "~/services/restaurants";
import { fetchMenuItems } from "~/services/menuItems";
import { type Restaurant } from "~/lib/types/restaurant";
import { type MenuItem } from "~/lib/types/menuItem";
import { notFound } from "next/navigation";
import MenuItemCard from "~/components/MenuItemCard";
import Link from "next/link";
import { Button } from "~/components/ui/button";

interface RestaurantPageProps {
  params: { restaurantID: string };
}

export default async function CustomerRestaurantPage({ params }: RestaurantPageProps) {
  const restaurantID = Number(params.restaurantID);

  if (isNaN(restaurantID)) {
    throw new Error("Geçersiz restoran ID'si");
  }

  const restaurant: Restaurant | null = await fetchRestaurantById(restaurantID);

  if (!restaurant) {
    notFound();
  }

  const menuItems: MenuItem[] = await fetchMenuItems(restaurantID);

  return (
    <div className="flex flex-col items-start bg-gray-50 min-h-screen p-14">
      {/* Restoran Bilgileri */}
      <header className="w-full bg-white  rounded-lg shadow  text-black border py-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center space-x-2">
            <p className="text-lg font-thin mb-1">{restaurant.address}</p>
            <span>|</span>
            <p className="text-lg font-thin mb-1">+(90) {restaurant.phone}</p>
          </div>
        </div>
      </header>

      {/* Menü Başlığı */}
      <div className="max-w-4xl w-full mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Menü</h2>

        {/* Menü Öğeleri */}
        {menuItems.length === 0 ? (
          <p className="text-gray-600">Bu restoran için henüz menü öğesi eklenmemiş.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard key={item.item_id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Sepet Butonu */}
      <div className="fixed bottom-6 right-6">
        <Link href="/basket">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full px-6 py-3"
          >
            Sepetim
          </Button>
        </Link>
      </div>
    </div>
  );
}
