import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-16">
        {/* Header Section */}
        <header className="space-y-6">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* Cover Image */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Skeleton className="h-[340px] w-full rounded-3xl" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-4">
              {/* Badge and location */}
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>

              {/* Title */}
              <Skeleton className="h-10 w-64" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full max-w-3xl" />
                <Skeleton className="h-5 w-3/4 max-w-2xl" />
              </div>

              {/* Status badge */}
              <Skeleton className="h-7 w-48 rounded-full" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-start">
          {/* Services Section */}
          <section className="space-y-6">
            {/* Section Title */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-5 w-80" />
            </div>

            {/* Service Cards */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden border-slate-200 shadow-sm animate-pulse">
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Title and badges */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      {/* Description */}
                      <Skeleton className="h-4 w-full max-w-md" />
                      <Skeleton className="h-4 w-3/4 max-w-sm" />
                    </div>
                    {/* Button */}
                    <Skeleton className="h-10 w-full sm:w-28" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Team Section */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-32" />

              {/* Team Members Horizontal Scroll */}
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card
                    key={i}
                    className="min-w-[160px] flex-shrink-0 overflow-hidden border-slate-200 shadow-sm animate-pulse"
                  >
                    <div className="flex flex-col items-center gap-3 px-4 py-5 text-center">
                      {/* Avatar */}
                      <Skeleton className="h-16 w-16 rounded-full" />
                      {/* Name and Role */}
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Info Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm animate-pulse">
              <div className="space-y-4 p-6">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Hours Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm animate-pulse">
              <div className="space-y-4 p-6">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Gallery Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm animate-pulse">
              <div className="space-y-4 p-6">
                <Skeleton className="h-5 w-24" />
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </Card>

            {/* Reviews Card */}
            <Card className="overflow-hidden border-slate-200 shadow-sm animate-pulse">
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
