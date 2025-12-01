import { BookingFlow } from '@/components/booking-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/interfaces';
import Link from 'next/link';
import React from 'react'

export default async function ProfessionalsPage({ searchParams }: { searchParams: Promise<{ serviceId?: string }> }) {

    const { serviceId } = await searchParams;
    if (!serviceId) {
        return <div>Service not found</div>;
    }

    const getProfessionalsByServiceId = async (serviceId: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
        if (!baseUrl) {
            return [];
        }
        const response = await fetch(`${baseUrl}/services/${serviceId}/employees`, {
            next: { revalidate: 60 },
        });
        if (!response.ok) {
            return [];
        }
        const professionals = (await response.json()) as Employee[];
        return professionals;
    }
    const professionals = await getProfessionalsByServiceId(serviceId);

    return (
        <BookingFlow pathname={"/professionals"}>
            <div>
                <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold">Profissionais</span>
                    <div className="flex flex-col gap-2">
                        {professionals.map((professional) => (
                            <Link key={professional.id} href={`/hours?employeeId=${professional.id}&serviceId=${serviceId}`}>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={professional.avatar ?? ""} alt={professional.firstName} />
                                        <AvatarFallback>{professional.firstName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-slate-900">{professional.firstName}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </BookingFlow>
    )
}