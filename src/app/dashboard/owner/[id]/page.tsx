import { fetchRestaurantById } from "~/services/restaurants";
import { fetchMenuItems } from "~/services/menuItems";
import { type Restaurant } from "~/lib/types/restaurant";
import { type MenuItem } from "~/lib/types/menuItem";
import { notFound } from "next/navigation";
import Link from "next/link";

// async oldugunda paramsi boyle al!!!
interface RestaurantDetailsProps {
  params: { id: string };
}

export default async function RestaurantDetails({ params }: RestaurantDetailsProps) {
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
    <div>
      <h1>{restaurant.name}</h1>
      <p>Adres: {restaurant.address}</p>
      <p>Telefon: {restaurant.phone}</p>

      <h2>Menü</h2>
      {menuItems.length === 0 ? (
        <p>Bu restoran için henüz menü öğesi eklenmemiş.</p>
      ) : (
        <ul>
          {menuItems.map((item) => (

            <li key={item.item_id}>
              {item.name} - {item.price} TL
              <Link href={`${item.restaurant_id}/menuItems/${item.item_id}`}>
                <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                  Detaylar
  
                </button>
              </Link >
            </li>





          ))}
        </ul>
      )
      }
      <a href={`/dashboard/owner/${restaurant.restaurant_id}/addItem`}>
        <button>Menune yeni bir yemek ekle!</button>
      </a>
      <br />
      <a href={`/dashboard/owner/${restaurant.restaurant_id}/orders`}>
        <button>Siparişleri görüntüle</button>
      </a>


      <br />
      <br />

      <a href={`/dashboard/owner/${restaurant.restaurant_id}/edit`}>
        <button>Restoran Bilgilerini Düzenle</button>
      </a>
    </div >
  );
}
