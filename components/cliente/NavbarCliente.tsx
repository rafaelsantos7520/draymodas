"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import { Menu, Home, ShoppingBag, Info, Mail, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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
  {
    label: "Logout",
    href: "/admin/logout",
    icon: LogOut,
  },
]

export default function NavbarCliente() {
  const [isOpen, setIsOpen] = useState(false)
  const { admin } = useAuth()
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
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="font-bold text-xl">Dray Modas</span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-emerald-400",
                          isActive(item.href) ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
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

          {/* Admin Badge */}
          {isAdmin && (
            <div className="ml-4 flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <User className="h-3 w-3" />
              <span>Admin</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
