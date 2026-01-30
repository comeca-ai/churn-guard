export type AppRole = 'admin' | 'cs' | 'leadership';

export type RiskZone = 'low' | 'moderate' | 'high' | 'extreme';

export type ActionType = 'meeting' | 'training' | 'technical' | 'discount' | 'other';

export type ActionStatus = 'open' | 'in_progress' | 'completed';

export type ActionResult = 'success' | 'failure';

export type AlertTrigger = 'to_high' | 'to_extreme' | 'any_increase';

export type AlertChannel = 'email' | 'slack' | 'webhook';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          organization_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: AppRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: AppRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AppRole;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          mrr: number;
          owner_id: string | null;
          risk_zone: RiskZone;
          risk_score: number;
          risk_variation: number;
          last_snapshot_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          mrr?: number;
          owner_id?: string | null;
          risk_zone?: RiskZone;
          risk_score?: number;
          risk_variation?: number;
          last_snapshot_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          mrr?: number;
          owner_id?: string | null;
          risk_zone?: RiskZone;
          risk_score?: number;
          risk_variation?: number;
          last_snapshot_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      risk_scores: {
        Row: {
          id: string;
          customer_id: string;
          score: number;
          zone: RiskZone;
          horizon: string;
          drivers_snapshot: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          score: number;
          zone: RiskZone;
          horizon?: string;
          drivers_snapshot?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          score?: number;
          zone?: RiskZone;
          horizon?: string;
          drivers_snapshot?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      risk_drivers: {
        Row: {
          id: string;
          customer_id: string;
          name: string;
          category: string;
          direction: 'up' | 'down';
          impact: string | null;
          value: number;
          previous_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          name: string;
          category: string;
          direction: 'up' | 'down';
          impact?: string | null;
          value: number;
          previous_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          name?: string;
          category?: string;
          direction?: 'up' | 'down';
          impact?: string | null;
          value?: number;
          previous_value?: number;
          created_at?: string;
        };
      };
      customer_metrics: {
        Row: {
          id: string;
          customer_id: string;
          tickets_open: number;
          last_login: string | null;
          payment_status: string;
          nps: number | null;
          login_count_30d: number;
          features_used: number;
          total_features: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          tickets_open?: number;
          last_login?: string | null;
          payment_status?: string;
          nps?: number | null;
          login_count_30d?: number;
          features_used?: number;
          total_features?: number;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          tickets_open?: number;
          last_login?: string | null;
          payment_status?: string;
          nps?: number | null;
          login_count_30d?: number;
          features_used?: number;
          total_features?: number;
          recorded_at?: string;
        };
      };
      action_plans: {
        Row: {
          id: string;
          customer_id: string;
          type: ActionType;
          description: string;
          owner_id: string | null;
          due_date: string | null;
          status: ActionStatus;
          result: ActionResult | null;
          retained_revenue: number | null;
          lost_revenue: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          type: ActionType;
          description: string;
          owner_id?: string | null;
          due_date?: string | null;
          status?: ActionStatus;
          result?: ActionResult | null;
          retained_revenue?: number | null;
          lost_revenue?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          type?: ActionType;
          description?: string;
          owner_id?: string | null;
          due_date?: string | null;
          status?: ActionStatus;
          result?: ActionResult | null;
          retained_revenue?: number | null;
          lost_revenue?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          trigger: AlertTrigger;
          scope: 'all' | 'specific';
          customer_id: string | null;
          channel: AlertChannel;
          recipients: string[];
          frequency: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          trigger: AlertTrigger;
          scope?: 'all' | 'specific';
          customer_id?: string | null;
          channel?: AlertChannel;
          recipients?: string[];
          frequency?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          trigger?: AlertTrigger;
          scope?: 'all' | 'specific';
          customer_id?: string | null;
          channel?: AlertChannel;
          recipients?: string[];
          frequency?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      variables_book: {
        Row: {
          id: string;
          organization_id: string;
          key: string;
          label: string;
          source: string | null;
          transform: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          key: string;
          label: string;
          source?: string | null;
          transform?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          key?: string;
          label?: string;
          source?: string | null;
          transform?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      execution_logs: {
        Row: {
          id: string;
          organization_id: string;
          run_type: string;
          status: string;
          customers_processed: number;
          error_message: string | null;
          started_at: string;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          run_type: string;
          status?: string;
          customers_processed?: number;
          error_message?: string | null;
          started_at?: string;
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          organization_id?: string;
          run_type?: string;
          status?: string;
          customers_processed?: number;
          error_message?: string | null;
          started_at?: string;
          finished_at?: string | null;
        };
      };
    };
    Functions: {
      get_user_organization_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
      has_any_role: {
        Args: { _user_id: string; _roles: AppRole[] };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      risk_zone: RiskZone;
      action_type: ActionType;
      action_status: ActionStatus;
      action_result: ActionResult;
      alert_trigger: AlertTrigger;
      alert_channel: AlertChannel;
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types
export type Organization = Tables<'organizations'>;
export type Profile = Tables<'profiles'>;
export type UserRoleRow = Tables<'user_roles'>;
export type Customer = Tables<'customers'>;
export type RiskScore = Tables<'risk_scores'>;
export type RiskDriver = Tables<'risk_drivers'>;
export type CustomerMetrics = Tables<'customer_metrics'>;
export type ActionPlan = Tables<'action_plans'>;
export type Alert = Tables<'alerts'>;
export type VariablesBook = Tables<'variables_book'>;
export type ExecutionLog = Tables<'execution_logs'>;
