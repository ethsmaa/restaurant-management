import { NextResponse } from "next/server";
import { getConnection } from "~/lib/database";
import type { Order } from "~/lib/types/order";
type Status = Pick<Order, "status">;

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const orderId = Number(params.orderId);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Geçersiz sipariş ID'si" }, { status: 400 });
    }

    const { status } = await request.json() as Status;

    if (!status) {
      return NextResponse.json({ error: "Durum bilgisi gereklidir" }, { status: 400 });
    }

    const db = await getConnection();
    await db.query("UPDATE Orders SET status = ? WHERE order_id = ?", [status, orderId]);

    return NextResponse.json({ message: "Sipariş durumu güncellendi" }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Sipariş durumu güncellenirken hata oluştu" },
      { status: 500 },
    );
  }
}