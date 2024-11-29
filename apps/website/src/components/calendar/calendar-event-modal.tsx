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
  // userLoggedIn: boolean;
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

{
  /*edit calendar icon
   <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15v3c0 .5523.44772 1 1 1h10.5M3 15v-4m0 4h11M3 11V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v5M3 11h18m0 0v1M8 11v8m4-8v8m4-8v2m1.8956 5.9528 1.5047-1.5047m0 0 1.5048-1.5048m-1.5048 1.5048 1.4605 1.4604m-1.4605-1.4604-1.4604-1.4605"/>
</svg>
   */
}
