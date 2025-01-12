"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { MenuItem } from "~/lib/types/menuItem";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function EditMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = Number(params.itemId);

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) {
      setErrorMessage("Invalid menu item ID");
      setLoading(false);
      return;
    }

    const fetchMenuItem = async () => {
      try {
        const response = await fetch(`/api/menuItems/${itemId}`, { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch menu item data");

        const data = (await response.json()) as MenuItem;
        setMenuItem(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to fetch menu item information.");
        setLoading(false);
      }
    };

    fetchMenuItem().catch((error) => console.error("Error fetching menu item:", error));
  }, [itemId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMenuItem((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/menuItems/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItem),
      });

      if (!response.ok) throw new Error("Failed to update menu item");

      setSuccessMessage("Menu item updated successfully.");
    } catch (error) {
      console.error("Error updating menu item:", error);
      setErrorMessage("An error occurred while updating the menu item.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        const response = await fetch(`/api/menuItems/${itemId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete menu item");

        router.push("/dashboard/owner");
      } catch (error) {
        console.error("Error deleting menu item:", error);
        setErrorMessage("An error occurred while deleting the menu item.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!menuItem) return <p className="text-center mt-10">Menu item not found.</p>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
      <Card className="w-full max-w-lg p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">Edit Menu Item</CardTitle>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <p className="mb-4 rounded bg-green-100 p-2 text-green-700">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="mb-4 rounded bg-red-100 p-2 text-red-700">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={menuItem.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={menuItem.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={menuItem.price}
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
            Delete Menu Item
          </Button>
          <Button
            onClick={() => router.push("/dashboard/owner")}
            className="mt-4 w-full"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
