"use client";

import React, { useState, useEffect } from "react";

interface DeclarationGeneratorProps {
  company: {
    razaoSocial: string;
    cnpj: string;
    endereco: string;
    representanteLegal?: string;
    rgRepresentante?: string;
    cpfRepresentante?: string;
  };
  proposal: {
    numPregao: string;
    orgao: string;
  };
  initialType?: string;
}

export function DeclarationGenerator({ company, proposal, initialType = "unificada" }: DeclarationGeneratorProps) {
  const [selectedDecl, setSelectedDecl] = useState(initialType);

  // Cidade/Local pré-preenchido baseado no endereço ou padrão
  const defaultCity = company.endereco
    ? company.endereco.split("-").pop()?.trim() || "Macapá / AP"
    : "Macapá / AP";

  const defaultDate = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [localAssinatura, setLocalAssinatura] = useState(defaultCity);
  const [dataAssinatura, setDataAssinatura] = useState(defaultDate);
  const [customText, setCustomText] = useState("");

  // Atualiza a cidade padrão se os dados da empresa mudarem
  useEffect(() => {
    if (company.endereco) {
      const parts = company.endereco.split("-");
      if (parts.length > 0) {
        setLocalAssinatura(parts[parts.length - 1].trim());
      }
    }
  }, [company.endereco]);

  // Função para acionar o diálogo de impressão de alta qualidade (Ctrl + P)
  const handleTriggerPrint = () => {
    window.print();
  };

  // Gera o texto base da declaração selecionada
  const buildDeclarationText = (type: string, city: string, dateStr: string) => {
    let repName = (company as any).responsavel_nome || company.representanteLegal || "";
    let cpfVal = (company as any).responsavel_cpf || company.cpfRepresentante || "";
    let rgVal = (company as any).responsavel_rg || (company as any).rg || "";
    let cargoVal = (company as any).responsavel_cargo || "Sócio-Administrador";

    try {
      const compRaw = localStorage.getItem("destrava_user_company");
      if (compRaw) {
        const parsed = JSON.parse(compRaw);
        if (!repName) repName = parsed.responsavel_nome || parsed.responsavelNome || parsed.responsavelLegal || "";
        if (!cpfVal) cpfVal = parsed.responsavel_cpf || parsed.responsavelCpf || parsed.cpf || "";
        if (!rgVal) rgVal = parsed.responsavel_rg || parsed.responsavelRg || parsed.rg || "";
        if (parsed.responsavel_cargo) cargoVal = parsed.responsavel_cargo;
      }

      const personRaw = localStorage.getItem("destrava_user_person");
      if (personRaw) {
        const person = JSON.parse(personRaw);
        if (!repName) repName = person.nomeCompleto || person.nome || "";
        if (!cpfVal) cpfVal = person.cpf || "";
        if (!rgVal) rgVal = person.rg || "";
      }
    } catch (e) {}

    repName = repName || "Nome do Responsável Legal";
    cpfVal = cpfVal || "000.000.000-00";

    const repDoc = `CPF: ${cpfVal}${rgVal ? ` | RG: ${rgVal}` : ""}`;

    switch (type) {
      case "me_epp":
        return `DECLARAÇÃO DE ENQUADRAMENTO COMO MICROEMPRESA (ME) OU EMPRESA DE PEQUENO PORTE (EPP)\n\nPregão / Edital Nº: ${proposal.numPregao || "PE 01/2026"} — Órgão: ${proposal.orgao || "Órgão Licitante"}\n\nA empresa ${company.razaoSocial || "Razão Social da Empresa"}, inscrita no CNPJ nº ${company.cnpj || "00.000.000/0001-00"}, sediada em ${company.endereco || "Endereço da Empresa"}, DECLARA, sob as penas da Lei Complementar nº 123/2006 e alterações posteriores, que cumpre rigorosamente os requisitos legais para enquadramento como MICROEMPRESA (ME) ou EMPRESA DE PEQUENO PORTE (EPP), fazendo jus aos benefícios e tratamento diferenciado previstos na legislação licitatória.\n\nDeclaramos ainda que a empresa não se enquadra em nenhuma das hipóteses de vedação previstas no § 4º do artigo 3º da Lei Complementar nº 123/2006.\n\n${city}, ${dateStr}.\n\n\n_____________________________________________________\n${company.razaoSocial || "Razão Social da Empresa"}\n${repName} — ${repDoc}\nRepresentante Legal da Empresa`;

      case "unificada":
        return `DECLARAÇÃO UNIFICADA DE CUMPRIMENTO DOS REQUISITOS DE HABILITAÇÃO (IN 73/2022)\n\nPregão / Edital Nº: ${proposal.numPregao || "PE 01/2026"} — Órgão: ${proposal.orgao || "Órgão Licitante"}\n\nA empresa ${company.razaoSocial || "Razão Social da Empresa"}, inscrita no CNPJ nº ${company.cnpj || "00.000.000/0001-00"}, sediada em ${company.endereco || "Endereço da Empresa"}, por intermédio de seu representante legal Sr.(a) ${repName}, DECLARA, sob as penas da lei, para fins de participação na licitação em epígrafe, que:\n\n1. Cumpre plenamente todos os requisitos de habilitação definidos no Edital;\n2. Inexiste qualquer fato superveniente impeditivo de sua habilitação, estando ciente da obrigatoriedade de declarar ocorrências posteriores;\n3. Não emprega menor de 18 (dezoito) anos em trabalho noturno, perigoso ou insalubre e não emprega menor de 16 (dezesseis) anos, salvo na condição de aprendiz, a partir de 14 (quatorze) anos, nos termos do art. 7º, XXXIII da Constituição Federal;\n4. Sua proposta foi elaborada de maneira totalmente independente, não tendo havido qualquer acordo, conluio ou tentativa de influenciar a decisão da comissão de licitação;\n5. Está ciente de que as falsas declarações sujeitarão a empresa às sanções legais cabíveis previstas na Lei 14.133/2021 e demais legislações aplicáveis.\n\n${city}, ${dateStr}.\n\n\n_____________________________________________________\n${company.razaoSocial || "Razão Social da Empresa"}\n${repName} — ${repDoc}\nRepresentante Legal da Empresa`;

      case "independencia":
      case "independente":
        return `DECLARAÇÃO DE ELABORAÇÃO INDEPENDENTE DE PROPOSTA\n\nPregão / Edital Nº: ${proposal.numPregao || "PE 01/2026"} — Órgão: ${proposal.orgao || "Órgão Licitante"}\n\nA empresa ${company.razaoSocial || "Razão Social da Empresa"}, inscrita no CNPJ nº ${company.cnpj || "00.000.000/0001-00"}, por seu representante legal infra-assinado, DECLARA, sob as penas da lei, que:\n\na) A proposta apresentada para participar da presente licitação foi elaborada de maneira independente e o conteúdo da proposta não foi, no todo ou em parte, direta ou indiretamente, informado a qualquer outro licitante ou concorrente;\nb) Não tentou de qualquer modo induzir qualquer outro potencial licitante a participar ou não da referida licitação;\nc) Está plenamente ciente das sanções penais e administrativas aplicáveis em caso de declaração falsa.\n\n${city}, ${dateStr}.\n\n\n_____________________________________________________\n${company.razaoSocial || "Razão Social da Empresa"}\n${repName} — ${repDoc}\nRepresentante Legal da Empresa`;

      case "menor":
        return `DECLARAÇÃO DE CUMPRIMENTO DO ART. 7º, XXXIII DA CONSTITUIÇÃO FEDERAL (NÃO EMPREGO DE MENORES)\n\nPregão / Edital Nº: ${proposal.numPregao || "PE 01/2026"} — Órgão: ${proposal.orgao || "Órgão Licitante"}\n\nA empresa ${company.razaoSocial || "Razão Social da Empresa"}, inscrita no CNPJ nº ${company.cnpj || "00.000.000/0001-00"}, por intermédio de seu representante legal infra-assinado, DECLARA, sob as penas da lei, para fins de participação na licitação em epígrafe, em cumprimento ao inciso XXXIII do artigo 7º da Constituição Federal de 1988, que:\n\nNão emprega menor de 18 (dezoito) anos em trabalho noturno, perigoso ou insalubre, bem como não emprega menor de 16 (dezesseis) anos em qualquer trabalho, salvo na condição de aprendiz, a partir de 14 (quatorze) anos.\n\n${city}, ${dateStr}.\n\n\n_____________________________________________________\n${company.razaoSocial || "Razão Social da Empresa"}\n${repName} — ${repDoc}\nRepresentante Legal da Empresa`;

      default:
        return "";
    }
  };

  // Recalcula o texto quando muda a declaração, cidade ou data
  useEffect(() => {
    setCustomText(buildDeclarationText(selectedDecl, localAssinatura, dataAssinatura));
  }, [selectedDecl, localAssinatura, dataAssinatura, company, proposal]);

  // Função de Impressão Direta
  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* CSS exclusivo de impressão A4 formatada para a declaração */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-declaration, #printable-declaration * {
            visibility: visible !important;
          }
          #printable-declaration {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 25px !important;
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

      {/* 4 BOTÕES DE SELEÇÃO RÁPIDA DAS DECLARAÇÕES OBRIGATÓRIAS */}
      <div>
        <label className="text-xs font-bold text-on-surface-variant block mb-2 uppercase tracking-wider">
          1. Selecione a Declaração Obrigatória para Emitir:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setSelectedDecl("me_epp")}
            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              selectedDecl === "me_epp"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-lg">business</span>
              <span className="text-xs font-bold">1. ME / EPP</span>
            </div>
            <span className="text-[11px] opacity-80 leading-tight block">Enquadramento LC 123/06</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecl("unificada")}
            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              selectedDecl === "unificada"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-lg">gavel</span>
              <span className="text-xs font-bold">2. Unificada (IN 73)</span>
            </div>
            <span className="text-[11px] opacity-80 leading-tight block">Sem fatos impeditivos</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecl("independente")}
            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              selectedDecl === "independente" || selectedDecl === "independencia"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-lg">balance</span>
              <span className="text-xs font-bold">3. Independente</span>
            </div>
            <span className="text-[11px] opacity-80 leading-tight block">Elaboração autônoma</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedDecl("menor")}
            className={`p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
              selectedDecl === "menor"
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-lg">child_care</span>
              <span className="text-xs font-bold">4. Trabalho do Menor</span>
            </div>
            <span className="text-[11px] opacity-80 leading-tight block">Art. 7º, XXXIII da CF</span>
          </button>
        </div>
      </div>

      {/* Painel Superior: Seleção e Botão de Impressão */}
      <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <select
                value={selectedDecl}
                onChange={(e) => setSelectedDecl(e.target.value)}
                className="w-full text-sm font-bold text-primary bg-surface-container-lowest border-2 border-primary/40 rounded-xl p-3 pr-10 shadow-sm focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none"
              >
                <option value="me_epp">🏢 1. Declaração de Enquadramento ME / EPP (Lei 123/2006)</option>
                <option value="unificada">📜 2. Declaração Unificada de Habilitação (IN 73/2022)</option>
                <option value="independente">🤝 3. Declaração de Elaboração Independente de Proposta</option>
                <option value="menor">👶 4. Declaração de Não Emprego de Menores (Art. 7º CF)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-2xl">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* Botão de Impressão Destaque */}
          <div className="md:self-end flex items-center gap-2">
            <button
              onClick={handlePrintDocument}
              className="w-full md:w-auto bg-primary hover:opacity-90 text-on-primary font-bold px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">print</span>
              Imprimir / Salvar PDF A4
            </button>
          </div>
        </div>

        {/* Campos de Local e Data Pré-Preenchidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-outline-variant/30">
          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Cidade / Local da Assinatura:
            </label>
            <input
              type="text"
              value={localAssinatura}
              onChange={(e) => setLocalAssinatura(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: Macapá / AP"
            />
            <span className="text-[11px] text-on-surface-variant/80 block mt-0.5">
              Pré-preenchido com o endereço da sua empresa.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface-variant block mb-1">
              Data da Assinatura:
            </label>
            <input
              type="text"
              value={dataAssinatura}
              onChange={(e) => setDataAssinatura(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: 29 de julho de 2026"
            />
            <span className="text-[11px] text-on-surface-variant/80 block mt-0.5">
              Pré-preenchido com a data de hoje.
            </span>
          </div>
        </div>
      </div>

      {/* Editor de Texto da Declaração na Tela */}
      <div>
        <label className="text-xs font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">
          2. Texto da Declaração (Editável se necessário):
        </label>
        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          rows={8}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-xs font-mono text-on-surface leading-relaxed focus:ring-2 focus:ring-primary focus:outline-none shadow-inner mb-6"
        />
      </div>

      {/* PRÉVIA A4 VISÍVEL NA TELA E PRONTA PARA IMPRESSÃO (Sem wrapper 'hidden') */}
      <div>
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-primary">visibility</span>
          Prévia Oficial do Documento A4 para Impressão:
        </h3>

        <div className="flex justify-center">
          <div 
            id="printable-declaration" 
            className="bg-white text-slate-900 font-sans p-8 md:p-12 max-w-[794px] w-full min-h-[950px] shadow-lg rounded-sm border border-slate-300 text-sm leading-relaxed relative flex flex-col justify-between"
          >
            <div>
              {/* Cabeçalho da Empresa & Licitação */}
              <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                  {company.razaoSocial || "Razão Social da Empresa"}
                </h2>
                <p className="text-xs font-semibold text-slate-600">CNPJ: {company.cnpj || "00.000.000/0001-00"}</p>
                <p className="text-xs text-slate-500">{company.endereco || "MACAPA / AP"}</p>
              </div>

              {/* Referência do Edital */}
              <div className="bg-slate-100 p-3 rounded mb-6 text-xs text-slate-800 font-medium">
                <p><strong>LICITAÇÃO / PROCESSO:</strong> {proposal.numPregao || "PE 15/2023"}</p>
                <p><strong>ÓRGÃO PÚBLICO LICITANTE:</strong> {proposal.orgao || "Ministério da Saúde"}</p>
              </div>

              {/* Texto da Declaração Formatado */}
              <div className="whitespace-pre-wrap text-slate-900 text-xs leading-relaxed text-justify mb-12">
                {customText}
              </div>
            </div>

            {/* Rodapé Elegante com Marca do Sistema */}
            <div className="border-t border-slate-300 pt-4 text-center mt-12">
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Documento emitido eletronicamente através do sistema Destrava Proposta Gov — Plataforma de Gestão de Licitações
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
