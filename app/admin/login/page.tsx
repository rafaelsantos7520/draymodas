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

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      setError(
        error.message || "Erro ao fazer login. Verifique suas credenciais."
      );
      toast.error(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex px-4 flex-col md:items-center justify-center">
      <Card className="w-full md:max-w-md  border border-gray-300">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-600 text-center">{error}</div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        disabled={isLoading}
                        {...field}
                      />
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                          onClick={() => setShowPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
