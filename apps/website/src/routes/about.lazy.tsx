import { createLazyFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/api";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  //States for the form inputs
  //Format: var to hold current value, function to be called to update it, useState is init state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(0);
  const [startTime, setStartTime] = useState("7:30 A.M.");
  const [endTime, setEndTime] = useState("8:30 A.M.");
  const [location, setLocation] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FF4E13"); // Default color
  //#FF4E13
  //Availble Day Options
  const dayOptions = [
    { day: 0, label: "Day 0 - Wednesday" },
    { day: 1, label: "Day 1 - Thursday" },
    { day: 2, label: "Day 2 - Friday" },
    { day: 3, label: "Day 3 - Saturday" },
    { day: 4, label: "Day 4 - Sunday" },
    { day: 5, label: "Day 5 - Monday" },
    { day: 6, label: "Day 6 - Tuesday" },
  ];

  //Available Time Options
  const timeOptions = [
    "7:00 A.M.",
    "7:30 A.M.",
    "7:45 A.M.",
    "8:00 A.M.",
    "8:15 A.M.",
    "8:30 A.M.",
    "8:45 A.M.",
    "9:00 A.M.",
    "9:15 A.M.",
    "9:30 A.M.",
    "9:45 A.M.",
    "10:00 A.M.",
    "10:15 A.M.",
    "10:30 A.M.",
    "10:45 A.M.",
    "11:00 A.M.",
    "11:15 A.M.",
    "11:30 A.M.",
    "11:45 A.M.",
    "12:00 P.M.",
    "12:15 P.M.",
    "12:30 P.M.",
    "12:45 P.M.",
    "1:00 P.M.",
    "1:15 P.M.",
    "1:30 P.M.",
    "1:45 P.M.",
    "2:00 P.M.",
    "2:15 P.M.",
    "2:30 P.M.",
    "2:45 P.M.",
    "3:00 P.M.",
    "3:15 P.M.",
    "3:30 P.M.",
    "3:45 P.M.",
    "4:00 P.M.",
    "4:15 P.M.",
    "4:30 P.M.",
    "4:45 P.M.",
    "5:00 P.M.",
    "5:15 P.M.",
    "5:30 P.M.",
    "5:45 P.M.",
    "6:00 P.M.",
    "6:15 P.M.",
    "6:30 P.M.",
    "6:45 P.M.",
    "7:00 P.M.",
    "7:15 P.M.",
    "7:30 P.M.",
    "7:45 P.M.",
    "8:00 P.M.",
    "8:15 P.M.",
    "8:30 P.M.",
    "8:45 P.M.",
    "9:00 P.M.",
    "9:15 P.M.",
    "9:30 P.M.",
    "9:45 P.M.",
    "10:00 P.M.",
    "10:15 P.M.",
    "10:30 P.M.",
    "10:45 P.M.",
    "11:00 P.M.",
    "11:15 P.M.",
    "11:30 P.M.",
    "11:45 P.M.",
    "12:00 A.M.",
  ];
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
  };

  //Creation of an event
  const createEvent = async () => {
    try {
      // Validate that the start time is earlier than the end time
      if (calculateRealTime(startTime) >= calculateRealTime(endTime)) {
        alert("Start time must be earlier than end time.");
        return; // Exit the function if validation fails
      }
      const data = await trpc.event.create.mutate({
        day: day,
        startHour: calculateRealTime(startTime),
        endHour: calculateRealTime(endTime),
        title: title,
        description: description,
        location: location,
        backgroundColor: backgroundColor,
      });
      console.log("Event created:", data);

      //Reset
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div>
      {/* Button for opening the widget */}
      <Button onClick={() => setIsModalOpen(true)}>
        <img
          src="apps/website/src/icons/CreateIcon.png"
          alt="Create Event"
          className="w-6 h-6 inline"
        />
        {/* May have to chage size and position later */}
      </Button>

      {/* Pop-Up Structure */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              <strong>Create Event</strong>
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createEvent();
              }}
            >
              <label>
                Title:
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </label>

              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full max-h-52"
                />
              </label>

              <label>
                Select Event Day:
                <select
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
              </label>

              <div className="flex justify-between mb-4">
                <label className="flex-1 mr-2">
                  Start Time:
                  <select
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
                </label>

                <label className="flex-1 ml-2">
                  End Time:
                  <select
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
                </label>
              </div>

              <label>
                Location:
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="p-2 border border-gray-300 rounded w-full"
                />
              </label>
              <label>
                Background Color:
                <div className="flex space-x-2 mt-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      style={{
                        backgroundColor: color,
                        flex: "1 1 0%", // Adjusts the width of each square to be flexible
                        paddingTop: "10%", // Makes the div a square by setting height proportional to width
                        borderRadius: "4px",
                        cursor: "pointer",
                        border:
                          backgroundColor === color
                            ? "2px solid black"
                            : "2px solid white",
                      }}
                    />
                  ))}
                </div>
              </label>

              <div className="modal-actions flex justify-between items-stretch pt-3 gap-3">
                <Button type="submit" className="flex gap-3 w-full">
                  <CalendarCheck />
                  Submit
                </Button>
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex gap-3 w-full"
                >
                  <CalendarX />
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
