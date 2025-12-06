import { create } from 'zustand';
import { Employee, Service } from '@/interfaces';
import { createJSONStorage, persist } from 'zustand/middleware';
export type { Employee, Service } from '@/interfaces';

export type SelectedService = Service & { employeeSelected: Employee | null };

export interface FlowBookingStore {
  // State
  services: SelectedService[];
  selectedEmployee: Employee | null;
  date: Date | null;
  selectedTime: string | null;
  salonSlug: string | null;
  bookingStartedAt: number | null;
  bookingExpiresAt: number | null;
  sessionDuration: number;

  // Service actions
  addService: (service: Service, employee?: Employee | null) => void;
  removeService: (serviceId: string) => void;
  addEmployeeToService: (serviceId: string, employee: Employee) => void;
  removeEmployeeFromService: (serviceId: string) => void;
  clearServices: () => void;
  toggleService: (service: Service, employee?: Employee | null) => void;
  isServiceSelected: (serviceId: string) => boolean;

  // Date and time actions
  setDate: (date: Date | null) => void;
  setTime: (time: string | null) => void;

  // Salon actions
  setSalonSlug: (slug: string | null) => void;

  // Session helpers
  startBookingSession: () => void;
  clearExpiredBooking: () => void;
  isBookingExpired: () => boolean;
  getTimeRemaining: () => number;
  extendSession: () => void;

  // Derived
  clearBooking: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
}

export const useAppointmentStore = create<FlowBookingStore>()(
  persist((set, get) => (
    {
      services: [],
      selectedEmployee: null,
      date: null,
      selectedTime: null,
      salonSlug: null,
      bookingStartedAt: null,
      bookingExpiresAt: null,
      sessionDuration: 5 * 60 * 1000,

      addService: (service, employee = null) =>
        set((state) => ({
          services: state.services.some((s) => s.id === service.id)
            ? state.services
            : [...state.services, { ...service, employeeSelected: employee }],
        })),

      removeService: (serviceId) =>
        set((state) => ({
          services: state.services.filter((service) => service.id !== serviceId),
        })),

      addEmployeeToService: (serviceId, employee) =>
        set((state) => ({
          services: state.services.map((service) =>
            service.id === serviceId ? { ...service, employeeSelected: employee } : service
          ),
        })),

      removeEmployeeFromService: (serviceId) =>
        set((state) => ({
          services: state.services.map((service) =>
            service.id === serviceId ? { ...service, employeeSelected: null } : service
          ),
        })),

      clearServices: () => set({ services: [] }),

      toggleService: (service, employee = null) =>
        set((state) => {
          const isSelected = state.services.some((s) => s.id === service.id);
          return isSelected
            ? { services: state.services.filter((s) => s.id !== service.id) }
            : { services: [...state.services, { ...service, employeeSelected: employee }] };
        }),

      isServiceSelected: (serviceId) => get().services.some((service) => service.id === serviceId),

      setDate: (date) => set({ date }),

      setTime: (time) => {
        const now = Date.now();
        const duration = get().sessionDuration;
        set({
          selectedTime: time,
          bookingStartedAt: now,
          bookingExpiresAt: now + duration,
        });
      },

      setSalonSlug: (slug) => set({ salonSlug: slug }),

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

      clearBooking: () =>
        set({
          services: [],
          selectedEmployee: null,
          date: null,
          selectedTime: null,
          bookingStartedAt: null,
          bookingExpiresAt: null,
        }),

      getTotalDuration: () => get().services.reduce((total, service) => total + service.duration, 0),

      getTotalPrice: () =>
        get().services.reduce((total, service) => total + parseFloat(service.price), 0),
    }
  ), {
    name: 'flow-booking-store',
    storage: createJSONStorage(() => sessionStorage),
  }));

// Alias to make the transition from the old store easier
export const useBookingStore = useAppointmentStore;
