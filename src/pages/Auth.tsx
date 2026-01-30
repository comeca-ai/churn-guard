import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signIn, signUp, resetPassword, user, isLoading: authLoading, isConfigured } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // If Supabase not configured, simulate login
    if (!isConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      navigate("/dashboard");
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      setError(getErrorMessage(error.message));
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isConfigured) {
      toast({
        variant: "destructive",
        title: "Configuração necessária",
        description: "Conecte o Supabase para habilitar o cadastro.",
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (error) {
      setError(getErrorMessage(error.message));
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
      setMode('login');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
      setMode('login');
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(email);

    if (error) {
      setError(getErrorMessage(error.message));
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      });
      setMode('login');
    }

    setIsLoading(false);
  };

  const getErrorMessage = (message: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha inválidos',
      'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
      'User already registered': 'Este email já está cadastrado',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
      'Unable to validate email address: invalid format': 'Formato de email inválido',
    };
    return errorMap[message] || message;
  };

  const getFormConfig = () => {
    switch (mode) {
      case 'signup':
        return {
          title: 'Criar Conta',
          description: 'Preencha os dados para criar sua conta',
          submitText: 'Criar Conta',
          onSubmit: handleSignUp,
        };
      case 'forgot':
        return {
          title: 'Recuperar Senha',
          description: 'Digite seu email para receber o link de recuperação',
          submitText: 'Enviar Link',
          onSubmit: handleForgotPassword,
        };
      default:
        return {
          title: 'Bem-vindo de volta',
          description: 'Entre com suas credenciais para acessar a plataforma',
          submitText: 'Entrar',
          onSubmit: handleLogin,
        };
    }
  };

  const formConfig = getFormConfig();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <span className="text-2xl font-bold text-white">C</span>
          </div>
          <span className="text-3xl font-bold">ChurnAI</span>
        </div>

        {/* Configuration warning */}
        {!isConfigured && (
          <Alert className="mb-4 border-warning/50 bg-warning/10">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              Supabase não configurado. Usando modo de demonstração.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{formConfig.title}</CardTitle>
            <CardDescription>{formConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formConfig.onSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 gradient-primary text-white font-medium shadow-glow hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {formConfig.submitText}
                    {mode === 'login' && <ArrowRight className="ml-2 h-4 w-4" />}
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                {mode === 'login' && (
                  <>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground hover:text-primary"
                      onClick={() => { setMode('forgot'); setError(null); }}
                    >
                      Esqueci minha senha
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Não tem conta?{' '}
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 text-primary"
                        onClick={() => { setMode('signup'); setError(null); }}
                      >
                        Cadastre-se
                      </Button>
                    </div>
                  </>
                )}

                {mode === 'signup' && (
                  <div className="text-sm text-muted-foreground">
                    Já tem conta?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 text-primary"
                      onClick={() => { setMode('login'); setError(null); }}
                    >
                      Faça login
                    </Button>
                  </div>
                )}

                {mode === 'forgot' && (
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => { setMode('login'); setError(null); }}
                  >
                    Voltar para o login
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Precisa de ajuda?{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Contate o suporte
          </a>
        </p>
      </motion.div>
    </div>
  );
}
