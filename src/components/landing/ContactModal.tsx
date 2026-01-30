import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  company: z
    .string()
    .trim()
    .min(1, "Empresa é obrigatória")
    .max(100, "Empresa deve ter no máximo 100 caracteres"),
  role: z.string().min(1, "Cargo é obrigatório"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "demo" | "waitlist" | "diagnostic";
}

const titles = {
  demo: "Agendar demonstração",
  waitlist: "Entrar na lista de espera",
  diagnostic: "Solicitar diagnóstico",
};

const descriptions = {
  demo: "Preencha seus dados e entraremos em contato para agendar uma demo personalizada.",
  waitlist: "Entre na lista de espera e seja um dos primeiros a testar o ChurnAI.",
  diagnostic: "Solicite um diagnóstico gratuito do seu cenário de churn.",
};

export function ContactModal({ open, onOpenChange, type }: ContactModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For now, just log the data and show success
    console.log("Contact form submitted:", { ...data, type });
    setStatus("success");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after modal closes
    setTimeout(() => {
      form.reset();
      setStatus("idle");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 text-[hsl(var(--success))] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Recebemos seu contato!
            </h3>
            <p className="text-muted-foreground">
              Entraremos em contato em até 24h.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        ) : status === "error" ? (
          <div className="py-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ops, algo deu errado
            </h3>
            <p className="text-muted-foreground">
              Tente novamente ou envie email para contato@churnai.com
            </p>
            <Button
              className="mt-6"
              onClick={() => setStatus("idle")}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{titles[type]}</DialogTitle>
              <DialogDescription>{descriptions[type]}</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email corporativo *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="voce@empresa.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cs">Customer Success</SelectItem>
                          <SelectItem value="revops">Revenue Ops</SelectItem>
                          <SelectItem value="leadership">Liderança</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
