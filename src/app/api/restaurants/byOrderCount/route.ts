import { fetchRestaurantsByOrderCount } from "~/services/restaurants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const restaurants = await fetchRestaurantsByOrderCount();
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching filtered restaurants:", error);

    return NextResponse.json(
      { error: "Failed to fetch filtered restaurants." },
      { status: 500 }
    );
  }
}
