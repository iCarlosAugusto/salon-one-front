import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceCard } from "./client-components/service-card";
import { BookingSummary } from "./client-components/booking-summary";
import { MobileBottomBar } from "./client-components/mobile-bottom-bar";
import { BookingProvider } from "./client-components/booking-provider";

type Service = {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  price: string;
  duration: number;
  category: "featured" | "services" | "combos" | null;
  imageUrl: string | null;
  isActive: boolean;
};

type Salon = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  logo: string | null;
  coverImage: string | null;
  website: string | null;
  timezone: string | null;
  currency: string | null;
  allowOnlineBooking: boolean;
  requireBookingApproval: boolean;
  defaultSlotInterval: number | null;
  maxAdvanceBookingDays: number | null;
  minAdvanceBookingHours: number | null;
  isActive: boolean;
  services: Service[];
};

type Employee =   {
  id: string;
  salonId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  hiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const formatCurrency = (value: string | number, currency: string | null = "BRL") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value));

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) return `${hours} h`;
  return `${hours} h ${remaining} min`;
};

async function getSalon(): Promise<Salon | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/salons/barber-top`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar: ${response.status}`);
    }

    const salon = (await response.json()) as Salon;

    return {
      ...salon,
      services: salon.services.map((service) => ({
        ...service,
        category: service.category as Service["category"],
      })),
    };
  } catch (error) {
    console.error("Falha ao carregar dados da barbearia", error);
    return null;
  }
}

async function getEmployeeById(id: string): Promise<Employee | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
  if (!baseUrl) {
    return null;
  }
  const response = await fetch(`${baseUrl}/employees/${id}`, {
    next: { revalidate: false },
  });
  if (!response.ok) {
    console.error("Falha ao carregar dados do funcionário", response.status);
    return null;
  }
  const employee = (await response.json()) as Employee;
  return employee;
}

async function getSalonById(id: string): Promise<Salon | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
  if (!baseUrl) {
    return null;
  }
  const response = await fetch(`${baseUrl}/salons/${id}`, {
    next: { revalidate: false },
  });
  if (!response.ok) {
    console.error("Falha ao carregar dados da barbearia", response.status);
    return null;
  }
  const salon = (await response.json()) as Salon;
  return salon; 
}

async function getEmployeeServices(id: string): Promise<Service[] | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
  if (!baseUrl) {
    return [];
  }
  const response = await fetch(`${baseUrl}/employees/${id}/services`, {
    next: { revalidate: false },
  });
  if (!response.ok) {
    console.error("Falha ao carregar dados dos serviços do funcionário", response.status);
    return [];
  }
  const services = (await response.json()) as Service[];
  return services;
}

export default async function Booking({ searchParams }: { searchParams: Promise<{ employeeId?: string }> }) {
  const { employeeId } = await searchParams;

  if (!employeeId) {
    return <div>Funcionário não encontrado</div>;
  }
  const [salon, employee, employeeServices] = await Promise.all([
    getSalonById("742e6600-9175-4524-aa15-1d9b39dcb282"),
    getEmployeeById(employeeId),
    getEmployeeServices(employeeId),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      {/* Booking Provider - sets employee in store */}
      <BookingProvider employee={employee} salonSlug={salon?.slug} />
      
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-slate-200 bg-white">
              <span className="sr-only">Voltar</span>
              <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M15 6l-6 6 6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
            <div>
              <p className="text-sm font-medium text-slate-500">Serviços</p>
              <h1 className="text-2xl font-semibold sm:text-3xl">Descubra e agende em poucos toques</h1>
            </div>
          </div>
          <Button variant="outline" className="hidden rounded-full border-slate-200 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 sm:inline-flex">
            Preciso de ajuda
          </Button>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-[0_20px_80px_-28px_rgba(15,23,42,0.32)] ring-1 ring-slate-100 lg:flex-row lg:gap-10">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-14 w-14">
                <AvatarImage src={employee?.avatar ?? ""} alt={employee?.firstName ?? ""} />
                <AvatarFallback>{employee?.firstName?.charAt(0) ?? ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">{employee?.firstName ?? ""}</span>
                <span className="text-xs text-slate-500">{employee?.role ?? ""}</span>
              </div>
            </div>

            <div className="space-y-6" id="services">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Serviços</h2>
              </div>
              <div className="space-y-3">
                {employeeServices?.map((service) => (
                  <ServiceCard key={service.id} service={service} currency={salon?.currency ?? null} />
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full max-w-xl space-y-4 self-start lg:w-80 hidden lg:block">
            <BookingSummary 
              employeeName={employee?.firstName ?? null}
              salonName={salon?.name ?? null}
              salonCity={salon?.city ?? null}
              salonState={salon?.state ?? null}
              currency={salon?.currency ?? null}
            />

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Sobre o espaço</CardTitle>
                <CardDescription>Conforto, música e atendimento com foco em agilidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>{salon?.allowOnlineBooking ? "Reservas online ativadas" : "Apenas agendamento no local"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-amber-500" />
                  <span>Profissionais certificados com feedback contínuo dos clientes.</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        
        {/* Mobile Bottom Bar */}
        <MobileBottomBar currency={salon?.currency ?? null} />
      </div>
    </div>
  );
}