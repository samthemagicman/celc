import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { trpc } from '~/lib/api'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  //component
  // const createEvent = () => {
  //   trpc.event.create
  //   .mutate({
  //     day: 1,
  //     endHour: 8,
  //     startHour: 7,
  //     title: "Breakfast",
  //     description: "Apple Crumble",
  //     location: "Home",
  //   })
  //   .then((d) => {
  //     console.log("Event Created:", d);
  //   })
  // };
  const createEvent = async () => {
    try {
      const data = await trpc.event.create.mutate({
        day: 2,
        startHour: 10.5,
        endHour: 11.5,
        title: 'Breakfast',
        location: 'Home',
      })
      console.log('Event created:', data)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('An error occurred while creating the event.')
    }
  }

  //for this we need to acquire the id from selection of the event
  // to remove it
  //this will be used by admin and users
  //admin access deletes the event from db
  //for user - its just hide the event
  // Function to delete a specific event with error handling
  const deleteEvent = async (eventId: string) => {
    try {
      await trpc.event.delete.mutate({ id: 10 })
      console.log('Event deleted successfully.')
      alert('Event has been deleted.')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('An error occurred while deleting the event.')
    }
  }

  //For update let admin update whatever they want in the selected event
  // update works but it does not update the calendar ui, need to redraw the events on the calendar
  //everytime the page is reloaded
  // Function to update a specific event with error handling
  const updateEvent = async (eventId: string) => {
    try {
      const updatedData = await trpc.event.update.mutate({
        id: eventId,
        title: 'Updated Breakfast',
        startHour: 9,
        endHour: 10,
        location: 'Cafe',
      })
      console.log('Event updated successfully:', updatedData)
      alert('Event has been updated.')
    } catch (error) {
      console.error('Error updating event:', error)
      alert('An error occurred while updating the event.')
    }
  }

  // Function to delete all events
  const deleteAllEvents = async () => {
    if (window.confirm('Are you sure you want to delete all events?')) {
      try {
        await trpc.event.deleteAllEvents.mutate()
        console.log('All events deleted sucessfully.')
        alert('All events have been deleted.')
      } catch (error) {
        console.error('Error deleting all events:', error)
        alert('An error occured while trying to delete all events.')
      }
    }
  }

  return (
    <div className="p-2">
      <Button onClick={createEvent}>Create Event</Button>
      <Button onClick={() => deleteEvent('event-id')}>Delete Event</Button>
      <Button onClick={() => updateEvent('event-id')}>Edit Event</Button>
      <Button onClick={deleteAllEvents}>Delete All Events</Button>
    </div>
  )
}

// import { useState } from "react";
// import { createLazyFileRoute } from "@tanstack/react-router";
// import { Button } from "~/components/ui/button";
// import { trpc } from "~/lib/api";

// export const Route = createLazyFileRoute("/about")({
//   component: About,
// });

// function About() {
//   // State for form inputs
//   const [title, setTitle] = useState("");
//   const [day, setDay] = useState<number | "">("");
//   const [startHour, setStartHour] = useState<number | "">("");
//   const [endHour, setEndHour] = useState<number | "">("");
//   const [location, setLocation] = useState("");

//   // Create event with form data
//   const createEvent = async () => {
//     try {
//       const data = await trpc.event.create.mutate({
//         day: Number(day),
//         startHour: Number(startHour),
//         endHour: Number(endHour),
//         title,
//         location,
//       });
//       console.log("Event created:", data);
//       alert("Event has been created.");
//     } catch (error) {
//       console.error("Error creating event:", error);
//       alert("An error occurred while creating the event.");
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     createEvent();
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">Admin Event Creation Form</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Event Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="p-2 border border-gray-300 rounded w-full"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Day</label>
//           <input
//             type="number"
//             value={day}
//             onChange={(e) => setDay(e.target.value ? Number(e.target.value) : "")}
//             required
//             min="1"
//             max="7"
//             className="p-2 border border-gray-300 rounded w-full"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Start Hour</label>
//           <input
//             type="number"
//             step="0.5"
//             value={startHour}
//             onChange={(e) => setStartHour(e.target.value ? Number(e.target.value) : "")}
//             required
//             min="0"
//             max="23.5"
//             className="p-2 border border-gray-300 rounded w-full"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">End Hour</label>
//           <input
//             type="number"
//             step="0.5"
//             value={endHour}
//             onChange={(e) => setEndHour(e.target.value ? Number(e.target.value) : "")}
//             required
//             min="0"
//             max="23.5"
//             className="p-2 border border-gray-300 rounded w-full"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Location</label>
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             required
//             className="p-2 border border-gray-300 rounded w-full"
//           />
//         </div>
//         <Button type="submit">Create Event</Button>
//       </form>
//     </div>
//   );
// }
