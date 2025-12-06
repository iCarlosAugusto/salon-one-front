"use client";

import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { GetBasicInfo } from "@/components/get-basic-info";

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
  const { user, isAuthenticated, isLoading: isAuthLoading, signOut } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const { getTotalDuration, getTotalPrice, selectedEmployee, date, clearBooking, services, selectedTime, pushNavigation } = useBookingStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showModalBasicInfo, setShowModalBasicInfo] = useState(false);

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  const route = pathname.split('/')[2];
  const slug = pathname.split('/')[1];

  const handleContinue = () => {
    // Push current URL to navigation history before navigating
    const currentUrl = window.location.pathname + window.location.search;
    pushNavigation(currentUrl);

    switch (route) {
      case "booking":
        router.push(`/${slug}/hours`);
        break;
      case "services":
        router.push(`/${slug}/hours`);
        break;
      case "hours":
        router.push(`/${slug}/confirmation`);
        break;
    }
  };

  const buttonText = useMemo(() => {
    switch (route) {
      case "booking":
        return "Selecione um serviço";
      case "services":
        return "Selecione um horário";
      case "hours":
        return "Confirmar agendamento";
      case "confirmation":
        return "Confirmar agendamento";
    }
  }, [route]);

  const confirmBooking = useCallback(() => {
    // TODO: Implement actual booking submission to backend
    console.log("Booking confirmed!", {
      services,
      totalDuration,
      totalPrice,
    });
    // After successful booking, you can redirect to a success page
    // router.push(`/${slug}/success`);
  }, [services, totalDuration, totalPrice]);


  const payload = useMemo(() => {
    const appointmentDate = date ? new Date(date).toISOString().split("T")[0] : null;
    const salonId = services[0]?.salonId ?? null;
    const bodyServices = services
      .map((service) => ({
        serviceId: service.id,
        employeeId: (service.employeeSelected ?? selectedEmployee)?.id ?? null,
      }))

    return {
      salonId,
      services: bodyServices,
      appointmentDate,
      startTime: selectedTime,
      clientName: user?.user_metadata?.full_name ?? "Cliente",
      clientPhone: user?.phone ?? "",
      clientEmail: user?.email ?? "teste@teste.com",
      userId: user?.id,
    };
  }, [date, selectedEmployee, selectedTime, services, user]);

  const handleConfirmBooking = () => {
    setShowModalBasicInfo(true);
  }


  const handleConfirm = async (name: string, phone: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3001";
    console.log("Services: ", services)
    try {
      const response = await fetch(`${baseUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, clientName: name, clientPhone: phone }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível criar o agendamento.");
      }

      setStatus("success");
      clearBooking();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro ao criar agendamento.");
    }
  };

  const handleAuthSuccess = useCallback(() => {
    // After successful authentication, submit the booking
    confirmBooking();
  }, [confirmBooking]);


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
            services.map((service, index) => (
              <div key={index}>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">{service.name}</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(parseFloat(service.price), currency)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{formatDuration(service.duration)} com {service.employeeSelected?.firstName ?? "Qualquer profissional"}</p>
                </div>
                <Separator />
              </div>
            ))
          )}
        </div>

        {/* Total */}
        {services.length > 0 && (
          <div className="space-y-2 rounded-2xl bg-slate-50 p-3 animate-in fade-in slide-in-from-bottom-2">
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
          onClick={route === "confirmation" ? handleConfirmBooking : handleContinue}
          disabled={services.length === 0}
          className="w-full rounded-full bg-indigo-600 text-base font-semibold transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {buttonText}
        </Button>
      </CardContent>

      <GetBasicInfo
        isOpen={showModalBasicInfo}
        onOpenChange={setShowModalBasicInfo}
        onBasicInfoSubmit={(name, phone) => {
          handleConfirm(name, phone);
        }}
      />
    </Card>
  );
}

