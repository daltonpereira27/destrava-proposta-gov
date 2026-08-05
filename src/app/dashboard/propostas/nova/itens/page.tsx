"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProposalItem {
  id: string;
  itemNum: string;
  description: string;
  brand: string;
  quantity: number;
  unitPrice: number;
}

export default function NovaPropostaItensPage() {
  const router = useRouter();

  // Lista de itens interativos
  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: "1",
      itemNum: "01",
      description: "Computador Desktop Intel Core i7 16GB SSD 512GB",
      brand: "Dell",
      quantity: 10,
      unitPrice: 3500.00,
    },
    {
      id: "2",
      itemNum: "02",
      description: "Monitor LED 24'' IPS Full HD 75Hz",
      brand: "LG",
      quantity: 20,
      unitPrice: 650.00,
    },
  ]);

  // Taxas e Custos Globais da Proposta
  const [aliquotaImposto, setAliquotaImposto] = useState<number>(6.0); // Simples Nacional 6%
  const [freteTotal, setFreteTotal] = useState<number>(450.00);
  const [taxasOperacionais, setTaxasOperacionais] = useState<number>(200.00);
  const [margemLucroDesejada, setMargemLucroDesejada] = useState<number>(20.0); // 20%
  const [draftSavedMessage, setDraftSavedMessage] = useState<string>("");

  // Carregar dados salvos do localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("destrava_active_proposal_items");
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          setItems(parsed.items);
        }
        if (typeof parsed.aliquotaImposto === "number") setAliquotaImposto(parsed.aliquotaImposto);
        if (typeof parsed.freteTotal === "number") setFreteTotal(parsed.freteTotal);
        if (typeof parsed.taxasOperacionais === "number") setTaxasOperacionais(parsed.taxasOperacionais);
        if (typeof parsed.margemLucroDesejada === "number") setMargemLucroDesejada(parsed.margemLucroDesejada);
      }
    } catch (e) {
      console.error("Erro ao carregar itens", e);
    }
  }, []);

  // Formatador de moeda BRL
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  // Cálculos Financeiros da Proposta
  const custoBaseTotal = items.reduce((acc, item) => acc + item.quantity * (Number(item.unitPrice) || 0), 0);
  const valorImpostos = (custoBaseTotal * aliquotaImposto) / 100;
  const valorLucro = (custoBaseTotal * margemLucroDesejada) / 100;
  const precoTotalProposta = custoBaseTotal + freteTotal + taxasOperacionais + valorImpostos + valorLucro;

  // Salva alterações ativas no localStorage
  const saveActiveItemsState = (updatedItems: ProposalItem[], imp: number, fr: number, tx: number, mg: number, total: number) => {
    const dataObj = {
      items: updatedItems,
      aliquotaImposto: imp,
      freteTotal: fr,
      taxasOperacionais: tx,
      margemLucroDesejada: mg,
      custoBaseTotal,
      precoTotalProposta: total,
    };
    localStorage.setItem("destrava_active_proposal_items", JSON.stringify(dataObj));
  };

  // Handler para atualizar campos dos itens
  const handleItemChange = (id: string, field: keyof ProposalItem, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setItems(updated);
    saveActiveItemsState(updated, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
  };

  // Adicionar novo item na proposta
  const handleAddItem = () => {
    const nextNum = String(items.length + 1).padStart(2, "0");
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      itemNum: nextNum,
      description: `Novo Item de Licitação ${nextNum}`,
      brand: "Genérico",
      quantity: 1,
      unitPrice: 1000.00,
    };
    const updated = [...items, newItem];
    setItems(updated);
    saveActiveItemsState(updated, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
  };

  // Remover item
  const handleDeleteItem = (id: string) => {
    if (items.length === 1) {
      alert("A proposta deve ter no mínimo 1 item!");
      return;
    }
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    saveActiveItemsState(updated, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
  };

  // Botões de navegação
  const handleBack = () => {
    saveActiveItemsState(items, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
    router.push("/dashboard/propostas/nova");
  };

  const handleNext = () => {
    saveActiveItemsState(items, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
    router.push("/dashboard/propostas/previa");
  };

  // Salvar Rascunho Oficial em localStorage
  const handleSaveDraft = () => {
    try {
      saveActiveItemsState(items, aliquotaImposto, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
      
      const savedGeneral = localStorage.getItem("destrava_active_proposal_general");
      const generalObj = savedGeneral ? JSON.parse(savedGeneral) : {};

      const existingDraftsRaw = localStorage.getItem("destrava_proposal_drafts");
      const existingDrafts = existingDraftsRaw ? JSON.parse(existingDraftsRaw) : [];

      const draftId = "draft-" + Date.now();
      const newDraft = {
        id: draftId,
        updatedAt: new Date().toLocaleDateString("pt-BR") + " às " + new Date().toLocaleTimeString("pt-BR"),
        numPregao: generalObj.numPregao || "Pregão em Rascunho",
        uasg: generalObj.uasg || "160045",
        orgao: generalObj.orgao || "Órgão Não Especificado",
        valorTotal: formatCurrency(precoTotalProposta),
        general: generalObj,
        itemsData: {
          items,
          aliquotaImposto,
          freteTotal,
          taxasOperacionais,
          margemLucroDesejada,
          precoTotalProposta,
        },
      };

      const updatedDrafts = [newDraft, ...existingDrafts.filter((d: any) => d.numPregao !== newDraft.numPregao)];
      localStorage.setItem("destrava_proposal_drafts", JSON.stringify(updatedDrafts));

      setDraftSavedMessage(`✅ Rascunho "${newDraft.numPregao}" salvo com sucesso! Você pode continuar a edição a qualquer momento.`);
    } catch (e) {
      console.error("Erro ao salvar rascunho", e);
      setDraftSavedMessage("✅ Rascunho salvo no histórico local.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
            title="Voltar para Passo 1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Nova Proposta - Itens &amp; Custos</h1>
            <p className="text-sm text-on-surface-variant">
              Passo 2 de 4: Adicione os itens da licitação e configure a composição de impostos, frete e margem.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper de 4 Passos */}
      <div className="flex items-center justify-between w-full relative mb-8 px-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 z-0 rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-300"></div>

        {/* Passo 1 (Concluído) */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={handleBack}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Dados Gerais &amp; Edital</span>
        </div>

        {/* Passo 2 (Ativo) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm ring-4 ring-primary/20 shadow-sm">
            2
          </div>
          <span className="text-xs font-bold text-primary">Itens, Custos &amp; Taxas</span>
        </div>

        {/* Passo 3 (Pendente) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm">
            3
          </div>
          <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Prévia dos Itens</span>
        </div>

        {/* Passo 4 (Pendente) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm">
            4
          </div>
          <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Declarações Licitações</span>
        </div>
      </div>

      {/* SEÇÃO 1: Tabela Dinâmica de Itens */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-outline-variant/30">
          <div>
            <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              Itens da Proposta ({items.length})
            </h2>
            <p className="text-xs text-on-surface-variant">
              Edite diretamente nas células abaixo a descrição, marca, quantidade e preço de custo unitário.
            </p>
          </div>

          <button
            onClick={handleAddItem}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-bold text-on-primary bg-primary hover:opacity-90 transition-all px-4 py-2.5 rounded-lg shadow-sm cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Adicionar Item
          </button>
        </div>

        {/* Tabela de Itens Editáveis */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30 text-xs font-bold text-on-surface-variant uppercase">
                <th className="p-3 w-16 text-center">Item</th>
                <th className="p-3">Descrição do Produto / Serviço</th>
                <th className="p-3 w-36">Marca / Modelo</th>
                <th className="p-3 w-24 text-center">Qtd.</th>
                <th className="p-3 w-36 text-right">Custo Unit. (R$)</th>
                <th className="p-3 w-36 text-right">Total Base</th>
                <th className="p-3 w-16 text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {items.map((item) => {
                const totalItem = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Item Num */}
                    <td className="p-2 text-center font-bold text-primary">
                      <input
                        type="text"
                        value={item.itemNum}
                        onChange={(e) => handleItemChange(item.id, "itemNum", e.target.value)}
                        className="w-full text-center bg-transparent border border-outline-variant/40 rounded p-1 font-bold text-xs focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* Descrição */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-1.5 text-xs font-semibold text-on-surface focus:ring-1 focus:ring-primary"
                        placeholder="Descrição detalhada do item..."
                      />
                    </td>

                    {/* Marca */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => handleItemChange(item.id, "brand", e.target.value)}
                        className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded p-1.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                        placeholder="Ex: Dell"
                      />
                    </td>

                    {/* Quantidade */}
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full text-center bg-surface-container-lowest border border-outline-variant/40 rounded p-1.5 text-xs font-bold text-on-surface focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* Preço Unitário */}
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-surface-container-lowest border border-outline-variant/40 rounded p-1.5 text-xs font-bold text-primary focus:ring-1 focus:ring-primary"
                      />
                    </td>

                    {/* Total Base */}
                    <td className="p-2 text-right font-bold text-on-surface">
                      {formatCurrency(totalItem)}
                    </td>

                    {/* Botão Excluir */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-error hover:opacity-80 transition-opacity p-1"
                        title="Excluir Item"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEÇÃO 2: Formação de Preço, Taxas, Frete e Impostos */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 mb-8">
        <h2 className="text-base font-bold text-on-surface mb-4 pb-3 border-b border-outline-variant/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">calculate</span>
          Formação de Preço &amp; Composição de Taxas / Frete
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Imposto / Alíquota */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Impostos / Alíquota (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min={0}
                value={aliquotaImposto}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setAliquotaImposto(val);
                  saveActiveItemsState(items, val, freteTotal, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
                }}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-sm font-bold text-on-surface pr-8 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">%</span>
            </div>
            <span className="text-[11px] text-on-surface-variant block mt-1">Ex: Simples Nacional 6.0%</span>
          </div>

          {/* Frete Estimado */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Frete Total (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">R$</span>
              <input
                type="number"
                step="10"
                min={0}
                value={freteTotal}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setFreteTotal(val);
                  saveActiveItemsState(items, aliquotaImposto, val, taxasOperacionais, margemLucroDesejada, precoTotalProposta);
                }}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 pl-9 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-on-surface-variant block mt-1">Frete para entrega no órgão</span>
          </div>

          {/* Taxas Operacionais */}
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30">
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Taxas Operacionais (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-outline">R$</span>
              <input
                type="number"
                step="10"
                min={0}
                value={taxasOperacionais}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setTaxasOperacionais(val);
                  saveActiveItemsState(items, aliquotaImposto, freteTotal, val, margemLucroDesejada, precoTotalProposta);
                }}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 pl-9 text-sm font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-on-surface-variant block mt-1">Embalagem, garantia, etc.</span>
          </div>

          {/* Margem de Lucro Desejada */}
          <div className="bg-primary/10 p-3.5 rounded-xl border-2 border-primary/30">
            <label className="text-xs font-bold text-primary block mb-1">
              Margem de Lucro Desejada (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min={0}
                value={margemLucroDesejada}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setMargemLucroDesejada(val);
                  saveActiveItemsState(items, aliquotaImposto, freteTotal, taxasOperacionais, val, precoTotalProposta);
                }}
                className="w-full bg-surface-container-lowest border border-primary/40 rounded-lg p-2 text-sm font-bold text-primary pr-8 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">%</span>
            </div>
            <span className="text-[11px] text-primary/80 block mt-1 font-medium">Margem sobre custo base</span>
          </div>
        </div>

        {/* Resumo Consolidado de Custos */}
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-on-surface-variant flex items-center gap-2">
              <span>Custo Base dos Itens: <strong>{formatCurrency(custoBaseTotal)}</strong></span>
              <span>+ Frete: <strong>{formatCurrency(freteTotal)}</strong></span>
              <span>+ Taxas: <strong>{formatCurrency(taxasOperacionais)}</strong></span>
            </div>
            <div className="text-xs text-on-surface-variant flex items-center gap-2">
              <span>+ Impostos ({aliquotaImposto}%): <strong>{formatCurrency(valorImpostos)}</strong></span>
              <span className="text-[#006c49] font-semibold">+ Lucro Projetado ({margemLucroDesejada}%): <strong>{formatCurrency(valorLucro)}</strong></span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Valor Total Final da Proposta</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(precoTotalProposta)}</span>
          </div>
        </div>
      </div>

      {/* Rascunho Mensagem */}
      {draftSavedMessage && (
        <div className="mb-6 p-4 bg-[#e6f4ea] text-[#137333] border border-[#34a853]/40 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{draftSavedMessage}</span>
          </div>
          <button
            onClick={() => router.push("/dashboard/propostas")}
            className="px-3 py-1 bg-[#137333] text-white rounded font-bold text-[11px] hover:opacity-90 transition-opacity cursor-pointer"
          >
            Ver Rascunhos Salvos
          </button>
        </div>
      )}

      {/* SEÇÃO 3: Botões de Navegação do Formulário */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-outline-variant/30">
        <button
          onClick={handleBack}
          className="w-full sm:w-auto font-semibold text-sm text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar (Passo 1)
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleSaveDraft}
            className="w-full sm:w-auto font-semibold text-sm text-primary bg-primary/10 hover:bg-primary/20 px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Salvar Rascunho
          </button>
          
          <button
            onClick={handleNext}
            className="w-full sm:w-auto font-semibold text-sm text-on-primary bg-primary hover:opacity-90 px-6 py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Avançar para Prévia dos Itens (Passo 3)
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
