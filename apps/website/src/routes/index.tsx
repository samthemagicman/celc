import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React from "react";
import { Calendar } from "~/components/calendar";
import { CalendarEventModal } from "~/components/calendar/calendar-event-modal";
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
  const [clickedEvent, setClickedEvent] = React.useState<
    null | (typeof events)[0]
  >(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <div>
      <CalendarEventModal
        event={clickedEvent}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
      />
      <h1 className="text-xl font-bold my-4 text-center">Event Calendar</h1>
      <Calendar
        events={events}
        onEventClick={(event) => {
          setClickedEvent(event);
          setModalOpen(true);
        }}
      />
    </div>
  );
}
