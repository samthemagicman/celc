import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { Calendar } from "~/components/calendar";
import {
  CalendarEventModal,
  CalendarEventModalProps,
} from "~/components/calendar/calendar-event-modal";
import { useAuth } from "~/hooks/use-auth";
import { trpc } from "~/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    return { eventData: await trpc.event.getAllEvents.query() };
  },
  gcTime: 0,
  shouldReload: false,
});

function Index() {
  const [modalError, setModalError] = React.useState<string | null>(null);
  const loggedIn = useAuth((s) => s.isLoggedIn);
  const { eventData } = useLoaderData({
    from: "/",
  });

  const [events, setEvents] = React.useState(eventData);

  function fetchEvents() {
    trpc.event.getAllEvents
      .query()
      .then(setEvents)
      .catch(() => {
        console.log("Error fetching events");
      });
  }

  const [clickedEvent, setClickedEvent] = React.useState<
    null | CalendarEventModalProps["event"]
  >(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEventInUserCalendar, setIsEventInUserCalendar] =
    React.useState<boolean>(false);

  async function addEventToCalendar() {
    setModalError(null);
    if (!clickedEvent) return;
    trpc.userEvents.addUserEvent
      .mutate({ eventId: clickedEvent.id })
      .then(() => {
        setIsEventInUserCalendar(true);
        setModalOpen(false);
        fetchEvents();
      })
      .catch((e) => {
        if (e instanceof Error) {
          setModalError(e.message);
        } else {
          setModalError("An error occurred");
        }
      });
  }

  async function removeEventFromCalendar() {
    setModalError(null);
    if (!clickedEvent) return;
    await trpc.userEvents.removeEventFromCalendar.mutate({
      eventId: clickedEvent.id,
    });
    setIsEventInUserCalendar(false);
    setModalOpen(false);
    fetchEvents();
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
    setModalError(null);
    checkEventInUserCalendar();
  }, [clickedEvent]);

  useEffect(() => {
    if (
      clickedEvent?.signupCount === clickedEvent?.maxSignupCount &&
      !isEventInUserCalendar
    ) {
      setModalError("Event is full");
    } else {
      setModalError(null);
    }
  }, [clickedEvent, isEventInUserCalendar]);

  return (
    <div>
      <CalendarEventModal
        error={modalError ?? undefined}
        addButtonDisabled={
          clickedEvent?.signupCount === clickedEvent?.maxSignupCount
        }
        event={clickedEvent}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRemoveEventFromCalendar={removeEventFromCalendar}
        onAddEventToCalendar={addEventToCalendar}
        showAddButton={!isEventInUserCalendar && loggedIn}
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
