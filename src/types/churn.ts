// Risk levels for churn prediction
export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme';

// User roles for RBAC
export type UserRole = 'admin' | 'cs' | 'leadership';

// Organization
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
}

// User profile
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  organizationId: string;
  role: UserRole;
}

// Customer (client of the organization)
export interface Customer {
  id: string;
  name: string;
  organizationId: string;
  mrr: number;
  ownerId: string; // CSM responsible
  ownerName?: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  riskVariation: number; // positive = increased risk, negative = decreased
  lastSnapshotAt: Date;
  createdAt: Date;
}

// Risk score history
export interface RiskScore {
  id: string;
  customerId: string;
  score: number;
  riskLevel: RiskLevel;
  recordedAt: Date;
}

// Driver - factor explaining risk
export interface Driver {
  id: string;
  customerId: string;
  name: string;
  category: 'product' | 'support' | 'financial' | 'engagement';
  direction: 'up' | 'down';
  impact: string; // Description of impact
  value: number;
  previousValue: number;
}

// Customer metrics
export interface CustomerMetrics {
  customerId: string;
  ticketsOpen: number;
  lastLogin: Date | null;
  paymentStatus: 'current' | 'overdue' | 'critical';
  nps: number | null;
  loginCount30d: number;
  featuresUsed: number;
  totalFeatures: number;
}

// Action plan
export interface Action {
  id: string;
  customerId: string;
  customerName?: string;
  type: 'meeting' | 'training' | 'technical' | 'discount' | 'other';
  description: string;
  ownerId: string;
  ownerName?: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'completed';
  result?: 'success' | 'failure';
  retainedRevenue?: number;
  lostRevenue?: number;
  notes?: string;
  createdAt: Date;
}

// Alert configuration
export interface Alert {
  id: string;
  organizationId: string;
  name: string;
  trigger: 'to_high' | 'to_extreme' | 'any_increase';
  scope: 'all' | 'specific';
  customerId?: string;
  channel: 'email';
  recipients: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  isActive: boolean;
  createdAt: Date;
}

// Dashboard KPIs
export interface DashboardKPIs {
  customersAtRisk: number;
  customersAtRiskVariation: number;
  revenueAtRisk: number;
  revenueAtRiskVariation: number;
  movementsUp: number;
  movementsDown: number;
}

// Chart data
export interface ChurnScoreHistory {
  month: string;
  score: number;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
}
