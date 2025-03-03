
import React from "react";
import { Livestock } from "@/pages/LivestockTracking";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Cow, DollarSign, Users } from "lucide-react";

interface LivestockSummaryProps {
  livestock: Livestock[];
}

export function LivestockSummary({ livestock }: LivestockSummaryProps) {
  // Calculate summary statistics
  const totalLivestock = livestock.length;
  const activeLivestock = livestock.filter(animal => animal.status === "active").length;
  
  // Calculate total investment
  const totalInvestment = livestock.reduce((sum, animal) => {
    return sum + (animal.acquisition_cost || 0);
  }, 0);

  // Count animal types
  const animalTypeCounts: Record<string, number> = {};
  livestock.forEach(animal => {
    const type = animal.animal_type;
    animalTypeCounts[type] = (animalTypeCounts[type] || 0) + 1;
  });

  // Get top 3 animal types
  const topAnimalTypes = Object.entries(animalTypeCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DashboardCard title="Total Livestock" className="bg-blue-50">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-3xl font-bold">{totalLivestock}</p>
            <p className="text-sm text-muted-foreground">
              {activeLivestock} active
            </p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Total Investment" className="bg-green-50">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-3">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-3xl font-bold">${totalInvestment.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              Total acquisition cost
            </p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Animal Types" className="bg-purple-50">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-purple-100 p-3">
            <Cow className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-3xl font-bold">{Object.keys(animalTypeCounts).length}</p>
            <div className="text-sm text-muted-foreground">
              {topAnimalTypes.map(([type, count], index) => (
                <span key={type}>
                  {type} ({count})
                  {index < topAnimalTypes.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
