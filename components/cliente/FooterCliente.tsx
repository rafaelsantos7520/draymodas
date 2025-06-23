"use client";
export default function FooterCliente() {
  return (
    <footer className="w-full bg-gray-800 text-white py-6">
      <div className="container flex flex-col md:flex-row justify-between sm:items-center gap-4 px-4 md:px-6">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold">D`ray Modas</p>
          <p className="text-sm text-white/80">
            Moda feminina com estilo e qualidade
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm text-white/80">
          <p>Rua: Francisco Vieira Passos, Guarapari - ES</p>

          <p>Telefone: (27) 99768-5809</p>
          <p>Email: modasdray@gmail.com</p>
        </div>
        <div className="text-sm text-white/80">
          <p>© 2025 D`ray Modas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
