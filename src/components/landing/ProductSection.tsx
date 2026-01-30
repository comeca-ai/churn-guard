import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, User, MessageSquare } from "lucide-react";

export function ProductSection() {
  const features = [
    {
      icon: LayoutDashboard,
      title: "Dashboard Global",
      description:
        "Distribuição por zona de risco, ranking de clientes, movimentos (subiu/desceu), receita em risco (MRR).",
    },
    {
      icon: User,
      title: "Página do Cliente",
      description:
        "Timeline do score, drivers principais, métricas (tickets, uso, pagamento), ações em andamento.",
    },
    {
      icon: MessageSquare,
      title: "Assistente IA",
      description:
        'Pergunte "por que está em risco?" ou "o que fazer?" e receba diagnóstico + sugestão de plano de ação.',
    },
  ];

  return (
    <section id="produto" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dashboards e assistente que orientam decisão
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                {/* Mockup placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg mb-6 flex items-center justify-center border border-border">
                  <feature.icon className="w-12 h-12 text-primary/50" />
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
