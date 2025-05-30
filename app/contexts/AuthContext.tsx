"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }
    const fetchAdmin = async () => {
      try {
        const response = await axios.get("/api/admin/profile");
        setAdmin(response.data);
      } catch (error) {
        console.error("Erro ao buscar admin:", error);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdmin();
  }, [pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciais inválidas");
        }
        throw new Error("Erro ao fazer login");
      }

      const data = await response.json();
      setAdmin(data.admin);
      router.push("/admin/dashboard");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setAdmin(null);
      router.push("/admin/login");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
