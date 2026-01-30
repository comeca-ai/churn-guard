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

type ColorStatus = "danger" | "warning" | "success" | "neutral";

const colorClasses: Record<ColorStatus, string> = {
  danger: "text-risk-extreme",
  warning: "text-risk-moderate",
  success: "text-risk-low",
  neutral: "text-foreground",
};

const bgClasses: Record<ColorStatus, string> = {
  danger: "bg-risk-extreme/10 border-risk-extreme/20",
  warning: "bg-risk-moderate/10 border-risk-moderate/20",
  success: "bg-risk-low/10 border-risk-low/20",
  neutral: "bg-muted/50",
};

const paymentStatusConfig: Record<
  string,
  { label: string; status: ColorStatus }
> = {
  current: { label: "Em dia", status: "success" },
  pending: { label: "Pendente", status: "warning" },
  overdue: { label: "Atrasado", status: "danger" },
};

export function MetricsCard({ metrics }: MetricsCardProps) {
  const paymentConfig = paymentStatusConfig[metrics.paymentStatus] || {
    label: metrics.paymentStatus,
    status: "neutral" as ColorStatus,
  };

  // Determine last login status
  const lastLoginDays = metrics.lastLogin
    ? Math.floor((Date.now() - new Date(metrics.lastLogin).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  const lastLoginStatus: ColorStatus = lastLoginDays > 14 ? "danger" : lastLoginDays > 7 ? "warning" : "success";

  // Determine NPS status
  const npsStatus: ColorStatus = 
    metrics.nps === null ? "neutral" :
    metrics.nps >= 7 ? "success" :
    metrics.nps >= 5 ? "warning" : "danger";

  // Determine feature usage status
  const featureRatio = metrics.totalFeatures > 0 ? metrics.featuresUsed / metrics.totalFeatures : 0;
  const featureStatus: ColorStatus = featureRatio < 0.3 ? "danger" : featureRatio < 0.5 ? "warning" : "success";

  const metricItems = [
    {
      icon: TicketCheck,
      label: "Tickets Abertos",
      value: metrics.ticketsOpen.toString(),
      status: (metrics.ticketsOpen > 10 ? "danger" : metrics.ticketsOpen > 5 ? "warning" : "success") as ColorStatus,
    },
    {
      icon: Clock,
      label: "Último Login",
      value: metrics.lastLogin
        ? `${lastLoginDays} dias`
        : "Nunca",
      status: lastLoginStatus,
    },
    {
      icon: CreditCard,
      label: "Status Pagamento",
      value: paymentConfig.label,
      status: paymentConfig.status,
    },
    {
      icon: Star,
      label: "NPS",
      value: metrics.nps?.toString() ?? "N/A",
      status: npsStatus,
    },
    {
      icon: LogIn,
      label: "Logins 30d",
      value: metrics.loginCount30d.toString(),
      status: (metrics.loginCount30d < 5 ? "danger" : metrics.loginCount30d < 15 ? "warning" : "success") as ColorStatus,
    },
    {
      icon: Layers,
      label: "Features Usadas",
      value: `${metrics.featuresUsed}/${metrics.totalFeatures}`,
      status: featureStatus,
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metricItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-1 rounded-lg border p-3 transition-colors",
                bgClasses[item.status]
              )}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </div>
              <div className={cn("text-xl font-bold", colorClasses[item.status])}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
