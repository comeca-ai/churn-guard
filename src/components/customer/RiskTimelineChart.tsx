import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { RiskScore } from "@/types/churn";

interface RiskTimelineChartProps {
  data: RiskScore[];
}

export function RiskTimelineChart({ data }: RiskTimelineChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.recordedAt).toLocaleDateString("pt-BR", {
      month: "short",
    }),
    score: item.score,
    riskLevel: item.riskLevel,
  }));

  const getRiskColor = (score: number) => {
    if (score >= 80) return "hsl(var(--risk-extreme))";
    if (score >= 60) return "hsl(var(--risk-high))";
    if (score >= 40) return "hsl(var(--risk-moderate))";
    return "hsl(var(--risk-low))";
  };

  // Calculate trend
  const firstScore = chartData[0]?.score || 0;
  const lastScore = chartData[chartData.length - 1]?.score || 0;
  const trend = lastScore - firstScore;

  return (
    <Card className="animate-fade-in lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Evolução do Score de Risco
          </CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className={`h-4 w-4 ${trend > 0 ? 'text-risk-extreme' : 'text-risk-low'}`} />
          <span className={`text-sm font-medium ${trend > 0 ? 'text-risk-extreme' : 'text-risk-low'}`}>
            {trend > 0 ? '+' : ''}{trend} pts
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="riskGradientFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--risk-extreme))" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="hsl(var(--risk-high))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--risk-low))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--risk-low))" />
                  <stop offset="33%" stopColor="hsl(var(--risk-moderate))" />
                  <stop offset="66%" stopColor="hsl(var(--risk-high))" />
                  <stop offset="100%" stopColor="hsl(var(--risk-extreme))" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const score = payload[0].value as number;
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="text-lg font-bold" style={{ color: getRiskColor(score) }}>
                          Score: {score}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Risk zone reference lines */}
              <ReferenceLine
                y={40}
                stroke="hsl(var(--risk-moderate))"
                strokeDasharray="5 5"
                strokeOpacity={0.4}
              />
              <ReferenceLine
                y={60}
                stroke="hsl(var(--risk-high))"
                strokeDasharray="5 5"
                strokeOpacity={0.4}
              />
              <ReferenceLine
                y={80}
                stroke="hsl(var(--risk-extreme))"
                strokeDasharray="5 5"
                strokeOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="score"
                fill="url(#riskGradientFill)"
                stroke="none"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill={getRiskColor(payload.score)}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-risk-low" />
            <span className="text-muted-foreground">Baixo (&lt;40)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-risk-moderate" />
            <span className="text-muted-foreground">Moderado (40-59)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-risk-high" />
            <span className="text-muted-foreground">Alto (60-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-risk-extreme" />
            <span className="text-muted-foreground">Extremo (≥80)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
