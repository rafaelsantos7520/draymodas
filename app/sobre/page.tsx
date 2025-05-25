import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function SobrePage() {
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
            <Link href="/sobre" className="text-lg font-medium text-[#3a5a40]">
              Sobre
            </Link>
            <Link href="/contato" className="text-lg font-medium text-muted-foreground hover:text-[#3a5a40]">
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
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#3a5a40]">
                  Sobre a Dray Modas
                </h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                  A Dray Modas nasceu do sonho de oferecer moda feminina com qualidade, estilo e preços acessíveis.
                </p>
                <div className="mt-8 space-y-4">
                  <p>
                    Fundada em 2025, nossa loja tem se dedicado a selecionar as melhores peças para compor o
                    guarda-roupa da mulher moderna, que busca conforto sem abrir mão da elegância.
                  </p>
                  <p>
                    Trabalhamos com fornecedores cuidadosamente selecionados, garantindo a qualidade de cada peça que
                    oferecemos em nosso catálogo.
                  </p>
                  <p>
                    Nossa missão é valorizar a beleza feminina através de peças que se adaptam aos diversos estilos e
                    ocasiões, sempre atentos às tendências do mercado da moda.
                  </p>
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-[#3a5a40]">Nossos Valores</h2>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3a5a40]" />
                      <span>Qualidade em cada detalhe</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3a5a40]" />
                      <span>Atendimento personalizado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3a5a40]" />
                      <span>Compromisso com a satisfação das clientes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#3a5a40]" />
                      <span>Responsabilidade social e ambiental</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Loja Dray Modas"
                  width={500}
                  height={600}
                  className="rounded-lg object-cover"
                />
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
