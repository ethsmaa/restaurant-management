'use client';
import Link from "next/link";
import { useSession } from "~/hooks/use-session";

export const LoginOrLogout = () => {
    const { session, isLogged } = useSession();


    if (!isLogged) return <Link href="/login">Login</Link>
    return <button
        onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
        }}
    >
        Logout {session.user?.name}
    </button>
}