import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContatoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-2xl font-bold text-[#3a5a40]">Dray Modas</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-lg font-medium text-muted-foreground hover:text-[#3a5a40]">
              Início
            </Link>
            <Link href="/catalogo" className="text-lg font-medium text-muted-foreground hover:text-[#3a5a40]">
              Catálogo
            </Link>
            <Link href="/sobre" className="text-lg font-medium text-muted-foreground hover:text-[#3a5a40]">
              Sobre
            </Link>
            <Link href="/contato" className="text-lg font-medium text-[#3a5a40]">
              Contato
            </Link>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#3a5a40]">Entre em Contato</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos à disposição para atender você e responder suas dúvidas
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-[#3a5a40]" />
                  <div>
                    <h3 className="text-xl font-bold">Endereço</h3>
                    <p className="text-muted-foreground">Rua Exemplo, 123 - Centro</p>
                    <p className="text-muted-foreground">Cidade - Estado, CEP 12345-678</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-[#3a5a40]" />
                  <div>
                    <h3 className="text-xl font-bold">Telefone</h3>
                    <p className="text-muted-foreground">(00) 12345-6789</p>
                    <p className="text-muted-foreground">(00) 98765-4321</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-[#3a5a40]" />
                  <div>
                    <h3 className="text-xl font-bold">Email</h3>
                    <p className="text-muted-foreground">contato@draymodas.com</p>
                    <p className="text-muted-foreground">atendimento@draymodas.com</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Horário de Funcionamento</h3>
                  <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                  <p className="text-muted-foreground">Sábado: 9h às 13h</p>
                  <p className="text-muted-foreground">Domingo: Fechado</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Envie uma mensagem</h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário abaixo e entraremos em contato o mais breve possível
                  </p>
                </div>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="nome"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Nome
                      </label>
                      <Input id="nome" placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <Input id="email" placeholder="Seu email" type="email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="assunto"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Assunto
                    </label>
                    <Input id="assunto" placeholder="Assunto da mensagem" />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="mensagem"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mensagem
                    </label>
                    <Textarea id="mensagem" placeholder="Sua mensagem" className="min-h-[150px]" />
                  </div>
                  <Button className="w-full bg-[#3a5a40] hover:bg-[#344e38]">Enviar mensagem</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-[#3a5a40] text-white py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-6">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold">Dray Modas</p>
            <p className="text-sm text-white/80">Moda feminina com estilo e qualidade</p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-white/80">
            <p>Endereço: Rua Exemplo, 123 - Centro</p>
            <p>Telefone: (00) 12345-6789</p>
            <p>Email: contato@draymodas.com</p>
          </div>
          <div className="text-sm text-white/80">
            <p>© 2025 Dray Modas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
