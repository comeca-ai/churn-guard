import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CSVFileConfig {
  key: string;
  label: string;
  description: string;
  order: number;
  requiredBefore?: string;
}

const csvFiles: CSVFileConfig[] = [
  {
    key: "accounts",
    label: "Accounts (Clientes)",
    description: "Base de contas/clientes com nome, indústria, plano e seats. Deve ser importada primeiro.",
    order: 1,
  },
  {
    key: "subscriptions",
    label: "Subscriptions (Assinaturas)",
    description: "Dados de assinatura com MRR, ARR e planos. Atualiza o MRR dos clientes.",
    order: 2,
    requiredBefore: "accounts",
  },
  {
    key: "support_tickets",
    label: "Support Tickets",
    description: "Tickets de suporte com prioridade, tempo de resolução e satisfação. Gera métricas.",
    order: 3,
    requiredBefore: "accounts",
  },
  {
    key: "feature_usage",
    label: "Feature Usage",
    description: "Uso de funcionalidades por assinatura. Gera risk drivers de adoção de produto.",
    order: 4,
    requiredBefore: "accounts",
  },
  {
    key: "churn_events",
    label: "Churn Events",
    description: "Eventos de churn com razão, reembolso e feedback. Gera risk scores.",
    order: 5,
    requiredBefore: "accounts",
  },
];

type ImportStatus = "idle" | "uploading" | "success" | "error";

interface FileState {
  file: File | null;
  status: ImportStatus;
  result?: { inserted?: number; skipped?: number; errors?: string[]; updated?: boolean };
}

export default function AdminDataImport() {
  const [fileStates, setFileStates] = useState<Record<string, FileState>>(
    Object.fromEntries(csvFiles.map(f => [f.key, { file: null, status: "idle" }]))
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateFileState = (key: string, update: Partial<FileState>) => {
    setFileStates(prev => ({ ...prev, [key]: { ...prev[key], ...update } }));
  };

  const handleFileSelect = (key: string, file: File | null) => {
    if (file && !file.name.endsWith(".csv")) {
      toast.error("Selecione um arquivo CSV");
      return;
    }
    updateFileState(key, { file, status: "idle", result: undefined });
  };

  const handleImport = async (config: CSVFileConfig) => {
    const state = fileStates[config.key];
    if (!state.file) return;

    // Check dependency
    if (config.requiredBefore) {
      const depState = fileStates[config.requiredBefore];
      if (depState.status !== "success") {
        toast.error(`Importe "${csvFiles.find(f => f.key === config.requiredBefore)?.label}" primeiro`);
        return;
      }
    }

    updateFileState(config.key, { status: "uploading" });

    try {
      const content = await state.file.text();
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Faça login para importar dados");
        updateFileState(config.key, { status: "error" });
        return;
      }

      const response = await supabase.functions.invoke("import-csv", {
        body: { csv_type: config.key, csv_content: content },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      if (result.error) {
        throw new Error(result.error);
      }

      updateFileState(config.key, { status: "success", result });
      toast.success(`${config.label} importado com sucesso!`, {
        description: `${result.inserted || 0} registros processados`,
      });
    } catch (err: any) {
      updateFileState(config.key, { status: "error", result: { errors: [err.message] } });
      toast.error(`Erro ao importar ${config.label}`, { description: err.message });
    }
  };

  const completedCount = Object.values(fileStates).filter(s => s.status === "success").length;
  const progress = (completedCount / csvFiles.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Importar Dados</h1>
        <p className="text-muted-foreground">
          Faça upload das bases CSV para popular o sistema com dados de clientes, assinaturas, tickets, uso e churn.
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso da importação</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{csvFiles.length} bases</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* File upload cards */}
      <div className="grid gap-4">
        {csvFiles.map((config) => {
          const state = fileStates[config.key];
          const isDepMet = !config.requiredBefore || fileStates[config.requiredBefore]?.status === "success";

          return (
            <Card key={config.key} className={!isDepMet ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {config.label}
                        <Badge variant="outline" className="text-xs">
                          Passo {config.order}
                        </Badge>
                        {state.status === "success" && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {state.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                      </CardTitle>
                      <CardDescription>{config.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    ref={el => { fileInputRefs.current[config.key] = el; }}
                    onChange={e => handleFileSelect(config.key, e.target.files?.[0] || null)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRefs.current[config.key]?.click()}
                    disabled={state.status === "uploading"}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {state.file ? state.file.name : "Selecionar CSV"}
                  </Button>

                  <Button
                    size="sm"
                    disabled={!state.file || state.status === "uploading" || !isDepMet}
                    onClick={() => handleImport(config)}
                  >
                    {state.status === "uploading" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Importar
                  </Button>

                  {state.result && state.status === "success" && (
                    <span className="text-sm text-muted-foreground">
                      {state.result.inserted || 0} inseridos
                      {state.result.skipped ? `, ${state.result.skipped} já existiam` : ""}
                      {state.result.updated ? " (MRR atualizado)" : ""}
                    </span>
                  )}

                  {state.result?.errors && state.result.errors.length > 0 && (
                    <span className="text-sm text-destructive">
                      {state.result.errors[0]}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
