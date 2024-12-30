export type Restaurant = {
    restaurant_id: number;
    name: string;
    address: string;
    phone: string;
  };
  

  export type RestaurantUpdate = Pick<Restaurant, "name" | "address" | "phone">;