import { ClockIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "./lib/utils";

const rowHeight = "8em";

const numberToTime = (n: number, showMinutes: boolean = false) => {
  const hour = Math.floor(n);
  const minutes = Math.round((n - hour) * 60);

  // Format minutes to always show two digits
  const formattedMinutes = minutes === 0 ? "00" : `${minutes}`;

  if (showMinutes) {
    if (hour === 0) {
      return `12:${formattedMinutes} AM`; // Midnight case
    } else if (hour > 12) {
      return `${hour - 12}:${formattedMinutes} PM`;
    } else if (hour === 12) {
      return `12:${formattedMinutes} PM`; // Noon case
    } else {
      return `${hour}:${formattedMinutes} AM`;
    }
  }

  // If not showing minutes
  if (hour === 0) {
    return `12 AM`; // Midnight case
  } else if (hour > 12) {
    return `${hour - 12} PM`;
  } else if (hour === 12) {
    return `12 PM`; // Noon case
  } else {
    return `${hour} AM`;
  }
};

function App() {
  return (
    <div className="">
      <Calendar
        startHour={7}
        endHour={24}
        // events={[
        //   {
        //     startHour: 7.5,
        //     endHour: 9,
        //     title: "Breakfast",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 7.5,
        //     endHour: 8,
        //     title: "Breakfast",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 9,
        //     endHour: 12,
        //     title: "Meeting with Parents",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 9,
        //     endHour: 12,
        //     title: "Equity, Diversity, & Inclusion Training",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 9,
        //     endHour: 12,
        //     title: "Meeting",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 9,
        //     endHour: 12,
        //     title: "Meeting",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 12,
        //     endHour: 12.25,
        //     title: "Break",
        //   },
        //   {
        //     startHour: 12.25,
        //     endHour: 14,
        //     title: "Meeting",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 14.5,
        //     endHour: 15,
        //     title: "Meeting",
        //     location: "Room 102",
        //   },
        //   {
        //     startHour: 16,
        //     endHour: 16.75,
        //     title: "Governance Session",
        //   },
        //   {
        //     startHour: 16.75,
        //     endHour: 17,
        //     title: "Break",
        //   },
        //   {
        //     startHour: 17,
        //     endHour: 18,
        //     title: "Governance Session",
        //   },
        //   {
        //     startHour: 16,
        //     endHour: 18,
        //     title: "Case Competition",
        //   },
        // ]}
      >
        <CurrentTimeIndicator />
        {/* <CalendarEvent startHour={9.5} endHour={10} />
        <EventColumnContainer startHour={7.5}>
          <CalendarEvent startHour={7.5} endHour={8} />
          <CalendarEvent startHour={8} endHour={9} />
        </EventColumnContainer> */}
        <CalendarEvent startHour={9} endHour={10} title="test" />
      </Calendar>
    </div>
  );
}

const CurrentTimeIndicator = () => {
  const calendar = useCalendar();
  const [now, setNow] = React.useState(new Date());
  const currentHour = useMemo(
    () => now.getHours() + now.getMinutes() / 60,
    [now],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setNow(new Date());
    }, 1000);

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute w-full z-30"
      style={{
        top: `calc(${rowHeight} * ${currentHour - calendar.startHour} + 0.5em)`,
      }}
    >
      <div className="absolute w-full flex flex-row items-center ">
        <div className="rounded-full h-2 w-2 bg-blue-800 absolute -left-2"></div>
        <div className="w-full h-px bg-blue-800"></div>
      </div>
      <p className="text-sm right-0 text-blue-800 font-semibold absolute top-0">
        {numberToTime(currentHour, true)}
      </p>
    </div>
  );
};

