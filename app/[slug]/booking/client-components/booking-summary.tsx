"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useRouter, usePathname } from "next/navigation";

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

type BookingSummaryProps = {
  employeeName?: string | null;
  salonName?: string | null;
  salonCity?: string | null;
  salonState?: string | null;
  currency?: string | null;
};

export function BookingSummary({
  employeeName,
  salonName,
  salonCity,
  salonState,
  currency,
}: BookingSummaryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { services, getTotalDuration, getTotalPrice } = useBookingStore();

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  const handleContinue = () => {
    const route = pathname.split('/')[2];
    switch(route) {
      case "booking":
        router.push('/hours');
        break;
      case "services":
        router.push('/hours');
        break;
      case "hours":
        router.push('/confirmation');
        break;
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.32)]">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-start justify-between text-lg">
          <span className="flex flex-1 flex-col text-slate-900">
            {employeeName ?? ""}
            <span className="text-sm font-normal text-slate-500">{salonName ?? ""}</span>
          </span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" /> {salonCity ?? "Cidade"} · {salonState ?? "Estado"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6 text-sm text-slate-700">
        {/* Selected Services */}
        <div className="space-y-3">
          {services.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center">
              <p className="text-sm text-slate-500">Nenhum serviço selecionado</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                  <p className="text-xs text-slate-500">{formatDuration(service.duration)}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(parseFloat(service.price), currency)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Total */}
        {services.length > 0 && (
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(totalPrice, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Duração total</span>
              <span className="font-semibold text-slate-900">{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(totalPrice, currency)}</span>
            </div>
          </div>
        )}

        {/* Policies */}
        <div className="space-y-2 rounded-2xl bg-indigo-50 p-4 text-indigo-900">
          <p className="text-sm font-semibold">Políticas rápidas</p>
          <ul className="list-disc space-y-1 pl-4 text-xs text-indigo-800">
            <li>Cancelamento sem custo até 2h antes.</li>
            <li>Pagamento no local ou confirmação online segura.</li>
            <li>Horários atualizados em tempo real.</li>
          </ul>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={services.length === 0}
          className="w-full rounded-full bg-indigo-600 text-base font-semibold transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {services.length === 0 ? "Selecione um serviço" : "Continuar"}
        </Button>
      </CardContent>
    </Card>
  );
}
