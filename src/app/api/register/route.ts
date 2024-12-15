import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { getConnection } from "~/lib/database";
import { Session, sessionOptions } from "~/lib/session";
import { User, POST as LoginPost } from "../login/route";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  const db = await getConnection();
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await db.query("INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)", [
    name,
    email,
    password,
    "customer",
  ]);

  const session = await getIronSession<Session>(
    await cookies(),
    sessionOptions,
  );

  const [rows] = await db.query<(User & RowDataPacket)[]>(
    "SELECT * FROM Users WHERE name = ?",
    [name],
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

  return Response.redirect(new URL("/register", request.url), 303);
}
