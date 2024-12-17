import React, { ComponentProps, useMemo } from "react";
import useWindowDimensions from "~/lib/window-dimensions";
import { DraggableDiv } from "../draggable-div";
import {
  CalendarColumn,
  CalendarCurrentTimeIndicator,
  CalendarTimes,
} from "./calendar-column";
import { DaySelector } from "./day-selector";

const days = [
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
];

type CalendarProps = {
  events: ComponentProps<typeof CalendarColumn>["events"];
  renderEvent?: ComponentProps<typeof CalendarColumn>["renderEvent"];
  onEventClick?: ComponentProps<typeof CalendarColumn>["onEventClick"];
};

// Displays the full calendar including day selection
export const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventClick,
  renderEvent,
}) => {
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

  // This is tailwind's lg breakpoint. It shouldn't be hardcoded, but for now it's fine
  // see https://stackoverflow.com/questions/59982018/how-do-i-get-tailwinds-active-breakpoint-in-javascript
  if (width < 1024) {
    mainContent = (
      <div className="px-1">
        <div className="flex flex-row">
          <CalendarTimes startHour={7.5} endHour={24} />
          <CalendarColumn
            renderEvent={renderEvent}
            className="flex-1"
            startHour={7}
            endHour={24}
            events={eventsOnDay}
            onEventClick={onEventClick}
          >
            <CalendarCurrentTimeIndicator />
          </CalendarColumn>
        </div>
      </div>
    );
  } else {
    mainContent = (
      <div className="flex flex-row">
        <CalendarTimes startHour={7.5} endHour={24} className="mt-[1.5rem]" />
        <div className="flex gap-12">
          {
            // render all events separated by day
            eventsSeparatedByDay.map((events, i) => (
              <div key={days[i]} className="flex-1 min-w-[50rem]">
                <p className="text-center font-bold">{days[i]}</p>
                <CalendarColumn
                  renderEvent={renderEvent}
                  onEventClick={onEventClick}
                  startHour={7}
                  endHour={24}
                  events={events}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  const c = (
    <div>
      <div className="w-full mb-8 text-center px-1">
        <DaySelector
          days={days}
          selectedDay={selectedDay}
          onDaySelect={setSelectedDay}
        />
      </div>
      {mainContent}
    </div>
  );

  if (width < 1024) {
    return c;
  } else {
    return (
      <DraggableDiv
        // scrollYRoot
        className="flex-row overflow-x-auto flex gap-12"
        style={{
          height: "calc(100vh - 126px)",
        }}
      >
        {c}
      </DraggableDiv>
    );
  }
};
