
import { HealthRecord } from "@/types/livestock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Calendar, DollarSign, LineChart, Pill, Syringe } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface HealthSummaryProps {
  healthRecords: any[];
  isLoading: boolean;
}

export function HealthSummary({ healthRecords, isLoading }: HealthSummaryProps) {
  // If still loading or no data
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="h-10 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="h-24 bg-gray-100"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (healthRecords.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed">
        <h3 className="text-2xl font-semibold">No health data available</h3>
        <p className="text-muted-foreground">
          Add health records to see analytics here
        </p>
      </div>
    );
  }

  // Calculate statistics
  const currentDate = new Date();
  const last30Days = new Date(currentDate);
  last30Days.setDate(last30Days.getDate() - 30);

  const recordsLast30Days = healthRecords.filter(
    (record) => new Date(record.record_date) >= last30Days
  );

  const totalRecords = healthRecords.length;
  const recentRecords = recordsLast30Days.length;
  
  // Calculate treatment costs
  const totalCost = healthRecords.reduce(
    (sum, record) => sum + (record.treatment_cost || 0),
    0
  );
  
  const recentCost = recordsLast30Days.reduce(
    (sum, record) => sum + (record.treatment_cost || 0),
    0
  );

  // Count record types
  const recordTypes = healthRecords.reduce((acc: {[key: string]: number}, record) => {
    const type = record.record_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data for record types
  const recordTypeData = Object.entries(recordTypes).map(([name, value]) => ({
    name: name.replace('_', ' '),
    value
  }));

  // Prepare chart data for monthly trends
  const last6Months = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      timestamp: d.getTime(),
      index: 5 - i // Reverse the index for proper sorting
    };
  }).sort((a, b) => a.index - b.index);

  const monthlyData = last6Months.map(monthData => {
    const month = monthData.month;
    const startOfMonth = new Date(monthData.timestamp);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    const monthRecords = healthRecords.filter(record => {
      const recordDate = new Date(record.record_date);
      return recordDate >= startOfMonth && recordDate <= endOfMonth;
    });
    
    return {
      name: month,
      records: monthRecords.length,
      cost: monthRecords.reduce((sum, record) => sum + (record.treatment_cost || 0), 0)
    };
  });

  // Colors for chart
  const COLORS = [
    "#10B981", // Green for vaccinations
    "#3B82F6", // Blue for medications
    "#EF4444", // Red for illness
    "#F97316", // Orange for injury
    "#8B5CF6", // Purple for routine_check
    "#6B7280", // Gray for other
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">
              {recentRecords} in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${recentCost.toFixed(2)} in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypes.vaccination || 0}</div>
            <p className="text-xs text-muted-foreground">
              {recordTypes.vaccination
                ? `${((recordTypes.vaccination / totalRecords) * 100).toFixed(1)}% of all records`
                : "No vaccination records"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordTypes.medication || 0}</div>
            <p className="text-xs text-muted-foreground">
              {recordTypes.medication
                ? `${((recordTypes.medication / totalRecords) * 100).toFixed(1)}% of all records`
                : "No medication records"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Health Record Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recordTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {recordTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Records']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Health Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    return name === 'cost' ? [`$${value}`, 'Cost'] : [value, 'Records'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="records" fill="#10B981" name="Records" />
                <Bar yAxisId="right" dataKey="cost" fill="#3B82F6" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Health Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {record.record_type === "vaccination" && (
                    <Syringe className="h-5 w-5 text-green-500" />
                  )}
                  {record.record_type === "medication" && (
                    <Pill className="h-5 w-5 text-blue-500" />
                  )}
                  {record.record_type === "illness" && (
                    <Activity className="h-5 w-5 text-red-500" />
                  )}
                  {record.record_type === "routine_check" && (
                    <Calendar className="h-5 w-5 text-purple-500" />
                  )}
                  {!["vaccination", "medication", "illness", "routine_check"].includes(
                    record.record_type
                  ) && <LineChart className="h-5 w-5 text-gray-500" />}
                </div>
                <div>
                  <p className="font-medium">
                    {record.livestock?.animal_type}{" "}
                    {record.livestock?.tag_number && `#${record.livestock.tag_number}`}{" "}
                    - {record.record_type.replace("_", " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.record_date).toLocaleDateString()} •{" "}
                    {record.medication ? `${record.medication}` : "No medication"}{" "}
                    {record.treatment_cost ? `• $${record.treatment_cost.toFixed(2)}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
