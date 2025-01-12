import { UserRole } from "~/lib/enums/roles";
import { getSession } from "~/lib/session";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default async function AddAddressPage() {
  const { user } = await getSession();

  if (!user || user.role !== UserRole.CUSTOMER) {
    return <p>Yetkisiz erişim. Burayı görmek için müşteri olmalısınız.</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">     
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl text-black">Yeni Adres Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/addresses" method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressTitle">Adres Başlığı</Label>
              <Input
                id="addressTitle"
                name="addressTitle"
                placeholder="Ev Adresi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine">Adres Detayı</Label>
              <Input
                id="addressLine"
                name="addressLine"
                placeholder="Sokak, mahalle, bina numarası"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Şehir</Label>
              <Input id="city" name="city" placeholder="İstanbul" required />
            </div>
            <CardFooter className="pt-6">
              <Button type="submit" className="w-full">
                Ekle
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
