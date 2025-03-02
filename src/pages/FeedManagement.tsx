
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  BarChart,
  ShoppingBag,
  Sack,
  DollarSign,
  Store
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/hooks/useAuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/dashboard/ChartContainer';

interface FeedInventory {
  id: string;
  feed_type: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  expiration_date: string | null;
  cost_per_unit: number;
  supplier: string | null;
  notes: string | null;
}

interface FeedConsumption {
  id: string;
  feed_id: string;
  consumption_date: string;
  quantity_used: number;
  livestock_group: string | null;
  notes: string | null;
  feed?: {
    feed_type: string;
    unit: string;
  };
}

const FeedManagement: React.FC = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>([]);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Form states
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isConsumptionDialogOpen, setIsConsumptionDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInventory, setCurrentInventory] = useState<FeedInventory | null>(null);
  const [currentConsumption, setCurrentConsumption] = useState<FeedConsumption | null>(null);
  
  const [inventoryFormData, setInventoryFormData] = useState({
    feed_type: '',
    quantity: '',
    unit: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    cost_per_unit: '',
    supplier: '',
    notes: ''
  });

  const [consumptionFormData, setConsumptionFormData] = useState({
    feed_id: '',
    consumption_date: new Date().toISOString().split('T')[0],
    quantity_used: '',
    livestock_group: '',
    notes: ''
  });

  // Chart data
  const [feedTypeDistribution, setFeedTypeDistribution] = useState<any[]>([]);
  const [feedConsumptionTrend, setFeedConsumptionTrend] = useState<any[]>([]);

  useEffect(() => {
    fetchFeedInventory();
    fetchFeedConsumption();
  }, [user]);

  useEffect(() => {
    if (feedInventory.length > 0) {
      prepareFeedTypeDistribution();
    }
  }, [feedInventory]);

  useEffect(() => {
    if (feedConsumption.length > 0) {
      prepareFeedConsumptionTrend();
    }
  }, [feedConsumption]);

  const fetchFeedInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feed_inventory')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (error) {
        throw error;
      }

      setFeedInventory(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching feed inventory',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedConsumption = async () => {
    try {
      const { data, error } = await supabase
        .from('feed_consumption')
        .select(`
          *,
          feed:feed_id (
            feed_type,
            unit
          )
        `)
        .order('consumption_date', { ascending: false });

      if (error) {
        throw error;
      }

      setFeedConsumption(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching feed consumption',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const prepareFeedTypeDistribution = () => {
    const aggregatedData: Record<string, number> = {};
    
    feedInventory.forEach(item => {
      if (!aggregatedData[item.feed_type]) {
        aggregatedData[item.feed_type] = 0;
      }
      aggregatedData[item.feed_type] += item.quantity;
    });
    
    const chartData = Object.entries(aggregatedData).map(([name, value]) => ({
      name,
      value
    }));
    
    setFeedTypeDistribution(chartData);
  };

  const prepareFeedConsumptionTrend = () => {
    // Group consumption by date
    const consumptionByDate: Record<string, number> = {};
    
    // Get the last 7 entries
    const recentConsumption = [...feedConsumption]
      .sort((a, b) => new Date(b.consumption_date).getTime() - new Date(a.consumption_date).getTime())
      .slice(0, 7)
      .reverse();
    
    recentConsumption.forEach(item => {
      const date = new Date(item.consumption_date).toLocaleDateString();
      if (!consumptionByDate[date]) {
        consumptionByDate[date] = 0;
      }
      consumptionByDate[date] += item.quantity_used;
    });
    
    const chartData = Object.entries(consumptionByDate).map(([name, value]) => ({
      name,
      value
    }));
    
    setFeedConsumptionTrend(chartData);
  };

  const handleInventoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInventoryFormData({
      ...inventoryFormData,
      [name]: value
    });
  };

  const handleConsumptionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConsumptionFormData({
      ...consumptionFormData,
      [name]: value
    });
  };

  const resetInventoryForm = () => {
    setInventoryFormData({
      feed_type: '',
      quantity: '',
      unit: '',
      purchase_date: new Date().toISOString().split('T')[0],
      expiration_date: '',
      cost_per_unit: '',
      supplier: '',
      notes: ''
    });
    setIsEditing(false);
    setCurrentInventory(null);
  };

  const resetConsumptionForm = () => {
    setConsumptionFormData({
      feed_id: '',
      consumption_date: new Date().toISOString().split('T')[0],
      quantity_used: '',
      livestock_group: '',
      notes: ''
    });
    setIsEditing(false);
    setCurrentConsumption(null);
  };

  const openAddInventoryDialog = () => {
    resetInventoryForm();
    setIsInventoryDialogOpen(true);
  };

  const openEditInventoryDialog = (item: FeedInventory) => {
    setCurrentInventory(item);
    setInventoryFormData({
      feed_type: item.feed_type,
      quantity: item.quantity.toString(),
      unit: item.unit,
      purchase_date: item.purchase_date,
      expiration_date: item.expiration_date || '',
      cost_per_unit: item.cost_per_unit.toString(),
      supplier: item.supplier || '',
      notes: item.notes || ''
    });
    setIsEditing(true);
    setIsInventoryDialogOpen(true);
  };

  const openAddConsumptionDialog = () => {
    resetConsumptionForm();
    setIsConsumptionDialogOpen(true);
  };

  const openEditConsumptionDialog = (item: FeedConsumption) => {
    setCurrentConsumption(item);
    setConsumptionFormData({
      feed_id: item.feed_id,
      consumption_date: item.consumption_date,
      quantity_used: item.quantity_used.toString(),
      livestock_group: item.livestock_group || '',
      notes: item.notes || ''
    });
    setIsEditing(true);
    setIsConsumptionDialogOpen(true);
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentInventory) {
        // Update existing inventory
        const { error } = await supabase
          .from('feed_inventory')
          .update({
            feed_type: inventoryFormData.feed_type,
            quantity: parseFloat(inventoryFormData.quantity),
            unit: inventoryFormData.unit,
            purchase_date: inventoryFormData.purchase_date,
            expiration_date: inventoryFormData.expiration_date || null,
            cost_per_unit: parseFloat(inventoryFormData.cost_per_unit),
            supplier: inventoryFormData.supplier || null,
            notes: inventoryFormData.notes || null,
            updated_at: new Date()
          })
          .eq('id', currentInventory.id);

        if (error) throw error;
        
        toast({
          title: 'Feed inventory updated',
          description: 'The feed inventory has been updated successfully.',
        });
      } else {
        // Add new inventory
        const { error } = await supabase
          .from('feed_inventory')
          .insert({
            user_id: user?.id,
            feed_type: inventoryFormData.feed_type,
            quantity: parseFloat(inventoryFormData.quantity),
            unit: inventoryFormData.unit,
            purchase_date: inventoryFormData.purchase_date,
            expiration_date: inventoryFormData.expiration_date || null,
            cost_per_unit: parseFloat(inventoryFormData.cost_per_unit),
            supplier: inventoryFormData.supplier || null,
            notes: inventoryFormData.notes || null
          });

        if (error) throw error;
        
        toast({
          title: 'Feed inventory added',
          description: 'The new feed inventory has been added successfully.',
        });
      }
      
      setIsInventoryDialogOpen(false);
      resetInventoryForm();
      fetchFeedInventory();
    } catch (error: any) {
      toast({
        title: isEditing ? 'Error updating feed inventory' : 'Error adding feed inventory',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleConsumptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentConsumption) {
        // Update existing consumption
        const { error } = await supabase
          .from('feed_consumption')
          .update({
            feed_id: consumptionFormData.feed_id,
            consumption_date: consumptionFormData.consumption_date,
            quantity_used: parseFloat(consumptionFormData.quantity_used),
            livestock_group: consumptionFormData.livestock_group || null,
            notes: consumptionFormData.notes || null,
            updated_at: new Date()
          })
          .eq('id', currentConsumption.id);

        if (error) throw error;
        
        toast({
          title: 'Feed consumption updated',
          description: 'The feed consumption record has been updated successfully.',
        });
      } else {
        // Add new consumption
        const { error } = await supabase
          .from('feed_consumption')
          .insert({
            user_id: user?.id,
            feed_id: consumptionFormData.feed_id,
            consumption_date: consumptionFormData.consumption_date,
            quantity_used: parseFloat(consumptionFormData.quantity_used),
            livestock_group: consumptionFormData.livestock_group || null,
            notes: consumptionFormData.notes || null
          });

        if (error) throw error;
        
        toast({
          title: 'Feed consumption added',
          description: 'The new feed consumption record has been added successfully.',
        });
      }
      
      setIsConsumptionDialogOpen(false);
      resetConsumptionForm();
      fetchFeedConsumption();
      
      // Also update inventory since consumption affects it
      fetchFeedInventory();
    } catch (error: any) {
      toast({
        title: isEditing ? 'Error updating feed consumption' : 'Error adding feed consumption',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feed inventory record? This will also delete associated consumption records.')) {
      try {
        const { error } = await supabase
          .from('feed_inventory')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Feed inventory deleted',
          description: 'The feed inventory record has been deleted successfully.',
        });
        
        fetchFeedInventory();
        fetchFeedConsumption();
      } catch (error: any) {
        toast({
          title: 'Error deleting feed inventory',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteConsumption = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feed consumption record?')) {
      try {
        const { error } = await supabase
          .from('feed_consumption')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Feed consumption deleted',
          description: 'The feed consumption record has been deleted successfully.',
        });
        
        fetchFeedConsumption();
      } catch (error: any) {
        toast({
          title: 'Error deleting feed consumption',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const filteredInventory = feedInventory.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.feed_type.toLowerCase().includes(searchLower) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchLower))
    );
  });

  const filteredConsumption = feedConsumption.filter((item: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.feed?.feed_type && item.feed.feed_type.toLowerCase().includes(searchLower)) ||
      (item.livestock_group && item.livestock_group.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
          <p className="text-muted-foreground">
            Track and manage your feed inventory and consumption
          </p>
        </div>
        {activeTab === 'inventory' ? (
          <Button onClick={openAddInventoryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feed Inventory
          </Button>
        ) : (
          <Button onClick={openAddConsumptionDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Feed Consumption
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartContainer
          title="Feed Type Distribution"
          description="Current inventory by feed type"
          type="pie"
          data={feedTypeDistribution}
        />
        
        <ChartContainer
          title="Feed Consumption Trend"
          description="Recent feed usage"
          type="bar"
          data={feedConsumptionTrend}
          color="#10b981"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Feed Inventory</TabsTrigger>
          <TabsTrigger value="consumption">Feed Consumption</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feed Inventory</CardTitle>
              <CardDescription>
                Manage your feed stock and supplies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredInventory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No feed inventory records found</p>
                  <Button variant="outline" className="mt-4" onClick={openAddInventoryDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first feed inventory
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feed Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Cost/Unit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.feed_type}</TableCell>
                          <TableCell>{item.quantity} {item.unit}</TableCell>
                          <TableCell>{formatDate(item.purchase_date)}</TableCell>
                          <TableCell>
                            {item.expiration_date ? (
                              <span className={new Date(item.expiration_date) < new Date() ? "text-red-500" : ""}>
                                {formatDate(item.expiration_date)}
                              </span>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>${item.cost_per_unit.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditInventoryDialog(item)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteInventory(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumption">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Feed Consumption</CardTitle>
              <CardDescription>
                Track feed usage across your farm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search consumption..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : feedInventory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You need to add feed inventory before recording consumption</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab('inventory')}>
                    Go to Feed Inventory
                  </Button>
                </div>
              ) : filteredConsumption.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No feed consumption records found</p>
                  <Button variant="outline" className="mt-4" onClick={openAddConsumptionDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first feed consumption record
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Feed Type</TableHead>
                        <TableHead>Quantity Used</TableHead>
                        <TableHead>Livestock Group</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConsumption.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDate(item.consumption_date)}</TableCell>
                          <TableCell className="font-medium">
                            {item.feed?.feed_type || 'Unknown Feed'}
                          </TableCell>
                          <TableCell>
                            {item.quantity_used} {item.feed?.unit || 'units'}
                          </TableCell>
                          <TableCell>{item.livestock_group || 'General'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditConsumptionDialog(item)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteConsumption(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feed Inventory Dialog */}
      <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Feed Inventory' : 'Add New Feed Inventory'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this feed inventory record.' 
                : 'Enter the details of the new feed to add to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInventorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feed_type">Feed Type <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Sack className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="feed_type"
                      name="feed_type"
                      placeholder="e.g. Layer Mash, Chick Starter"
                      value={inventoryFormData.feed_type}
                      onChange={handleInventoryInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="supplier"
                      name="supplier"
                      placeholder="Supplier name"
                      value={inventoryFormData.supplier}
                      onChange={handleInventoryInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={inventoryFormData.quantity}
                    onChange={handleInventoryInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit <span className="text-red-500">*</span></Label>
                  <select
                    id="unit"
                    name="unit"
                    value={inventoryFormData.unit}
                    onChange={handleInventoryInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select unit</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="lb">Pounds (lb)</option>
                    <option value="ton">Tons</option>
                    <option value="bags">Bags</option>
                    <option value="sacks">Sacks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_per_unit">Cost per Unit <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cost_per_unit"
                      name="cost_per_unit"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={inventoryFormData.cost_per_unit}
                      onChange={handleInventoryInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Purchase Date <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="purchase_date"
                      name="purchase_date"
                      type="date"
                      value={inventoryFormData.purchase_date}
                      onChange={handleInventoryInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiration_date">Expiration Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="expiration_date"
                      name="expiration_date"
                      type="date"
                      value={inventoryFormData.expiration_date}
                      onChange={handleInventoryInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional information about this feed"
                  value={inventoryFormData.notes}
                  onChange={handleInventoryInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsInventoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Feed Inventory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Feed Consumption Dialog */}
      <Dialog open={isConsumptionDialogOpen} onOpenChange={setIsConsumptionDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Feed Consumption' : 'Add Feed Consumption'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this feed consumption record.' 
                : 'Record feed usage for your livestock.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConsumptionSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feed_id">Feed Type <span className="text-red-500">*</span></Label>
                  <select
                    id="feed_id"
                    name="feed_id"
                    value={consumptionFormData.feed_id}
                    onChange={handleConsumptionInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select feed</option>
                    {feedInventory.map(feed => (
                      <option key={feed.id} value={feed.id}>
                        {feed.feed_type} ({feed.quantity} {feed.unit} remaining)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consumption_date">Date <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="consumption_date"
                      name="consumption_date"
                      type="date"
                      value={consumptionFormData.consumption_date}
                      onChange={handleConsumptionInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity_used">Quantity Used <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity_used"
                    name="quantity_used"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={consumptionFormData.quantity_used}
                    onChange={handleConsumptionInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="livestock_group">Livestock Group</Label>
                  <Input
                    id="livestock_group"
                    name="livestock_group"
                    placeholder="e.g. Layer Hens, Broilers"
                    value={consumptionFormData.livestock_group}
                    onChange={handleConsumptionInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional information about this consumption"
                  value={consumptionFormData.notes}
                  onChange={handleConsumptionInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsConsumptionDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Feed Consumption
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default FeedManagement;
