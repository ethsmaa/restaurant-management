import { getConnection } from "~/lib/database";
import { getSession} from "~/lib/session";
import { type User } from "~/lib/types/user";
import { type RowDataPacket } from "mysql2";

import { UserRole } from "~/lib/enums/roles";

export async function POST(request: Request) {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const db = await getConnection();

  // Kullanıcıyı veritabanına ekle
  await db.query(
    "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );

  // Session başlat ve cookie'den oku
  const session = await getSession();

  // Eklenen kullanıcıyı çek
  const [rows] = await db.query<(User & RowDataPacket)[]>(
    "SELECT * FROM Users WHERE name = ?",
    [name]
  );

  if (rows.length > 0) {
    const dbUser = rows[0]!;

    session.user = {
      id: dbUser.user_id,
      name: dbUser.name,
      role: dbUser.role,
    };

    await session.save();

    // Rolüne göre yönlendir
    let redirectURL = "/";
      if (dbUser.role === UserRole.CUSTOMER) {
        redirectURL = "/dashboard/customer";
      } else if (dbUser.role === UserRole.OWNER) {
        redirectURL = "/dashboard/owner";
      } else if (dbUser.role === UserRole.ADMIN) {
        redirectURL = "/sadece-admin";
      }
      

    return Response.redirect(new URL(redirectURL, request.url), 303);
  }

  return Response.redirect(new URL("/register", request.url), 303);
}
