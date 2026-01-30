import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Sparkles,
  X,
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
  { label: "Por que está em risco?", icon: Sparkles },
  { label: "O que fazer?", icon: Sparkles },
  { label: "Resumo executivo", icon: Sparkles },
];

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
        timestamp: new Date("2026-01-28T10:30:00"),
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "A TechSolutions apresenta risco extremo (score 92) devido a múltiplos fatores críticos:\n\n**Principais drivers:**\n1. **Uso do produto caiu 45%** - Redução significativa no engajamento\n2. **Tickets de suporte aumentaram 3x** - Indica insatisfação\n3. **NPS caiu de 8 para 5** - Detrator potencial\n4. **2 faturas atrasadas** - Problema financeiro\n\n**Recomendação:** Agendar reunião urgente com stakeholder principal.",
        timestamp: new Date("2026-01-28T10:31:00"),
      },
    ],
    createdAt: new Date("2026-01-28T10:30:00"),
  },
  {
    id: "conv-2",
    title: "Estratégia DataFlow",
    customerId: "cust-2",
    messages: [],
    createdAt: new Date("2026-01-27T14:00:00"),
  },
];

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer");

  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(mockConversations[0]?.id || null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
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

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeConversationId) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      )
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

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-slide-up">
      {/* Sidebar - Conversations */}
      <Card className="w-64 flex-shrink-0 flex flex-col">
        <div className="p-3 border-b">
          <Button
            onClick={handleNewConversation}
            className="w-full"
            variant="outline"
          >
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
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  activeConversationId === conv.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {conv.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {conv.createdAt.toLocaleDateString("pt-BR")}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        {/* Customer Context */}
        {activeCustomer && (
          <div className="p-3 border-b flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-sm">{activeCustomer.name}</p>
                <p className="text-xs text-muted-foreground">
                  Contexto do cliente ativo
                </p>
              </div>
            </div>
            <RiskBadge
              level={activeCustomer.riskLevel}
              showScore
              score={activeCustomer.riskScore}
              size="sm"
            />
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {activeConversation?.messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">
                  Olá! Sou o assistente ChurnAI
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Posso ajudar você a entender riscos de churn, sugerir ações de
                  retenção e gerar resumos executivos.
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
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert">
                    {message.content.split("\n").map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-1",
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
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-secondary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-3 bg-muted">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggestion Chips */}
        {activeConversation?.messages.length === 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 justify-center">
            {suggestionChips.map((chip) => (
              <Button
                key={chip.label}
                variant="outline"
                size="sm"
                onClick={() => handleChipClick(chip.label)}
                className="gap-2"
              >
                <chip.icon className="h-3 w-3" />
                {chip.label}
              </Button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
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
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || isLoading}>
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

  if (question.toLowerCase().includes("risco")) {
    return `Com base na análise de ${customer}, identifiquei os seguintes fatores de risco:\n\n**Principais indicadores:**\n• Redução de 45% no uso da plataforma\n• Aumento de 3x nos tickets de suporte\n• NPS caiu 3 pontos\n\nEstes indicadores sugerem insatisfação crescente e possível desengajamento.`;
  }

  if (question.toLowerCase().includes("fazer")) {
    return `Para ${customer}, recomendo as seguintes ações:\n\n**Ações imediatas:**\n1. Agendar reunião com stakeholder principal\n2. Oferecer treinamento sobre novas funcionalidades\n3. Revisar tickets de suporte abertos\n\n**Ações de médio prazo:**\n• Criar plano de sucesso personalizado\n• Considerar ajuste comercial se necessário`;
  }

  if (question.toLowerCase().includes("resumo")) {
    return `**Resumo Executivo - ${customer}**\n\n**Situação:** Risco elevado com tendência de piora\n**MRR em risco:** R$ 25.000\n**Principais preocupações:** Desengajamento e insatisfação com suporte\n\n**Próximos passos recomendados:**\n1. Contato urgente com decisor\n2. Plano de ação em 7 dias\n3. Revisão de contrato se necessário`;
  }

  return `Entendi sua pergunta sobre ${customer}. Com base nos dados disponíveis, posso fornecer análises detalhadas sobre:\n\n• Fatores de risco atuais\n• Histórico de engajamento\n• Recomendações de ações\n\nPor favor, seja mais específico sobre o que gostaria de saber.`;
}
