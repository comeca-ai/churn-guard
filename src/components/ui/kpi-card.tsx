import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { VariationIndicator } from "@/components/ui/variation-indicator";
import { motion } from "framer-motion";

interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  variation?: number;
  icon?: React.ReactNode;
  invertVariation?: boolean;
  delay?: number;
}

export function KPICard({
  title,
  value,
  variation,
  icon,
  invertVariation = true,
  delay = 0,
  className,
  ...props
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300",
          "bg-gradient-to-br from-card to-card/80",
          className
        )}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight">{value}</span>
                {variation !== undefined && (
                  <VariationIndicator value={variation} invertColors={invertVariation} />
                )}
              </div>
            </div>
            {icon && (
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      </Card>
    </motion.div>
  );
}
