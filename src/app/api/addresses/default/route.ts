import { getSession } from "~/lib/session";
import { getConnection } from "~/lib/database";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { addressId } = await request.json();

  if (!addressId) {
    return NextResponse.json({ error: "Address ID is required." }, { status: 400 });
  }

  const db = await getConnection();

  try {
    // Tüm adreslerin `is_default` alanını false yap
    await db.query("UPDATE Addresses SET is_default = false WHERE user_id = ?", [
      session.user.id,
    ]);

    // Seçilen adresi varsayılan yap
    await db.query(
      "UPDATE Addresses SET is_default = true WHERE address_id = ? AND user_id = ?",
      [addressId, session.user.id]
    );

    return NextResponse.json({ message: "Default address updated." }, { status: 200 });
  } catch (error) {
    console.error("Error updating default address:", error);
    return NextResponse.json({ error: "Failed to update default address." }, { status: 500 });
  }
}

export async function GET() {
    const session = await getSession();
  
    if (!session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const db = await getConnection();
  
    try {
      const [results] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Addresses WHERE user_id = ? AND is_default = true LIMIT 1",
        [session.user.id]
      );
  
      if (results.length === 0) {
        return NextResponse.json({ error: "No default address found." }, { status: 404 });
      }
  
      return NextResponse.json(results[0], { status: 200 });
    } catch (error) {
      console.error("Error fetching default address:", error);
      return NextResponse.json({ error: "Failed to fetch default address." }, { status: 500 });
    }
  }
