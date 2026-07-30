"use client";

import React, { useState, useEffect } from "react";

export default function DeclaraUnificadaPage() {
  const [company, setCompany] = useState({
    razaoSocial: "Razão Social da Empresa",
    cnpj: "00.000.000/0001-00",
    endereco: "Endereço da Empresa",
  });

  const [legalResp, setLegalResp] = useState({
    nome: "Nome do Responsável Legal",
    cpf: "000.000.000-00",
    rg: "",
    cargo: "Sócio-Administrador",
  });

  const [proposal, setProposal] = useState({
    numPregao: "PE 01/2026",
    orgao: "Órgão Licitante",
  });

  const [cidadeData, setCidadeData] = useState("Brasília / DF");
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
          razaoSocial: parsed.razao_social || parsed.nome_fantasia || "Razão Social da Empresa",
          cnpj: parsed.cnpj || "00.000.000/0001-00",
          endereco: parsed.logradouro ? `${parsed.logradouro}, ${parsed.numero} - ${parsed.bairro}, ${parsed.municipio}/${parsed.uf}` : "Endereço da Empresa",
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
        nome: respNome || "Nome do Responsável Legal",
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
          <span className="material-symbols-outlined text-primary text-2xl">gavel</span>
          <div>
            <h1 className="text-base font-bold text-slate-900">Declaração Unificada (IN 73/2022)</h1>
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
              DECLARAÇÃO UNIFICADA DE CUMPRIMENTO DOS REQUISITOS DE HABILITAÇÃO
            </h3>

            {/* Conteúdo da Declaração */}
            <div className="space-y-4 text-xs md:text-sm text-slate-900 text-justify leading-relaxed">
              <p>
                A empresa <strong>{company.razaoSocial}</strong>, inscrita no CNPJ sob o nº <strong>{company.cnpj}</strong>, com sede em {company.endereco}, por seu representante legal Sr.(a) <strong>{legalResp.nome}</strong>, inscrito(a) no CPF sob o nº <strong>{legalResp.cpf}</strong>{legalResp.rg ? ` e RG nº ${legalResp.rg}` : ""}, <strong>DECLARA</strong>, sob as penas da lei, para fins de participação na licitação <strong>{proposal.numPregao}</strong> junto ao <strong>{proposal.orgao}</strong>, que:
              </p>

              <p className="pl-4 border-l-2 border-slate-300">
                <strong>1. REQUISITOS DE HABILITAÇÃO:</strong> Cumpre plenamente todos os requisitos de habilitação exigidos no instrumento convocatório, possuindo toda a documentação legal em dia e válida;
              </p>

              <p className="pl-4 border-l-2 border-slate-300">
                <strong>2. INEXISTÊNCIA DE FATOS IMPEDITIVOS:</strong> Inexiste qualquer fato superveniente impeditivo de sua habilitação ou participação nesta licitação, comprometendo-se a informar eventuais ocorrências posteriores;
              </p>

              <p className="pl-4 border-l-2 border-slate-300">
                <strong>3. TRABALHO DO MENOR:</strong> Não emprega menor de 18 (dezoito) anos em trabalho noturno, perigoso ou insalubre e não emprega menor de 16 (dezesseis) anos, salvo na condição de aprendiz a partir dos 14 anos, nos termos do art. 7º, XXXIII da Constituição Federal;
              </p>

              <p className="pl-4 border-l-2 border-slate-300">
                <strong>4. ELABORAÇÃO INDEPENDENTE:</strong> Sua proposta comercial foi elaborada de forma totalmente independente, sem acordo, conluio ou combinação de preços com concorrentes.
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
