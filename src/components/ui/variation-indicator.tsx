import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface VariationIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  showPercentage?: boolean;
  invertColors?: boolean; // When true, positive is bad (red) and negative is good (green)
}

export function VariationIndicator({
  value,
  showPercentage = true,
  invertColors = true,
  className,
  ...props
}: VariationIndicatorProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const getColorClass = () => {
    if (isNeutral) return "text-muted-foreground";
    if (invertColors) {
      return isPositive ? "text-risk-extreme" : "text-risk-low";
    }
    return isPositive ? "text-risk-low" : "text-risk-extreme";
  };

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div
      className={cn("inline-flex items-center gap-1 text-sm font-medium", getColorClass(), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {showPercentage && (
        <span>
          {isPositive ? "+" : ""}
          {value}%
        </span>
      )}
    </div>
  );
}
