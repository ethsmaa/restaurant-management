"use client"; 

import React from "react";
import { type MenuItem } from "~/lib/types/menuItem";

interface AddToCartButtonProps {
  item: MenuItem;
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/basket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item.item_id,
          name: item.name,
          price: item.price,
        }),
      });

      if (response.ok) {
        alert(`${item.name} sepete eklendi!`);
      } else {
        const errorText = await response.text();
        alert(`Sepete eklenirken hata: ${errorText}`);
      }
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
