import { fetchOrdersByRestaurantId } from "~/services/orders";
import OrderItem from "~/components/OrderItem";

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
          <OrderItem key={order.order_id} order={order} />
        ))}
      </ul>
    </div>
  );
}
