"use client";

import { ArrowLeft, Calendar, ChevronDown, ChevronLeft, ChevronRight, MapPin, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/store/booking-store";
import { useRouter } from "next/navigation";
import { BookingTimer } from "@/components/booking-timer";
import { BookingExpiryAlert } from "@/components/booking-expiry-alert";

type Employee = {
  id: string;
  name: string;
  role: string;
  slug: string;
  rating: number;
  reviews: number;
  avatar: string;
};

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  employee: string;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

type DaySlot = {
  date: number;
  dayName: string;
  fullDate: Date;
  available: boolean;
};

// Mock data
const EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Jhonnathan",
    role: "Barbeiro Sênior",
    slug: "jhonnathan",
    rating: 4.9,
    reviews: 128,
    avatar: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Pablo",
    role: "Barbeiro",
    slug: "pablo",
    rating: 4.8,
    reviews: 96,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  },
];

const SELECTED_SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte de cabelo",
    duration: 60,
    price: 150,
    employee: "Jhonnathan",
  },
  {
    id: "2",
    name: "Perfilado de cejas",
    duration: 10,
    price: 30,
    employee: "Jhonnathan",
  },
  {
    id: "3",
    name: "Asesoramiento y corte de cabello",
    duration: 120,
    price: 250,
    employee: "Jhonnathan",
  },
];

