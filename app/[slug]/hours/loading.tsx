import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HoursLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Desktop Header with Breadcrumb */}
      <div className="hidden border-b border-slate-200 bg-white lg:block">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
        {/* Mobile Header */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Desktop Title */}
            <Skeleton className="hidden h-9 w-64 lg:block" />

            {/* Employee Selector and Calendar Button */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Inline Calendar */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 sm:p-6">
                {/* Week days header */}
                <div className="mb-3 grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid animate-pulse grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-square w-full rounded-xl"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Empty state placeholder */}
            <div className="animate-pulse rounded-xl bg-slate-50 p-8 text-center">
              <Skeleton className="mx-auto mb-3 h-12 w-12 rounded-lg" />
              <Skeleton className="mx-auto h-4 w-56" />
              <Skeleton className="mx-auto mt-2 h-3 w-48" />
            </div>

            {/* Waitlist Link */}
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <Skeleton className="mx-auto h-4 w-80" />
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden w-full max-w-xl self-start lg:block lg:w-96">
            <Card className="animate-pulse overflow-hidden border-slate-200 shadow-lg">
              <div className="space-y-3 bg-gradient-to-r from-indigo-50 to-slate-50 pb-4">
                <div className="flex items-start gap-3 p-6">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {/* Selected Services */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-12 bg-slate-700" />
                    <Skeleton className="h-5 w-32 bg-slate-700" />
                  </div>
                </div>

                {/* Continue Button */}
                <Skeleton className="h-14 w-full rounded-full" />
              </div>
            </Card>
          </aside>
        </div>

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="flex animate-pulse flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

