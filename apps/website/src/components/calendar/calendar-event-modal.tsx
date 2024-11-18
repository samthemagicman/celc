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
};
export const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  event,
  isOpen,
  onRequestClose,
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
          <Button onClick={onRequestClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
