import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React from "react";
import { numberToTime } from "~/components/calendar";
import { FullCalendar } from "~/components/full-calendar";
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
  return (
    <div>
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
      <h1 className="text-xl font-bold my-4 text-center">Event Calendar</h1>
      <FullCalendar
        events={events}

        // onEventClick={(event) => {
        //   setClickedEvent(event);
        // }}
      />
    </div>
  );
}
