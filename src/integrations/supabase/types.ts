export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_plans: {
        Row: {
          created_at: string
          customer_id: string
          description: string
          due_date: string | null
          id: string
          lost_revenue: number | null
          notes: string | null
          owner_id: string | null
          result: Database["public"]["Enums"]["action_result"] | null
          retained_revenue: number | null
          status: Database["public"]["Enums"]["action_status"]
          type: Database["public"]["Enums"]["action_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description: string
          due_date?: string | null
          id?: string
          lost_revenue?: number | null
          notes?: string | null
          owner_id?: string | null
          result?: Database["public"]["Enums"]["action_result"] | null
          retained_revenue?: number | null
          status?: Database["public"]["Enums"]["action_status"]
          type: Database["public"]["Enums"]["action_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string
          due_date?: string | null
          id?: string
          lost_revenue?: number | null
          notes?: string | null
          owner_id?: string | null
          result?: Database["public"]["Enums"]["action_result"] | null
          retained_revenue?: number | null
          status?: Database["public"]["Enums"]["action_status"]
          type?: Database["public"]["Enums"]["action_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          channel: Database["public"]["Enums"]["alert_channel"]
          created_at: string
          customer_id: string | null
          frequency: string
          id: string
          is_active: boolean
          name: string
          organization_id: string
          recipients: string[]
          scope: string
          trigger: Database["public"]["Enums"]["alert_trigger"]
          updated_at: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["alert_channel"]
          created_at?: string
          customer_id?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          recipients?: string[]
          scope?: string
          trigger: Database["public"]["Enums"]["alert_trigger"]
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["alert_channel"]
          created_at?: string
          customer_id?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          recipients?: string[]
          scope?: string
          trigger?: Database["public"]["Enums"]["alert_trigger"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_metrics: {
        Row: {
          customer_id: string
          features_used: number
          id: string
          last_login: string | null
          login_count_30d: number
          nps: number | null
          payment_status: string
          recorded_at: string
          tickets_open: number
          total_features: number
        }
        Insert: {
          customer_id: string
          features_used?: number
          id?: string
          last_login?: string | null
          login_count_30d?: number
          nps?: number | null
          payment_status?: string
          recorded_at?: string
          tickets_open?: number
          total_features?: number
        }
        Update: {
          customer_id?: string
          features_used?: number
          id?: string
          last_login?: string | null
          login_count_30d?: number
          nps?: number | null
          payment_status?: string
          recorded_at?: string
          tickets_open?: number
          total_features?: number
        }
        Relationships: [
          {
            foreignKeyName: "customer_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          last_snapshot_at: string | null
          mrr: number
          name: string
          organization_id: string
          owner_id: string | null
          risk_score: number
          risk_variation: number
          risk_zone: Database["public"]["Enums"]["risk_zone"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_snapshot_at?: string | null
          mrr?: number
          name: string
          organization_id: string
          owner_id?: string | null
          risk_score?: number
          risk_variation?: number
          risk_zone?: Database["public"]["Enums"]["risk_zone"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_snapshot_at?: string | null
          mrr?: number
          name?: string
          organization_id?: string
          owner_id?: string | null
          risk_score?: number
          risk_variation?: number
          risk_zone?: Database["public"]["Enums"]["risk_zone"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_logs: {
        Row: {
          customers_processed: number
          error_message: string | null
          finished_at: string | null
          id: string
          organization_id: string
          run_type: string
          started_at: string
          status: string
        }
        Insert: {
          customers_processed?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          organization_id: string
          run_type: string
          started_at?: string
          status?: string
        }
        Update: {
          customers_processed?: number
          error_message?: string | null
          finished_at?: string | null
          id?: string
          organization_id?: string
          run_type?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_drivers: {
        Row: {
          category: string
          created_at: string
          customer_id: string
          direction: string
          id: string
          impact: string | null
          name: string
          previous_value: number
          value: number
        }
        Insert: {
          category: string
          created_at?: string
          customer_id: string
          direction: string
          id?: string
          impact?: string | null
          name: string
          previous_value: number
          value: number
        }
        Update: {
          category?: string
          created_at?: string
          customer_id?: string
          direction?: string
          id?: string
          impact?: string | null
          name?: string
          previous_value?: number
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "risk_drivers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_scores: {
        Row: {
          created_at: string
          customer_id: string
          drivers_snapshot: Json | null
          horizon: string
          id: string
          score: number
          zone: Database["public"]["Enums"]["risk_zone"]
        }
        Insert: {
          created_at?: string
          customer_id: string
          drivers_snapshot?: Json | null
          horizon?: string
          id?: string
          score: number
          zone: Database["public"]["Enums"]["risk_zone"]
        }
        Update: {
          created_at?: string
          customer_id?: string
          drivers_snapshot?: Json | null
          horizon?: string
          id?: string
          score?: number
          zone?: Database["public"]["Enums"]["risk_zone"]
        }
        Relationships: [
          {
            foreignKeyName: "risk_scores_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      variables_book: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          label: string
          organization_id: string
          source: string | null
          transform: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          label: string
          organization_id: string
          source?: string | null
          transform?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          label?: string
          organization_id?: string
          source?: string | null
          transform?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "variables_book_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: { Args: never; Returns: string }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      action_result: "success" | "failure"
      action_status: "open" | "in_progress" | "completed"
      action_type: "meeting" | "training" | "technical" | "discount" | "other"
      alert_channel: "email" | "slack" | "webhook"
      alert_trigger: "to_high" | "to_extreme" | "any_increase"
      app_role: "admin" | "cs" | "leadership"
      risk_zone: "low" | "moderate" | "high" | "extreme"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_result: ["success", "failure"],
      action_status: ["open", "in_progress", "completed"],
      action_type: ["meeting", "training", "technical", "discount", "other"],
      alert_channel: ["email", "slack", "webhook"],
      alert_trigger: ["to_high", "to_extreme", "any_increase"],
      app_role: ["admin", "cs", "leadership"],
      risk_zone: ["low", "moderate", "high", "extreme"],
    },
  },
} as const
