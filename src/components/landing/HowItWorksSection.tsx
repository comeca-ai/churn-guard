import { Card, CardContent } from "@/components/ui/card";
import { Database, BarChart3, Target } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Database,
      title: "Conecte seus dados",
      description:
        "Integre CRM, suporte, produto e financeiro. O sistema gera snapshots periódicos com todas as variáveis.",
      bullets: ["API ou conectores nativos", "Histórico versionado automaticamente"],
    },
    {
      number: "02",
      icon: BarChart3,
      title: "Calcule risco por cliente",
      description:
        "Modelo gera score de churn (30/60/90 dias) e explica os principais drivers de cada cliente.",
      bullets: [
        "Classificação: Baixo / Moderado / Alto / Extremo",
        "Drivers explicáveis (não caixa-preta)",
      ],
    },
    {
      number: "03",
      icon: Target,
      title: "Aja e registre resultado",
      description:
        "Receba recomendações de ação, execute intervenções e registre receita retida ou perdida.",
      bullets: [
        "Plano de ação por cliente",
        "Ciclo de aprendizado (ação → resultado)",
      ],
    },
  ];

  return (
    <section id="como-funciona" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Do dado à decisão em 3 passos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="bg-card border-border relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-6xl font-bold text-muted/30">
                {step.number}
              </div>
              <CardContent className="pt-6 relative">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
