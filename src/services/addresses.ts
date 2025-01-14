import { getConnection } from "~/lib/database";
import { getSession } from "~/lib/session";
import type { RowDataPacket } from "mysql2";

interface Address {
  address_id: number;
  address_title: string;
  address_line: string;
  city: string;
}

/**
 * Kullanıcının adreslerini getirir
 */
export async function fetchAddresses(): Promise<Address[]> {
  const session = await getSession();
  const userId = session.user?.id;
  
  const db = await getConnection();
  const [addresses] = await db.query<(Address & RowDataPacket)[]>(
    "SELECT address_id, address_title, address_line, city FROM Addresses WHERE user_id = ?",
    [userId]
  );
  return addresses as Address[];
}

/**
 * Yeni bir adres ekler 
 */
export async function addAddress(
  userId: number,
  addressTitle: string,
  addressLine: string,
  city: string
): Promise<void> {
  const db = await getConnection();

  try {
    await db.query(
      "INSERT INTO Addresses (user_id, address_title, address_line, city) VALUES (?, ?, ?, ?)",
      [userId, addressTitle, addressLine, city]
    );
  } catch (error) {
    console.error("Adres ekleme hatası:", error);
    throw new Error("Adres eklenirken bir hata oluştu.");
  }
}
