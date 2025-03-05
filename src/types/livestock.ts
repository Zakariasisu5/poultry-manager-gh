
import { Tables } from "@/integrations/supabase/types";

export type Livestock = Tables<'livestock'>;
export type HealthRecord = Tables<'health_records'>;
export type FeedInventory = Tables<'feed_inventory'>;

// Base FeedConsumption type from the database
export type FeedConsumption = Tables<'feed_consumption'>;

// Extended FeedConsumption type that includes the joined feed_inventory data
export interface FeedConsumptionWithInventory extends FeedConsumption {
  feed_inventory?: FeedInventory;
}

// Financial transaction type
export type FinancialTransaction = Tables<'financial_transactions'>;

// Add a type specifically for form submissions if needed
export interface FinancialTransactionFormData {
  transaction_date: string;
  transaction_type: string;
  category: string;
  amount: number;
  description: string | null;
  related_livestock_id: string | null;
  user_id: string;
}

// User profile type
export interface UserProfile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  role?: string | null;
  updated_at?: string;
  created_at?: string;
}
