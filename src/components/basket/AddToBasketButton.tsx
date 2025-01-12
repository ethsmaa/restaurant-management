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

      alert(`${item.name} has been added to the basket!`);
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full bg-slate-700 hover:bg-buttonColor text-white py-0.5 rounded-md transition-all"
    >
      Add to Basket
    </Button>
  );
}
