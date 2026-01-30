import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onOpenContact: (type: "demo" | "waitlist" | "diagnostic") => void;
}

export function CTASection({ onOpenContact }: CTASectionProps) {
  return (
    <section className="py-20 md:py-28 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para antecipar churn?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Agende uma demonstração ou entre na lista de espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
    </section>
  );
}
