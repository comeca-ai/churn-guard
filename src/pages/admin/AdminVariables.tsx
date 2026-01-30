import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Headphones, DollarSign, FileText, Smile, Save } from "lucide-react";
import { toast } from "sonner";

interface Variable {
  id: string;
  key: string;
  label: string;
  description: string;
  isActive: boolean;
}

interface VariableCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  variables: Variable[];
}

const initialCategories: VariableCategory[] = [
  {
    id: "product",
    name: "Produto",
    icon: Package,
    variables: [
      { id: "logins_30d", key: "logins_30d", label: "Logins (30 dias)", description: "Quantidade de logins nos últimos 30 dias", isActive: true },
      { id: "features_used", key: "features_used", label: "Features Utilizadas", description: "Número de funcionalidades utilizadas", isActive: true },
      { id: "days_since_login", key: "days_since_login", label: "Dias desde último login", description: "Dias desde o último acesso", isActive: true },
      { id: "avg_session", key: "avg_session", label: "Duração média sessão", description: "Tempo médio de sessão em minutos", isActive: false },
    ],
  },
  {
    id: "support",
    name: "Suporte",
    icon: Headphones,
    variables: [
      { id: "tickets_open", key: "tickets_open", label: "Tickets Abertos", description: "Número de tickets de suporte abertos", isActive: true },
      { id: "tickets_30d", key: "tickets_30d", label: "Tickets (30 dias)", description: "Tickets abertos nos últimos 30 dias", isActive: true },
      { id: "avg_response_time", key: "avg_response_time", label: "Tempo médio resposta", description: "Tempo médio de resposta em horas", isActive: false },
      { id: "escalations", key: "escalations", label: "Escalações", description: "Número de escalações", isActive: false },
    ],
  },
  {
    id: "financial",
    name: "Financeiro",
    icon: DollarSign,
    variables: [
      { id: "mrr", key: "mrr", label: "MRR", description: "Receita Recorrente Mensal", isActive: true },
      { id: "payment_delays", key: "payment_delays", label: "Atrasos Pagamento", description: "Número de pagamentos em atraso", isActive: true },
      { id: "days_overdue", key: "days_overdue", label: "Dias em Atraso", description: "Dias desde o vencimento", isActive: true },
    ],
  },
  {
    id: "contract",
    name: "Contrato",
    icon: FileText,
    variables: [
      { id: "contract_age", key: "contract_age", label: "Idade Contrato", description: "Meses desde a assinatura", isActive: true },
      { id: "days_to_renewal", key: "days_to_renewal", label: "Dias para Renovação", description: "Dias até a renovação", isActive: true },
      { id: "downgrade_requests", key: "downgrade_requests", label: "Pedidos Downgrade", description: "Solicitações de downgrade", isActive: false },
    ],
  },
  {
    id: "satisfaction",
    name: "Satisfação",
    icon: Smile,
    variables: [
      { id: "nps", key: "nps", label: "NPS", description: "Net Promoter Score", isActive: true },
      { id: "csat", key: "csat", label: "CSAT", description: "Customer Satisfaction Score", isActive: false },
    ],
  },
];

interface VersionHistory {
  version: string;
  date: string;
  author: string;
  activeCount: number;
}

const versionHistory: VersionHistory[] = [
  { version: "v1.0", date: "30/01/2026", author: "Sistema", activeCount: 12 },
];

export default function AdminVariables() {
  const [categories, setCategories] = useState<VariableCategory[]>(initialCategories);
  const [currentVersion] = useState("v1.0");

  const toggleVariable = (categoryId: string, variableId: string) => {
    setCategories(categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            variables: cat.variables.map((v) =>
              v.id === variableId ? { ...v, isActive: !v.isActive } : v
            ),
          }
        : cat
    ));
  };

  const activeCount = categories.reduce(
    (acc, cat) => acc + cat.variables.filter((v) => v.isActive).length,
    0
  );

  const handleSaveVersion = () => {
    toast.success("Nova versão salva com sucesso!", {
      description: `${activeCount} variáveis ativas na nova versão`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Book de Variáveis</h1>
            <p className="text-muted-foreground">
              Configure as variáveis disponíveis para o modelo de scoring
            </p>
          </div>
          <Badge variant="secondary" className="h-6">
            {currentVersion}
          </Badge>
        </div>
        <Button onClick={handleSaveVersion}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Nova Versão
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const categoryActiveCount = category.variables.filter((v) => v.isActive).length;

          return (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <CardDescription>
                  {categoryActiveCount} de {category.variables.length} ativas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.variables.map((variable) => (
                  <div
                    key={variable.id}
                    className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={variable.id}
                      checked={variable.isActive}
                      onCheckedChange={() => toggleVariable(category.id, variable.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={variable.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {variable.label}
                      </label>
                      <p className="text-xs text-muted-foreground truncate">
                        {variable.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Versões</CardTitle>
          <CardDescription>
            Versões anteriores do book de variáveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versão</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Variáveis Ativas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versionHistory.map((version) => (
                <TableRow key={version.version}>
                  <TableCell>
                    <Badge variant="outline">{version.version}</Badge>
                  </TableCell>
                  <TableCell>{version.date}</TableCell>
                  <TableCell>{version.author}</TableCell>
                  <TableCell>{version.activeCount} variáveis</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
