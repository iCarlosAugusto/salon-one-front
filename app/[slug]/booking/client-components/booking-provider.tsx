"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/lib/store/flow-booking-store";

type BookingProviderProps = {
  salonSlug?: string;
};

export function BookingProvider({ salonSlug }: BookingProviderProps) {
  const { setSalonSlug } = useBookingStore();

  useEffect(() => {
    if (salonSlug) {
      setSalonSlug(salonSlug);
    }
  }, [salonSlug, setSalonSlug]);

  return null; // This is a data-only component
}
