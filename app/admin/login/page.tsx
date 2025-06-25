"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, UserCircle2 } from "lucide-react";

// Schema de validação
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Componente para o campo de senha com toggle de visibilidade
const PasswordField = ({
  field,
  isLoading,
  showPassword,
  onTogglePassword,
}: {
  field: any;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}) => (
  <div className="relative">
    <Input
      placeholder="Digite sua senha"
      type={showPassword ? "text" : "password"}
      disabled={isLoading}
      className="pr-10"
      {...field}
    />
    <button
      type="button"
      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      onClick={onTogglePassword}
      tabIndex={-1}
      disabled={isLoading}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  </div>
);

// Componente para exibir erros
const ErrorMessage = ({ message }: { message: string }) => (
  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-600 text-sm text-center">{message}</p>
  </div>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(values.email, values.password);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      const errorMessage =
        error.message || "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl bg-white/90">
        <CardHeader className="text-center pb-4 flex flex-col items-center gap-2">
          <UserCircle2 className="h-14 w-14 text-brand-primary mb-1" />
          <CardTitle className="text-2xl font-bold text-gray-900">
            Acesso Administrativo
          </CardTitle>
          <p className="text-gray-600 mt-1 text-base">
            Faça login para acessar o painel administrativo
          </p>
        </CardHeader>

        <CardContent className="space-y-6 pt-2 pb-6">
          {error && <ErrorMessage message={error} />}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-primary" />
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          disabled={isLoading}
                          className="bg-white pl-10 rounded-xl  focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 transition text-brand-primary"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium ">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-primary" />
                        <PasswordField
                          field={{
                            ...field,
                            className:
                              "pl-10 rounded-xl border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/30 transition",
                          }}
                          isLoading={isLoading}
                          showPassword={showPassword}
                          onTogglePassword={togglePasswordVisibility}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 font-semibold rounded-xl bg-brand-primary hover:bg-brand-primary/90 transition text-white shadow-md disabled:bg-brand-primary/30 disabled:text-white/60 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
