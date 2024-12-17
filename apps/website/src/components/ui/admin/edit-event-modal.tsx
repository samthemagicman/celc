import { DatabaseEvent } from "@repo/types/database";
import { CalendarCheck, CalendarX } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from "~/components/ui/modal";
import { cn } from "~/lib/utils";

const dayOptions = [
  { day: 0, label: "Day 1 - Wednesday" },
  { day: 1, label: "Day 2 - Thursday" },
  { day: 2, label: "Day 3 - Friday" },
  { day: 3, label: "Day 4 - Saturday" },
  { day: 4, label: "Day 5 - Sunday" },
  { day: 5, label: "Day 6 - Monday" },
  { day: 6, label: "Day 7 - Tuesday" },
];

//Available Time Options
const timeOptions = getTimeOptions(7, 24, 0.25);
//Available Colors
//Include Names of the colors
//And do bckground text thing
const colorOptions = [
  "#FF4E13",
  "#FF9A31",
  "#FFDE59",
  "#0047A3",
  "#74B3FB",
  "#C3326C",
  "#222222",
  "#EDEDED",
];

function getTimeOptions(from: number, to: number, interval: number) {
  const options = [];
  for (let i = from; i <= to; i += interval) {
    options.push(floatToRealTime(i));
  }
  return options;
}

// e.g. 7.5 -> "7:30 A.M."
function floatToRealTime(timeFloat: number): string {
  if (timeFloat < 0 || timeFloat > 24) {
    throw new Error("Invalid float value. Expected a value between 0 and 24.");
  }

  if (timeFloat === 24) {
    return "12:00 A.M.";
  }

  const hour24 = Math.floor(timeFloat);
  const minute = Math.round((timeFloat - hour24) * 60);

  const period = hour24 < 12 ? "A.M." : "P.M.";
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;

  // Format minutes to always be two digits
  const minuteStr = minute.toString().padStart(2, "0");

  return `${hour12}:${minuteStr} ${period}`;
}

const calculateRealTime = (time: string) => {
  const [hourMin, period] = time.split(" "); //split hour and am/pm, tokenization
  const [hour, minute] = hourMin.split(":").map(Number); //grabs hr : min
  let displayHour = hour;

  if (period === "A.M." && hour === 12) {
    displayHour = 0;
  }
  if (period === "P.M." && hour !== 12) {
    displayHour = hour + 12;
  }

  //Convert to real nums
  return displayHour + minute / 60;
};

type Event = DatabaseEvent;

type EditEventProps = {
  onSave?: (event: Event) => void;
  onRequestClose: ModalProps["onRequestClose"];
  modalIsOpen: ModalProps["isOpen"];
  event: Event;
};
export const EditEventModal: React.FC<EditEventProps> = ({
  onSave,
  event,
  ...modalProps
}) => {
  //States for the form inputs
  //Format: var to hold current value, function to be called to update it, useState is init state
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [day, setDay] = useState(event.day);
  const [startTime, setStartTime] = useState(floatToRealTime(event.startHour));
  const [endTime, setEndTime] = useState(floatToRealTime(event.endHour));
  const [location, setLocation] = useState(event.location || "");
  const [backgroundColor, setBackgroundColor] = useState(
    event.backgroundColor ?? colorOptions[0],
  ); // Default color
  //#FF4E13
  //Availble Day Options

  const resetForm = () => {
    //Reset fields
    setTitle("");
    setDescription("");
    setStartTime("7:30 A.M.");
    setEndTime("8:30 A.M.");
    setLocation("");
    setDay(0);
  };

  //Creation of an event
  const createEvent = async () => {
    try {
      // Validate that the start time is earlier than the end time
      if (calculateRealTime(startTime) >= calculateRealTime(endTime)) {
        alert("Start time must be earlier than end time.");
        return; // Exit the function if validation fails
      }

      onSave?.({
        backgroundColor,
        day,
        description,
        endHour: calculateRealTime(endTime),
        location,
        startHour: calculateRealTime(startTime),
        id: event.id,
        title,
      });

      //Reset
      modalProps.onRequestClose?.();
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div>
      {/* Button for opening the widget */}

      {/* Pop-Up Structure */}
      {modalProps.modalIsOpen && (
        <Modal
          isOpen={modalProps.modalIsOpen}
          onRequestClose={() => {
            modalProps.onRequestClose?.();
            resetForm();
            modalProps.onRequestClose?.();
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Update Event</ModalTitle>
            </ModalHeader>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                createEvent();
              }}
            >
              <div>
                <label htmlFor="title">Title:</label>
                <input
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div>
                <label htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full max-h-52"
                />
              </div>

              <div>
                <label htmlFor="day">Select Event Day:</label>
                <select
                  name="day"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value))}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                >
                  {dayOptions.map(({ day, label }) => (
                    <option key={day} value={day}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="flex-1 mr-2" htmlFor="startTime">
                    Start Time:
                  </label>
                  <select
                    name="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="flex-1 ml-2" htmlFor="endTime">
                    End Time:
                  </label>
                  <select
                    name="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="p-2 border border-gray-300 rounded w-full"
                  >
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location">Location:</label>
                <input
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>
              <label>
                Background Color:
                <div className="flex space-x-2 mt-2 items-stretch">
                  {colorOptions.map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={cn(
                        `cursor-pointer flex-1 rounded-md h-8`,
                        backgroundColor === color
                          ? "border-2 border-black"
                          : "border-2 border-white",
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </label>

              <div className="modal-actions flex justify-between items-stretch gap-3">
                <Button type="submit" className="flex gap-3 w-full">
                  <CalendarCheck />
                  Update
                </Button>
                <Button
                  variant={"destructive"}
                  type="button"
                  onClick={() => {
                    modalProps.onRequestClose?.();
                    resetForm();
                  }}
                  className="flex gap-3 w-full"
                >
                  <CalendarX />
                  Delete
                </Button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
