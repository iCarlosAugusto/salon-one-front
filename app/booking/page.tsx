import { ServiceCard } from "./client-components/service-card";
import { BookingProvider } from "./client-components/booking-provider";
import { BookingFlow } from "@/components/booking-flow";
import { Employee, Salon, Service } from "@/interfaces";

async function getEmployeeById(id: string): Promise<Employee | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
  if (!baseUrl) {
    return null;
  }
  const response = await fetch(`${baseUrl}/employees/${id}`, {
    next: { revalidate: false },
  });
  if (!response.ok) {
    console.error("Falha ao carregar dados do profissional", response.status);
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
    console.error("Falha ao carregar dados do salão", response.status);
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
    console.error("Falha ao carregar dados dos serviços do profissional", response.status);
    return [];
  }
  const services = (await response.json()) as Service[];
  return services;
}

export default async function Booking({ searchParams }: { searchParams: Promise<{ employeeId?: string }> }) {
  const { employeeId } = await searchParams;
  const pathname = "/booking";
  if (!employeeId) {
    return <div>Profissional não encontrado</div>;
  }
  const [salon, employee, employeeServices] = await Promise.all([
    getSalonById("7e446c70-e87c-4ed3-a288-40171faae563"),
    getEmployeeById(employeeId),
    getEmployeeServices(employeeId),
  ]);

  return (
    <BookingFlow pathname={pathname}>
      {/* Booking Provider - sets employee in store */}
      <BookingProvider employee={employee} salonSlug={salon?.slug} />

      <div className="flex flex-1 flex-col gap-6">
        <div className="space-y-6" id="services">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Serviços</h2>
          </div>
          <div className="space-y-3">
            {employeeServices?.map((service) => (
              <ServiceCard key={service.id} service={service} currency={"BRL"} />
            ))}
          </div>
        </div>
      </div>
    </BookingFlow>
  )
}