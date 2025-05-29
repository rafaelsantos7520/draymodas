import { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Login Administrativo",
  description: "Faça login para acessar o painel administrativo",
}

export default function LoginPage() {
  return (
        <div className="flex flex-col items-center justify-center">
        <LoginForm />
        </div>
  )
} 