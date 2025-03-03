
import { useState } from "react";
import { 
  AlertCircle,
  Calendar,
  FileEdit,
  Plus,
  Search,
  Trash2,
  Stethoscope
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data for demonstration
const mockHealthRecords = [
  { 
    id: "1", 
    recordDate: "2023-04-15", 
    livestockId: "A001", 
    recordType: "Vaccination", 
    medication: "Newcastle Disease Vaccine", 
    dosage: "0.5ml", 
    treatmentCost: 12.50,
    notes: "Routine vaccination"
  },
  { 
    id: "2", 
    recordDate: "2023-04-20", 
    livestockId: "A002", 
    recordType: "Treatment", 
    medication: "Antibiotics", 
    dosage: "1ml", 
    treatmentCost: 18.00,
    notes: "Respiratory infection"
  },
  { 
    id: "3", 
    recordDate: "2023-05-01", 
    livestockId: "Group A", 
    recordType: "Deworming", 
    medication: "Ivermectin", 
    dosage: "0.3ml per bird", 
    treatmentCost: 45.00,
    notes: "Scheduled deworming"
  },
];

// Mock livestock data for dropdown selection
const mockLivestockOptions = [
  { id: "A001", name: "A001 - Leghorn Chicken" },
  { id: "A002", name: "A002 - Rhode Island Red Chicken" },
  { id: "A003", name: "A003 - Plymouth Rock Chicken" },
  { id: "Group A", name: "Group A - Layer Hens" },
  { id: "Group B", name: "Group B - Broilers" },
];

type HealthRecord = {
  id: string;
  recordDate: string;
  livestockId: string;
  recordType: string;
  medication?: string;
  dosage?: string;
  treatmentCost?: number;
  notes?: string;
};

const HealthManagement = () => {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<HealthRecord | null>(null);
  const [formData, setFormData] = useState<Partial<HealthRecord>>({
    recordDate: new Date().toISOString().split('T')[0],
    livestockId: "",
    recordType: "Vaccination",
    medication: "",
    dosage: "",
    treatmentCost: 0,
    notes: ""
  });

  // Filter health records based on search term
  const filteredRecords = healthRecords.filter(record => 
    record.livestockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.medication && record.medication.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'treatmentCost' ? parseFloat(value) : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = () => {
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      recordDate: formData.recordDate || new Date().toISOString().split('T')[0],
      livestockId: formData.livestockId || "",
      recordType: formData.recordType || "Vaccination",
      medication: formData.medication,
      dosage: formData.dosage,
      treatmentCost: formData.treatmentCost,
      notes: formData.notes
    };

    setHealthRecords(prev => [...prev, newRecord]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Health record added successfully!");
  };

  const handleEditRecord = () => {
    if (!currentRecord) return;
    
    setHealthRecords(prev => 
      prev.map(record => 
        record.id === currentRecord.id 
          ? { ...record, ...formData } 
          : record
      )
    );
    
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Health record updated successfully!");
  };

  const handleDeleteRecord = () => {
    if (!currentRecord) return;
    
    setHealthRecords(prev => prev.filter(record => record.id !== currentRecord.id));
    setIsDeleteDialogOpen(false);
    toast.success("Health record removed successfully!");
  };

  const openEditDialog = (record: HealthRecord) => {
    setCurrentRecord(record);
    setFormData(record);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (record: HealthRecord) => {
    setCurrentRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      recordDate: new Date().toISOString().split('T')[0],
      livestockId: "",
      recordType: "Vaccination",
      medication: "",
      dosage: "",
      treatmentCost: 0,
      notes: ""
    });
    setCurrentRecord(null);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Management</h1>
          <p className="text-muted-foreground mt-1">
            Track vaccinations, treatments, and health records
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Health Record
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by animal ID, treatment type, or medication..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-medium">Date</th>
                  <th className="text-left pb-3 font-medium">Animal/Group</th>
                  <th className="text-left pb-3 font-medium">Record Type</th>
                  <th className="text-left pb-3 font-medium">Medication</th>
                  <th className="text-left pb-3 font-medium">Dosage</th>
                  <th className="text-left pb-3 font-medium">Cost</th>
                  <th className="text-right pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-3">{record.recordDate}</td>
                      <td className="py-3">{record.livestockId}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          record.recordType === 'Vaccination' ? 'bg-green-100 text-green-800' : 
                          record.recordType === 'Treatment' ? 'bg-orange-100 text-orange-800' :
                          record.recordType === 'Checkup' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <Stethoscope className="h-3 w-3 mr-1" />
                          {record.recordType}
                        </span>
                      </td>
                      <td className="py-3">{record.medication || 'N/A'}</td>
                      <td className="py-3">{record.dosage || 'N/A'}</td>
                      <td className="py-3">${record.treatmentCost?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 text-right space-x-1">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(record)}>
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDeleteDialog(record)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                      No health records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Health Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Health Record</DialogTitle>
            <DialogDescription>
              Record a health event or treatment for an animal or group.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recordDate">Record Date</Label>
                <Input
                  id="recordDate"
                  name="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="livestockId">Animal/Group</Label>
                <Select
                  value={formData.livestockId}
                  onValueChange={(value) => handleSelectChange("livestockId", value)}
                >
                  <SelectTrigger id="livestockId">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLivestockOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordType">Record Type</Label>
              <Select
                value={formData.recordType}
                onValueChange={(value) => handleSelectChange("recordType", value)}
              >
                <SelectTrigger id="recordType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Checkup">Checkup</SelectItem>
                  <SelectItem value="Deworming">Deworming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Medication</Label>
                <Input
                  id="medication"
                  name="medication"
                  placeholder="Medication name"
                  value={formData.medication}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  placeholder="e.g., 0.5ml"
                  value={formData.dosage}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatmentCost">Treatment Cost ($)</Label>
              <Input
                id="treatmentCost"
                name="treatmentCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.treatmentCost}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Additional information..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRecord}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Health Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Health Record</DialogTitle>
            <DialogDescription>
              Update the details of the selected health record.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-recordDate">Record Date</Label>
                <Input
                  id="edit-recordDate"
                  name="recordDate"
                  type="date"
                  value={formData.recordDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-livestockId">Animal/Group</Label>
                <Select
                  value={formData.livestockId}
                  onValueChange={(value) => handleSelectChange("livestockId", value)}
                >
                  <SelectTrigger id="edit-livestockId">
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLivestockOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-recordType">Record Type</Label>
              <Select
                value={formData.recordType}
                onValueChange={(value) => handleSelectChange("recordType", value)}
              >
                <SelectTrigger id="edit-recordType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaccination">Vaccination</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Checkup">Checkup</SelectItem>
                  <SelectItem value="Deworming">Deworming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-medication">Medication</Label>
                <Input
                  id="edit-medication"
                  name="medication"
                  placeholder="Medication name"
                  value={formData.medication}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dosage">Dosage</Label>
                <Input
                  id="edit-dosage"
                  name="dosage"
                  placeholder="e.g., 0.5ml"
                  value={formData.dosage}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-treatmentCost">Treatment Cost ($)</Label>
              <Input
                id="edit-treatmentCost"
                name="treatmentCost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.treatmentCost}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                name="notes"
                placeholder="Additional information..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditRecord}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this health record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRecord}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default HealthManagement;
