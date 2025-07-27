import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="skeleton"
      className={cn(
        "bg-neutral-100 animate-pulse rounded-md duration-4000",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
