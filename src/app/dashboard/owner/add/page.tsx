import { UserRole } from "~/lib/enums/roles";
import { getSession } from "~/lib/session";

export default async function AddRestaurantPage() {
  const { user } = await getSession();

  if (!user || user.role !== UserRole.OWNER) {
    return (
      <p>Yetkisiz erişim. Burayi gormek icin restoran sahibi olmalisiniz.</p>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <form
        action="/api/restaurants"
        method="post"
        className="flex flex-col gap-4 rounded-lg p-4 shadow-lg"
      >
        <label>
          <span>Restoran Adi</span>
          <input className="text-black" type="text" name="name" required />
        </label>
        <label>
          <span>Adres</span>
          <input className="text-black" type="text" name="address" required />
        </label>
        <label>
          <span>Telefon No</span>
          <input className="text-black" type="string" name="phone" required />
        </label>

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 p-2 hover:bg-blue-700"
        >
          Ekle
        </button>
      </form>
    </main>
  );
}
