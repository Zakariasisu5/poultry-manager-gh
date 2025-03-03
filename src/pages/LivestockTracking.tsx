
import { useState } from "react";
import { 
  AlertCircle,
  FileEdit,
  Plus,
  Search,
  Trash2,
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
const mockLivestockData = [
  { 
    id: "1", 
    tagNumber: "A001", 
    animalType: "Chicken", 
    breed: "Leghorn", 
    gender: "Female", 
    dateOfBirth: "2023-01-15", 
    dateAcquired: "2023-02-10", 
    status: "Active",
    acquisitionCost: 15.00
  },
  { 
    id: "2", 
    tagNumber: "A002", 
    animalType: "Chicken", 
    breed: "Rhode Island Red", 
    gender: "Female", 
    dateOfBirth: "2023-01-10", 
    dateAcquired: "2023-02-10", 
    status: "Active",
    acquisitionCost: 18.50
  },
  { 
    id: "3", 
    tagNumber: "A003", 
    animalType: "Chicken", 
    breed: "Plymouth Rock", 
    gender: "Male", 
    dateOfBirth: "2023-01-05", 
    dateAcquired: "2023-02-10", 
    status: "Active",
    acquisitionCost: 20.00
  },
];

type Livestock = {
  id: string;
  tagNumber: string;
  animalType: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  dateAcquired: string;
  status: string;
  acquisitionCost: number;
  notes?: string;
};

const LivestockTracking = () => {
  const [livestock, setLivestock] = useState<Livestock[]>(mockLivestockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLivestock, setCurrentLivestock] = useState<Livestock | null>(null);
  const [formData, setFormData] = useState<Partial<Livestock>>({
    tagNumber: "",
    animalType: "Chicken",
    breed: "",
    gender: "",
    dateOfBirth: "",
    dateAcquired: "",
    status: "Active",
    acquisitionCost: 0,
    notes: ""
  });

  // Filter livestock based on search term
  const filteredLivestock = livestock.filter(animal => 
    animal.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.animalType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'acquisitionCost' ? parseFloat(value) : value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLivestock = () => {
    const newLivestock: Livestock = {
      id: Date.now().toString(),
      tagNumber: formData.tagNumber || `A${livestock.length + 1}`,
      animalType: formData.animalType || "Chicken",
      breed: formData.breed || "",
      gender: formData.gender || "",
      dateOfBirth: formData.dateOfBirth || "",
      dateAcquired: formData.dateAcquired || new Date().toISOString().split('T')[0],
      status: formData.status || "Active",
      acquisitionCost: formData.acquisitionCost || 0,
      notes: formData.notes
    };

    setLivestock(prev => [...prev, newLivestock]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Animal added successfully!");
  };

  const handleEditLivestock = () => {
    if (!currentLivestock) return;
    
    setLivestock(prev => 
      prev.map(animal => 
        animal.id === currentLivestock.id 
          ? { ...animal, ...formData } 
          : animal
      )
    );
    
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Animal updated successfully!");
  };

  const handleDeleteLivestock = () => {
    if (!currentLivestock) return;
    
    setLivestock(prev => prev.filter(animal => animal.id !== currentLivestock.id));
    setIsDeleteDialogOpen(false);
    toast.success("Animal removed successfully!");
  };

  const openEditDialog = (animal: Livestock) => {
    setCurrentLivestock(animal);
    setFormData(animal);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (animal: Livestock) => {
    setCurrentLivestock(animal);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      tagNumber: "",
      animalType: "Chicken",
      breed: "",
      gender: "",
      dateOfBirth: "",
      dateAcquired: "",
      status: "Active",
      acquisitionCost: 0,
      notes: ""
    });
    setCurrentLivestock(null);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livestock Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Manage your farm animals inventory
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Animal
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
              placeholder="Search by tag, type, or breed..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Livestock Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3 font-medium">Tag #</th>
                  <th className="text-left pb-3 font-medium">Type</th>
                  <th className="text-left pb-3 font-medium">Breed</th>
                  <th className="text-left pb-3 font-medium">Gender</th>
                  <th className="text-left pb-3 font-medium">Age</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Acquisition Cost</th>
                  <th className="text-right pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLivestock.length > 0 ? (
                  filteredLivestock.map((animal) => (
                    <tr key={animal.id} className="border-b last:border-0">
                      <td className="py-3">{animal.tagNumber}</td>
                      <td className="py-3">{animal.animalType}</td>
                      <td className="py-3">{animal.breed}</td>
                      <td className="py-3">{animal.gender}</td>
                      <td className="py-3">
                        {animal.dateOfBirth ? 
                          Math.floor((Date.now() - new Date(animal.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30)) + " months" 
                          : "N/A"}
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          animal.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          animal.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                          animal.status === 'Deceased' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="py-3">${animal.acquisitionCost.toFixed(2)}</td>
                      <td className="py-3 text-right space-x-1">
                        <Button size="sm" variant="outline" onClick={() => openEditDialog(animal)}>
                          <FileEdit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openDeleteDialog(animal)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                      No livestock found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Livestock Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Animal</DialogTitle>
            <DialogDescription>
              Enter the details of the new animal to add to your inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tagNumber">Tag Number</Label>
                <Input
                  id="tagNumber"
                  name="tagNumber"
                  placeholder="A001"
                  value={formData.tagNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="animalType">Animal Type</Label>
                <Select
                  value={formData.animalType}
                  onValueChange={(value) => handleSelectChange("animalType", value)}
                >
                  <SelectTrigger id="animalType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                    <SelectItem value="Duck">Duck</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Goose">Goose</SelectItem>
                    <SelectItem value="Quail">Quail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  name="breed"
                  placeholder="Leghorn"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateAcquired">Date Acquired</Label>
                <Input
                  id="dateAcquired"
                  name="dateAcquired"
                  type="date"
                  value={formData.dateAcquired}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                    <SelectItem value="Quarantined">Quarantined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquisitionCost">Acquisition Cost ($)</Label>
                <Input
                  id="acquisitionCost"
                  name="acquisitionCost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.acquisitionCost}
                  onChange={handleInputChange}
                />
              </div>
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
            <Button onClick={handleAddLivestock}>Add Animal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Livestock Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Animal</DialogTitle>
            <DialogDescription>
              Update the details of the selected animal.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tagNumber">Tag Number</Label>
                <Input
                  id="edit-tagNumber"
                  name="tagNumber"
                  placeholder="A001"
                  value={formData.tagNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-animalType">Animal Type</Label>
                <Select
                  value={formData.animalType}
                  onValueChange={(value) => handleSelectChange("animalType", value)}
                >
                  <SelectTrigger id="edit-animalType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chicken">Chicken</SelectItem>
                    <SelectItem value="Duck">Duck</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Goose">Goose</SelectItem>
                    <SelectItem value="Quail">Quail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-breed">Breed</Label>
                <Input
                  id="edit-breed"
                  name="breed"
                  placeholder="Leghorn"
                  value={formData.breed}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="edit-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                <Input
                  id="edit-dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dateAcquired">Date Acquired</Label>
                <Input
                  id="edit-dateAcquired"
                  name="dateAcquired"
                  type="date"
                  value={formData.dateAcquired}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                    <SelectItem value="Quarantined">Quarantined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-acquisitionCost">Acquisition Cost ($)</Label>
                <Input
                  id="edit-acquisitionCost"
                  name="acquisitionCost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.acquisitionCost}
                  onChange={handleInputChange}
                />
              </div>
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
            <Button onClick={handleEditLivestock}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this animal from your inventory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLivestock}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default LivestockTracking;
