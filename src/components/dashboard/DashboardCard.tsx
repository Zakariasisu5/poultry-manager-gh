
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function DashboardCard({ title, description, className, children }: DashboardCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover-scale transition-all duration-300 animate-fade-in",
      className
    )}>
      <div className="flex flex-col space-y-1.5 mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
