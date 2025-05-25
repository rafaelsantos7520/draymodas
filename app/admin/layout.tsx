"use client";
import { redirect } from "next/navigation";
import { Sidebar } from "./components/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = useAuth();
  const pathname = usePathname();


  if (!admin && pathname !== "/admin/login") {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1>Você não está autenticado</h1>
        <Link className="text-blue-500" href="/admin/login">
          Faça login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {admin && <Sidebar />}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
