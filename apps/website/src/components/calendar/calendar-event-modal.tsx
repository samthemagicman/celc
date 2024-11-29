import { DatabaseEvent } from "@repo/types/database";
import { Button } from "../ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../ui/modal";
import { numberToTime } from "./calendar-column";

type CalendarEventModalProps = {
  event: DatabaseEvent | null;
  isOpen: boolean;
  onRequestClose: () => void;
  onRemoveEventFromCalendar: () => void;
  onAddEventToCalendar: () => void;
  showRemoveButton?: boolean;
  showAddButton?: boolean;
};

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  event,
  isOpen,
  onRequestClose,
  onRemoveEventFromCalendar,
  onAddEventToCalendar,
  showAddButton,
  showRemoveButton,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{event?.title}</ModalTitle>
          <div className="text-sm">
            <p>
              {numberToTime(event?.startHour ?? 0, true)} -{" "}
              {numberToTime(event?.endHour ?? 0, true)}
            </p>
            <p>{event?.location}</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <p>{event?.description}</p>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            {showAddButton && (
              <Button onClick={onAddEventToCalendar}>
                Add To Your Calendar
              </Button>
            )}
            {showRemoveButton && (
              <Button onClick={onRemoveEventFromCalendar}>
                Remove From Your Calendar
              </Button>
            )}
            <Button
              onClick={onRequestClose}
              variant={
                showRemoveButton || showAddButton ? "secondary" : "default"
              }
            >
              Close
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
