import { ClockIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { DatabaseEvent } from "@repo/types/database";
import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "~/lib/utils";

const rowHeight = "8em";

type CalendarContextType = {
  startHour: number;
  endHour: number;
};

type EventColumn = DatabaseEvent[];

type EventColumnGroup = EventColumn[];

const getOverlappingEvents = (event: DatabaseEvent, events: EventColumn) => {
  return events.filter((other) => {
    return (
      (other.startHour >= event.startHour && other.startHour < event.endHour) ||
      (other.endHour > event.startHour && other.endHour <= event.endHour) ||
      (other.startHour <= event.startHour && other.endHour >= event.endHour)
    );
  });
};

const canPlaceInColumn = (event: DatabaseEvent, column: EventColumn) => {
  return getOverlappingEvents(event, column).length === 0;
};

const organizeEvents = (events: EventColumn) => {
  const groupedEvents: EventColumnGroup = [];

  //sort events by start time
  // events.sort((a, b) => a.startHour - b.startHour);
  // sort by largest duration
  events.sort((a, b) => b.endHour - b.startHour - (a.endHour - a.startHour));

  for (const event of events) {
    let placed = false;
    for (const group of groupedEvents) {
      if (canPlaceInColumn(event, group)) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groupedEvents.push([event]);
    }
  }

  return groupedEvents;
};

export const numberToTime = (n: number, showMinutes: boolean = false) => {
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

export const CalendarCurrentTimeIndicator = () => {
  const calendar = useCalendarColumn();
  const [now, setNow] = React.useState(new Date());
  const currentHour = useMemo(
    () => now.getHours() + now.getMinutes() / 60,
    [now],
  );

  useEffect(() => {
    const t = setInterval(() => {
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

const CalendarColumnContext = React.createContext<CalendarContextType | null>(
  null,
);
const useCalendarColumn = () => {
  const context = React.useContext(CalendarColumnContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};

type CalendarProps = {
  startHour: number;
  endHour: number;
  children?: React.ReactNode;
  events?: DatabaseEvent[];
  onEventClick?: (event: DatabaseEvent) => void;
  className?: string;
  renderEvent?: (
    event: DatabaseEvent,
    props: React.ComponentProps<typeof CalendarEvent>,
  ) => React.ReactNode;
};

export const CalendarColumn: React.FC<CalendarProps> = ({
  children,
  startHour,
  endHour,
  events,
  onEventClick,
  className,
  renderEvent,
}) => {
  const rows = Array.from({ length: endHour - startHour + 1 });

  const organizedEvents = useMemo(() => {
    return events ? [organizeEvents(events)] : [];
  }, [events]);

  const calendarEventElements = useMemo(() => {
    return organizedEvents?.map((eventGroup) => (
      <>
        {eventGroup.map((eventColumn, x) => (
          <>
            {eventColumn.map((event) => {
              const columnCount = eventGroup.length;
              const columnOffset = (1 / columnCount) * x;
              let columnWidth = 1 / columnCount;
              console.log(columnWidth);

              // Stretch the column if there are no overlapping events in the next columns
              const nextColumn = eventGroup.slice(x + 1);
              if (nextColumn.length > 0) {
                // this could be a lot better
                const overlapping = nextColumn.some((e) => {
                  return getOverlappingEvents(event, e).length > 0;
                });

                if (!overlapping) {
                  columnWidth = (1 / columnCount) * (nextColumn.length + 1);
                }
              }

              return renderEvent ? (
                renderEvent(event, {
                  backgroundColor: event.backgroundColor ?? "bg-primary",
                  startHour: event.startHour,
                  endHour: event.endHour,
                  title: event.title,
                  location: event.location,
                  onClick: () => onEventClick?.(event),
                  horizontalOffset: columnOffset,
                  width: columnWidth,
                })
              ) : (
                <CalendarEvent
                  location={event.location}
                  backgroundColor={event.backgroundColor ?? "bg-primary"}
                  width={columnWidth}
                  horizontalOffset={columnOffset}
                  title={event.title}
                  startHour={event.startHour}
                  endHour={event.endHour}
                  onClick={() => {
                    onEventClick?.(event);
                  }}
                />
              );
            })}
          </>
        ))}
      </>
    ));
  }, [organizedEvents, onEventClick, renderEvent]);

  return (
    <CalendarColumnContext.Provider
      value={useMemo(
        () => ({
          startHour,
          endHour,
        }),
        [startHour, endHour],
      )}
    >
      <div className={cn("flex flex-row relative", className)}>
        <div
          className="flex-1 self-stretch relative"
          style={{
            minHeight: `calc(${rowHeight} * ${rows.length})`,
          }}
        >
          {rows.map((_, i) => (
            <div
              key={i}
              className="w-full bg-primary/10 rounded-full absolute z-10 h-px"
              style={{
                top: `calc(${rowHeight} * ${i} + 0.5em)`,
              }}
            ></div>
          ))}
          {calendarEventElements}
          {children}
        </div>
      </div>
    </CalendarColumnContext.Provider>
  );
};

type EventColumnContainerContextType = {
  row: number;
};
const EventColumnContainerContext =
  React.createContext<EventColumnContainerContextType | null>(null);

export const CalendarEvent: React.FC<{
  startHour: number;
  endHour: number;
  width?: number;
  horizontalOffset?: number;
  className?: string;
  buttonClassName?: string;
  location?: string;
  backgroundColor?: string;
  title: string;
  onClick?: () => void;
}> = ({
  startHour,
  endHour,
  className,
  location,
  title,
  width,
  horizontalOffset,
  backgroundColor,
  buttonClassName,
  onClick,
}) => {
  const calendar = React.useContext(CalendarColumnContext);
  const calendarRow = React.useContext(EventColumnContainerContext);
  const row = calendarRow?.row
    ? startHour - calendarRow.row
    : startHour - (calendar?.startHour ?? 0);
  const hourLength = endHour - startHour;

  const contentBtn = useRef<HTMLButtonElement>(null);
  const [divHeight, setDivHeight] = React.useState<number | null>(null);

  useEffect(() => {
    if (contentBtn.current) {
      setDivHeight(contentBtn.current.clientHeight);
    }
  }, [contentBtn]);

  return (
    <button
      className={cn(
        "w-full z-30 select-none cursor-pointer p-px active:opacity-90 duration-100 transition-all",
        !calendarRow && "absolute",
        className,
      )}
      style={{
        left: horizontalOffset ? `calc(${horizontalOffset} * 100%)` : undefined,
        width: width ? `calc(${width} * 100%)` : undefined,
        top: !calendarRow ? `calc(${rowHeight}*${row} + 0.5em)` : undefined, // Margins + offset by 2 hours
        marginTop: calendarRow ? `calc(${rowHeight}*${row})` : undefined, // Margins + offset by 2 hours
        height: `calc(${rowHeight} * ${hourLength})`, // 8 hours and 50 minutes
      }}
      ref={contentBtn}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-full h-full bg-primary rounded-lg relative overflow-hidden flex flex-row",
          buttonClassName,
        )}
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <div className="px-2 py-1 flex flex-col">
          <div
            className={cn(
              "text-white text-start tracking-wider text-xs xs:text-sm sm:text-base font-semibold text-ellipsis break-all line-clamp-1",
            )}
          >
            {title}
          </div>
          {/* Hide if height is too small */}
          <div
            className={cn(
              "flex flex-col gap-1 text-start",
              divHeight && divHeight < 40 && "hidden",
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
    </button>
  );
};

type CalendarTimesProps = {
  startHour: number;
  endHour: number;
  className?: string;
};

export const CalendarTimes: React.FC<CalendarTimesProps> = ({
  endHour,
  startHour,
  className,
}) => {
  const rows = Array.from({ length: endHour - startHour + 1 });
  return (
    <div className={cn("flex flex-col items-center px-1", className)}>
      {rows.map((_, i) => (
        <div
          key={i}
          style={{
            height: rowHeight,
          }}
          className="min-w-max"
        >
          <p className="text-xs text-end">{numberToTime(i + startHour)}</p>
        </div>
      ))}
    </div>
  );
};
