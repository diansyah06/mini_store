import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // baca variabel dari file .env

const sequelize = new Sequelize(
  process.env.DB_NAME || "mini_store",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "root",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3307, // default lokal
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL database");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database");
    console.error(err);
  });

export { sequelize, DataTypes };
