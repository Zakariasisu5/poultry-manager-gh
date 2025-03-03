
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/integrations/supabase/types';
import { Bird, PiggyBank, BarChartHorizontal } from 'lucide-react';

interface LivestockSummaryProps {
  livestock: Tables<'livestock'>[];
}

export function LivestockSummary({ livestock }: LivestockSummaryProps) {
  const totalLivestock = livestock.length;
  
  const activeLivestock = livestock.filter(animal => animal.status === 'active').length;
  
  const livestockTypes = [...new Set(livestock.map(animal => animal.animal_type))].length;
  
  const totalInvestment = livestock.reduce((sum, animal) => {
    return sum + (animal.acquisition_cost || 0);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
          <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLivestock}</div>
          <p className="text-xs text-muted-foreground">
            Total animals tracked
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Livestock</CardTitle>
          <Bird className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLivestock}</div>
          <p className="text-xs text-muted-foreground">
            Currently active animals
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Livestock Types</CardTitle>
          <Bird className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{livestockTypes}</div>
          <p className="text-xs text-muted-foreground">
            Different types of animals
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total acquisition cost
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
