
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { DashboardCard } from './DashboardCard';

// Chart types
type ChartType = 'area' | 'bar' | 'pie';

// Chart props
interface ChartContainerProps {
  title: string;
  description?: string;
  data: any[];
  type: ChartType;
  dataKey?: string;
  xAxisKey?: string;
  pieDataKey?: string;
  color?: string;
  colors?: string[];
  className?: string;
}

export function ChartContainer({ 
  title, 
  description, 
  data, 
  type, 
  dataKey = 'value', 
  xAxisKey = 'name',
  pieDataKey = 'value',
  color = '#4f46e5', 
  colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f97316', '#f43f5e'],
  className 
}: ChartContainerProps) {
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                dataKey={pieDataKey}
                strokeWidth={2}
                stroke="rgba(255, 255, 255, 0.5)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <DashboardCard title={title} description={description} className={className}>
      {renderChart()}
    </DashboardCard>
  );
}
