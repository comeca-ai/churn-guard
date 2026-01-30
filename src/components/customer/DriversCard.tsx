import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, AlertTriangle, Package, Headphones, DollarSign, Smile } from "lucide-react";
import { Driver } from "@/types/churn";
import { cn } from "@/lib/utils";

interface DriversCardProps {
  drivers: Driver[];
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  product: { 
    label: "Produto", 
    icon: Package, 
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
  },
  support: { 
    label: "Suporte", 
    icon: Headphones, 
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" 
  },
  financial: { 
    label: "Financeiro", 
    icon: DollarSign, 
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" 
  },
  engagement: { 
    label: "Satisfação", 
    icon: Smile, 
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" 
  },
};

export function DriversCard({ drivers }: DriversCardProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Principais Fatores de Risco
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {drivers.map((driver, index) => {
            const category = categoryConfig[driver.category] || categoryConfig.product;
            const CategoryIcon = category.icon;
            const isNegative = driver.direction === "up"; // up = bad for risk

            return (
              <div
                key={driver.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50",
                  index === 0 && "border-risk-extreme/30 bg-risk-extreme/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Category Icon */}
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", category.color)}>
                    <CategoryIcon className="h-4 w-4" />
                  </div>

                  {/* Driver Info */}
                  <div>
                    <p className="font-medium text-foreground">{driver.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px] px-1.5 py-0", category.color)}
                      >
                        {category.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Direction and Impact */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{driver.impact}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isNegative
                        ? "bg-risk-extreme/10 text-risk-extreme"
                        : "bg-risk-low/10 text-risk-low"
                    )}
                  >
                    {isNegative ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
