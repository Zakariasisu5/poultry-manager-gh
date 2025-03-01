
import { useState } from "react";
import { 
  Calendar, 
  Feather,
  Filter,
  Plus,
  Search
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ChartContainer } from "@/components/dashboard/ChartContainer";

const breedPerformanceData = [
  { name: 'Rhode Island Red', value: 88 },
  { name: 'Leghorn', value: 92 },
  { name: 'Sussex', value: 79 },
  { name: 'Plymouth Rock', value: 85 },
  { name: 'Orpington', value: 82 },
];

// Sample flock data
const flockData = [
  { 
    id: 1, 
    name: 'Coop #1', 
    breed: 'Rhode Island Red', 
    quantity: 120, 
    age: '32 weeks', 
    status: 'Healthy',
    lastUpdate: '2 days ago' 
  },
  { 
    id: 2, 
    name: 'Coop #2', 
    breed: 'Leghorn', 
    quantity: 150, 
    age: '28 weeks', 
    status: 'Healthy',
    lastUpdate: '1 day ago' 
  },
  { 
    id: 3, 
    name: 'Coop #3', 
    breed: 'Sussex', 
    quantity: 85, 
    age: '42 weeks', 
    status: 'Under Treatment',
    lastUpdate: '3 hours ago' 
  },
  { 
    id: 4, 
    name: 'Coop #4', 
    breed: 'Plymouth Rock', 
    quantity: 110, 
    age: '15 weeks', 
    status: 'Healthy',
    lastUpdate: '5 days ago' 
  },
  { 
    id: 5, 
    name: 'Coop #5', 
    breed: 'Orpington', 
    quantity: 75, 
    age: '36 weeks', 
    status: 'Needs Attention',
    lastUpdate: '12 hours ago' 
  },
];

const LivestockTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter flocks based on search and status
  const filteredFlocks = flockData.filter(flock => {
    const matchesSearch = 
      flock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flock.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      flock.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return "bg-green-100 text-green-800";
      case 'under treatment':
        return "bg-blue-100 text-blue-800";
      case 'needs attention':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livestock Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your flock health, population, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Jul 12, 2023</span>
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            <span>Add New Birds</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="flocks" className="mb-8">
        <TabsList>
          <TabsTrigger value="flocks">Flocks</TabsTrigger>
          <TabsTrigger value="breeds">Breeds</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="flocks">
          <div className="flex items-center justify-between mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search flocks or breeds..."
                className="pl-8 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                defaultValue="all" 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="under treatment">Under Treatment</SelectItem>
                  <SelectItem value="needs attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DashboardCard title="Current Flocks" className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flock Name</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlocks.map((flock) => (
                  <TableRow key={flock.id}>
                    <TableCell className="font-medium">{flock.name}</TableCell>
                    <TableCell>{flock.breed}</TableCell>
                    <TableCell>{flock.quantity}</TableCell>
                    <TableCell>{flock.age}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(flock.status)}>
                        {flock.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{flock.lastUpdate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DashboardCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              title="Total Population" 
              className="md:col-span-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-4xl font-bold">540</h3>
                  <p className="text-sm text-muted-foreground">across 5 coops</p>
                </div>
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Feather className="h-8 w-8 text-primary" />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-semibold">120</p>
                  <p className="text-xs text-muted-foreground">Laying Hens</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">380</p>
                  <p className="text-xs text-muted-foreground">Broilers</p>
                </div>
                <div>
                  <p className="text-xl font-semibold">40</p>
                  <p className="text-xs text-muted-foreground">Chicks</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard 
              title="Recent Changes" 
              className="md:col-span-2"
            >
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Plus className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Added 20 new chicks to Coop #2 (Leghorn)</p>
                    <p className="text-xs text-muted-foreground">July 10, 2023 | 2:15 PM</p>
                  </div>
                </div>
                <div className="flex items-start pb-4 border-b">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
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
                      className="h-4 w-4 text-amber-600"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">Updated health status for Coop #3 (Sussex) to "Under Treatment"</p>
                    <p className="text-xs text-muted-foreground">July 8, 2023 | 9:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
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
                      className="h-4 w-4 text-red-600"
                    >
                      <path d="m3 6 6 6-6 6" />
                      <path d="m21 6-6 6 6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">Transferred 15 hens from Coop #4 to Coop #5</p>
                    <p className="text-xs text-muted-foreground">July 7, 2023 | 3:45 PM</p>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
        
        <TabsContent value="breeds">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <ChartContainer
              title="Breed Distribution"
              description="Current flock composition"
              type="pie"
              data={[
                { name: 'Rhode Island Red', value: 120 },
                { name: 'Leghorn', value: 150 },
                { name: 'Sussex', value: 85 },
                { name: 'Plymouth Rock', value: 110 },
                { name: 'Orpington', value: 75 },
              ]}
              className="md:col-span-1"
            />
            
            <ChartContainer
              title="Breed Performance"
              description="Productivity score (out of 100)"
              type="bar"
              data={breedPerformanceData}
              className="md:col-span-2"
              color="#4f46e5"
            />
          </div>
          
          <DashboardCard title="Breed Information" className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Breed Name</TableHead>
                  <TableHead>Primary Purpose</TableHead>
                  <TableHead>Average Weight</TableHead>
                  <TableHead>Egg Production</TableHead>
                  <TableHead>Temperament</TableHead>
                  <TableHead>Climate Adaptation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Rhode Island Red</TableCell>
                  <TableCell>Dual Purpose</TableCell>
                  <TableCell>6.5 - 8.5 lbs</TableCell>
                  <TableCell>250-300 eggs/year</TableCell>
                  <TableCell>Friendly, Docile</TableCell>
                  <TableCell>Excellent</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Leghorn</TableCell>
                  <TableCell>Egg Layer</TableCell>
                  <TableCell>4.5 - 6 lbs</TableCell>
                  <TableCell>280-320 eggs/year</TableCell>
                  <TableCell>Active, Flighty</TableCell>
                  <TableCell>Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sussex</TableCell>
                  <TableCell>Dual Purpose</TableCell>
                  <TableCell>7 - 9 lbs</TableCell>
                  <TableCell>180-200 eggs/year</TableCell>
                  <TableCell>Gentle, Friendly</TableCell>
                  <TableCell>Very Good</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Plymouth Rock</TableCell>
                  <TableCell>Dual Purpose</TableCell>
                  <TableCell>7.5 - 9.5 lbs</TableCell>
                  <TableCell>200-280 eggs/year</TableCell>
                  <TableCell>Docile, Hardy</TableCell>
                  <TableCell>Excellent</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Orpington</TableCell>
                  <TableCell>Meat Type</TableCell>
                  <TableCell>8 - 10 lbs</TableCell>
                  <TableCell>175-200 eggs/year</TableCell>
                  <TableCell>Very Gentle, Broody</TableCell>
                  <TableCell>Good</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ChartContainer
              title="Egg Production"
              description="Last 6 months"
              type="area"
              data={[
                { name: 'Jan', value: 5400 },
                { name: 'Feb', value: 5200 },
                { name: 'Mar', value: 5800 },
                { name: 'Apr', value: 6100 },
                { name: 'May', value: 6500 },
                { name: 'Jun', value: 6300 },
              ]}
              color="#4f46e5"
            />
            
            <ChartContainer
              title="Mortality Rate"
              description="Last 6 months (%)"
              type="bar"
              data={[
                { name: 'Jan', value: 1.2 },
                { name: 'Feb', value: 1.0 },
                { name: 'Mar', value: 0.8 },
                { name: 'Apr', value: 1.1 },
                { name: 'May', value: 0.7 },
                { name: 'Jun', value: 0.5 },
              ]}
              color="#f43f5e"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard 
              title="Key Performance Indicators" 
              className="md:col-span-1"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Feed Conversion Ratio</span>
                    <span className="text-sm">1.8</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Excellent (benchmark: 2.0)</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Egg Production Rate</span>
                    <span className="text-sm">76%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Good (benchmark: 80%)</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span className="text-sm">92%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Excellent (benchmark: 85%)</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Survival Rate</span>
                    <span className="text-sm">98.7%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '98.7%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Excellent (benchmark: 97%)</p>
                </div>
              </div>
            </DashboardCard>
            
            <DashboardCard 
              title="Performance By Flock" 
              className="md:col-span-2"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flock</TableHead>
                    <TableHead>Egg Production</TableHead>
                    <TableHead>Feed Conversion</TableHead>
                    <TableHead>Mortality</TableHead>
                    <TableHead>Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Coop #1 (Rhode Island Red)</TableCell>
                    <TableCell className="text-green-600">High</TableCell>
                    <TableCell className="text-green-600">Excellent</TableCell>
                    <TableCell className="text-green-600">Low (0.5%)</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-secondary rounded-full mr-2">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span>90%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coop #2 (Leghorn)</TableCell>
                    <TableCell className="text-green-600">Very High</TableCell>
                    <TableCell className="text-amber-600">Good</TableCell>
                    <TableCell className="text-green-600">Low (0.7%)</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-secondary rounded-full mr-2">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span>88%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coop #3 (Sussex)</TableCell>
                    <TableCell className="text-amber-600">Medium</TableCell>
                    <TableCell className="text-amber-600">Good</TableCell>
                    <TableCell className="text-red-600">High (2.1%)</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-secondary rounded-full mr-2">
                          <div className="h-2 bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
                        </div>
                        <span>72%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coop #4 (Plymouth Rock)</TableCell>
                    <TableCell className="text-amber-600">Medium</TableCell>
                    <TableCell className="text-green-600">Excellent</TableCell>
                    <TableCell className="text-green-600">Low (0.8%)</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-secondary rounded-full mr-2">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span>85%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Coop #5 (Orpington)</TableCell>
                    <TableCell className="text-amber-600">Low</TableCell>
                    <TableCell className="text-green-600">Excellent</TableCell>
                    <TableCell className="text-amber-600">Medium (1.2%)</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-secondary rounded-full mr-2">
                          <div className="h-2 bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span>78%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default LivestockTracking;
