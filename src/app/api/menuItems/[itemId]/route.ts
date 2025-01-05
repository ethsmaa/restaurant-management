import { NextResponse } from "next/server";
import { fetchMenuItem, updateMenuItem, deleteMenuItem } from "~/services/menuItems";

// GET: Menü öğesini getir
export async function GET(request: Request, { params }: { params: { itemId: string } }) {
    try {
      // params.itemId'yi doğrudan kullan
      const itemId = Number(params.itemId);
  
      if (isNaN(itemId)) {
        return NextResponse.json({ error: "Geçersiz menü öğesi ID'si" }, { status: 400 });
      }
  
      // Service fonksiyonunu çağır
      const menuItem = await fetchMenuItem(itemId);
  
      if (!menuItem) {
        return NextResponse.json({ error: "Menü öğesi bulunamadı" }, { status: 404 });
      }
  
      return NextResponse.json(menuItem, { status: 200 });
    } catch (error) {
      console.error("Error fetching menu item:", error);
      return NextResponse.json(
        { error: "Failed to fetch menu item." },
        { status: 500 },
      );
    }
  }
// PATCH: Menü öğesini güncelle
export async function PATCH(request: Request, { params }: { params: { itemId: string } }) {
  try {
    // params.itemId'yi await et
    const itemId = Number(params.itemId);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Geçersiz menü öğesi ID'si" }, { status: 400 });
    }

    const updatedData = await request.json();

    // Service fonksiyonunu çağır
    await updateMenuItem(itemId, updatedData);

    return NextResponse.json(
      { message: "Menu item updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json(
      { error: "Failed to update menu item." },
      { status: 500 },
    );
  }
}

// DELETE: Menü öğesini sil
export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    // params.itemId'yi await et
    const itemId = Number(params.itemId);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Geçersiz menü öğesi ID'si" }, { status: 400 });
    }

    // Service fonksiyonunu çağır
    await deleteMenuItem(itemId);

    return NextResponse.json(
      { message: "Menu item deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Failed to delete menu item." },
      { status: 500 },
    );
  }
}
