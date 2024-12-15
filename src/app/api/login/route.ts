import { getIronSession } from "iron-session";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { getConnection } from "~/lib/database";
import { Session, sessionOptions } from "~/lib/session";

export type User = {
  id: number;
  name: string;
  password: string;
  email: string;
  role: "customer" | "restaurant_owner" | "admin";
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const session = await getIronSession<Session>(
    await cookies(),
    sessionOptions,
  );

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const db = await getConnection();

  const [rows] = await db.query<(User & RowDataPacket)[]>(
    "SELECT * FROM Users WHERE name = ? AND password = ?",
    [username, password],
  );

  if (rows.length > 0) {
    const dbUser = rows[0]!;
    session.user = {
      id: dbUser.id,
      name: dbUser.name,
      role: dbUser.role,
    };

    await session.save();

    return Response.redirect(new URL("/", request.url), 303);
  }

  return Response.redirect(new URL("/login", request.url), 303);
}
