
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Livestock } from "@/pages/LivestockTracking";

interface LivestockFormProps {
  initialData?: Livestock;
  onSubmit: (data: Omit<Livestock, "id">) => void;
  onCancel: () => void;
}

export function LivestockForm({
  initialData,
  onSubmit,
  onCancel,
}: LivestockFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Omit<Livestock, "id">>({
    defaultValues: initialData ? {
      animal_type: initialData.animal_type,
      tag_number: initialData.tag_number || "",
      breed: initialData.breed || "",
      gender: initialData.gender || "",
      date_of_birth: initialData.date_of_birth || "",
      date_acquired: initialData.date_acquired,
      acquisition_cost: initialData.acquisition_cost || undefined,
      status: initialData.status,
      notes: initialData.notes || "",
    } : {
      animal_type: "",
      tag_number: "",
      breed: "",
      gender: "",
      date_of_birth: "",
      date_acquired: new Date().toISOString().split('T')[0],
      acquisition_cost: undefined,
      status: "active",
      notes: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="animal_type">
            Animal Type <span className="text-red-500">*</span>
          </Label>
          <Input
            id="animal_type"
            placeholder="e.g., Chicken, Cow, Goat"
            {...register("animal_type", { required: true })}
            className={errors.animal_type ? "border-red-500" : ""}
          />
          {errors.animal_type && (
            <p className="text-xs text-red-500">
              Animal type is required
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tag_number">Tag/ID Number</Label>
          <Input
            id="tag_number"
            placeholder="e.g., CH001, COW123"
            {...register("tag_number")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            placeholder="e.g., Leghorn, Holstein"
            {...register("breed")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            {...register("gender")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            {...register("date_of_birth")}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date_acquired">
            Date Acquired <span className="text-red-500">*</span>
          </Label>
          <Input
            id="date_acquired"
            type="date"
            {...register("date_acquired", { required: true })}
            className={errors.date_acquired ? "border-red-500" : ""}
          />
          {errors.date_acquired && (
            <p className="text-xs text-red-500">
              Date acquired is required
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="acquisition_cost">Acquisition Cost</Label>
          <Input
            id="acquisition_cost"
            type="number"
            placeholder="0.00"
            step="0.01"
            {...register("acquisition_cost", {
              valueAsNumber: true,
              min: 0,
            })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <select
            id="status"
            {...register("status", { required: true })}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.status ? "border-red-500" : "border-input"
            }`}
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="deceased">Deceased</option>
            <option value="transferred">Transferred</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500">
              Status is required
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          placeholder="Additional information about this livestock"
          {...register("notes")}
          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Update Livestock" : "Add Livestock"}
        </Button>
      </div>
    </form>
  );
}
