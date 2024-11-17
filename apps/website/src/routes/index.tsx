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
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
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
                setModalOpen(false);
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
        onEventClick={(event) => {
          setClickedEvent(event);
          setModalOpen(true);
        }}
      />
    </div>
  );
}
