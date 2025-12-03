"use client"

import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Employee, Service } from "@/interfaces";
import { useBookingStore } from "@/lib/store/flow-booking-store";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Clock3,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import { useAppointmentStore } from "@/lib/store/flow-booking-store";

interface ServiceCardSelectableEmployeeProps {
    service: Service;
    selectedEmployee: Employee | null;
}

const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
    if (remaining === 0) return `${hours} h`;
    return `${hours} h ${remaining} min`;
  };
  
  const formatCurrency = (value: number, currency: string | null = "BRL") =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency ?? "BRL",
      minimumFractionDigits: 2,
    }).format(value);

export default function ServiceCardSelectableEmployee({ service, selectedEmployee }: ServiceCardSelectableEmployeeProps) {
  const {
    toggleService,
    isServiceSelected,
    addEmployeeToService,
    removeEmployeeFromService,
  } = useBookingStore();

  const { addService, selectedEmployee: selectedEmployeeAppointment, date, services } = useAppointmentStore();

  const selectedServiceEntry = useBookingStore((state) =>
    state.services.find((s) => s.id === service.id)
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const isSelected = isServiceSelected(service.id);

  const currentEmployee = useMemo(
    () => selectedServiceEntry?.employeeSelected ?? selectedEmployee,
    [selectedEmployee, selectedServiceEntry?.employeeSelected]
  );

  const fetchEmployeesByServiceId = async (serviceId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
      return [];
    }
    const response = await fetch(`${baseUrl}/services/${serviceId}/employees`);
    if (!response.ok) {
      return [];
    }
    const employees = (await response.json()) as Employee[];
    return employees;
  };

  useEffect(() => {
    if (!isDialogOpen) return;

    let isMounted = true;
    const loadEmployees = async () => {
      setIsLoadingEmployees(true);
      setEmployeeError(null);
      try {
        const fetchedEmployees = await fetchEmployeesByServiceId(service.id);
        if (isMounted) {
          setEmployees(fetchedEmployees);
        }
      } catch (error) {
        if (isMounted) {
          setEmployeeError("Não foi possível carregar os profissionais.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingEmployees(false);
        }
      }
    };

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, [isDialogOpen, service.id]);

  const handleSelectEmployee = (employee: Employee | null) => {
    if(employee) {
      addEmployeeToService(service.id, employee);
    }

    // if (!isSelected) {
    //   toggleService(service, employee);
    // } else if (employee) {
    //   addEmployeeToService(service.id, employee);
    // } else {
    //   removeEmployeeFromService(service.id);
    // }
    // setIsDialogOpen(false);
  };

  const getEmployeeInitials = (employee: Employee) =>
    `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div
        role="button"
        aria-pressed={isSelected}
        onClick={() => addService({ ...service })}
        className={cn(
          "group w-full flex flex-col gap-3 rounded-xl border p-4 text-left transition-all",
          "hover:-translate-y-0.5 hover:shadow-md",
          isSelected
            ? "border-indigo-600/80 bg-indigo-50 ring-2 ring-indigo-600/20 shadow-[0_12px_40px_-20px_rgba(99,102,241,0.5)]"
            : "border-slate-200 bg-white shadow-[0_12px_36px_-24px_rgba(0,0,0,0.22)] hover:border-slate-300"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-slate-900">{service.name}</p>
              {isSelected && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">
              {service.description ?? "Serviço premium com finalização exclusiva."}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn(isSelected && "border-indigo-600 text-indigo-700")}>
                <Clock3 className="h-4 w-4" /> {formatDuration(service.duration)}
              </Badge>
              <Badge variant="outline" className={cn(isSelected && "border-indigo-100 bg-indigo-100 text-indigo-700")}>
                {formatCurrency(parseFloat(service.price), "BRL")}
              </Badge>
            </div>
          </div>
        </div>

        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "justify-start rounded-full border-slate-200 bg-white px-4 py-2 text-base font-medium text-slate-800 shadow-sm hover:bg-slate-50",
              "transition-colors",
              !currentEmployee && "ring-1 ring-indigo-200"
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <UserRound className="h-5 w-5" />
            </span>
            <span className="flex-1 text-left">
              {currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : "Qualquer profissional"}
            </span>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-3xl gap-6 rounded-2xl p-0 sm:max-w-3xl">
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-2xl font-semibold text-slate-900">
              {service.name}
            </DialogTitle>
            <DialogDescription className="text-base text-slate-500">
              Escolha o profissional para este serviço.
            </DialogDescription>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-3">
            <button
              onClick={() => handleSelectEmployee(null)}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                "hover:border-indigo-300 hover:shadow-[0_12px_36px_-24px_rgba(99,102,241,0.4)]",
                !currentEmployee
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-slate-200"
              )}
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Users className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">Qualquer profissional</p>
                <p className="text-sm text-slate-500">para disponibilidade máxima</p>
              </div>
              {!currentEmployee && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>

            {isLoadingEmployees && (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando profissionais...
              </div>
            )}

            {employeeError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {employeeError}
              </div>
            )}

            {!isLoadingEmployees && !employeeError && employees.map((employee) => {
              const isCurrent = currentEmployee?.id === employee.id;
              return (
                <div
                  key={employee.id}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-4 transition-all",
                    "hover:border-slate-300 hover:shadow-[0_12px_36px_-24px_rgba(0,0,0,0.25)]",
                    isCurrent && "border-indigo-500 ring-2 ring-indigo-100"
                  )}
                >
                  <Avatar className="size-14">
                    <AvatarImage src={employee.avatar ?? undefined} alt={`${employee.firstName} ${employee.lastName}`} />
                    <AvatarFallback className="bg-slate-100 text-slate-700">
                      {getEmployeeInitials(employee)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{employee.role}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCurrent && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-5"
                      onClick={() => handleSelectEmployee(employee)}
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              );
            })}

            {!isLoadingEmployees && !employeeError && employees.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Nenhum profissional disponível para este serviço.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
