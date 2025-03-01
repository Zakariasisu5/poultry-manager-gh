
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Egg, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  flock: z.string().min(1, "Flock name is required"),
  birdCount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Bird count must be a positive number",
  }),
  birdAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Bird age must be a non-negative number",
  }),
  breedType: z.string().min(1, "Breed type is required"),
  projectionPeriod: z.string().min(1, "Projection period is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function EggProjectionForm({
  onProjectionCalculated
}: {
  onProjectionCalculated: (projectionData: any) => void
}) {
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flock: "",
      birdCount: "",
      birdAge: "",
      breedType: "",
      projectionPeriod: "30",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsCalculating(true);
    
    // Convert string values to numbers
    const birdCount = Number(data.birdCount);
    const birdAge = Number(data.birdAge);
    const projectionPeriod = Number(data.projectionPeriod);
    
    // Simulate calculation with setTimeout
    setTimeout(() => {
      // Calculate projection based on bird breed, age, and count
      let baseProductionRate;
      
      // Production rates vary by breed
      switch(data.breedType) {
        case "leghorn":
          baseProductionRate = 0.85; // 85% production rate
          break;
        case "rhodeIsland":
          baseProductionRate = 0.75; // 75% production rate
          break;
        case "plymouth":
          baseProductionRate = 0.70; // 70% production rate
          break;
        case "orpington":
          baseProductionRate = 0.65; // 65% production rate
          break;
        default:
          baseProductionRate = 0.75; // Default production rate
      }
      
      // Adjust production rate based on bird age
      // Peak production typically between 20-32 weeks
      let ageAdjustment = 1.0;
      
      if (birdAge < 20) {
        // Ramp up to peak production
        ageAdjustment = Math.max(0.1, birdAge / 20);
      } else if (birdAge > 32) {
        // Production declines after peak
        ageAdjustment = Math.max(0.5, 1 - (birdAge - 32) / 100);
      }
      
      const dailyRate = baseProductionRate * ageAdjustment;
      const dailyEggs = Math.round(birdCount * dailyRate);
      const totalEggs = dailyEggs * projectionPeriod;
      
      // Generate weekly breakdown
      const weeksCount = Math.ceil(projectionPeriod / 7);
      const weeklyData = Array.from({ length: weeksCount }, (_, i) => {
        // Slight decrease in production over time (0.5% per week)
        const weeklyAdjustment = Math.max(0.7, 1 - (i * 0.005));
        const weekDays = (i < weeksCount - 1) || (projectionPeriod % 7 === 0) ? 7 : projectionPeriod % 7;
        const eggs = Math.round(dailyEggs * weekDays * weeklyAdjustment);
        
        return {
          week: i + 1,
          eggs: eggs,
          cumulative: 0, // Will be calculated below
        };
      });
      
      // Calculate cumulative values
      let cumulativeSum = 0;
      weeklyData.forEach(week => {
        cumulativeSum += week.eggs;
        week.cumulative = cumulativeSum;
      });
      
      const projectionData = {
        summary: {
          flock: data.flock,
          birdCount,
          birdAge,
          breedType: data.breedType,
          period: projectionPeriod,
          dailyEggs,
          totalEggs,
          productionRate: (dailyRate * 100).toFixed(1) + "%"
        },
        weeklyData
      };
      
      // Pass the projection data to the parent component
      onProjectionCalculated(projectionData);
      
      toast({
        title: "Projection Calculated",
        description: `Projected ${totalEggs} eggs over ${projectionPeriod} days.`,
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Egg className="h-5 w-5 text-primary" />
          <span>Egg Production Projection</span>
        </CardTitle>
        <CardDescription>
          Enter your flock details to calculate expected egg production
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="flock">Flock Name</Label>
              <Input
                id="flock"
                placeholder="Coop #1"
                {...register("flock")}
              />
              {errors.flock && (
                <p className="text-xs text-red-500">{errors.flock.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breedType">Breed Type</Label>
              <Select
                defaultValue=""
                onValueChange={(value) => {
                  const event = {
                    target: { name: "breedType", value: value }
                  } as React.ChangeEvent<HTMLInputElement>;
                  register("breedType").onChange(event);
                }}
              >
                <SelectTrigger id="breedType">
                  <SelectValue placeholder="Select breed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leghorn">White Leghorn</SelectItem>
                  <SelectItem value="rhodeIsland">Rhode Island Red</SelectItem>
                  <SelectItem value="plymouth">Plymouth Rock</SelectItem>
                  <SelectItem value="orpington">Buff Orpington</SelectItem>
                </SelectContent>
              </Select>
              {errors.breedType && (
                <p className="text-xs text-red-500">{errors.breedType.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birdCount">Number of Birds</Label>
              <Input
                id="birdCount"
                type="number"
                min="1"
                placeholder="100"
                {...register("birdCount")}
              />
              {errors.birdCount && (
                <p className="text-xs text-red-500">{errors.birdCount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birdAge">Bird Age (weeks)</Label>
              <Input
                id="birdAge"
                type="number"
                min="0"
                placeholder="20"
                {...register("birdAge")}
              />
              {errors.birdAge && (
                <p className="text-xs text-red-500">{errors.birdAge.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="projectionPeriod">Projection Period</Label>
              <Select
                defaultValue="30"
                onValueChange={(value) => {
                  const event = {
                    target: { name: "projectionPeriod", value: value }
                  } as React.ChangeEvent<HTMLInputElement>;
                  register("projectionPeriod").onChange(event);
                }}
              >
                <SelectTrigger id="projectionPeriod">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days (1 week)</SelectItem>
                  <SelectItem value="14">14 days (2 weeks)</SelectItem>
                  <SelectItem value="30">30 days (1 month)</SelectItem>
                  <SelectItem value="90">90 days (3 months)</SelectItem>
                  <SelectItem value="180">180 days (6 months)</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectionPeriod && (
                <p className="text-xs text-red-500">{errors.projectionPeriod.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isCalculating}>
            {isCalculating ? "Calculating..." : "Calculate Projection"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
