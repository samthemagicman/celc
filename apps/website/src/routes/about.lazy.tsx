import { createLazyFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/api";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() { //component 
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
        endHour: 9,
        startHour: 10,
        title: "Breakfast",
        location: "Home",
      });
      console.log("Event created:", data);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event.");
    }
  };

  //for this we need to acquire the id from selection of the event
  // to remove it 
  //this will be used by admin and users
  //admin access deletes the event from db
  //for user - its just hide the event
  // Function to delete a specific event with error handling
  const deleteEvent = async (eventId: string) => {
    try {
      await trpc.event.delete.mutate({ id: 10 });
      console.log("Event deleted successfully.");
      alert("Event has been deleted.");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };


  //For update let admin update whatever they want in the selected event
  // update works but it does not update the calendar ui, need to redraw the events on the calendar
//everytime the page is reloaded
// Function to update a specific event with error handling
  const updateEvent = async (eventId: string) => {
    try {
      const updatedData = await trpc.event.update.mutate({
        id: eventId,
        title: "Updated Breakfast",
        startHour: 9,
        endHour: 10,
        location: "Cafe",
      });
      console.log("Event updated successfully:", updatedData);
      alert("Event has been updated.");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("An error occurred while updating the event.");
    }
  };

 // Function to delete all events
  const deleteAllEvents = async () => {
    if(window.confirm("Are you sure you want to delete all events?")) {
      try{
        await trpc.event.deleteAllEvents.mutate();
        console.log("All events deleted sucessfully.");
        alert("All events have been deleted.");
      } catch (error){
        console.error("Error deleting all events:", error);
        alert("An error occured while trying to delete all events.");
      }
    }
  }

  return (
    <div className="p-2">
      <Button onClick={createEvent}>Create Event</Button>
      <Button onClick={() => deleteEvent("event-id")}>Delete Event</Button>
      <Button onClick={() => updateEvent("event-id")}>Edit Event</Button>
      <Button onClick={deleteAllEvents}>Delete All Events</Button>
    </div>
  );

}
