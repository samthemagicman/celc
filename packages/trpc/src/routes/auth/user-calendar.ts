import { and, db, eq, schema } from "@repo/database";
import { z } from "zod";
import { authProcedure, router } from "../../trpc";

export const UserCalendarRouter = router({
  getPersonalCalendar: authProcedure.query(async ({ ctx }) => {
    const userId = ctx.userInfo.userId; // Get user ID through auth procedure

    // Fetch all event IDs for the logged-in user
    const eventIds = await db
      .select()
      .from(schema.event)
      .leftJoin(
        schema.userEvents,
        eq(schema.event.id, schema.userEvents.eventId),
      )
      .where(eq(schema.userEvents.userId, userId));

    const events = eventIds.map((userEvent) => userEvent.event); // Correct variable name

    return events;
  }),

  removeEventFromCalendar: authProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userInfo.userId;
      const eventId = Number(input.eventId); // Convert eventId to a number

      // Now delete the user-event
      await db
        .delete(schema.userEvents)
        .where(
          and(
            eq(schema.userEvents.userId, userId),
            eq(schema.userEvents.eventId, eventId),
          ),
        );

      return { success: true, message: "Event removed successfully" }; // Fix typo in "success"
    }),

  addUserEvent: authProcedure
    .input(z.object({ eventId: z.number() })) // Event ID input
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userInfo.userId;
      const eventId = Number(input.eventId); // Convert eventId to a number

      // Insert a new record into the userEvents table
      await db.insert(schema.userEvents).values({
        userId: userId,
        eventId: eventId,
      });
    }),

  // if true means, event in user,
  isEventInUserCalendar: authProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.userInfo.userId;
      const eventId = input.eventId;

      const userEvent = await db
        .select()
        .from(schema.userEvents)
        .where(
          and(
            eq(schema.userEvents.userId, userId),
            eq(schema.userEvents.eventId, eventId),
          ),
        )
        .limit(1);
      return userEvent.length > 0;
    }),
});
