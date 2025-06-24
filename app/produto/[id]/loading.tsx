import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen w-full py-4 md:py-8">
      <main className="flex-1">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-10 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>

          {/* Produto principal skeleton */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start bg-white rounded-lg shadow-md p-4 md:p-8 mb-8">
            {/* Galeria skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-full h-[400px] rounded-lg" />
              <div className="flex gap-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-12 h-12 rounded-md" />
                ))}
              </div>
            </div>

            {/* Detalhes skeleton */}
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-3/4" />
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Tamanhos */}
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-12" />
                  ))}
                </div>
              </div>

              {/* Informações de entrega */}
              <Skeleton className="h-32 w-full rounded-lg" />

              {/* Botão */}
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>

          {/* Produtos relacionados skeleton */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-9 w-20" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
