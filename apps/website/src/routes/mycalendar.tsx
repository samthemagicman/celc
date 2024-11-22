import { DatabaseEvent } from "@repo/types/database";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState } from "react";
import { CalendarEventModal } from "~/components/calendar/calendar-event-modal";
import { CalendarCheck, CalendarX } from "lucide-react";
import { Calendar, CalendarEvent } from "~/components/calendar";
import { Button } from "~/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "~/components/ui/modal";
import { trpc } from "~/lib/api";
import { cn } from "~/lib/utils";


type Event = DatabaseEvent;

export const Route = createFileRoute("/mycalendar")({
  component: MyCalendar,
  loader: async () => {
    return { events: await trpc.event.getAllEvents.query() };
  },
  gcTime: 0,
  shouldReload: false,
});

function MyCalendar() {
  const db = Route.useLoaderData();
  // We set in preview to true for user to see their current calendar
  const [inPreview, setInPreview] = useState(true);
  const [unsavedEvents, setUnsavedEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [deletedEvents, setDeletedEvents] = useState<Event[]>([]);
  const [clickedEvent, setClickedEvent] = React.useState<null | (typeof events)[0]>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const events = useMemo(() => {
    if (inPreview) {
      return [...savedEvents, ...unsavedEvents].filter(
        (e) => !deletedEvents.includes(e),
      );
    }
    return [...savedEvents, ...unsavedEvents];
  }, [savedEvents, unsavedEvents, deletedEvents, inPreview]);

  useEffect(() => {
    setSavedEvents(db.events);
  }, [db]);

  function addEventToPreview(event: Event) {
    event.id = unsavedEvents.length;
    setUnsavedEvents((prevEvents) => [...prevEvents, event]);
  }

  async function saveEvents() {
    for (const event of unsavedEvents) {
      await trpc.event.create.mutate({
        ...event,
        id: undefined,
      });
    }
    for (const event of deletedEvents) {
      const inSavedEvents = savedEvents.find((e) => e === event);
      if (inSavedEvents) {
        await trpc.event.delete.mutate({
          id: event.id,
        });
      }
    }

    setSavedEvents(
      [...savedEvents, ...unsavedEvents].filter(
        (e) => !deletedEvents.includes(e),
      ),
    );
    setUnsavedEvents([]);
    setDeletedEvents([]);
  }

  return (
    <div>
        <CalendarEventModal
          event={clickedEvent}
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
      />
      <div className="w-full flex p-3 gap-3 items-center bg-gray-100">
        <h1 className="text-xl font-bold">
          {" "}
          {inPreview ? "" : "Editing"} Calendar
        </h1>
        <div className="flex-1"></div>
        <Button
          variant="secondary"
          className={cn({
            "bg-blue-600 hover:bg-blue-500 text-primary-foreground": inPreview,
          })}
          onClick={() => {
            setInPreview(!inPreview);
          }}
        >
          {inPreview ? "Edit Mode" : "Preview"}
        </Button>
        {/* <AddEvent onEventAdded={addEventToPreview} /> */}
        <Button onClick={saveEvents}>Save Changes</Button>
      </div>
      <hr />
      
      <Calendar
        events={events}
        onEventClick={(event) => {
          if (inPreview){
              //Open modal when in preview mode
              setClickedEvent(event);
              setModalOpen(true);
          }else if (unsavedEvents.includes(event)) {
            setUnsavedEvents(unsavedEvents.filter((e) => e !== event));
          } else if (deletedEvents.includes(event)) {
            setDeletedEvents(deletedEvents.filter((e) => e !== event));
          } else {
            setDeletedEvents([...deletedEvents, event]);
          }
        }
      }
        renderEvent={
          !inPreview
            ? (event, props) => {
                return (
                  <CalendarEvent
                    {...props}
                    className={cn({
                      "bg-red-500 rounded-sm": deletedEvents.includes(event),
                    })}
                    buttonClassName={cn({
                      "opacity-60 bg-green-500":
                        unsavedEvents.includes(event) ||
                        deletedEvents.includes(event),
                    })}
                  />
                );
              }
            : undefined
        }
      />
    </div>
  );
}
//What are we creating?
// //Page where events can be added 
// function MainComponent() {
//   const db = Route.useLoaderData();
//   const [addEvent,setAddedEvents] = useState<Event[]>([]);
//   const [removeEvent, setRemovedEvents] = useState<Event[]>([])

//   // db.users = 
