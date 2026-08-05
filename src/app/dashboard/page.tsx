"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [recentPropostas, setRecentPropostas] = useState<any[]>([]);
  const [userName, setUserName] = useState("Dalton Pereira");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameInput, setEditingNameInput] = useState("");

  const [currentDateTime, setCurrentDateTime] = useState<{ fullDate: string; fullTime: string }>({
    fullDate: "",
    fullTime: "",
  });

  // Variação do Indicador de Progresso (1: Checkboxes | 2: Numerado)
  const [progressVariation, setProgressVariation] = useState<1 | 2>(1);

  // Estados dos Checkboxes da Variação 1
  const [chkEmpresa, setChkEmpresa] = useState(true);
  const [chkEdital, setChkEdital] = useState(true);
  const [chkProdutos, setChkProdutos] = useState(true);
  const [chkRevisao, setChkRevisao] = useState(true);
  const [chkGerarPdf, setChkGerarPdf] = useState(false);

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
  const loadUserData = () => {
    try {
      const personRaw = localStorage.getItem("destrava_user_person");
      if (personRaw) {
        const parsed = JSON.parse(personRaw);
        if (parsed.nomeCompleto) {
          setUserName(parsed.nomeCompleto);
          setEditingNameInput(parsed.nomeCompleto);
          return;
        }
      }
      
      const companyRaw = localStorage.getItem("destrava_user_company");
      if (companyRaw) {
        const parsedComp = JSON.parse(companyRaw);
        if (parsedComp.nome_fantasia || parsedComp.razao_social) {
          const compName = parsedComp.nome_fantasia || parsedComp.razao_social;
          setUserName(compName);
          setEditingNameInput(compName);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar nome de usuário", e);
    }
  };

  useEffect(() => {
    loadUserData();

    try {
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

  // Salvar alteração do Nome do Responsável
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNameInput.trim()) return;

    try {
      const existingPerson = localStorage.getItem("destrava_user_person");
      const personObj = existingPerson ? JSON.parse(existingPerson) : {};
      personObj.nomeCompleto = editingNameInput.trim();
      localStorage.setItem("destrava_user_person", JSON.stringify(personObj));
      setUserName(editingNameInput.trim());
      setIsEditingName(false);

      // Notifica o layout para atualizar iniciais/nome no topo
      window.dispatchEvent(new Event("user_name_updated"));
    } catch (e) {
      console.error("Erro ao salvar nome do responsável", e);
    }
  };

  // Cálculo de Progresso Seguro (%)
  const totalItemsV1 = 5;
  const countCheckedV1 = [chkEmpresa, chkEdital, chkProdutos, chkRevisao, chkGerarPdf].filter(Boolean).length;
  const progressPercent = Math.round((countCheckedV1 / totalItemsV1) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. HERO SECTION COM BOTÃO PRINCIPAL "COMEÇAR PROPOSTA NOVA" DE ALTO DESTAQUE */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl w-full min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-200 border border-white/15">
              <span className="material-symbols-outlined text-sm animate-pulse text-emerald-400">schedule</span>
              <span>{currentDateTime.fullDate} — {currentDateTime.fullTime}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wider uppercase border border-blue-400">
                DESTRAVA PROPOSTA GOV
              </span>
            </div>

            {/* SAUDAÇÃO E BOTÃO EDITAR RESPONSÁVEL */}
            <div className="space-y-1">
              {!isEditingName ? (
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight break-words">
                    Olá, {userName}! 👋
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="bg-white/15 hover:bg-white/25 text-xs text-blue-100 border border-white/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    title="Editar Nome do Responsável"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    <span>Editar Responsável</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <input
                    type="text"
                    required
                    value={editingNameInput}
                    onChange={(e) => setEditingNameInput(e.target.value)}
                    placeholder="Digite o Nome do Responsável"
                    className="bg-white text-on-surface font-bold text-sm px-3 py-2 rounded-xl border border-blue-300 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Salvar Nome
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed break-words">
              Bem-vindo ao seu painel inteligente de licitações. Crie propostas perfeitas, simule lances e emita declarações com agilidade e segurança jurídica.
            </p>
          </div>

          {/* BOTÃO PRINCIPAL EM GRANDE DESTAQUE */}
          <div className="shrink-0 flex flex-col items-center sm:items-end w-full lg:w-auto">
            <button
              onClick={() => router.push("/dashboard/propostas/nova")}
              className="w-full sm:w-auto group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base md:text-lg px-6 md:px-8 py-4 rounded-2xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.6)] transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer ring-4 ring-emerald-400/30"
            >
              <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
              </span>
              <div className="text-left">
                <span className="block leading-tight text-white font-extrabold">Começar Proposta Nova</span>
                <span className="block text-[11px] font-medium text-emerald-100">
                  Crie uma proposta comercial em poucos minutos
                </span>
              </div>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform ml-1 shrink-0">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MÓDULOS DE NAVEGAÇÃO COM TEXTOS EXPLICATIVOS DETALHADOS */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700">grid_view</span>
            Módulos do Sistema
          </h2>
          <span className="text-xs text-on-surface-variant font-medium hidden sm:inline">Selecione uma ação para iniciar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Nova Proposta */}
          <button 
            onClick={() => router.push("/dashboard/propostas/nova")}
            className="group bg-surface-container-lowest p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col text-left justify-between gap-4 cursor-pointer hover:bg-blue-50/40"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Passo 1
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-blue-700 transition-colors mb-1">
                Nova Proposta
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Crie uma proposta comercial em poucos minutos
              </p>
            </div>
            <div className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Iniciar agora</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>
          
          {/* Card 2: Lista de Propostas */}
          <button 
            onClick={() => router.push("/dashboard/propostas")}
            className="group bg-surface-container-lowest p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col text-left justify-between gap-4 cursor-pointer hover:bg-blue-50/40"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                Minhas Propostas
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-blue-700 transition-colors mb-1">
                Lista de propostas
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Gerencie e visualize todas as suas propostas cadastradas
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Ver lista completa</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>

          {/* Card 3: Simulador de Lance */}
          <button 
            onClick={() => router.push("/dashboard/propostas/1/lances")}
            className="group bg-surface-container-lowest p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col text-left justify-between gap-4 cursor-pointer hover:bg-blue-50/40"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Disputa Viva
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-blue-700 transition-colors mb-1">
                Simulador de lance
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Simule estratégias e margens de lances em tempo real
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Simular margens</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>

          {/* Card 4: Checklist & Declarações */}
          <button 
            onClick={() => router.push("/dashboard/checklist")}
            className="group bg-surface-container-lowest p-5 rounded-2xl border-2 border-outline-variant/30 hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col text-left justify-between gap-4 cursor-pointer hover:bg-blue-50/40"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Habilitação
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-blue-700 transition-colors mb-1">
                Checklist
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Verifique documentação obrigatória e emita declarações
              </p>
            </div>
            <div className="text-xs font-bold text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Checar documentos</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. NAVEGAÇÃO GUIADA (FLUXO ORIENTADO DO LICITANTE) */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700">alt_route</span>
            <h2 className="text-base font-bold text-on-surface">Navegação Guiada — Jornada Recomendada</h2>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
            Fluxo Passo a Passo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            onClick={() => router.push("/dashboard/propostas/nova")}
            className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 hover:border-blue-500 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">1. Nova Proposta</p>
              <p className="text-[11px] text-blue-800 leading-snug">Preencha edital e itens comerciais.</p>
            </div>
          </div>

          <div 
            onClick={() => router.push("/dashboard/propostas")}
            className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 hover:border-indigo-500 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-900">2. Minhas Propostas</p>
              <p className="text-[11px] text-indigo-800 leading-snug">Revise o status e prévias salvas.</p>
            </div>
          </div>

          <div 
            onClick={() => router.push("/dashboard/propostas/1/lances")}
            className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">3. Simulador Lances</p>
              <p className="text-[11px] text-emerald-800 leading-snug">Calcule preço mínimo e disputas.</p>
            </div>
          </div>

          <div 
            onClick={() => router.push("/dashboard/checklist")}
            className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 hover:border-amber-500 cursor-pointer transition-all flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">4. Checklist &amp; PDF</p>
              <p className="text-[11px] text-amber-800 leading-snug">Emita documentos e valide certidões.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INDICADOR DE PROGRESSO (SENSAÇÃO DE SEGURANÇA) COM ETAPAS EM 2 VARIAÇÕES */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-2xl">verified_user</span>
              <h2 className="text-base md:text-lg font-bold text-on-surface">
                Indicador de Progresso &amp; Segurança da Proposta
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Acompanhe as etapas para garantir envio 100% seguro sem desclassificação.
            </p>
          </div>

          {/* CHAVEADOR DAS DUAS VARIAÇÕES SOLICITADAS */}
          <div className="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/50 self-start sm:self-auto">
            <button
              onClick={() => setProgressVariation(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                progressVariation === 1
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Variação 1 (Checkboxes)
            </button>
            <button
              onClick={() => setProgressVariation(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                progressVariation === 2
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Variação 2 (Numerada)
            </button>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-on-surface flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Nível de Prontidão da Proposta:
            </span>
            <span className="text-emerald-700 font-extrabold">{progressPercent}% Seguro para Envio</span>
          </div>
          <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* EXIBIÇÃO DA VARIAÇÃO 1 (CHECKBOXES DE VERIFICAÇÃO) */}
        {progressVariation === 1 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Variação 1: Caixas de Seleção para Verificação Rápida
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Box 1: Empresa */}
              <label 
                onClick={() => setChkEmpresa(!chkEmpresa)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  chkEmpresa 
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs" 
                    : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  chkEmpresa ? "bg-emerald-600 border-emerald-600 text-white" : "border-outline"
                }`}>
                  {chkEmpresa && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Empresa</span>
                  <span className="text-[10px] text-on-surface-variant">Dados Cadastrais</span>
                </div>
              </label>

              {/* Box 2: Edital */}
              <label 
                onClick={() => setChkEdital(!chkEdital)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  chkEdital 
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs" 
                    : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  chkEdital ? "bg-emerald-600 border-emerald-600 text-white" : "border-outline"
                }`}>
                  {chkEdital && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Edital</span>
                  <span className="text-[10px] text-on-surface-variant">Regras &amp; UASG</span>
                </div>
              </label>

              {/* Box 3: Produtos */}
              <label 
                onClick={() => setChkProdutos(!chkProdutos)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  chkProdutos 
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs" 
                    : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  chkProdutos ? "bg-emerald-600 border-emerald-600 text-white" : "border-outline"
                }`}>
                  {chkProdutos && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Produtos</span>
                  <span className="text-[10px] text-on-surface-variant">Itens &amp; Custos</span>
                </div>
              </label>

              {/* Box 4: Revisão */}
              <label 
                onClick={() => setChkRevisao(!chkRevisao)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  chkRevisao 
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs" 
                    : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  chkRevisao ? "bg-emerald-600 border-emerald-600 text-white" : "border-outline"
                }`}>
                  {chkRevisao && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Revisão</span>
                  <span className="text-[10px] text-on-surface-variant">Margem &amp; Impostos</span>
                </div>
              </label>

              {/* Box 5: Gerar PDF */}
              <label 
                onClick={() => setChkGerarPdf(!chkGerarPdf)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  chkGerarPdf 
                    ? "bg-emerald-50/70 border-emerald-500 text-emerald-950 shadow-xs" 
                    : "bg-surface-container-low border-outline-variant/50 text-on-surface-variant hover:border-outline"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  chkGerarPdf ? "bg-emerald-600 border-emerald-600 text-white" : "border-outline"
                }`}>
                  {chkGerarPdf && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                </div>
                <div>
                  <span className="text-xs font-extrabold block">Gerar PDF</span>
                  <span className="text-[10px] text-on-surface-variant">Documento Final</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* EXIBIÇÃO DA VARIAÇÃO 2 (SEQUÊNCIA NUMERADA) */}
        {progressVariation === 2 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
              Variação 2: Sequência Numerada do Processo
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-blue-50/80 border-2 border-blue-500/80 p-3.5 rounded-xl text-blue-950 space-y-1">
                <span className="text-xs font-extrabold text-blue-700 block">1 - Dados da empresa</span>
                <span className="text-[11px] text-blue-900 block">CNPJ, Razão Social &amp; Inscrição</span>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Concluído</span>
              </div>

              <div className="bg-blue-50/80 border-2 border-blue-500/80 p-3.5 rounded-xl text-blue-950 space-y-1">
                <span className="text-xs font-extrabold text-blue-700 block">2 - Dados do edital</span>
                <span className="text-[11px] text-blue-900 block">Pregão, UASG &amp; Data Disputa</span>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Concluído</span>
              </div>

              <div className="bg-blue-50/80 border-2 border-blue-500/80 p-3.5 rounded-xl text-blue-950 space-y-1">
                <span className="text-xs font-extrabold text-blue-700 block">3 - Itens e preços</span>
                <span className="text-[11px] text-blue-900 block">Quantidades, Marcas &amp; Frete</span>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Concluído</span>
              </div>

              <div className="bg-amber-50/80 border-2 border-amber-400 p-3.5 rounded-xl text-amber-950 space-y-1">
                <span className="text-xs font-extrabold text-amber-800 block">4 - Gerar proposta</span>
                <span className="text-[11px] text-amber-900 block">Validação &amp; Impostos</span>
                <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Em Andamento</span>
              </div>

              <div className="bg-surface-container-low border-2 border-outline-variant/40 p-3.5 rounded-xl text-on-surface-variant space-y-1">
                <span className="text-xs font-extrabold text-on-surface block">5 - Baixar documentos</span>
                <span className="text-[11px] text-on-surface-variant block">PDF Proposta &amp; Habilitação</span>
                <span className="inline-block text-[10px] font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Pendente</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. PROPOSTAS RECENTES */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700">history</span>
            Propostas Recentes
          </h2>
          <Link href="/dashboard/propostas" className="flex items-center gap-1 font-bold text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
            Ver todas <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden p-6">
          {recentPropostas.length === 0 ? (
            <div className="text-center py-8 flex flex-col items-center justify-center w-full">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">description</span>
              <h3 className="font-bold text-sm md:text-base text-on-surface mb-1">Nenhuma proposta cadastrada no momento</h3>
              <p className="text-xs md:text-sm text-on-surface-variant w-full max-w-md mx-auto mb-4 leading-relaxed font-medium">
                Inicie a criação da sua primeira proposta comercial para licitações.
              </p>
              <button
                onClick={() => router.push("/dashboard/propostas/nova")}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                Criar Primeira Proposta
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant/30">
              {recentPropostas.map((prop) => (
                <li 
                  key={prop.id} 
                  onClick={() => router.push(`/dashboard/propostas/${prop.id}/lances`)}
                  className="p-4 hover:bg-blue-50/30 transition-colors flex items-center justify-between cursor-pointer rounded-xl"
                >
                  <div>
                    <p className="text-sm font-bold text-on-surface mb-1">{prop.nome}</p>
                    <p className="text-xs text-on-surface-variant">{prop.orgao}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${prop.statusColor}`}>
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
    </div>
  );
}
