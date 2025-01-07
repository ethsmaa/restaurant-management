"use client";

import Link from "next/link";
import { Logout } from "~/components/Logout";

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Account</h2>
        <Link href="/dashboard/profile">
          <button className="w-full text-left p-2 rounded bg-gray-200 hover:bg-gray-300">
            Profil
          </button>
        </Link>
        <Link href="/dashboard/customer/account/addresses">
          <button className="w-full text-left p-2 rounded bg-gray-200 hover:bg-gray-300">
            Adreslerim
          </button>
        </Link>
        <Link href="/dashboard/customer/account/orders">
          <button className="w-full text-left p-2 rounded bg-gray-200 hover:bg-gray-300">
            Siparişlerim
          </button>
        </Link>
       
        <Logout />
      </aside>

      {/* Content */}
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
