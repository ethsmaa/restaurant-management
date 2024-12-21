import { defaultSession, getSession} from "~/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session.user) {
    return Response.json(defaultSession);
  }

  return Response.json(session);
}
