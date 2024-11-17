import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Calendar, numberToTime } from "~/components/calendar";
import { Button } from "~/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "~/components/ui/modal";
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
  const [clickedEvent, setClickedEvent] = React.useState<
    null | (typeof events)[0]
  >(null);
  return (
    <div className="p-2">
      <Modal
        isOpen={clickedEvent !== null}
        onRequestClose={() => {
          setClickedEvent(null);
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{clickedEvent?.title}</ModalTitle>
            <div className="text-sm">
              <p>
                {numberToTime(clickedEvent?.startHour || 0, true)} -{" "}
                {numberToTime(clickedEvent?.endHour || 0, true)}
              </p>
              <p>{clickedEvent?.location}</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>{clickedEvent?.description}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                setClickedEvent(null);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Calendar
        startHour={7}
        endHour={24}
        events={events}
        onEventClick={(event) => {
          setClickedEvent(event);
        }}
      />
    </div>
  );
}
