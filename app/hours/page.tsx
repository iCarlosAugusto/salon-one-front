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
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(EMPLOYEES[0]);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [selectedDay, setSelectedDay] = useState<number>(6);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const days = generateDays(currentDate);
  const timeSlots = generateTimeSlots();
  
  const totalDuration = SELECTED_SERVICES.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = SELECTED_SERVICES.reduce((sum, service) => sum + service.price, 0);

  const monthYear = currentDate.toLocaleDateString("pt-BR", { 
    month: "long", 
    year: "numeric" 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
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
              <h2 className="text-base font-semibold text-slate-900">{monthYear}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() - 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Mês anterior</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() + 1);
                    setCurrentDate(newDate);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Próximo mês</span>
                </Button>
              </div>
            </div>

            {/* Day Selector */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => day.available && setSelectedDay(day.date)}
                  disabled={!day.available}
                  className={cn(
                    "flex min-w-[72px] flex-col items-center gap-2 rounded-full px-6 py-4 transition-all",
                    selectedDay === day.date
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : day.available
                      ? "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                      : "border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <span className="text-2xl font-semibold">{day.date}</span>
                  <span className="text-xs font-medium">{day.dayName}</span>
                </button>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all",
                    selectedTime === slot.time
                      ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                      : slot.available
                      ? "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                      : "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>

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
                  {SELECTED_SERVICES.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatDuration(service.duration)} com {service.employee}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        a partir de {formatCurrency(service.price)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-white">
                      a partir de {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <Button 
                  className="w-full rounded-full bg-indigo-600 py-6 text-base font-semibold hover:bg-indigo-700"
                  disabled={!selectedTime}
                >
                  Continuar
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
                  a partir de {formatCurrency(totalPrice)}
                </span>
                <span className="text-xs text-slate-500">
                  {SELECTED_SERVICES.length} {SELECTED_SERVICES.length === 1 ? "serviço" : "serviços"} • {formatDuration(totalDuration)}
                </span>
              </div>
            </div>
            <Button 
              className="w-full rounded-full bg-indigo-600 py-6 text-base font-semibold hover:bg-indigo-700"
              disabled={!selectedTime}
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

