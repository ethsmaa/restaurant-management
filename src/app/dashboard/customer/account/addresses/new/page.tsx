import { UserRole } from "~/lib/enums/roles";
import { getSession } from "~/lib/session";

export default async function AddAddressPage() {
  const { user } = await getSession();

  if (!user || user.role !== UserRole.CUSTOMER) {
    return <p>Yetkisiz erişim. Burayı görmek için müşteri olmalısınız.</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-700 to-gray-900 text-white">
      <form
        action="/api/addresses"
        method="post"
        className="flex flex-col gap-4 p-4 rounded-lg shadow-lg"
      >
        <label>
          <span>Adres Başlığı</span>
          <input
            className="text-black"
            type="text"
            name="addressTitle"
            required
          />
        </label>
        <label>
          <span>Adres Detayı</span>
          <input
            className="text-black"
            type="text"
            name="addressLine"
            required
          />
        </label>
        <label>
          <span>Şehir</span>
          <input className="text-black" type="text" name="city" required />
        </label>

        <button
          type="submit"
          className="bg-blue-500 p-2 rounded hover:bg-blue-700 mt-4"
        >
          Ekle
        </button>
      </form>
    </main>
  );
}
