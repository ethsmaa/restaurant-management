'use client';
import Link from "next/link";
import { useSession } from "~/hooks/use-session";
import { Button } from "./ui/button";
import { CiLogout } from "react-icons/ci";

export const LoginOrLogout = () => {
    const { session, isLogged } = useSession();


    if (!isLogged) return <Link href="/login">Login</Link>
    return <Button  variant="outline"
        onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.reload();
        }}
    >
        <CiLogout />
        Logout {session.user?.name}
    </Button>
}