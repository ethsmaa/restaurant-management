'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("");
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // URL'den error parametresini al

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <form
        action="/api/register"
        method="post"
        className="flex flex-col gap-4 p-4 rounded-lg shadow-lg"
      >
        <label>
          <span>Username</span>
          <input className="text-black" type="text" name="name" required />
        </label>
        <label>
          <span>Email</span>
          <input className="text-black" type="email" name="email" required />
        </label>
        <label>
          <span>Password</span>
          <input className="text-black" type="password" name="password" required />
        </label>

        {/* Role seçim butonları */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleRoleClick("customer")}
            className={`w-full p-2 rounded-md ${
              selectedRole === "customer" ? "bg-blue-500 text-white" : "bg-white text-black"
            } hover:bg-gray-300`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleClick("restaurant_owner")}
            className={`w-full p-2 rounded-md ${
              selectedRole === "restaurant_owner" ? "bg-blue-500 text-white" : "bg-white text-black"
            } hover:bg-gray-300`}
          >
            Restaurant
          </button>
        </div>

        <input type="hidden" name="role" value={selectedRole} />

        {error === "email_exists" && (
          <p className="text-red-500">This email is already registered. Please use a different email.</p>
        )}
        {error === "unknown_error" && (
          <p className="text-red-500">An unknown error occurred. Please try again.</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 p-2 rounded hover:bg-blue-700 mt-4"
        >
          Register
        </button>
      </form>
    </main>
  );
}