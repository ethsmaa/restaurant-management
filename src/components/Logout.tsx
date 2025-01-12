"use client";

import { useSession } from "~/hooks/use-session";
import { Button } from "~/components/ui/button";

import { CiLogout } from "react-icons/ci";

export const Logout = () => {
  const { session } = useSession();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/"; // Geri başa dön
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Çıw bir hata oluştu.");
    }
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="mt-4">
      <CiLogout />
      Logout {session.user?.name && `(${session.user.name})`}
    </Button>
  );
};
