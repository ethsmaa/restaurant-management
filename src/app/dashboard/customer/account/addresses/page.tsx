"use client";

import { useState, useEffect } from "react";
import type { Address } from "~/lib/types/address";
import Link from "next/link"; // Adres ekleme sayfasına yönlendirmek için

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    // Adresleri API'den çek
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses", { method: "GET" });
        const data: Address[] = await response.json() as Address[];
        setAddresses(data);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    void fetchAddresses();
  }, []);

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const response = await fetch("/api/addresses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      });

      if (response.ok) {
        // Adresleri tekrar yükle
        const updatedAddresses: Address[] = await fetch("/api/addresses", {
          method: "GET",
        }).then((res) => res.json() as Promise<Address[]>);
        setAddresses(updatedAddresses);
      } else {
        alert("Varsayılan adres belirlenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div>
      <h1>Adreslerim</h1>

      {addresses.length === 0 ? (
        <p>Henüz adres eklenmemiş.</p>
      ) : (
        <ul>
          {addresses.map((address) => (
            <li key={address.address_id} className="mb-4">
              <p>
                {address.address_title} - {address.address_line}, {address.city}
              </p>
              <button
                onClick={() => handleSetDefaultAddress(address.address_id)}
                className={`p-2 rounded ${
                  address.is_default
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white hover:bg-gray-700"
                }`}
              >
                {address.is_default ? "Varsayılan Adres" : "Bu Adresi Varsayılan Yap"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Yeni Adres Ekleme Butonu */}
      <Link href="/dashboard/customer/account/addresses/new">
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 mt-4">
          Yeni Adres Ekle
        </button>
      </Link>
    </div>
  );
}
