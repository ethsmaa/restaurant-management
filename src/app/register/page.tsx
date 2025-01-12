"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // Get the error parameter from the URL

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f4f6] text-white">
      <form
        action="/api/register"
        method="post"
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-white text-black w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center text-gray-800">Sign Up</h1>
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

        {/* Role selection buttons */}
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
          <p className="text-buttonColor">This email is already registered. Please try another email.</p>
        )}
        {error === "unknown_error" && (
          <p className="text-buttonColor">An unknown error occurred. Please try again.</p>
        )}

        <Button type="submit" className="mt-4">
          Sign Up
        </Button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-buttonColor hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </main>
  );
}
