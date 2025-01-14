const migrations = [
    `CREATE VIEW if not exists RestaurantOrderCounts AS
    SELECT 
        r.restaurant_id,
        r.name,
        r.address,
        r.phone,
        COUNT(o.order_id) AS order_count
    FROM 
        Restaurants r
    LEFT JOIN 
        Orders o ON r.restaurant_id = o.restaurant_id
    GROUP BY 
        r.restaurant_id
    ORDER BY 
        order_count DESC;`,
  
    `CREATE VIEW AlphabeticalRestaurants AS
    SELECT 
        restaurant_id,
        name,
        address,
        phone
    FROM 
        Restaurants
    ORDER BY 
        name ASC;`,
  
    `CREATE VIEW if not exists RestaurantRevenue AS
    SELECT 
        r.restaurant_id,
        r.name,
        r.address,
        r.phone,
        COALESCE(SUM(o.total_price), 0) AS total_revenue
    FROM 
        Restaurants r
    LEFT JOIN 
        Orders o ON r.restaurant_id = o.restaurant_id
    GROUP BY 
        r.restaurant_id
    ORDER BY 
        total_revenue DESC;`,
  ];
  
  export default migrations;
  