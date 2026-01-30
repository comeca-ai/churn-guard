import { User, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/data/mockData";
import { RiskLevel } from "@/types/churn";

interface CustomerHeaderProps {
  name: string;
  riskLevel: RiskLevel;
  riskScore: number;
  mrr: number;
  ownerName: string;
  onOpenAssistant?: () => void;
  onNewAction?: () => void;
}

export function CustomerHeader({
  name,
  riskLevel,
  riskScore,
  mrr,
  ownerName,
  onOpenAssistant,
  onNewAction,
}: CustomerHeaderProps) {
  const ownerInitials = ownerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            <RiskBadge level={riskLevel} showScore score={riskScore} />
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              MRR: {formatCurrency(mrr)}
            </span>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {ownerInitials}
                </AvatarFallback>
              </Avatar>
              <span>{ownerName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onOpenAssistant}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Abrir Assistente
        </Button>
        <Button onClick={onNewAction}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ação
        </Button>
      </div>
    </div>
  );
}
