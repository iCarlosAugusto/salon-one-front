"use client"

import { Employee, Service } from '@/interfaces'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Button } from './ui/button';
import { useState } from 'react';

interface ServiceCardSelectableEmployeeProps {
    service: Service;
    selectedEmployee: Employee | null;
}

export default function ServiceCardSelectableEmployee({ service, selectedEmployee }: ServiceCardSelectableEmployeeProps) {

    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchEmployeesByServiceId = async (serviceId: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BASE_URL;
        if (!baseUrl) {
            return [];
        }
        const response = await fetch(`${baseUrl}/services/${serviceId}/employees`);
        const employees = await response.json() as Employee[];
        setEmployees(employees);
    }

    return (
        <Dialog>
            <Card>
                <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.duration} minutos</CardDescription>
                </CardHeader>
                <CardContent>
                    <DialogTrigger asChild onClick={() => fetchEmployeesByServiceId(service.id)}>
                        <div className="border-1 border-slate-200 rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <span>Qualquer profissional</span>
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                            </div>
                        </div>
                    </DialogTrigger>
                </CardContent>
            </Card>
            <DialogContent className="p-0 sm:max-w-lg">
                <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 pt-6 pb-4">
                    <DialogTitle>Changelog</DialogTitle>
                    <DialogDescription>
                        Recent updates and improvements to our platform.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] px-6">
                    {employees.map((employee) => (
                        <div key={employee.id}>
                            <span>{employee.firstName}</span>
                        </div>
                    ))}
                </ScrollArea>
                <DialogFooter className="px-6 pt-4 pb-6">
                    <Button type="button">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
