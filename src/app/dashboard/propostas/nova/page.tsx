"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NovaPropostaStep1Page() {
  const router = useRouter();

  // Estados dos Dados Gerais da Proposta
  const [numPregao, setNumPregao] = useState("PE 15/2023");
  const [uasg, setUasg] = useState("160045");
  const [orgao, setOrgao] = useState("Ministério da Saúde - Coordenação Geral de Logística");
  const [modalidade, setModalidade] = useState("Pregão Eletrônico (Lei 14.133/2021)");
  const [dataDisputa, setDataDisputa] = useState("2026-08-10T10:00");
  const [objeto, setObjeto] = useState(
    "Aquisição de microcomputadores de alto desempenho, monitores de 24 polegadas e nobreaks senoidais para atendimento das demandas da Secretaria de Atenção à Saúde."
  );

  // Estado do Upload / OCR
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState("");

  // Presets de demonstração para o Projeto Piloto
  const samplePresets = [
    {
      id: "preset-ti",
      title: "💻 Licitação TI & Microcomputadores",
      pregao: "PE 45/2023",
      uasg: "160045",
      orgao: "Ministério da Saúde - Coordenação de TI",
      modalidade: "Pregão Eletrônico (Lei 14.133/2021)",
      dataDisputa: "2026-08-15T14:00",
      objeto: "Aquisição de 10x Desktops Core i7, 20x Monitores 24 IPS e 5x Nobreaks Senoidais 1500VA.",
      items: [
        { id: "1", itemNum: "01", description: "Computador Desktop Intel Core i7 16GB SSD 512GB", brand: "Dell", quantity: 10, unitPrice: 3500.00 },
        { id: "2", itemNum: "02", description: "Monitor LED 24'' IPS Full HD 75Hz", brand: "LG", quantity: 20, unitPrice: 650.00 },
        { id: "3", itemNum: "03", description: "Nobreak Senoidal 1500VA Bivolt Automático", brand: "APC", quantity: 5, unitPrice: 1100.00 },
      ],
      aliquotaImposto: 6.0,
      freteTotal: 450.00,
      taxasOperacionais: 200.00,
      margemLucroDesejada: 20.0,
    },
    {
      id: "preset-moveis",
      title: "🏢 Licitação Mobiliário Ergonômico",
      pregao: "PE 102/2023",
      uasg: "170155",
      orgao: "Receita Federal do Brasil",
      modalidade: "Pregão Eletrônico (Lei 14.133/2021)",
      dataDisputa: "2026-08-20T09:30",
      objeto: "Fornecimento de cadeiras ergonômicas NR17, mesas de reunião executivas e gaveteiros de aço.",
      items: [
        { id: "1", itemNum: "01", description: "Cadeira Presidente Ergonômica NR17 Mesh", brand: "Flexform", quantity: 15, unitPrice: 890.00 },
        { id: "2", itemNum: "02", description: "Mesa de Reunião Oval 8 Lugares MDF 25mm", brand: "Cavaletti", quantity: 2, unitPrice: 2400.00 },
        { id: "3", itemNum: "03", description: "Gaveteiro Volante 4 Gavetas com Chave", brand: "Marelli", quantity: 10, unitPrice: 420.00 },
      ],
      aliquotaImposto: 8.5,
      freteTotal: 850.00,
      taxasOperacionais: 300.00,
      margemLucroDesejada: 25.0,
    },
    {
      id: "preset-redes",
      title: "⚡ Licitação Servidores & Redes Data Center",
      pregao: "PE 88/2023",
      uasg: "158990",
      orgao: "Exército Brasileiro - Comando de Comunicações",
      modalidade: "Pregão Eletrônico (Lei 14.133/2021)",
      dataDisputa: "2026-08-25T10:00",
      objeto: "Infraestrutura de alta disponibilidade para Data Center, Servidores Rack 2U e Switches Gerenciáveis 48P.",
      items: [
        { id: "1", itemNum: "01", description: "Servidor Rack 2U Dual Xeon 64GB RAM 2x 1.92TB SSD", brand: "HPE ProLiant", quantity: 2, unitPrice: 22500.00 },
        { id: "2", itemNum: "02", description: "Switch Gerenciável 48 Portas Gigabit PoE+", brand: "Cisco Catalyst", quantity: 4, unitPrice: 8900.00 },
        { id: "3", itemNum: "03", description: "Patch Panel 24 Portas Cat6 19 Polegadas", brand: "Furukawa", quantity: 12, unitPrice: 180.00 },
      ],
      aliquotaImposto: 6.0,
      freteTotal: 1200.00,
      taxasOperacionais: 500.00,
      margemLucroDesejada: 18.0,
    },
  ];

  // Carrega rascunho ativo se existir
  useEffect(() => {
    try {
      const savedGeneral = localStorage.getItem("destrava_active_proposal_general");
      if (savedGeneral) {
        const parsed = JSON.parse(savedGeneral);
        if (parsed.numPregao) setNumPregao(parsed.numPregao);
        if (parsed.uasg) setUasg(parsed.uasg);
        if (parsed.orgao) setOrgao(parsed.orgao);
        if (parsed.modalidade) setModalidade(parsed.modalidade);
        if (parsed.dataDisputa) setDataDisputa(parsed.dataDisputa);
        if (parsed.objeto) setObjeto(parsed.objeto);
      }
    } catch (e) {
      console.error("Erro ao carregar dados gerais", e);
    }
  }, []);

  // Salva no localStorage sempre que houver alteração
  const saveToLocalStorage = () => {
    const generalData = {
      numPregao,
      uasg,
      orgao,
      modalidade,
      dataDisputa,
      objeto,
    };
    localStorage.setItem("destrava_active_proposal_general", JSON.stringify(generalData));
  };

  // Aplica preset de exemplo de licitação antiga
  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setNumPregao(preset.pregao);
    setUasg(preset.uasg);
    setOrgao(preset.orgao);
    setModalidade(preset.modalidade);
    setDataDisputa(preset.dataDisputa);
    setObjeto(preset.objeto);

    // Salva Dados Gerais
    localStorage.setItem("destrava_active_proposal_general", JSON.stringify({
      numPregao: preset.pregao,
      uasg: preset.uasg,
      orgao: preset.orgao,
      modalidade: preset.modalidade,
      dataDisputa: preset.dataDisputa,
      objeto: preset.objeto,
    }));

    // Salva Itens do Preset
    const custoBaseTotal = preset.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const precoTotalProposta = custoBaseTotal * (1 + (preset.aliquotaImposto + preset.margemLucroDesejada) / 100) + preset.freteTotal + preset.taxasOperacionais;

    localStorage.setItem("destrava_active_proposal_items", JSON.stringify({
      items: preset.items,
      aliquotaImposto: preset.aliquotaImposto,
      freteTotal: preset.freteTotal,
      taxasOperacionais: preset.taxasOperacionais,
      margemLucroDesejada: preset.margemLucroDesejada,
      custoBaseTotal,
      precoTotalProposta,
    }));

    setPdfSuccessMessage(`⚡ Preset "${preset.title}" carregado com sucesso! Dados gerais e itens pré-preenchidos.`);
  };

  // Simulação de leitura OCR do Edital em PDF
  const handleSimulateOcr = () => {
    setIsProcessingPdf(true);
    setPdfSuccessMessage("");

    setTimeout(() => {
      setIsProcessingPdf(false);
      handleApplyPreset(samplePresets[0]);
    }, 1000);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    saveToLocalStorage();
    router.push("/dashboard/propostas/nova/itens");
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/propostas")}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
            title="Voltar para Propostas"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Nova Proposta - Dados do Edital</h1>
            <p className="text-sm text-on-surface-variant">
              Passo 1 de 4: Importe o arquivo do Edital ou selecione um modelo de licitação antiga para o projeto piloto.
            </p>
          </div>
        </div>
      </div>

      {/* Stepper de 4 Passos */}
      <div className="flex items-center justify-between w-full relative mb-8 px-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-variant -translate-y-1/2 z-0 rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-1/6 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-300"></div>

        {/* Passo 1 (Ativo) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm ring-4 ring-primary/20 shadow-sm">
            1
          </div>
          <span className="text-xs font-bold text-primary">Dados Gerais &amp; Edital</span>
        </div>

        {/* Passo 2 (Pendente) */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm">
            2
          </div>
          <span className="text-xs text-on-surface-variant font-medium hidden sm:block">Itens, Custos &amp; Taxas</span>
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

      {/* SEÇÃO DA LICITAÇÃO DE PILOTO (PRESETS RÁPIDOS) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 mb-8">
        <h2 className="text-base font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history_edu</span>
          Modelos de Licitações Antigas para o Projeto Piloto
        </h2>
        <p className="text-xs text-on-surface-variant mb-4">
          Clique em um dos modelos reais abaixo para preencher os dados gerais e os itens com preços e marcas predefinidos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {samplePresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className="p-4 rounded-xl border-2 border-outline-variant/40 hover:border-primary bg-surface-container-low hover:bg-primary/5 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-primary group-hover:underline block mb-1">
                  {preset.title}
                </span>
                <p className="text-xs font-bold text-on-surface mb-1">
                  {preset.pregao} — {preset.orgao}
                </p>
                <p className="text-[11px] text-on-surface-variant line-clamp-2">
                  {preset.objeto}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-outline-variant/30 flex justify-between items-center text-[11px] font-bold text-primary">
                <span>{preset.items.length} itens cadastrados</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Carregar Dados <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO 1: Upload do Edital PDF (OCR AI) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">cloud_upload</span>
            Importar Edital em PDF (Extração Inteligente via OCR / AI)
          </h2>
          <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full border border-primary/20">
            Automático
          </span>
        </div>

        <div className="border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 rounded-2xl p-6 text-center transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
          </div>
          <p className="text-sm font-semibold text-on-surface mb-1">
            Arraste e solte o arquivo do Edital (.PDF) aqui
          </p>
          <p className="text-xs text-on-surface-variant mb-4">
            Nosso motor de Inteligência Artificial irá ler o arquivo e preencher o formulário automaticamente.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <label className="cursor-pointer bg-surface-container hover:bg-surface-variant text-on-surface font-semibold text-xs px-4 py-2.5 rounded-lg border border-outline-variant transition-colors flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">file_open</span>
              Selecionar Arquivo PDF
              <input type="file" accept=".pdf" className="hidden" onChange={handleSimulateOcr} />
            </label>

            <button
              type="button"
              onClick={handleSimulateOcr}
              disabled={isProcessingPdf}
              className="bg-primary hover:opacity-90 text-on-primary font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              {isProcessingPdf ? "Extraindo dados com OCR..." : "Simular Leitura do Edital Exemplo"}
            </button>
          </div>

          {/* Estado de Processamento OCR */}
          {isProcessingPdf && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-primary">
              <span className="animate-spin material-symbols-outlined">sync</span>
              Analisando texto do PDF, identificando número do pregão, órgão e objeto...
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {pdfSuccessMessage && (
            <div className="mt-4 p-3 bg-[#e6f4ea] text-[#137333] border border-[#34a853]/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {pdfSuccessMessage}
            </div>
          )}
        </div>
      </div>

      {/* SEÇÃO 2: Formulário de Dados Gerais do Pregão */}
      <form onSubmit={handleNextStep} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
        <h2 className="text-base font-bold text-on-surface mb-4 pb-3 border-b border-outline-variant/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">edit_document</span>
          Dados Gerais da Licitação
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Número do Pregão / Edital *
            </label>
            <input
              type="text"
              required
              value={numPregao}
              onChange={(e) => setNumPregao(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: PE 15/2023"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              UASG / Código do Órgão
            </label>
            <input
              type="text"
              value={uasg}
              onChange={(e) => setUasg(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: 160045"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Órgão Licitante *
            </label>
            <input
              type="text"
              required
              value={orgao}
              onChange={(e) => setOrgao(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: Ministério da Saúde"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Modalidade
            </label>
            <select
              value={modalidade}
              onChange={(e) => setModalidade(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="Pregão Eletrônico (Lei 14.133/2021)">Pregão Eletrônico (Lei 14.133/2021)</option>
              <option value="Pregão Presencial">Pregão Presencial</option>
              <option value="Concorrência Eletrônica">Concorrência Eletrônica</option>
              <option value="Dispensa de Licitação">Dispensa de Licitação</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-on-surface-variant block mb-1">
            Data e Hora Limite da Disputa
          </label>
          <input
            type="datetime-local"
            value={dataDisputa}
            onChange={(e) => setDataDisputa(e.target.value)}
            className="w-full md:w-1/2 bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-on-surface-variant block mb-1">
            Objeto do Pregão / Resumo da Licitação
          </label>
          <textarea
            rows={3}
            value={objeto}
            onChange={(e) => setObjeto(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Descreva resumidamente o objeto da licitação..."
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={() => router.push("/dashboard/propostas")}
            className="px-5 py-2.5 text-sm font-semibold text-primary border border-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-on-primary bg-primary hover:opacity-90 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            Avançar para os Itens da Proposta
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </form>
    </div>
  );
}
