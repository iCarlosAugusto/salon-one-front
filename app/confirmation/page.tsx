"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ShoppingCart, 
  ShieldAlert,
  User,
  Phone,
  LogOut
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { OtpModal } from "@/components/otp_modal";
import { cn } from "@/lib/utils";

function ConfirmationPage() {
  const router = useRouter();
  const {
    services,
    selectedEmployee,
    date,
    selectedTime,
    clearBooking,
  } = useBookingStore();

  const { user, isAuthenticated, isLoading: isAuthLoading, signOut } = useAuth();

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingMessage, setLoadingMessage] = useState("Processando...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Prevent navigating back after success
  useEffect(() => {
    if (status !== "success") return;
    
    const blockBack = () => {
      window.history.go(1);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, [status]);

  // Progressive loading feedback
  useEffect(() => {
    if (status !== "loading") return;
    const t1 = setTimeout(() => setLoadingMessage("Aguarde mais um pouco..."), 2000);
    const t2 = setTimeout(() => setLoadingMessage("Quase lá!"), 5000);
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
      clientName: user?.user_metadata?.full_name ?? "Cliente",
      clientPhone: user?.phone ?? "",
      clientEmail: user?.email ?? "",
      userId: user?.id,
      notes,
    };
  }, [date, notes, selectedEmployee, selectedTime, services, user]);

  const handleConfirm = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

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

  const handleAuthSuccess = () => {
    // User just authenticated, now try to confirm
    handleConfirm();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
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

  const userName = user?.user_metadata?.full_name ?? user?.phone ?? "Usuário";

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Auth Modal */}
      <OtpModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        onSuccess={handleAuthSuccess}
      />

      {/* User Info Section */}
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">Seus dados</span>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            {isAuthLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{userName}</span>
                    {user?.phone && (
                      <span className="text-sm text-muted-foreground">
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                    <Phone className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Identificação necessária</span>
                    <span className="text-sm text-muted-foreground">
                      Verifique seu telefone para continuar
                    </span>
                  </div>
                </div>
                <Button size="sm" onClick={() => setShowAuthModal(true)}>
                  Verificar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-2">
        <span className="text-lg font-semibold">Forma de pagamento</span>
        <Card>
          <CardContent className="flex items-center gap-2 p-4">
            <ShoppingCart className="h-4 w-4" />
            <span>Pagamento no local</span>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <span className="text-lg font-semibold">Adicionar observações</span>
        <Textarea
          placeholder="Digite aqui suas observações (opcional)"
          maxLength={100}
          className="resize-none"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {notes.length}/100 caracteres
        </p>
      </div>

      {/* Confirmation Card */}
      <Card className="overflow-hidden border-slate-200">
        <CardContent className="space-y-4 p-4 sm:p-6">
          {status === "success" ? (
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-800">Agendamento confirmado!</p>
                <p className="text-sm text-green-700">
                  Enviamos sua solicitação. Você receberá a confirmação final em breve via SMS.
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
                  <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-800">Algo deu errado</p>
                    <p className="text-sm text-amber-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Auth required warning */}
              {!isAuthenticated && !isAuthLoading && (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-blue-800">Verificação necessária</p>
                    <p className="text-sm text-blue-700">
                      Para confirmar seu agendamento, precisamos verificar seu telefone.
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleConfirm}
                disabled={!canSubmit || status === "loading" || isAuthLoading}
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
                ) : !isAuthenticated ? (
                  "Verificar telefone e confirmar"
                ) : (
                  "Confirmar agendamento"
                )}
              </Button>

              <p className="text-xs text-slate-500">
                Ao confirmar, o horário será solicitado para o salão. Você não poderá voltar para a etapa anterior.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info footer */}
      {status !== "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <Clock className="h-4 w-4 text-slate-500 flex-shrink-0" />
          Revise as informações antes de confirmar. Se necessário, atualize a data e o horário na etapa anterior.
        </div>
      )}
    </div>
  );
}

export default ConfirmationPage;
