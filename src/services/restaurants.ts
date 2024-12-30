import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
import type { RowDataPacket } from "mysql2";

import type { Restaurant } from "~/lib/types/restaurant";
import { UserRole } from "~/lib/enums/roles";

/**
 * Veritabanından restoranları çeker.
 * Sadece restoran sahipleri bu fonksiyonu kullanabilir.
 * @returns {Promise<Restaurant[]>} Restoranların listesi.
 */
export async function fetchRestaurants(): Promise<Restaurant[]> {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Yetkisiz erişim");
  }

  const db = await getConnection();
  const [restaurants] = await db.query<(Restaurant & RowDataPacket)[]>(
    "SELECT restaurant_id, name, address, phone FROM Restaurants WHERE owner_id = ?",
    [session.user.id],
  );

  return restaurants as Restaurant[];
}

/**
 * Yeni bir restoran ekler.
 * Sadece restoran sahipleri bu fonksiyonu kullanabilir.
 * @param {string} name - Restoran adı.
 * @param {string} address - Restoran adresi.
 * @param {string} phone - Restoran telefon numarası.
 */
export async function addRestaurant(
  name: string,
  address: string,
  phone: string,
): Promise<void> {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Yetkisiz erişim");
  }

  const db = await getConnection();

  try {
    await db.query(
      "INSERT INTO Restaurants (owner_id, name, address, phone) VALUES (?, ?, ?, ?)",
      [session.user.id, name, address, phone],
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Restoran ekleme hatası:", error.message);
    } else {
      console.error("Bilinmeyen bir hata oluştu:", error);
    }
    throw new Error("Restoran eklenirken bir hata oluştu.");
  }
}

/**
 * Belirtilen ID ile restoran bilgilerini alır.
 * @param {number} restaurantId - Restoran ID'si.
 * @returns {Promise<Restaurant | null>} Restoran bilgileri veya null.
 */
export async function fetchRestaurantById(restaurantId: number): Promise<Restaurant | null> {
  const db = await getConnection();

  try {
    const [results] = await db.query<(Restaurant & RowDataPacket)[]>(
      "SELECT restaurant_id, name, address, phone FROM Restaurants WHERE restaurant_id = ?",
      [restaurantId],
    );

    return results.length > 0 ? (results[0] as Restaurant) : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Restoran bilgisi alınırken hata oluştu:", error.message);
    } else {
      console.error("Bilinmeyen bir hata oluştu:", error);
    }
    return null;
  }
}


export async function fetchAllRestaurants(): Promise<Restaurant[]> {
  const db = await getConnection();
  const [restaurants] = await db.query<(Restaurant & RowDataPacket)[]>(
    "SELECT restaurant_id, name, address, phone FROM Restaurants",
  );

  return restaurants as Restaurant[];
}


/**
 * Restoran bilgilerini günceller.
 * @param {number} restaurantId - Güncellenecek restoranın ID'si.
 * @param {string} name - Yeni restoran adı.
 * @param {string} address - Yeni adres.
 * @param {string} phone - Yeni telefon numarası.
 */
export async function updateRestaurant(
  restaurantId: number,
  name: string,
  address: string,
  phone: string,
): Promise<void> {
  const db = await getConnection();

  try {
    await db.query(
      "UPDATE Restaurants SET name = ?, address = ?, phone = ? WHERE restaurant_id = ?",
      [name, address, phone, restaurantId],
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Restoran güncelleme hatası:", error.message);
    } else {
      console.error("Bilinmeyen bir hata oluştu:", error);
    }
    throw new Error("Restoran güncellenirken bir hata oluştu.");
  }
}


