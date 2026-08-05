"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import PageFeedbackWidget from "@/components/PageFeedbackWidget";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
  const [sessionExpired, setSessionExpired] = useState(false);

  const loadUser = () => {
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
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("user_name_updated", loadUser);
    return () => window.removeEventListener("user_name_updated", loadUser);
  }, []);

  // TEMPORIZADOR DE INATIVIDADE DE 10 MINUTOS (600.000 ms)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 Minutos

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSessionExpired(true);
      }, INACTIVITY_LIMIT_MS);
    };

    // Eventos que resetam a inatividade
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer));

    resetTimer(); // Inicia o temporizador ao carregar

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, []);

  const handleConfirmSessionExit = () => {
    setSessionExpired(false);
    router.push("/login");
  };

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
      {/* MODAL DE SESSÃO EXPIRADA POR 10 MINUTOS DE INATIVIDADE */}
      {sessionExpired && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-blue-200 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-3xl">timer_off</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Sessão Expirada por Inatividade
            </h3>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Você esteve inativo por <strong>10 minutos</strong>. Por motivos de segurança dos dados da sua empresa, a sessão foi temporariamente bloqueada.
            </p>
            <button
              onClick={handleConfirmSessionExit}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">lock_open</span>
              <span>Reconectar ao Sistema</span>
            </button>
          </div>
        </div>
      )}

      {/* TopAppBar com navegação completa no Desktop e Mobile */}
      <header className="bg-surface dark:bg-on-background shadow-sm fixed top-0 left-0 w-full z-50 px-4 md:px-8 h-16 flex items-center justify-between border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span 
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                gavel
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base md:text-lg tracking-tight text-blue-700 uppercase leading-none">
                DESTRAVA PROPOSTA GOV
              </span>
              <span className="text-[9px] font-bold text-blue-600 tracking-wider">
                VERSÃO 0.1 SAAS WHITE LABEL
              </span>
            </div>
          </Link>

          {/* Links Principais no Desktop */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-primary-container text-on-primary-container shadow-xs"
                        : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                    }`}
                  >
                    <span 
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Perfil e Ações no Topo */}
        <div className="flex items-center gap-3">
          {/* Usuário logado */}
          <div className="flex items-center gap-2.5 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant/30">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-xs">
              {userInitials}
            </div>
            <span className="text-xs font-bold text-on-surface hidden sm:inline max-w-[140px] truncate" title={userName}>
              {userName}
            </span>
          </div>

          <Link href="/login" className="text-xs font-bold text-error hover:bg-error/10 p-2 rounded-lg transition-colors flex items-center gap-1" title="Sair do sistema">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden md:inline">Sair</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 md:px-6 max-w-7xl mx-auto w-full md:pt-20">
        {children}

        {/* Componente Universal de Feedback e Comentários do Módulo */}
        <PageFeedbackWidget />
      </main>

      {/* BottomNavBar (Mobile App Experience) */}
      <nav className="bg-white/95 dark:bg-inverse-surface backdrop-blur-md shadow-[0_-4px_25px_rgba(0,0,0,0.1)] fixed bottom-0 left-0 w-full z-[99] flex justify-between items-center px-2 py-2 rounded-t-2xl md:hidden border-t border-outline-variant/30">
        {navItems.map((item) => {
          const isActive = isItemActive(item.href);
          
          return (
            <Link href={item.href} key={item.href} className="flex-1 min-w-0">
              <button 
                className={`w-full flex flex-col items-center justify-center rounded-xl py-1.5 px-1 transition-all duration-150 ${
                  isActive 
                    ? "bg-blue-700 text-white font-bold shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-xl ${isActive ? "text-white" : "text-blue-700"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={`text-[10px] mt-0.5 truncate w-full text-center ${isActive ? "text-white font-bold" : "text-on-surface-variant"}`}>
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
