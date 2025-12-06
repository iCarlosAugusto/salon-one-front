"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Phone, Loader2, CheckCircle2, AlertCircle, Calendar, ArrowRight } from "lucide-react";

interface GetBasicInfoProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onBasicInfoSubmit: (name: string, phone: string) => Promise<void>;
}

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

type Step = "form" | "loading" | "success" | "error";

export function GetBasicInfo({ isOpen, onOpenChange, onBasicInfoSubmit }: GetBasicInfoProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
    const [step, setStep] = useState<Step>("form");
    const [errorMessage, setErrorMessage] = useState("");

    const resetState = () => {
        setName("");
        setPhone("");
        setErrors({});
        setStep("form");
        setErrorMessage("");
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetState();
        }
        onOpenChange(open);
    };

    const validate = () => {
        const newErrors: { name?: string; phone?: string } = {};

        if (!name || name.trim().length < 2) {
            newErrors.name = "Por favor, insira seu nome completo";
        }

        const cleanPhone = phone.replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length < 11) {
            newErrors.phone = "Por favor, insira um telefone válido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setStep("loading");

        try {
            await onBasicInfoSubmit(name.trim(), phone.replace(/\D/g, ""));
            setStep("success");
        } catch (error) {
            setStep("error");
            setErrorMessage(error instanceof Error ? error.message : "Erro ao confirmar agendamento");
        }
    };

    const handleRetry = () => {
        setStep("form");
        setErrorMessage("");
    };

    const slideVariants = {
        enter: { opacity: 0, y: 20 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="overflow-hidden sm:max-w-md">
                <AnimatePresence mode="wait">
                    {step === "form" && (
                        <motion.div
                            key="form"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <DialogHeader className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <DialogTitle className="text-xl">Quase lá!</DialogTitle>
                                <DialogDescription>
                                    Preencha seus dados para confirmar o agendamento
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                        Nome completo
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="name"
                                            placeholder="Seu nome"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                if (errors.name) setErrors({ ...errors, name: undefined });
                                            }}
                                            className={`h-12 pl-10 ${errors.name ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                                            autoComplete="name"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.name && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.name}
                                        </motion.p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                        Telefone
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            value={formatPhoneNumber(phone)}
                                            onChange={(e) => {
                                                setPhone(e.target.value.replace(/\D/g, "").slice(0, 11));
                                                if (errors.phone) setErrors({ ...errors, phone: undefined });
                                            }}
                                            className={`h-12 pl-10 ${errors.phone ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                                            autoComplete="tel"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500"
                                        >
                                            {errors.phone}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    className="flex-1 h-12 rounded-full"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="flex-1 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Confirmar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "loading" && (
                        <motion.div
                            key="loading"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center py-12"
                        >
                            <div className="relative">
                                <div className="h-20 w-20 rounded-full border-4 border-indigo-100" />
                                <Loader2 className="absolute inset-0 h-20 w-20 animate-spin text-indigo-600" />
                            </div>
                            <p className="mt-6 text-lg font-medium text-slate-900">Confirmando agendamento...</p>
                            <p className="mt-1 text-sm text-slate-500">Aguarde um momento</p>
                        </motion.div>
                    )}

                    {step === "success" && (
                        <motion.div
                            key="success"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200"
                            >
                                <CheckCircle2 className="h-12 w-12 text-white" />
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 text-2xl font-bold text-slate-900"
                            >
                                Agendamento confirmado!
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-2 text-center text-slate-500"
                            >
                                Você receberá uma confirmação por WhatsApp.
                                <br />
                                Até breve!
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 w-full"
                            >
                                <Button
                                    onClick={() => handleOpenChange(false)}
                                    className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700"
                                >
                                    Voltar ao início
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === "error" && (
                        <motion.div
                            key="error"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200"
                            >
                                <AlertCircle className="h-12 w-12 text-white" />
                            </motion.div>
                            <h3 className="mt-6 text-2xl font-bold text-slate-900">Ops, algo deu errado</h3>
                            <p className="mt-2 text-center text-slate-500">{errorMessage}</p>
                            <div className="mt-6 flex w-full gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    className="flex-1 h-12 rounded-full"
                                >
                                    Fechar
                                </Button>
                                <Button
                                    onClick={handleRetry}
                                    className="flex-1 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Tentar novamente
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}