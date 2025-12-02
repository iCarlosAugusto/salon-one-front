"use client";

import React, { useEffect, useState } from 'react'
import { Employee } from '@/interfaces'
import EmployeesList from './components/employees-list'
import { InlineCalendar } from '../inline-calendar';
import TimeSlotsList from './components/time-slots-list';

function SingleBookingFlow() {
    const serviceId = "a6a3fe2e-a201-44ff-8482-85326c972b1a"
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const [timeSlots, setTimeSlots] = useState<string[]>([])
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    
    const getEmployeesByServiceId = async (serviceId: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/services/${serviceId}/employees`)
        const data = await response.json() as Employee[]
        setEmployees(data)
    }

    const getEmployeeTimeSlots = async (employeeId: string, serviceId: string, date: Date) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/appointments/available-slots?employeeId=${employeeId}&serviceIds=${serviceId}&date=${date.toISOString().split('T')[0]}`)
        const data = await response.json() as string[]
        setTimeSlots(data)
    }

    const handleEmployeeSelect = (employeeSelected: Employee) => {
        setSelectedEmployee(employeeSelected)
        getEmployeeTimeSlots(employeeSelected.id, serviceId, selectedDate ?? new Date())
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date)
        if(selectedEmployee) {
            getEmployeeTimeSlots(selectedEmployee.id, serviceId, date)
        }
    }

    const handleTimeSlotSelect = (timeSlot: string) => {
        setSelectedSlot(timeSlot)
    }

    useEffect(() => {
        getEmployeesByServiceId(serviceId)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 bg-red-300">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12 items-center justify-center bg-blue-300">
                <InlineCalendar onDateSelect={handleDateSelect} />
                <EmployeesList
                    employees={employees}
                    onEmployeeSelect={handleEmployeeSelect}
                    selectedEmployee={selectedEmployee}
                />
                <TimeSlotsList
                    timeSlots={timeSlots}
                    onTimeSlotSelect={handleTimeSlotSelect}
                    selectedSlot={selectedSlot}
                />
            </div>
        </div>
    )
}

export default SingleBookingFlow