"use client";

import { Clock3, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/lib/store/booking-store";
import { cn } from "@/lib/utils";
import { Service } from "@/interfaces";

const formatCurrency = (value: string | number, currency: string | null = "BRL") =>{
  //Format pattern: 20.00
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  if (isNaN(value)) {
    return "0.00";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}
const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h ${remaining} min`;
};

type ServiceCardProps = {
  service: Service;
  currency: string | null;
};

export function ServiceCard({ service, currency }: ServiceCardProps) {
  const { toggleService, isServiceSelected } = useBookingStore();
  const isSelected = isServiceSelected(service.id);

  return (
    <button
      onClick={() => toggleService(service)}
      className={cn(
        "group w-full flex gap-3 rounded-sm border p-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] transition-all text-left",
        "hover:-translate-y-0.5 hover:shadow-md",
        isSelected
          ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20"
          : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-slate-900">{service.name}</p>
              {isSelected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 animate-in zoom-in">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {service.description ?? "Serviço premium com finalização exclusiva."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(isSelected && "border-indigo-600 text-indigo-700")}>
            <Clock3 className="h-4 w-4" /> {formatDuration(service.duration)}
          </Badge>
          <Badge variant={isSelected ? "default" : "default"} className={cn(isSelected && "bg-indigo-600")}>
            {formatCurrency(service.price, currency)}
          </Badge>
        </div>
      </div>
    </button>
  );
}

