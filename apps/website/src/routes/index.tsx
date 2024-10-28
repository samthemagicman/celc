import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "~/components/calendar";
import { trpc } from "~/lib/api";

let events: Awaited<ReturnType<typeof trpc.event.getAllEvents.query>> = [];

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    events = await trpc.event.getAllEvents.query();

    return { events };
  },
});

function Index() {
  return (
    <div className="p-2">
      <Calendar startHour={7} endHour={24} events={events} />
    </div>
  );
}
