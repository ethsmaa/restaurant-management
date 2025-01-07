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
      <div className="flex min-h-screen items-center justify-center text-center text-white bg-gradient-to-b from-slate-700 to-slate-900">
        <div className="p-4 bg-white rounded shadow-lg text-black">
          Zaten giriş yaptınız. Çıkış yapmadan tekrar kayıt olamazsınız.
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
