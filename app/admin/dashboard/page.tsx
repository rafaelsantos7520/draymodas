"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Tag, TrendingUp, Users } from "lucide-react";

const recentSales = [
  { name: "Olivia Martin", email: "olivia@email.com", value: 1999 },
  { name: "Jackson Lee", email: "jackson@email.com", value: 39 },
  { name: "Isabella Nguyen", email: "isabella@email.com", value: 299 },
  { name: "William Kim", email: "will@email.com", value: 99 },
  { name: "Sofia Davis", email: "sofia@email.com", value: 39 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSales: 12500, // mock
    totalCustomers: 45, // mock
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats((prev) => ({
          ...prev,
          totalProducts: data.totalProducts,
          totalCategories: data.totalCategories,
        }));
      } catch (e) {
        // Em produção, mostrar erro amigável
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-white min-h-screen w-full">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">
        Visão geral do sistema e estatísticas principais.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gray-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Total de Produtos
            </CardTitle>
            <div className="rounded-full bg-blue-100 p-2">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? (
                <span className="animate-pulse text-gray-300">...</span>
              ) : (
                stats.totalProducts
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">+10 este mês</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Categorias</CardTitle>
            <div className="rounded-full bg-green-100 p-2">
              <Tag className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? (
                <span className="animate-pulse text-gray-300">...</span>
              ) : (
                stats.totalCategories
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">+2 este mês</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              Vendas Totais
            </CardTitle>
            <div className="rounded-full bg-yellow-100 p-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {stats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">+R$ 1.200 este mês</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Clientes</CardTitle>
            <div className="rounded-full bg-purple-100 p-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">+5 este mês</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 flex items-center justify-center text-gray-400">
              {/* Aqui pode entrar um gráfico futuramente */}
              <span>Gráfico de vendas (em breve)</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Vendas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-100">
              {recentSales.map((sale, idx) => (
                <li
                  key={idx}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">{sale.name}</p>
                    <p className="text-xs text-gray-500">{sale.email}</p>
                  </div>
                  <span className="font-semibold text-green-600">
                    +R$ {sale.value.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
