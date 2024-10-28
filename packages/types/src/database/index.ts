import * as schema from "./schema";

export type EventInsert = typeof schema.event.$inferInsert;

export type DatabaseEvent = typeof schema.event.$inferSelect;

export { schema };
