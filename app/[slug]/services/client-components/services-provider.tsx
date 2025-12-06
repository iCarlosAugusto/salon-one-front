"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { Employee, Service } from "@/interfaces";

interface ServicesProviderProps {
    employee: Employee | null;
    preSelectedServiceId: string | null;
    preSelectedService: Service | null | undefined;
}

export function ServicesProvider({ employee, preSelectedServiceId, preSelectedService }: ServicesProviderProps) {
    const { addService } = useBookingStore();

    useEffect(() => {
        if (preSelectedService) {
            addService(preSelectedService);
        }
    }, [employee, addService, preSelectedService]);

    return null;
}
