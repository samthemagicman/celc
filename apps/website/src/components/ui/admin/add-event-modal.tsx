import { DatabaseEvent } from "@repo/types/database";
import { CalendarCheck, CalendarX } from "lucide-react";
import React, { useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "~/../tailwind.config";
import { Button } from "~/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalProps,
  ModalTitle,
} from "~/components/ui/modal";
import { cn } from "~/lib/utils";
const config = resolveConfig(tailwindConfig);
type Event = DatabaseEvent;

type AddEventProps = {
  onEventAdded?: (event: Event) => void;
  onRequestClose: ModalProps["onRequestClose"];
  modalIsOpen: ModalProps["isOpen"];
};

const timeOptions = getTimeOptions(7, 24, 0.25);

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

export const AddEventModal: React.FC<AddEventProps> = ({
  onEventAdded,
  ...modalProps
}) => {
  //States for the form inputs
  //Format: var to hold current value, function to be called to update it, useState is init state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState("7:30 A.M.");
  const [endTime, setEndTime] = useState("8:30 A.M.");
  const [location, setLocation] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FF4E13"); // Default color
  const [maxSignupCount, setMaxSignupCount] = useState<number | null>(null);
  const [mandatory, setMandatory] = useState(false);
  //#FF4E13
  //Availble Day Options
  const dayOptions = [
    { day: 0, label: "Day 1 - Wednesday" },
    { day: 1, label: "Day 2 - Thursday" },
    { day: 2, label: "Day 3 - Friday" },
    { day: 3, label: "Day 4 - Saturday" },
    { day: 4, label: "Day 5 - Sunday" },
    { day: 5, label: "Day 6 - Monday" },
    { day: 6, label: "Day 7 - Tuesday" },
  ];
  //Available Colors
  //Include Names of the colors
  //And do bckground text thing
  const colorOptions = Object.values(config.theme.colors.calendarBackground);

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

  const resetForm = () => {
    //Reset fields
    setTitle("");
    setDescription("");
    setStartTime("7:30 A.M.");
    setEndTime("8:30 A.M.");
    setLocation("");
    setDay(0);
    setMaxSignupCount(0);
    setMandatory(false);
  };

  //Creation of an event
  const createEvent = async () => {
    try {
      // Validate that the start time is earlier than the end time
      if (calculateRealTime(startTime) >= calculateRealTime(endTime)) {
        alert("Start time must be earlier than end time.");
        return; // Exit the function if validation fails
      }

      onEventAdded?.({
        backgroundColor,
        day,
        description,
        endHour: calculateRealTime(endTime),
        location,
        startHour: calculateRealTime(startTime),
        id: 0,
        title,
        maxSignupCount: maxSignupCount,
        mandatory: mandatory,
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
              <ModalTitle>Create Event</ModalTitle>
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

              <div>
                <label htmlFor="day">Max Signup Count</label>
                <input
                  type="number"
                  value={maxSignupCount ?? undefined}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setMaxSignupCount(null);
                    } else {
                      setMaxSignupCount(parseInt(e.target.value));
                    }
                  }}
                  className="p-2 border border-gray-300 rounded w-full"
                />
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
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="mandatory">Mandatory:</label>
                <input
                  id="mandatory"
                  name="mandatory"
                  type="checkbox"
                  checked={mandatory}
                  onChange={(e) => setMandatory(e.target.checked)}
                />
              </div>

              <label>
                Background Color:
                <div className="flex space-x-2 mt-2 items-stretch" about="test">
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
                  Submit
                </Button>
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() => {
                    modalProps.onRequestClose?.();
                    resetForm();
                  }}
                  className="flex gap-3 w-full"
                >
                  <CalendarX />
                  Cancel
                </Button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
