
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PageContainer } from '@/components/layout/PageContainer';
import { LivestockTable } from '@/components/livestock/LivestockTable';
import { LivestockSummary } from '@/components/livestock/LivestockSummary';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LivestockForm } from '@/components/livestock/LivestockForm';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Tables } from '@/integrations/supabase/types';

const LivestockTracking = () => {
  const [livestock, setLivestock] = useState<Tables<'livestock'>[]>([]);
  const [filteredLivestock, setFilteredLivestock] = useState<Tables<'livestock'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState<Tables<'livestock'> | null>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    fetchLivestock();
  }, []);

  useEffect(() => {
    filterLivestock();
  }, [livestock, searchQuery, activeTab]);

  const fetchLivestock = async () => {
    try {
      setIsLoading(true);
      
      if (!user) return;

      const { data, error } = await supabase
        .from('livestock')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching livestock:', error);
        toast({
          title: 'Error fetching livestock',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setLivestock(data || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'An error occurred',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterLivestock = () => {
    let filtered = [...livestock];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (animal) =>
          animal.animal_type.toLowerCase().includes(query) ||
          (animal.breed && animal.breed.toLowerCase().includes(query)) ||
          (animal.tag_number && animal.tag_number.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter((animal) => animal.status === activeTab);
    }

    setFilteredLivestock(filtered);
  };

  const handleAddLivestock = () => {
    setEditingLivestock(null);
    setIsFormOpen(true);
  };

  const handleEditLivestock = (livestock: Tables<'livestock'>) => {
    setEditingLivestock(livestock);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingLivestock(null);
  };

  const handleFormSubmit = async (formData: Partial<Tables<'livestock'>>) => {
    try {
      if (editingLivestock) {
        // Update existing livestock
        const { error } = await supabase
          .from('livestock')
          .update(formData)
          .eq('id', editingLivestock.id);

        if (error) throw error;
        
        toast({
          title: 'Livestock updated',
          description: 'Livestock has been updated successfully.',
        });
      } else {
        // Add new livestock
        const { error } = await supabase
          .from('livestock')
          .insert([{ ...formData, user_id: user?.id }]);

        if (error) throw error;
        
        toast({
          title: 'Livestock added',
          description: 'New livestock has been added successfully.',
        });
      }
      
      // Refresh the livestock data
      fetchLivestock();
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving livestock:', error);
      toast({
        title: 'Error saving livestock',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteLivestock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('livestock')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Livestock deleted',
        description: 'Livestock has been deleted successfully.',
      });
      
      // Refresh the livestock data
      fetchLivestock();
    } catch (error: any) {
      console.error('Error deleting livestock:', error);
      toast({
        title: 'Error deleting livestock',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Livestock Tracking</h1>
          <p className="text-muted-foreground">Manage your livestock inventory and track your animals.</p>
        </div>

        {!isLoading && (
          <LivestockSummary livestock={livestock} />
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search livestock..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddLivestock}>Add Livestock</Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="sold">Sold</TabsTrigger>
            <TabsTrigger value="deceased">Deceased</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <LivestockTable 
              livestock={filteredLivestock} 
              isLoading={isLoading}
              onEdit={handleEditLivestock}
              onDelete={handleDeleteLivestock}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingLivestock ? 'Edit Livestock' : 'Add New Livestock'}</DialogTitle>
            <DialogDescription>
              {editingLivestock 
                ? 'Update the details for this livestock.' 
                : 'Enter the details for your new livestock.'}
            </DialogDescription>
          </DialogHeader>
          <LivestockForm 
            onSubmit={handleFormSubmit} 
            onCancel={handleFormClose}
            initialData={editingLivestock || undefined}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default LivestockTracking;
