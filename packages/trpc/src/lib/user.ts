import { db, eq, schema } from "@repo/database";

export const verifyOrCreateUserInDatabase = async (
  discordId: string,
  username: string,
  email: string,
) => {
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, discordId))
    .then((res) => res[0]);

  if (!user) {
    await db
      .insert(schema.users)
      .values({
        id: discordId,
        username,
        email,
        role: "user",
      })
      .execute();

    //On Creation of a User, we insert all calendar event which is default
    const defaultEvents = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.eventType, "default"));

    const userEventInserts = defaultEvents.map((event) => ({
      userId: discordId,
      eventId: event.id,
    }));

    //Insert all default events
    await db.insert(schema.userEvents).values(userEventInserts).execute();
  }
};
