import { fetchAllOrders } from "~/services/orders";

export default async function OrdersPage() {
  try {
    const orders = await fetchAllOrders();

    if (orders.length === 0) {
      return <p>No orders found!</p>;
    }

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.order_id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <div>
                <p className="font-bold text-lg">Order #{order.order_id}</p>
                <p>
                  <strong>Restaurant:</strong> {order.restaurant_name}
                </p>
                <p>
                  <strong>Address:</strong> {order.address_line}, {order.city}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total Price:</strong> ${order.total_price}
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
  } catch (error) {
    console.error("Error fetching orders:", error);
    return <p className="text-red-500">Failed to load orders.</p>;
  }
}
