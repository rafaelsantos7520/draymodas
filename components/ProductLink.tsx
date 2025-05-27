"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

interface ProductLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ProductLink({ href, children, className }: ProductLinkProps) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch da página quando o componente montar
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
