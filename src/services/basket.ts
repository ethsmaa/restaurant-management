import { type BasketItem } from "~/lib/types/basketItem";

// Sepet verisini getir
export async function fetchBasket(): Promise<BasketItem[]> {
  const response = await fetch("/api/basket", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch basket");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await response.json();
}

// Sepete ürün ekle
export async function addToBasket(
  item: Omit<BasketItem, "quantity">,
): Promise<void> {
  const response = await fetch("/api/basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to basket");
  }
}

// Sepetten ürün kaldır
export async function removeFromBasket(item_id: number): Promise<void> {
  const response = await fetch(`/api/basket?item_id=${item_id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove item from basket");
  }
}
