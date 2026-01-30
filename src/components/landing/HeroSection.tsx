import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface HeroSectionProps {
  onOpenContact: (type: "demo" | "waitlist" | "diagnostic") => void;
}

export function HeroSection({ onOpenContact }: HeroSectionProps) {
  const benefits = [
    "Priorize clientes por risco real, não por feeling",
    "Entenda os drivers antes de agir",
    "Registre ações e meça receita retida",
  ];

  const audiences = ["Customer Success", "Revenue Ops", "Liderança SaaS"];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Antecipe churn e proteja MRR com decisões baseadas em{" "}
            <span className="text-primary">evidência</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Score de risco 30/60/90 dias + causas-raiz + recomendações de ação
            para o time de CS agir antes do cancelamento.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button
              size="lg"
              onClick={() => onOpenContact("demo")}
              className="text-base px-8"
            >
              Agendar demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onOpenContact("waitlist")}
              className="text-base px-8"
            >
              Entrar na lista de espera
            </Button>
          </div>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="w-4 h-4 text-[hsl(var(--risk-low))] flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Audience Badge */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-muted-foreground">Para quem é:</span>
            {audiences.map((audience) => (
              <Badge key={audience} variant="secondary">
                {audience}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
