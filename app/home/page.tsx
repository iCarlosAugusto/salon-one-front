import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

type Service = {
  id: string;
  salonId: string;
  name: string;
  description: string | null;
  price: string;
  duration: number;
  category: string | null;
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

const FALLBACK_SALON: Salon = {
  id: "7e446c70-e87c-4ed3-a288-40171faae563",
  name: "Barbearia Top",
  slug: "barber-top",
  description: "Experiência premium, atmosfera aconchegante e atendimento rápido.",
  email: "barber@barber.com.br",
  phone: "62982399800",
  address: "Rua 101, Goiânia",
  city: "Goiânia",
  state: "Goiás",
  zipCode: "74735150",
  country: "Brasil",
  logo: null,
  coverImage: null,
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
      id: "a6a3fe2e-a201-44ff-8482-85326c972b1a",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Barba",
      description: "Linha bem marcada com hidratação e toalha quente.",
      price: "20.00",
      duration: 40,
      category: null,
      imageUrl: null,
      isActive: true,
    },
    {
      id: "6a41c857-45c9-4eba-a325-e3d1c39c2b28",
      salonId: "7e446c70-e87c-4ed3-a288-40171faae563",
      name: "Sobrancelha",
      description: "Design natural com acabamento preciso.",
      price: "10.00",
      duration: 20,
      category: null,
      imageUrl: null,
      isActive: true,
    },
  ],
};

const galleryPlaceholders = [
  "https://images.unsplash.com/photo-1553514029-1318c9127859?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
];

const team = [
  { name: "Pablo", role: "Barbeiro Sênior" },
  { name: "Jonathan", role: "Especialista em fade" },
  { name: "Dener", role: "Designer" },
  { name: "Gustavo", role: "Navalha e contorno" },
];

const formatCurrency = (value: string | number, currency: string | null = "BRL") =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(Number(value));

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
      services: salon.services ?? FALLBACK_SALON.services,
    };
  } catch (error) {
    console.error("Falha ao carregar dados da barbearia", error);
    return FALLBACK_SALON;
  }
}

