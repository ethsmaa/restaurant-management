"use client";

import { useState } from "react";

interface OrderItemProps {
  order: {
    order_id: number;
    status: string;
    total_price: number;
    address_line: string;
    city: string;
    created_at: string;
  };
}

export default function OrderItem({ order }: OrderItemProps) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/orders/${order.order_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      setStatus(newStatus);
      setSuccessMessage("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div>
        <p>
          <strong>Order ID:</strong> {order.order_id}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Total Price:</strong> ${order.total_price}
        </p>
        <p>
          <strong>Address:</strong> {order.address_line}, {order.city}
        </p>
        <p>
          <strong>Ordered At:</strong>{" "}
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(order.created_at))}
        </p>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="mt-2 border rounded p-2"
          disabled={loading}
        >
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="On The Way">On The Way</option>
          <option value="Delivered">Delivered</option>
        </select>

        {loading && <p className="text-blue-500">Updating...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </li>
  );
}
