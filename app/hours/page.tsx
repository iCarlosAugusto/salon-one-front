import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingTimer } from "@/components/booking-timer";
import { CalendarSelector } from "./client-components/calendar-selector";
import { TimeSlotsSelector } from "./client-components/time-slots-selector";
import { EmployeeSelector } from "./client-components/employee-selector";
import { WaitlistLink } from "./client-components/waitlist-link";
import { HoursProvider } from "./client-components/hours-provider";
import { BookingFlow } from "@/components/booking-flow";

export default async function HoursPage() {
  const pathname = "/hours";
  return (
    <BookingFlow pathname={pathname}>
      {/* Client-side providers and alerts */}
      <HoursProvider />
      <>
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
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

            {/* Employee Selector */}
            <EmployeeSelector />

            {/* Calendar Selector */}
            <CalendarSelector />

            {/* Time Slots */}
            <TimeSlotsSelector />

            {/* Waitlist Link */}
            <WaitlistLink />
          </div>
        </div>
      </>
    </BookingFlow>
  );
}
