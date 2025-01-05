// Item islemleri

import type { RowDataPacket } from "mysql2";
import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
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
        "SELECT item_id, restaurant_id, name, description, price, category, image_url FROM Items WHERE restaurant_id = ?",
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


/**
 * Menü öğesini günceller.
 * @param itemId - Menü öğesi ID'si
 * @param updatedData - Güncellenmek istenen menü öğesi bilgileri
 * @returns {Promise<void>}
 */
export async function updateMenuItem(itemId: number, updatedData: Partial<MenuItem>): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const { name, description, price } = updatedData;

  if (!name || !description || !price) {
    throw new Error("Name, description, and price are required");
  }

  const db = await getConnection();
  await db.query(
    "UPDATE Items SET name = ?, description = ?, price = ? WHERE item_id = ?",
    [name, description, price, itemId]
  );
}

/**
 * Menü öğesini siler.
 * @param itemId - Menü öğesi ID'si
 * @returns {Promise<void>}
 */
export async function deleteMenuItem(itemId: number): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const db = await getConnection();
  await db.query("DELETE FROM Items WHERE item_id = ?", [itemId]);
}

/** fetch spesific menu item */
export async function fetchMenuItem(itemId: number): Promise<MenuItem | null> {
  const db = await getConnection();

  try {
    const [results] = await db.query<(MenuItem & RowDataPacket)[]>(
      "SELECT item_id, restaurant_id, name, description, price, category, image_url FROM Items WHERE item_id = ?",
      [itemId],
    );

    return results[0] ?? null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Menü öğesi alınırken hata oluştu:", error.message);
    } else {
      console.error("Bilinmeyen bir hata oluştu:", error);
    }
    return null;
  }
}