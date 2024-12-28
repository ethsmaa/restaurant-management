export interface Order {
    order_id: number;
    status: "Pending" | "Preparing" | "On the Way" | "Delivered";
    total_price: number;
    created_at: string; // ISO date string
    restaurant_name: string; // Joined from Restaurants
    address_line: string; // Joined from Addresses
    city: string; // Joined from Addresses
  }
  