import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Rocket } from "lucide-react";

interface SocialProofSectionProps {
  onOpenContact: (type: "demo" | "waitlist" | "diagnostic") => void;
}

export function SocialProofSection({ onOpenContact }: SocialProofSectionProps) {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Times orientados a evidência
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="bg-card border-border border-dashed">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Em breve: cases do piloto
              </h3>
              <p className="text-sm text-muted-foreground">
                Estamos validando com empresas SaaS selecionadas.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Quer ser um dos primeiros?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Entre na lista de espera e participe do programa piloto.
              </p>
              <Button
                variant="outline"
                onClick={() => onOpenContact("waitlist")}
              >
                Entrar na lista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
