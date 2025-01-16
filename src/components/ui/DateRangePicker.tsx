"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  onDateChange?: (date: DateRange) => void;
  initialDateRange?: DateRange;
}

export function DateRangePicker({
  onDateChange,
  initialDateRange,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange>(
    initialDateRange || {
      from: new Date(),
      to: new Date(),
    }
  );

  const handleDateChange = (range: DateRange | undefined) => {
    if (!range || (!range.from && !range.to)) {
      return;
    }

    const newRange = {
      from: range.from || date.from,
      to: range.to || range.from || date.from,
    };
    setDate(newRange);
    onDateChange?.(newRange);
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from && (
              <>
                {format(date.from, "LLL dd, y")}
                {date.to && date.to !== date.from && (
                  <> - {format(date.to, "LLL dd, y")}</>
                )}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            defaultMonth={date.from}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
