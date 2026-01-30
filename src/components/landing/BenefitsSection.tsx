import { Card, CardContent } from "@/components/ui/card";
import {
  ListOrdered,
  Bell,
  LineChart,
  FileSearch,
  RefreshCw,
  Zap,
} from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: ListOrdered,
      title: "Prioridade clara",
      description: "Ranking por risco elimina adivinhação",
    },
    {
      icon: Bell,
      title: "Ação antes do churn",
      description: "Alertas proativos para agir a tempo",
    },
    {
      icon: LineChart,
      title: "Visão executiva",
      description: "Tendência de risco e receita em risco",
    },
    {
      icon: FileSearch,
      title: "Diagnóstico explicável",
      description: "Drivers claros, não caixa-preta",
    },
    {
      icon: RefreshCw,
      title: "Ciclo de aprendizado",
      description: "Ações × resultados por segmento",
    },
    {
      icon: Zap,
      title: "Alertas inteligentes",
      description: "Notificação por mudança de zona",
    },
  ];

  return (
    <section id="beneficios" className="py-20 md:py-28 bg-muted/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Resultados, não promessas
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
