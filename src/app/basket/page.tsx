"use client";

import React, { useEffect, useState } from "react";
import { fetchBasket, removeFromBasket } from "~/services/basket";
import type { BasketItem as BasketItemType } from "~/lib/types/basketItem";
import type { Address } from "~/lib/types/address";
import { Button } from "~/components/ui/button";
import Link from "next/link";

import { FaTrash } from "react-icons/fa";

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
        setBasket((prevBasket) =>
          prevBasket.map((item) =>
            item.item_id === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
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
        setBasket([]);
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
    <div className="max-w-4xl mx-auto p-6 m-10 bg-gray-50 rounded-lg shadow space-y-8">
      {/* Sepet Bölümü */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Your Basket</h1>
        {basket.length === 0 ? (
          <p className="text-gray-500">Your basket is empty!</p>
        ) : (
          <ul className="space-y-4">
            {basket.map((item) => (
              <li
                key={item.item_id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
              >
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      void handleRemoveFromBasket(item.item_id, item.quantity)
                    }
                  >
                    {item.quantity > 1 ? <span className="text-2xl">-</span>: <span className="flex items-center gap-1">
                      <FaTrash />
                  
                    </span>}
                  </Button>
                  <Button
                    onClick={() =>
                      setBasket((prevBasket) =>
                        prevBasket.map((basketItem) =>
                          basketItem.item_id === item.item_id
                            ? { ...basketItem, quantity: basketItem.quantity + 1 }
                            : basketItem
                        )
                      )
                    }
                  >
                    <span className="text-xl">+</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Adres Bölümü */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        {defaultAddress ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium">{defaultAddress.address_title}</h3>
            <p>{defaultAddress.address_line}</p>
            <p>{defaultAddress.city}</p>
          </div>
        ) : (
          <p className="text-gray-500">
            No default address selected. <Link className='underline' href="dashboard/customer/account/addresses">Please select one.</Link>
          </p>
        )}
      </div>

      {/* Ödeme Butonu */}
      <Button
        onClick={handlePlaceOrder}
        disabled={basket.length === 0 || !defaultAddress}
        className={`w-full ${basket.length > 0 && defaultAddress
            ? "bg-green-500 hover:bg-green-700"
            : "bg-gray-500 cursor-not-allowed"
          }`}
      >
        Place Order
      </Button>
    </div>
  );
}
