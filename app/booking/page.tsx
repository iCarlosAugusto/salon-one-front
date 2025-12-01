import { BadgeCheck, Check, Clock3, MapPin, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger as SheetTriggerBase } from "@/components/ui/sheet";

const SheetTrigger = SheetTriggerBase as React.ComponentType<React.ComponentProps<typeof SheetTriggerBase> & React.RefAttributes<HTMLButtonElement>>;

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

type Employee = {
  name: string;
  role: string;
  slug: string;
  rating: number;
  reviews: number;
  cover: string;
  profileUrl: string;
};

const FALLBACK_SALON: Salon = {
  id: "7e446c70-e87c-4ed3-a288-40171faae563",
  name: "Barbearia Top",
  slug: "barber-top",
  description: "Experiência premium, ambiente aconchegante e profissionais especialistas.",
  email: "barber@barber.com.br",
  phone: "62982399800",
  address: "Rua 101, Goiânia",
  city: "Goiânia",
  state: "Goiás",
  zipCode: "74735150",
  country: "Brasil",
  logo: null,
  coverImage:
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80",
  website: null,
  timezone: "America/Sao_Paulo",
  currency: "BRL",
  allowOnlineBooking: true,
  requireBookingApproval: false,
  defaultSlotInterval: 10,
  maxAdvanceBookingDays: 90,
  minAdvanceBookingHours: 2,
  isActive: true,
  services: [
    {
      id: "corte-cabelo",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Corte de cabelo",
      description: "Começamos com um lavado e tratamento aromático. Finalização com styling personalizado.",
      price: "80.00",
      duration: 60,
      category: "featured",
      imageUrl: null,
      isActive: true,
    },
    {
      id: "perfilado-cejas",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Perfilado de sobrancelhas",
      description: "Design preciso e natural com finalização em balm refrescante.",
      price: "40.00",
      duration: 20,
      category: "featured",
      imageUrl: null,
      isActive: true,
    },
    {
      id: "assessoramento",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Assessoria e corte de cabelo",
      description: "Consultoria completa para adaptar o corte ao seu estilo e rotina.",
      price: "120.00",
      duration: 90,
      category: "services",
      imageUrl: null,
      isActive: true,
    },
    {
      id: "barbaterapia",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Barboterapia e corte de cabelo",
      description: "Vapor quente, toalha e hidratação para barba + corte completo.",
      price: "95.00",
      duration: 90,
      category: "services",
      imageUrl: null,
      isActive: true,
    },
    {
      id: "combo-classic",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Combo clássico",
      description: "Corte + barba + sobrancelha com relaxamento facial.",
      price: "150.00",
      duration: 120,
      category: "combos",
      imageUrl: null,
      isActive: true,
    },
  ],
};

const employees: Employee[] = [
  {
    name: "Jhonathan",
    role: "Gângster",
    slug: "jhonathan",
    rating: 4.9,
    reviews: 128,
    cover: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    profileUrl: "/employees/jhonathan",
  },
  {
    name: "Pablo",
    role: "Barbeiro Sênior",
    slug: "pablo",
    rating: 4.8,
    reviews: 96,
    cover: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    profileUrl: "/employees/pablo",
  },
];

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

