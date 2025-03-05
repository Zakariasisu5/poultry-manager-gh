import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Livestock, FinancialTransactionFormData } from "@/types/livestock";
import { useAuthContext } from "@/hooks/useAuthContext";

interface FinancialTransactionFormProps {
  onTransactionAdded: () => void;
}

const formSchema = z.object({
  transaction_date: z.date(),
  transaction_type: z.enum(["income", "expense"]),
  category: z.string().min(1, { message: "Category is required" }),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  description: z.string().optional(),
  related_livestock_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function FinancialTransactionForm({ onTransactionAdded }: FinancialTransactionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  
  const { data: livestock } = useQuery({
    queryKey: ["livestock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("livestock")
        .select("*")
        .order("tag_number", { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Livestock[];
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_date: new Date(),
      transaction_type: "income",
      category: "",
      amount: 0,
      description: "",
      related_livestock_id: undefined,
    },
  });

  const transactionType = form.watch("transaction_type");

  const incomeCategories = [
    "Egg Sales",
    "Meat Sales",
    "Livestock Sales",
    "Other Income",
  ];

  const expenseCategories = [
    "Feed",
    "Medicine/Vaccines",
    "Equipment",
    "Utilities",
    "Labor",
    "Repairs",
    "Other Expense",
  ];

  const categories = transactionType === "income" ? incomeCategories : expenseCategories;

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be signed in to add transactions",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const transaction: FinancialTransactionFormData = {
        transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
        transaction_type: values.transaction_type,
        category: values.category,
        amount: values.amount,
        description: values.description || null,
        related_livestock_id: values.related_livestock_id || null,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("financial_transactions")
        .insert(transaction);

      if (error) {
        throw error;
      }

      form.reset({
        transaction_date: new Date(),
        transaction_type: "income",
        category: "",
        amount: 0,
        description: "",
        related_livestock_id: undefined,
      });

      onTransactionAdded();
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add financial transaction",
        variant: "destructive",
      });
      console.error("Transaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new financial transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transaction_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        className="pl-7" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="related_livestock_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Livestock (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select livestock" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {livestock?.map((animal) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.tag_number || 'Unknown'} - {animal.animal_type} {animal.breed ? `(${animal.breed})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Link this transaction to a specific animal (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add notes or details about this transaction" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Transaction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
