import Image from "next/image";

export default function SobrePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b  mx-auto w-full">
      <main className="flex-1">
        <section className="w-full py-8 md:py-16 lg:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-emerald-800">
                  Sobre a Dray Modas
                </h1>
                <p className="text-lg md:text-xl text-emerald-700">
                  A Dray Modas nasceu do sonho de oferecer moda feminina com
                  qualidade, estilo e preços acessíveis.
                </p>
                <div className="space-y-4 text-emerald-600">
                  <p>
                    Fundada em 2025, nossa loja tem se dedicado a selecionar as
                    melhores peças para compor o guarda-roupa da mulher moderna,
                    que busca conforto sem abrir mão da elegância.
                  </p>
                  <p>
                    Trabalhamos com fornecedores cuidadosamente selecionados,
                    garantindo a qualidade de cada peça que oferecemos em nosso
                    catálogo.
                  </p>
                  <p>
                    Nossa missão é valorizar a beleza feminina através de peças
                    que se adaptam aos diversos estilos e ocasiões, sempre
                    atentos às tendências do mercado da moda.
                  </p>
                </div>
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-emerald-800">
                    Nossos Valores
                  </h2>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-emerald-700">
                        Qualidade em cada detalhe
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-emerald-700">
                        Atendimento personalizado
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-emerald-700">
                        Compromisso com a satisfação das clientes
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-emerald-700">
                        Responsabilidade social e ambiental
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="relative w-full max-w-[500px] aspect-[5/6] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=600&width=500"
                    alt="Loja Dray Modas"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
