"use client";

import React, { useState, useEffect } from "react";

export default function DeclaraIndependentePage() {
  const [company, setCompany] = useState({
    razaoSocial: "INFOR TECH SOLUCOES (DALTON A. B. PEREIRA)",
    cnpj: "39.335.069/0001-01",
    endereco: "AL LAGOA DAS GARCAS, Nº 71, CASA - ALVORADA, MACAPA / AP",
  });

  const [legalResp, setLegalResp] = useState({
    nome: "Dalton Abdon B. Pereira",
    cpf: "000.000.000-00",
    rg: "",
    cargo: "Sócio-Administrador",
  });

  const [proposal, setProposal] = useState({
    numPregao: "PE 15/2023",
    orgao: "Ministério da Saúde - Coordenação Geral de Logística",
  });

  const [cidadeData, setCidadeData] = useState("Macapá / AP");
  const [dataExtenso, setDataExtenso] = useState(
    new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
  );

  useEffect(() => {
    try {
      let respNome = "";
      let respCpf = "";
      let respRg = "";
      let respCargo = "Representante Legal";

      const compRaw = localStorage.getItem("destrava_user_company");
      if (compRaw) {
        const parsed = JSON.parse(compRaw);
        setCompany({
          razaoSocial: parsed.razao_social || parsed.nome_fantasia || "INFOR TECH SOLUCOES",
          cnpj: parsed.cnpj || "39.335.069/0001-01",
          endereco: parsed.logradouro ? `${parsed.logradouro}, ${parsed.numero} - ${parsed.bairro}, ${parsed.municipio}/${parsed.uf}` : "AL LAGOA DAS GARCAS, Nº 71, CASA - ALVORADA, MACAPA / AP",
        });

        if (parsed.municipio && parsed.uf) {
          setCidadeData(`${parsed.municipio} / ${parsed.uf}`);
        }

        respNome = parsed.responsavel_nome || parsed.responsavelNome || parsed.responsavelLegal || "";
        respCpf = parsed.responsavel_cpf || parsed.responsavelCpf || parsed.cpf || "";
        respRg = parsed.responsavel_rg || parsed.responsavelRg || parsed.rg || "";
        respCargo = parsed.responsavel_cargo || parsed.cargo || "Sócio-Administrador";
      }

      const personRaw = localStorage.getItem("destrava_user_person");
      if (personRaw) {
        const person = JSON.parse(personRaw);
        if (!respNome) respNome = person.nomeCompleto || person.nome || "";
        if (!respCpf) respCpf = person.cpf || "";
        if (!respRg) respRg = person.rg || "";
      }

      setLegalResp({
        nome: respNome || "Dalton Abdon B. Pereira",
        cpf: respCpf || "000.000.000-00",
        rg: respRg,
        cargo: respCargo || "Sócio-Administrador",
      });

      const activeGen = localStorage.getItem("destrava_active_proposal_general");
      if (activeGen) {
        const parsedGen = JSON.parse(activeGen);
        setProposal({
          numPregao: parsedGen.numPregao || "PE 15/2023",
          orgao: parsedGen.orgao || "Ministério da Saúde",
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-900 print:bg-white print:p-0">
      {/* Botões de Ação na Tela (Ocultos na Impressão) */}
      <div className="max-w-[794px] mx-auto mb-6 flex items-center justify-between print:hidden bg-white p-4 rounded-xl shadow-md border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">balance</span>
          <div>
            <h1 className="text-base font-bold text-slate-900">Declaração de Proposta Independente</h1>
            <p className="text-xs text-slate-500">Página Individual Oficial — Pronta para Impressão Direta (A4)</p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="bg-primary hover:opacity-90 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">print</span>
          Imprimir Declaração (Ctrl + P / PDF)
        </button>
      </div>

      {/* DOCUMENTO OFICIAL FORMATADO PARA A4 */}
      <div className="flex justify-center">
        <div className="bg-white text-slate-900 font-sans p-10 md:p-14 max-w-[794px] w-full min-h-[1050px] shadow-2xl rounded-sm border border-slate-300 text-sm leading-relaxed flex flex-col justify-between print:shadow-none print:border-none print:w-full print:max-w-none print:min-h-0 print:p-0">
          <div>
            {/* Cabeçalho Oficial da Empresa */}
            <div className="border-b-2 border-slate-900 pb-5 mb-8 text-center">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
                {company.razaoSocial}
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-1">CNPJ Nº {company.cnpj}</p>
              <p className="text-xs text-slate-500 mt-0.5">{company.endereco}</p>
            </div>

            {/* Referência da Licitação */}
            <div className="bg-slate-100 p-3.5 rounded mb-8 text-xs text-slate-800 font-semibold border-l-4 border-slate-900">
              <p>LICITAÇÃO / PROCESSO: {proposal.numPregao}</p>
              <p>ÓRGÃO PÚBLICO LICITANTE: {proposal.orgao}</p>
            </div>

            {/* Título do Documento */}
            <h3 className="text-center font-bold text-base text-slate-900 uppercase tracking-wider mb-8 border-b border-slate-300 pb-2">
              DECLARAÇÃO DE ELABORAÇÃO INDEPENDENTE DE PROPOSTA
            </h3>

            {/* Conteúdo da Declaração */}
            <div className="space-y-4 text-xs md:text-sm text-slate-900 text-justify leading-relaxed">
              <p>
                A empresa <strong>{company.razaoSocial}</strong>, inscrita no CNPJ sob o nº <strong>{company.cnpj}</strong>, por seu representante legal Sr.(a) <strong>{legalResp.nome}</strong>, inscrito(a) no CPF sob o nº <strong>{legalResp.cpf}</strong>{legalResp.rg ? ` e RG nº ${legalResp.rg}` : ""}, <strong>DECLARA</strong>, sob as penas da lei, para fins do disposto na licitação <strong>{proposal.numPregao}</strong> promovida pelo <strong>{proposal.orgao}</strong>, que:
              </p>

              <p className="pl-4 border-l-2 border-slate-300 italic">
                1. A proposta apresentada para participar da presente licitação foi elaborada de maneira totalmente independente pelo proponente, e o seu conteúdo não foi, no todo ou em parte, direta ou indiretamente, informado, discutido ou recebido de qualquer outro participante potencial ou de fato;
              </p>

              <p className="pl-4 border-l-2 border-slate-300 italic">
                2. A intenção de apresentar a proposta não foi informada, discutida ou recebida de qualquer outro proponente potencial ou de fato;
              </p>

              <p className="pl-4 border-l-2 border-slate-300 italic">
                3. Não tentou, por qualquer meio ou entidade, induzir a qualquer outro proponente potencial ou de fato a apresentar ou não uma proposta para a referida licitação;
              </p>

              <p className="pl-4 border-l-2 border-slate-300 italic">
                4. Está plenamente ciente das sanções disciplinares e legais aplicáveis em caso de constatação de conduta anticompetitiva.
              </p>
            </div>

            <div className="mt-16 text-center">
              <p className="text-xs text-slate-800">{cidadeData}, {dataExtenso}.</p>
            </div>

            {/* Campo de Assinatura Completo e Oficial */}
            <div className="mt-20 text-center flex flex-col items-center">
              <div className="w-80 border-t-2 border-slate-900 pt-2 text-center">
                <p className="font-bold text-xs uppercase text-slate-900">{company.razaoSocial}</p>
                <p className="text-xs text-slate-800 font-bold mt-1">{legalResp.nome}</p>
                <p className="text-[11px] text-slate-600 font-medium">
                  CPF: {legalResp.cpf}{legalResp.rg ? ` | RG: ${legalResp.rg}` : ""}
                </p>
                <p className="text-[11px] text-slate-500 italic">{legalResp.cargo}</p>
              </div>
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
  );
}
