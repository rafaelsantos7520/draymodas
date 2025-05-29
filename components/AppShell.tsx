import NavbarCliente from "@/components/cliente/NavbarCliente";
import FooterCliente from "@/components/cliente/FooterCliente";
import { Sidebar } from "@/app/admin/components/sidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { admin } = useAuth();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <NavbarCliente />
      <div className={isAdmin ? "flex min-h-[calc(100vh-64px-64px)]" : ""}>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
      <FooterCliente />
    </>
  );
}
