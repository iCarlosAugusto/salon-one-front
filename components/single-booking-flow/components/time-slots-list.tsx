"use client";

import { string } from "zod";

interface TimeSlotsListProps {
    timeSlots: string[]
    onTimeSlotSelect: (timeSlot: string) => void
    selectedSlot: string | null
}

export default function TimeSlotsList({ timeSlots, onTimeSlotSelect, selectedSlot }: TimeSlotsListProps) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Horários</span>
            <div className="flex flex-col gap-2">
                {timeSlots.length === 0 ? (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">Nenhum horário disponível</span>
                    </div>
                ) : (
                    timeSlots.map((timeSlot, index) => (
                    <div key={index} className={`flex flex-col items-center gap-2 ${selectedSlot === timeSlot ? "bg-slate-100" : ""} cursor-pointer`} onClick={() => onTimeSlotSelect(timeSlot)}>
                        <span className="text-sm font-medium text-slate-900">{timeSlot}</span>
                    </div>
                ))
                )}
            </div>
        </div>
    )
}