import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "Preciso integrar todas as fontes para começar?",
      answer:
        'Não. Você pode começar com as fontes que tiver. O modelo calcula com subset e indica "confiança reduzida" se faltar dados.',
    },
    {
      question: "Como vocês explicam o score?",
      answer:
        "Cada score vem com os principais drivers (fatores) que mais influenciaram, com direção (subiu/desceu) e impacto.",
    },
    {
      question: "Isso substitui meu time de CS?",
      answer:
        "Não. O ChurnAI orienta priorização e dá contexto. A decisão e execução continuam com o time.",
    },
    {
      question: "Quanto tempo para ter o primeiro snapshot?",
      answer:
        "Assim que os dados forem integrados, o primeiro snapshot pode ser gerado em minutos.",
    },
    {
      question: "Como vocês lidam com dados incompletos?",
      answer:
        "O sistema calcula com o que há disponível e sinaliza variáveis ausentes. Conforme mais dados chegam, a confiança aumenta.",
    },
    {
      question: "Vocês treinam um modelo para cada cliente?",
      answer:
        "No MVP usamos um modelo genérico. Modelos customizados por empresa estão no roadmap.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Perguntas frequentes
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
