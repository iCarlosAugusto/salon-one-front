"use client";

import React from 'react'
import Link from 'next/link'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Service } from '@/interfaces'
import { useRouter } from 'next/navigation';

const formatCurrency = (value: string | number, currency: string | null = "BRL") =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: currency ?? "BRL",
        minimumFractionDigits: 2,
    }).format(Number(value));

export function ServiceCard({ service, slug }: { service: Service, slug: string }) {

    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/${slug}/professionals?serviceId=${service.id}`);
    }
    return (
        <Link key={service.id} href={`/${slug}/professionals?serviceId=${service.id}`} className="center">
            <Card className="overflow-hidden border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <CardTitle className="text-lg font-semibold">{service.name}</CardTitle>
                            <Badge variant="default">
                                {formatCurrency(service.price)}
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
        </Link>
    )
}