import { cn } from "@/components/ui/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6", className)}>{children}</div>
  );
}
