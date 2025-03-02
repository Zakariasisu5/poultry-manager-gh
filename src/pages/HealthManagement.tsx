
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  Heart,
  Pill,
  FileText,
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

interface HealthRecord {
  id: string;
  livestock_id: string;
  record_date: string;
  record_type: string;
  medication: string | null;
  dosage: string | null;
  treatment_cost: number | null;
  notes: string | null;
}

interface Livestock {
  id: string;
  animal_type: string;
  tag_number: string | null;
}

const HealthManagement: React.FC = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);
  const [formData, setFormData] = useState({
    livestock_id: '',
    record_date: new Date().toISOString().split('T')[0],
    record_type: '',
    medication: '',
    dosage: '',
    treatment_cost: '',
    notes: ''
  });

  useEffect(() => {
    fetchHealthRecords();
    fetchLivestock();
  }, [user]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          livestock:livestock_id (
            animal_type,
            tag_number
          )
        `)
        .order('record_date', { ascending: false });

      if (error) {
        throw error;
      }

      setHealthRecords(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching health records',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLivestock = async () => {
    try {
      const { data, error } = await supabase
        .from('livestock')
        .select('id, animal_type, tag_number')
        .eq('status', 'active');

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
      livestock_id: '',
      record_date: new Date().toISOString().split('T')[0],
      record_type: '',
      medication: '',
      dosage: '',
      treatment_cost: '',
      notes: ''
    });
    setIsEditing(false);
    setCurrentRecord(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditDialog = (record: HealthRecord) => {
    setCurrentRecord(record);
    setFormData({
      livestock_id: record.livestock_id,
      record_date: record.record_date,
      record_type: record.record_type,
      medication: record.medication || '',
      dosage: record.dosage || '',
      treatment_cost: record.treatment_cost?.toString() || '',
      notes: record.notes || ''
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentRecord) {
        // Update existing record
        const { error } = await supabase
          .from('health_records')
          .update({
            livestock_id: formData.livestock_id,
            record_date: formData.record_date,
            record_type: formData.record_type,
            medication: formData.medication || null,
            dosage: formData.dosage || null,
            treatment_cost: formData.treatment_cost ? parseFloat(formData.treatment_cost) : null,
            notes: formData.notes || null,
            updated_at: new Date()
          })
          .eq('id', currentRecord.id);

        if (error) throw error;
        
        toast({
          title: 'Health record updated',
          description: 'The health record has been updated successfully.',
        });
      } else {
        // Add new record
        const { error } = await supabase
          .from('health_records')
          .insert({
            user_id: user?.id,
            livestock_id: formData.livestock_id,
            record_date: formData.record_date,
            record_type: formData.record_type,
            medication: formData.medication || null,
            dosage: formData.dosage || null,
            treatment_cost: formData.treatment_cost ? parseFloat(formData.treatment_cost) : null,
            notes: formData.notes || null
          });

        if (error) throw error;
        
        toast({
          title: 'Health record added',
          description: 'The new health record has been added successfully.',
        });
      }
      
      setIsOpen(false);
      resetForm();
      fetchHealthRecords();
    } catch (error: any) {
      toast({
        title: isEditing ? 'Error updating health record' : 'Error adding health record',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        const { error } = await supabase
          .from('health_records')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: 'Health record deleted',
          description: 'The health record has been deleted successfully.',
        });
        
        fetchHealthRecords();
      } catch (error: any) {
        toast({
          title: 'Error deleting health record',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const filteredRecords = healthRecords.filter((record: any) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      record.livestock?.animal_type?.toLowerCase().includes(searchLower) ||
      record.record_type.toLowerCase().includes(searchLower) ||
      (record.medication && record.medication.toLowerCase().includes(searchLower)) ||
      (record.livestock?.tag_number && record.livestock.tag_number.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecordTypeBadge = (type: string) => {
    const typeColorMap: Record<string, string> = {
      'vaccination': 'bg-green-500',
      'medication': 'bg-blue-500',
      'checkup': 'bg-yellow-500',
      'surgery': 'bg-red-500',
      'injury': 'bg-orange-500',
      'illness': 'bg-purple-500',
      'other': 'bg-gray-500'
    };

    return typeColorMap[type.toLowerCase()] || 'bg-gray-500';
  };

  const getLivestockLabel = (id: string) => {
    const animal = livestock.find(l => l.id === id);
    if (!animal) return 'Unknown';
    return `${animal.animal_type}${animal.tag_number ? ` (${animal.tag_number})` : ''}`;
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Management</h1>
          <p className="text-muted-foreground">
            Track health records for your livestock
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Health Records</CardTitle>
          <CardDescription>
            Track vaccinations, treatments, and health issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
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
          ) : livestock.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You need to add livestock before adding health records</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/livestock'}>
                Go to Livestock Page
              </Button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No health records found</p>
              <Button variant="outline" className="mt-4" onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first health record
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Record Type</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.record_date)}</TableCell>
                      <TableCell>
                        {record.livestock ? 
                          `${record.livestock.animal_type}${record.livestock.tag_number ? ` (${record.livestock.tag_number})` : ''}` : 
                          'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRecordTypeBadge(record.record_type)}>
                          {record.record_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.medication || 'N/A'}</TableCell>
                      <TableCell>
                        {record.treatment_cost ? `$${record.treatment_cost.toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(record)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
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
            <DialogTitle>{isEditing ? 'Edit Health Record' : 'Add New Health Record'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update the details for this health record.' 
                : 'Enter the details of the new health record.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="livestock_id">Animal <span className="text-red-500">*</span></Label>
                  <select
                    id="livestock_id"
                    name="livestock_id"
                    value={formData.livestock_id}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select animal</option>
                    {livestock.map(animal => (
                      <option key={animal.id} value={animal.id}>
                        {animal.animal_type}{animal.tag_number ? ` (${animal.tag_number})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="record_date">Record Date <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="record_date"
                      name="record_date"
                      type="date"
                      value={formData.record_date}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="record_type">Record Type <span className="text-red-500">*</span></Label>
                <select
                  id="record_type"
                  name="record_type"
                  value={formData.record_type}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select record type</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="medication">Medication</option>
                  <option value="checkup">Checkup</option>
                  <option value="surgery">Surgery</option>
                  <option value="injury">Injury</option>
                  <option value="illness">Illness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <div className="relative">
                    <Pill className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="medication"
                      name="medication"
                      placeholder="Medication name"
                      value={formData.medication}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    placeholder="Medication dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment_cost">Treatment Cost</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="treatment_cost"
                    name="treatment_cost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.treatment_cost}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional information about the health record"
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
                {isEditing ? 'Update' : 'Add'} Health Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default HealthManagement;