async function getSalon(): Promise<Salon> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;

  if (!baseUrl) {
    return FALLBACK_SALON;
  }

  try {
    const response = await fetch(`${baseUrl}/salons/barber-top`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar: ${response.status}`);
    }

    const salon = (await response.json()) as Salon;

    return {
      ...FALLBACK_SALON,
      ...salon,
      services: (salon.services?.length ? salon.services : FALLBACK_SALON.services).map((service) => ({
        ...service,
        category: service.category as Service["category"],
      })),
    };
  } catch (error) {
    console.error("Falha ao carregar dados da barbearia", error);
    return FALLBACK_SALON;
  }
}

function ServiceCard({ service, currency }: { service: Service; currency: string | null }) {
  return (
    <div className="group flex gap-3 rounded-sm border border-slate-200 bg-white p-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-slate-300">
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">{service.name}</p>
            <p className="text-sm text-slate-500">{service.description ?? "Serviço premium com finalização exclusiva."}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            <Clock3 className="h-4 w-4" /> {formatDuration(service.duration)}
          </Badge>
          <Badge variant="default">
            {formatCurrency(service.price, currency)}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default async function Booking() {
  const salon = await getSalon();
  const activeServices = salon.services.filter((service) => service.isActive);

  const featured = activeServices.filter((service) => service.category === "featured");
  const services = activeServices.filter((service) => service.category === "services");
  const combos = activeServices.filter((service) => service.category === "combos");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
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
                <AvatarImage src={employees[0].cover} alt={employees[0].name} />
                <AvatarFallback>{employees[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">{employees[0].name}</span>
                <span className="text-xs text-slate-500">{employees[0].role}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-600">
              <a className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200" href="#em-destaque">
                Em destaque
              </a>
              <a className="rounded-full px-4 py-2" href="#servicos">
                Serviços
              </a>
              <a className="rounded-full px-4 py-2" href="#combos">
                Combos
              </a>
            </div>

            <div className="space-y-6" id="em-destaque">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Em destaque</h2>
              </div>
              <div className="space-y-3">
                {featured.map((service) => (
                  <ServiceCard key={service.id} service={service} currency={salon.currency} />
                ))}
              </div>
            </div>

            <div className="space-y-6" id="servicos">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Serviços</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Online {salon.allowOnlineBooking ? "ativo" : "pausado"}
                </span>
              </div>
              <div className="space-y-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} currency={salon.currency} />
                ))}
              </div>
            </div>

            <div className="space-y-6" id="combos">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Combos</h2>
                <span className="text-sm text-slate-500">Pacotes especiais com duração estendida.</span>
              </div>
              <div className="space-y-3">
                {combos.map((service) => (
                  <ServiceCard key={service.id} service={service} currency={salon.currency} />
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full max-w-xl space-y-4 self-start lg:w-80 hidden lg:block">
            <Card className="overflow-hidden border-slate-200 shadow-[0_18px_60px_-28px_rgba(15,23,42,0.32)]">
              <CardHeader className="space-y-1 bg-gradient-to-r from-indigo-50 to-slate-50">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Resumo</p>
                <CardTitle className="flex items-start justify-between text-lg">
                  <span className="flex flex-1 flex-col text-slate-900">
                    {employees[0].name}
                    <span className="text-sm font-normal text-slate-500">{salon.name}</span>
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4" /> {salon.city ?? "Cidade"} · {salon.state ?? "Estado"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-sm text-slate-700">
                <div className="space-y-3">
                  {featured.slice(0, 1).map((service) => (
                    <div key={service.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-500">{formatDuration(service.duration)}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(service.price, salon.currency)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(80, salon.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Taxas</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(0, salon.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                    <span>Total</span>
                    <span>{formatCurrency(80, salon.currency)}</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl bg-indigo-50 p-4 text-indigo-900">
                  <p className="text-sm font-semibold">Políticas rápidas</p>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-indigo-800">
                    <li>Cancelamento sem custo até {salon.minAdvanceBookingHours ?? 2}h antes.</li>
                    <li>Pagamento no local ou confirmação online segura.</li>
                    <li>Horários atualizados em tempo real.</li>
                  </ul>
                </div>

                <Button className="w-full rounded-full bg-indigo-600 text-base font-semibold hover:bg-indigo-700">
                  Continuar
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Sobre o espaço</CardTitle>
                <CardDescription>Conforto, música e atendimento com foco em agilidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>{salon.allowOnlineBooking ? "Reservas online ativadas" : "Apenas agendamento no local"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-indigo-500" />
                  <span>Intervalos de {salon.defaultSlotInterval ?? 10} minutos</span>
                </div>
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-amber-500" />
                  <span>Profissionais certificados com feedback contínuo dos clientes.</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        <div className="fixed border-t border-t-black bottom-0 left-0 right-0 z-50 flex flex-col gap-2 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] lg:hidden">
          <div className="flex flex-col justify-between">
            <span className="text-sm font-semibold text-slate-900">a partir de R$ 297,00</span>
            <span className="text-sm font-normal text-slate-500">1 serviço • 2 h e 25 min</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full rounded-full bg-indigo-600 text-base font-semibold hover:bg-indigo-700">
                Continuar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-full">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}