import { eq } from "@repo/database";
import { EventInsert, schema } from "@repo/types/database";
import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../../trpc";

const CreateEventInput = z.custom<EventInsert>();
const DeleteEventInput = z.object({
  id: z.custom<NonNullable<EventInsert["id"]>>(),
});

// Define input schema for updating an event
const UpdateEventInput = z.object({
  id: z.custom<NonNullable<EventInsert["id"]>>(),
  title: z.string().optional(),
  description: z.string().optional(),
  day: z.number().optional(),
  startHour: z.number().optional(),
  endHour: z.number().optional(),
  location: z.string().optional(),
  backgroundColor: z.string().optional(),
  //this is for custom color
});

export const eventRouter = router({
  create: adminProcedure
    .input(CreateEventInput)
    .mutation(async ({ ctx, input }) => {
      const inserted = await ctx.db
        .insert(schema.event)
        .values(input)
        .returning();
      return inserted[0].id;
    }),
  delete: adminProcedure
    .input(DeleteEventInput)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.delete(schema.event).where(eq(schema.event.id, input.id));
    }),
  update: adminProcedure
    .input(UpdateEventInput)
    .mutation(async ({ input, ctx }) => {
      // Update the event with the specified ID using the provided data
      await ctx.db
        .update(schema.event)
        .set({
          title: input.title,
          description: input.description,
          day: input.day,
          startHour: input.startHour,
          endHour: input.endHour,
          location: input.location,
        })
        .where(eq(schema.event.id, input.id));
    }),
  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.event);
  }),

  deleteAllEvents: adminProcedure.mutation(async ({ ctx }) => {
    // Deletes all events without any conditions
    await ctx.db.delete(schema.event);
  }),
});
