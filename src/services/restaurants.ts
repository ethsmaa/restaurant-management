import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
import type { RowDataPacket } from "mysql2";

import type { Restaurant } from "~/lib/types/restaurant";
import { UserRole } from "~/lib/enums/roles";
import { MenuItem } from "~/lib/types/menuItem";
/*
 * Restoranları veritabanından çeker.
 * Sadece restoran sahipleri bu fonksiyonu kullanabilir.
 */

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const session = await getSession();

  if (!session.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Yetkisiz erişim");
  }

  // Restoranları veritabanından çek
  const db = await getConnection();
  const [restaurants] = await db.query<(Restaurant & RowDataPacket)[]>(
    "SELECT restaurant_id, name, address, phone FROM Restaurants WHERE owner_id = ?",
    [session.user.id],
  );

  return restaurants;
}

/*
  * Yeni bir restoran ekler.
  * Sadece restoran sahipleri bu fonksiyonu kullanabilir.
  */
export async function addRestaurant(
  name: string,
  address: string,
  phone: string,
): Promise<void> {
  const session = await getSession();

  if (!session.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Yetkisiz erişim");
  }

  // Veritabanı bağlantısını al
  const db = await getConnection();

  try {
    // Restoranı veritabanına ekle
    await db.query(
      "INSERT INTO Restaurants (owner_id, name, address, phone) VALUES (?, ?, ?, ?)",
      [session.user.id, name, address, phone],
    );
  } catch (error) {
    console.error("Restoran ekleme hatası:", error);
    throw new Error("Restoran eklenirken bir hata oluştu.");
  }
}


export async function fetchRestaurantById(restaurantId: number): Promise<Restaurant | null> {
  const db = await getConnection();

  try {
    const [results] = await db.query<(Restaurant & RowDataPacket)[]>(
      "SELECT restaurant_id, name, address, phone FROM Restaurants WHERE restaurant_id = ?",
      [restaurantId],
    );

    return results.length > 0 ? (results[0] ?? null) : null;
  } catch (error) {
    console.error("Restoran bilgisi alınırken hata oluştu:", error);
    return null;
  }
}


export async function fetchMenuItems(restaurantId: number): Promise<MenuItem[]> {
  const db = await getConnection();

  try {
    const [results] = await db.query<(MenuItem & RowDataPacket)[]>(
      "SELECT item_id, name, description, price, category, image_url FROM Items WHERE restaurant_id = ?",
      [restaurantId],
    );

    return results;
  } catch (error) {
    console.error("Menü öğeleri alınırken hata oluştu:", error);
    return [];
  }
}

