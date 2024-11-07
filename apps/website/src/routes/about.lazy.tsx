import { createLazyFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/api";
import { cn } from "~/lib/utils";

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
    { day: 0, label: "Day 1 - Wednesday" },
    { day: 1, label: "Day 2 - Thursday" },
    { day: 2, label: "Day 3 - Friday" },
    { day: 3, label: "Day 4 - Saturday" },
    { day: 4, label: "Day 5 - Sunday" },
    { day: 5, label: "Day 6 - Monday" },
    { day: 6, label: "Day 7 - Tuesday" },
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
        <div className="fixed flex top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-[1000]">
          <div className="m-3 p-5 rounded-md shadow-md max-w-screen-md bg-white">
            <h2 className="mb-4 text-xl font-bold">Create Event</h2>
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
