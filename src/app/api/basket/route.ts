import { getSession } from "~/lib/session";
import type { BasketItem } from "~/lib/types/basketItem";

export async function POST(request: Request) {
  const session = await getSession();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { item_id, name, price}: BasketItem = await request.json();

  if (!session.cart) {
    session.cart = [];
  }

  // Check if the item is already in the cart
  const existingItem = session.cart.find((item) => item.item_id === item_id);

  // eger varsa quantity'i arttır
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    session.cart.push({ item_id, name, price, quantity: 1 });
  }

  await session.save();
  return new Response("Item added to cart", { status: 200 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  const url = new URL(request.url);
  const item_id = Number(url.searchParams.get("item_id"));

  if (!session.cart || session.cart.length === 0) {
    return new Response("Cart is empty", { status: 400 });
  }

  session.cart = session.cart.filter((item) => item.item_id !== item_id);

  await session.save();
  return new Response("Item removed from cart", { status: 200 });
}

export async function GET() {
  const session = await getSession();
  return new Response(JSON.stringify(session.cart ?? []), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

