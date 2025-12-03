"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

type Step = "phone" | "otp" | "name";

interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OtpModal({ open, onOpenChange, onSuccess }: OtpModalProps) {
  const [step, setStep] = React.useState<Step>("phone");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isUpdatingName, setIsUpdatingName] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [otpSentAt, setOtpSentAt] = React.useState<Date | null>(null);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  const { signInWithOtp ,verifyOtp, updateUserMetadata, user } = useAuth();

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setStep("phone");
      setName("");
      setPhone("");
      setOtp("");
      setError(null);
      setIsSendingOtp(false);
      setIsVerifying(false);
      setIsUpdatingName(false);
      setOtpSentAt(null);
      setResendCooldown(0);
    }
  }, [open]);

  // Cooldown timer for resend
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Get phone in E.164 format for Supabase
  const getE164Phone = () => {
    const numbers = phone.replace(/\D/g, "");
    return `+55${numbers}`; // Brazil country code
  };

  async function handleSendOtp() {
    setError(null);

    const phoneNumbers = phone.replace(/\D/g, "");
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      setError("Digite um número de telefone válido.");
      return;
    }

    setIsSendingOtp(true);

    try {
      await signInWithOtp(getE164Phone());
      setOtpSentAt(new Date());
      setResendCooldown(60); // 60 second cooldown
      setStep("otp");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao enviar código.";
      setError(message);
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0) return;
    
    setError(null);
    setIsSendingOtp(true);

    try {
      await signInWithOtp(getE164Phone());
      setOtpSentAt(new Date());
      setResendCooldown(60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao reenviar código.";
      setError(message);
    } finally {
      setIsSendingOtp(false);
    }
  }

  async function handleVerifyOtp() {
    setError(null);

    if (otp.length !== 6) {
      setError("Digite o código completo de 6 dígitos.");
      return;
    }

    setIsVerifying(true);

    try {
      const { user: verifiedUser } = await verifyOtp(getE164Phone(), otp);
      
      // Check if user has a name set
      if (!verifiedUser?.user_metadata?.full_name) {
        setStep("name");
      } else {
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Código inválido ou expirado.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleSaveName() {
    setError(null);

    if (!name.trim()) {
      setError("Digite seu nome.");
      return;
    }

    setIsUpdatingName(true);

    try {
      await updateUserMetadata({ full_name: name.trim() });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao salvar nome.";
      setError(message);
    } finally {
      setIsUpdatingName(false);
    }
  }

  function handleBack() {
    setError(null);
    if (step === "otp") {
      setOtp("");
      setStep("phone");
    } else if (step === "name") {
      // Can't go back from name step after verification
    }
  }

  const currentStepIndex = step === "phone" ? 1 : step === "otp" ? 2 : 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Header with back button */}
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
            <div className="w-9" />
          )}

          <DialogTitle className="flex-1 text-center">
            {step === "phone" && "Identifique-se"}
            {step === "otp" && "Verificação"}
            {step === "name" && "Quase lá!"}
          </DialogTitle>

          <div className="w-9" />
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded-full border text-center text-[11px] leading-6 transition-colors",
                currentStepIndex >= 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background"
              )}
            >
              1
            </div>
            <span>Telefone</span>
          </div>
          <div className="h-px flex-1 mx-2 bg-muted" />
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded-full border text-center text-[11px] leading-6 transition-colors",
                currentStepIndex >= 2
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background"
              )}
            >
              2
            </div>
            <span>Código</span>
          </div>
          <div className="h-px flex-1 mx-2 bg-muted" />
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded-full border text-center text-[11px] leading-6 transition-colors",
                currentStepIndex >= 3
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background"
              )}
            >
              3
            </div>
            <span>Nome</span>
          </div>
        </div>

        {/* Animated steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Phone */}
          {step === "phone" && (
            <motion.div
              key="phone-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Digite seu telefone para receber um código de verificação via SMS.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={formatPhoneNumber(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="text-lg"
                  autoComplete="tel"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendOtp} disabled={isSendingOtp}>
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar código"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Enviamos um código para{" "}
                  <span className="font-semibold text-foreground">
                    {formatPhoneNumber(phone)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Digite o código de 6 dígitos abaixo
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otp}
                  onChange={setOtp}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                    <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                    <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                    <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                    <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Button 
                  onClick={handleVerifyOtp} 
                  disabled={isVerifying || otp.length !== 6}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar código"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={isSendingOtp || resendCooldown > 0}
                  className="text-sm"
                >
                  {isSendingOtp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reenviando...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Reenviar em ${resendCooldown}s`
                  ) : (
                    "Reenviar código"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Name (only for new users) */}
          {step === "name" && (
            <motion.div
              key="name-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="text-center">
                <p className="font-semibold">Telefone verificado!</p>
                <p className="text-sm text-muted-foreground">
                  Agora, digite seu nome para concluir.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Seu nome</Label>
                <Input
                  id="name"
                  placeholder="Como devemos te chamar?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                  autoComplete="name"
                />
              </div>

              <Button 
                onClick={handleSaveName} 
                disabled={isUpdatingName || !name.trim()}
                className="w-full"
              >
                {isUpdatingName ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Concluir"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
