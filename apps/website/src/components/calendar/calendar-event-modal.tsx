import { PersonIcon } from "@radix-ui/react-icons";
import { DatabaseEvent } from "@repo/types/database";
import Alert from "../ui/alert";
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

export type CalendarEventModalProps = {
  event: (DatabaseEvent & { signupCount?: number }) | null;
  isOpen: boolean;
  onRequestClose: () => void;
  onRemoveEventFromCalendar: () => void;
  onAddEventToCalendar: () => void;
  showRemoveButton?: boolean;
  showAddButton?: boolean;
  addButtonDisabled?: boolean;
  error?: string;
};

export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  event,
  isOpen,
  onRequestClose,
  onRemoveEventFromCalendar,
  onAddEventToCalendar,
  showAddButton,
  showRemoveButton,
  error,
  addButtonDisabled,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{event?.title}</ModalTitle>
          <div className="space-y-1">
            <div className="text-sm">
              <p>
                {numberToTime(event?.startHour ?? 0, true)} -{" "}
                {numberToTime(event?.endHour ?? 0, true)}
              </p>
              <p>{event?.location}</p>
            </div>
            {event?.maxSignupCount && (
              <p className="text-sm flex items-center gap-1">
                <PersonIcon /> {event.signupCount}/{event.maxSignupCount} seats
              </p>
            )}
          </div>
        </ModalHeader>
        <ModalBody>
          <p>{event?.description}</p>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-3 justify-end items-center">
            {showAddButton && (
              <Button
                onClick={onAddEventToCalendar}
                disabled={addButtonDisabled}
              >
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

          {!showAddButton && !showRemoveButton && (
            <p className="text-muted-foreground text-sm italic mt-4">
              Login to add this event to your calendar.
            </p>
          )}

          {error && (
            <Alert variant="error" className="mt-3">
              {error}
            </Alert>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