type CalendarContextType = {
  startHour: number;
  endHour: number;
};
const CalendarContext = React.createContext<CalendarContextType | null>(null);
const useCalendar = () => {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

type CalendarEvent = {
  startHour: number;
  endHour: number;
  title: string;
  location?: string;
};

type CalendarProps = {
  startHour: number;
  endHour: number;
  children?: React.ReactNode;
  events?: CalendarEvent[];
};
const Calendar: React.FC<CalendarProps> = ({
  children,
  startHour,
  endHour,
  events,
}) => {
  const rows = Array.from({ length: endHour - startHour + 1 });

  function RenderEvent(event: CalendarEvent) {
    return (
      <CalendarEvent
        title={event.title}
        startHour={event.startHour}
        endHour={event.endHour}
        location={event.location}
      />
    );
  }

  const overlappingEvents = useMemo(() => {
    if (!events) {
      return [];
    }
    events.sort((a, b) => a.startHour - b.startHour);

    const groupedEvents = [];

    let currentGroup = null;

    for (const event of events) {
      if (!currentGroup) {
        // Start a new group with the first event
        currentGroup = {
          minStartHour: event.startHour,
          events: [event],
        };
        groupedEvents.push(currentGroup);
      } else {
        const lastEventInGroup =
          currentGroup.events[currentGroup.events.length - 1];

        // Check if the current event overlaps with the last event in the group
        if (event.startHour < lastEventInGroup.endHour) {
          // Overlapping event, add to the current group
          currentGroup.events.push(event);
          // Update minStartHour if necessary
          currentGroup.minStartHour = Math.min(
            currentGroup.minStartHour,
            event.startHour,
          );
        } else {
          // No overlap, start a new group
          currentGroup = {
            minStartHour: event.startHour,
            events: [event],
          };
          groupedEvents.push(currentGroup);
        }
      }
    }

    return groupedEvents;
  }, [events]);

  // const nonOverlappingEvents = useMemo(() => {
  //   if (!events) {
  //     return [];
  //   }
  //   return events.filter((event) => {
  //     return !overlappingEvents.some((events) => events.events.includes(event));
  //   });
  // }, [overlappingEvents]);

  return (
    <CalendarContext.Provider
      value={{
        startHour,
        endHour,
      }}
    >
      <div className="flex flex-row relative">
        <div className="flex flex-col items-center pr-1">
          {rows.map((_, i) => (
            <div
              className="pl-2"
              style={{
                height: rowHeight,
              }}
            >
              <p key={i} className="text-xs text-end">
                {numberToTime(i + startHour)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-1 self-stretch relative">
          {rows.map((_, i) => (
            <div
              key={i}
              className="w-full bg-primary/10 rounded-full absolute z-10 h-px"
              style={{
                top: `calc(${rowHeight} * ${i} + 0.5em)`,
              }}
            ></div>
          ))}
          {/* {nonOverlappingEvents.map((event, i) => (
            <RenderEvent key={i} {...event} />
          ))} */}
          {overlappingEvents.map((groupEvent) => (
            <EventColumnContainer startHour={groupEvent.minStartHour}>
              {groupEvent.events.map((event, j) => (
                <RenderEvent key={j} {...event} />
              ))}
            </EventColumnContainer>
          ))}
          {children}
        </div>
      </div>
    </CalendarContext.Provider>
  );
};

type EventColumnContainerContextType = {
  row: number;
};
const EventColumnContainerContext =
  React.createContext<EventColumnContainerContextType | null>(null);

const EventColumnContainer: React.FC<{
  children: React.ReactNode;
  startHour: number;
}> = ({ children, startHour }) => {
  // const rowHeight = "(100% / 24)";
  const offset = "0.5em";
  const calendar = useCalendar();
  const row = startHour - calendar.startHour;

  return (
    <EventColumnContainerContext.Provider value={{ row: startHour }}>
      <div
        className="w-full absolute z-30"
        style={{
          top: `calc(1px/2 + ${rowHeight}*${row} + ${offset})`, // Margins + offset by 2 hours
        }}
      >
        <div className="w-full h-full flex flex-row gap-1">{children}</div>
      </div>
    </EventColumnContainerContext.Provider>
  );
};

const CalendarEvent: React.FC<{
  startHour: number;
  endHour: number;
  className?: string;
  location?: string;
  title: string;
}> = ({ startHour, endHour, className, location, title }) => {
  // const rowHeight = "(100% / 24)";
  // const offset = "0.5em";
  const calendar = React.useContext(CalendarContext);
  const calendarRow = React.useContext(EventColumnContainerContext);
  const row = calendarRow?.row
    ? startHour - calendarRow.row
    : startHour - (calendar?.startHour ?? 0);
  const hourLength = endHour - startHour;

  const contentDiv = useRef<HTMLDivElement>(null);
  const [divHeight, setDivHeight] = React.useState<number | null>(null);

  useEffect(() => {
    if (contentDiv.current) {
      setDivHeight(contentDiv.current.clientHeight);
    }
  }, [contentDiv]);

  return (
    <div
      className={cn(
        "w-full z-30 py-[0.1rem] select-none cursor-pointer",
        !calendarRow && "absolute",
        className,
      )}
      style={{
        top: !calendarRow ? `calc(${rowHeight}*${row} + 0.5em)` : undefined, // Margins + offset by 2 hours
        marginTop: calendarRow ? `calc(${rowHeight}*${row})` : undefined, // Margins + offset by 2 hours
        height: `calc(${rowHeight} * ${hourLength})`, // 8 hours and 50 minutes
      }}
      ref={contentDiv}
    >
      <div className="w-full h-full bg-green-700/80 rounded-lg relative overflow-hidden flex flex-row">
        {/* <div className="w-3 h-full bg-green-700"></div> */}
        <div className="px-2 py-1 flex flex-col gap-2">
          <div className="">
            <p
              className={cn(
                "text-white tracking-wider text-xs xs:text-sm sm:text-base font-semibold text-ellipsis break-all line-clamp-1",
                "xs:break-normal xs:line-clamp-none",
              )}
            >
              {title}
            </p>
          </div>
          {/* Hide if height is too small */}
          <div
            className={cn(
              "flex flex-col gap-1",
              divHeight && divHeight < 100 && "hidden",
            )}
          >
            <div className="hidden flex-row items-center gap-1 xs:flex">
              <ClockIcon className="w-[1em] h-[1em] text-white hidden sm:block" />
              <p className="flex-1 text-white text-xs sm:text-sm">
                {numberToTime(startHour, true)} - {numberToTime(endHour, true)}
              </p>
            </div>

            {location && (
              <div className="hidden flex-row items-center gap-1 xs:flex">
                <PaperPlaneIcon className="w-4 h-4 text-white hidden sm:block" />
                <p className="text-white text-xs sm:text-sm">{location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
