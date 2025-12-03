import { BookingFlow } from '@/components/booking-flow'
import { Service } from '@/interfaces';
import ServiceCardSelectableEmployee from '@/components/service-card-selectable-employee';

export default async function ServicesPage() {

  const getServicesBySalonSlug = async (salonSlug: string): Promise<Service[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
      return [];
    }
    const response = await fetch(`${baseUrl}/salons/${salonSlug}/services`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return [];
    }
    const services = (await response.json()) as Service[];
    return services;
  }
  const services = await getServicesBySalonSlug("barber-top");

  return (
    <BookingFlow
      pathname="/services"
    >
      <div>
        <span className="text-lg font-semibold mb-5">Serviços</span>

        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCardSelectableEmployee key={service.id} service={service} selectedEmployee={null} />
          ))}
        </div>
      </div>
    </BookingFlow>
  )
}