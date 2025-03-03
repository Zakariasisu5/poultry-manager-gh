
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FeedInventory, FeedConsumption } from "@/types/livestock";

const formSchema = z.object({
  feed_id: z.string().min(1, { message: "Feed type is required" }),
  consumption_date: z.date({ required_error: "Consumption date is required" }),
  quantity_used: z.coerce.number().positive({ message: "Quantity must be a positive number" }),
  livestock_group: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FeedConsumptionFormProps {
  feedInventory: FeedInventory[];
  consumption?: FeedConsumption | null;
  onSave: (consumption: Partial<FeedConsumption>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function FeedConsumptionForm({ 
  feedInventory, 
  consumption, 
  onSave, 
  onCancel, 
  isLoading 
}: FeedConsumptionFormProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const availableInventory = feedInventory.filter(item => item.quantity > 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feed_id: "",
      consumption_date: new Date(),
      quantity_used: 0,
      livestock_group: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (consumption) {
      form.reset({
        feed_id: consumption.feed_id,
        consumption_date: new Date(consumption.consumption_date),
        quantity_used: consumption.quantity_used,
        livestock_group: consumption.livestock_group || "",
        notes: consumption.notes || "",
      });
    }
  }, [consumption, form]);

  const onSubmit = (data: FormValues) => {
    onSave({
      ...data,
      consumption_date: format(data.consumption_date, "yyyy-MM-dd"),
    });
  };

  // Find corresponding inventory item for unit display
  const selectedFeedId = form.watch("feed_id");
  const selectedInventory = feedInventory.find(item => item.id === selectedFeedId);

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feed_id">Feed Type *</Label>
              <Select
                defaultValue={form.getValues("feed_id")}
                onValueChange={(value) => form.setValue("feed_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feed type" />
                </SelectTrigger>
                <SelectContent>
                  {availableInventory.length === 0 ? (
                    <SelectItem disabled value="no-inventory">
                      No feed inventory available
                    </SelectItem>
                  ) : (
                    availableInventory.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.feed_type} - {item.quantity} {item.unit} available
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.feed_id && (
                <p className="text-sm text-red-500">{form.formState.errors.feed_id.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="consumption_date">Consumption Date *</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.getValues("consumption_date") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.getValues("consumption_date") ? (
                      format(form.getValues("consumption_date"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.getValues("consumption_date")}
                    onSelect={(date) => {
                      date && form.setValue("consumption_date", date);
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.consumption_date && (
                <p className="text-sm text-red-500">{form.formState.errors.consumption_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_used">Quantity Used *</Label>
              <div className="flex items-center">
                <Input
                  id="quantity_used"
                  type="number"
                  step="0.01"
                  {...form.register("quantity_used")}
                  className="rounded-r-none"
                />
                <span className="inline-flex h-10 items-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                  {selectedInventory?.unit || "units"}
                </span>
              </div>
              {form.formState.errors.quantity_used && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity_used.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="livestock_group">Livestock Group</Label>
              <Input
                id="livestock_group"
                placeholder="e.g., Laying Hens, Broilers (optional)"
                {...form.register("livestock_group")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this consumption (optional)"
                className="min-h-[100px]"
                {...form.register("notes")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || availableInventory.length === 0}>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-r-transparent"></span>
                Saving...
              </span>
            ) : consumption ? (
              "Update Record"
            ) : (
              "Add Record"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
