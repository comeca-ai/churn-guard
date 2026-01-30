

## ChurnAI - Plataforma de Prevenção de Churn

Uma plataforma B2B moderna para prever e prevenir churn de clientes, com dashboards inteligentes, análise de riscos e assistente de IA.

---

### Fase 1: Fundação e Autenticação

**Sistema de Login Multi-tenant**
- Tela de login elegante com email/senha e opção "Esqueci minha senha"
- Fluxo de seleção de organização para usuários com múltiplas empresas
- Sistema RBAC com três perfis: Admin, CS e Liderança

**Layout Base**
- Header moderno com logo, filtros globais e atalhos rápidos
- Sidebar responsiva com navegação contextual baseada no perfil do usuário
- Design system com gradientes sutis, sombras suaves e a paleta de cores definida (azul primário, verde/amarelo/laranja/vermelho para zonas de risco)

---

### Fase 2: Dashboard Global

**Visão Executiva**
- Cards KPI animados: Clientes em Risco, Receita em Risco (MRR), Movimentos de Risco
- Gráfico de linha mostrando evolução do Churn Score nos últimos 12 meses
- Gráfico de distribuição por zona de risco (Baixo/Moderado/Alto/Extremo)

**Ranking de Clientes**
- Tabela interativa com clientes ordenados por risco
- Badges coloridos para cada zona de risco
- Indicadores de variação (↑↓) e última atualização
- Filtros por período e busca por cliente

---

### Fase 3: Página do Cliente

**Perfil Completo do Cliente**
- Header com nome, badge de risco atual, MRR e CSM responsável
- Timeline visual mostrando evolução do score ao longo do tempo
- Bloco de Drivers: top 5 fatores explicando o risco com ícones e impacto

**Métricas e Eventos**
- Cards de indicadores: tickets abertos, último login, status de pagamento, NPS
- Histórico de snapshots e mudanças de zona

**Plano de Ação Resumido**
- Contador de ações em aberto
- Lista das últimas ações com status
- Acesso rápido ao assistente IA contextualizado

---

### Fase 4: Banco de Dados

**Estrutura Supabase**
- Tabelas: organizations, profiles, customers, risk_scores, drivers, actions, alerts
- Sistema de roles com tabela separada (user_roles) para segurança
- Row Level Security (RLS) para isolamento multi-tenant
- Relacionamentos otimizados para queries de dashboard

---

### Fase 5: Assistente IA (Lovable AI)

**Chat Contextual**
- Painel lateral elegante que abre a partir da página do cliente
- Conversa contextualizada com dados do cliente em risco
- Chips de prompts sugeridos: "Por que está em risco?", "O que fazer?", "Resumo executivo"
- Integração com Gemini via Lovable AI para respostas inteligentes

**Ações Inteligentes**
- Quando a IA sugerir ações, botão para criar plano de ação pré-preenchido
- Histórico de conversas por cliente

---

### O que fica para próximas fases

- Plano de Ação completo (lista e formulário)
- Sistema de Alertas e notificações por email
- Área Admin (Usuários, Book de Variáveis, Logs de Execução)
- Integração com providers de email para alertas

---

### Tecnologias

- **Frontend:** React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **IA:** Lovable AI (Gemini) para o assistente
- **Gráficos:** Recharts (já instalado)

