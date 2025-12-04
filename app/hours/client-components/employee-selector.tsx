"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useBookingStore } from "@/lib/store/flow-booking-store";

export function EmployeeSelector() {
  const { services, selectedEmployee } = useBookingStore();
  const employees = services.map((service) => service.employeeSelected);

  return (
    <div className="flex items-center gap-3">

      {employees.map((employee) => (  
        <div key={employee?.id} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee?.avatar ?? ""} alt={employee?.firstName ?? ""} />
            <AvatarFallback>{employee?.firstName?.charAt(0) ?? ""}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-slate-900">{employee?.firstName ?? ""}</span>
        </div>
      ))}
    </div>
  );
}
