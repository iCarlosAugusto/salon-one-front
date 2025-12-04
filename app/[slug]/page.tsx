import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BadgeCheck,
    Globe2,
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
import { Salon, Employee, Service } from "@/interfaces";
import { ServiceCard } from "@/components/service-card";


async function getSalonBySlug(slug: string): Promise<Salon> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;

    try {
        const response = await fetch(`${baseUrl}/salons/${slug}/slug`, {
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar: ${response.status}`);
        }

        const salon = (await response.json()) as Salon;

        return salon;
    } catch (error) {
        console.error("Falha ao carregar dados do salão", error);
        throw error;
    }
}

async function getEmployeesBySlug(slug: string): Promise<Employee[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
        return [];
    }
    const response = await fetch(`${baseUrl}/salons/${slug}/employees`, {
        next: { revalidate: 60 },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar: ${response.status}`);
    }
    const employees = (await response.json()) as Employee[];
    return employees;
}

async function getServicesBySalonSlug(salonSlug: string): Promise<Service[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
        return [];
    }
    const response = await fetch(`${baseUrl}/salons/${salonSlug}/services`, {
        next: { revalidate: 60 },
    });
    if (!response.ok) {
        throw new Error(`Erro ao buscar: ${response.status}`);
    }
    const services = (await response.json()) as Service[];
    return services;
}

export default async function SalonPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    if (!slug) {
        return <div>Salão não encontrado</div>;
    }

    const [salon, employees, services] = await Promise.all([
        getSalonBySlug(slug),
        getEmployeesBySlug(slug),
        getServicesBySalonSlug(slug),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
                <header className="space-y-6">
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
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" className="gap-2">
                                <Share2 className="h-4 w-4" /> Compartilhar
                            </Button>
                            <Button className="gap-2">Agendar agora</Button>
                        </div>
                    </div>
                </header>

                <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
                    <section className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold mb">Serviços</h2>
                        </div>

                        <div className="space-y-4">
                            {services.map((service) => (
                                <div className="gap-y-2" key={service.id}>
                                    <ServiceCard key={service.id} service={service} slug={slug} />
                                </div>
                            ))}
                            {services.length === 0 && (
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

                            <div className="flex space-x-4 overflow-x-auto">
                                {employees.map((member) => (
                                    <Link key={member.firstName} href={`/${salon.slug}/booking?employeeId=${member.id}`} className="center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Avatar className="h-18 w-18">
                                                <AvatarImage src={member.avatar ?? ""} alt={member.firstName} />
                                                <AvatarFallback>{member.firstName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-sm font-semibold text-slate-800">{member.firstName}</span>
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
                                <Button className="w-full">Reservar horário</Button>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> {salon.city ?? "Cidade"} · {salon.state ?? "Estado"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" /> {salon.phone ?? "Telefone não informado"}
                                    </p>
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