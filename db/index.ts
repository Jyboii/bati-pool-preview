import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

export function hasDbConfig() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME);
}

function createDatabase() {
  if (!hasDbConfig()) throw new Error("Hostinger MySQL credentials are required to access the database.");
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 5,
  });
  return drizzle({ client: pool, schema, mode: "default" });
}

let database: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
  if (!database) database = createDatabase();
  return database;
}
