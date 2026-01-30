import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RiskBadge } from "@/components/ui/risk-badge";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Sparkles,
  Trash2,
  ExternalLink,
  FileText,
  HelpCircle,
  Lightbulb,
  ClipboardList,
} from "lucide-react";
import { mockCustomers } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  customerId?: string;
  messages: Message[];
  createdAt: Date;
}

const suggestionChips = [
  { label: "Por que está em risco?", icon: HelpCircle },
  { label: "O que fazer?", icon: Lightbulb },
  { label: "Gerar plano de ação", icon: ClipboardList },
  { label: "Resumo executivo", icon: FileText },
];

// Helper to format relative dates
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias`;
  return date.toLocaleDateString("pt-BR");
}

// Mock conversations
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Análise TechSolutions",
    customerId: "cust-1",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "Por que a TechSolutions está em risco extremo?",
        timestamp: new Date(),
      },
      {
        id: "msg-2",
        role: "assistant",
        content: `A TechSolutions apresenta risco extremo (score 92) devido a múltiplos fatores críticos:

**Principais Drivers:**
1. **Uso da plataforma caiu 45%** - Redução significativa no engajamento
2. **12 tickets de suporte abertos** - 3x acima da média
3. **NPS caiu de 8 para 5** - Indica insatisfação
4. **2 faturas atrasadas** - Sinaliza possível problema financeiro

**Recomendações:**
- Agendar reunião urgente com stakeholder principal
- Oferecer treinamento das novas funcionalidades
- Avaliar possível ajuste comercial

Posso gerar um plano de ação detalhado?`,
        timestamp: new Date(),
      },
    ],
    createdAt: new Date(),
  },
  {
    id: "conv-2",
    title: "Estratégia DataFlow",
    customerId: "cust-2",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "Qual a situação atual da DataFlow?",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "msg-4",
        role: "assistant",
        content: `A DataFlow está em zona de risco **alto** com score 78.

**Situação:**
- MRR: R$ 45.000
- Último login: há 5 dias
- Engajamento em queda moderada

Recomendo atenção especial nas próximas semanas.`,
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "conv-3",
    title: "Revisão Trimestral",
    customerId: undefined,
    messages: [],
    createdAt: new Date(Date.now() - 259200000),
  },
];

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const customerId = searchParams.get("customer");

  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    mockConversations[0]?.id || null
  );
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeCustomer = activeConversation?.customerId
    ? mockCustomers.find((c) => c.id === activeConversation.customerId)
    : customerId
    ? mockCustomers.find((c) => c.id === customerId)
    : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "Nova conversa",
      customerId: customerId || undefined,
      messages: [],
      createdAt: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedConversations = conversations.filter((c) => c.id !== id);
    setConversations(updatedConversations);
    if (activeConversationId === id) {
      setActiveConversationId(updatedConversations[0]?.id || null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeConversationId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Update conversation title if it's the first message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          const newTitle = conv.messages.length === 0 
            ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
            : conv.title;
          return { ...conv, title: newTitle, messages: [...conv.messages, userMessage] };
        }
        return conv;
      })
    );
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: generateMockResponse(content, activeCustomer?.name),
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, aiMessage] }
            : conv
        )
      );
      setIsLoading(false);
    }, 1500);
  };

  const handleChipClick = (label: string) => {
    handleSendMessage(label);
  };

  const handleViewCustomer = () => {
    if (activeCustomer) {
      navigate(`/customers/${activeCustomer.id}`);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-slide-up">
      {/* Sidebar - Conversations (250px) */}
      <Card className="w-[250px] flex-shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm text-muted-foreground mb-3">Conversas</h2>
          <Button onClick={handleNewConversation} className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                onMouseEnter={() => setHoveredConversation(conv.id)}
                onMouseLeave={() => setHoveredConversation(null)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all relative group",
                  activeConversationId === conv.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate flex-1">
                    {conv.title}
                  </span>
                  {hoveredConversation === conv.id && (
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeDate(conv.createdAt)}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col min-w-0">
        {/* Customer Context Card */}
        {activeCustomer && (
          <div className="p-4 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{activeCustomer.name}</p>
                <p className="text-sm text-muted-foreground">
                  MRR: R$ {activeCustomer.mrr.toLocaleString("pt-BR")}
                </p>
              </div>
              <RiskBadge
                level={activeCustomer.riskLevel}
                showScore
                score={activeCustomer.riskScore}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleViewCustomer}>
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Ver cliente
            </Button>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {activeConversation?.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  Olá! Sou o assistente ChurnAI
                </h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Posso ajudar você a entender riscos de churn, sugerir ações de
                  retenção e gerar resumos executivos sobre seus clientes.
                </p>
              </div>
            )}

            {activeConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-foreground">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <p
                    className={cn(
                      "text-xs mt-2",
                      message.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl px-4 py-4 bg-muted">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestion Chips */}
        <div className="px-4 pb-3 flex flex-wrap gap-2 justify-center">
          {suggestionChips.map((chip) => (
            <Button
              key={chip.label}
              variant="outline"
              size="sm"
              onClick={() => handleChipClick(chip.label)}
              className="gap-2 text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <chip.icon className="h-3.5 w-3.5" />
              {chip.label}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function generateMockResponse(question: string, customerName?: string): string {
  const customer = customerName || "o cliente";
  const q = question.toLowerCase();

  if (q.includes("risco") || q.includes("por que")) {
    return `Com base na análise de **${customer}**, identifiquei os seguintes fatores de risco:

