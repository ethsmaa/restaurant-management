import { getSession } from "~/lib/session";

export async function POST(request: Request) {
 const session = await getSession();

  session.user = null;

  await session.save();

  return Response.redirect(new URL("/login", request.url), 303);
}
