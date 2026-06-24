import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  action,
  className,
  size = "default",
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <section
      className={cn(
        "mx-auto flex max-w-3xl flex-col items-center px-4 text-center",
        className,
      )}
    >
      <h1
        className={cn(
          "font-heading font-bold tracking-tight text-navy",
          size === "default"
            ? "text-3xl md:text-4xl lg:text-5xl"
            : "text-2xl md:text-3xl",
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </section>
  );
}
