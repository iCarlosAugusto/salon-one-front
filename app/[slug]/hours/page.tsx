import { CalendarSelector } from "./client-components/calendar-selector";
import { TimeSlotsSelector } from "./client-components/time-slots-selector";
import { EmployeeSelector } from "./client-components/employee-selector";
import { HoursProvider } from "./client-components/hours-provider";
import { BookingFlow } from "@/components/booking-flow";

export default async function HoursPage() {
  const pathname = "/[slug]/hours";
  return (
    <BookingFlow pathname={pathname}>
      {/* Client-side providers and alerts */}
      <HoursProvider />
      <>
        {/* Mobile Header */}
        <div className="mb-6 lg:hidden">
          <h1 className="text-xl font-semibold text-slate-900">Selecionar horário</h1>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Desktop Title */}
            <h1 className="hidden text-3xl font-semibold text-slate-900 lg:block">
              Selecionar horário
            </h1>

            {/* Employee Selector */}
            <EmployeeSelector />

            {/* Calendar Selector */}
            <CalendarSelector />

            {/* Time Slots */}
            <TimeSlotsSelector />
          </div>
        </div>
      </>
    </BookingFlow>
  );
}
