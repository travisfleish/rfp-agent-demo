import { getAdvertiserLogo } from "@/lib/advertiser-logos";
import { cn } from "@/lib/utils";

function AdvertiserInitials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-semibold text-navy/70 ring-1 ring-border",
        className
      )}
    >
      {initials}
    </div>
  );
}

export function AdvertiserLogo({
  name,
  size = "sm",
  className,
}: {
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const logo = getAdvertiserLogo(name);
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-11 w-11";

  if (!logo) {
    return <AdvertiserInitials name={name} className={cn(sizeClass, className)} />;
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-border",
        sizeClass,
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={`${name} logo`}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
