
import { 
  BarChart,
  Calendar,
  ChevronRight,
  Feather,
  Leaf,
  PieChart,
  TrendingUp,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/layout/PageContainer";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";

const Index = () => {
  // Sample data for charts
  const birdCountData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 2210 },
    { name: 'Mar', value: 2290 },
    { name: 'Apr', value: 2500 },
    { name: 'May', value: 2800 },
    { name: 'Jun', value: 3100 },
  ];

  const feedConsumptionData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 140 },
    { name: 'Wed', value: 130 },
    { name: 'Thu', value: 125 },
    { name: 'Fri', value: 145 },
    { name: 'Sat', value: 135 },
    { name: 'Sun', value: 125 },
  ];

  const expenseBreakdownData = [
    { name: 'Feed', value: 55 },
    { name: 'Labor', value: 20 },
    { name: 'Medication', value: 15 },
    { name: 'Utilities', value: 10 },
  ];

  const recentActivities = [
    { id: 1, activity: 'Vaccination scheduled for Coop #3', time: '2 hours ago' },
    { id: 2, activity: 'Feed supply updated: +200kg', time: '4 hours ago' },
    { id: 3, activity: 'Health inspection completed for Coop #1', time: '1 day ago' },
    { id: 4, activity: '15 new chicks added to the flock', time: '2 days ago' },
  ];

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your farm operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Jul 12, 2023</span>
          </Button>
          <Button size="sm">
            <span>Generate Report</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Birds"
          value="3,240"
          icon={<Feather className="h-6 w-6 text-primary" />}
          change={{ value: "+5.3%", trend: "up" }}
        />
        <StatCard
          title="Feed Stock"
          value="1,250 kg"
          icon={<Leaf className="h-6 w-6 text-primary" />}
          change={{ value: "-2.1%", trend: "down" }}
        />
        <StatCard
          title="Monthly Expenses"
          value="$5,240"
          icon={<BarChart className="h-6 w-6 text-primary" />}
          change={{ value: "+3.2%", trend: "up" }}
        />
        <StatCard
          title="Monthly Revenue"
          value="$8,760"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          change={{ value: "+7.4%", trend: "up" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ChartContainer
          title="Bird Population Growth"
          description="Last 6 months trend"
          type="area"
          data={birdCountData}
          color="#4f46e5"
        />
        <ChartContainer
          title="Daily Feed Consumption"
          description="Last 7 days in kilograms"
          type="bar"
          data={feedConsumptionData}
          color="#f97316"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartContainer
          title="Expense Breakdown"
          description="Current month distribution"
          type="pie"
          data={expenseBreakdownData}
          className="md:col-span-1"
        />
        
        <DashboardCard 
          title="Vaccination Schedule" 
          description="Upcoming vaccinations"
          className="md:col-span-1"
        >
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Coop #1 - Newcastle Disease</span>
                <span className="text-muted-foreground">Jul 15</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Coop #2 - Fowl Pox</span>
                <span className="text-muted-foreground">Jul 22</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Coop #3 - Infectious Bronchitis</span>
                <span className="text-muted-foreground">Jul 30</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2">
              <span>View All Schedules</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Recent Activities" 
          description="Latest farm operations"
          className="md:col-span-1"
        >
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 last:pb-0 border-b last:border-0">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full">
              <span>View All Activities</span>
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default Index;
