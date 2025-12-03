"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { useRouter } from "next/navigation";

export function BookingExpiryAlert() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const { selectedTime, isBookingExpired, clearExpiredBooking } = useBookingStore();

  useEffect(() => {
    if (!selectedTime) {
      setShowAlert(false);
      return;
    }

    // Check every second if booking has expired
    const interval = setInterval(() => {
      if (isBookingExpired()) {
        setShowAlert(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTime, isBookingExpired]);

  const handleClose = () => {
    setShowAlert(false);
    clearExpiredBooking();
    router.push('/hours'); // Redirect back to hours selection
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in slide-in-from-bottom-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-full bg-amber-100 p-2">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              Tempo esgotado
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Seu horário reservado expirou. Por favor, selecione um novo horário para continuar com sua reserva.
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleClose}
                className="flex-1 rounded-full bg-indigo-600 font-semibold hover:bg-indigo-700"
              >
                Selecionar novo horário
              </Button>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
