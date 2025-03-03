
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, Pie, PieChart } from "recharts";
import { FeedInventory, FeedConsumption } from "@/types/livestock";

interface FeedSummaryProps {
  feedInventory: FeedInventory[];
  feedConsumption: FeedConsumption[];
  isLoading: boolean;
}

export function FeedSummary({ feedInventory, feedConsumption, isLoading }: FeedSummaryProps) {
  // Prepare inventory data for visualization
  const inventoryData = feedInventory.map(item => ({
    name: item.feed_type,
    value: Number(item.quantity),
    unit: item.unit,
    cost: Number(item.cost_per_unit)
  }));

  // Calculate total feed costs
  const totalFeedValue = feedInventory.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.cost_per_unit),
    0
  );

  // Prepare consumption data
  let consumptionByFeedType = {};
  
  feedConsumption.forEach(item => {
    const feedType = (item.feed_inventory as any)?.feed_type || "Unknown";
    if (!consumptionByFeedType[feedType]) {
      consumptionByFeedType[feedType] = 0;
    }
    consumptionByFeedType[feedType] += Number(item.quantity_used);
  });

  const consumptionData = Object.entries(consumptionByFeedType).map(([name, value]) => ({
    name,
    value
  }));

  // Define colors for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Feed Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold">{feedInventory.length}</div>
              <div className="text-sm text-muted-foreground">Feed Types in Inventory</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold">${totalFeedValue.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Feed Value</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xl font-bold">{feedConsumption.length}</div>
              <div className="text-sm text-muted-foreground">Consumption Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card className="col-span-2">
          <CardContent className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {inventoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground">No inventory data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value, unit }) => `${name}: ${value} ${unit}`}
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feed Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              {consumptionData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground">No consumption data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={consumptionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {consumptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
