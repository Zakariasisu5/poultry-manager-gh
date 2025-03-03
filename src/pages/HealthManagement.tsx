
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthRecordForm } from "@/components/health/HealthRecordForm";
import { HealthRecordList } from "@/components/health/HealthRecordList";
import { HealthSummary } from "@/components/health/HealthSummary";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Livestock, HealthRecord as HealthRecordType } from "@/types/livestock";

// This type for temporary use only in this component, using proper Supabase type from livestock.ts
export type HealthRecord = {
  id: string;
  livestock_id: string;
  record_type: string;
  record_date: string;
  medication?: string | null;
  dosage?: string | null;
  treatment_cost?: number | null;
  notes?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
};

const HealthManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuthContext();
  const userId = session?.user.id || '';
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [activeTab, setActiveTab] = useState("records");

  // Fetch health records
  const { data: healthRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['healthRecords', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_records')
        .select('*, livestock!inner(id, animal_type, tag_number, breed)')
        .eq('user_id', userId)
        .order('record_date', { ascending: false });

      if (error) {
        console.error('Error fetching health records:', error);
        toast({
          title: "Error fetching records",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    },
    enabled: !!userId,
  });

  // Fetch livestock data for dropdown
  const { data: livestock, isLoading: loadingLivestock } = useQuery({
    queryKey: ['livestockForHealth', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('livestock')
        .select('id, animal_type, tag_number, breed')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching livestock:', error);
        toast({
          title: "Error fetching livestock",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as Pick<Livestock, 'id' | 'animal_type' | 'tag_number' | 'breed'>[] || [];
    },
    enabled: !!userId,
  });

  const handleRecordSave = async (record: Partial<HealthRecord>) => {
    try {
      if (selectedRecord?.id) {
        // Update existing record
        const { error } = await supabase
          .from('health_records')
          .update({
            livestock_id: record.livestock_id,
            record_type: record.record_type,
            record_date: record.record_date,
            medication: record.medication,
            dosage: record.dosage,
            treatment_cost: record.treatment_cost,
            notes: record.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedRecord.id)
          .eq('user_id', userId);

        if (error) throw error;

        toast({
          title: "Record updated",
          description: "Health record has been updated successfully",
        });
      } else {
        // Create new record
        const { error } = await supabase.from('health_records').insert({
          livestock_id: record.livestock_id,
          record_type: record.record_type,
          record_date: record.record_date,
          medication: record.medication,
          dosage: record.dosage,
          treatment_cost: record.treatment_cost,
          notes: record.notes,
          user_id: userId,
        });

        if (error) throw error;

        toast({
          title: "Record added",
          description: "New health record has been added successfully",
        });
      }

      // Reset form and refresh data
      setSelectedRecord(null);
      queryClient.invalidateQueries({ queryKey: ['healthRecords', userId] });
      setActiveTab("records");
    } catch (error: any) {
      console.error('Error saving health record:', error);
      toast({
        title: "Error saving record",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setActiveTab("add");
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Record deleted",
        description: "Health record has been deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['healthRecords', userId] });
    } catch (error: any) {
      console.error('Error deleting health record:', error);
      toast({
        title: "Error deleting record",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Management</h1>
          <p className="text-muted-foreground">
            Track vaccinations, treatments, and health events for your livestock
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-background">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="records">Health Records</TabsTrigger>
            <TabsTrigger value="add">
              {selectedRecord ? "Edit Record" : "Add Record"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <HealthSummary 
              healthRecords={healthRecords || []} 
              isLoading={loadingRecords} 
            />
          </TabsContent>
          
          <TabsContent value="records" className="space-y-4">
            <HealthRecordList
              healthRecords={healthRecords || []}
              isLoading={loadingRecords}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          </TabsContent>
          
          <TabsContent value="add" className="space-y-4">
            <HealthRecordForm
              livestock={livestock || []}
              isLoading={loadingLivestock || loadingRecords}
              onSave={handleRecordSave}
              record={selectedRecord}
              onCancel={() => {
                setSelectedRecord(null);
                setActiveTab("records");
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default HealthManagement;
