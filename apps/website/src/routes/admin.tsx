import { DatabaseEvent } from "@repo/types/database";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, CalendarEvent } from "~/components/calendar";
import { AddEventModal } from "~/components/ui/admin/add-event-modal";
import { EditEventModal } from "~/components/ui/admin/edit-event-modal";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/use-auth";
import { trpc } from "~/lib/api";
import { cn } from "~/lib/utils";

type Event = DatabaseEvent;

export const Route = createFileRoute("/admin")({
  component: MainComponent,
  loader: async () => {
    const auth = useAuth.getState().userInfo;
    if (!auth || auth.role !== "admin") {
      throw redirect({
        to: "/",
      });
    }
    const events = await trpc.event.getAllEvents.query();
    return { events };
  },
});

function MainComponent() {
  const db = Route.useLoaderData();
  const [inPreview, setInPreview] = useState(false);
  const [unsavedEvents, setUnsavedEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [deletedEvents, setDeletedEvents] = useState<Event[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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

  async function updateEvent(eventData: Event) {
    await trpc.event.update.mutate(eventData);
    window.location.reload();
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
      <AddEventModal
        modalIsOpen={isAddEventModalOpen}
        onRequestClose={() => {
          setIsAddEventModalOpen(false);
        }}
        onEventAdded={addEventToPreview}
      />
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          modalIsOpen={true}
          onRequestClose={() => {
            setEditingEvent(null);
          }}
          onSave={(data) => {
            updateEvent(data);
          }}
        />
      )}

      <div className="w-full flex p-3 gap-3 items-center bg-gray-100">
        <h1 className="text-xl font-bold">
          {" "}
          {inPreview ? "Previewing" : "Editing"} Calendar
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
          Preview Mode
        </Button>
        <Button variant="outline" onClick={() => setIsAddEventModalOpen(true)}>
          Add Event
        </Button>
        <Button onClick={saveEvents}>Save Changes</Button>
      </div>
      <hr />
      <Calendar
        events={events}
        onEventClick={(event) => {
          if (inPreview) return;
          setEditingEvent(event);
          // if (unsavedEvents.includes(event)) {
          //   setUnsavedEvents(unsavedEvents.filter((e) => e !== event));
          // } else if (deletedEvents.includes(event)) {
          //   setDeletedEvents(deletedEvents.filter((e) => e !== event));
          // } else {
          //   setDeletedEvents([...deletedEvents, event]);
          // }
        }}
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
