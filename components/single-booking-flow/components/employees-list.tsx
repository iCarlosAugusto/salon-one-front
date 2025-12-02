"use client";

import { Employee } from '@/interfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeesListProps {
    employees: Employee[]
    onEmployeeSelect: (employee: Employee) => void
    selectedEmployee: Employee | null
}

function EmployeesList({ employees, onEmployeeSelect, selectedEmployee }: EmployeesListProps) {
    if (employees.length === 0) {
        return <div className="text-sm font-medium text-slate-900">Nenhum profissional encontrado</div>
    }
    return (
        <div className="flex items-start justify-start flex-col">
            <span className="text-lg font-semibold">Selecione o profissional</span>
            <div className="flex flex-col gap-2">

                {employees.map((employee) => (
                    <div key={employee.id} className={`flex flex-col items-center gap-2 cursor-pointer`} onClick={() => onEmployeeSelect(employee)}>
                        <Avatar className="border-2 border-slate-blue-500">
                            <AvatarImage src={employee.avatar ?? ""} alt={employee.firstName} />
                            <AvatarFallback>{employee.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-900">{employee.firstName}</span>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default EmployeesList