"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/store/flow-booking-store";

type CalendarDay = {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isAvailable: boolean;
};

// Generate days for the calendar grid
const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();
  
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = firstDayOfWeek;
  
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
  const nextMonthDays = totalCells - (daysInMonth + firstDayOfWeek);
  
  const days: CalendarDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Previous month days
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date: day,
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;
    const isAvailable = !isPast && Math.random() > 0.3;
    
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: true,
      isToday,
      isAvailable,
    });
  }
  
  // Next month days
  for (let i = 1; i <= nextMonthDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date: i,
      fullDate: date,
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false,
    });
  }
  
  return days;
};

export function CalendarSelector() {
  const { date: storeSelectedDate, services, setDate, selectedEmployee } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1));
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');

  const calendarDays = useMemo(() => generateCalendarDays(currentDate), [currentDate]);
  const selectedDate = storeSelectedDate ? new Date(storeSelectedDate) : null;

  const monthYear = currentDate.toLocaleDateString("pt-BR", { 
    month: "long", 
    year: "numeric" 
  });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handlePrevMonth = () => {
    setAnimationDirection('left');
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    setAnimationDirection('right');
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (day: CalendarDay) => {
    if (day.isAvailable && day.isCurrentMonth) {
      setDate(day.fullDate);
    }
  };

  return (
    <div className="space-y-6">
      <span>Services: {JSON.stringify(services)}</span>
      <br/>
      <span>Selected Employee: {JSON.stringify(selectedEmployee)}</span>
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold capitalize text-slate-900">{monthYear}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Mês anterior</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próximo mês</span>
          </Button>
        </div>
      </div>

      {/* Inline Calendar */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="p-4 sm:p-6">
          {/* Week days header */}
          <div className="mb-3 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid with animation */}
          <div 
            key={currentDate.getMonth()}
            className={cn(
              "grid grid-cols-7 gap-2 animate-in fade-in",
              animationDirection === 'right' ? "slide-in-from-right-5" : "slide-in-from-left-5"
            )}
            style={{ animationDuration: '300ms' }}
          >
            {calendarDays.map((day, index) => {
              const isSelected = selectedDate?.getTime() === day.fullDate.getTime();
              
              return (
                <button
                  key={`${day.fullDate.getTime()}-${index}`}
                  onClick={() => handleDateSelect(day)}
                  disabled={!day.isAvailable || !day.isCurrentMonth}
                  className={cn(
                    "group relative aspect-square rounded-xl text-sm font-medium transition-all duration-200",
                    "flex items-center justify-center",
                    day.isCurrentMonth && "text-slate-900",
                    !day.isCurrentMonth && "text-slate-300",
                    day.isToday && !isSelected && "bg-slate-100 font-semibold ring-2 ring-slate-200",
                    day.isAvailable && day.isCurrentMonth && !isSelected && 
                      "hover:bg-indigo-50 hover:scale-110 hover:shadow-md hover:ring-2 hover:ring-indigo-100 cursor-pointer active:scale-95",
                    isSelected && 
                      "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110 ring-2 ring-indigo-400",
                    (!day.isAvailable || !day.isCurrentMonth) && 
                      "cursor-not-allowed opacity-40",
                  )}
                >
                  <span className="relative z-10 transition-transform group-hover:scale-110">{day.date}</span>
                  
                  {day.isToday && !isSelected && (
                    <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                  
                  {day.isAvailable && day.isCurrentMonth && !isSelected && !day.isToday && (
                    <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-200 group-hover:ring-indigo-200 transition-all" />
                  )}
                  
                  {day.isAvailable && day.isCurrentMonth && !isSelected && (
                    <span className="absolute inset-0 rounded-xl bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div 
          className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 animate-in fade-in slide-in-from-top-2"
          style={{ animationDuration: '300ms' }}
        >
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">
            {selectedDate.toLocaleDateString("pt-BR", { 
              weekday: "long", 
              day: "numeric", 
              month: "long",
              year: "numeric" 
            })}
          </span>
        </div>
      )}
    </div>
  );
}
