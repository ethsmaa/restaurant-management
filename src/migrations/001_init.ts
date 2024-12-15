const migrations = [
  `CREATE TABLE if not exists Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'restaurant_owner', 'admin') NOT NULL
    );`,

  `CREATE TABLE if not exists Restaurants (
      restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
      owner_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      FOREIGN KEY (owner_id) REFERENCES Users(user_id)
          ON DELETE CASCADE
    );`,

  `CREATE TABLE if not exists Menus (
      menu_id INT AUTO_INCREMENT PRIMARY KEY,
      restaurant_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(50),
      image_url TEXT,
      FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
          ON DELETE CASCADE
    );`,

  `CREATE TABLE if not exists Orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      restaurant_id INT NOT NULL,
      status ENUM('Pending', 'Preparing', 'On the Way', 'Delivered') DEFAULT 'Pending',
      total_price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(user_id)
          ON DELETE CASCADE,
      FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id)
          ON DELETE CASCADE
    );`,

  `CREATE TABLE if not exists Order_Items (
      order_item_id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      menu_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES Orders(order_id)
          ON DELETE CASCADE,
      FOREIGN KEY (menu_id) REFERENCES Menus(menu_id)
          ON DELETE CASCADE
    );`,

    // creata admin user
    `INSERT INTO Users (name, email, password, role) VALUES ('admin', 'admin@admin.com', 'admin', 'admin');`
];

export default migrations;
