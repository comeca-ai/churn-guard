import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TicketCheck,
  Clock,
  CreditCard,
  Star,
  LogIn,
  Layers,
} from "lucide-react";
import { CustomerMetrics } from "@/types/churn";
import { formatRelativeDate } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  metrics: CustomerMetrics;
}

const paymentStatusConfig: Record<
  string,
  { label: string; variant: "default" | "destructive" | "secondary" }
> = {
  current: { label: "Em dia", variant: "secondary" },
  pending: { label: "Pendente", variant: "default" },
  overdue: { label: "Atrasado", variant: "destructive" },
};

export function MetricsCard({ metrics }: MetricsCardProps) {
  const paymentConfig = paymentStatusConfig[metrics.paymentStatus] || {
    label: metrics.paymentStatus,
    variant: "secondary" as const,
  };

  const metricItems = [
    {
      icon: TicketCheck,
      label: "Tickets Abertos",
      value: metrics.ticketsOpen,
      color: metrics.ticketsOpen > 5 ? "text-risk-extreme" : "text-foreground",
    },
    {
      icon: Clock,
      label: "Último Login",
      value: metrics.lastLogin
        ? formatRelativeDate(new Date(metrics.lastLogin))
        : "Nunca",
      color: "text-foreground",
    },
    {
      icon: CreditCard,
      label: "Status Pagamento",
      value: (
        <Badge variant={paymentConfig.variant} className="text-xs">
          {paymentConfig.label}
        </Badge>
      ),
      color: "",
    },
    {
      icon: Star,
      label: "NPS",
      value: metrics.nps ?? "N/A",
      color:
        metrics.nps !== null
          ? metrics.nps >= 7
            ? "text-risk-low"
            : metrics.nps >= 5
            ? "text-risk-moderate"
            : "text-risk-extreme"
          : "text-muted-foreground",
    },
    {
      icon: LogIn,
      label: "Logins (30d)",
      value: metrics.loginCount30d,
      color:
        metrics.loginCount30d < 5 ? "text-risk-extreme" : "text-foreground",
    },
    {
      icon: Layers,
      label: "Features Usadas",
      value: `${metrics.featuresUsed}/${metrics.totalFeatures}`,
      color:
        metrics.featuresUsed / metrics.totalFeatures < 0.3
          ? "text-risk-extreme"
          : "text-foreground",
    },
  ];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Métricas do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {metricItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 rounded-lg border p-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </div>
              <div className={cn("text-lg font-semibold", item.color)}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
