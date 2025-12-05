"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./dialog";
import { Input } from "./input";
import { Button } from "./button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp";
import { useAuth } from "@/lib/hooks/use-auth";
import { Loader2, ArrowLeft, Phone, ShieldCheck, User } from "lucide-react";

interface AuthenticationOTPDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAuthSuccess?: () => void;
}

type AuthStep = "phone" | "otp" | "name";

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -100 : 100,
        opacity: 0,
    }),
};

function AuthenticationOTPDialog({
    open,
    onOpenChange,
    onAuthSuccess,
}: AuthenticationOTPDialogProps) {
    const { signInWithOtp, verifyOtp, updateUserMetadata, user } = useAuth();

    const [step, setStep] = useState<AuthStep>("phone");
    const [direction, setDirection] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setStep("phone");
            setPhone("");
            setOtp("");
            setName("");
            setError(null);
            setIsLoading(false);
            setResendCountdown(0);
        }
    }, [open]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const goToStep = (newStep: AuthStep, dir: number = 1) => {
        setDirection(dir);
        setStep(newStep);
        setError(null);
    };

    const handleSendOtp = useCallback(async () => {
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 11) {
            setError("Por favor, insira um número de telefone válido");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formattedPhone = `+55${cleanPhone}`;
            await signInWithOtp(formattedPhone);
            setResendCountdown(60);
            goToStep("otp");
        } catch (err) {
            setError("Erro ao enviar código. Tente novamente.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [phone, signInWithOtp]);

    const handleVerifyOtp = useCallback(async () => {
        if (otp.length !== 6) {
            setError("Por favor, insira o código completo");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const formattedPhone = `+55${cleanPhone}`;
            const { user: verifiedUser } = await verifyOtp(formattedPhone, otp);

            // Check if user already has a name
            if (verifiedUser?.user_metadata?.full_name) {
                // User already has name, auth complete
                onAuthSuccess?.();
                onOpenChange(false);
            } else {
                // New user, need to collect name
                goToStep("name");
            }
        } catch (err) {
            setError("Código inválido. Verifique e tente novamente.");
            setOtp("");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [otp, phone, verifyOtp, onAuthSuccess, onOpenChange]);

    const handleSaveName = useCallback(async () => {
        if (name.trim().length < 2) {
            setError("Por favor, insira seu nome completo");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await updateUserMetadata({ full_name: name.trim() });
            onAuthSuccess?.();
            onOpenChange(false);
        } catch (err) {
            setError("Erro ao salvar nome. Tente novamente.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [name, updateUserMetadata, onAuthSuccess, onOpenChange]);

    const handleResendOtp = useCallback(async () => {
        if (resendCountdown > 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const cleanPhone = phone.replace(/\D/g, "");
            const formattedPhone = `+55${cleanPhone}`;
            await signInWithOtp(formattedPhone);
            setResendCountdown(60);
            setOtp("");
        } catch (err) {
            setError("Erro ao reenviar código. Tente novamente.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [phone, resendCountdown, signInWithOtp]);

    // Auto-verify when OTP is complete
    useEffect(() => {
        if (otp.length === 6 && step === "otp" && !isLoading) {
            handleVerifyOtp();
        }
    }, [otp, step, isLoading, handleVerifyOtp]);

    const getStepContent = () => {
        switch (step) {
            case "phone":
                return (
                    <motion.div
                        key="phone"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6"
                    >
                        <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                                <Phone className="h-8 w-8 text-indigo-600" />
                            </div>
                            <DialogTitle className="text-xl">Qual é seu telefone?</DialogTitle>
                            <DialogDescription>
                                Enviaremos um código de verificação para confirmar seu agendamento.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                value={formatPhoneNumber(phone)}
                                onChange={(e) => {
                                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                                    setError(null);
                                }}
                                className="h-14 text-center text-xl tracking-wider"
                                autoComplete="tel"
                                autoFocus
                            />

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-red-500"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                onClick={handleSendOtp}
                                disabled={isLoading || phone.replace(/\D/g, "").length < 11}
                                className="h-12 w-full rounded-full bg-indigo-600 text-base font-semibold hover:bg-indigo-700"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Continuar"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                );

            case "otp":
                return (
                    <motion.div
                        key="otp"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6"
                    >
                        <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                                <ShieldCheck className="h-8 w-8 text-emerald-600" />
                            </div>
                            <DialogTitle className="text-xl">Código de verificação</DialogTitle>
                            <DialogDescription>
                                Digite o código de 6 dígitos enviado para{" "}
                                <span className="font-medium text-slate-900">
                                    {formatPhoneNumber(phone)}
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col items-center space-y-4">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                                    <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                                    <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                                    <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                                    <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                                    <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
                                </InputOTPGroup>
                            </InputOTP>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-red-500"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {isLoading && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verificando...
                                </div>
                            )}

                            <div className="flex flex-col items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendCountdown > 0 || isLoading}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 disabled:text-slate-400"
                                >
                                    {resendCountdown > 0
                                        ? `Reenviar código em ${resendCountdown}s`
                                        : "Reenviar código"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => goToStep("phone", -1)}
                                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Alterar número
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );

            case "name":
                return (
                    <motion.div
                        key="name"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="space-y-6"
                    >
                        <DialogHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <User className="h-8 w-8 text-amber-600" />
                            </div>
                            <DialogTitle className="text-xl">Como podemos te chamar?</DialogTitle>
                            <DialogDescription>
                                Informe seu nome para personalizarmos sua experiência.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <Input
                                id="name"
                                type="text"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(null);
                                }}
                                className="h-14 text-center text-lg"
                                autoComplete="name"
                                autoFocus
                            />

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-red-500"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <Button
                                onClick={handleSaveName}
                                disabled={isLoading || name.trim().length < 2}
                                className="h-12 w-full rounded-full bg-indigo-600 text-base font-semibold hover:bg-indigo-700"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Finalizar"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="overflow-hidden sm:max-w-md">
                <AnimatePresence mode="wait" custom={direction}>
                    {getStepContent()}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}

export { AuthenticationOTPDialog };