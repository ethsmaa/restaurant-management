'use client';
import { useSession } from "~/hooks/use-session";

export const LoginOrLogout = () => {
    const { session, isLogged } = useSession();


    if (!isLogged) return <a href="/login">Login</a>
    return <button
        onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
        }}
    >
        Logout {session.user?.name}
    </button>
}