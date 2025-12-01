"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useBookingStore } from "@/lib/store/booking-store";
import { cn } from "@/lib/utils";

type BookingTimerProps = {
  onExpire?: () => void;
  warningThreshold?: number; // Show warning when below this many seconds (default: 120 = 2 minutes)
};

export function BookingTimer({ onExpire, warningThreshold = 120 }: BookingTimerProps) {
  const { 
    selectedTime, 
    getTimeRemaining, 
    clearExpiredBooking, 
    isBookingExpired,
    extendSession 
  } = useBookingStore();

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!selectedTime) {
      setTimeRemaining(0);
      setShowWarning(false);
      return;
    }

    // Initial check
    if (isBookingExpired()) {
      clearExpiredBooking();
      onExpire?.();
      return;
    }

    // Update timer every second
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);

      // Check if expired
      if (remaining <= 0) {
        clearExpiredBooking();
        onExpire?.();
        clearInterval(interval);
        return;
      }

      // Show warning when below threshold
      const secondsRemaining = Math.floor(remaining / 1000);
      setShowWarning(secondsRemaining <= warningThreshold && secondsRemaining > 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTime, getTimeRemaining, clearExpiredBooking, isBookingExpired, onExpire, warningThreshold]);

  if (!selectedTime || timeRemaining <= 0) {
    return null;
  }

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const isLowTime = minutes < 2;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-top-2 rounded-xl border px-4 py-3 transition-all",
        showWarning
          ? "border-amber-200 bg-amber-50"
          : "border-slate-200 bg-slate-50"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {showWarning ? (
            <AlertTriangle className={cn("h-4 w-4 animate-pulse text-amber-600")} />
          ) : (
            <Clock className="h-4 w-4 text-slate-600" />
          )}
          <div className="flex flex-col">
            <span className={cn(
              "text-sm font-semibold",
              showWarning ? "text-amber-900" : "text-slate-900"
            )}>
              Tempo restante para concluir
            </span>
            {showWarning && (
              <span className="text-xs text-amber-700">
                Complete sua reserva antes que o horário expire
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
            showWarning
              ? "bg-amber-100 text-amber-900"
              : "bg-white text-slate-900"
          )}>
            <span className={cn(isLowTime && showWarning && "animate-pulse")}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {showWarning && (
            <button
              onClick={extendSession}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-amber-700 hover:scale-105"
            >
              +15 min
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

