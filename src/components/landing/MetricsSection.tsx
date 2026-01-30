import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  ArrowUpDown,
  DollarSign,
  CheckSquare,
  Layers,
} from "lucide-react";

export function MetricsSection() {
  const metrics = [
    {
      icon: PieChart,
      title: "Clientes por zona de risco",
      description: "Baixo / Moderado / Alto / Extremo",
    },
    {
      icon: ArrowUpDown,
      title: "Movimentos de risco",
      description: "Entrou, piorou, melhorou no período",
    },
    {
      icon: DollarSign,
      title: "Receita em risco",
      description: "MRR de clientes Alto + Extremo",
    },
    {
      icon: CheckSquare,
      title: "Ações e eficácia",
      description: "Criadas / concluídas + eficácia por tipo",
    },
    {
      icon: Layers,
      title: "Top drivers",
      description: "Globais e por cliente",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que você acompanha
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-card border-border w-full sm:w-auto sm:min-w-[280px] max-w-sm"
            >
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">
                    {metric.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
