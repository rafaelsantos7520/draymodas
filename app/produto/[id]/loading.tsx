import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen w-full py-4 md:p-12">
      <main className="flex-1">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar para o catálogo
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start bg-white rounded-lg shadow-md p-4 md:p-8">
            {/* Skeleton para a galeria de imagens */}
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-full aspect-square rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Skeleton para as informações do produto */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-3/4 animate-pulse" />
                <Skeleton className="h-4 w-1/2 animate-pulse" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3 animate-pulse" />
                <Skeleton className="h-4 w-full animate-pulse" />
                <Skeleton className="h-4 w-full animate-pulse" />
                <Skeleton className="h-4 w-2/3 animate-pulse" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-10 w-full animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-6 w-1/4 animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
