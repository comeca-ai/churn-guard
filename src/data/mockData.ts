import { 
  Organization, 
  UserProfile, 
  Customer, 
  RiskScore, 
  Driver, 
  CustomerMetrics, 
  Action,
  DashboardKPIs,
  ChurnScoreHistory,
  RiskDistribution,
  RiskLevel
} from '@/types/churn';

// Organizations
export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'TechCorp Brasil',
    logo: undefined,
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'org-2',
    name: 'Startup XYZ',
    logo: undefined,
    createdAt: new Date('2023-06-20'),
  },
];

// Current user
export const mockCurrentUser: UserProfile = {
  id: 'user-1',
  email: 'carlos.silva@techcorp.com',
  name: 'Carlos Silva',
  organizationId: 'org-1',
  role: 'admin',
};

// Team members
export const mockTeamMembers: UserProfile[] = [
  mockCurrentUser,
  {
    id: 'user-2',
    email: 'ana.costa@techcorp.com',
    name: 'Ana Costa',
    organizationId: 'org-1',
    role: 'cs',
  },
  {
    id: 'user-3',
    email: 'marcos.lima@techcorp.com',
    name: 'Marcos Lima',
    organizationId: 'org-1',
    role: 'cs',
  },
  {
    id: 'user-4',
    email: 'julia.santos@techcorp.com',
    name: 'Julia Santos',
    organizationId: 'org-1',
    role: 'leadership',
  },
];

// Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'TechSolutions Ltda',
    organizationId: 'org-1',
    mrr: 25000,
    ownerId: 'user-2',
    ownerName: 'Ana Costa',
    riskLevel: 'extreme',
    riskScore: 92,
    riskVariation: 15,
    lastSnapshotAt: new Date('2026-01-28'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'cust-2',
    name: 'DataFlow Inc',
    organizationId: 'org-1',
    mrr: 18500,
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    riskLevel: 'high',
    riskScore: 78,
    riskVariation: 8,
    lastSnapshotAt: new Date('2026-01-29'),
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'cust-3',
    name: 'CloudBase SA',
    organizationId: 'org-1',
    mrr: 32000,
    ownerId: 'user-2',
    ownerName: 'Ana Costa',
    riskLevel: 'high',
    riskScore: 71,
    riskVariation: -5,
    lastSnapshotAt: new Date('2026-01-28'),
    createdAt: new Date('2023-11-05'),
  },
  {
    id: 'cust-4',
    name: 'InnovateTech',
    organizationId: 'org-1',
    mrr: 15000,
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    riskLevel: 'moderate',
    riskScore: 55,
    riskVariation: 3,
    lastSnapshotAt: new Date('2026-01-30'),
    createdAt: new Date('2024-05-15'),
  },
  {
    id: 'cust-5',
    name: 'DigitalPrime',
    organizationId: 'org-1',
    mrr: 42000,
    ownerId: 'user-2',
    ownerName: 'Ana Costa',
    riskLevel: 'moderate',
    riskScore: 48,
    riskVariation: -2,
    lastSnapshotAt: new Date('2026-01-29'),
    createdAt: new Date('2023-08-22'),
  },
  {
    id: 'cust-6',
    name: 'SmartOps Brasil',
    organizationId: 'org-1',
    mrr: 28000,
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    riskLevel: 'low',
    riskScore: 25,
    riskVariation: -8,
    lastSnapshotAt: new Date('2026-01-30'),
    createdAt: new Date('2024-02-18'),
  },
  {
    id: 'cust-7',
    name: 'NextLevel Corp',
    organizationId: 'org-1',
    mrr: 55000,
    ownerId: 'user-2',
    ownerName: 'Ana Costa',
    riskLevel: 'low',
    riskScore: 18,
    riskVariation: 0,
    lastSnapshotAt: new Date('2026-01-29'),
    createdAt: new Date('2023-05-10'),
  },
  {
    id: 'cust-8',
    name: 'Agile Systems',
    organizationId: 'org-1',
    mrr: 12000,
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    riskLevel: 'low',
    riskScore: 12,
    riskVariation: -3,
    lastSnapshotAt: new Date('2026-01-28'),
    createdAt: new Date('2024-07-01'),
  },
];

// Risk score history for TechSolutions (cust-1)
export const mockRiskScoreHistory: RiskScore[] = [
  { id: 'rs-1', customerId: 'cust-1', score: 35, riskLevel: 'moderate', recordedAt: new Date('2025-08-01') },
  { id: 'rs-2', customerId: 'cust-1', score: 42, riskLevel: 'moderate', recordedAt: new Date('2025-09-01') },
  { id: 'rs-3', customerId: 'cust-1', score: 55, riskLevel: 'moderate', recordedAt: new Date('2025-10-01') },
  { id: 'rs-4', customerId: 'cust-1', score: 68, riskLevel: 'high', recordedAt: new Date('2025-11-01') },
  { id: 'rs-5', customerId: 'cust-1', score: 77, riskLevel: 'high', recordedAt: new Date('2025-12-01') },
  { id: 'rs-6', customerId: 'cust-1', score: 92, riskLevel: 'extreme', recordedAt: new Date('2026-01-01') },
];

