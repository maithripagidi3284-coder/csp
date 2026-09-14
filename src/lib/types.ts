// Hand-written to match supabase/migrations/*.sql. Regenerate with
// `supabase gen types typescript --linked` once the project is linked,
// and replace this file — keep the shape, drop the hand-maintenance note.

export type UnitLevel = "national" | "state" | "city_district" | "assembly" | "ward_village";
export type UnitStatus = "working_group" | "chapter";
export type InitiativeType = "project" | "campaign";
export type InitiativeStatus = "planned" | "active" | "completed" | "archived";
export type DonationStatus = "pending" | "paid" | "failed" | "refunded";

export interface Unit {
  id: string;
  parent_id: string | null;
  level: UnitLevel;
  name: string;
  slug: string;
  status: UnitStatus;
  description: string | null;
  created_at: string;
}

export interface Initiative {
  id: string;
  unit_id: string;
  type: InitiativeType;
  justice_pillar: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  goal_amount: number | null;
  start_date: string;
  end_date: string | null;
  status: InitiativeStatus;
  is_published: boolean;
  created_at: string;
}

export interface InitiativeUpdate {
  id: string;
  initiative_id: string;
  title: string;
  body: string;
  is_published: boolean;
  created_at: string;
}

export interface FinancialReport {
  id: string;
  unit_id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  total_income: number;
  total_expenditure: number;
  summary: string | null;
  document_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface Donor {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  initiative_id: string;
  amount: number;
  currency: string;
  status: DonationStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  receipt_number: string | null;
  receipt_sent_at: string | null;
  created_at: string;
}

export interface InitiativeFollow {
  id: string;
  donor_id: string;
  initiative_id: string;
  created_at: string;
}

export interface InitiativeFundsRaised {
  initiative_id: string;
  amount_raised: number;
  donor_count: number;
}

export interface Database {
  public: {
    Tables: {
      units: { Row: Unit; Insert: Partial<Unit>; Update: Partial<Unit> };
      initiatives: { Row: Initiative; Insert: Partial<Initiative>; Update: Partial<Initiative> };
      initiative_updates: { Row: InitiativeUpdate; Insert: Partial<InitiativeUpdate>; Update: Partial<InitiativeUpdate> };
      financial_reports: { Row: FinancialReport; Insert: Partial<FinancialReport>; Update: Partial<FinancialReport> };
      donors: { Row: Donor; Insert: Partial<Donor>; Update: Partial<Donor> };
      donations: { Row: Donation; Insert: Partial<Donation>; Update: Partial<Donation> };
      initiative_follows: { Row: InitiativeFollow; Insert: Partial<InitiativeFollow>; Update: Partial<InitiativeFollow> };
    };
    Views: {
      initiative_funds_raised: { Row: InitiativeFundsRaised };
    };
  };
}
