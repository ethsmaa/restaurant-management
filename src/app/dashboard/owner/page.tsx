// server side component async calisiyo 
// burada api methdolarina gerekm yok dogrudan fetchRestaurants kullaniyoruz.
import { fetchRestaurants } from "~/services/restaurants";

export default async function OwnerDashboard() {
  try {
    const restaurants = await fetchRestaurants();

    return (
      <div>
        <h1>Restoran Yönetimi</h1>

        {restaurants.length === 0 ? (
          <div>
            <p>Henüz bir restoranınız yok. Yeni bir restoran eklemek için aşağıdaki butona tıklayın.</p>
            <a href="/dashboard/owner/add">
              <button>Yeni Restoran Ekle</button>
            </a>
          </div>
        ) : (
          <div>
            <ul>
              {restaurants.map((restaurant) => (
                <li key={restaurant.restaurant_id}>
                  <a href={`/dashboard/owner/${restaurant.restaurant_id}`}>
                    {restaurant.name} - {restaurant.address}
                  </a>
                </li>
              ))}
            </ul>
            <a href="/dashboard/owner/add">
              <button>Yeni Restoran Ekle</button>
            </a>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p>Yetkisiz erişim. Lütfen giriş yapınız.</p>;
  }
}
