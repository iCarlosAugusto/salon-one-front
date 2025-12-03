"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useBookingStore } from "@/lib/store/flow-booking-store";

export function EmployeeSelector() {
  const { services, selectedEmployee } = useBookingStore();
  const employee = selectedEmployee ?? services.find((service) => service.employeeSelected)?.employeeSelected ?? null;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={employee?.avatar ?? ""} alt={employee?.firstName ?? ""} />
          <AvatarFallback>{employee?.firstName?.charAt(0) ?? ""}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-slate-900">{employee?.firstName ?? ""}</span>
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
  );
}
