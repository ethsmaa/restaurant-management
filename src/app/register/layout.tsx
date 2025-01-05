import { getSession } from "~/lib/session";


export default async function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Eğer kullanıcı giriş yapmamışsa login'e yönlendir
    if (session.user) {
        return <div>zaten giris yaptin once oturumu kapa</div>
    }


    return <>{children}</>;
}
