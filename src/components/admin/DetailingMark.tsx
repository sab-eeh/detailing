import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Business logo (circular badge, works on light and dark surfaces). */
export function DetailingMark({
  compact = false,
  className = "",
}: {
  dark?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/tru-detailerz-logo.png"
      alt={BRAND.demoBusiness.name}
      className={cn("aspect-square w-auto shrink-0 object-contain", compact ? "h-8" : "h-11", className)}
    />
  );
}
