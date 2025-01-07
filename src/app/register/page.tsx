"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // URL'den error parametresini al

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      <form
        action="/api/register"
        method="post"
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white text-black"
      >
        <label className="flex flex-col gap-2">
          <span>Username</span>
          <Input type="text" name="name" required />
        </label>
        <label className="flex flex-col gap-2">
          <span>Email</span>
          <Input type="email" name="email" required />
        </label>
        <label className="flex flex-col gap-2">
          <span>Password</span>
          <Input type="password" name="password" required />
        </label>

        {/* Role seçim butonları */}
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            onClick={() => handleRoleClick("customer")}
            variant={selectedRole === "customer" ? "default" : "outline"}
          >
            Customer
          </Button>
          <Button
            type="button"
            onClick={() => handleRoleClick("restaurant_owner")}
            variant={selectedRole === "restaurant_owner" ? "default" : "outline"}
          >
            Restaurant
          </Button>
        </div>

        <input type="hidden" name="role" value={selectedRole} />

        {error === "email_exists" && (
          <p className="text-red-500">This email is already registered. Please use a different email.</p>
        )}
        {error === "unknown_error" && (
          <p className="text-red-500">An unknown error occurred. Please try again.</p>
        )}

        <Button type="submit" className="mt-4">
          Register
        </Button>
      </form>
    </main>
  );
}
