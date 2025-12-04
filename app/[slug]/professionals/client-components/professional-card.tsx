"use client";
import { Employee } from '@/interfaces'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname, useRouter } from 'next/navigation'

export function ProfessionalCard({ professional, serviceId }: { professional: Employee, serviceId: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const slug = pathname.split('/')[1];
    const handleSelectProfessional = () => {
        router.push(`/${slug}/hours?employeeId=${professional.id}&serviceId=${serviceId}`);
    }
    return (
        <div onClick={handleSelectProfessional}>
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={professional.avatar ?? ""} alt={professional.firstName} />
                    <AvatarFallback>{professional.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-900">{professional.firstName}</span>
            </div>
        </div>
    )
}