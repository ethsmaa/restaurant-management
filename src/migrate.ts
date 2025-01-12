import mysql from "mysql2/promise";

import migrations001 from "./migrations/001_init";
import migrations002 from "./migrations/002_views";

const allMigrations = [migrations001, migrations002];

async function getConnection() {
  try {
    const client = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "restaurant-data",
    });

    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function run() {
  const client = await getConnection();
  console.log("Connected to database");

  try {
    for (const migration of allMigrations) {
      for (const query of migration) {
        try {
          await client.query(query);
        } catch (error) {
          console.error("Error executing query: ", query);
          console.error(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

run()
  .then(() => {
    console.log("Migrations executed successfully");
    process.exit(0);
  })
  .catch(console.error);
