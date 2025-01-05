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

  const handleRemoveFromBasket = async (itemId: number, quantity: number) => {
    try {
      if (quantity > 1) {
        // eger urunden birden fazla varsa bir tane eksilt
        setBasket((prevBasket) =>
          prevBasket.map((item) =>
            item.item_id === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
        // api'a istek atarak urunu sepetten cikar
        const response = await removeFromBasket(itemId);
        if (response.ok) {
          setBasket((prevBasket) =>
            prevBasket.filter((item) => item.item_id !== itemId)
          );
        } else {
          alert("Failed to remove item from basket.");
        }
      }
    } catch (error) {
      console.error("Error removing item from basket:", error);
      alert("Failed to remove item from basket.");
    }
  };

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
              <li key={item.item_id} className="flex items-center justify-between">
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center">
                  {item.quantity > 1 ? (
                    <button
                      onClick={() => void handleRemoveFromBasket(item.item_id, item.quantity)}
                      className="bg-purple-500 text-white px-3 py-1 rounded"
                    >
                      -
                    </button>
                  ) : (
                    <button
                      onClick={() => void handleRemoveFromBasket(item.item_id, item.quantity)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setBasket((prevBasket) =>
                        prevBasket.map((basketItem) =>
                          basketItem.item_id === item.item_id
                            ? { ...basketItem, quantity: basketItem.quantity + 1 }
                            : basketItem
                        )
                      )
                    }
                    className="bg-purple-500 text-white px-3 py-1 ml-2 rounded"
                  >
                    +
                  </button>
                </div>
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
