import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { VariationIndicator } from "@/components/ui/variation-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mockDashboardKPIs,
  mockCustomers,
  mockChurnScoreHistory,
  mockRiskDistribution,
  formatCurrency,
  formatRelativeDate,
  getRiskLevelLabel,
} from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const riskColors: Record<string, string> = {
  low: "hsl(142, 76%, 36%)",
  moderate: "hsl(45, 93%, 47%)",
  high: "hsl(25, 95%, 53%)",
  extreme: "hsl(0, 84%, 60%)",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const sortedCustomers = [...mockCustomers].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do risco de churn da sua base de clientes
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Clientes em Risco"
          value={mockDashboardKPIs.customersAtRisk}
          variation={mockDashboardKPIs.customersAtRiskVariation}
          icon={<Users className="h-5 w-5" />}
          delay={0}
        />
        <KPICard
          title="Receita em Risco (MRR)"
          value={formatCurrency(mockDashboardKPIs.revenueAtRisk)}
          variation={mockDashboardKPIs.revenueAtRiskVariation}
          icon={<DollarSign className="h-5 w-5" />}
          delay={0.1}
        />
        <KPICard
          title="Movimentos de Risco"
          value={`↑${mockDashboardKPIs.movementsUp} ↓${mockDashboardKPIs.movementsDown}`}
          icon={<TrendingUp className="h-5 w-5" />}
          delay={0.2}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Churn Score Evolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Churn Score</CardTitle>
              <CardDescription>Últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChurnScoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "hsl(217, 91%, 60%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Zona de Risco</CardTitle>
              <CardDescription>Total de {mockCustomers.length} clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockRiskDistribution}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="level"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => getRiskLevelLabel(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} clientes`,
                        "Quantidade",
                      ]}
                      labelFormatter={(label) => getRiskLevelLabel(label)}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {mockRiskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={riskColors[entry.level]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Customer Ranking Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Ranking de Clientes por Risco</CardTitle>
            <CardDescription>
              Clientes ordenados por score de risco (maior para menor)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Variação</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Último Snapshot</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <RiskBadge level={customer.riskLevel} />
                    </TableCell>
                    <TableCell>
                      {customer.riskVariation !== 0 ? (
                        <VariationIndicator value={customer.riskVariation} showPercentage={false} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(customer.mrr)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeDate(customer.lastSnapshotAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${customer.id}`);
                        }}
                      >
                        Ver cliente
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
