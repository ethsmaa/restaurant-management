"use client";

import { useState, useEffect } from "react";
import type { Address } from "~/lib/types/address";
import Link from "next/link"; // Adres ekleme sayfasına yönlendirmek için
import { Button } from "~/components/ui/button";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<number | null>(null);

  useEffect(() => {
    // Adresleri API'den çek
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses", { method: "GET" });
        const data: Address[] = (await response.json()) as Address[];
        setAddresses(data);

        // Varsayılan adresi ayarla
        const defaultAddress = data.find((address) => address.is_default);
        if (defaultAddress) setDefaultAddressId(defaultAddress.address_id);
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
        // Varsayılan adresi UI'da güncelle
        setDefaultAddressId(addressId);
      } else {
        alert("Varsayılan adres belirlenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Adreslerim</h1>

      {addresses.length === 0 ? (
        <p>Henüz adres eklenmemiş.</p>
      ) : (
        <RadioGroup
          value={defaultAddressId?.toString() ?? ""}
          onValueChange={(value) => handleSetDefaultAddress(Number(value))}
        >
          {addresses.map((address) => (
            <div
              key={address.address_id}
              className="flex items-center bg-white justify-between p-4 border rounded-md shadow-sm hover:shadow-lg transition"
            >
              <div>
                <p className="font-bold">{address.address_title}</p>
                <p className="text-sm text-gray-600">
                  {address.address_line}, {address.city}
                </p>
              </div>
              <RadioGroupItem
                value={address.address_id.toString()}
                className="w-5 h-5 border-gray-400 checked:bg-blue-500 checked:border-blue-500"
              />
            </div>
          ))}
        </RadioGroup>
      )}

      {/* Yeni Adres Ekleme Butonu */}
      <Link href="/dashboard/customer/account/addresses/new">
        <Button className="w-full mt-4">Yeni Adres Ekle</Button>
      </Link>
    </div>
  );
}
