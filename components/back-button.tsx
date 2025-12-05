"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";

const FLOW_STEPS: Record<string, string> = {
    hours: "services",
    confirmation: "hours",
};

export function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    const handleBack = () => {
        const segments = pathname.split("/");
        const slug = segments[1];
        const currentStep = segments[2];

        const previousStep = FLOW_STEPS[currentStep];

        if (previousStep) {
            router.push(`/${slug}/${previousStep}`);
        } else {
            // Fallback: go to salon home page
            router.push(`/${slug}`);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white"
        >
            <span className="sr-only">Voltar</span>
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M15 6l-6 6 6 6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </Button>
    );
}
