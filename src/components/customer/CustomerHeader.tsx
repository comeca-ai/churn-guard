import { ChevronRight, MessageSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";
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
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to="/customers" className="hover:text-foreground transition-colors">
          Clientes
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">{name}</span>
      </nav>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {/* Name and Badge Row */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{name}</h1>
            <RiskBadge level={riskLevel} showScore score={riskScore} />
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">MRR: </span>
              <span className="font-semibold text-foreground">
                {formatCurrency(mrr)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Score: </span>
              <span className="font-semibold text-foreground">{riskScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Responsável:</span>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {ownerInitials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{ownerName}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
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
    </div>
  );
}