// Drivers for TechSolutions
export const mockDrivers: Driver[] = [
  {
    id: 'drv-1',
    customerId: 'cust-1',
    name: 'Uso do produto',
    category: 'product',
    direction: 'down',
    impact: 'Caiu 45% no último mês',
    value: 55,
    previousValue: 100,
  },
  {
    id: 'drv-2',
    customerId: 'cust-1',
    name: 'Tickets de suporte',
    category: 'support',
    direction: 'up',
    impact: 'Aumentou 3x',
    value: 12,
    previousValue: 4,
  },
  {
    id: 'drv-3',
    customerId: 'cust-1',
    name: 'NPS',
    category: 'engagement',
    direction: 'down',
    impact: 'Caiu de 8 para 5',
    value: 5,
    previousValue: 8,
  },
  {
    id: 'drv-4',
    customerId: 'cust-1',
    name: 'Pagamento',
    category: 'financial',
    direction: 'up',
    impact: '2 faturas atrasadas',
    value: 2,
    previousValue: 0,
  },
  {
    id: 'drv-5',
    customerId: 'cust-1',
    name: 'Logins',
    category: 'engagement',
    direction: 'down',
    impact: 'Reduziu 60%',
    value: 8,
    previousValue: 20,
  },
];

// Customer metrics for TechSolutions
export const mockCustomerMetrics: CustomerMetrics = {
  customerId: 'cust-1',
  ticketsOpen: 12,
  lastLogin: new Date('2026-01-15'),
  paymentStatus: 'overdue',
  nps: 5,
  loginCount30d: 8,
  featuresUsed: 4,
  totalFeatures: 12,
};

// Actions
export const mockActions: Action[] = [
  {
    id: 'act-1',
    customerId: 'cust-1',
    customerName: 'TechSolutions Ltda',
    type: 'meeting',
    description: 'Reunião de alinhamento com stakeholder principal para entender insatisfação',
    ownerId: 'user-2',
    ownerName: 'Ana Costa',
    dueDate: new Date('2026-02-05'),
    status: 'open',
    createdAt: new Date('2026-01-28'),
  },
  {
    id: 'act-2',
    customerId: 'cust-1',
    customerName: 'TechSolutions Ltda',
    type: 'training',
    description: 'Treinamento de novas features para equipe do cliente',
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    dueDate: new Date('2026-02-10'),
    status: 'open',
    createdAt: new Date('2026-01-29'),
  },
  {
    id: 'act-3',
    customerId: 'cust-2',
    customerName: 'DataFlow Inc',
    type: 'technical',
    description: 'Resolver problema de integração com API',
    ownerId: 'user-3',
    ownerName: 'Marcos Lima',
    dueDate: new Date('2026-01-31'),
    status: 'in_progress',
    createdAt: new Date('2026-01-20'),
  },
];

// Dashboard KPIs
export const mockDashboardKPIs: DashboardKPIs = {
  customersAtRisk: 3, // extreme + high
  customersAtRiskVariation: 12, // percentage increase
  revenueAtRisk: 75500, // sum of MRR for extreme + high risk customers
  revenueAtRiskVariation: 8,
  movementsUp: 12,
  movementsDown: 5,
};

// Churn score history (last 12 months)
export const mockChurnScoreHistory: ChurnScoreHistory[] = [
  { month: 'Fev', score: 28 },
  { month: 'Mar', score: 32 },
  { month: 'Abr', score: 30 },
  { month: 'Mai', score: 35 },
  { month: 'Jun', score: 38 },
  { month: 'Jul', score: 42 },
  { month: 'Ago', score: 45 },
  { month: 'Set', score: 48 },
  { month: 'Out', score: 52 },
  { month: 'Nov', score: 55 },
  { month: 'Dez', score: 58 },
  { month: 'Jan', score: 62 },
];

// Risk distribution
export const mockRiskDistribution: RiskDistribution[] = [
  { level: 'low', count: 3, percentage: 37.5 },
  { level: 'moderate', count: 2, percentage: 25 },
  { level: 'high', count: 2, percentage: 25 },
  { level: 'extreme', count: 1, percentage: 12.5 },
];

// Helper functions
export function getRiskLevelLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: 'Baixo',
    moderate: 'Moderado',
    high: 'Alto',
    extreme: 'Extremo',
  };
  return labels[level];
}

export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: 'bg-risk-low text-risk-low-foreground',
    moderate: 'bg-risk-moderate text-risk-moderate-foreground',
    high: 'bg-risk-high text-risk-high-foreground',
    extreme: 'bg-risk-extreme text-risk-extreme-foreground',
  };
  return colors[level];
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'há 1 dia';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`;
  return `há ${Math.floor(diffDays / 30)} meses`;
}
