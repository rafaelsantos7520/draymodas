import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Juliana S.",
    text: "Amei as peças, chegaram super rápido e são de ótima qualidade! O atendimento foi excepcional.",
    rating: 5,
    avatar: "👩🏻‍💼",
  },
  {
    name: "Renata M.",
    text: "Atendimento excelente, me ajudaram a escolher o look perfeito para meu casamento!",
    rating: 5,
    avatar: "👩🏽‍🦱",
  },
  {
    name: "Camila F.",
    text: "Recomendo demais! Preço justo, muita variedade e entrega rápida. Já sou cliente fiel!",
    rating: 5,
    avatar: "👩🏼‍🦳",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="text-primary border-primary mb-4">
            Depoimentos
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            O que dizem nossas clientes
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A satisfação das nossas clientes é nossa maior conquista
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-[#3a5a40]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Cliente verificada
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
