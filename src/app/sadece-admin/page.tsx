import { getSession } from "~/lib/session";
import { UserRole } from "~/lib/enums/roles";
import { fetchCustomers, fetchOwners } from "~/services/users";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "~/components/ui/table";
import { Logout } from "~/components/Logout";

export default async function Page() {
  const { user } = await getSession();

  // fetch all users in the system
  const customers = await fetchCustomers();
  const owners = await fetchOwners();

  if (!user || user.role !== UserRole.ADMIN)
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-white">
        <h1 className="text-2xl font-bold">Yetkisiz erişim</h1>
      </main>
    );

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">Admin Sayfası</h1>

      {/* Customers Section */}
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Müşteriler</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-gray-600">Henüz müşteri kaydı yok.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Ad</TableCell>
                  <TableCell className="font-bold">Email</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.user_id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Owners Section */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Restoran Sahipleri</CardTitle>
        </CardHeader>
        <CardContent>
          {owners.length === 0 ? (
            <p className="text-gray-600">Henüz restoran sahibi kaydı yok.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-bold">Ad</TableCell>
                  <TableCell className="font-bold">Email</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.user_id}>
                    <TableCell>{owner.name}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Logout />
    </main>
  );
}
