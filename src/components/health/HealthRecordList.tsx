
import { HealthRecord } from "@/pages/HealthManagement";
import { format } from "date-fns";
import { Edit, Trash2, MoreHorizontal, FileText, Activity, Pill, Syringe, Stethoscope, Bandage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface HealthRecordListProps {
  healthRecords: any[];
  isLoading: boolean;
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: string) => void;
}

export function HealthRecordList({
  healthRecords,
  isLoading,
  onEdit,
  onDelete,
}: HealthRecordListProps) {
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getRecordIcon = (recordType: string) => {
    switch (recordType.toLowerCase()) {
      case "vaccination":
        return <Syringe className="h-5 w-5 text-green-500" />;
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />;
      case "illness":
        return <Activity className="h-5 w-5 text-red-500" />;
      case "injury":
        return <Bandage className="h-5 w-5 text-orange-500" />;
      case "routine_check":
        return <Stethoscope className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRecordTypeClass = (recordType: string) => {
    switch (recordType.toLowerCase()) {
      case "vaccination":
        return "bg-green-100 text-green-800";
      case "medication":
        return "bg-blue-100 text-blue-800";
      case "illness":
        return "bg-red-100 text-red-800";
      case "injury":
        return "bg-orange-100 text-orange-800";
      case "routine_check":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-36 w-full animate-pulse rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  if (healthRecords.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed">
        <h3 className="text-2xl font-semibold">No health records found</h3>
        <p className="text-muted-foreground">
          Add your first health record to start tracking
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              health record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRecordToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (recordToDelete) {
                  onDelete(recordToDelete);
                  setRecordToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        {healthRecords.map((record: any) => (
          <Card key={record.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-wrap justify-between gap-4 border-b p-6">
                <div className="flex items-center gap-3">
                  {getRecordIcon(record.record_type)}
                  <div>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRecordTypeClass(
                        record.record_type
                      )}`}
                    >
                      {record.record_type.replace("_", " ")}
                    </span>
                    <h3 className="font-semibold mt-1">
                      {record.livestock?.animal_type}{" "}
                      {record.livestock?.tag_number && `#${record.livestock.tag_number}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(record.record_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {record.treatment_cost && (
                    <span className="mr-4 text-sm font-medium">
                      ${record.treatment_cost.toFixed(2)}
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(record)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => setRecordToDelete(record.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                {(record.medication || record.dosage) && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Medication/Dosage
                    </p>
                    <p>{record.medication} {record.dosage && `(${record.dosage})`}</p>
                  </div>
                )}
                {record.notes && (
                  <div className="lg:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Notes
                    </p>
                    <p className="break-words">{record.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </AlertDialog>
    </div>
  );
}
