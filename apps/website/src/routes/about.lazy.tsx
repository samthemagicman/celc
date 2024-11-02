import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { trpc } from '~/lib/api'
import { useState } from 'react'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  //States for the form inputs
  //Format: var to hold current value, function to be called to update it, useState is init state
  const[isModalOpen, setIsModalOpen] = useState(false)
  const[title, setTitle]=  useState('')
  const[description, setDescription] = useState('')
  const[day, setDay] = useState(0)
  const[startTime, setStartTime] = useState("7:30 A.M.")
  const[endTime, setEndTime] = useState("8:30 A.M.")
  const[location, setLocation] = useState('')
  
  //Availble Day Options
  const dayOptions = [
    { day: 0, label: "Day 0 - Wednesday" },
    { day: 1, label: "Day 1 - Thursday" },
    { day: 2, label: "Day 2 - Friday" },
    { day: 3, label: "Day 3 - Saturday" },
    { day: 4, label: "Day 4 - Sunday" },
    { day: 5, label: "Day 5 - Monday" },
    { day: 6, label: "Day 6 - Tuesday" },
  ]

  //Available Time Options
  const timeOptions = [
    "7:00 A.M.","7:30 A.M.", "7:45 A.M.", "8:00 A.M.", "8:15 A.M.", "8:30 A.M.", "8:45 A.M.",
    "9:00 A.M.", "9:15 A.M.", "9:30 A.M.", "9:45 A.M.", "10:00 A.M.", "10:15 A.M.",
    "10:30 A.M.", "10:45 A.M.", "11:00 A.M.", "11:15 A.M.", "11:30 A.M.", "11:45 A.M.",
    "12:00 P.M.", "12:15 P.M.", "12:30 P.M.", "12:45 P.M.", "1:00 P.M.", "1:15 P.M.",
    "1:30 P.M.", "1:45 P.M.", "2:00 P.M.", "2:15 P.M.", "2:30 P.M.", "2:45 P.M.",
    "3:00 P.M.", "3:15 P.M.", "3:30 P.M.", "3:45 P.M.", "4:00 P.M.", "4:15 P.M.",
    "4:30 P.M.", "4:45 P.M.", "5:00 P.M.", "5:15 P.M.", "5:30 P.M.", "5:45 P.M.",
    "6:00 P.M.", "6:15 P.M.", "6:30 P.M.", "6:45 P.M.", "7:00 P.M.", "7:15 P.M.",
    "7:30 P.M.", "7:45 P.M.", "8:00 P.M.", "8:15 P.M.", "8:30 P.M.", "8:45 P.M.",
    "9:00 P.M.", "9:15 P.M.", "9:30 P.M.", "9:45 P.M.", "10:00 P.M.", "10:15 P.M.",
    "10:30 P.M.", "10:45 P.M.", "11:00 P.M.", "11:15 P.M.", "11:30 P.M.", "11:45 P.M.",
    "12:00 A.M."
  ];

  const calculateRealTime = (time: string) => {
    const [hourMin, period] = time.split(' ') //split hour and am/pm, tokenization
    let [hour, minute] = hourMin.split(':').map(Number) //grabs hr : min

    if(period === 'A.M.' && hour === 12) hour = 0;
    if(period === 'P.M.' && hour !== 12) hour += 12;
  
    //Convert to real nums
    return hour + (minute / 60)
  }

  const resetForm = () =>{
    //Reset fields
    setTitle('')
    setDescription('')
    setStartTime('7:30 A.M.')
    setEndTime('8:30 A.M.')
    setLocation('')
    setDay(0)
  }

  //Creation of an event
  const createEvent = async () => {
    try {
      
      // Validate that the start time is earlier than the end time
      if (calculateRealTime(startTime) >= calculateRealTime(endTime)) {
        alert('Start time must be earlier than end time.');
        return; // Exit the function if validation fails
      }
      const data = await trpc.event.create.mutate({
        day: day,
        startHour: calculateRealTime(startTime),
        endHour: calculateRealTime(endTime),
        title: title,
        description: description,
        location: location,
      })
      console.log('Event created:', data)
      
      //Reset
      setIsModalOpen(false);
      resetForm()

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

    <div>
      {/* Button for opening the widget */}
      <Button onClick={() => setIsModalOpen(true)}>
        <img src='apps/website/src/icons/CreateIcon.png' alt='Create Event' className='w-6 h-6 inline' />{/* May have to chage size and position later */}
      </Button>

      {/* Pop-Up Structure */}
      {isModalOpen && (
        <div className = 'modal-overlay'>
          <div className = 'modal-content'>
            <h2><strong>Create Event</strong></h2>
            <form onSubmit={(e) => {e.preventDefault(); createEvent()}}>
              
              <label>
                Title:
                <input
                  type = "text"
                  value = {title}
                  onChange = {(e) => setTitle(e.target.value)}
                  required
                  className='p-2 border border-gray-300 rounded w-full'
                />
              </label>

              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className='p-2 border border-gray-300 rounded w-full'
                />
              </label>

              <label>
                Select Event Day:
                <select value = {day} onChange= {(e) => setDay(parseInt(e.target.value))} required className='p-2 border border-gray-300 rounded w-full'>
                {dayOptions.map(({ day, label }) =>(
                  <option key= {day} value={day}>{label}</option>
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
                      <option key={time} value={time}>{time}</option>
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
                      <option key={time} value={time}>{time}</option>
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

              <div className="modal-actions flex justify-between">
                <button type="submit" className="flex items-center">
                  <img src="../icon/ConfirmIcon.png" alt="Confirm" className="w-6 h-6 inline mr-2" />
                  Submit
                </button>
                <button type="button" onClick={() => {setIsModalOpen(false); resetForm();} } className="flex items-center">
                  <img src="../icon/CloseIcon.png" alt="Cancel" className="w-6 h-6 inline mr-2" />
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>

      )}
    </div>
  )
}