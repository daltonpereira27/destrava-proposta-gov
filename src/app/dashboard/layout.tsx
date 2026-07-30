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
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  const handleDenyAndExit = () => {
    try {
      localStorage.removeItem("destrava_user_person");
    } catch (e) {}
    window.location.href = "/login";
  };

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
        {/* Card de Aviso LGPD / Versão Piloto & Canal de Dúvidas e Elogios */}
        {!acceptedWarning ? (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 shadow-md transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                  <span className="material-symbols-outlined text-xl font-bold">warning</span>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-sm md:text-base text-amber-950 flex items-center gap-2">
                    ⚠️ Aviso Importante: Versão de Teste (Projeto Piloto)
                  </h3>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    Olá! Muito obrigado por ajudar a testar nosso sistema.
                  </p>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Como esta é uma versão inicial (projeto piloto), pedimos que você <strong>não insira dados pessoais reais</strong> (como CPF, telefone pessoal, endereço de casa ou senhas que você usa em outros lugares).
                  </p>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Para testar se tudo funciona, por favor, <strong>use apenas dados públicos ou inventados</strong> (como CNPJ de empresas reais, e-mails fictícios ou nomes de mentira). Fazemos isso para garantir a sua segurança e respeitar a Lei Geral de Proteção de Dados (<strong>LGPD</strong>). Fique à vontade para explorar e não esqueça de nos contar o que achou!
                  </p>
                </div>
              </div>

              {/* Seção de Dica Extra & Credenciais & E-mail de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-amber-100/90 border border-amber-300/80 p-3 rounded-xl text-xs text-amber-950 space-y-1">
                  <p className="font-bold text-amber-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-700">lightbulb</span>
                    💡 Dica Extra &amp; Acesso de Teste:
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Para cadastros/login, sugerimos usar um e-mail genérico como <code className="bg-amber-200/80 px-1 py-0.5 rounded font-bold text-amber-950">teste@teste.com</code> ou um e-mail temporário apenas para isso.
                  </p>
                  <div className="text-[11px] pt-1 flex flex-wrap gap-x-3 text-amber-950">
                    <span><strong>E-mail Teste:</strong> <code className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-bold">piloto@destrava.com.br</code></span>
                    <span><strong>Senha:</strong> <code className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-bold">123456</code></span>
                  </div>
                </div>

                <div className="bg-white/90 border border-amber-300/90 p-3 rounded-xl text-xs text-amber-950 space-y-1 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-amber-900 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-700">mail</span>
                      📩 Dúvidas &amp; Elogios sobre o Sistema:
                    </p>
                    <p className="text-[11px] text-amber-800">
                      Envie sugestões, dúvidas ou elogios diretamente ao nosso time:
                    </p>
                  </div>
                  <a 
                    href="mailto:duvidaselogios@infortsolucoes.com.br" 
                    className="font-bold text-xs text-primary hover:underline flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 w-fit mt-1"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    duvidaselogios@infortsolucoes.com.br
                  </a>
                </div>
              </div>

              {/* BOTÕES INTERATIVOS DE ACEITE E NEGAR */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-amber-200/80">
                <button
                  onClick={handleDenyAndExit}
                  className="w-full sm:w-auto bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm text-red-600">block</span>
                  Negar e Sair do Sistema
                </button>
                <button
                  onClick={() => setAcceptedWarning(true)}
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Aceitar e Continuar Testando
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Badge Compacto de Confirmação quando Aceito */
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="material-symbols-outlined text-emerald-600 text-base">verified</span>
              <span><strong>Modo Piloto Ativo:</strong> Termos de teste aceitos. Contato: <a href="mailto:duvidaselogios@infortsolucoes.com.br" className="underline font-bold">duvidaselogios@infortsolucoes.com.br</a></span>
            </div>
            <button 
              onClick={() => setAcceptedWarning(false)} 
              className="text-[11px] font-bold text-emerald-700 hover:underline"
            >
              Reexibir Aviso Completo
            </button>
          </div>
        )}

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
