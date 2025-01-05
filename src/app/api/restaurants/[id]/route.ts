import { updateRestaurant, fetchRestaurantById, deleteRestaurant } from "~/services/restaurants";
import { NextResponse } from "next/server";
import type {  RestaurantUpdate } from "~/lib/types/restaurant";


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const restaurantId = Number(params.id);

  if (isNaN(restaurantId)) {
    return NextResponse.json(
      { error: "Geçersiz restoran ID'si" },
      { status: 400 },
    );
  }

  const { name, address, phone }: RestaurantUpdate = await request.json() as RestaurantUpdate;

  if (!name || !address || !phone) {
    return NextResponse.json(
      { error: "Tüm alanlar doldurulmalıdır" },
      { status: 400 },
    );
  }

  try {
    await updateRestaurant(restaurantId, name, address, phone);
    return NextResponse.json({ message: "Restoran bilgileri güncellendi." });
  } catch (error) {
    console.error("Restoran güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Restoran bilgileri güncellenemedi." },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const restaurantId = Number(params.id);

  if (isNaN(restaurantId)) {
    return NextResponse.json(
      { error: "Geçersiz restoran ID'si" },
      { status: 400 },
    );
  }

  try {
    const restaurant = await fetchRestaurantById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restoran bulunamadı." },
        { status: 404 },
      );
    }
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Restoran bilgisi alınırken hata oluştu:", error);
    return NextResponse.json(
      { error: "Restoran bilgisi alınamadı." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const restaurantId = Number(params.id);

  if (isNaN(restaurantId)) {
    return NextResponse.json(
      { error: "Geçersiz restoran ID'si" },
      { status: 400 },
    );
  }

  try {
    await deleteRestaurant(restaurantId);
    return NextResponse.json({ message: "Restoran başarıyla silindi." });
  } catch (error) {
    console.error("Restoran silme hatası:", error);
    return NextResponse.json(
      { error: "Restoran silinemedi." },
      { status: 500 },
    );
  }
}