import { redirect } from "next/navigation";
import { getSession } from "~/lib/session";
import { UserRole } from "~/lib/enums/roles";

export default async function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Eğer kullanıcı giriş yapmamışsa login'e yönlendir
  if (session.user === null) {
    redirect("/login");
  }

  // Eğer kullanıcı "OWNER" değilse yetki yok sayfasına yönlendir
  if (session.user?.role !== UserRole.OWNER) {
    redirect("/not-authorized");
  }

  return <>{children}</>;
}
