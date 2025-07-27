import { UseIsMobile } from "@/hooks";
import { Skeleton } from "../ui/skeleton";

export const ListingsSkeleton = () => {
  const isMd = !UseIsMobile(768);
  const isLg = !UseIsMobile(1024);
  return (
    <Skeleton className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-transparent">
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      <ListingCardSkeleton />
      {isMd && <ListingCardSkeleton />}
      {isLg && (
        <>
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </>
      )}
    </Skeleton>
  );
};

const ListingCardSkeleton = () => {
  return (
    <div className="h-[360px] rounded-lg overflow-hidden bg-neutral-50/80 dark:bg-dark-primary-950/90 backdrop-blur-md border-[0.5px] border-white dark:border-neutral-50/20 shadow-lg shadow-black/10 dark:shadow-black/90">
      <div className="mb-2 h-1/2 bg-dark-primary-100 dark:bg-neutral-50/8"></div>
      <div className="p-3 space-y-3">
        <div className="h-5 rounded-full w-3/4 bg-dark-primary-100/70 dark:bg-neutral-50/8"></div>
        <div className="h-3 rounded-full w-2/3 bg-dark-primary-100/70 dark:bg-neutral-50/8"></div>
        <div className="flex items-center justify-between">
          <div className="h-5 rounded-full w-3/10 bg-dark-primary-100/70 dark:bg-neutral-50/8"></div>
          <div className="h-5 rounded-full w-3/10 bg-dark-primary-100/70 dark:bg-neutral-50/8"></div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="h-6 rounded-full w-3/10 bg-dark-primary-100/90 dark:bg-neutral-50/8"></div>
          <div className="h-6 rounded-full w-3/10 bg-dark-primary-100/90 dark:bg-neutral-50/8"></div>
          <div className="h-6 rounded-full w-3/10 bg-dark-primary-100/90 dark:bg-neutral-50/8"></div>
          <div className="h-6 rounded-full w-3/10 bg-dark-primary-100/90 dark:bg-neutral-50/8"></div>
        </div>
        <div className="h-2 mt-5 rounded-full w-2/5 bg-dark-primary-100 dark:bg-neutral-50/10"></div>
      </div>
    </div>
  );
};

export default ListingsSkeleton;
