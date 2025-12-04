"use client";

import { useBookingStore } from "@/lib/store/flow-booking-store";
import { InlineCalendar } from "@/components/inline-calendar";

export function CalendarSelector() {
  const { date, setDate } = useBookingStore();

  const handleDateSelect = (date: Date) => {
    setDate(date);
  };

  return (
    <div className="space-y-6">
      <InlineCalendar initialDate={date} onDateSelect={(date) => handleDateSelect(date)}  />
    </div>
  );
}
