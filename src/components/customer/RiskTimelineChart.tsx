import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Evolução do Score de Risco
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0}
                  />
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
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const score = payload[0].value as number;
                    return (
                      <div className="rounded-lg border bg-card p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score:{" "}
                          <span style={{ color: getRiskColor(score) }}>
                            {score}
                          </span>
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
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={60}
                stroke="hsl(var(--risk-high))"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              <ReferenceLine
                y={80}
                stroke="hsl(var(--risk-extreme))"
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={getRiskColor(payload.score)}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-risk-low" />
            <span className="text-muted-foreground">Baixo (&lt;40)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-risk-moderate" />
            <span className="text-muted-foreground">Moderado (40-59)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-risk-high" />
            <span className="text-muted-foreground">Alto (60-79)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-risk-extreme" />
            <span className="text-muted-foreground">Extremo (≥80)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
