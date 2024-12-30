"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Restaurant } from "~/lib/types/restaurant"; // Restaurant tipini içeri aktar

export default function EditRestaurantPage() {
    const params = useParams();
    const restaurantId = Number(params.id);

    const [restaurant, setRestaurant] = useState<Restaurant>({
        restaurant_id: restaurantId, // Varsayılan ID'yi buraya ekliyoruz
        name: "",
        address: "",
        phone: "",
    });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!restaurantId) {
            setErrorMessage("Geçersiz restoran ID'si");
            setLoading(false);
            return;
        }

        // Restoran bilgilerini yükle
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(`/api/restaurants/${restaurantId}`, {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurant data");
                }
                const data = (await response.json()) as Restaurant; // API'den dönen veriyi Restaurant tipine cast et
                setRestaurant(data); // Veriyi state'e aktar
                setLoading(false);
            } catch (error) {
                console.error(error);
                setErrorMessage("Restoran bilgileri alınamadı.");
                setLoading(false);
            }
        };

        fetchRestaurant().catch((error) =>
            console.error("Error fetching restaurant:", error)
        );
    }, [restaurantId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRestaurant((prevRestaurant) => ({ ...prevRestaurant, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/restaurants/${restaurantId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(restaurant),
            });

            if (!response.ok) {
                throw new Error("Failed to update restaurant");
            }

            setSuccessMessage("Restoran bilgileri başarıyla güncellendi.");
        } catch (error) {
            console.error("Error updating restaurant:", error);
            setErrorMessage("Restoran bilgileri güncellenirken hata oluştu.");
        }
    };

    if (loading) {
        return <p>Yükleniyor...</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Restoran Bilgilerini Güncelle</h1>

            {successMessage && (
                <p className="text-green-600 mb-4">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-600 mb-4">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label>
                    <span>Restoran Adı:</span>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="name"
                        value={restaurant.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <span>Adres:</span>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="address"
                        value={restaurant.address}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    <span>Telefon:</span>
                    <input
                        className="w-full p-2 border rounded"
                        type="text"
                        name="phone"
                        value={restaurant.phone}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                >
                    Güncelle
                </button>
            </form>

            <a href={`/dashboard/owner/${restaurantId}`}>
                <button className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                    Geri Dön
                </button>
            </a>
        </div>
    );
}
