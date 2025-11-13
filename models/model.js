import { Sequelize, DataTypes } from "sequelize";

console.log("--- DEBUGGING ENV VARS ---");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_PASS:", process.env.DB_PASS ? "DITERIMA" : "KOSONG/UNDEFINED");
console.log("--- END DEBUG ---");

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
