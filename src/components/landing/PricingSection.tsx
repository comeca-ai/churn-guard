import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingSectionProps {
  onOpenContact: (type: "demo" | "waitlist" | "diagnostic") => void;
}

export function PricingSection({ onOpenContact }: PricingSectionProps) {
  const tiers = [
    "Número de contas monitoradas",
    "Número de usuários (seats)",
    "Fontes de dados conectadas",
    "Frequência de scoring",
  ];

  const addons = [
    "Alertas Slack/Teams",
    "Conectores customizados",
    "Modelo treinado por cliente",
  ];

  return (
    <section id="planos" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Modelo simples, valor claro
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-center">Assinatura SaaS por tiers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground mb-6">
                Baseado em:
              </p>
              
              <ul className="space-y-3 mb-8">
                {tiers.map((tier, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{tier}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-6 mb-8">
                <p className="text-sm font-medium text-foreground mb-4">
                  Add-ons disponíveis:
                </p>
                <ul className="space-y-2">
                  {addons.map((addon, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {addon}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <Button size="lg" onClick={() => onOpenContact("demo")}>
                  Fale com a gente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
