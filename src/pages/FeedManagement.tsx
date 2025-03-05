import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedInventoryForm } from "@/components/feed/FeedInventoryForm";
import { FeedInventoryList } from "@/components/feed/FeedInventoryList";
import { FeedConsumptionForm } from "@/components/feed/FeedConsumptionForm";
import { FeedConsumptionList } from "@/components/feed/FeedConsumptionList";
import { FeedSummary } from "@/components/feed/FeedSummary";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/hooks/useAuthContext";
import { FeedInventory, FeedConsumption, FeedConsumptionWithInventory } from "@/types/livestock";

const FeedManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuthContext();
  const userId = session?.user.id || '';
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<FeedInventory | null>(null);
  const [selectedConsumptionRecord, setSelectedConsumptionRecord] = useState<FeedConsumptionWithInventory | null>(null);
  const [activeTab, setActiveTab] = useState("inventory");

  // Fetch feed inventory
  const { data: feedInventory, isLoading: loadingInventory } = useQuery({
    queryKey: ['feedInventory', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_inventory')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching feed inventory:', error);
        toast({
          title: "Error fetching inventory",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as FeedInventory[] || [];
    },
    enabled: !!userId,
  });

  // Fetch feed consumption records
  const { data: feedConsumption, isLoading: loadingConsumption } = useQuery({
    queryKey: ['feedConsumption', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feed_consumption')
        .select('*, feed_inventory!inner(feed_type)')
        .eq('user_id', userId)
        .order('consumption_date', { ascending: false });

      if (error) {
        console.error('Error fetching feed consumption:', error);
        toast({
          title: "Error fetching consumption records",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as FeedConsumptionWithInventory[] || [];
    },
    enabled: !!userId,
  });

  const handleInventorySave = async (inventory: Partial<FeedInventory>) => {
    try {
      if (selectedInventoryItem?.id) {
        // Update existing inventory
        const { error } = await supabase
          .from('feed_inventory')
          .update({
            feed_type: inventory.feed_type,
            purchase_date: inventory.purchase_date,
            quantity: inventory.quantity,
            unit: inventory.unit,
            cost_per_unit: inventory.cost_per_unit,
            supplier: inventory.supplier,
            expiration_date: inventory.expiration_date,
            notes: inventory.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedInventoryItem.id)
          .eq('user_id', userId);

        if (error) throw error;

        toast({
          title: "Inventory updated",
          description: "Feed inventory has been updated successfully",
        });
      } else {
        // Create new inventory
        const { error } = await supabase.from('feed_inventory').insert({
          feed_type: inventory.feed_type,
          purchase_date: inventory.purchase_date,
          quantity: inventory.quantity,
          unit: inventory.unit,
          cost_per_unit: inventory.cost_per_unit,
          supplier: inventory.supplier,
          expiration_date: inventory.expiration_date,
          notes: inventory.notes,
          user_id: userId,
        });

        if (error) throw error;

        toast({
          title: "Inventory added",
          description: "New feed inventory has been added successfully",
        });
      }

      // Reset form and refresh data
      setSelectedInventoryItem(null);
      queryClient.invalidateQueries({ queryKey: ['feedInventory', userId] });
      setActiveTab("inventory");
    } catch (error: any) {
      console.error('Error saving feed inventory:', error);
      toast({
        title: "Error saving inventory",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleConsumptionSave = async (consumption: Partial<FeedConsumption>) => {
    try {
      if (selectedConsumptionRecord?.id) {
        // Update existing consumption record
        const { error } = await supabase
          .from('feed_consumption')
          .update({
            feed_id: consumption.feed_id,
            consumption_date: consumption.consumption_date,
            quantity_used: consumption.quantity_used,
            livestock_group: consumption.livestock_group,
            notes: consumption.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedConsumptionRecord.id)
          .eq('user_id', userId);

        if (error) throw error;

        toast({
          title: "Consumption updated",
          description: "Feed consumption record has been updated successfully",
        });
      } else {
        // Create new consumption record
        const { error } = await supabase.from('feed_consumption').insert({
          feed_id: consumption.feed_id,
          consumption_date: consumption.consumption_date,
          quantity_used: consumption.quantity_used,
          livestock_group: consumption.livestock_group,
          notes: consumption.notes,
          user_id: userId,
        });

        if (error) throw error;

        toast({
          title: "Consumption added",
          description: "New feed consumption record has been added successfully",
        });
      }

      // Reset form and refresh data
      setSelectedConsumptionRecord(null);
      queryClient.invalidateQueries({ queryKey: ['feedConsumption', userId] });
      queryClient.invalidateQueries({ queryKey: ['feedInventory', userId] });
      setActiveTab("consumption");
    } catch (error: any) {
      console.error('Error saving feed consumption:', error);
      toast({
        title: "Error saving consumption",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditInventory = (inventory: FeedInventory) => {
    setSelectedInventoryItem(inventory);
    setActiveTab("addInventory");
  };

  const handleEditConsumption = (consumption: FeedConsumptionWithInventory) => {
    setSelectedConsumptionRecord(consumption);
    setActiveTab("addConsumption");
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feed_inventory')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Inventory deleted",
        description: "Feed inventory has been deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['feedInventory', userId] });
    } catch (error: any) {
      console.error('Error deleting feed inventory:', error);
      toast({
        title: "Error deleting inventory",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteConsumption = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feed_consumption')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Consumption deleted",
        description: "Feed consumption record has been deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['feedConsumption', userId] });
      queryClient.invalidateQueries({ queryKey: ['feedInventory', userId] });
    } catch (error: any) {
      console.error('Error deleting feed consumption:', error);
      toast({
        title: "Error deleting consumption",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
          <p className="text-muted-foreground">
            Track feed inventory and consumption for your livestock
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-background">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="addInventory">
              {selectedInventoryItem ? "Edit Inventory" : "Add Inventory"}
            </TabsTrigger>
            <TabsTrigger value="addConsumption">
              {selectedConsumptionRecord ? "Edit Consumption" : "Add Consumption"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <FeedSummary 
              feedInventory={feedInventory || []} 
              feedConsumption={(feedConsumption as FeedConsumptionWithInventory[]) || []}
              isLoading={loadingInventory || loadingConsumption} 
            />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <FeedInventoryList
              feedInventory={feedInventory || []}
              isLoading={loadingInventory}
              onEdit={handleEditInventory}
              onDelete={handleDeleteInventory}
            />
          </TabsContent>
          
          <TabsContent value="consumption" className="space-y-4">
            <FeedConsumptionList
              feedConsumption={(feedConsumption as FeedConsumptionWithInventory[]) || []}
              isLoading={loadingConsumption}
              onEdit={handleEditConsumption}
              onDelete={handleDeleteConsumption}
            />
          </TabsContent>
          
          <TabsContent value="addInventory" className="space-y-4">
            <FeedInventoryForm
              isLoading={loadingInventory}
              onSave={handleInventorySave}
              inventory={selectedInventoryItem}
              onCancel={() => {
                setSelectedInventoryItem(null);
                setActiveTab("inventory");
              }}
            />
          </TabsContent>
          
          <TabsContent value="addConsumption" className="space-y-4">
            <FeedConsumptionForm
              feedInventory={feedInventory || []}
              isLoading={loadingInventory || loadingConsumption}
              onSave={handleConsumptionSave}
              consumption={selectedConsumptionRecord}
              onCancel={() => {
                setSelectedConsumptionRecord(null);
                setActiveTab("consumption");
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default FeedManagement;
