import { getSession } from "~/lib/session";
import { getConnection } from "~/lib/database";
import { NextResponse } from "next/server";

// sepetteki ürünleri siparişe dönüştürme
export async function POST() {
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getConnection();

  try {
    // Kullanıcının sepetini session'dan al
    const cart = session.cart || [];
    if (cart.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Sepetteki item'lerin restoranını al
    const [restaurantResults] = await db.query(
      `
      SELECT DISTINCT restaurant_id
      FROM Items
      WHERE item_id IN (${cart.map((item) => item.item_id).join(",")})
      `
    );

    if (restaurantResults.length !== 1) {
      return NextResponse.json(
        { error: "Items must belong to a single restaurant." },
        { status: 400 }
      );
    }

    const restaurantId = restaurantResults[0].restaurant_id;

    // Varsayılan adresi çek
    const [defaultAddressResults] = await db.query(
      `
      SELECT address_id, address_title, address_line, city
      FROM Addresses
      WHERE user_id = ? AND is_default = true LIMIT 1
      `,
      [session.user.id]
    );

    if (defaultAddressResults.length === 0) {
      return NextResponse.json(
        { error: "No default address found. Please select an address." },
        { status: 400 }
      );
    }

    const defaultAddress = defaultAddressResults[0];

    // Toplam fiyatı hesapla
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Siparişi oluştur
    const [orderResult] = await db.query(
      `
      INSERT INTO Orders (user_id, restaurant_id, address_id, status, total_price)
      VALUES (?, ?, ?, 'Pending', ?)
      `,
      [session.user.id, restaurantId, defaultAddress.address_id, totalPrice]
    );

    const orderId = orderResult.insertId;

    // Sipariş öğelerini ekle
    const orderItemsQueries = cart.map((item) =>
      db.query(
        `
        INSERT INTO Order_Items (order_id, item_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.item_id, item.quantity, item.price]
      )
    );

    await Promise.all(orderItemsQueries);

    // Sepeti temizle
    session.cart = [];
    await session.save();

    return NextResponse.json(
      { message: "Order placed successfully!", orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Failed to place order." }, { status: 500 });
  }
}
