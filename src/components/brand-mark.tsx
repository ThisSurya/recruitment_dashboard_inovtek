import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-sm font-semibold text-white",
        className,
      )}
      aria-label="Company logo"
      title="Company"
    >
      ATS
    </div>
  );
}
