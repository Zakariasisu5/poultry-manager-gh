
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FinancialTransactionForm } from "@/components/financial/FinancialTransactionForm";
import { FinancialTransactionList } from "@/components/financial/FinancialTransactionList";
import { FinancialSummary } from "@/components/financial/FinancialSummary";

const FinancialManagement = () => {
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleTransactionAdded = () => {
    toast({
      title: "Transaction added",
      description: "Your financial transaction has been recorded.",
    });
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">
            Track your farm income and expenses
          </p>
        </div>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList>
          <TabsTrigger value="records">Transaction Records</TabsTrigger>
          <TabsTrigger value="summary">Financial Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="records" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <FinancialTransactionForm onTransactionAdded={handleTransactionAdded} />
            </div>
            <div className="md:col-span-2">
              <FinancialTransactionList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="summary">
          <FinancialSummary refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default FinancialManagement;
