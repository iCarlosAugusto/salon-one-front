"use client";

import { useEffect } from "react";
import { useBookingStore, type Employee } from "@/lib/store/flow-booking-store";

type BookingProviderProps = {
  employee: Employee | null;
  salonSlug?: string;
};

export function BookingProvider({ employee, salonSlug }: BookingProviderProps) {
  const { setEmployee, setSalonSlug, selectedEmployee } = useBookingStore();

  useEffect(() => {
    // Only set employee if it's different from the current one or if there's none selected
    if (employee && (!selectedEmployee || selectedEmployee.id !== employee.id)) {
      setEmployee(employee);
    }
    
    if (salonSlug) {
      setSalonSlug(salonSlug);
    }
  }, [employee, salonSlug, setEmployee, setSalonSlug, selectedEmployee]);

  return null; // This is a data-only component
}
