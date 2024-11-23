import { authProcedure, router } from "../../trpc";
import { db, eq, schema } from "@repo/database";

export const UserCalendarRouter = router({
  getPersonalCalendar: authProcedure.query(async ({ ctx }) => {
    const userId = ctx.userInfo.userId; //We get userid through auth proc

    //Now Fetch all event ids for logged user
    const eventIds = await db
      .select()
      .from(schema.event)
      .leftJoin(
        schema.userEvents,
        eq(schema.event.id, schema.userEvents.eventId),
      )
      .where(eq(schema.userEvents.userId, userId));

    const event = eventIds.map((userEvents) => userEvents.event);

    return event;
  }),
});
