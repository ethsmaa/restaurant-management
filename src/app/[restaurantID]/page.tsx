import { fetchRestaurantById } from "~/services/restaurants";
import { fetchMenuItems } from "~/services/menuItems";
import { type Restaurant } from "~/lib/types/restaurant";
import { type MenuItem } from "~/lib/types/menuItem";
import { notFound } from "next/navigation";
import AddToCartButton from "~/components/basket/AddToBasketButton";
import Link from "next/link";

interface RestaurantPageProps {
  params: { restaurantID: string }; // Dinamik parametre tipi
}

export default async function CustomerRestaurantPage({ params }: RestaurantPageProps) {
  const restaurantID = Number(params.restaurantID);

  // ID'nin geçerli olup olmadığını kontrol et
  if (isNaN(restaurantID)) {
    throw new Error("Geçersiz restoran ID'si");
  }

  // Restoran bilgilerini al
  const restaurant: Restaurant | null = await fetchRestaurantById(restaurantID);

  // Restoran bulunamazsa 404 sayfasına yönlendir
  if (!restaurant) {
    notFound();
  }

  // Restoranın menü öğelerini al
  const menuItems: MenuItem[] = await fetchMenuItems(restaurantID);

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>Adres: {restaurant.address}</p>
      <p>Telefon: {restaurant.phone}</p>

      <h2>Menü</h2>
      <br />
      {menuItems.length === 0 ? (
        <p>Bu restoran için henüz menü öğesi eklenmemiş.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (
            <li key={item.item_id}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{item.price} TL</p>
              <AddToCartButton item={item} />
              <br />
              <br />
            </li>
          ))}
        </ul>
      )}

      <Link href="/basket">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sepet
        </button>
      </Link>
    </div>
  );
}
