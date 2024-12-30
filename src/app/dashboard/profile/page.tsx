"use client";

import { useState, useEffect } from "react";
import type { EditableUser} from "~/lib/types/user"; // User tipini içeri aktar

// User'dan sadece gerekli alanları seçiyoruz

export default function ProfilePage() {
  const [user, setUser] = useState<EditableUser>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Kullanıcı bilgilerini yükle
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data: EditableUser = await response.json() as EditableUser;
        setUser({ ...data, password: "" }); // Şifreyi boş bırakıyoruz
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage("Kullanıcı bilgileri alınamadı.");
        setLoading(false);
      }
    };

    fetchUser().catch((error) => console.error("Error fetching user:", error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccessMessage("Profil başarıyla güncellendi.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Profil güncellenirken hata oluştu.");
    }
  };

  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Profilimi Güncelle</h1>

      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          <span>Ad Soyad:</span>
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Email:</span>
          <input
            className="w-full p-2 border rounded"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          <span>Şifre (opsiyonel):</span>
          <input
            className="w-full p-2 border rounded"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
