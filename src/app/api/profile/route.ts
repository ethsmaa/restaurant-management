import { fetchUser, updateUser } from "~/services/users";
import { NextResponse } from "next/server";

// Kullanıcı bilgilerini getir (GET)
export async function GET() {
  try {
    const user = await fetchUser();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data." }, { status: 500 });
  }
}

// Kullanıcı bilgilerini güncelle (PATCH)
export async function PATCH(request: Request) {
  try {
    const updatedData = await request.json();
    await updateUser(updatedData);

    return NextResponse.json({ message: "Profile updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
