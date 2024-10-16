import { eq } from "@repo/database";
import { EventInsert, schema } from "@repo/types/database";
import { z } from "zod";
import { adminProcedure, router } from "../../trpc";

const CreateEventInput = z.custom<EventInsert>();
const DeleteEventInput = z.object({
  id: z.custom<NonNullable<EventInsert["id"]>>(),
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
  getAllEvents: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(schema.event);
  }),
});
