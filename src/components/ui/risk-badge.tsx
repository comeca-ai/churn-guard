import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { RiskLevel } from "@/types/churn";
import { getRiskLevelLabel } from "@/data/mockData";

const riskBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      level: {
        low: "bg-risk-low text-risk-low-foreground",
        moderate: "bg-risk-moderate text-risk-moderate-foreground",
        high: "bg-risk-high text-risk-high-foreground",
        extreme: "bg-risk-extreme text-risk-extreme-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      level: "low",
      size: "md",
    },
  }
);

export interface RiskBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof riskBadgeVariants> {
  level: RiskLevel;
  showLabel?: boolean;
  showScore?: boolean;
  score?: number;
}

export function RiskBadge({
  className,
  level,
  size,
  showLabel = true,
  showScore = false,
  score,
  ...props
}: RiskBadgeProps) {
  return (
    <div className={cn(riskBadgeVariants({ level, size }), className)} {...props}>
      {showLabel ? getRiskLevelLabel(level) : null}
      {showScore && score !== undefined && (
        <span className="ml-1 font-bold">({score})</span>
      )}
    </div>
  );
}
