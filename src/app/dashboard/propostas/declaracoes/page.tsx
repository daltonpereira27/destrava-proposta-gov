"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DeclarationGenerator } from "@/components/proposal/DeclarationGenerator";

function DeclaracoesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "unificada";

  const [generalData, setGeneralData] = useState<any>({
    numPregao: "PE 15/2023",
    orgao: "Ministério da Saúde - Coordenação Geral de Logística",
    uasg: "160045",
  });

  const [companyData, setCompanyData] = useState<any>({
    razaoSocial: "INFOR TECH SOLUCOES (DALTON A. B. PEREIRA)",
    cnpj: "39.335.069/0001-01",
    endereco: "AL LAGOA DAS GARCAS, Nº 71, CASA - ALVORADA, MACAPA / AP",
  });

  useEffect(() => {
    try {
      const savedGeneral = localStorage.getItem("destrava_active_proposal_general");
      if (savedGeneral) {
        const parsed = JSON.parse(savedGeneral);
        setGeneralData({
          numPregao: parsed.numPregao || "PE 15/2023",
          orgao: parsed.orgao || "Ministério da Saúde",
          uasg: parsed.uasg || "160045",
        });
      }

      const companyOnboarding = localStorage.getItem("destrava_user_company");
      if (companyOnboarding) {
        const parsedComp = JSON.parse(companyOnboarding);
        setCompanyData({
          razaoSocial: parsedComp.razao_social || parsedComp.nome_fantasia || "INFOR TECH SOLUCOES",
          cnpj: parsedComp.cnpj || "39.335.069/0001-01",
          endereco: parsedComp.logradouro ? `${parsedComp.logradouro}, ${parsedComp.numero} - ${parsedComp.bairro}, ${parsedComp.municipio}/${parsedComp.uf}` : "AL LAGOA DAS GARCAS, Nº 71, CASA - ALVORADA, MACAPA / AP",
        });
      }
    } catch (e) {
      console.error("Erro ao carregar declarações", e);
    }
  }, []);

  // Salvar Proposta Concluída no Histórico
  const handleFinalizeProposal = () => {
    try {
      const savedItemsRaw = localStorage.getItem("destrava_active_proposal_items");
      const itemsData = savedItemsRaw ? JSON.parse(savedItemsRaw) : {};

      const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

      const totalVal = itemsData.precoTotalProposta ? formatCurrency(itemsData.precoTotalProposta) : "R$ 63.000,00";
      const margem = itemsData.margemLucroDesejada ? `${itemsData.margemLucroDesejada}%` : "20,00%";

      const newCompletedProposal = {
        id: Date.now(),
        nome: generalData.numPregao || "PE 15/2023",
        uasg: generalData.uasg || "160045",
        orgao: generalData.orgao || "Ministério da Saúde",
        dataAbertura: new Date().toLocaleDateString("pt-BR"),
        valor: totalVal,
        margemMedia: margem,
        margemColor: "text-[#006c49] bg-[#eefaf4] border-[#006c49]/20",
        status: "Em Disputa",
        statusBadge: "bg-[#e8f0fe] text-[#1a73e8] border-[#4285f4]/30",
        statusDot: "bg-[#4285f4]",
        generalData,
        itemsData,
        items: itemsData.items || [],
        createdAt: new Date().toISOString(),
      };

      const rawCompleted = localStorage.getItem("destrava_completed_proposals");
      const existingCompleted = rawCompleted ? JSON.parse(rawCompleted) : [];

      const filtered = existingCompleted.filter((p: any) => p.nome !== newCompletedProposal.nome);

      const updatedList = [newCompletedProposal, ...filtered];

      localStorage.setItem("destrava_completed_proposals", JSON.stringify(updatedList));

      alert("🎉 Proposta finalizada com sucesso e salva no Histórico de Propostas!");
      router.push("/dashboard/propostas");
    } catch (e) {
      console.error("Erro ao salvar proposta finalizada", e);
      alert("Erro ao salvar a proposta no sistema.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/propostas/previa")}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
            title="Voltar para Passo 3"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Declarações Obrigatórias do Edital</h1>
            <p className="text-sm text-on-surface-variant">
              Passo 4 de 4: Gere e imprima as declarações legais exigidas para a licitação (ME/EPP, IN 73/2022, Habilitação).
            </p>
          </div>
        </div>
      </div>

      {/* Stepper de 4 Passos */}
      <div className="flex items-center justify-between w-full relative mb-8 px-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-primary -translate-y-1/2 z-0 rounded-full"></div>

        {/* Passo 1 */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={() => router.push("/dashboard/propostas/nova")}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Dados Gerais &amp; Edital</span>
        </div>

        {/* Passo 2 */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={() => router.push("/dashboard/propostas/nova/itens")}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Itens, Custos &amp; Taxas</span>
        </div>

        {/* Passo 3 */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={() => router.push("/dashboard/propostas/previa")}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Prévia dos Itens</span>
        </div>

        {/* Passo 4 */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm ring-4 ring-primary/20 shadow-sm">
            4
          </div>
          <span className="text-xs font-bold text-primary">Declarações Licitações</span>
        </div>
      </div>

      {/* Componente Gerador de Declarações */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 mb-8">
        <DeclarationGenerator company={companyData} proposal={generalData} initialType={initialType} />
      </div>

      {/* Botões de Ação Final */}
      <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
        <button
          onClick={() => router.push("/dashboard/propostas/previa")}
          className="font-semibold text-sm text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar para Prévia dos Itens (Passo 3)
        </button>

        <button
          onClick={handleFinalizeProposal}
          className="font-bold text-sm text-on-primary bg-[#006c49] hover:opacity-90 px-6 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Concluir Proposta &amp; Salvar no Histórico
        </button>
      </div>
    </div>
  );
}

export default function DeclaracoesPropostaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-primary">Carregando declarações...</div>}>
      <DeclaracoesContent />
    </Suspense>
  );
}
