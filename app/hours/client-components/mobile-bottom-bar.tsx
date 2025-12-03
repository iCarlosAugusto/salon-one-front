"use client";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 0,
  }).format(value);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h e ${remaining} min`;
};

export function MobileBottomBar() {
  const router = useRouter();
  const { 
    services, 
    date,
    selectedTime,
    getTotalDuration, 
    getTotalPrice 
  } = useBookingStore();

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  const handleContinue = () => {
    if (date && selectedTime) {
      router.push('/confirm');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">
              {services.length === 0 ? "Nenhum serviço" : `a partir de ${formatCurrency(totalPrice)}`}
            </span>
            <span className="text-xs text-slate-500">
              {services.length} {services.length === 1 ? "serviço" : "serviços"} • {formatDuration(totalDuration)}
            </span>
          </div>
        </div>
        <Button 
          onClick={handleContinue}
          className={cn(
            "w-full rounded-full py-6 text-base font-semibold transition-all duration-300",
            selectedTime 
              ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.02]" 
              : "bg-slate-300 cursor-not-allowed"
          )}
          disabled={!selectedTime}
        >
          {selectedTime ? "Continuar" : "Selecione data e horário"}
        </Button>
      </div>
    </div>
  );
}
