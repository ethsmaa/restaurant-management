import { UserRole } from "~/lib/enums/roles";
import { getSession } from "~/lib/session";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default async function AddRestaurantPage() {
  const { user } = await getSession();

  if (!user || user.role !== UserRole.OWNER) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 text-center">
        <p className="text-xl font-semibold text-gray-700">
          Unauthorized access. You must be a restaurant owner to view this page.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-700">
            Add Restaurant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action="/api/restaurants"
            method="post"
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restaurant Name
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Input
                type="text"
                name="address"
                placeholder="Restaurant Address"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="mt-4 w-full">
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
