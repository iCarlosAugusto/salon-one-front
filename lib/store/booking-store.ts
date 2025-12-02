import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Employee, Service } from '@/interfaces';

// Types for the booking store

export type BookingState = {
  // Selected data
  selectedServices: Service[];
  selectedEmployee: Employee | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  
  // Salon info (optional, for context)
  salonSlug: string | null;
  
  // Session management
  bookingStartedAt: number | null; // Timestamp when time was selected
  bookingExpiresAt: number | null; // Timestamp when booking expires
  sessionDuration: number; // Duration in milliseconds (default: 15 minutes)
  
  // Actions for services
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearServices: () => void;
  toggleService: (service: Service) => void;
  
  // Actions for employee
  setEmployee: (employee: Employee | null) => void;
  
  // Actions for date and time
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;
  
  // Actions for salon
  setSalonSlug: (slug: string | null) => void;
  
  // Session management actions
  startBookingSession: () => void;
  clearExpiredBooking: () => void;
  isBookingExpired: () => boolean;
  getTimeRemaining: () => number;
  extendSession: () => void;
  
  // Utility actions
  clearBooking: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
  isServiceSelected: (serviceId: string) => boolean;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedServices: [],
      selectedEmployee: null,
      selectedDate: null,
      selectedTime: null,
      salonSlug: null,
      bookingStartedAt: null,
      bookingExpiresAt: null,
      sessionDuration: 5 * 60 * 1000, // 15 minutes in milliseconds

      // Service actions
      addService: (service) => 
        set((state) => ({
          selectedServices: [...state.selectedServices, service],
        })),

      removeService: (serviceId) =>
        set((state) => ({
          selectedServices: state.selectedServices.filter(
            (service) => service.id !== serviceId
          ),
        })),

      clearServices: () => set({ selectedServices: [] }),

      toggleService: (service) =>
        set((state) => {
          const isSelected = state.selectedServices.some(
            (s) => s.id === service.id
          );
          
          if (isSelected) {
            return {
              selectedServices: state.selectedServices.filter(
                (s) => s.id !== service.id
              ),
            };
          } else {
            return {
              selectedServices: [...state.selectedServices, service],
            };
          }
        }),

      // Employee actions
      setEmployee: (employee) => set({ selectedEmployee: employee }),

      // Date and time actions
      setDate: (date) => set({ selectedDate: date }),
      
      setTime: (time) => {
        const now = Date.now();
        const duration = get().sessionDuration;
        set({ 
          selectedTime: time,
          bookingStartedAt: now,
          bookingExpiresAt: now + duration,
        });
      },

      // Salon actions
      setSalonSlug: (slug) => set({ salonSlug: slug }),

      // Session management actions
      startBookingSession: () => {
        const now = Date.now();
        const duration = get().sessionDuration;
        set({
          bookingStartedAt: now,
          bookingExpiresAt: now + duration,
        });
      },

      clearExpiredBooking: () => {
        if (get().isBookingExpired()) {
          set({
            selectedTime: null,
            bookingStartedAt: null,
            bookingExpiresAt: null,
          });
        }
      },

      isBookingExpired: () => {
        const expiresAt = get().bookingExpiresAt;
        if (!expiresAt) return false;
        return Date.now() > expiresAt;
      },

      getTimeRemaining: () => {
        const expiresAt = get().bookingExpiresAt;
        if (!expiresAt) return 0;
        const remaining = expiresAt - Date.now();
        return remaining > 0 ? remaining : 0;
      },

      extendSession: () => {
        const now = Date.now();
        const duration = get().sessionDuration;
        set({
          bookingStartedAt: now,
          bookingExpiresAt: now + duration,
        });
      },

      // Utility actions
      clearBooking: () =>
        set({
          selectedServices: [],
          selectedEmployee: null,
          selectedDate: null,
          selectedTime: null,
          bookingStartedAt: null,
          bookingExpiresAt: null,
        }),

      getTotalDuration: () => {
        const services = get().selectedServices;
        return services.reduce((total, service) => total + service.duration, 0);
      },

      getTotalPrice: () => {
        const services = get().selectedServices;
        return services.reduce(
          (total, service) => total + parseFloat(service.price),
          0
        );
      },

      isServiceSelected: (serviceId) => {
        const services = get().selectedServices;
        return services.some((service) => service.id === serviceId);
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedServices: state.selectedServices,
        selectedEmployee: state.selectedEmployee,
        selectedDate: null,//state.selectedDate ? state.selectedDate.toISOString() : null,
        selectedTime: state.selectedTime,
        salonSlug: state.salonSlug,
        bookingStartedAt: state.bookingStartedAt,
        bookingExpiresAt: state.bookingExpiresAt,
        sessionDuration: state.sessionDuration,
      }),
    }
  )
);

