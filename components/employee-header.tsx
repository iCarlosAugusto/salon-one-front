import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/interfaces";
import { Sparkles } from "lucide-react";

interface EmployeeHeaderProps {
    employee: Employee;
}

export function EmployeeHeader({ employee }: EmployeeHeaderProps) {
    const initials = `${employee.firstName?.[0] ?? ""}${employee.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 p-6 text-white shadow-[0_20px_60px_-20px_rgba(99,102,241,0.5)]">
            {/* Background decoration */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

            <div className="relative flex items-center gap-5">
                {/* Avatar */}
                <Avatar className="h-20 w-20 ring-4 ring-white/20 shadow-xl">
                    <AvatarImage
                        src={employee.avatar ?? undefined}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-white/20 text-2xl font-bold text-white">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {employee.firstName} {employee.lastName}
                        </h2>
                        <Sparkles className="h-5 w-5 text-amber-300" />
                    </div>
                    <p className="text-sm font-medium text-indigo-100">{employee.role}</p>
                    {employee.bio && (
                        <p className="mt-2 text-sm leading-relaxed text-white/80">
                            {employee.bio}
                        </p>
                    )}
                </div>
            </div>

            {/* Subtitle */}
            <p className="relative mt-4 text-sm text-indigo-100">
                Veja os serviços disponíveis com este profissional
            </p>
        </div>
    );
}
