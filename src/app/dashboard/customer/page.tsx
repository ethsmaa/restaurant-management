import { fetchAllRestaurants } from "~/services/restaurants";

export default async function CustomerDashboard() {
    const restaurants = await fetchAllRestaurants();
    
    return (
        <div>
        <h1>Restoranlar</h1>
    
        <ul>
            {restaurants.map((restaurant) => (
            <li key={restaurant.restaurant_id}>
                <a href={`/${restaurant.restaurant_id}`}>
                {restaurant.name} - {restaurant.address}
                </a>
            </li>
            ))}
        </ul>
        </div>
    );
    }
