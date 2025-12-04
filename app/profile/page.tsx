import { UserRound, ChevronRight } from "lucide-react";
import Link from "next/link";


export default async function ProfilePage() {

    return (
        <div className="min-h-screen mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="flex flex-col gap-4">
                <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-indigo-600" />
                    Perfil
                </h1>

                <Link href="/profile/schedules" className="flex items-center gap-2 cursor-pointer">
                    <span>Meus agendamentos</span>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
