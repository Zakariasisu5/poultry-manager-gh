
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
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { FeedInventory } from "@/types/livestock";

const formSchema = z.object({
  feed_type: z.string().min(1, { message: "Feed type is required" }),
  purchase_date: z.date({ required_error: "Purchase date is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number" }),
  unit: z.string().min(1, { message: "Unit is required (e.g., kg, lbs)" }),
  cost_per_unit: z.coerce.number().nonnegative({ message: "Cost must be zero or positive" }),
  supplier: z.string().optional(),
  expiration_date: z.date().optional().nullable(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FeedInventoryFormProps {
  inventory?: FeedInventory | null;
  onSave: (inventory: Partial<FeedInventory>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function FeedInventoryForm({ inventory, onSave, onCancel, isLoading }: FeedInventoryFormProps) {
  const [purchaseDateOpen, setPurchaseDateOpen] = useState(false);
  const [expirationDateOpen, setExpirationDateOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feed_type: "",
      purchase_date: new Date(),
      quantity: 0,
      unit: "kg",
      cost_per_unit: 0,
      supplier: "",
      expiration_date: null,
      notes: "",
    },
  });

  useEffect(() => {
    if (inventory) {
      form.reset({
        feed_type: inventory.feed_type,
        purchase_date: new Date(inventory.purchase_date),
        quantity: inventory.quantity,
        unit: inventory.unit,
        cost_per_unit: inventory.cost_per_unit,
        supplier: inventory.supplier || "",
        expiration_date: inventory.expiration_date ? new Date(inventory.expiration_date) : null,
        notes: inventory.notes || "",
      });
    }
  }, [inventory, form]);

  const onSubmit = (data: FormValues) => {
    onSave({
      ...data,
      purchase_date: format(data.purchase_date, "yyyy-MM-dd"),
      expiration_date: data.expiration_date ? format(data.expiration_date, "yyyy-MM-dd") : null,
    });
  };

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feed_type">Feed Type *</Label>
              <Input
                id="feed_type"
                placeholder="e.g., Layer Mash, Grower Feed"
                {...form.register("feed_type")}
              />
              {form.formState.errors.feed_type && (
                <p className="text-sm text-red-500">{form.formState.errors.feed_type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date *</Label>
              <Popover open={purchaseDateOpen} onOpenChange={setPurchaseDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.getValues("purchase_date") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.getValues("purchase_date") ? (
                      format(form.getValues("purchase_date"), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.getValues("purchase_date")}
                    onSelect={(date) => {
                      date && form.setValue("purchase_date", date);
                      setPurchaseDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.purchase_date && (
                <p className="text-sm text-red-500">{form.formState.errors.purchase_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                {...form.register("quantity")}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                placeholder="e.g., kg, lbs, tons"
                {...form.register("unit")}
              />
              {form.formState.errors.unit && (
                <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_per_unit">Cost Per Unit *</Label>
              <Input
                id="cost_per_unit"
                type="number"
                step="0.01"
                {...form.register("cost_per_unit")}
              />
              {form.formState.errors.cost_per_unit && (
                <p className="text-sm text-red-500">{form.formState.errors.cost_per_unit.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                placeholder="Feed supplier name (optional)"
                {...form.register("supplier")}
              />
              {form.formState.errors.supplier && (
                <p className="text-sm text-red-500">{form.formState.errors.supplier.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Popover open={expirationDateOpen} onOpenChange={setExpirationDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.getValues("expiration_date") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.getValues("expiration_date") ? (
                      format(form.getValues("expiration_date"), "PPP")
                    ) : (
                      <span>Optional</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.getValues("expiration_date") || undefined}
                    onSelect={(date) => {
                      form.setValue("expiration_date", date);
                      setExpirationDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this feed (optional)"
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-r-transparent"></span>
                Saving...
              </span>
            ) : inventory ? (
              "Update Feed"
            ) : (
              "Add Feed"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
