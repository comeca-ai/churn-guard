import { TrendingDown, Shield } from "lucide-react";

export function LandingFooter() {
  const navLinks = [
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#produto", label: "Produto" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "#planos", label: "Planos" },
    { href: "#faq", label: "FAQ" },
    { href: "mailto:contato@churnai.com", label: "Contato" },
  ];

  const legalLinks = [
    { href: "#", label: "Termos de Uso" },
    { href: "#", label: "Política de Privacidade" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">ChurnAI</span>
          </a>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Legal links */}
            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-background/50 hover:text-background/70 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* LGPD Badge */}
            <div className="flex items-center gap-2 text-xs text-background/50">
              <Shield className="w-4 h-4" />
              <span>LGPD Ready</span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-background/50">
              © 2026 ChurnAI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
