import { fetchRestaurantsAlphabetically } from "~/services/restaurants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const restaurants = await fetchRestaurantsAlphabetically();
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants alphabetically:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants alphabetically." },
      { status: 500 }
    );
  }
}
