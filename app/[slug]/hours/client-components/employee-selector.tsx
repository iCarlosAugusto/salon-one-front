"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { Users } from "lucide-react";

export function EmployeeSelector() {
  const { services } = useBookingStore();
  const employees = services.map((service) => service?.employeeSelected ?? null);
  const isServicesWithNoEmployeePreference = services.every((service) => service?.employeeSelected === null);

  return (
    <div className="flex items-center gap-3">
      {!isServicesWithNoEmployeePreference && employees.map((employee, index) => (
        <div key={index} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee?.avatar ?? ""} alt={employee?.firstName ?? ""} />
            <AvatarFallback>{employee?.firstName?.charAt(0) ?? ""}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-slate-900">{employee?.firstName ?? "N/A"}</span>
        </div>
      ))}

      {isServicesWithNoEmployeePreference && (
        <div className="flex items-center gap-2 pl-1 py-2 bg-slate-50 pr-4 rounded-full border">
          <div className="flex items-center justify-center size-5 rounded-full bg-indigo-50 text-indigo-600">
            <Users className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-slate-900">Qualquer profissional</span>
        </div>
      )}
    </div>
  );
}
