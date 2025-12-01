import React from 'react'
import { Button } from './ui/button'
import { BookingSummary } from '@/app/booking/client-components/booking-summary'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { MobileBottomBar } from '@/app/booking/client-components/mobile-bottom-bar'
import { ShieldCheck, BadgeCheck } from 'lucide-react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb'

function BookingFlow({ children, pathname }: { children: React.ReactNode, pathname: string }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col items-start gap-3">
                        <div className="flex items-center gap-3">
                        
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-slate-200 bg-white">
                            <span className="sr-only">Voltar</span>
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                                <path d="M15 6l-6 6 6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold sm:text-3xl">Descubra e agende em poucos toques</h1>
                        </div>
                        </div>
   
                        <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                            <BreadcrumbLink href={pathname === "/booking" ? "/booking" : "/services"}>Serviços</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbLink href={pathname === "/hours" ? "/hours" : "/booking"}>Agendamento</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            <BreadcrumbPage>{pathname === "/hours" ? "Horário" : "Confirmar"}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <Button variant="outline" className="hidden rounded-full border-slate-200 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 sm:inline-flex">
                        Preciso de ajuda
                    </Button>
                </div>

                <div className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-[0_20px_80px_-28px_rgba(15,23,42,0.32)] ring-1 ring-slate-100 lg:flex-row lg:gap-10">
                    {children && (
                        <div className="flex flex-1 flex-col gap-6">
                            {children}
                        </div>
                    )}

                    <aside className="w-full max-w-xl space-y-4 self-start lg:w-80 hidden lg:block">
                        <BookingSummary
                            employeeName={"John Doe"}
                            salonName={"Barbearia do João"}
                            salonCity={"São Paulo"}
                            salonState={"SP"}
                            currency={"BRL"}
                        />

                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Sobre o espaço</CardTitle>
                                <CardDescription>Conforto, música e atendimento com foco em agilidade.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span>Reservas online ativadas</span>
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
                <MobileBottomBar />
            </div>
        </div>
    )
}

export { BookingFlow }