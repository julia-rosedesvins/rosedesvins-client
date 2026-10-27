import { Skeleton } from '@/components/ui/skeleton';
import LandingPageLayout from '@/components/LandingPageLayout';

const SKELETON_COUNT = 6;

export default function BlogListingSkeleton() {
  return (
    <LandingPageLayout>
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <Skeleton className="h-10 w-32 mb-4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          <Skeleton className="h-6 w-2/3 max-w-2xl mt-2 mx-auto" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <article key={index} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-7 w-4/5" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </main>
    </LandingPageLayout>
  );
}
