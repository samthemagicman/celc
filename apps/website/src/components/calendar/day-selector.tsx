import { cn } from "~/lib/utils";

const dayDateStart = 1;

export const DaySelector: React.FC<{
  selectedDay: number;
  days: string[];
  onDaySelect: (day: number) => void;
}> = ({ selectedDay, onDaySelect, days }) => (
  <div className="w-full flex gap-1 lg:hidden">
    {days.map((day, i) => (
      <DaySelectButton
        onClick={() => onDaySelect(i)}
        key={day}
        label={day}
        number={dayDateStart + i}
        selected={selectedDay === i}
      />
    ))}
  </div>
);

const DaySelectButton: React.FC<{
  onClick: () => void;
  selected: boolean;
  label: string;
  number: number;
}> = ({ onClick, selected, label, number }) => (
  <button
    onClick={() => onClick()}
    className={cn(
      "capitalize p-2 flex-1 rounded-md bg-gray-200 transition-all",
      {
        "bg-primary text-primary-foreground": selected,
      },
    )}
  >
    <div>
      <p className="text-xs">{number}</p>
      <p className="text-sm">
        {label.charAt(0)}
        <span className="lowercase transition-opacity opacity-0 hidden md:inline-block md:opacity-100">
          {label.slice(1)}
        </span>
      </p>
    </div>
  </button>
);
