"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

type Step = "customer" | "otp";

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OtpModal({ open, onOpenChange }: OtpModalProps) {
  const [step, setStep] = React.useState<Step>("customer");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setStep("customer");
      setName("");
      setPhone("");
      setOtp("");
      setError(null);
      setIsSendingOtp(false);
      setIsVerifying(false);
    }
  }, [open]);

  function handleNextStep() {
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Por favor, preencha nome e telefone.");
      return;
    }

    setIsSendingOtp(true);
    // Chame sua API de envio de OTP aqui
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep("otp");
    }, 600);
  }

  function handleVerifyOtp() {
    setError(null);

    if (!otp.trim()) {
      setError("Digite o código recebido.");
      return;
    }

    setIsVerifying(true);
    // Chame sua API de verificação de OTP aqui
    setTimeout(() => {
      setIsVerifying(false);
      onOpenChange(false);
    }, 600);
  }

  function handleBack() {
    if (step === "otp") {
      setError(null);
      setStep("customer");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Header com seta de voltar + título centralizado */}
        <DialogHeader className="flex flex-row items-center gap-2">
          {step === "otp" ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            // placeholder para manter o título centralizado
            <div className="w-9" />
          )}

          <DialogTitle className="flex-1 text-center">
            {step === "customer" ? "Identifique-se" : "Verificação de código"}
          </DialogTitle>

          {/* placeholder para balancear o header */}
          <div className="w-9" />
        </DialogHeader>

        {/* Stepper simples */}
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full border text-center text-[11px] leading-6 ${
                step === "customer"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background"
              }`}
            >
              1
            </div>
            <span>Dados do cliente</span>
          </div>
          <div className="h-px flex-1 mx-2 bg-muted" />
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full border text-center text-[11px] leading-6 ${
                step === "otp"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background"
              }`}
            >
              2
            </div>
            <span>Verificação OTP</span>
          </div>
        </div>

        {/* Animação dos steps */}
        <AnimatePresence mode="wait">
          {step === "customer" && (
            <motion.div
              key="customer-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome do cliente"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleNextStep} disabled={isSendingOtp}>
                  {isSendingOtp ? "Enviando código..." : "Continuar"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Enviamos um código para o telefone{" "}
                <span className="font-medium">{phone}</span>.  
                Digite o código abaixo para confirmar.
              </p>

              <div className="space-y-2">
                <InputOTP maxLength={6}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="mt-4 flex justify-between gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    // lógica para reenviar código
                    setIsSendingOtp(true);
                    setTimeout(() => setIsSendingOtp(false), 600);
                  }}
                >
                  {isSendingOtp ? "Reenviando..." : "Reenviar código"}
                </Button>

                <Button onClick={handleVerifyOtp} disabled={isVerifying}>
                  {isVerifying ? "Verificando..." : "Confirmar código"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
