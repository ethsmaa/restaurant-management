import { addAddress, fetchAddresses } from "~/services/addresses";
import { NextResponse } from "next/server";
import { getSession } from "~/lib/session";
import { getConnection } from "~/lib/database";


// Adres listeleme (GET)
export async function GET() {
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const addresses = await fetchAddresses(); 
    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error("Adresler alınırken hata oluştu:", error);
    return NextResponse.json({ error: "Adresler alınamadı." }, { status: 500 });
  }
}

// Yeni adres ekleme (POST)
export async function POST(request: Request) {
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const addressTitle = formData.get("addressTitle") as string;
  const addressLine = formData.get("addressLine") as string;
  const city = formData.get("city") as string;

  if (!addressTitle || !addressLine || !city) {
    return NextResponse.json(
      { error: "Tüm alanları doldurmanız gerekiyor." },
      { status: 400 }
    );
  }

  try {
    await addAddress(session.user.id, addressTitle, addressLine, city);
    return NextResponse.redirect(
      new URL("/dashboard/customer/account/addresses", request.url)
    );
  } catch (error) {
    console.error("Adres ekleme sırasında hata oluştu:", error);
    return NextResponse.json({ error: "Adres eklenemedi." }, { status: 500 });
  }
}


// Varsayılan adresi güncelleme (PATCH)
export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { addressId } = await request.json();

  if (!addressId) {
    return NextResponse.json(
      { error: "Adres ID'si gerekli." },
      { status: 400 }
    );
  }
 
  const db = await getConnection();

  try {
    // all other addresses are not default
    await db.query(
      "UPDATE Addresses SET is_default = false WHERE user_id = ?",
      [session.user.id]
    );

    // only the selected address is default
    await db.query(
      "UPDATE Addresses SET is_default = true WHERE address_id = ? AND user_id = ?",
      [addressId, session.user.id]
    );

    return NextResponse.json({ message: "Varsayılan adres güncellendi." }, { status: 200 });
  } catch (error) {
    console.error("Varsayılan adres güncellenirken hata oluştu:", error);
    return NextResponse.json(
      { error: "Varsayılan adres güncellenemedi." },
      { status: 500 }
    );
  }
}
