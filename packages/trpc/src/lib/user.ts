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

    //On Creation of a User, we inser first calendar event as default test
    const firstEvent = await db
      .select()
      .from(schema.event)
      .limit(1)
      .then((res) => res[0]);

    await db
      .insert(schema.userEvents)
      .values({
        userId: discordId,
        eventId: firstEvent.id, //No events was created user
      })
      .execute();
  }

  return user;
};
