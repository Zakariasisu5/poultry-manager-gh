
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className }: StatCardProps) {
  return (
    <div className={cn(
      "flex items-center p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover-scale transition-all duration-300 animate-fade-in",
      className
    )}>
      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <div className={cn(
              "flex items-center text-xs",
              change.trend === 'up' && 'text-green-500',
              change.trend === 'down' && 'text-red-500'
            )}>
              {change.trend === 'up' && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-3 w-3 mr-1"
                >
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              )}
              {change.trend === 'down' && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="h-3 w-3 mr-1"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              )}
              {change.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
