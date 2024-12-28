import type { RowDataPacket } from "mysql2";
import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
import type { Order } from "~/lib/types/order";
import { UserRole } from "~/lib/enums/roles";

/**
 * Kullanıcıya ait tüm siparişleri çeker.
 * @returns {Promise<Order[]>} Kullanıcının siparişlerinin listesi.
 */
export async function fetchAllOrders(): Promise<Order[]> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized access.");
  }

  const db = await getConnection();

  try {
    const [orders] = await db.query<(Order & RowDataPacket)[]>(
      `
      SELECT 
        o.order_id,
        o.status,
        o.total_price,
        o.created_at,
        r.name AS restaurant_name,
        a.address_line,
        a.city
      FROM Orders o
      INNER JOIN Restaurants r ON o.restaurant_id = r.restaurant_id
      INNER JOIN Addresses a ON o.address_id = a.address_id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
      `,
      [session.user.id]
    );

    return orders as Order[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders.");
  }
}



/**
 * Belirtilen restoranın siparişlerini getirir.
 * Sadece restoran sahibi tarafından kullanılabilir.
 * @param {number} restaurantId - Restoran ID'si.
 * @returns {Promise<Order[]>} Restoranın siparişlerinin listesi.
 */
export async function fetchOrdersByRestaurantId(restaurantId: number): Promise<Order[]> {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Unauthorized access.");
  }

  const db = await getConnection();

  try {
    const [orders] = await db.query<(Order & RowDataPacket)[]>(
      `
      SELECT 
        o.order_id,
        o.status,
        o.total_price,
        o.created_at,
        a.address_line,
        a.city
      FROM Orders o
      INNER JOIN Addresses a ON o.address_id = a.address_id
      WHERE o.restaurant_id = ?
      ORDER BY o.created_at DESC
      `,
      [restaurantId]
    );

    return orders as Order[];
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    throw new Error("Failed to fetch restaurant orders.");
  }
}



/**
 * Sipariş durumunu günceller.
 * @param {number} orderId - Sipariş ID'si.
 * @param {string} status - Yeni durum ('Pending', 'Preparing', 'On the Way', 'Delivered').
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  const session = await getSession();

  if (!session?.user || session.user.role !== UserRole.OWNER) {
    throw new Error("Unauthorized access.");
  }

  const db = await getConnection();

  try {
    await db.query(
      "UPDATE Orders SET status = ? WHERE order_id = ?",
      [status, orderId]
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status.");
  }
}
