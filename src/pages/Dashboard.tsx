import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { KPICard } from "@/components/ui/kpi-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { VariationIndicator } from "@/components/ui/variation-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import type { RiskZone } from "@/types/database";

const riskColors: Record<string, string> = {
  low: "hsl(142, 76%, 36%)",
  moderate: "hsl(45, 93%, 47%)",
  high: "hsl(25, 95%, 53%)",
  extreme: "hsl(0, 84%, 60%)",
};

const riskLabels: Record<string, string> = {
  low: "Baixo",
  moderate: "Moderado",
  high: "Alto",
  extreme: "Extremo",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["dashboard-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, mrr, risk_score, risk_zone, risk_variation, last_snapshot_at")
        .order("risk_score", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    },
  });

  const { data: riskScores } = useQuery({
    queryKey: ["dashboard-risk-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("risk_scores")
        .select("score, created_at")
        .order("created_at", { ascending: true })
        .limit(1000);
      if (error) throw error;
      return data as { score: number; created_at: string }[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const allCustomers = customers || [];

  // KPIs
  const atRisk = allCustomers.filter(c => c.risk_zone === "high" || c.risk_zone === "extreme");
  const revenueAtRisk = atRisk.reduce((sum, c) => sum + Number(c.mrr), 0);
  const movementsUp = allCustomers.filter(c => Number(c.risk_variation) > 0).length;
  const movementsDown = allCustomers.filter(c => Number(c.risk_variation) < 0).length;

  // Risk distribution
  const riskDistribution = (["low", "moderate", "high", "extreme"] as const).map(level => ({
    level,
    count: allCustomers.filter(c => c.risk_zone === level).length,
  }));

  // Score history - aggregate by month
  const scoreHistory = (() => {
    if (!riskScores || riskScores.length === 0) return [];
    const byMonth = new Map<string, { sum: number; count: number }>();
    for (const rs of riskScores) {
      const month = rs.created_at.slice(0, 7); // YYYY-MM
      const entry = byMonth.get(month) || { sum: 0, count: 0 };
      entry.sum += Number(rs.score);
      entry.count++;
      byMonth.set(month, entry);
    }
    return [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, { sum, count }]) => ({
        month: new Date(month + "-01").toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
        score: Math.round(sum / count),
      }));
  })();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do risco de churn da sua base de clientes
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Clientes em Risco"
          value={atRisk.length}
          icon={<Users className="h-5 w-5" />}
          delay={0}
        />
        <KPICard
          title="Receita em Risco (MRR)"
          value={formatCurrency(revenueAtRisk)}
          icon={<DollarSign className="h-5 w-5" />}
          delay={0.1}
        />
        <KPICard
          title="Movimentos de Risco"
          value={`↑${movementsUp} ↓${movementsDown}`}
          icon={<TrendingUp className="h-5 w-5" />}
          delay={0.2}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Churn Score</CardTitle>
              <CardDescription>Média mensal dos scores de risco</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {scoreHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Line type="monotone" dataKey="score" stroke="hsl(217, 91%, 60%)" strokeWidth={3} dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Importe dados de churn para visualizar o gráfico
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Distribuição por Zona de Risco</CardTitle>
              <CardDescription>Total de {allCustomers.length} clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDistribution} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="level" tick={{ fontSize: 12 }} tickFormatter={(v) => riskLabels[v] || v} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: number) => [`${value} clientes`, "Quantidade"]} labelFormatter={(l) => riskLabels[l] || l} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {riskDistribution.map((entry, index) => (
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Ranking de Clientes por Risco</CardTitle>
            <CardDescription>Clientes ordenados por score de risco (maior para menor)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Variação</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCustomers.slice(0, 20).map((customer) => (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <RiskBadge level={customer.risk_zone as any} />
                    </TableCell>
                    <TableCell className="font-mono">{Math.round(Number(customer.risk_score))}</TableCell>
                    <TableCell>
                      {Number(customer.risk_variation) !== 0 ? (
                        <VariationIndicator value={Number(customer.risk_variation)} showPercentage={false} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(Number(customer.mrr))}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.id}`); }}>
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
