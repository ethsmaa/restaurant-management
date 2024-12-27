// Item islemleri

import type { RowDataPacket } from "mysql2";
import { getConnection } from "~/lib/database";
import type { MenuItem } from "~/lib/types/menuItem";

/**
 * Belirtilen restoran için menü öğelerini alır.
 * @param {number} restaurantId - Restoran ID'si.
 * @returns {Promise<MenuItem[]>} Menü öğeleri listesi.
 */
export async function fetchMenuItems(restaurantId: number): Promise<MenuItem[]> {
    const db = await getConnection();
  
    try {
      const [results] = await db.query<(MenuItem & RowDataPacket)[]>(
        "SELECT item_id, name, description, price, category, image_url FROM Items WHERE restaurant_id = ?",
        [restaurantId],
      );
  
      return results as MenuItem[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Menü öğeleri alınırken hata oluştu:", error.message);
      } else {
        console.error("Bilinmeyen bir hata oluştu:", error);
      }
      return [];
    }
  }
  

export async function addMenuItem(
  restaurantId: number,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl: string,
): Promise<void> {
  const db = await getConnection();

  try {
    await db.query(
      "INSERT INTO Items (restaurant_id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [restaurantId, name, description, price, category, imageUrl],
    );
  } catch (error) {
    console.error("Menü öğesi ekleme hatası:", error);
    throw new Error("Menü öğesi eklenemedi");
  }
}
