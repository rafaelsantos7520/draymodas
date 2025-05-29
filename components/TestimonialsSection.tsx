import { Heart, Truck, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "./ui/card";
import { Card } from "./ui/card";

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
          <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher a Dray Modas?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Oferecemos a melhor experiência em moda feminina com qualidade e estilo únicos.
              </p>
            </div>
  
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Qualidade Premium</h3>
                  <p className="text-gray-600">
                    Selecionamos apenas os melhores tecidos e materiais para garantir durabilidade e conforto.
                  </p>
                </CardContent>
              </Card>
  
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Entrega Rápida</h3>
                  <p className="text-gray-600">
                    Receba suas peças favoritas em casa com entrega expressa em todo o Brasil.
                  </p>
                </CardContent>
              </Card>
  
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Compra Segura</h3>
                  <p className="text-gray-600">
                    Suas informações estão protegidas com a mais alta tecnologia de segurança.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

  );
}
