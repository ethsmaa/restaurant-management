import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { getConnection } from "~/lib/database";
import  { type Session, sessionOptions } from "~/lib/session";
import type { RowDataPacket } from "mysql2";

import { UserRole } from "~/lib/enums/roles";
import type { User } from "~/lib/types/user";


export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const db = await getConnection();

  // Kullanıcı bilgilerini veritabanından çek
  const [rows] = await db.query<(User & RowDataPacket)[]>(
    "SELECT * FROM Users WHERE name = ? AND password = ?",
    [username, password]
  );

  if (rows.length > 0) {
    const dbUser = rows[0]!;

    // Kullanıcıyı session'a kaydet
    const session = await getIronSession<Session>(
      await cookies(),
      sessionOptions
    );

    session.user = {
      id: dbUser.user_id,
      name: dbUser.name,
      role: dbUser.role,
    };

    await session.save();

    // Kullanıcı rolüne göre yönlendirme
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

  return Response.redirect(new URL("/login", request.url), 303);
}
