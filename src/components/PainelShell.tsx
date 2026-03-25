"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Home, Users, Building2, GraduationCap, MessageCircle } from "lucide-react";

/*
  NOVA IDENTIDADE VISUAL DO PAINEL
  - Fundo dark premium
  - Gradiente bronze
  - Sidebar elegante
  - Topbar igual LandPage
*/

export default function PainelShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121212]">

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full w-72
          bg-gradient-to-b from-[#2B2523] to-[#1C1917]
          text-white shadow-xl border-r border-[#3D3532]
          p-8 flex flex-col gap-10 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* LOGO / BRANDING */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem Concreto</h1>
          <p className="text-sm opacity-80 mt-1">Consultor BEM</p>
          <div className="mt-4 w-16 h-1 bg-[#C7A58B] rounded-full"></div>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-5 text-lg font-medium">
          <Nav href="/painel" icon={<Home size={20} />}>Painel</Nav>
          <Nav href="/painel/indicacoes" icon={<Users size={20} />}>Indicações</Nav>
          <Nav href="/painel/imoveis" icon={<Building2 size={20} />}>Imóveis</Nav>
          <Nav href="/painel/certificacao" icon={<GraduationCap size={20} />}>Certificação</Nav>
          <Nav href="/painel/suporte" icon={<MessageCircle size={20} />}>Suporte</Nav>
        </nav>

        {/* FOOTER */}
        <div className="mt-auto opacity-70 text-sm">
          Painel Consultor — {new Date().getFullYear()}
        </div>
      </aside>

      {/* BACKDROP (mobile) */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header
          className="
            h-20 px-10 flex items-center justify-between shadow-md
            bg-gradient-to-r from-[#2B2523] to-[#1C1917]
            border-b border-[#3D3532]
          "
        >
          {/* Botão mobile */}
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={28} className="text-white" />
          </button>

          <h2 className="text-2xl font-semibold text-white tracking-tight">Painel</h2>

          {/* Perfil */}
          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="font-medium text-white">Consultor</p>
              <p className="text-xs text-[#C7A58B]">Bem Concreto</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-[#C7A58B] flex items-center justify-center text-black text-lg font-bold">
              C
            </div>
          </div>

        </header>

        {/* MAIN CONTENT */}
        <main className="p-12 text-white">{children}</main>
      </div>
    </div>
  );
}

/* COMPONENTE NAV PREMIUM */
function Nav({ href, children, icon }: { href: string; children: any; icon: any }) {
  return (
    <Link
      href={href}
      className="
        flex items-center gap-3 p-3 rounded-lg
        text-white/90 hover:bg-[#3A312E] hover:text-white transition
      "
    >
      {icon}
      {children}
    </Link>
  );
}