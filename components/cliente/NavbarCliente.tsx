"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Menu, Home, ShoppingBag, Info, Mail, LogOut, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const navItems = [
  {
    label: "Início",
    href: "/",
    icon: Home,
  },
  {
    label: "Catálogo",
    href: "/catalogo",
    icon: ShoppingBag,
  },
  {
    label: "Sobre",
    href: "/sobre",
    icon: Info,
  },
  {
    label: "Contato",
    href: "/contato",
    icon: Mail,
  },
]

const adminItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    icon: ShoppingBag,
  },
  {
    label: "Categorias",
    href: "/admin/categorias",
    icon: ShoppingBag,
  },
]

export default function NavbarCliente() {
  const [isOpen, setIsOpen] = useState(false)
  const { admin, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href
  const isAdmin = admin !== null
  const items = isAdmin ? adminItems : navItems

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Desktop Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">Dray Modas</span>
          </Link>
        </div>

        {/* Mobile Layout - Logo e Menu Button */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg">Dray Modas</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              {/* Header do Sidebar */}
              <div className="flex items-center justify-between p-6 border-b">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-xl">Dray Modas</span>
                </Link>
           
              </div>

              {/* Admin Badge */}
              {isAdmin && (
                <div className="p-6 pb-4">
                  <div className="flex items-center space-x-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 px-4 py-3 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Modo Administrador</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">Acesso completo ao sistema</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex-1 overflow-auto px-6">
                <nav className="space-y-2">
                  {items.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-4 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
                          active
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            active ? "text-emerald-600 dark:text-emerald-400" : "",
                          )}
                        />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Footer com Logout */}
              {isAdmin && (
                <>
                  <Separator className="mx-6" />
                  <div className="p-6">
                    <Button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      variant="outline"
                      className="w-full justify-start text-base font-medium h-12 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Sair do Sistema</span>
                    </Button>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 transition-colors hover:text-emerald-400",
                    isActive(item.href) ? "text-emerald-400 font-semibold" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Admin Badge Desktop */}
          {isAdmin && (
            <div className="ml-4 flex items-center space-x-2 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <User className="h-3 w-3" />
              <span>Admin</span>
            </div>
          )}

          {/* Logout Button Desktop */}
          {isAdmin && (
            <Button
              onClick={logout}
              variant="ghost"
              className="ml-4 flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
