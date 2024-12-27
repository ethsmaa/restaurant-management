import { NextResponse } from 'next/server';
import { addMenuItem } from '~/services/menuItems';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const restaurantId = Number(formData.get('restaurantId'));
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const category = formData.get('category') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!restaurantId || !name || isNaN(price)) {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 },
      );
    }

    // Veritabanına menü öğesi ekleyin
    await addMenuItem(restaurantId, name, description, price, category, imageUrl);

    return NextResponse.redirect(new URL(`/dashboard/owner/${restaurantId}`, request.url));
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json({ error: 'Failed to add menu item' }, { status: 500 });
  }
}
