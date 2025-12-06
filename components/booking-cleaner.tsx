"use client"


import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useEffect } from "react";

export function BookingCleaner() {
    const { clearBooking } = useBookingStore();

    useEffect(() => {
        clearBooking();
    }, []);

    return null;
}