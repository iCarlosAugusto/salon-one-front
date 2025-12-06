"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/lib/store/flow-booking-store";

export function TimeSlotsSelector() {
  const {
    date,
    selectedTime,
    setTime,
    services,
  } = useBookingStore();

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const employeeIds = services
    .map((service) => service.employeeSelected?.id)
    .filter(Boolean)
    .join(",");

  useEffect(() => {
    // Reset slots when date changes or is cleared
    if (!date || services.length === 0) {
      setTimeSlots([]);
      setError(null);
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
        if (!baseUrl) {
          throw new Error("API base URL not configured");
        }

        // Format date as YYYY-MM-DD
        const parsedDate = new Date(date);
        const formattedDate = parsedDate.toISOString().split('T')[0]; // e.g., "2025-12-01"

        // Build service IDs string
        const serviceIds = services.map(s => s.id).join(',');

        // Build the URL with query parameters
        const url = `${baseUrl}/appointments/available-slots?employeeIds=${employeeIds}&serviceIds=${serviceIds}&date=${formattedDate}`;

        const response = await fetch(url, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch time slots: ${response.status}`);
        }

        const slots = await response.json() as { employeeId: string, availableSlots: string[], employeeName: string }[];
        setTimeSlots(slots.flatMap(slot => slot.availableSlots));
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError(err instanceof Error ? err.message : "Failed to load time slots");
        // Fallback to empty array on error
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [date, employeeIds, services]); // Re-fetch when any of these change

  const handleTimeSelect = (time: string) => {
    setTime(time);
  };

  // No date selected state
  if (!date) {
    return (
      <div className="rounded-xl bg-slate-50 p-8 text-center animate-in fade-in">
        <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">
          Selecione uma data no calendário acima
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Escolha um dia disponível para ver os horários
        </p>
      </div>
    );
  }

  // No services selected state
  if (services.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-8 text-center animate-in fade-in">
        <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">
          Nenhum serviço selecionado
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Volte e selecione pelo menos um serviço
        </p>
      </div>
    );
  }


  // Loading state
  if (loading) {
    return (
      <div className="space-y-3 animate-in fade-in">
        <h3 className="text-sm font-semibold text-slate-900">Carregando horários...</h3>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 w-full animate-pulse rounded-2xl bg-slate-100"
            style={{
              animationDelay: `${i * 100}ms`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center animate-in fade-in">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Calendar className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-sm font-medium text-red-900">
          Erro ao carregar horários
        </p>
        <p className="mt-1 text-xs text-red-700">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // No slots available state
  if (timeSlots.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 p-8 text-center animate-in fade-in">
        <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">
          Nenhum horário disponível
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Tente selecionar outra data
        </p>
      </div>
    );
  }

  // Success state - show time slots
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4" style={{ animationDuration: '400ms' }}>
      <h3 className="text-sm font-semibold text-slate-900">
        Horários disponíveis ({timeSlots.length})
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {timeSlots.map((time, index) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            style={{
              animationDelay: `${index * 50}ms`,
              animationDuration: '300ms'
            }}
            className={cn(
              "w-full rounded-2xl border-2 px-6 py-4 text-left text-base font-medium transition-all",
              "animate-in fade-in slide-in-from-left-2",
              selectedTime === time
                ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm ring-2 ring-indigo-600/20"
                : "border-slate-200 bg-white text-slate-900 hover:border-indigo-200 hover:bg-indigo-50/50 hover:scale-[1.02] active:scale-95"
            )}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
