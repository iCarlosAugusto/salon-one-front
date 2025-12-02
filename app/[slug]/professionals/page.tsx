import { BookingFlow } from '@/components/booking-flow';    
import { Employee } from '@/interfaces';
import { ProfessionalCard } from './client-components/professional-card'

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
                            <ProfessionalCard
                                key={professional.id}
                                professional={professional}
                                serviceId={serviceId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </BookingFlow>
    )
}