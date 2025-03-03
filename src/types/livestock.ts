
import { Tables } from "@/integrations/supabase/types";

export type Livestock = Tables<'livestock'>;
export type HealthRecord = Tables<'health_records'>;
export type FeedInventory = Tables<'feed_inventory'>;
export type FeedConsumption = Tables<'feed_consumption'>;
