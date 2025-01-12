"use client";

import { use } from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function AddMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params); // Resolving the promise
  const { id } = resolvedParams;

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] text-white">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">
            Add New Menu Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/addItem" method="post" className="space-y-4">
            <input type="hidden" name="restaurantId" value={id} />

            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                placeholder="Enter Product Description"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                placeholder="Enter Price"
                required
              />
            </div>

            <div>
              <Label>Category</Label>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant={
                    selectedCategory === "starter" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("starter")}
                >
                  Starter
                </Button>
                <Button
                  type="button"
                  variant={
                    selectedCategory === "main_course" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("main_course")}
                >
                  Main Course
                </Button>
                <Button
                  type="button"
                  variant={
                    selectedCategory === "dessert" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("dessert")}
                >
                  Dessert
                </Button>
              </div>
              <input type="hidden" name="category" value={selectedCategory} />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
