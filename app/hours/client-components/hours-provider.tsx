"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/lib/store/booking-store";

export function HoursProvider() {
  const { clearExpiredBooking } = useBookingStore();

  useEffect(() => {
    // Check if booking has expired on mount
    clearExpiredBooking();
  }, [clearExpiredBooking]);

  return null;
}

