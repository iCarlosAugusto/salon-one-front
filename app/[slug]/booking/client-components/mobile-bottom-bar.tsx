"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { ChevronUp } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (value: number, currency: string | null = "BRL") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(value);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h e ${remaining} min`;
};

type MobileBottomBarProps = {
  currency?: string | null;
};

export function MobileBottomBar({ currency }: MobileBottomBarProps) {
  const router = useRouter();
  const { services, getTotalDuration, getTotalPrice } = useBookingStore();
  const pathname = usePathname();
  const slug = pathname.split('/')[1];
  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  const handleContinue = () => {
    if (services.length > 0) {
      router.push(`/${slug}/hours`);
    }
  };

  return (
    <>
      <Drawer>
        <DrawerContent className="min-h-[100px]">
          <DrawerHeader>
            <DrawerTitle> {services.length > 0 ? "Resumo do agendamento" : "Nenhum serviço selecionado"}</DrawerTitle>
            <DrawerDescription>
              {services.length > 0 ? "Confira os serviços selecionados e o valor total do agendamento." : "Selecione pelo menos um serviço para continuar."}
            </DrawerDescription>
          </DrawerHeader>
          {services.length > 0 && (
            <>
              <ScrollArea className="h-[400px] w-full">
                <div className="p-4">
                  {
                    services.map((service) => (
                      <>
                        <div key={service.id} className="h-10 w-full my-5">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{service.name}</span>
                              <div>
                                <span className="text-sm text-slate-500">{formatDuration(service.duration)} •</span>
                                <span className="text-sm text-slate-500">{service.employeeSelected?.firstName ?? " Qualquer profissional"}</span>
                              </div>
                            </div>
                            <span className="text-base font-semibold text-slate-900">{formatCurrency(parseFloat(service.price), currency)}</span>
                          </div>
                        </div>
                        <Separator />
                      </>
                    ))
                  }
                </div>
              </ScrollArea>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Total</span>
                  <span className="text-base font-semibold text-slate-900">{formatCurrency(totalPrice, currency)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Duração total</span>
                  <span className="text-base font-semibold text-slate-900">{formatDuration(totalDuration)}</span>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
        <div className="fixed border-t border-t-slate-200 bottom-0 left-0 right-0 z-50 flex flex-col gap-2 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {services.length === 0
                  ? "Nenhum serviço selecionado"
                  : `a partir de ${formatCurrency(totalPrice, currency)}`
                }
              </span>
              {services.length > 0 && (
                <span className="text-sm font-normal text-slate-500">
                  {services.length} {services.length === 1 ? "serviço" : "serviços"} • {formatDuration(totalDuration)}
                </span>
              )}
            </div>
            <DrawerTrigger><ChevronUp /></DrawerTrigger>
          </div>
          <Button
            onClick={handleContinue}
            disabled={services.length === 0}
            className="w-full rounded-full bg-indigo-600 text-base font-semibold transition-all hover:bg-indigo-700 hover:scale-[1.02] disabled:scale-100 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {services.length === 0 ? "Selecione um serviço" : "Continuar"}
          </Button>
        </div>
      </Drawer>
    </>
  );
}
