import mysql from "mysql2/promise";

let cacheConnection: mysql.Connection | null = null;

export async function getConnection() {
  if (cacheConnection) {
    return cacheConnection;
  }
  try {
    const client = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "restaurant-data",
    });

    cacheConnection = client;
    return cacheConnection;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
