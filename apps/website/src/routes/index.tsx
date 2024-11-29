import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React, { useEffect } from "react";
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
  const [isEventInUserCalendar, setIsEventInUserCalendar] =
    React.useState<boolean>(false);

  async function addEventToCalendar() {
    if (!clickedEvent) return;
    await trpc.userEvents.addUserEvent.mutate({ eventId: clickedEvent.id });
    setIsEventInUserCalendar(true);
    setModalOpen(false);
  }

  async function removeEventFromCalendar() {
    if (!clickedEvent) return;
    await trpc.userEvents.removeEventFromCalendar.mutate({
      eventId: clickedEvent.id,
    });
    setIsEventInUserCalendar(false);
    setModalOpen(false);
  }

  async function checkEventInUserCalendar() {
    if (!clickedEvent) return;
    trpc.userEvents.isEventInUserCalendar
      .query({
        eventId: clickedEvent.id,
      })
      .then(setIsEventInUserCalendar)
      .catch(() => {
        console.log("Error checking event in user calendar");
        setIsEventInUserCalendar(false);
      });
  }

  useEffect(() => {
    checkEventInUserCalendar();
  }, [clickedEvent]);

  return (
    <div>
      <CalendarEventModal
        event={clickedEvent}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRemoveEventFromCalendar={removeEventFromCalendar}
        onAddEventToCalendar={addEventToCalendar} //this is null cause we won't add event from my-calendar
        showAddButton={!isEventInUserCalendar}
        showRemoveButton={isEventInUserCalendar}
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
