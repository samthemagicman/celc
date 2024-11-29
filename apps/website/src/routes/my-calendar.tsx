import { DatabaseEvent } from "@repo/types/database";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { Calendar } from "~/components/calendar";
import { CalendarEventModal } from "~/components/calendar/calendar-event-modal";
import { trpc } from "~/lib/api";

type Event = DatabaseEvent;

export const Route = createFileRoute("/my-calendar")({
  component: MyCalendar,
  loader: async () => {
    return { events: await trpc.userEvents.getPersonalCalendar.query() };
  },
  gcTime: 0,
  shouldReload: false,
});

function MyCalendar() {
  const loaderData = useLoaderData({
    from: "/my-calendar",
  });
  const [events, setEvents] = useState<Event[]>(loaderData.events);
  const [clickedEvent, setClickedEvent] = React.useState<
    null | (typeof events)[0]
  >(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    setEvents(loaderData.events);
  }, [loaderData.events]);

  async function removeEventFromCalendar() {
    if (!clickedEvent) return;
    await trpc.userEvents.removeEventFromCalendar.mutate({
      eventId: clickedEvent.id,
    });
    // Remove the event from the local state
    setEvents((prev) => prev.filter((event) => event.id !== clickedEvent.id));
    setModalOpen(false);
  }

  return (
    <div>
      <CalendarEventModal
        event={clickedEvent}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRemoveEventFromCalendar={() => removeEventFromCalendar()}
        onAddEventToCalendar={() => {}} //this is null cause we won't add event from my-calendar
        showRemoveButton={true}
      />
      <h1 className="text-xl font-bold my-4 text-center">Personal Calendar</h1>
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
