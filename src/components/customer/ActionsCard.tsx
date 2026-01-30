import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Plus, ClipboardList } from "lucide-react";
import { Action } from "@/types/churn";
import { cn } from "@/lib/utils";

interface ActionsCardProps {
  actions: Action[];
  onNewAction?: () => void;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  open: {
    label: "Aberta",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  in_progress: {
    label: "Em andamento",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  completed: {
    label: "Concluída",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
};

const typeConfig: Record<string, string> = {
  meeting: "Reunião",
  training: "Treinamento",
  technical: "Técnico",
  discount: "Desconto",
  other: "Outro",
};

export function ActionsCard({ actions, onNewAction }: ActionsCardProps) {
  const pendingActions = actions.filter((a) => a.status !== "completed");

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Ações em Andamento
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onNewAction}>
          <Plus className="mr-1 h-4 w-4" />
          Nova
        </Button>
      </CardHeader>
      <CardContent>
        {pendingActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhuma ação em andamento
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={onNewAction}>
              <Plus className="mr-1 h-4 w-4" />
              Criar primeira ação
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingActions.map((action) => {
              const status = statusConfig[action.status];
              const ownerInitials = action.ownerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={action.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {typeConfig[action.type] || action.type}
                      </Badge>
                      <Badge className={cn("text-xs", status.className)}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-foreground line-clamp-2">
                      {action.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                            {ownerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{action.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(action.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