**Principais Drivers:**
1. **Uso da plataforma caiu 45%** - Redução significativa no engajamento nos últimos 30 dias
2. **12 tickets de suporte abertos** - Volume 3x acima da média histórica
3. **NPS caiu de 8 para 5** - Indica insatisfação crescente
4. **2 faturas atrasadas** - Sinaliza possível problema financeiro ou desengajamento

**Análise:**
Estes indicadores combinados sugerem um risco elevado de churn nos próximos 30-60 dias. A correlação entre queda de uso e aumento de tickets indica possíveis problemas com o produto ou falta de treinamento adequado.

Posso gerar um plano de ação detalhado para mitigar esses riscos.`;
  }

  if (q.includes("fazer") || q.includes("ação") || q.includes("plano")) {
    return `Para mitigar o risco de churn de **${customer}**, recomendo o seguinte plano de ação:

**Ações Imediatas (Próximos 7 dias):**
- 📞 Agendar call com stakeholder principal
- 🎫 Priorizar resolução dos tickets críticos abertos
- 📊 Enviar relatório de valor entregue no último trimestre

**Ações de Médio Prazo (30 dias):**
- 🎓 Oferecer treinamento sobre novas funcionalidades
- 🤝 Revisar escopo do contrato atual
- 📈 Criar plano de sucesso personalizado

**Métricas de Acompanhamento:**
- Taxa de login semanal
- Tempo de resolução de tickets
- Feedback pós-treinamento

Deseja que eu crie este plano de ação no sistema?`;
  }

  if (q.includes("resumo") || q.includes("executivo")) {
    return `## Resumo Executivo - ${customer}

**Situação Atual:**
| Métrica | Valor | Tendência |
|---------|-------|-----------|
| Score de Risco | 92 | 🔴 Alto |
| MRR | R$ 25.000 | → Estável |
| Engajamento | 45% | 🔻 Queda |
| NPS | 5 | 🔻 Queda |

**Diagnóstico:**
Cliente em zona de risco extremo com múltiplos indicadores negativos. Principal preocupação é a combinação de queda de engajamento com aumento de chamados de suporte.

**Receita em Risco:** R$ 300.000/ano

**Próximos Passos Recomendados:**
1. Contato executivo urgente (C-Level)
2. Plano de recuperação em 14 dias
3. Revisão comercial se necessário

**Probabilidade de Retenção com Ação:** 65%
**Probabilidade de Retenção sem Ação:** 25%`;
  }

  return `Entendi sua pergunta sobre **${customer}**. Com base nos dados disponíveis, posso fornecer análises detalhadas sobre:

- 📊 **Fatores de risco atuais** - Entenda o que está impactando o score
- 📈 **Histórico de engajamento** - Tendências dos últimos meses
- 🎯 **Recomendações de ações** - Estratégias personalizadas de retenção
- 📋 **Resumo executivo** - Visão consolidada para liderança

Por favor, seja mais específico sobre o que gostaria de saber ou clique em uma das sugestões acima.`;
}
