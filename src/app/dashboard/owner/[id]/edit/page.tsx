"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Restaurant } from "~/lib/types/restaurant"; // Import Restaurant type
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function EditRestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = Number(params.id);

  const [restaurant, setRestaurant] = useState<Restaurant>({
    restaurant_id: restaurantId,
    name: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setErrorMessage("Invalid restaurant ID");
      setLoading(false);
      return;
    }

    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant data");
        }
        const data = (await response.json()) as Restaurant;
        setRestaurant(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch restaurant information.");
        setLoading(false);
      }
    };

    fetchRestaurant().catch((error) =>
      console.error("Error fetching restaurant:", error),
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

      setSuccessMessage("Restaurant information updated successfully.");
    } catch (error) {
      console.error("Error updating restaurant:", error);
      setErrorMessage("An error occurred while updating restaurant information.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      setSuccessMessage(null);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete restaurant");
        }

        setSuccessMessage("Restaurant deleted successfully.");
        router.push("/dashboard/owner");
      } catch (error) {
        console.error("Error deleting restaurant:", error);
        setErrorMessage("An error occurred while deleting the restaurant.");
      }
    }
  };

  if (loading) {
    return <p className="mt-10 text-center">Loading...</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] text-white">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">
            Update Restaurant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <p className="mb-4 rounded bg-green-100 p-2 text-green-700">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mb-4 rounded bg-red-100 p-2 text-red-700">
              {errorMessage}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={restaurant.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={restaurant.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={restaurant.phone}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mt-4 w-full"
          >
            Delete Restaurant
          </Button>
          <a href={`/dashboard/owner/${restaurantId}`}>
            <Button className="mt-4 w-full">Back</Button>
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