export default async function Home() {
  const salon = await getSalon();
  const activeServices = salon.services.filter((service) => service.isActive);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
              <Store className="h-4 w-4 text-primary" /> Barbearia referência
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-flex" />
            <span>{salon.city ?? "Cidade"}</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-flex" />
            <span>{salon.state ?? "Estado"}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-3xl bg-slate-100 shadow-md">
                <Image
                  src={
                    salon.coverImage ??
                    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80"
                  }
                  alt="Espaço da barbearia"
                  width={1200}
                  height={700}
                  className="h-[340px] w-full object-cover"
                  priority
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
                  <BadgeCheck className="h-4 w-4 text-emerald-500" /> Online e presencial
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                {galleryPlaceholders.map((image, index) => (
                  <div key={image} className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <Image
                      src={image}
                      alt={`Foto ${index + 1} da barbearia`}
                      width={700}
                      height={500}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <Badge variant="default">
                  Premium
                </Badge>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" /> {salon.city ?? "Cidade"} · {salon.state ?? "Estado"}
                </div>
              </div>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">{salon.name}</h1>
              <p className="max-w-3xl text-base text-slate-600">
                {salon.description ?? "Cortes, barba e acabamento com equipe especializada. Agenda rápida e ambiente confortável."}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">
                  <ShieldCheck className="h-4 w-4" /> Confirmação {salon.requireBookingApproval ? "com aprovação" : "automática"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-sky-700 ring-1 ring-sky-100">
                  <Clock3 className="h-4 w-4" /> Intervalos de {salon.defaultSlotInterval ?? 10} min
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" /> Compartilhar
              </Button>
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" /> Favoritar
              </Button>
              <Button className="gap-2">Agendar agora</Button>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Serviços</p>
              <h2 className="text-2xl font-semibold">Selecione e agende</h2>
              <p className="text-sm text-slate-500">Transparência em preços, duração e disponibilidade.</p>
            </div>

            <div className="space-y-4">
              {activeServices.map((service) => (
                <Card key={service.id} className="overflow-hidden border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                        <Badge variant="default">
                          {formatCurrency(service.price, salon.currency)}
                        </Badge>
                        <Badge variant="outline">
                          <Clock3 className="h-4 w-4" /> {service.duration} min
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-slate-600">
                        {service.description ?? "Serviço rápido com acabamento profissional."}
                      </CardDescription>
                    </div>
                    <div className="flex w-full flex-col items-stretch gap-3 text-sm text-slate-500 sm:w-auto sm:items-end">
                      <Button className="w-full gap-2 sm:w-auto" variant="secondary">
                        Agendar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {activeServices.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Nenhum serviço ativo</CardTitle>
                    <CardDescription>Ative um serviço para disponibilizar agendamento online.</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Equipe</CardTitle>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {team.map((member) => (
                    <Link key={member.name} href={`/booking`} className="center">
                        <div className="flex flex-col items-center gap-2">
                            <Avatar className="h-18 w-18">
                                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt={member.name} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-semibold text-slate-800">{member.name}</span>
                                <span className="text-xs text-slate-500">{member.role}</span>
                            </div>
                        </div>
                    </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Como chegar</h3>
                <p className="text-sm text-slate-500">Localização e informações úteis para sua visita.</p>
              </div>
              <div className="overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-slate-100">
                <div className="h-72 w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80"
                    alt="Mapa e região da barbearia"
                    width={1400}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid gap-6 border-t border-slate-100 p-6 md:grid-cols-2">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Endereço</p>
                    <p>{salon.address ?? "Endereço a confirmar"}</p>
                    <p className="text-slate-500">
                      {[salon.city, salon.state, salon.zipCode].filter(Boolean).join(" · ") || "Cidade não informada"}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p className="font-semibold text-slate-800">Contato</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{salon.phone ?? "Telefone não informado"}</span>
                    </div>
                    {salon.email && (
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-primary" />
                        <span>{salon.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xl font-semibold">Horário de funcionamento</span>
                    <span className="text-sm text-slate-500">Segunda a sexta-feira: 09:00 - 18:00</span>
                    <span className="text-sm text-slate-500">Sábado: 09:00 - 12:00</span>
                    <span className="text-sm text-slate-500">Domingo: 09:00 - 12:00</span>
                    <span className="text-sm text-slate-500">Feriados: 09:00 - 12:00</span>
                    <span className="text-sm text-slate-500">Feriados: 08:00 - 12:00</span>
                    <span className="text-sm text-slate-500">Feriados: 08:00 - 12:00</span>
                </div>
                <div className="flex flex-col gap-1 ml-12">
                    <span className="text-xl font-semibold">Mais informaçõesq</span>
                    <span className="text-sm text-slate-500">Mais informações</span>
                    <span className="text-sm text-slate-500">Mais informações</span>
                </div>
            </div>
    
          </section>

          <aside className="sticky top-6 space-y-6">
            <Card className="overflow-hidden border-slate-200 shadow-md">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BadgeCheck className="h-4 w-4 text-emerald-500" /> Agende em segundos
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-semibold text-slate-800">Horários disponíveis</p>
                  <p>Próximas janelas com intervalos de {salon.defaultSlotInterval ?? 10} min.</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                    {"09:00, 09:30, 10:00, 10:30, 11:00, 11:30".split(", ").map((slot) => (
                      <span key={slot} className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Reservar horário</Button>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {salon.city ?? "Cidade"} · {salon.state ?? "Estado"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" /> {salon.phone ?? "Telefone não informado"}
                  </p>
                  {salon.website && (
                    <p className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-primary" /> {salon.website}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
                <CardDescription>Políticas e prazos para agendamento.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>{salon.requireBookingApproval ? "Aprovação necessária" : "Confirmação imediata"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span>{salon.allowOnlineBooking ? "Aceitando reservas online" : "Reservas apenas presenciais"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-amber-500" />
                  <span>Até {salon.maxAdvanceBookingDays ?? 90} dias de antecedência</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Atendimento ágil e transparente</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}