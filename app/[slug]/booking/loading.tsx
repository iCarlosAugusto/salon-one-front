import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BookingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-80" />
            </div>
          </div>
          <Skeleton className="hidden h-10 w-32 rounded-full sm:block" />
        </div>

        <div className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-[0_20px_80px_-28px_rgba(15,23,42,0.32)] ring-1 ring-slate-100 lg:flex-row lg:gap-10">
          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Employee Card */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              <Skeleton className="h-9 w-32 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>

            {/* Featured Services */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse border-slate-200 p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-full max-w-md" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse border-slate-200 p-4 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-56" />
                          <Skeleton className="h-4 w-full max-w-lg" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Combos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="space-y-3">
                <Card className="animate-pulse border-slate-200 p-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-full max-w-md" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden w-full max-w-xl space-y-4 self-start lg:block lg:w-80">
            <Card className="animate-pulse overflow-hidden border-slate-200 shadow-lg">
              <div className="space-y-1 bg-gradient-to-r from-indigo-50 to-slate-50 p-6">
                <Skeleton className="h-3 w-16" />
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>

                <div className="space-y-2 rounded-2xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>

                <div className="space-y-2 rounded-2xl bg-indigo-50 p-4">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full rounded-full" />
              </div>
            </Card>

            <Card className="animate-pulse border-slate-200">
              <div className="space-y-3 p-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-2 border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

