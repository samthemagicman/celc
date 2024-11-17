import React, { ComponentProps, useMemo } from "react";
import { cn } from "~/lib/utils";
import useWindowDimensions from "~/lib/window-dimensions";
import { Calendar, CalendarCurrentTimeIndicator } from "./calendar";
import { DraggableDiv } from "./draggable-div";
type FullCalendarProps = {
  events: ComponentProps<typeof Calendar>["events"];
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
const dayDateStart = 1;

// Displays the full calendar including day selection
export const FullCalendar: React.FC<FullCalendarProps> = ({ events }) => {
  const { width } = useWindowDimensions();
  const [selectedDay, setSelectedDay] = React.useState(0);

  const eventsOnDay = useMemo(() => {
    if (!events) return [];
    return events.filter((event) => event.day === selectedDay);
  }, [selectedDay, events]);

  const eventsSeparatedByDay = useMemo(() => {
    if (!events) return [];

    // make sure there's an array for each day
    const eventsOnDays: (typeof events)[0][][] = Array.from(
      { length: days.length },
      () => [],
    );

    // group events by day
    for (const event of events) {
      eventsOnDays[event.day].push(event);
    }

    // return an array of events separated by day
    return eventsOnDays;
  }, [events]);

  let mainContent;

  // This is the tailwind's lg breakpoint. It shouldn't be hardcoded, but for now it's fine
  // see https://stackoverflow.com/questions/59982018/how-do-i-get-tailwinds-active-breakpoint-in-javascript
  if (width < 1024) {
    mainContent = (
      <div className="px-2">
        <Calendar startHour={7} endHour={24} events={eventsOnDay}>
          <CalendarCurrentTimeIndicator />
        </Calendar>
      </div>
    );
  } else {
    mainContent = (
      <DraggableDiv scrollYRoot className="flex-row overflow-x-auto flex">
        {
          // render all events separated by day
          eventsSeparatedByDay.map((events, i) => (
            <div
              key={days[i]}
              className="flex-1 min-w-96 border-r border-gray-200"
            >
              <p className="text-center font-bold">{days[i]}</p>
              <Calendar
                renderTimes={i === 0}
                startHour={7}
                endHour={24}
                events={events}
              />
            </div>
          ))
        }
      </DraggableDiv>
    );
  }

  return (
    <div>
      <div className="w-full mb-8 text-center px-1">
        <p className="w-full flex gap-1 lg:hidden">
          {days.map((day, i) => (
            <button
              onClick={() => setSelectedDay(i)}
              key={day.charAt(0)}
              className={cn(
                "capitalize p-2 flex-1 rounded-md bg-gray-200 transition-all",
                {
                  "bg-primary text-primary-foreground": i === selectedDay,
                },
              )}
            >
              <div>
                <p className="text-xs">{i + dayDateStart}</p>
                <p className="text-sm">
                  {day.charAt(0)}
                  <span className="lowercase transition-opacity opacity-0 hidden md:inline-block md:opacity-100">
                    {day.slice(1)}
                  </span>
                </p>
              </div>
            </button>
          ))}
        </p>
      </div>
      {mainContent}
    </div>
  );
};
