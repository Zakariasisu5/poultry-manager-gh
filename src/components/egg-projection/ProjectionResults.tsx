
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ChartContainer
} from "@/components/dashboard/ChartContainer";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Egg, Calendar, TrendingUp, BadgePercent } from "lucide-react";

interface ProjectionResultsProps {
  data: {
    summary: {
      flock: string;
      birdCount: number;
      birdAge: number;
      breedType: string;
      period: number;
      dailyEggs: number;
      totalEggs: number;
      productionRate: string;
    };
    weeklyData: {
      week: number;
      eggs: number;
      cumulative: number;
    }[];
  } | null;
}

const breedNames = {
  leghorn: "White Leghorn",
  rhodeIsland: "Rhode Island Red",
  plymouth: "Plymouth Rock",
  orpington: "Buff Orpington"
};

export function ProjectionResults({ data }: ProjectionResultsProps) {
  if (!data) return null;
  
  const { summary, weeklyData } = data;
  
  // Format data for charts
  const weeklyChartData = weeklyData.map(week => ({
    name: `Week ${week.week}`,
    value: week.eggs
  }));
  
  const cumulativeChartData = weeklyData.map(week => ({
    name: `Week ${week.week}`,
    value: week.cumulative
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projection Results for {summary.flock}</CardTitle>
          <CardDescription>
            Based on {summary.birdCount} birds ({breedNames[summary.breedType as keyof typeof breedNames]}) 
            at {summary.birdAge} weeks of age
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Daily Egg Production"
              value={summary.dailyEggs.toString()}
              icon={<Egg className="h-6 w-6 text-primary" />}
            />
            <StatCard
              title="Total Eggs (Projected)"
              value={summary.totalEggs.toString()}
              icon={<TrendingUp className="h-6 w-6 text-primary" />}
            />
            <StatCard
              title="Production Rate"
              value={summary.productionRate}
              icon={<BadgePercent className="h-6 w-6 text-primary" />}
            />
            <StatCard
              title="Projection Period"
              value={`${summary.period} days`}
              icon={<Calendar className="h-6 w-6 text-primary" />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer
              title="Weekly Egg Production"
              description="Eggs produced per week"
              type="bar"
              data={weeklyChartData}
              color="#10b981"
            />
            <ChartContainer
              title="Cumulative Egg Production"
              description="Total eggs over projection period"
              type="area"
              data={cumulativeChartData}
              color="#f97316"
            />
          </div>
        </CardContent>
      </Card>
      
      <DashboardCard
        title="Weekly Breakdown"
        description="Detailed view of projected egg production by week"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left font-medium">Week</th>
                <th className="py-2 px-4 text-left font-medium">Period</th>
                <th className="py-2 px-4 text-left font-medium">Eggs</th>
                <th className="py-2 px-4 text-left font-medium">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((week) => (
                <tr key={week.week} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">Week {week.week}</td>
                  <td className="py-2 px-4">
                    Day {(week.week - 1) * 7 + 1} - {Math.min(week.week * 7, summary.period)}
                  </td>
                  <td className="py-2 px-4">{week.eggs}</td>
                  <td className="py-2 px-4">{week.cumulative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );
}
