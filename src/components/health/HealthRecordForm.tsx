
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Livestock } from "@/types/livestock";
import { HealthRecord } from "@/pages/HealthManagement";

interface HealthRecordFormProps {
  livestock: Livestock[];
  isLoading: boolean;
  onSave: (record: Partial<HealthRecord>) => void;
  record: HealthRecord | null;
  onCancel: () => void;
}

export function HealthRecordForm({
  livestock,
  isLoading,
  onSave,
  record,
  onCancel,
}: HealthRecordFormProps) {
  const [formState, setFormState] = useState<Partial<HealthRecord>>({
    livestock_id: "",
    record_type: "vaccination",
    record_date: new Date().toISOString().split('T')[0],
    medication: "",
    dosage: "",
    treatment_cost: undefined,
    notes: "",
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (record) {
      setFormState({
        livestock_id: record.livestock_id,
        record_type: record.record_type,
        record_date: record.record_date,
        medication: record.medication || "",
        dosage: record.dosage || "",
        treatment_cost: record.treatment_cost || undefined,
        notes: record.notes || "",
      });
      
      if (record.record_date) {
        setDate(new Date(record.record_date));
      }
    }
  }, [record]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "treatment_cost" ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const formattedDate = newDate.toISOString().split('T')[0];
      setFormState((prev) => ({
        ...prev,
        record_date: formattedDate,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="livestock_id">Animal</Label>
              <Select
                value={formState.livestock_id}
                onValueChange={(value) => handleSelectChange("livestock_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {livestock.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.animal_type}
                      {animal.tag_number ? ` #${animal.tag_number}` : ""}
                      {animal.breed ? ` (${animal.breed})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record_type">Record Type</Label>
              <Select
                value={formState.record_type}
                onValueChange={(value) => handleSelectChange("record_type", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="illness">Illness</SelectItem>
                  <SelectItem value="injury">Injury</SelectItem>
                  <SelectItem value="routine_check">Routine Check</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record_date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment_cost">Cost ($)</Label>
              <Input
                id="treatment_cost"
                name="treatment_cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formState.treatment_cost || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medication">Medication/Treatment</Label>
              <Input
                id="medication"
                name="medication"
                placeholder="Enter medication or treatment"
                value={formState.medication || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                name="dosage"
                placeholder="Enter dosage"
                value={formState.dosage || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Enter additional notes or observations"
              rows={4}
              value={formState.notes || ""}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{record ? "Update" : "Save"} Record</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
