"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { MenuItem } from "~/lib/types/menuItem";

export default function EditMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.itemId);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyOfRestaurantId, setCopyOfRestaurantId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!itemId) {
      setErrorMessage("Geçersiz menü öğesi ID'si");
      setLoading(false);
      return;
    }

    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`/api/menuItems/${itemId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch menu item data");
        }
        const data = (await response.json()) as MenuItem;
        setMenuItem(data);
        setLoading(false);
        setCopyOfRestaurantId(data.restaurant_id);
      } catch (error) {
        console.error(error);
        setErrorMessage("Menü öğesi bilgileri alınamadı.");
        setLoading(false);
      }
    };

    fetchMenuItem().catch((error) =>
      console.error("Error fetching menu item:", error),
    );
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!menuItem) {
      setErrorMessage("Menü öğesi bilgileri yüklenemedi.");
      return;
    }

    try {
      const response = await fetch(`/api/menuItems/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }

      setSuccessMessage("Menü öğesi başarıyla güncellendi.");
    } catch (error) {
      console.error("Error updating menu item:", error);
      setErrorMessage("Menü öğesi güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Bu menü öğesini silmek istediğinize emin misiniz?")) {
      setSuccessMessage(null);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/menuItems/${itemId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete menu item");
        }

        router.push(`/dashboard/owner/${copyOfRestaurantId}`);

        setSuccessMessage("Menü öğesi başarıyla silindi.");
      } catch (error) {
        console.error("Error deleting menu item:", error);
        setErrorMessage("Menü öğesi silinirken hata oluştu.");
      }
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (!menuItem) {
    return <p>Menü öğesi bulunamadı.</p>;
  }

  return (
    <div className="mx-auto mt-10 max-w-md">
      <h1 className="mb-4 text-2xl font-bold">
        Menü Öğesi Bilgilerini Güncelle
      </h1>

      {successMessage && (
        <p className="mb-4 text-green-600">{successMessage}</p>
      )}
      {errorMessage && <p className="mb-4 text-red-600">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          <span>Menü Öğesi Adı:</span>
          <input
            className="w-full rounded border p-2"
            type="text"
            name="name"
            value={menuItem.name}
            onChange={(e) =>
              setMenuItem((prev) => ({ ...prev!, name: e.target.value }))
            }
            required
          />
        </label>
        <label>
          <span>Açıklama:</span>
          <input
            className="w-full rounded border p-2"
            type="text"
            name="description"
            value={menuItem.description}
            onChange={(e) =>
              setMenuItem((prev) => ({ ...prev!, description: e.target.value }))
            }
            required
          />
        </label>
        <label>
          <span>Fiyat:</span>
          <input
            className="w-full rounded border p-2"
            type="number"
            name="price"
            value={menuItem.price}
            onChange={(e) =>
              setMenuItem((prev) => ({ ...prev!, price: +e.target.value }))
            }
            required
          />
        </label>

        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="mt-4 rounded bg-red-500 p-2 text-white hover:bg-red-700"
      >
        Menü Öğesini Sil
      </button>

      <button
        onClick={() =>
          router.push(`/dashboard/owner/${menuItem.restaurant_id}`)
        }
        className="mt-4 rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Geri Dön
      </button>
    </div>
  );
}
