import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  DollarSign,
  Package,
  ShoppingBag
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
  CardFooter,
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Feed {
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

const FeedManagement: React.FC = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [feed, setFeed] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeed, setCurrentFeed] = useState<Feed | null>(null);
  const [formData, setFormData] = useState({
    feed_type: '',
    quantity: '',
    unit: '',
    purchase_date: new Date().toISOString().split('T')[0],
    expiration_date: '',
    cost_per_unit: '',
    supplier: '',
    notes: ''
  });

  useEffect(() => {
    fetchFeed();
  }, [user]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feed_inventory')
        .select('*')
        .order('purchase_date', { ascending: false });

      if (error) {
        throw error;
      }

      setFeed(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching feed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
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
    setCurrentFeed(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditDialog = (item: Feed) => {
    setCurrentFeed(item);
    setFormData({
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
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentFeed) {
        const { error } = await supabase
          .from('feed_inventory')
          .update({
            feed_type: formData.feed_type,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            purchase_date: formData.purchase_date,
            expiration_date: formData.expiration_date || null,
            cost_per_unit: parseFloat(formData.cost_per_unit),
            supplier: formData.supplier || null,
            notes: formData.notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentFeed.id);

        if (error) throw error;
        
        toast({
          title: 'Feed updated',
          description: 'The feed record has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('feed_inventory')
          .insert({
            user_id: user?.id,
            feed_type: formData.feed_type,
            quantity: parseFloat(formData.quantity),
            unit: formData.unit,
            purchase_date: formData.purchase_date,
            expiration_date: formData.expiration_date || null,
            cost_per_unit: parseFloat(formData.cost_per_unit),
            supplier: formData.supplier || null,
            notes: formData.notes || null
          });

        if (error) throw error;
        
        toast({
          title: 'Feed added',
          description: 'The new feed has been added successfully.',
        });
      }
      
      setIsOpen(false);
      resetForm();
      fetchFeed();
    } catch (error: any) {
      toast({
        title: isEditing ? 'Error updating feed' : 'Error adding feed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feed record?')) {
      try {
        const { error } = await supabase
          .from('feed_inventory')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Feed deleted',
          description: 'The feed record has been deleted successfully.',
        });
        
        fetchFeed();
      } catch (error: any) {
        toast({
          title: 'Error deleting feed',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const filteredFeed = feed.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.feed_type.toLowerCase().includes(searchLower) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchLower))
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
            Manage your feed inventory and consumption
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feed
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Feed Inventory</CardTitle>
          <CardDescription>
            Track and manage your livestock feed with detailed records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feed..."
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
          ) : filteredFeed.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No feed records found</p>
              <Button variant="outline" className="mt-4" onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first feed
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feed Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeed.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.feed_type}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{formatDate(item.purchase_date)}</TableCell>
                      <TableCell>{formatDate(item.expiration_date)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Feed' : 'Add New Feed'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this feed record.' 
                : 'Enter the details of the new feed to add to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feed_type">Feed Type <span className="text-red-500">*</span></Label>
                  <Input
                    id="feed_type"
                    name="feed_type"
                    placeholder="Grain, Hay, etc."
                    value={formData.feed_type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="Amount of feed"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit <span className="text-red-500">*</span></Label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="lbs">Pound (lbs)</option>
                    <option value="tons">Ton (tons)</option>
                    <option value="bales">Bales</option>
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
                      value={formData.cost_per_unit}
                      onChange={handleInputChange}
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
                      value={formData.purchase_date}
                      onChange={handleInputChange}
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
                      value={formData.expiration_date}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="Feed supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional information"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Add'} Feed
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default FeedManagement;
