
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageContainer } from "@/components/layout/PageContainer";
import { LivestockTable } from "@/components/livestock/LivestockTable";
import { LivestockForm } from "@/components/livestock/LivestockForm";
import { LivestockSummary } from "@/components/livestock/LivestockSummary";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Livestock {
  id: string;
  animal_type: string;
  tag_number: string | null;
  breed: string | null;
  gender: string | null;
  date_of_birth: string | null;
  date_acquired: string;
  acquisition_cost: number | null;
  status: string;
  notes: string | null;
}

const LivestockTracking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState<Livestock | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (user) {
      fetchLivestock();
    }
  }, [user]);

  const fetchLivestock = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("livestock")
        .select("*")
        .eq("user_id", user?.id)
        .order("date_acquired", { ascending: false });

      if (error) {
        console.error("Error fetching livestock:", error);
        toast({
          title: "Error",
          description: "Failed to fetch livestock data",
          variant: "destructive",
        });
      } else {
        setLivestock(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLivestock(null);
    setOpenDialog(true);
  };

  const handleEdit = (livestock: Livestock) => {
    setEditingLivestock(livestock);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("livestock")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error deleting livestock:", error);
        toast({
          title: "Error",
          description: "Failed to delete livestock",
          variant: "destructive",
        });
      } else {
        setLivestock(livestock.filter(item => item.id !== id));
        toast({
          title: "Success",
          description: "Livestock deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (data: Omit<Livestock, "id">) => {
    try {
      if (editingLivestock) {
        // Update existing livestock
        const { error } = await supabase
          .from("livestock")
          .update(data)
          .eq("id", editingLivestock.id)
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error updating livestock:", error);
          toast({
            title: "Error",
            description: "Failed to update livestock",
            variant: "destructive",
          });
        } else {
          fetchLivestock();
          setOpenDialog(false);
          toast({
            title: "Success",
            description: "Livestock updated successfully",
          });
        }
      } else {
        // Add new livestock
        const { error } = await supabase
          .from("livestock")
          .insert([{ ...data, user_id: user?.id }]);

        if (error) {
          console.error("Error adding livestock:", error);
          toast({
            title: "Error",
            description: "Failed to add livestock",
            variant: "destructive",
          });
        } else {
          fetchLivestock();
          setOpenDialog(false);
          toast({
            title: "Success",
            description: "Livestock added successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredLivestock = livestock.filter(animal => {
    const matchesSearch = 
      animal.tag_number?.toLowerCase().includes(filterValue.toLowerCase()) ||
      animal.animal_type.toLowerCase().includes(filterValue.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(filterValue.toLowerCase()) ||
      animal.status.toLowerCase().includes(filterValue.toLowerCase());
    
    if (filterType === "all") return matchesSearch;
    
    return matchesSearch && animal.status.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <PageContainer title="Livestock Tracking" 
      subtitle="Manage and monitor your farm's livestock">
      
      <div className="mb-6">
        <LivestockSummary livestock={livestock} />
      </div>
      
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search livestock..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="deceased">Deceased</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Livestock
        </Button>
      </div>

      <LivestockTable 
        livestock={filteredLivestock}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLivestock ? "Edit Livestock" : "Add New Livestock"}
            </DialogTitle>
            <DialogDescription>
              {editingLivestock 
                ? "Update the information for this livestock"
                : "Fill in the details to add a new livestock to your farm"}
            </DialogDescription>
          </DialogHeader>
          <LivestockForm 
            initialData={editingLivestock || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default LivestockTracking;
