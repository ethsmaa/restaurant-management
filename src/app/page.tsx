
import Link from "next/link";
import { LoginOrLogout } from "~/components/LoginOrLogout";
import { Register } from "~/components/Register";
import { getSession } from "~/lib/session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {session.user && <h1>Hos geldiniz {session.user.name}</h1>}
      <LoginOrLogout />
      {!session.user && <Register />}
    </main>
  );
}
