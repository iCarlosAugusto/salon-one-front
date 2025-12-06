import { BookingFlow } from '@/components/booking-flow'
import { Employee, Service } from '@/interfaces';
import ServiceCardSelectableEmployee from '@/components/service-card-selectable-employee';
import { EmployeeHeader } from '@/components/employee-header';
import { ServicesProvider } from './client-components/services-provider';

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ serviceId?: string, employeeId?: string }> }) {

  const { serviceId, employeeId } = await searchParams;
  const slug = "barber-top"; // Get this slug from the URL

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

  const getServicesByEmployeeId = async (employeeId: string): Promise<Service[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
      return [];
    }
    const response = await fetch(`${baseUrl}/employees/${employeeId}/services`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return [];
    }
    const services = (await response.json()) as Service[];
    return services;
  }

  const getEmployeeById = async (employeeId: string): Promise<Employee | null> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
    if (!baseUrl) {
      return null;
    }
    const response = await fetch(`${baseUrl}/employees/${employeeId}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      return null;
    }
    const employee = (await response.json()) as Employee;
    return employee;
  }

  // Determine query mode and fetch accordingly
  const isEmployeeContext = !!employeeId;

  const [services, employee] = await Promise.all([
    isEmployeeContext
      ? getServicesByEmployeeId(employeeId!)
      : getServicesBySalonSlug(slug),
    isEmployeeContext
      ? getEmployeeById(employeeId!)
      : Promise.resolve(null),
  ]);

  const preSelectedService = services.find((service) => service.id === serviceId);
  return (
    <BookingFlow pathname="/services">
      {/* Client-side store management */}
      <ServicesProvider employee={employee} preSelectedServiceId={serviceId ?? null} preSelectedService={preSelectedService} />

      <div className="space-y-6">
        {/* Employee Header - only shown in employee context */}
        {employee && <EmployeeHeader employee={employee} />}

        <div>
          <span className="text-lg font-semibold mb-5">
            {isEmployeeContext ? 'Serviços disponíveis' : 'Serviços'}
          </span>

          <div className="space-y-4 mt-4">
            {services.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">Nenhum serviço encontrado</p>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCardSelectableEmployee
                  key={service.id}
                  service={service}
                  selectedEmployee={null}
                  contextEmployee={employee}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </BookingFlow>
  )
}