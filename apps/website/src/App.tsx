import React from "react";
import { cn } from "./lib/utils";

const rowHeight = "8em";

const numberToTime = (n: number) => {
  if (n > 12) {
    return `${n - 12}pm`;
  } else {
    return `${n}am`;
  }
};

function App() {
  return (
    <div className="">
      <Calendar startHour={7} endHour={24}>
        <CalendarEvent startHour={9.5} endHour={10} />
        <EventColumnContainer startHour={7.5}>
          <CalendarEvent startHour={7.5} endHour={8} />
          <CalendarEvent startHour={8} endHour={9} />
        </EventColumnContainer>
      </Calendar>
    </div>
  );
}

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

type CalendarProps = {
  startHour: number;
  endHour: number;
  children: React.ReactNode;
};
const Calendar: React.FC<CalendarProps> = ({
  children,
  startHour,
  endHour,
}) => {
  const rows = Array.from({ length: endHour - startHour + 1 });
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
              style={{
                height: rowHeight,
              }}
            >
              <p key={i} className="text-sm text-end">
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
        <div className="w-full h-full flex flex-row gap-2">{children}</div>
      </div>
    </EventColumnContainerContext.Provider>
  );
};

const CalendarEvent: React.FC<{
  startHour: number;
  endHour: number;
  className?: string;
}> = ({ startHour, endHour, className }) => {
  // const rowHeight = "(100% / 24)";
  // const offset = "0.5em";
  const calendar = React.useContext(CalendarContext);
  const calendarRow = React.useContext(EventColumnContainerContext);
  const row = calendarRow?.row
    ? startHour - calendarRow.row
    : startHour - (calendar?.startHour ?? 0);
  const hourLength = endHour - startHour;

  return (
    <div
      className={cn(
        "w-full z-30 py-[0.1rem]",
        !calendarRow && "absolute",
        className,
      )}
      style={{
        top: !calendarRow ? `calc(${rowHeight}*${row} + 0.5em)` : undefined, // Margins + offset by 2 hours
        marginTop: calendarRow ? `calc(${rowHeight}*${row})` : undefined, // Margins + offset by 2 hours
        height: `calc(${rowHeight} * ${hourLength})`, // 8 hours and 50 minutes
      }}
    >
      <div className="w-full h-full bg-green-700/80 rounded-lg relative overflow-hidden flex flex-row">
        <div className="w-3 h-full bg-green-700"></div>
        <div className="p-2 flex flex-col gap-1">
          <div>
            <p className="text-white tracking-wider font-semibold text-ellipsis">
              Breakfast
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-white text-sm">3:00am - 5:00am</p>
            <p className="text-white text-sm">Room 102</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
