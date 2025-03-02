import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Tag,
  Calendar,
  DollarSign
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

interface Livestock {
  id: string;
  animal_type: string;
  breed: string | null;
  tag_number: string | null;
  date_acquired: string;
  acquisition_cost: number | null;
  gender: string | null;
  date_of_birth: string | null;
  notes: string | null;
  status: string;
}

const LivestockTracking: React.FC = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState<Livestock | null>(null);
  const [formData, setFormData] = useState({
    animal_type: '',
    breed: '',
    tag_number: '',
    date_acquired: new Date().toISOString().split('T')[0],
    acquisition_cost: '',
    gender: '',
    date_of_birth: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    fetchLivestock();
  }, [user]);

  const fetchLivestock = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('date_acquired', { ascending: false });

      if (error) {
        throw error;
      }

      setLivestock(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching livestock',
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
      animal_type: '',
      breed: '',
      tag_number: '',
      date_acquired: new Date().toISOString().split('T')[0],
      acquisition_cost: '',
      gender: '',
      date_of_birth: '',
      notes: '',
      status: 'active'
    });
    setIsEditing(false);
    setCurrentLivestock(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditDialog = (item: Livestock) => {
    setCurrentLivestock(item);
    setFormData({
      animal_type: item.animal_type,
      breed: item.breed || '',
      tag_number: item.tag_number || '',
      date_acquired: item.date_acquired,
      acquisition_cost: item.acquisition_cost?.toString() || '',
      gender: item.gender || '',
      date_of_birth: item.date_of_birth || '',
      notes: item.notes || '',
      status: item.status
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentLivestock) {
        // Update existing livestock
        const { error } = await supabase
          .from('livestock')
          .update({
            animal_type: formData.animal_type,
            breed: formData.breed || null,
            tag_number: formData.tag_number || null,
            date_acquired: formData.date_acquired,
            acquisition_cost: formData.acquisition_cost ? parseFloat(formData.acquisition_cost) : null,
            gender: formData.gender || null,
            date_of_birth: formData.date_of_birth || null,
            notes: formData.notes || null,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentLivestock.id);

        if (error) throw error;
        
        toast({
          title: 'Livestock updated',
          description: 'The livestock record has been updated successfully.',
        });
      } else {
        // Add new livestock
        const { error } = await supabase
          .from('livestock')
          .insert({
            user_id: user?.id,
            animal_type: formData.animal_type,
            breed: formData.breed || null,
            tag_number: formData.tag_number || null,
            date_acquired: formData.date_acquired,
            acquisition_cost: formData.acquisition_cost ? parseFloat(formData.acquisition_cost) : null,
            gender: formData.gender || null,
            date_of_birth: formData.date_of_birth || null,
            notes: formData.notes || null,
            status: formData.status
          });

        if (error) throw error;
        
        toast({
          title: 'Livestock added',
          description: 'The new livestock has been added successfully.',
        });
      }
      
      setIsOpen(false);
      resetForm();
      fetchLivestock();
    } catch (error: any) {
      toast({
        title: isEditing ? 'Error updating livestock' : 'Error adding livestock',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this livestock record?')) {
      try {
        const { error } = await supabase
          .from('livestock')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Livestock deleted',
          description: 'The livestock record has been deleted successfully.',
        });
        
        fetchLivestock();
      } catch (error: any) {
        toast({
          title: 'Error deleting livestock',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const filteredLivestock = livestock.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.animal_type.toLowerCase().includes(searchLower) ||
      (item.breed && item.breed.toLowerCase().includes(searchLower)) ||
      (item.tag_number && item.tag_number.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'sold':
        return 'bg-blue-500';
      case 'deceased':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livestock Tracking</h1>
          <p className="text-muted-foreground">
            Manage your livestock records
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Livestock
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Livestock Management</CardTitle>
          <CardDescription>
            Track and manage your farm animals with detailed records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search livestock..."
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
          ) : filteredLivestock.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No livestock records found</p>
              <Button variant="outline" className="mt-4" onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first livestock
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Animal Type</TableHead>
                    <TableHead>Tag/ID</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Acquired</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLivestock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.animal_type}</TableCell>
                      <TableCell>{item.tag_number || 'N/A'}</TableCell>
                      <TableCell>{item.breed || 'N/A'}</TableCell>
                      <TableCell>{formatDate(item.date_acquired)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
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
            <DialogTitle>{isEditing ? 'Edit Livestock' : 'Add New Livestock'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this livestock record.' 
                : 'Enter the details of the new livestock to add to your records.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animal_type">Animal Type <span className="text-red-500">*</span></Label>
                  <Input
                    id="animal_type"
                    name="animal_type"
                    placeholder="Chicken, Duck, etc."
                    value={formData.animal_type}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="deceased">Deceased</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag_number">Tag/ID Number</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tag_number"
                      name="tag_number"
                      placeholder="Identification number"
                      value={formData.tag_number}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    name="breed"
                    placeholder="Breed type"
                    value={formData.breed}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_acquired">Date Acquired <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date_acquired"
                      name="date_acquired"
                      type="date"
                      value={formData.date_acquired}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisition_cost">Acquisition Cost</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="acquisition_cost"
                      name="acquisition_cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.acquisition_cost}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
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
                {isEditing ? 'Update' : 'Add'} Livestock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default LivestockTracking;
