"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [recentPropostas, setRecentPropostas] = useState<any[]>([]);
  const [userName, setUserName] = useState("Dalton Pereira");
  const [currentDateTime, setCurrentDateTime] = useState<{ fullDate: string; fullTime: string }>({
    fullDate: "",
    fullTime: "",
  });

  // Atualiza relógio ao vivo com Fuso Horário de Brasília (UTC-3)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      };
      const formattedDate = now.toLocaleDateString("pt-BR", optionsDate);
      const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      const timeStr = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setCurrentDateTime({
        fullDate: capitalizedDate,
        fullTime: `${timeStr} (Horário de Brasília - UTC-3)`,
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Carrega usuário cadastrado no onboarding e propostas
  useEffect(() => {
    try {
      const personRaw = localStorage.getItem("destrava_user_person");
      if (personRaw) {
        const parsed = JSON.parse(personRaw);
        if (parsed.nomeCompleto) setUserName(parsed.nomeCompleto);
      } else {
        const companyRaw = localStorage.getItem("destrava_user_company");
        if (companyRaw) {
          const parsedComp = JSON.parse(companyRaw);
          if (parsedComp.nome_fantasia || parsedComp.razao_social) {
            setUserName(parsedComp.nome_fantasia || parsedComp.razao_social);
          }
        }
      }

      const raw = localStorage.getItem("destrava_completed_proposals");
      if (raw) {
        const completed = JSON.parse(raw);
        const mappedCompleted = completed.map((c: any) => ({
          id: c.id,
          nome: c.nome,
          orgao: c.orgao,
          status: c.status || "Em Disputa",
          statusColor: "bg-primary-fixed text-on-primary-fixed border-primary/20 font-bold",
        }));
        setRecentPropostas(mappedCompleted);
      } else {
        setRecentPropostas([]);
      }
    } catch (e) {
      console.error("Erro ao carregar propostas no dashboard", e);
    }
  }, []);

  return (
    <>
      {/* Welcome Header com Relógio ao Vivo e Saudação Personalizada */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
            <span className="material-symbols-outlined text-base animate-pulse">schedule</span>
            <span>{currentDateTime.fullDate} — <strong className="text-on-surface font-bold">{currentDateTime.fullTime}</strong></span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold">
            Olá, {userName}! 👋
          </h1>
          <p className="text-xs text-on-surface-variant">
            Bem-vindo à Plataforma Destrava Proposta Gov. Veja o status das suas licitações ativas abaixo.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/propostas/nova")}
          className="bg-primary hover:opacity-90 text-on-primary font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nova Proposta
        </button>
      </div>



      {/* Action Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-xl">
        {/* Card 1: Nova Proposta */}
        <button 
          onClick={() => router.push("/dashboard/propostas/nova")}
          className="bg-surface-container-lowest p-md rounded-lg shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-surface-variant flex flex-col items-center justify-center text-center gap-sm hover:opacity-80 transition-opacity active:scale-95 hover:scale-105 hover:shadow-md transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold">Nova Proposta</span>
        </button>
        
        {/* Card 2: Lista de Propostas */}
        <button 
          onClick={() => router.push("/dashboard/propostas")}
          className="bg-surface-container-lowest p-md rounded-lg shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-surface-variant flex flex-col items-center justify-center text-center gap-sm hover:opacity-80 transition-opacity active:scale-95 hover:scale-105 hover:shadow-md transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold">Lista de Propostas</span>
        </button>

        {/* Card 3: Simulador Lances */}
        <button 
          onClick={() => router.push("/dashboard/propostas/1/lances")}
          className="bg-surface-container-lowest p-md rounded-lg shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-surface-variant flex flex-col items-center justify-center text-center gap-sm hover:opacity-80 transition-opacity active:scale-95 hover:scale-105 hover:shadow-md transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold">Simulador Lances</span>
        </button>

        {/* Card 4: Checklist & Declarações */}
        <button 
          onClick={() => router.push("/dashboard/checklist")}
          className="bg-surface-container-lowest p-md rounded-lg shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-surface-variant flex flex-col items-center justify-center text-center gap-sm hover:opacity-80 transition-opacity active:scale-95 hover:scale-105 hover:shadow-md transition-transform cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
          </div>
          <span className="font-label-md text-label-md text-on-surface font-semibold">Checklist &amp; Declarações</span>
        </button>
      </div>

      {/* Recent Proposals Section */}
      <div>
        <div className="flex justify-between items-center mb-md">
          <h2 className="font-headline-md text-headline-md font-semibold">Propostas Recentes</h2>
          <Link href="/dashboard/propostas" className="flex items-center gap-xs font-label-md text-label-md text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">
            Ver todas <span className="material-symbols-outlined text-body-sm">chevron_right</span>
          </Link>
        </div>
        <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-surface-variant overflow-hidden p-6">
          {recentPropostas.length === 0 ? (
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">description</span>
              <p className="font-semibold text-sm text-on-surface mb-1">Nenhuma proposta cadastrada no momento.</p>
              <p className="text-xs text-on-surface-variant mb-4">Inicie a criação de uma proposta para visualizar o fluxo completo no sistema.</p>
              <button
                onClick={() => router.push("/dashboard/propostas/nova")}
                className="bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Criar Nova Proposta
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-surface-variant">
              {recentPropostas.map((prop) => (
                <li 
                  key={prop.id} 
                  onClick={() => router.push(`/dashboard/propostas/${prop.id}/lances`)}
                  className="p-md hover:bg-surface-container-low transition-colors flex items-center justify-between min-h-[56px] cursor-pointer"
                >
                  <div>
                    <p className="font-label-md text-label-md mb-1 font-semibold">{prop.nome}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{prop.orgao}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider border ${prop.statusColor}`}>
                      {prop.status}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
