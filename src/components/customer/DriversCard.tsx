import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";
import { Driver } from "@/types/churn";
import { cn } from "@/lib/utils";

interface DriversCardProps {
  drivers: Driver[];
}

const categoryLabels: Record<string, string> = {
  product: "Produto",
  support: "Suporte",
  financial: "Financeiro",
  engagement: "Engajamento",
};

const categoryColors: Record<string, string> = {
  product: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  support: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  financial: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  engagement: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export function DriversCard({ drivers }: DriversCardProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Top Drivers de Risco
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {drivers.map((driver, index) => (
            <div
              key={driver.id}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50",
                index === 0 && "border-risk-extreme/30 bg-risk-extreme/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    driver.direction === "up"
                      ? "bg-risk-extreme/10 text-risk-extreme"
                      : "bg-risk-low/10 text-risk-low"
                  )}
                >
                  {driver.direction === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{driver.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        categoryColors[driver.category]
                      )}
                    >
                      {categoryLabels[driver.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {driver.impact}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    driver.direction === "up"
                      ? "text-risk-extreme"
                      : "text-risk-low"
                  )}
                >
                  {driver.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  Antes: {driver.previousValue}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
