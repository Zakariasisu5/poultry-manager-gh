
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { Pencil, Trash2, Search } from "lucide-react";
import { FeedInventory } from "@/types/livestock";

interface FeedInventoryListProps {
  feedInventory: FeedInventory[];
  isLoading: boolean;
  onEdit: (inventory: FeedInventory) => void;
  onDelete: (id: string) => void;
}

export function FeedInventoryList({ feedInventory, isLoading, onEdit, onDelete }: FeedInventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredInventory = feedInventory.filter((item) => {
    const searchString = searchTerm.toLowerCase();
    return (
      item.feed_type.toLowerCase().includes(searchString) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchString)) ||
      item.unit.toLowerCase().includes(searchString)
    );
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <CardTitle>Feed Inventory</CardTitle>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feeds..."
              className="w-[180px] sm:w-[300px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-2">No feed inventory found</p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm("")}>Clear Search</Button>
            ) : null}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.feed_type}</TableCell>
                    <TableCell>{format(new Date(item.purchase_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell>${item.cost_per_unit.toFixed(2)}/{item.unit}</TableCell>
                    <TableCell>{item.supplier || "-"}</TableCell>
                    <TableCell>
                      {item.expiration_date 
                        ? format(new Date(item.expiration_date), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Feed Inventory</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this feed inventory? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
  );
}
