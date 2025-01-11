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
  const resolvedParams = use(params); // Promise çözülüyor
  const { id } = resolvedParams;

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#c0bbc6] to-[#15162c] text-white">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg font-bold">
            Yeni Menü Öğesi Ekle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/addItem" method="post" className="space-y-4">
            <input type="hidden" name="restaurantId" value={id} />

            <div>
              <Label htmlFor="name">Ürün Adı</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Ürün Adını Girin"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                type="text"
                name="description"
                placeholder="Ürün Açıklaması"
              />
            </div>
            <div>
              <Label htmlFor="price">Fiyat</Label>
              <Input
                id="price"
                type="number"
                name="price"
                placeholder="Fiyat Girin"
                required
              />
            </div>

            <div>
              <Label>Kategori</Label>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant={
                    selectedCategory === "starter" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("starter")}
                >
                  Başlangıç
                </Button>
                <Button
                  type="button"
                  variant={
                    selectedCategory === "main_course" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("main_course")}
                >
                  Ana Yemek
                </Button>
                <Button
                  type="button"
                  variant={
                    selectedCategory === "dessert" ? "default" : "outline"
                  }
                  onClick={() => handleCategoryClick("dessert")}
                >
                  Tatlı
                </Button>
              </div>
              <input type="hidden" name="category" value={selectedCategory} />
            </div>

            <Button type="submit" className="mt-4 w-full">
              Ekle
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
