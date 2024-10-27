import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const event = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  location: text().notNull(),
  startHour: real().notNull(),
  endHour: real().notNull(),
  day: int().notNull(),
});
