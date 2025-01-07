import { type MenuItem } from "~/lib/types/menuItem";
import AddToCartButton from "~/components/basket/AddToBasketButton";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow text-center">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 font">{item.description}</p>
        <p className="text-gray-800 font-semibold text-lg mb-4">{item.price} TL</p>
        <AddToCartButton item={item} />
      </CardContent>
    </Card>
  );
}
