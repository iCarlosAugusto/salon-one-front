import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookingTimer } from "@/components/booking-timer";
import { BookingExpiryAlert } from "@/components/booking-expiry-alert";
import { BookingSummary } from "../booking/client-components/booking-summary";
import { CalendarSelector } from "./client-components/calendar-selector";
import { TimeSlotsSelector } from "./client-components/time-slots-selector";
import { EmployeeSelector } from "./client-components/employee-selector";
import { MobileBottomBar } from "./client-components/mobile-bottom-bar";
import { WaitlistLink } from "./client-components/waitlist-link";
import { HoursProvider } from "./client-components/hours-provider";

export default async function HoursPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Client-side providers and alerts */}
      <HoursProvider />
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

          {/* Desktop Sidebar */}
          <aside className="hidden w-full max-w-xl self-start lg:block lg:w-96">
            <BookingSummary employeeName={null} />
          </aside>
        </div>

        {/* Mobile Bottom Bar */}
        <MobileBottomBar />
      </div>
    </div>
  );
}
