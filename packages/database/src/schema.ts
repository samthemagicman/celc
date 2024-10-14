import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text(),
  location: text(),
  startHour: real(),
  endHour: real(),
  day: int(),
});
