import { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Login Administrativo",
  description: "Faça login para acessar o painel administrativo",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
} 