"use client";

import React, { useEffect, useState } from "react";
import { fetchBasket, removeFromBasket } from "~/services/basket";
import type { BasketItem as BasketItemType } from "~/lib/types/basketItem";
import type { Address } from "~/lib/types/address";

export default function BasketAndPaymentPage() {
  const [basket, setBasket] = useState<BasketItemType[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [loadingBasket, setLoadingBasket] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);

  useEffect(() => {
    const loadBasket = async () => {
      try {
        const data = await fetchBasket();
        setBasket(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load basket.");
      } finally {
        setLoadingBasket(false);
      }
    };

    const loadDefaultAddress = async () => {
      try {
        const response = await fetch("/api/addresses/default", { method: "GET" });

        if (response.ok) {
          const address: Address = (await response.json()) as Address;
          setDefaultAddress(address);
        } else {
          setDefaultAddress(null);
        }
      } catch (error) {
        console.error("Failed to load default address.", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    void loadBasket();
    void loadDefaultAddress();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const response = await fetch("/api/orders", { method: "POST" });

      if (response.ok) {
        const data = (await response.json()) as { orderId: string };
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
        setBasket([]); // Sepeti temizle
      } else {
        const error = (await response.json()) as { error: string };
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  if (loadingBasket || loadingAddress) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 space-y-8">
      {/* Sepet Bölümü */}
      <div>
        <h1>Your Basket</h1>
        {basket.length === 0 ? (
          <p>Your basket is empty!</p>
        ) : (
          <ul>
            {basket.map((item) => (
              <li key={item.item_id}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => void removeFromBasket(item.item_id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Adres Bölümü */}
      <div>
        <h2>Delivery Address</h2>
        {defaultAddress ? (
          <div>
            <h3>{defaultAddress.address_title}</h3>
            <p>{defaultAddress.address_line}</p>
            <p>{defaultAddress.city}</p>
          </div>
        ) : (
          <p>No default address selected. Please select one.</p>
        )}
      </div>

      {/* Ödeme Butonu */}
      <button
        onClick={handlePlaceOrder}
        disabled={basket.length === 0 || !defaultAddress}
        className={`p-2 rounded ${
          basket.length > 0 && defaultAddress
            ? "bg-green-500 text-white hover:bg-green-700"
            : "bg-gray-500 text-gray-300 cursor-not-allowed"
        }`}
      >
        Place Order
      </button>
    </div>
  );
}
