"use client";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/booking-store";
import { useRouter } from "next/navigation";

const formatCurrency = (value: number, currency: string | null = "BRL") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h e ${remaining} min`;
};

type MobileBottomBarProps = {
  currency?: string | null;
};

export function MobileBottomBar({ currency }: MobileBottomBarProps) {
  const router = useRouter();
  const { selectedServices, getTotalDuration, getTotalPrice } = useBookingStore();

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      router.push('/hours');
    }
  };

  return (
    <div className="fixed border-t border-t-slate-200 bottom-0 left-0 right-0 z-50 flex flex-col gap-2 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="flex flex-col justify-between">
        <span className="text-sm font-semibold text-slate-900">
          {selectedServices.length === 0 
            ? "Nenhum serviço selecionado" 
            : `a partir de ${formatCurrency(totalPrice, currency)}`
          }
        </span>
        {selectedServices.length > 0 && (
          <span className="text-sm font-normal text-slate-500">
            {selectedServices.length} {selectedServices.length === 1 ? "serviço" : "serviços"} • {formatDuration(totalDuration)}
          </span>
        )}
      </div>
      <Button 
        onClick={handleContinue}
        disabled={selectedServices.length === 0}
        className="w-full rounded-full bg-indigo-600 text-base font-semibold transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {selectedServices.length === 0 ? "Selecione um serviço" : "Continuar"}
      </Button>
    </div>
  );
}

