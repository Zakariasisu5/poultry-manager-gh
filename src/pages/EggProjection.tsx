
import { useState } from "react";
import { Egg } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EggProjectionForm } from "@/components/egg-projection/EggProjectionForm";
import { ProjectionResults } from "@/components/egg-projection/ProjectionResults";

const EggProjection = () => {
  const [projectionData, setProjectionData] = useState(null);

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Egg className="h-7 w-7 text-primary" />
            Egg Projection Management
          </h1>
          <p className="text-muted-foreground">
            Calculate and visualize egg production projections based on your flock details.
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        <EggProjectionForm onProjectionCalculated={setProjectionData} />
        <ProjectionResults data={projectionData} />
      </div>
    </PageContainer>
  );
};

export default EggProjection;