const SALON_INFO = {
  name: "La Mafia - Los Cusis",
  rating: 4.9,
  reviews: 88,
  address: "Macororo 15, Local 4, Norte, Santa Cruz De La...",
  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 0,
  }).format(value);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h e ${remaining} min`;
};

// Generate days for the calendar grid
const generateCalendarDays = (currentDate: Date) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Days in month
  const daysInMonth = lastDay.getDate();
  
  // Day of week for first day (0 = Sunday)
  const firstDayOfWeek = firstDay.getDay();
  
  // Calculate days from previous month to show
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonthDays = firstDayOfWeek;
  
  // Calculate days from next month to show
  const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
  const nextMonthDays = totalCells - (daysInMonth + firstDayOfWeek);
  
  const days: Array<{
    date: number;
    fullDate: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isAvailable: boolean;
  }> = [];
  
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
    // Random availability for demo (you can replace with actual logic)
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

// Generate days for the current month view
const generateDays = (currentDate: Date): DaySlot[] => {
  const days: DaySlot[] = [];
  const dayNames = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  
  // Generate 7 days starting from a specific date
  const startDate = new Date(2025, 11, 6); // December 6, 2025 (month is 0-indexed)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push({
      date: date.getDate(),
      dayName: dayNames[date.getDay()],
      fullDate: date,
      available: i !== 1, // Sunday (index 1) is not available
    });
  }
  
  return days;
};

// Generate time slots
const generateTimeSlots = (): TimeSlot[] => {
  return [
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "16:50", available: true },
  ];
};

export default function HoursPage() {
  const router = useRouter();
  
  // Zustand store
  const { 
    selectedServices, 
    selectedEmployee, 
    selectedDate: storeSelectedDate,
    selectedTime: storeSelectedTime,
    setDate: setStoreDate,
    setTime: setStoreTime,
    getTotalDuration,
    getTotalPrice
  } = useBookingStore();

  // Local state
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');

  // Sync store date with local state on mount
  useEffect(() => {
    if (storeSelectedDate) {
      const dateFromStore = new Date(storeSelectedDate);
      setCurrentDate(new Date(dateFromStore.getFullYear(), dateFromStore.getMonth(), 1));
    }
  }, []);

  const calendarDays = useMemo(() => generateCalendarDays(currentDate), [currentDate]);
  const timeSlots = generateTimeSlots();
  
  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  // Convert store date back to Date object for comparison
  const selectedDate = storeSelectedDate ? new Date(storeSelectedDate) : null;
  const selectedTime = storeSelectedTime;

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

  const handleDateSelect = (day: typeof calendarDays[0]) => {
    if (day.isAvailable && day.isCurrentMonth) {
      setStoreDate(day.fullDate);
      setStoreTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (time: string) => {
    setStoreTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      router.push('/confirm');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Expiry Alert Modal */}
      <BookingExpiryAlert />
      
      {/* Desktop Header with Breadcrumb */}
      <div className="hidden lg:block border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/booking" className="text-slate-600">
                  Serviços
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">
                  Horário
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/confirm" className="text-slate-400">
                  Confirmar
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Button>
          <h1 className="text-xl font-semibold text-slate-900">Selecionar horário</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Desktop Title */}
            <h1 className="hidden text-3xl font-semibold text-slate-900 lg:block">
              Selecionar horário
            </h1>

            {/* Booking Timer */}
            <BookingTimer />

            <span>SELECINADO:{JSON.stringify(selectedEmployee)}</span>
            <span>selecionado: {JSON.stringify(selectedServices)}</span>

            {/* Employee Selector and Calendar Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={SALON_INFO.image} alt={SALON_INFO.name} />
                  <AvatarFallback>{SALON_INFO.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-900">{selectedEmployee.name}</span>
              </div>

              <Button 
                variant="outline" 
                size="icon"
                className="h-10 w-10 rounded-full border-slate-200 shadow-sm"
              >
                <Calendar className="h-5 w-5 text-slate-600" />
                <span className="sr-only">Abrir calendário</span>
              </Button>
            </div>

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
                          // Current month styles
                          day.isCurrentMonth && "text-slate-900",
                          // Other month styles
                          !day.isCurrentMonth && "text-slate-300",
                          // Today styles
                          day.isToday && !isSelected && "bg-slate-100 font-semibold ring-2 ring-slate-200",
                          // Available styles
                          day.isAvailable && day.isCurrentMonth && !isSelected && 
                            "hover:bg-indigo-50 hover:scale-110 hover:shadow-md hover:ring-2 hover:ring-indigo-100 cursor-pointer active:scale-95",
                          // Selected styles
                          isSelected && 
                            "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-110 ring-2 ring-indigo-400",
                          // Unavailable styles
                          (!day.isAvailable || !day.isCurrentMonth) && 
                            "cursor-not-allowed opacity-40",
                        )}
                      >
                        <span className="relative z-10 transition-transform group-hover:scale-110">{day.date}</span>
                        
                        {/* Today indicator dot */}
                        {day.isToday && !isSelected && (
                          <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                        
                        {/* Available indicator for current month days */}
                        {day.isAvailable && day.isCurrentMonth && !isSelected && !day.isToday && (
                          <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-slate-200 group-hover:ring-indigo-200 transition-all" />
                        )}
                        
                        {/* Ripple effect on hover */}
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

            {/* Time Slots - Only show when date is selected */}
            {selectedDate && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDuration: '400ms' }}>
                <h3 className="text-sm font-semibold text-slate-900">Horários disponíveis</h3>
                {timeSlots.map((slot, index) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animationDuration: '300ms'
                    }}
                    className={cn(
                      "w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all",
                      "animate-in fade-in slide-in-from-left-2",
                      selectedTime === slot.time
                        ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm"
                        : slot.available
                        ? "border-slate-200 bg-white text-slate-900 hover:border-indigo-200 hover:bg-indigo-50/50 hover:scale-[1.02]"
                        : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            {/* Empty state when no date selected */}
            {!selectedDate && (
              <div className="rounded-xl bg-slate-50 p-8 text-center animate-in fade-in">
                <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  Selecione uma data no calendário acima
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Escolha um dia disponível para ver os horários
                </p>
              </div>
            )}

            {/* Waitlist Link */}
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-600">
                Não encontra um horário conveniente?{" "}
                <button className="font-medium text-indigo-600 hover:text-indigo-700">
                  Entrar na lista de espera
                </button>
              </p>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden w-full max-w-xl self-start lg:block lg:w-96">
            <Card className="overflow-hidden border-slate-200 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.32)]">
              <CardHeader className="space-y-3 bg-gradient-to-r from-indigo-50 to-slate-50 pb-4">
                <div className="flex items-start gap-3">
                  <img
                    src={SALON_INFO.image}
                    alt={SALON_INFO.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      {SALON_INFO.name}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {SALON_INFO.rating}
                        </span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(SALON_INFO.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-slate-200 text-slate-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">({SALON_INFO.reviews})</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="h-3 w-3" />
                      <span>{SALON_INFO.address}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 p-6">
                {/* Selected Services */}
                <div className="space-y-3">
                  {selectedServices.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 p-6 text-center">
                      <p className="text-sm text-slate-500">Nenhum serviço selecionado</p>
                    </div>
                  ) : (
                    selectedServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                      >
                        <div className="flex-1 space-y-0.5">
                          <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                          <p className="text-xs text-slate-500">
                            {formatDuration(service.duration)} {selectedEmployee ? `com ${selectedEmployee.firstName}` : ''}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          a partir de {formatCurrency(parseFloat(service.price))}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Total */}
                {selectedServices.length > 0 && (
                  <div className="rounded-2xl bg-slate-900 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-white">
                        a partir de {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Continue Button */}
                <Button 
                  onClick={handleContinue}
                  className={cn(
                    "w-full rounded-full py-6 text-base font-semibold transition-all duration-300",
                    selectedTime 
                      ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.02]" 
                      : "bg-slate-300 cursor-not-allowed"
                  )}
                  disabled={!selectedTime}
                >
                  {selectedTime ? "Continuar" : "Selecione data e horário"}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] lg:hidden">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  {selectedServices.length === 0 ? "Nenhum serviço" : `a partir de ${formatCurrency(totalPrice)}`}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedServices.length} {selectedServices.length === 1 ? "serviço" : "serviços"} • {formatDuration(totalDuration)}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleContinue}
              className={cn(
                "w-full rounded-full py-6 text-base font-semibold transition-all duration-300",
                selectedTime 
                  ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.02]" 
                  : "bg-slate-300 cursor-not-allowed"
              )}
              disabled={!selectedTime}
            >
              {selectedTime ? "Continuar" : "Selecione data e horário"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

