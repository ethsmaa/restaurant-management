import { addRestaurant } from "~/services/restaurants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;

  try {
    await addRestaurant(name, address, phone);
    return NextResponse.redirect(new URL("/dashboard/owner", request.url));
  } catch (error) {
    console.error(error);
    // Hata durumunda yönlendirme
    return NextResponse.redirect(new URL("/dashboard/owner/add?error=Bir hata oluştu", request.url));
  }
}

