"use client";

import React from "react";
import { type MenuItem } from "~/lib/types/menuItem";
import { addToBasket } from "~/services/basket";
import { Button } from "~/components/ui/button";

interface AddToCartButtonProps {
  item: MenuItem;
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    try {
      await addToBasket({
        item_id: item.item_id,
        name: item.name,
        price: item.price,
      });

      alert(`${item.name} sepete eklendi!`);
    } catch (error) {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full bg-slate-700 hover:bg-purple-500 text-white py-0.5 rounded-md transition-all"
    >
      Sepete Ekle
    </Button>
  );
}
