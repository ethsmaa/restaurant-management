import { fetchUser, updateUser, deleteUser } from "~/services/users";
import { NextResponse } from "next/server";
import { getSession } from "~/lib/session";
import type { User } from "~/lib/types/user";

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
    return NextResponse.json(
      { error: "Failed to fetch user data." },
      { status: 500 },
    );
  }
}

// Kullanıcı bilgilerini güncelle (PATCH)
export async function PATCH(request: Request) {
  try {
    const updatedData: Partial<User> = await request.json() as Partial<User>;
    await updateUser(updatedData);

    return NextResponse.json(
      { message: "Profile updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 },
    );
  }
}

// kullanici bilgilerini sil
export async function DELETE(request: Request) {
  try {
    // Kullanıcının oturum bilgilerini al
    const session = await getSession();

    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    console.log('kullanici sildikten once session.user', session.user);
    // Kullanıcıyı sil
    await deleteUser();

    session.user = null;
    await session.save();

    console.log("User deleted successfully.");
    console.log('kullanici sildikten sonra session.user', session.user);
    // Başarılı yanıtla yönlendirme yap
    return Response.redirect(new URL("/login", request.url), 303);
  } catch (error) {
    console.error("Error deleting user:", error);

    // Hata durumunda yanıt dön
    return new Response(JSON.stringify({ error: "Failed to delete user." }), {
      status: 500,
    });
  }
}
