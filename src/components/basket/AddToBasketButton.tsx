"use client";

import React from "react";
import { type MenuItem } from "~/lib/types/menuItem";
import { addToBasket } from "~/services/basket";

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
    <button onClick={handleAddToCart}>
      Sepete Ekle
    </button>
  );
}
