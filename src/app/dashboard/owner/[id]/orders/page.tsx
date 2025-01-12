import { fetchOrdersByRestaurantId } from "~/services/orders";
import OrderItem from "~/components/OrderItem";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

interface RestaurantOrdersProps {
  params: { id: string };
}

export default async function RestaurantOrders({
  params,
}: RestaurantOrdersProps) {
  const restaurantId = Number(params.id);

  if (isNaN(restaurantId)) {
    throw new Error("Invalid restaurant ID.");
  }

  const orders = await fetchOrdersByRestaurantId(restaurantId);

  if (orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] text-white">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">
              No Orders Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              This restaurant has no orders at the moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3f4f6] text-white p-10">
      <Card className="w-full max-w-4xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Restaurant Orders
          </CardTitle>
          <Separator className="my-4" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {orders.map((order) => (
              <OrderItem key={order.order_id} order={order} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
