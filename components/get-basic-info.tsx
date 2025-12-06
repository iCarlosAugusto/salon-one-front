import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

interface GetBasicInfoProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onBasicInfoSubmit: (name: string, phone: string) => void;
}

export function GetBasicInfo({ isOpen, onOpenChange, onBasicInfoSubmit }: GetBasicInfoProps) {
    const [info, setInfo] = useState({
        name: "",
        phone: "",
    });
    const [error, setError] = useState("");

    const validate = () => {
        if (!info.name || info.name.length < 2) {
            setError("Nome inválido");
            return false;
        }
        if (!info.phone || info.phone.length < 11) {
            setError("Telefone inválido");
            return false;
        }
        setError("");
        onBasicInfoSubmit(info.name, info.phone);
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Informações básicas</DialogTitle>
                </DialogHeader>
                <Input placeholder="Nome*" onChange={(e) => setInfo({ ...info, name: e.target.value })} />
                <Input placeholder="Telefone*" type="tel" onChange={(e) => setInfo({ ...info, phone: e.target.value })} />

                <p className="text-red-500">{error}</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Fechar</Button>
                    </DialogClose>
                    <Button onClick={() => validate()}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}