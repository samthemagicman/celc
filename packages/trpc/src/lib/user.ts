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
  }
};
