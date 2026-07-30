"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PropostasPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"propostas" | "rascunhos">("propostas");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [completedProposals, setCompletedProposals] = useState<any[]>([]);

  // Carrega rascunhos e propostas concluídas salvos no localStorage
  useEffect(() => {
    loadDrafts();
    loadCompletedProposals();
  }, []);

  const loadDrafts = () => {
    try {
      const raw = localStorage.getItem("destrava_proposal_drafts");
      if (raw) {
        setDrafts(JSON.parse(raw));
      } else {
        setDrafts([]);
      }
    } catch (e) {
      console.error("Erro ao carregar rascunhos", e);
    }
  };

  const loadCompletedProposals = () => {
    try {
      const raw = localStorage.getItem("destrava_completed_proposals");
      if (raw) {
        setCompletedProposals(JSON.parse(raw));
      } else {
        setCompletedProposals([]);
      }
    } catch (e) {
      console.error("Erro ao carregar propostas concluídas", e);
    }
  };

  // Zerar todas as propostas e rascunhos salvos
  const handleClearAllData = () => {
    if (confirm("Tem certeza que deseja apagar todas as propostas e rascunhos de teste?")) {
      localStorage.removeItem("destrava_completed_proposals");
      localStorage.removeItem("destrava_proposal_drafts");
      localStorage.removeItem("destrava_active_proposal_general");
      localStorage.removeItem("destrava_active_proposal_items");
      setCompletedProposals([]);
      setDrafts([]);
      alert("✅ Todas as propostas de teste foram removidas! O sistema está limpo para você criar novas propostas.");
    }
  };

  // Restaurar rascunho para edição
  const handleRestoreDraft = (draft: any) => {
    try {
      if (draft.general) {
        localStorage.setItem("destrava_active_proposal_general", JSON.stringify(draft.general));
      }
      if (draft.itemsData) {
        localStorage.setItem("destrava_active_proposal_items", JSON.stringify(draft.itemsData));
      }
      router.push("/dashboard/propostas/nova/itens");
    } catch (e) {
      console.error("Erro ao restaurar rascunho", e);
    }
  };

  // Excluir rascunho
  const handleDeleteDraft = (draftId: string) => {
    try {
      const updated = drafts.filter((d) => d.id !== draftId);
      setDrafts(updated);
      localStorage.setItem("destrava_proposal_drafts", JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao excluir rascunho", e);
    }
  };

  // Excluir proposta concluída
  const handleDeleteCompletedProposal = (propId: any) => {
    try {
      const updated = completedProposals.filter((p) => String(p.id) !== String(propId));
      setCompletedProposals(updated);
      localStorage.setItem("destrava_completed_proposals", JSON.stringify(updated));
    } catch (e) {
      console.error("Erro ao excluir proposta", e);
    }
  };

  return (
    <>
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background font-bold">
            Histórico &amp; Gestão de Propostas
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Acompanhe o desempenho das suas licitações ou gerencie seus rascunhos em andamento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(completedProposals.length > 0 || drafts.length > 0) && (
            <button
              onClick={handleClearAllData}
              className="text-xs font-semibold text-error hover:bg-error/10 px-3.5 py-2.5 rounded-lg border border-error/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Apagar propostas antigas e zerar lista"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Zerar Propostas de Teste
            </button>
          )}

          <button
            onClick={() => router.push("/dashboard/propostas/nova")}
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer font-semibold text-xs"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nova Proposta
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="text-xs text-on-surface-variant font-medium block mb-1">Total de Propostas</span>
          <span className="text-2xl font-bold text-on-surface">{completedProposals.length} Registradas</span>
          <span className="text-[11px] text-on-surface-variant block mt-1">Acumulado em disputa</span>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30">
          <span className="text-xs text-on-surface-variant font-medium block mb-1">Propostas Concluídas</span>
          <span className="text-2xl font-bold text-[#137333]">{completedProposals.length} Ativas</span>
          <span className="text-[11px] text-[#137333] block mt-1">Finalizadas no sistema</span>
        </div>
        <div className="bg-primary/10 p-4 rounded-xl shadow-sm border-2 border-primary/30">
          <span className="text-xs text-primary font-bold block mb-1 uppercase tracking-wider">Margem Média Global</span>
          <span className="text-2xl font-bold text-primary">
            {completedProposals.length > 0 ? completedProposals[0].margemMedia || "20,00%" : "0,00%"}
          </span>
          <span className="text-[11px] text-primary/80 block mt-1 font-medium">✦ Calculada sobre os custos totais</span>
        </div>
        <div className="bg-amber-500/10 p-4 rounded-xl shadow-sm border-2 border-amber-500/30">
          <span className="text-xs text-amber-900 font-bold block mb-1 uppercase tracking-wider">Rascunhos Salvos</span>
          <span className="text-2xl font-bold text-slate-900">{drafts.length} Salvo(s)</span>
          <span className="text-[11px] text-amber-900/80 block mt-1 font-medium">Prontos para continuar</span>
        </div>
      </div>

      {/* Abas Principais (Propostas vs Rascunhos) */}
      <div className="flex border-b border-outline-variant/30 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("propostas")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeTab === "propostas"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">gavel</span>
          Propostas em Disputa ({completedProposals.length})
        </button>

        <button
          onClick={() => setActiveTab("rascunhos")}
          className={`px-4 py-2.5 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${activeTab === "rascunhos"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">draft</span>
          Rascunhos Salvos ({drafts.length})
        </button>
      </div>

      {/* ABA 1: PROPOSTAS EM DISPUTA */}
      {activeTab === "propostas" && (
        <>
          {completedProposals.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center bg-surface-container-lowest border-2 border-dashed border-outline-variant/40 rounded-2xl p-10 text-center my-6 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-2">Nenhuma proposta cadastrada no momento</h3>
              <p className="text-sm text-on-surface-variant w-full max-w-lg mx-auto mb-6 leading-relaxed font-medium">
                Você ainda não possui propostas cadastradas. Clique no botão abaixo para iniciar a criação da sua proposta no sistema e visualizar todas as funções ativas!
              </p>
              <button
                onClick={() => router.push("/dashboard/propostas/nova")}
                className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Criar Minha Primeira Proposta
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {completedProposals.map((prop) => (
                <div key={prop.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-outline-variant/30 hover:border-primary/40 transition-colors group flex flex-col md:flex-row md:items-center gap-4">
                  <div
                    onClick={() => router.push(`/dashboard/propostas/${prop.id}/lances`)}
                    className="flex-grow grid grid-cols-2 md:grid-cols-5 gap-3 cursor-pointer"
                  >
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Pregão / UASG</p>
                      <p className="font-body-md text-body-md text-on-surface font-bold group-hover:text-primary transition-colors">{prop.nome}</p>
                      <p className="text-xs text-outline font-mono">{prop.uasg || "160045"}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Órgão</p>
                      <p className="font-body-md text-body-md text-on-surface truncate" title={prop.orgao}>{prop.orgao}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Data Criada</p>
                      <p className="font-body-md text-body-md text-on-surface">{prop.dataAbertura}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Valor da Proposta</p>
                      <p className="font-body-md text-body-md text-on-surface font-bold text-primary">{prop.valor}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Margem do Produto</p>
                      <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#eefaf4] text-[#006c49] border border-[#006c49]/20">
                        {prop.margemMedia}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => router.push(`/dashboard/propostas/${prop.id}/lances`)}
                      className="px-3 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">gavel</span>
                      Simular Lances
                    </button>
                    <button
                      onClick={() => handleDeleteCompletedProposal(prop.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Proposta"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ABA 2: RASCUNHOS SALVOS */}
      {activeTab === "rascunhos" && (
        <div className="flex flex-col gap-3">
          {drafts.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-2 text-outline">edit_note</span>
              <p className="font-semibold text-sm">Nenhum rascunho salvo no momento.</p>
              <p className="text-xs text-outline mt-1">Ao iniciar uma nova proposta, você pode salvar um rascunho para continuar depois.</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-outline-variant/30 hover:border-primary/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-900 font-bold text-[11px] rounded border border-amber-500/20">
                      Rascunho
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">{draft.numPregao}</h3>
                    <span className="text-xs text-outline font-mono">UASG: {draft.uasg}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">{draft.orgao}</p>
                  <p className="text-[11px] text-outline">Última edição: {draft.updatedAt}</p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <div className="text-right mr-2">
                    <span className="text-[11px] text-on-surface-variant block font-medium">Valor Estimado</span>
                    <span className="text-sm font-bold text-primary">{draft.valorTotal}</span>
                  </div>

                  <button
                    onClick={() => handleRestoreDraft(draft)}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Continuar Edição
                  </button>

                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Rascunho"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
