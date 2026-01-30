import { Card, CardContent } from "@/components/ui/card";
import { Shuffle, Database, TrendingDown, RefreshCw } from "lucide-react";

export function ProblemSection() {
  const problems = [
    {
      icon: Shuffle,
      title: "Iniciativas demais",
      description: "Prioridade muda toda semana sem critério claro",
    },
    {
      icon: Database,
      title: "Dados existem, decisão não",
      description: "CRM, suporte, produto, financeiro... mas não viram ação",
    },
    {
      icon: TrendingDown,
      title: "Previsão fraca",
      description: "Sem leitura do funil de retenção, ajustes são lentos",
    },
    {
      icon: RefreshCw,
      title: "Repetição de erro",
      description: "Sem ciclo de teste, mesmas falhas acontecem",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que churn ainda pega times de surpresa?
          </h2>
          <p className="text-lg text-muted-foreground">
            Não é falta de esforço. É falta de foco e leitura.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
