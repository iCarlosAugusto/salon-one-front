import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Day {
  date: number;
  day: string;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  fullDate: Date;
}

interface InlineCalendarProps {
  initialDate?: Date | null;
  daysToShow?: number;
  onDateSelect?: (date: Date) => void;
  isLoading?: boolean;
}

export const InlineCalendar: React.FC<InlineCalendarProps> = ({
  initialDate = new Date(),
  daysToShow = 30,
  isLoading = false,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate ?? new Date());
  const [days, setDays] = useState<Day[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const daysArray: Day[] = [];

    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = format(date, 'EEE', { locale: pt });
      console.log(selectedDate)
      daysArray.push({
        date: date.getDate(),
        day: dayName,
        isToday: date.toDateString() === today.toDateString(),
        isSelected: selectedDate ? date?.toDateString() === selectedDate?.toDateString() : false,
        isDisabled: date < today,
        fullDate: date,
      });
    }

    setDays(daysArray);
  }, [selectedDate, daysToShow]);

  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.querySelector(".selected");
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [days]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);

    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleTodaySelect = () => {
    setSelectedDate(new Date());
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2 space-x-2">
          <span className="font-semibold flex items-center">
            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
            {isLoading && (
              <div className="ml-2">
                <div className="w-4 h-4 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
            )}
          </span>

          <div className="flex items-center space-x-2">
            <div className="border-2 border-gray-200 rounded-full cursor-pointer p-2 px-5" onClick={handleTodaySelect}>
              <span className="text-sm font-medium">Hoje</span>
            </div>
            <div>
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-100 focus:outline-none"
                aria-label="Previous days"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full cursor-pointer hover:bg-gray-100 focus:outline-none"
                aria-label="Next days"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide py-4 px-2 space-x-3 mx-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {days.map((day) => (
            <motion.div
              key={day.date}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center min-w-[60px] select-none
                ${day.isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                ${day.isSelected ? "selected" : ""}
              `}
              onClick={() => !day.isDisabled && !isLoading && handleDateSelect(day.fullDate)}
            >
              <div
                className={`
                  flex items-center justify-center w-12 h-12 mb-1 rounded-full
                  ${day.isToday ? "border-2 border-black" : ""}
                  ${day.isSelected ? "border-2 border-black" : ""}
                  ${day.isSelected ? "bg-black text-white" : "bg-gray-100"}
                `}
              >
                <span className="text-xl font-medium">{day.date}</span>
                {day.isToday && (
                  <div className="absolute bottom-[26px] w-1 h-1 rounded-full bg-white"></div>
                )}
              </div>
              <span
                className={`text-sm ${day.isSelected ? "font-bold" : "text-gray-500"}`}
              >
                {day.day}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};