
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Livestock } from "@/pages/LivestockTracking";
import { format } from "date-fns";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface LivestockTableProps {
  livestock: Livestock[];
  isLoading: boolean;
  onEdit: (livestock: Livestock) => void;
  onDelete: (id: string) => void;
}

export function LivestockTable({
  livestock,
  isLoading,
  onEdit,
  onDelete,
}: LivestockTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "deceased":
        return "bg-gray-100 text-gray-800";
      case "transferred":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-24 w-full animate-pulse rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  if (livestock.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
        <h3 className="text-2xl font-semibold">No livestock found</h3>
        <p className="text-muted-foreground">
          Add your first livestock to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {livestock.map((animal) => (
        <Card key={animal.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-wrap justify-between gap-4 border-b p-6">
              <div className="flex-1">
                <h3 className="font-semibold">
                  {animal.animal_type}
                  {animal.tag_number && ` #${animal.tag_number}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {animal.breed || "Unknown breed"}
                  {animal.gender && ` • ${animal.gender}`}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                    animal.status
                  )}`}
                >
                  {animal.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  {animal.acquisition_cost
                    ? `$${animal.acquisition_cost}`
                    : "No cost data"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Date of Birth
                  </p>
                  <p>{formatDate(animal.date_of_birth)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Date Acquired
                  </p>
                  <p>{formatDate(animal.date_acquired)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Notes
                  </p>
                  <p className="truncate max-w-[200px]">
                    {animal.notes || "No notes"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(animal)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDelete(animal.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
