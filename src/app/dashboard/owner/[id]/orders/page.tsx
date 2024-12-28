import { fetchOrdersByRestaurantId } from "~/services/orders";

interface RestaurantOrdersProps {
  params: { id: string };
}

export default async function RestaurantOrders({ params }: RestaurantOrdersProps) {
  const restaurantId = Number(params.id);

  if (isNaN(restaurantId)) {
    throw new Error("Invalid restaurant ID.");
  }

  const orders = await fetchOrdersByRestaurantId(restaurantId);

  if (orders.length === 0) {
    return <p>No orders found for this restaurant.</p>;
  }

  return (
    <div>
      <h1>Restaurant Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li
            key={order.order_id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div>
              <p>
                <strong>Order ID:</strong> {order.order_id}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.total_price}
              </p>
              <p>
                <strong>Address:</strong> {order.address_line}, {order.city}
              </p>
              <p>
                <strong>Ordered At:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
