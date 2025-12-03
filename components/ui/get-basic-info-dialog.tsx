import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Input } from './input';

interface GetBasicInfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};


function GetBasicInfoDialog({ open, onOpenChange }: GetBasicInfoDialogProps) {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hey, qual é seu nome?</DialogTitle>
                    <DialogDescription>
                        Para continuar com seu agendamento, precisamos de seu nome completo.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Digite seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={formatPhoneNumber(phone)}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    className="text-lg"
                    autoComplete="tel"
                />
            </DialogContent>
        </Dialog>
    )
}

export { GetBasicInfoDialog };