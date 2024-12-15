import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { Session, sessionOptions } from "~/lib/session";

export async function POST(request: Request) {
  const session = await getIronSession<Session>(
    await cookies(),
    sessionOptions,
  );

  session.user = null;

  await session.save();

  return Response.redirect(new URL("/login", request.url), 303);
}
