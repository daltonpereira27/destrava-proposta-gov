"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProposalItem {
  id: string;
  itemNum: string;
  description: string;
  brand: string;
  quantity: number;
  unitCost: number;
  currentLowestBid: number;
  myCurrentBid: number;
}

export default function LancesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Informações da Proposta Carregada
  const [proposalTitle, setProposalTitle] = useState("PE 15/2023");
  const [proposalOrgao, setProposalOrgao] = useState("Ministério da Saúde - Coordenação Geral de Logística");
  const [proposalUasg, setProposalUasg] = useState("160045");
  const [completedProposalsList, setCompletedProposalsList] = useState<any[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string>(id);
  const [isSelectorModalOpen, setIsSelectorModalOpen] = useState(false);

  // Lista de itens padrão da proposta
  const defaultItems: ProposalItem[] = [
    {
      id: "item-1",
      itemNum: "01",
      description: "Computador Desktop Intel Core i7 16GB SSD 512GB",
      brand: "Dell",
      quantity: 10,
      unitCost: 3500.00,
      currentLowestBid: 4800.00,
      myCurrentBid: 5100.00,
    },
    {
      id: "item-2",
      itemNum: "02",
      description: "Monitor LED 24'' IPS Full HD 75Hz",
      brand: "LG",
      quantity: 20,
      unitCost: 650.00,
      currentLowestBid: 740.00,
      myCurrentBid: 740.00,
    },
    {
      id: "item-3",
      itemNum: "03",
      description: "Nobreak Senoidal 1500VA Bivolt Automático",
      brand: "APC",
      quantity: 5,
      unitCost: 1100.00,
      currentLowestBid: 1150.00,
      myCurrentBid: 1150.00,
    },
  ];

  const [items, setItems] = useState<ProposalItem[]>(defaultItems);

  // Carrega lista de propostas disponíveis e seleciona a proposta atual
  useEffect(() => {
    try {
      const rawCompleted = localStorage.getItem("destrava_completed_proposals");
      if (rawCompleted) {
        const completedList = JSON.parse(rawCompleted);
        setCompletedProposalsList(completedList);

        const targetId = selectedProposalId || id;
        const match = completedList.find((p: any) => String(p.id) === String(targetId) || p.nome === targetId);

        if (match) {
          if (match.nome) setProposalTitle(match.nome);
          if (match.orgao) setProposalOrgao(match.orgao);
          if (match.uasg) setProposalUasg(match.uasg);

          const rawItems = match.itemsData?.items || match.items;
          if (Array.isArray(rawItems) && rawItems.length > 0) {
            const mappedItems: ProposalItem[] = rawItems.map((it: any, idx: number) => {
              const baseCost = Number(it.unitPrice) || 100;
              const margin = match.itemsData?.margemLucroDesejada || 20;
              const sellPrice = baseCost * (1 + margin / 100);

              return {
                id: it.id || `item-${idx + 1}`,
                itemNum: it.itemNum || String(idx + 1).padStart(2, "0"),
                description: it.description || `Item ${idx + 1}`,
                brand: it.brand || "Marca Genérica",
                quantity: Number(it.quantity) || 1,
                unitCost: baseCost,
                currentLowestBid: Math.round(sellPrice * 0.95 * 100) / 100,
                myCurrentBid: Math.round(sellPrice * 100) / 100,
              };
            });
            setItems(mappedItems);
          } else {
            setItems(defaultItems);
          }
        }
      }
    } catch (e) {
      console.error("Erro ao carregar proposta nos lances", e);
    }
  }, [id, selectedProposalId]);

  // Handler para trocar de proposta no simulador
  const handleSelectProposalChange = (newPropId: string) => {
    setSelectedProposalId(newPropId);
    setIsSelectorModalOpen(false);
    router.push(`/dashboard/propostas/${newPropId}/lances`);
  };

  // Item selecionado para simulação no termômetro
  const [selectedItemId, setSelectedItemId] = useState<string>("item-1");
  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0];

  // Sincroniza o selecionado se a lista mudar
  useEffect(() => {
    if (items.length > 0 && !items.some((i) => i.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  // Estado do simulador de lance para o item selecionado
  const [lanceValueInput, setLanceValueInput] = useState<string>("");
  const [lucroReais, setLucroReais] = useState<number>(0);
  const [margemLucro, setMargemLucro] = useState<number>(0);

  // Metas de lucro configuradas
  const metaLucroIdeal = 20; // 20%
  const metaLucroMinimo = 10; // 10%

  // Sincroniza o valor do input quando o item selecionado muda
  useEffect(() => {
    if (selectedItem) {
      setLanceValueInput(selectedItem.myCurrentBid.toFixed(2).replace(".", ","));
    }
  }, [selectedItemId, items]);

  // Atualizar cálculos sempre que o input mudar
  useEffect(() => {
    if (!selectedItem) return;
    const numericValue = parseFloat(lanceValueInput.replace(/\./g, "").replace(",", "."));
    
    if (!isNaN(numericValue) && numericValue > 0) {
      const lucroUnitario = numericValue - selectedItem.unitCost;
      const lucroTotalItem = lucroUnitario * selectedItem.quantity;
      const margem = (lucroUnitario / selectedItem.unitCost) * 100;
      setLucroReais(lucroTotalItem);
      setMargemLucro(margem);
    } else {
      setLucroReais(0);
      setMargemLucro(-100);
    }
  }, [lanceValueInput, selectedItem]);

  // Formatador de moeda BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para retornar o Badge de Status da Margem
  const getMarginStatusBadge = (unitCost: number, currentBid: number) => {
    if (unitCost <= 0) return null;
    const margin = ((currentBid - unitCost) / unitCost) * 100;

    if (margin >= metaLucroIdeal) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#e6f4ea] text-[#137333] border border-[#34a853]/40 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]"></span>
          Margem boa
        </span>
      );
    } else if (margin >= metaLucroMinimo) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fef7e0] text-[#b06000] border border-[#fbbc04]/40 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fbbc04]"></span>
          Margem média
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fce8e6] text-[#c5221f] border border-[#ea4335]/40 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ea4335]"></span>
          Sem Margem
        </span>
      );
    }
  };

  // Atualizar o lance do item atual na lista
  const handleApplyNewBid = () => {
    if (!selectedItem) return;
    const numericValue = parseFloat(lanceValueInput.replace(/\./g, "").replace(",", "."));
    if (isNaN(numericValue) || numericValue <= 0) {
      alert("Por favor, digite um valor de lance válido.");
      return;
    }

    const updatedItems = items.map((item) => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          myCurrentBid: numericValue,
          currentLowestBid: Math.min(item.currentLowestBid, numericValue),
        };
      }
      return item;
    });

    setItems(updatedItems);
    alert(`✅ Lance de ${formatCurrency(numericValue)} registrado para o Item ${selectedItem.itemNum}!`);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* SELETOR COMPACTO E ELEGANTE DE PROPOSTA (BARRA SUPERIOR) */}
      <div className="w-full bg-surface-container-lowest p-4 md:p-5 rounded-2xl border-2 border-primary/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-2xl">gavel</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Simulador de Lances &amp; Margens
            </span>
            <h2 className="text-base font-bold text-on-surface">
              Selecione a Proposta para Analisar os Lances
            </h2>
          </div>
        </div>

        <div className="w-full md:w-96 shrink-0">
          <label className="text-[11px] font-bold text-on-surface-variant block mb-1">
            Edital / Licitação Selecionada:
          </label>
          <div className="relative w-full">
            <select
              value={selectedProposalId}
              onChange={(e) => handleSelectProposalChange(e.target.value)}
              className="w-full bg-surface-container-low border-2 border-primary text-primary font-bold text-xs p-3.5 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none pr-10 truncate"
            >
              {completedProposalsList.length > 0 ? (
                completedProposalsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {p.orgao}
                  </option>
                ))
              ) : (
                <option value={id}>PE 15/2023 — Ministério da Saúde</option>
              )}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-xl">
              unfold_more
            </span>
          </div>
        </div>
      </div>

      {/* Header Secundário com Botões de Ação */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-outline-variant/20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/propostas")}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
            title="Voltar para Propostas"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-xs">
                UASG {proposalUasg}
              </span>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background font-bold">
                {proposalTitle}
              </h1>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {proposalOrgao} — Disputa Ativa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/checklist"
            className="bg-surface-container-lowest border border-outline-variant hover:bg-surface-variant text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-semibold text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            Checklist Edital
          </Link>

          <a
            href="/dashboard/propostas/declaracoes"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 font-semibold text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            Gerar Declarações
          </a>
        </div>
      </div>

      {/* Grid Principal: Lista de Itens vs Simulador de Lance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA (8 Cols): Tabela de Itens e Status da Margem */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-outline-variant/30">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant/30">
              <div>
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">inventory</span>
                  Itens da Proposta Selecionada ({items.length})
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Clique em um item da tabela abaixo para carregar no Termômetro e enviar seu lance.
                </p>
              </div>
            </div>

            {/* Tabela de Itens */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-bold text-on-surface-variant uppercase">
                    <th className="p-3 w-14 text-center">Item</th>
                    <th className="p-3">Descrição / Marca</th>
                    <th className="p-3 w-20 text-center">Qtd.</th>
                    <th className="p-3 w-28 text-right">Custo Unit.</th>
                    <th className="p-3 w-32 text-right">Meu Lance Atual</th>
                    <th className="p-3 w-32 text-center">Status Margem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 text-sm">
                  {items.map((item) => {
                    const isSelected = item.id === selectedItemId;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 font-medium"
                            : "hover:bg-surface-container-low/60"
                        }`}
                      >
                        <td className="p-3 text-center font-bold text-primary">
                          {item.itemNum}
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-xs text-on-surface line-clamp-1">{item.description}</p>
                          <p className="text-[11px] text-on-surface-variant font-mono">Marca: {item.brand}</p>
                        </td>
                        <td className="p-3 text-center font-bold text-xs">{item.quantity}</td>
                        <td className="p-3 text-right font-semibold text-xs text-on-surface-variant">
                          {formatCurrency(item.unitCost)}
                        </td>
                        <td className="p-3 text-right font-bold text-xs text-primary">
                          {formatCurrency(item.myCurrentBid)}
                        </td>
                        <td className="p-3 text-center">
                          {getMarginStatusBadge(item.unitCost, item.myCurrentBid)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (4 Cols): Simulador de Lance & Termômetro de Margem */}
        <div className="lg:col-span-4 space-y-4">
          {selectedItem && (
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(31,41,55,0.05)] border-2 border-primary/30 sticky top-20">
              <div className="pb-3 border-b border-outline-variant/30 mb-4">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  Simulador de Lance Ativo
                </span>
                <h3 className="font-bold text-sm text-on-surface line-clamp-1">
                  Item {selectedItem.itemNum} — {selectedItem.description}
                </h3>
              </div>

              {/* Informações de Custo e Lance Mínimo */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                  <span className="text-on-surface-variant block text-[11px]">Custo Base Unitário</span>
                  <span className="font-bold text-on-surface">{formatCurrency(selectedItem.unitCost)}</span>
                </div>
                <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                  <span className="text-on-surface-variant block text-[11px]">Lance Mais Baixo Atual</span>
                  <span className="font-bold text-primary">{formatCurrency(selectedItem.currentLowestBid)}</span>
                </div>
              </div>

              {/* Input do Novo Lance */}
              <div className="mb-4">
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Digite seu Novo Lance Unitário (R$):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs text-outline">R$</span>
                  <input
                    type="text"
                    value={lanceValueInput}
                    onChange={(e) => setLanceValueInput(e.target.value)}
                    className="w-full bg-surface-container-lowest border-2 border-primary rounded-lg p-2.5 pl-9 text-base font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="0,00"
                  />
                </div>
              </div>

              {/* TERMÔMETRO DE MARGEM DE LUCRO */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 mb-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">thermostat</span>
                    Margem de Lucro Estimada
                  </span>
                  <span className={`text-xs font-bold ${margemLucro >= metaLucroIdeal ? "text-[#137333]" : margemLucro >= metaLucroMinimo ? "text-[#b06000]" : "text-[#c5221f]"}`}>
                    {margemLucro.toFixed(2)}%
                  </span>
                </div>

                {/* Barra Visual do Termômetro */}
                <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden relative shadow-inner">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      margemLucro >= metaLucroIdeal
                        ? "bg-[#34a853]"
                        : margemLucro >= metaLucroMinimo
                        ? "bg-[#fbbc04]"
                        : "bg-[#ea4335]"
                    }`}
                    style={{ width: `${Math.min(Math.max(margemLucro, 0), 100)}%` }}
                  ></div>
                </div>

                {/* Lucro em Reais Calculado */}
                <div className="flex justify-between items-center text-xs pt-1 border-t border-outline-variant/20">
                  <span className="text-on-surface-variant font-medium">Lucro Total no Item:</span>
                  <span className="font-bold text-on-surface">{formatCurrency(lucroReais)}</span>
                </div>
              </div>

              {/* Botão de Confirmação do Lance */}
              <button
                onClick={handleApplyNewBid}
                className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                Confirmar &amp; Enviar Lance
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
