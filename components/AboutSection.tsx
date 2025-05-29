import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function AboutSection() {
  return (
    <section className="w-full py-16 bg-primary text-white">
      <div className="container px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 w-fit">
              Nossa História
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold">
              Sobre a Dray Modas
            </h3>
            <p className="text-lg text-white/90 leading-relaxed">
              A Dray Modas nasceu do sonho de democratizar a moda feminina
              elegante e acessível. Há mais de 5 anos, nos dedicamos a trazer as
              últimas tendências com qualidade excepcional e atendimento
              personalizado.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">5+</div>
                <div className="text-sm text-white/70">Anos de Experiência</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg">
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-white/70">Atendimento Online</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Equipe Dray Modas"
              width={300}
              height={400}
              className="rounded-2xl shadow-2xl"
              loading="lazy"
              quality={75}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
