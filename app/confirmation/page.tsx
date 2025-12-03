"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, ShoppingCart, ShieldAlert } from "lucide-react";

import { BookingFlow } from "@/components/booking-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { cn } from "@/lib/utils";

function ConfirmationPage() {
  const pathname = "/confirmation";
  const router = useRouter();
  const {
    services,
    selectedEmployee,
    date,
    selectedTime,
    clearBooking,
  } = useBookingStore();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prevent navigating back
  useEffect(() => {
    const blockBack = () => {
      window.history.go(1);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, []);

  // Progressive loading feedback
  useEffect(() => {
    if (status !== "loading") return;
    const t1 = setTimeout(() => setLoadingMessage("Wait a little bit more..."), 2000);
    const t2 = setTimeout(() => setLoadingMessage("Almost there!"), 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [status]);

  const payload = useMemo(() => {
    const appointmentDate = date ? new Date(date).toISOString().split("T")[0] : null;
    const salonId = services[0]?.salonId ?? null;
    const bodyServices = services
      .map((service) => ({
        serviceId: service.id,
        employeeId: (service.employeeSelected ?? selectedEmployee)?.id ?? null,
      }))
      .filter((svc) => svc.employeeId);

    return {
      salonId,
      services: bodyServices,
      appointmentDate,
      startTime: selectedTime,
      clientName: "Cliente",
      clientPhone: "cliente@example.com",
      notes,
    };
  }, [date, notes, selectedEmployee, selectedTime, services]);

  const handleConfirm = async () => {
    setStatus("loading");
    setErrorMessage(null);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL ?? "http://localhost:3001";

    try {
      const response = await fetch(`${baseUrl}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const canSubmit = useMemo(() => {
    return (
      services.length > 0 &&
      payload.services.length === services.length &&
      payload.appointmentDate &&
      payload.startTime
    );
  }, [payload.appointmentDate, payload.services.length, payload.startTime, services.length]);

  return (
    <BookingFlow pathname={pathname}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold">Forma de pagamento</span>
          <Card>
            <CardContent className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Pagamento no local</span>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-2">
          <span className="text-lg font-semibold">Adicionar observações</span>
          <Textarea
            placeholder="Digite aqui suas observações"
            maxLength={100}
            className="resize-none"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <Card className="overflow-hidden border-slate-200">
          <CardContent className="space-y-4 p-4 sm:p-6">
            {status === "success" ? (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-800">Agendamento confirmado!</p>
                  <p className="text-sm text-green-700">
                    Enviamos sua solicitação. Você receberá a confirmação final em breve.
                  </p>
                  <Button
                    className="mt-2 w-full sm:w-auto"
                    onClick={() => router.push("/")}
                  >
                    Voltar para início
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-slate-900">
                    Confirmar agendamento
                  </p>
                  <span className="text-xs text-slate-500">
                    {services.length} serviço(s) • {selectedTime ?? "Horário indefinido"}
                  </span>
                </div>

                {status === "error" && (
                  <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <ShieldAlert className="h-5 w-5 text-amber-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-amber-800">Algo deu errado</p>
                      <p className="text-sm text-amber-700">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleConfirm}
                  disabled={!canSubmit || status === "loading"}
                  className={cn(
                    "w-full rounded-full text-base font-semibold",
                    status === "loading" && "cursor-wait"
                  )}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {loadingMessage}
                    </span>
                  ) : (
                    "Confirmar"
                  )}
                </Button>

                <p className="text-xs text-slate-500">
                  Ao confirmar, o horário será solicitado para o salão. Você não poderá voltar para a etapa anterior.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {status !== "success" && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Clock className="h-4 w-4 text-slate-500" />
            Revise as informações antes de confirmar. Se necessário, atualize a data e o horário na etapa anterior.
          </div>
        )}
      </div>
    </BookingFlow>
  );
}

export default ConfirmationPage;
