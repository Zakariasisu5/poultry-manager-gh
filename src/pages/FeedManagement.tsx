
import { useState } from "react";
import { 
  AlertCircle,
  Calendar,
  FileEdit,
  Package,
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
const mockFeedInventory = [
  { 
    id: "1", 
    feedType: "Layer Feed", 
    quantity: 500, 
    unit: "kg", 
    purchaseDate: "2023-03-15", 
    expirationDate: "2023-09-15", 
    costPerUnit: 0.85,
    supplier: "Farm Supply Co.",
    notes: "Standard layer feed"
  },
  { 
    id: "2", 
    feedType: "Starter Feed", 
    quantity: 200, 
    unit: "kg", 
    purchaseDate: "2023-04-01", 
    expirationDate: "2023-10-01", 
    costPerUnit: 1.25,
    supplier: "Poultry Nutrition Inc.",
    notes: "For chicks 0-8 weeks"
  },
  { 
    id: "3", 
    feedType: "Broiler Feed", 
    quantity: 350, 
    unit: "kg", 
    purchaseDate: "2023-04-10", 
    expirationDate: "2023-10-10", 
    costPerUnit: 1.10,
    supplier: "Farm Supply Co.",
    notes: "High protein formula"
  },
];

const mockFeedConsumption = [
  { 
    id: "1", 
    consumptionDate: "2023-04-15", 
    feedId: "1", 
    feedType: "Layer Feed",
    livestockGroup: "Group A - Layer Hens", 
    quantityUsed: 25, 
    unit: "kg", 
    notes: "Morning feeding"
  },
  { 
    id: "2", 
    consumptionDate: "2023-04-15", 
    feedId: "1", 
    feedType: "Layer Feed",
    livestockGroup: "Group A - Layer Hens", 
    quantityUsed: 25, 
    unit: "kg", 
    notes: "Evening feeding"
  },
  { 
    id: "3", 
    consumptionDate: "2023-04-16", 
    feedId: "2", 
    feedType: "Starter Feed",
    livestockGroup: "Group C - Chicks", 
    quantityUsed: 10, 
    unit: "kg", 
    notes: "Morning feeding"
  },
];

// Mock livestock group data for dropdown selection
const mockLivestockGroups = [
  { id: "Group A", name: "Group A - Layer Hens" },
  { id: "Group B", name: "Group B - Broilers" },
  { id: "Group C", name: "Group C - Chicks" },
];

type FeedInventory = {
  id: string;
  feedType: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expirationDate?: string;
  costPerUnit: number;
  supplier?: string;
  notes?: string;
};

type FeedConsumption = {
  id: string;
  consumptionDate: string;
  feedId: string;
  feedType: string;
  livestockGroup: string;
  quantityUsed: number;
  unit: string;
  notes?: string;
};

const FeedManagement = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'consumption'>('inventory');
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>(mockFeedInventory);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>(mockFeedConsumption);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Inventory state
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isEditInventoryOpen, setIsEditInventoryOpen] = useState(false);
  const [isDeleteInventoryOpen, setIsDeleteInventoryOpen] = useState(false);
  const [currentInventory, setCurrentInventory] = useState<FeedInventory | null>(null);
  const [inventoryForm, setInventoryForm] = useState<Partial<FeedInventory>>({
    feedType: "",
    quantity: 0,
    unit: "kg",
    purchaseDate: new Date().toISOString().split('T')[0],
    expirationDate: "",
    costPerUnit: 0,
    supplier: "",
    notes: ""
  });
  
  // Consumption state
  const [isAddConsumptionOpen, setIsAddConsumptionOpen] = useState(false);
  const [isEditConsumptionOpen, setIsEditConsumptionOpen] = useState(false);
  const [isDeleteConsumptionOpen, setIsDeleteConsumptionOpen] = useState(false);
  const [currentConsumption, setCurrentConsumption] = useState<FeedConsumption | null>(null);
  const [consumptionForm, setConsumptionForm] = useState<Partial<FeedConsumption>>({
    consumptionDate: new Date().toISOString().split('T')[0],
    feedId: "",
    feedType: "",
    livestockGroup: "",
    quantityUsed: 0,
    unit: "kg",
    notes: ""
  });

  // Filter inventory based on search term
  const filteredInventory = feedInventory.filter(item => 
    item.feedType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter consumption based on search term
  const filteredConsumption = feedConsumption.filter(item => 
    item.feedType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.livestockGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Inventory form handlers
  const handleInventoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity' || name === 'costPerUnit') {
      setInventoryForm(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setInventoryForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInventorySelectChange = (name: string, value: string) => {
    setInventoryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddInventory = () => {
    const newInventory: FeedInventory = {
      id: Date.now().toString(),
      feedType: inventoryForm.feedType || "",
      quantity: inventoryForm.quantity || 0,
      unit: inventoryForm.unit || "kg",
      purchaseDate: inventoryForm.purchaseDate || new Date().toISOString().split('T')[0],
      expirationDate: inventoryForm.expirationDate,
      costPerUnit: inventoryForm.costPerUnit || 0,
      supplier: inventoryForm.supplier,
      notes: inventoryForm.notes
    };

    setFeedInventory(prev => [...prev, newInventory]);
    setIsAddInventoryOpen(false);
    resetInventoryForm();
    toast.success("Feed inventory added successfully!");
  };

  const handleEditInventory = () => {
    if (!currentInventory) return;
    
    setFeedInventory(prev => 
      prev.map(item => 
        item.id === currentInventory.id 
          ? { ...item, ...inventoryForm } 
          : item
      )
    );
    
    setIsEditInventoryOpen(false);
    resetInventoryForm();
    toast.success("Feed inventory updated successfully!");
  };

  const handleDeleteInventory = () => {
    if (!currentInventory) return;
    
    setFeedInventory(prev => prev.filter(item => item.id !== currentInventory.id));
    setIsDeleteInventoryOpen(false);
    toast.success("Feed inventory removed successfully!");
  };

  const openEditInventory = (item: FeedInventory) => {
    setCurrentInventory(item);
    setInventoryForm(item);
    setIsEditInventoryOpen(true);
  };

  const openDeleteInventory = (item: FeedInventory) => {
    setCurrentInventory(item);
    setIsDeleteInventoryOpen(true);
  };

  const resetInventoryForm = () => {
    setInventoryForm({
      feedType: "",
      quantity: 0,
      unit: "kg",
      purchaseDate: new Date().toISOString().split('T')[0],
      expirationDate: "",
      costPerUnit: 0,
      supplier: "",
      notes: ""
    });
    setCurrentInventory(null);
  };

  // Consumption form handlers
  const handleConsumptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantityUsed') {
      setConsumptionForm(prev => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setConsumptionForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleConsumptionSelectChange = (name: string, value: string) => {
    if (name === 'feedId') {
      const selectedFeed = feedInventory.find(feed => feed.id === value);
      setConsumptionForm(prev => ({ 
        ...prev, 
        [name]: value,
        feedType: selectedFeed?.feedType || "",
        unit: selectedFeed?.unit || "kg"
      }));
    } else {
      setConsumptionForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddConsumption = () => {
    const newConsumption: FeedConsumption = {
      id: Date.now().toString(),
      consumptionDate: consumptionForm.consumptionDate || new Date().toISOString().split('T')[0],
      feedId: consumptionForm.feedId || "",
      feedType: consumptionForm.feedType || "",
      livestockGroup: consumptionForm.livestockGroup || "",
      quantityUsed: consumptionForm.quantityUsed || 0,
      unit: consumptionForm.unit || "kg",
      notes: consumptionForm.notes
    };

    // Update the inventory by reducing the quantity
    if (newConsumption.feedId) {
      setFeedInventory(prev => 
        prev.map(item => 
          item.id === newConsumption.feedId
            ? { 
                ...item, 
                quantity: Math.max(0, item.quantity - (newConsumption.quantityUsed || 0))
              }
            : item
        )
      );
    }

    setFeedConsumption(prev => [...prev, newConsumption]);
    setIsAddConsumptionOpen(false);
    resetConsumptionForm();
    toast.success("Feed consumption recorded successfully!");
  };

  const handleEditConsumption = () => {
    if (!currentConsumption) return;
    
    // Calculate the quantity difference
    const originalQuantity = currentConsumption.quantityUsed;
    const newQuantity = consumptionForm.quantityUsed || 0;
    const quantityDifference = newQuantity - originalQuantity;
    
    // Update inventory if there's a difference in quantity
    if (quantityDifference !== 0 && currentConsumption.feedId) {
      setFeedInventory(prev => 
        prev.map(item => 
          item.id === currentConsumption.feedId
            ? { 
                ...item, 
                quantity: Math.max(0, item.quantity - quantityDifference)
              }
            : item
        )
      );
    }
    
    setFeedConsumption(prev => 
      prev.map(item => 
        item.id === currentConsumption.id 
          ? { ...item, ...consumptionForm } 
          : item
      )
    );
    
    setIsEditConsumptionOpen(false);
    resetConsumptionForm();
    toast.success("Feed consumption updated successfully!");
  };

  const handleDeleteConsumption = () => {
    if (!currentConsumption) return;
    
    // Return the consumed quantity back to inventory
    if (currentConsumption.feedId) {
      setFeedInventory(prev => 
        prev.map(item => 
          item.id === currentConsumption.feedId
            ? { 
                ...item, 
                quantity: item.quantity + currentConsumption.quantityUsed
              }
            : item
        )
      );
    }
    
    setFeedConsumption(prev => prev.filter(item => item.id !== currentConsumption.id));
    setIsDeleteConsumptionOpen(false);
    toast.success("Feed consumption record removed successfully!");
  };

  const openEditConsumption = (item: FeedConsumption) => {
    setCurrentConsumption(item);
    setConsumptionForm(item);
    setIsEditConsumptionOpen(true);
  };

  const openDeleteConsumption = (item: FeedConsumption) => {
    setCurrentConsumption(item);
    setIsDeleteConsumptionOpen(true);
  };

  const resetConsumptionForm = () => {
    setConsumptionForm({
      consumptionDate: new Date().toISOString().split('T')[0],
      feedId: "",
      feedType: "",
      livestockGroup: "",
      quantityUsed: 0,
      unit: "kg",
      notes: ""
    });
    setCurrentConsumption(null);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feed Management</h1>
          <p className="text-muted-foreground mt-1">
            Track feed inventory and consumption
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'inventory' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </Button>
          <Button 
            variant={activeTab === 'consumption' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('consumption')}
          >
            Consumption
          </Button>
        </div>
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
              placeholder={activeTab === 'inventory' ? "Search feed type or supplier..." : "Search feed type or group..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {activeTab === 'inventory' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Feed Inventory</h2>
            <Button onClick={() => setIsAddInventoryOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Feed Stock
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-6 py-3 font-medium">Feed Type</th>
                      <th className="text-left px-6 py-3 font-medium">Quantity</th>
                      <th className="text-left px-6 py-3 font-medium">Purchase Date</th>
                      <th className="text-left px-6 py-3 font-medium">Expiration</th>
                      <th className="text-left px-6 py-3 font-medium">Cost/Unit</th>
                      <th className="text-left px-6 py-3 font-medium">Supplier</th>
                      <th className="text-right px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                              {item.feedType}
                            </div>
                          </td>
                          <td className="px-6 py-4">{item.quantity} {item.unit}</td>
                          <td className="px-6 py-4">{item.purchaseDate}</td>
                          <td className="px-6 py-4">{item.expirationDate || 'N/A'}</td>
                          <td className="px-6 py-4">${item.costPerUnit.toFixed(2)}/{item.unit}</td>
                          <td className="px-6 py-4">{item.supplier || 'N/A'}</td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <Button size="sm" variant="outline" onClick={() => openEditInventory(item)}>
                              <FileEdit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openDeleteInventory(item)}>
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
                          No feed inventory found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Feed Consumption</h2>
            <Button onClick={() => setIsAddConsumptionOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Consumption
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left px-6 py-3 font-medium">Date</th>
                      <th className="text-left px-6 py-3 font-medium">Feed Type</th>
                      <th className="text-left px-6 py-3 font-medium">Group</th>
                      <th className="text-left px-6 py-3 font-medium">Quantity Used</th>
                      <th className="text-left px-6 py-3 font-medium">Notes</th>
                      <th className="text-right px-6 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsumption.length > 0 ? (
                      filteredConsumption.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="px-6 py-4">{item.consumptionDate}</td>
                          <td className="px-6 py-4">{item.feedType}</td>
                          <td className="px-6 py-4">{item.livestockGroup}</td>
                          <td className="px-6 py-4">{item.quantityUsed} {item.unit}</td>
                          <td className="px-6 py-4">{item.notes || 'N/A'}</td>
                          <td className="px-6 py-4 text-right space-x-1">
                            <Button size="sm" variant="outline" onClick={() => openEditConsumption(item)}>
                              <FileEdit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openDeleteConsumption(item)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-muted-foreground">
                          <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                          No consumption records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Inventory Dialogs */}
      <Dialog open={isAddInventoryOpen} onOpenChange={setIsAddInventoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Feed Inventory</DialogTitle>
            <DialogDescription>
              Record new feed stock in your inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedType">Feed Type</Label>
                <Input
                  id="feedType"
                  name="feedType"
                  placeholder="Layer Feed"
                  value={inventoryForm.feedType}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  placeholder="Supplier name"
                  value={inventoryForm.supplier}
                  onChange={handleInventoryInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={inventoryForm.quantity}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={inventoryForm.unit}
                  onValueChange={(value) => handleInventorySelectChange("unit", value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={inventoryForm.purchaseDate}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={inventoryForm.expirationDate}
                  onChange={handleInventoryInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerUnit">Cost Per Unit ($)</Label>
              <Input
                id="costPerUnit"
                name="costPerUnit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={inventoryForm.costPerUnit}
                onChange={handleInventoryInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Additional information..."
                value={inventoryForm.notes}
                onChange={handleInventoryInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddInventoryOpen(false)}>Cancel</Button>
            <Button onClick={handleAddInventory}>Add Inventory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditInventoryOpen} onOpenChange={setIsEditInventoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Feed Inventory</DialogTitle>
            <DialogDescription>
              Update the details of the selected feed stock.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-feedType">Feed Type</Label>
                <Input
                  id="edit-feedType"
                  name="feedType"
                  placeholder="Layer Feed"
                  value={inventoryForm.feedType}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Supplier</Label>
                <Input
                  id="edit-supplier"
                  name="supplier"
                  placeholder="Supplier name"
                  value={inventoryForm.supplier}
                  onChange={handleInventoryInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={inventoryForm.quantity}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Select
                  value={inventoryForm.unit}
                  onValueChange={(value) => handleInventorySelectChange("unit", value)}
                >
                  <SelectTrigger id="edit-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
                <Input
                  id="edit-purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={inventoryForm.purchaseDate}
                  onChange={handleInventoryInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-expirationDate">Expiration Date</Label>
                <Input
                  id="edit-expirationDate"
                  name="expirationDate"
                  type="date"
                  value={inventoryForm.expirationDate}
                  onChange={handleInventoryInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-costPerUnit">Cost Per Unit ($)</Label>
              <Input
                id="edit-costPerUnit"
                name="costPerUnit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={inventoryForm.costPerUnit}
                onChange={handleInventoryInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                name="notes"
                placeholder="Additional information..."
                value={inventoryForm.notes}
                onChange={handleInventoryInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditInventoryOpen(false)}>Cancel</Button>
            <Button onClick={handleEditInventory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteInventoryOpen} onOpenChange={setIsDeleteInventoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feed inventory record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteInventoryOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteInventory}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consumption Dialogs */}
      <Dialog open={isAddConsumptionOpen} onOpenChange={setIsAddConsumptionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Feed Consumption</DialogTitle>
            <DialogDescription>
              Log the feed consumed by your livestock.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consumptionDate">Consumption Date</Label>
                <Input
                  id="consumptionDate"
                  name="consumptionDate"
                  type="date"
                  value={consumptionForm.consumptionDate}
                  onChange={handleConsumptionInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedId">Feed Type</Label>
                <Select
                  value={consumptionForm.feedId}
                  onValueChange={(value) => handleConsumptionSelectChange("feedId", value)}
                >
                  <SelectTrigger id="feedId">
                    <SelectValue placeholder="Select feed" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedInventory.map(feed => (
                      <SelectItem key={feed.id} value={feed.id}>
                        {feed.feedType} ({feed.quantity} {feed.unit} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="livestockGroup">Livestock Group</Label>
                <Select
                  value={consumptionForm.livestockGroup}
                  onValueChange={(value) => handleConsumptionSelectChange("livestockGroup", value)}
                >
                  <SelectTrigger id="livestockGroup">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLivestockGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantityUsed">Quantity Used</Label>
                <Input
                  id="quantityUsed"
                  name="quantityUsed"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={consumptionForm.quantityUsed}
                  onChange={handleConsumptionInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Additional information..."
                value={consumptionForm.notes}
                onChange={handleConsumptionInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddConsumptionOpen(false)}>Cancel</Button>
            <Button onClick={handleAddConsumption}>Record Consumption</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditConsumptionOpen} onOpenChange={setIsEditConsumptionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Feed Consumption</DialogTitle>
            <DialogDescription>
              Update the details of the selected consumption record.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-consumptionDate">Consumption Date</Label>
                <Input
                  id="edit-consumptionDate"
                  name="consumptionDate"
                  type="date"
                  value={consumptionForm.consumptionDate}
                  onChange={handleConsumptionInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-feedId">Feed Type</Label>
                <Select
                  value={consumptionForm.feedId}
                  onValueChange={(value) => handleConsumptionSelectChange("feedId", value)}
                >
                  <SelectTrigger id="edit-feedId">
                    <SelectValue placeholder="Select feed" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedInventory.map(feed => (
                      <SelectItem key={feed.id} value={feed.id}>
                        {feed.feedType} ({feed.quantity} {feed.unit} left)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-livestockGroup">Livestock Group</Label>
                <Select
                  value={consumptionForm.livestockGroup}
                  onValueChange={(value) => handleConsumptionSelectChange("livestockGroup", value)}
                >
                  <SelectTrigger id="edit-livestockGroup">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLivestockGroups.map(group => (
                      <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantityUsed">Quantity Used</Label>
                <Input
                  id="edit-quantityUsed"
                  name="quantityUsed"
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={consumptionForm.quantityUsed}
                  onChange={handleConsumptionInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                name="notes"
                placeholder="Additional information..."
                value={consumptionForm.notes}
                onChange={handleConsumptionInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditConsumptionOpen(false)}>Cancel</Button>
            <Button onClick={handleEditConsumption}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConsumptionOpen} onOpenChange={setIsDeleteConsumptionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this consumption record? The consumed feed quantity will be returned to inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConsumptionOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConsumption}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default FeedManagement;
