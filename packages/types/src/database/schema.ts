import { int, real, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const event = sqliteTable("event", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  location: text(),
  startHour: real().notNull(),
  endHour: real().notNull(),
  day: int().notNull(),
  backgroundColor: text(),
  maxSignupCount: int(),
});

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  username: text().notNull(),
  email: text().notNull(),
  role: text({
    enum: ["admin", "user"],
  }).notNull(),
});

// Create table for User _ Events
// A user can have multiple events
export const userEvents = sqliteTable(
  "user_events",
  {
    id: int().primaryKey({ autoIncrement: true }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), //That's cool, deletes user here if user gets deleted
    eventId: int()
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }), //ref to event's table
  },
  (t) => ({
    unique: unique().on(t.userId, t.eventId),
  }),
);
