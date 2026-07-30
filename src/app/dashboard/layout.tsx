"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/dashboard/propostas/nova", icon: "add_circle", label: "Nova Proposta" },
    { href: "/dashboard/propostas", icon: "description", label: "Propostas" },
    { href: "/dashboard/propostas/1/lances", icon: "trending_down", label: "Lances" },
    { href: "/dashboard/checklist", icon: "fact_check", label: "Checklist" },
    { href: "/dashboard/perfil", icon: "person", label: "Perfil" },
  ];

  const [userName, setUserName] = useState("Dalton Pereira");
  const [userInitials, setUserInitials] = useState("DP");

  useEffect(() => {
    try {
      const personRaw = localStorage.getItem("destrava_user_person");
      if (personRaw) {
        const parsed = JSON.parse(personRaw);
        if (parsed.nomeCompleto) {
          setUserName(parsed.nomeCompleto);
          const parts = parsed.nomeCompleto.split(" ");
          const inits = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
          setUserInitials(inits);
          return;
        }
      }
      const companyRaw = localStorage.getItem("destrava_user_company");
      if (companyRaw) {
        const parsedComp = JSON.parse(companyRaw);
        const name = parsedComp.nome_fantasia || parsedComp.razao_social;
        if (name) {
          setUserName(name);
          setUserInitials(name.slice(0, 2).toUpperCase());
        }
      }
    } catch (e) {
      console.error("Erro ao carregar usuário no layout", e);
    }
  }, []);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    if (href === "/dashboard/propostas/nova") {
      return (
        pathname.startsWith("/dashboard/propostas/nova") ||
        pathname.startsWith("/dashboard/propostas/previa") ||
        pathname.startsWith("/dashboard/propostas/declaracoes")
      );
    }
    if (href === "/dashboard/propostas") {
      return pathname === "/dashboard/propostas";
    }
    if (href === "/dashboard/propostas/1/lances") {
      return pathname.includes("/lances");
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 md:pb-8 flex flex-col">
      {/* TopAppBar com navegação completa no Desktop e Mobile */}
      <header className="bg-surface dark:bg-on-background shadow-sm fixed top-0 left-0 w-full z-50 px-4 md:px-8 h-16 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-xs text-primary hover:opacity-80 transition-opacity">
            <span 
              className="material-symbols-outlined text-primary dark:text-primary-fixed-dim text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              gavel
            </span>
            <span className="font-headline-md text-headline-md-mobile font-bold text-primary dark:text-primary-fixed-dim">
              Destrava Proposta Gov
            </span>
          </Link>

          {/* Navigation Links para Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive 
                      ? "bg-primary/10 text-primary font-bold shadow-sm" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
              {userInitials}
            </div>
            <span className="hidden md:inline font-label-md text-sm font-semibold text-on-surface">{userName}</span>
          </Link>
          <Link 
            href="/login" 
            className="text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1"
            title="Sair da Conta"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden md:inline">Sair</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 md:px-6 max-w-7xl mx-auto w-full md:pt-20">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="bg-surface-container-lowest dark:bg-inverse-surface shadow-[0_-4px_20px_rgba(31,41,55,0.05)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-xs py-sm rounded-t-xl md:hidden border-t border-outline-variant/30">
        {navItems.map((item) => {
          const isActive = isItemActive(item.href);
          
          return (
            <Link href={item.href} key={item.href}>
              <button 
                className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-1.5 transition-all duration-150 ${
                  isActive 
                    ? "bg-primary-container text-on-primary-container font-bold" 
                    : "text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-xl ${isActive ? "text-on-primary-container" : "text-primary"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] mt-0.5 ${isActive ? "text-on-primary-container font-bold" : ""}`}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
