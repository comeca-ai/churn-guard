import { Card, CardContent } from "@/components/ui/card";
import { Calendar, TrendingDown, Headphones, UserPlus } from "lucide-react";

export function UseCasesSection() {
  const useCases = [
    {
      icon: Calendar,
      title: "Renovação em risco",
      description:
        "Cliente com contrato vencendo e score subindo. O sistema alerta e sugere reunião de retenção.",
    },
    {
      icon: TrendingDown,
      title: "Adoção caiu",
      description:
        "Uso do produto despencou nas últimas semanas. Drivers mostram features abandonadas. Recomenda treinamento.",
    },
    {
      icon: Headphones,
      title: "Suporte virou gargalo",
      description:
        "Tickets abertos acima da média + NPS caindo. Ação sugerida: escalação técnica + QBR.",
    },
    {
      icon: UserPlus,
      title: "Cliente novo sem baseline",
      description:
        'Ainda não há histórico suficiente. Sistema indica "baseline insuficiente" e recomenda coletar mais dados.',
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cenários do dia a dia
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useCase.description}
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
