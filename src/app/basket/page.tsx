'use client';

import React, { useEffect, useState } from "react";
import { fetchBasket, removeFromBasket } from "~/services/basket";
import type { BasketItem } from "~/lib/types/basketItem";

export default function BasketPage() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Async işlemi handle eden bir iç fonksiyon
    const loadBasket = async () => {
      try {
        const data = await fetchBasket();
        setBasket(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load basket.");
      } finally {
        setLoading(false);
      }
    };

    // Async işlemi çağırırken `void` operatörü kullanarak eslint uyarısını engelleriz
    void loadBasket();
  }, []);

  const handleRemove = async (item_id: number) => {
    try {
      await removeFromBasket(item_id);
      setBasket((prev) => prev.filter((item) => item.item_id !== item_id));
      alert("Item removed from basket.");
    } catch (error) {
      console.error(error);
      alert("Error removing item from basket.");
    }
  };

  if (loading) {
    return <p>Loading basket...</p>;
  }

  if (basket.length === 0) {
    return <p>Your basket is empty!</p>;
  }

  return (
    <div>
      <h1>Your Basket</h1>
      <ul>
        {basket.map((item) => (
          <li key={item.item_id}>
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => void handleRemove(item.item_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>
        <strong>
          Total Price: $
          {basket
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </strong>
      </p>
    </div>
  );
}