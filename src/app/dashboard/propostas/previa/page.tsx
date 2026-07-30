"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PreviaPropostaPage() {
  const router = useRouter();

  const [generalData, setGeneralData] = useState<any>({
    numPregao: "PE 15/2023",
    uasg: "160045",
    orgao: "Ministério da Saúde - Coordenação Geral de Logística",
    modalidade: "Pregão Eletrônico (Lei 14.133/2021)",
    objeto: "Aquisição de equipamentos de tecnologia da informação.",
  });

  const [itemsData, setItemsData] = useState<any>({
    items: [
      { id: "1", itemNum: "01", description: "Computador Desktop Intel Core i7 16GB SSD 512GB", brand: "Dell", quantity: 10, unitPrice: 3500 },
      { id: "2", itemNum: "02", description: "Monitor LED 24'' IPS Full HD 75Hz", brand: "LG", quantity: 20, unitPrice: 650 },
    ],
    aliquotaImposto: 6.0,
    freteTotal: 450,
    taxasOperacionais: 200,
    margemLucroDesejada: 20,
    precoTotalProposta: 63000,
  });

  const [companyData, setCompanyData] = useState<any>({
    razaoSocial: "Razão Social da Empresa",
    cnpj: "00.000.000/0001-00",
    endereco: "Endereço da Empresa",
  });

  // Carrega dados salvos do localStorage no mount
  useEffect(() => {
    try {
      const savedGeneral = localStorage.getItem("destrava_active_proposal_general");
      if (savedGeneral) {
        setGeneralData(JSON.parse(savedGeneral));
      }

      const savedItems = localStorage.getItem("destrava_active_proposal_items");
      if (savedItems) {
        setItemsData(JSON.parse(savedItems));
      }

      // Dados da empresa cadastrada no onboarding
      const companyOnboarding = localStorage.getItem("destrava_user_company");
      if (companyOnboarding) {
        const parsedComp = JSON.parse(companyOnboarding);
        setCompanyData({
          razaoSocial: parsedComp.razao_social || parsedComp.nome_fantasia || "Razão Social da Empresa",
          cnpj: parsedComp.cnpj || "00.000.000/0001-00",
          endereco: parsedComp.logradouro ? `${parsedComp.logradouro}, ${parsedComp.numero} - ${parsedComp.bairro}, ${parsedComp.municipio}/${parsedComp.uf}` : "Endereço da Empresa",
        });
      }
    } catch (e) {
      console.error("Erro ao carregar dados na prévia", e);
    }
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  // Cálculo de Preço de Venda Unitário por item
  const calculateSellingUnitPrice = (itemBaseUnitPrice: number) => {
    const imp = itemsData.aliquotaImposto || 6;
    const mg = itemsData.margemLucroDesejada || 20;
    
    // Custo com Margem e Impostos
    const priceWithMarginAndTax = itemBaseUnitPrice * (1 + (imp + mg) / 100);
    return priceWithMarginAndTax;
  };

  // Soma Total da Proposta
  const calculatedGrandTotal = itemsData.items
    ? itemsData.items.reduce((acc: number, item: any) => {
        const sellingPrice = calculateSellingUnitPrice(Number(item.unitPrice) || 0);
        return acc + sellingPrice * (Number(item.quantity) || 1);
      }, 0) + (itemsData.freteTotal || 0) + (itemsData.taxasOperacionais || 0)
    : itemsData.precoTotalProposta || 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* CSS para Impressão limpa apenas da Folha A4 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-proposal, #printable-proposal * {
            visibility: visible !important;
          }
          #printable-proposal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
        }
      `}</style>

      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/propostas/nova/itens")}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
            title="Voltar para Passo 2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Prévia dos Itens &amp; Documento Comercial</h1>
            <p className="text-sm text-on-surface-variant">
              Passo 3 de 4: Confira a proposta impressa exatamente no padrão A4 oficial para o edital.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard/propostas/nova/itens")}
          className="px-4 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/30 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Editar Itens
        </button>
      </div>

      {/* Stepper de 4 Passos */}
      <div className="flex items-center justify-between w-full relative mb-8 px-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 z-0 rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-5/6 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-300"></div>

        {/* Passo 1 (Concluído) */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={() => router.push("/dashboard/propostas/nova")}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Dados Gerais &amp; Edital</span>
        </div>

        {/* Passo 2 (Concluído) */}
        <div className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" onClick={() => router.push("/dashboard/propostas/nova/itens")}>
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-base">check</span>
          </div>
          <span className="text-xs text-primary font-semibold">Itens, Custos &amp; Taxas</span>
        </div>

        {/* Passo 3 (Ativo) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm ring-4 ring-primary/20 shadow-sm">
            3
          </div>
          <span className="text-xs font-bold text-primary">Prévia dos Itens</span>
        </div>

        {/* Passo 4 (Pendente) */}
        <div 
          className="relative z-10 flex flex-col items-center gap-1 cursor-pointer" 
          onClick={() => router.push("/dashboard/propostas/declaracoes")}
        >
          <div className="w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm hover:bg-primary/20">
            4
          </div>
          <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Declarações Licitações</span>
        </div>
      </div>

      {/* Layout Principal da Prévia */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Folha da Proposta (Folha A4 Simulada) */}
        <section className="flex-grow flex justify-center">
          <div 
            id="printable-proposal"
            className="bg-white text-slate-900 w-full max-w-[794px] min-h-[1050px] shadow-lg rounded-sm p-8 md:p-12 border border-slate-300 font-sans text-sm relative"
          >
            
            {/* Cabeçalho Oficial do Documento */}
            <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
              <h2 className="text-2xl font-bold tracking-wider text-slate-900 uppercase">PROPOSTA COMERCIAL DE PREÇOS</h2>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-1">PROCESSO LICITATÓRIO</p>
            </div>
            
            {/* Dados de Referência e Proponente */}
            <div className="mb-6 space-y-2 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
              <p><strong className="text-slate-900 font-bold">AO ÓRGÃO LICITANTE:</strong> {generalData.orgao}</p>
              <p><strong className="text-slate-900 font-bold">REFERÊNCIA:</strong> {generalData.numPregao} | UASG: {generalData.uasg}</p>
              <p><strong className="text-slate-900 font-bold">MODALIDADE:</strong> {generalData.modalidade}</p>
              <p><strong className="text-slate-900 font-bold">PROPONENTE:</strong> {companyData.razaoSocial} — CNPJ: {companyData.cnpj}</p>
              <p><strong className="text-slate-900 font-bold">ENDEREÇO:</strong> {companyData.endereco}</p>
              {generalData.objeto && (
                <p><strong className="text-slate-900 font-bold">OBJETO:</strong> {generalData.objeto}</p>
              )}
            </div>
            
            {/* Tabela de Itens e Valores da Proposta */}
            <div className="overflow-x-auto mb-6 border border-slate-300 rounded">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-300 uppercase">
                  <tr>
                    <th className="p-2.5 w-12 text-center">Item</th>
                    <th className="p-2.5">Descrição dos Bens / Serviços</th>
                    <th className="p-2.5 w-24">Marca / Modelo</th>
                    <th className="p-2.5 w-16 text-center">Qtd.</th>
                    <th className="p-2.5 w-28 text-right">Valor Unit. (R$)</th>
                    <th className="p-2.5 w-32 text-right">Valor Total (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {itemsData.items && itemsData.items.map((item: any) => {
                    const unitSellPrice = calculateSellingUnitPrice(Number(item.unitPrice) || 0);
                    const lineTotal = unitSellPrice * (Number(item.quantity) || 1);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5 text-center font-bold text-slate-900">{item.itemNum}</td>
                        <td className="p-2.5 font-medium text-slate-800">{item.description}</td>
                        <td className="p-2.5 text-slate-600 font-mono">{item.brand}</td>
                        <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                        <td className="p-2.5 text-right font-semibold">{formatCurrency(unitSellPrice)}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">{formatCurrency(lineTotal)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-900 font-bold text-slate-900">
                  <tr>
                    <td className="p-3 text-right uppercase" colSpan={5}>VALOR TOTAL GERAL DA PROPOSTA:</td>
                    <td className="p-3 text-right text-sm text-blue-900">{formatCurrency(calculatedGrandTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Prazos e Condições Obrigatórias */}
            <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
              <h3 className="font-bold text-slate-900 mb-2 uppercase">Condições da Proposta</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li><strong>Validade da Proposta:</strong> 60 (sessenta) dias a contar da data de sua apresentação.</li>
                <li><strong>Prazo de Entrega:</strong> Conforme estabelecido no Termo de Referência do Edital.</li>
                <li><strong>Garantia:</strong> 12 (doze) meses com assistência técnica autorizada do fabricante.</li>
                <li><strong>Impostos e Encargos:</strong> Inclusos todos os tributos, encargos sociais e trabalhistas.</li>
              </ul>
            </div>
            
            {/* Declaração Padrão */}
            <div className="mb-8 text-xs text-slate-700 text-justify leading-relaxed">
              <p>
                Declaramos que nos preços propostos estão inclusas todas as despesas diretas e indiretas, frete, impostos e contribuições cabíveis. Declaramos ainda pleno conhecimento e concordância com todos os termos e especificações constantes do Edital e seus Anexos.
              </p>
            </div>
            
            {/* Assinatura do Representante */}
            <div className="mt-12 pt-8 border-t border-slate-300 text-center">
              <p className="text-xs text-slate-600 mb-8 font-medium">
                {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <div className="w-72 border-t-2 border-slate-900 mx-auto mb-2"></div>
              <p className="font-bold text-slate-900 uppercase text-xs">{companyData.razaoSocial}</p>
              <p className="text-xs text-slate-600">Representante Legal da Empresa</p>
            </div>

          </div>
        </section>

        {/* Painel Lateral de Ações */}
        <aside className="lg:w-72 flex flex-col gap-3 sticky top-24 h-fit">
          <button 
            onClick={() => window.print()}
            className="w-full bg-primary hover:opacity-90 text-on-primary font-bold py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">print</span>
            Imprimir A4 / Salvar PDF
          </button>
          
          <button 
            onClick={() => router.push("/dashboard/propostas/declaracoes")}
            className="w-full bg-primary/10 border-2 border-primary/40 text-primary hover:bg-primary/20 transition-all font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Avançar para Declarações (Passo 4)
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button 
            onClick={() => router.push("/dashboard/propostas/nova/itens")}
            className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Editar Itens &amp; Custos
          </button>
        </aside>

      </div>
    </div>
  );
}
