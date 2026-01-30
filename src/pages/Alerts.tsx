import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Plus,
  Trash2,
  Mail,
  Zap,
  Users,
  User as UserIcon,
  X,
} from "lucide-react";
import { mockCustomers } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  name: string;
  trigger: "to_high" | "to_extreme" | "any_increase";
  scope: "all" | "specific";
  customerId?: string;
  channel: "email";
  recipients: string[];
  frequency: "immediate" | "daily" | "weekly";
  isActive: boolean;
}

const triggerLabels: Record<string, string> = {
  to_high: "Mudou para Alto",
  to_extreme: "Mudou para Extremo",
  any_increase: "Qualquer aumento",
};

const frequencyLabels: Record<string, string> = {
  immediate: "Imediato",
  daily: "Diário",
  weekly: "Semanal",
};

// Mock alerts
const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    name: "Alerta Risco Extremo",
    trigger: "to_extreme",
    scope: "all",
    channel: "email",
    recipients: ["carlos.silva@techcorp.com", "ana.costa@techcorp.com"],
    frequency: "immediate",
    isActive: true,
  },
  {
    id: "alert-2",
    name: "Monitor TechSolutions",
    trigger: "any_increase",
    scope: "specific",
    customerId: "cust-1",
    channel: "email",
    recipients: ["ana.costa@techcorp.com"],
    frequency: "daily",
    isActive: true,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState<string>("");
  const [scope, setScope] = useState<string>("all");
  const [customerId, setCustomerId] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState("");
  const [frequency, setFrequency] = useState<string>("immediate");

  const handleToggleActive = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const handleDelete = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleAddRecipient = () => {
    if (newRecipient && !recipients.includes(newRecipient)) {
      setRecipients([...recipients, newRecipient]);
      setNewRecipient("");
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleSave = () => {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      name,
      trigger: trigger as Alert["trigger"],
      scope: scope as Alert["scope"],
      customerId: scope === "specific" ? customerId : undefined,
      channel: "email",
      recipients,
      frequency: frequency as Alert["frequency"],
      isActive: true,
    };
    setAlerts([...alerts, newAlert]);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setTrigger("");
    setScope("all");
    setCustomerId("");
    setRecipients([]);
    setNewRecipient("");
    setFrequency("immediate");
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground">
            Configure notificações para mudanças de risco
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Alerta
          </Button>
        )}
      </div>

      {/* Existing Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => {
          const customer = alert.customerId
            ? mockCustomers.find((c) => c.id === alert.customerId)
            : null;

          return (
            <Card
              key={alert.id}
              className={cn(
                "transition-opacity",
                !alert.isActive && "opacity-60"
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        alert.isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{alert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {triggerLabels[alert.trigger]}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={() => handleToggleActive(alert.id)}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {alert.scope === "all" ? (
                      <>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Todos os clientes
                        </span>
                      </>
                    ) : (
                      <>
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {customer?.name || "Cliente específico"}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {alert.recipients.length} destinatário(s)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {frequencyLabels[alert.frequency]}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(alert.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Alert Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Criar Novo Alerta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Alerta</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alerta Risco Extremo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trigger">Gatilho</Label>
                <Select value={trigger} onValueChange={setTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to_high">Mudou para Alto</SelectItem>
                    <SelectItem value="to_extreme">
                      Mudou para Extremo
                    </SelectItem>
                    <SelectItem value="any_increase">
                      Qualquer aumento
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scope">Escopo</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o escopo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os clientes</SelectItem>
                    <SelectItem value="specific">Cliente específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scope === "specific" && (
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Canal</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Email</span>
                <Badge variant="secondary" className="ml-auto">
                  Padrão
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destinatários</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="email@exemplo.com"
                  onKeyPress={(e) => e.key === "Enter" && handleAddRecipient()}
                />
                <Button variant="outline" onClick={handleAddRecipient}>
                  Adicionar
                </Button>
              </div>
              {recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipients.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {email}
                      <button
                        onClick={() => handleRemoveRecipient(email)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Imediato</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name || !trigger || recipients.length === 0}
              >
                Salvar Alerta
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {alerts.length === 0 && !isCreating && (
        <Card className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Nenhum alerta configurado</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Configure alertas para ser notificado quando clientes mudarem de
              zona de risco.
            </p>
            <Button className="mt-4" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar primeiro alerta
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
