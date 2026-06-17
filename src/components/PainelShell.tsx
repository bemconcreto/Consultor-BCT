"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  Users,
  Building2,
  GraduationCap,
  MessageCircle,
  LogOut,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Corretor = {
  nome: string | null;
  email: string | null;
};

const navigation = [
  { name: "Painel", href: "/painel", icon: Home },
  { name: "Financeiro", href: "/painel/financeiro", icon: Wallet },
  { name: "Indicações", href: "/painel/indicacoes", icon: Users },
  { name: "Imóveis", href: "/painel/imoveis", icon: Building2 },
  { name: "Certificação", href: "/painel/certificacao", icon: GraduationCap },
  { name: "Suporte", href: "/painel/suporte", icon: MessageCircle },
];

export default function PainelShell({
  children,
  corretor,
}: {
  children: React.ReactNode;
  corretor: Corretor;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const nome = corretor.nome || corretor.email?.split("@")[0] || "Consultor";
  const inicial = nome.charAt(0).toUpperCase();

  const isActive = (href: string) =>
    href === "/painel" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen bg-[#F7F8F9]">
      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed md:static top-0 left-0 z-50 h-full w-64 bg-[#101820] text-white",
          "flex flex-col p-4 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* LOGO */}
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            <Image src="/logo-bct.png" alt="Bem Concreto" width={28} height={28} className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight">Bem Concreto</span>
            <span className="text-[10px] font-semibold text-[#CBA35C] uppercase tracking-[0.15em] leading-none mt-0.5">
              Consultor
            </span>
          </div>

          <button
            className="md:hidden ml-auto text-white/70 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-1 mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-[#CBA35C]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto px-3 py-2 text-xs text-white/40">
          Painel Consultor — {new Date().getFullYear()}
        </div>
      </aside>

      {/* BACKDROP (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-[#E5E7EB] bg-white">
          <button
            className="md:hidden text-[#101820]"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight hidden sm:block">
              <p className="text-sm font-semibold text-[#101820]">{nome}</p>
              <p className="text-xs text-[#6B7280]">Consultor</p>
            </div>

            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              {inicial}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Sair"
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
