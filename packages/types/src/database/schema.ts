import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const event = sqliteTable("events", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  location: text().notNull(),
  startHour: real().notNull(),
  endHour: real().notNull(),
  day: int().notNull(),
});
