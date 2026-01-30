import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExecutionLog {
  id: string;
  dateTime: string;
  type: "scheduled" | "manual";
  version: string;
  customersProcessed: number;
  duration: string;
  status: "success" | "error" | "running";
  errorMessage?: string;
  startTime: string;
  endTime: string;
}

const mockLogs: ExecutionLog[] = [
  {
    id: "#001",
    dateTime: "30/01/2026 10:00",
    type: "scheduled",
    version: "v1.0",
    customersProcessed: 10,
    duration: "45s",
    status: "success",
    startTime: "30/01/2026 10:00:00",
    endTime: "30/01/2026 10:00:45",
  },
  {
    id: "#002",
    dateTime: "29/01/2026 10:00",
    type: "scheduled",
    version: "v1.0",
    customersProcessed: 10,
    duration: "52s",
    status: "success",
    startTime: "29/01/2026 10:00:00",
    endTime: "29/01/2026 10:00:52",
  },
  {
    id: "#003",
    dateTime: "28/01/2026 15:30",
    type: "manual",
    version: "v1.0",
    customersProcessed: 1,
    duration: "5s",
    status: "success",
    startTime: "28/01/2026 15:30:00",
    endTime: "28/01/2026 15:30:05",
  },
  {
    id: "#004",
    dateTime: "27/01/2026 10:00",
    type: "scheduled",
    version: "v1.0",
    customersProcessed: 8,
    duration: "38s",
    status: "error",
    errorMessage: "Timeout ao processar cliente ID-007",
    startTime: "27/01/2026 10:00:00",
    endTime: "27/01/2026 10:00:38",
  },
];

const typeLabels: Record<string, string> = {
  scheduled: "Agendado",
  manual: "Manual",
};

export default function AdminLogs() {
  const [logs] = useState<ExecutionLog[]>(mockLogs);
  const [periodFilter, setPeriodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<ExecutionLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isInputOutputOpen, setIsInputOutputOpen] = useState(false);

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    if (searchQuery && !log.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleViewDetails = (log: ExecutionLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
    setIsInputOutputOpen(false);
  };

  const handleReprocess = () => {
    toast.success("Reprocessamento iniciado", {
      description: `Execução ${selectedLog?.id} será reprocessada`,
    });
    setIsDetailOpen(false);
  };

  const getStatusBadge = (status: ExecutionLog["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
            Sucesso
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5" />
            Erro
          </Badge>
        );
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
            Em execução
          </Badge>
        );
    }
  };

  const mockInputOutput = {
    input: {
      model_version: "v1.0",
      customers: ["cust-001", "cust-002", "cust-003"],
      variables: ["logins_30d", "tickets_open", "nps", "mrr"],
    },
    output: {
      processed: 10,
      scores_updated: 10,
      alerts_triggered: 2,
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs de Execução</h1>
        <p className="text-muted-foreground">
          Histórico de execuções do modelo de scoring
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="running">Em execução</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Execuções</CardTitle>
          <CardDescription>
            {filteredLogs.length} execuções encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Clientes</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono font-medium">
                    {log.id}
                  </TableCell>
                  <TableCell>{log.dateTime}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{typeLabels[log.type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.version}</Badge>
                  </TableCell>
                  <TableCell>{log.customersProcessed}</TableCell>
                  <TableCell>{log.duration}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(log)}
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Execução {selectedLog?.id}</DialogTitle>
            <DialogDescription>
              Informações completas sobre esta execução
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono font-medium">{selectedLog.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedLog.status)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Início</p>
                  <p className="font-medium">{selectedLog.startTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fim</p>
                  <p className="font-medium">{selectedLog.endTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-medium">{selectedLog.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant="outline">{typeLabels[selectedLog.type]}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Versão do Modelo</p>
                  <Badge variant="secondary">{selectedLog.version}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Clientes Processados</p>
                  <p className="font-medium">{selectedLog.customersProcessed}</p>
                </div>
              </div>

              {selectedLog.status === "error" && selectedLog.errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    Erro na execução
                  </p>
                  <p className="mt-1 text-sm text-red-600">
                    {selectedLog.errorMessage}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleReprocess}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reprocessar
                  </Button>
                </div>
              )}

              <Collapsible open={isInputOutputOpen} onOpenChange={setIsInputOutputOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    Input/Output
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isInputOutputOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Input</p>
                    <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">
                      {JSON.stringify(mockInputOutput.input, null, 2)}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Output</p>
                    <pre className="rounded-lg bg-muted p-4 text-xs overflow-auto">
                      {JSON.stringify(mockInputOutput.output, null, 2)}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
