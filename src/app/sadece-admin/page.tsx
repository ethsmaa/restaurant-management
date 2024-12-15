import { getSession } from "~/lib/session";

export default async function Page() {
    const { user } = await getSession();

    if (!user || user.role !== "admin") return <h1>Yetkisiz erişim</h1>;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <h1>Admin sayfası</h1>
        </main>
    );

}