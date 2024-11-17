import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { FullCalendar } from "~/components/full-calendar";
import { trpc } from "~/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    return { events: await trpc.event.getAllEvents.query() };
  },
  gcTime: 0,
  shouldReload: false,
});

function Index() {
  const { events } = useLoaderData({
    from: "/",
  });
  return (
    <div>
      <h1 className="text-xl font-bold my-4 text-center">Event Calendar</h1>
      <FullCalendar events={events} />
    </div>
  );
}
