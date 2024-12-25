import { and, count, db, eq, schema, sql } from "@repo/database";
import { z } from "zod";
import { authProcedure, router } from "../../trpc";

const events = schema.event;
const userEvents = schema.userEvents;

export const UserCalendarRouter = router({
  getPersonalCalendar: authProcedure.query(async ({ ctx }) => {
    const userId = ctx.userInfo.userId; // Get user ID through auth procedure

    const data = await ctx.db
      .select({
        event: events,
        signupCount: sql`(
        SELECT COUNT(*) 
        FROM ${userEvents} 
        WHERE ${userEvents.eventId} = ${events.id}
      )`.as("signupCount"),
      })
      .from(userEvents)
      .innerJoin(events, eq(userEvents.eventId, events.id))
      .where(eq(userEvents.userId, userId))
      .groupBy(events.id, events.title)
      .orderBy(events.title);

    const mandatoryEvents = await ctx.db
      .select({
        userId: schema.userEvents.userId,
        event: schema.event,
        signupCount: count(schema.userEvents.id),
      })
      .from(schema.event)
      .leftJoin(
        schema.userEvents,
        eq(schema.event.id, schema.userEvents.eventId),
      )
      .groupBy(schema.event.id)
      .where(eq(schema.event.mandatory, true));

    return data
      .map((event) => ({
        ...event.event,
        signupCount: event.signupCount,
      }))
      .concat(
        mandatoryEvents.map((event) => ({
          ...event.event,
          signupCount: event.signupCount,
        })),
      );
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

      // check if user can be added

      const data = await ctx.db
        .select({
          userId: schema.userEvents.userId,
          event: schema.event,
          signupCount: count(schema.userEvents.id),
        })
        .from(schema.event)
        .leftJoin(
          schema.userEvents,
          eq(schema.event.id, schema.userEvents.eventId),
        )
        .groupBy(schema.event.id)
        .where(eq(schema.event.id, eventId));

      if (data[0].event.maxSignupCount !== null) {
        if (data[0] && data[0].signupCount >= data[0].event.maxSignupCount) {
          throw new Error("Event is full");
        }
      }

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
