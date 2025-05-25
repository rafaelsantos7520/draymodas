"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FloatingWhatsApp } from "react-floating-whatsapp";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const res = await axios.get("/api/products/home");
      setProdutos(res.data);
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full py-10 md:py-24 lg:py-32 bg-gradient-to-br from-[#3a5a40] via-[#4a6b50] to-[#2d4a33] text-white overflow-hidden">
          {/* Background decorativo */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <Badge className="bg-white/20 text-white border-white/30 w-fit">
                  ✨ Nova Coleção Disponível
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Dray <span className="text-emerald-300">Modas</span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-[600px] leading-relaxed">
                  Descubra nossa coleção exclusiva de moda feminina. Elegância,
                  estilo e sofisticação para todas as ocasiões especiais da sua
                  vida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/catalogo">
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Ver Catálogo
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Estatísticas */}
                <div className="flex gap-8 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-white/70">Produtos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm text-white/70">
                      Clientes Felizes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm text-white/70 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Avaliação
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center relative">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <Image
                    src="/placeholder.svg?height=600&width=500"
                    alt="Moda Feminina Elegante"
                    width={500}
                    height={600}
                    className="relative rounded-2xl object-cover shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Novo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <Badge variant="outline" className="text-primary border-primary">
                Coleção Especial
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary">
                Destaques da Coleção
              </h2>
              <p className="max-w-[700px] text-gray-600 text-lg leading-relaxed">
                Descubra as peças mais desejadas da nossa coleção, selecionadas
                especialmente para você
              </p>
            </div>

            <div className="flex justify-center w-full">
              <div className="w-full max-w-6xl">
                <Carousel
                  className="w-full relative"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[Autoplay({ delay: 4000 })]}
                >
                  <CarouselContent className="-ml-6">
                    {produtos.map((product, index) => (
                      <CarouselItem
                        key={product.id}
                        className="pl-6 md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white transform hover:-translate-y-2">
                          <Link
                            href={`/produto/${product.id}`}
                            className="absolute inset-0 z-10"
                          >
                            <span className="sr-only">{product.name}</span>
                          </Link>

                          <div className="relative overflow-hidden">
                            <Image
                              src={product.images[0]?.url || "/placeholder.svg"}
                              alt={product.name}
                              width={350}
                              height={450}
                              className="object-cover w-full aspect-[3/4] transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          <div className="p-4 space-y-2">
                            <h3 className="font-semibold text-primary text-lg truncate group-hover:text-emerald-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {product.category?.name || "Sem categoria"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">
                                  (4.9)
                                </span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-lg" />
                  <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-lg" />
                </Carousel>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ver Catálogo Completo
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* Sobre nós - Versão melhorada */}
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
                  elegante e acessível. Há mais de 5 anos, nos dedicamos a
                  trazer as últimas tendências com qualidade excepcional e
                  atendimento personalizado.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold">5+</div>
                    <div className="text-sm text-white/70">
                      Anos de Experiência
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-lg">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm text-white/70">
                      Atendimento Online
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Equipe Dray Modas"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Depoimentos - Versão melhorada */}
        <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="text-primary border-primary mb-4"
              >
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
              {[
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
              ].map((testimonial, index) => (
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
      </main>
      {/* Botão flutuante WhatsApp */}
      <FloatingWhatsApp
        phoneNumber="5527998114944"
        accountName="Dray Modas"
        chatMessage="Olá! Como podemos ajudar você a ficar ainda mais estilosa hoje?"
        statusMessage="Responde normalmente em alguns minutos"
        notificationDelay={15}
      />
    </div>
  );
}
