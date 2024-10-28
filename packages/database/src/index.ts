import { createClient } from "@libsql/client";
// import "dotenv/config";
import { schema } from "@repo/types/database";
import { drizzle } from "drizzle-orm/libsql";

if (!process.env.DB_LOCATION) {
  throw new Error("DB_LOCATION is not set");
}

const client = createClient({ url: process.env.DB_LOCATION });
const db = drizzle(client);
export * from "drizzle-orm";
export { client, db, schema };
