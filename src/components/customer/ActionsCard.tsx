import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ClipboardList, ArrowRight } from "lucide-react";
import { Action } from "@/types/churn";
import { cn } from "@/lib/utils";

interface ActionsCardProps {
  actions: Action[];
  onNewAction?: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
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
  const openCount = pendingActions.length;

  return (
    <Card className="animate-fade-in lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Ações em Andamento
          </CardTitle>
          <CardDescription>
            {openCount} {openCount === 1 ? "ação aberta" : "ações abertas"} para este cliente
          </CardDescription>
        </div>
        <Button size="sm" onClick={onNewAction}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Ação
        </Button>
      </CardHeader>
      <CardContent>
        {pendingActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <ClipboardList className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Nenhuma ação em andamento
            </p>
            <Button variant="outline" size="sm" onClick={onNewAction}>
              <Plus className="mr-1 h-4 w-4" />
              Criar primeira ação
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[140px]">Responsável</TableHead>
                    <TableHead className="w-[100px]">Prazo</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingActions.map((action) => {
                    const status = statusConfig[action.status];
                    const ownerInitials = action.ownerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <TableRow key={action.id} className="hover:bg-muted/30">
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {typeConfig[action.type] || action.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {action.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {ownerInitials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{action.ownerName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(action.dueDate).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("font-normal", status.className)}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/actions" className="text-primary">
                  Ver todas as ações
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
