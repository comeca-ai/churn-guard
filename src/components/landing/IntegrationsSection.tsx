export function IntegrationsSection() {
  const integrations = [
    { name: "Salesforce", logo: "SF" },
    { name: "HubSpot", logo: "HS" },
    { name: "Zendesk", logo: "ZD" },
    { name: "Intercom", logo: "IC" },
    { name: "Stripe", logo: "ST" },
    { name: "Segment", logo: "SG" },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Conecta com seu stack
          </h2>
          <p className="text-lg text-muted-foreground">
            Dados de CRM, suporte, produto e financeiro em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto mb-8">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="aspect-square bg-card rounded-xl border border-border flex items-center justify-center hover:shadow-md transition-shadow"
              title={integration.name}
            >
              <span className="text-2xl font-bold text-muted-foreground">
                {integration.logo}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Integração via API ou conectores nativos (em roadmap).
        </p>
      </div>
    </section>
  );
}
