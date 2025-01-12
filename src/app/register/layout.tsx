import { getSession } from "~/lib/session";

export default async function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Eğer kullanıcı giriş yapmışsa bir uyarı göster
  if (session.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center text-white bg-[#f3f4f6]">
        <div className="p-4 bg-white rounded shadow-lg text-black">
          You are already logged in. Please log out to register a new account.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
