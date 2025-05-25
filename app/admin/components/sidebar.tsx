"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Produtos",
    icon: Package,
    href: "/admin/produtos",
  },
  {
    label: "Configurações",
    icon: Settings,
    href: "/admin/settings",
  },
  {
    label: "Categorias",
    icon: Package,
    href: "/admin/categorias",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  return (
    <div className="flex h-full w-[250px] flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Painel Admin</h2>
        {admin && <p className="text-sm text-muted-foreground">{admin.name}</p>}
      </div>
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
