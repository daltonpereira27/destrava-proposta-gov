"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UploadedFile {
  name: string;
  size: string;
  date: string;
}

export default function ChecklistPage() {
  const router = useRouter();
  
  const [openSection, setOpenSection] = useState<string | null>("juridica");

  // Estado dinâmico dos 8 documentos do checklist
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    contratoSocial: true,
    cartaoCnpj: true,
    cndFederal: true,
    cndtTrabalhista: true,
    crfFgts: true,
    cndEstadual: false,
    cndMunicipal: false,
    atestadoTecnico: false,
  });

  // Estado dos arquivos anexados por documento
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({
    contratoSocial: { name: "Contrato_Social_Consolidado_2026.pdf", size: "2.4 MB", date: "28/07/2026" },
    cartaoCnpj: { name: "Cartao_CNPJ_Receita_Federal.pdf", size: "480 KB", date: "29/07/2026" },
    cndFederal: { name: "CND_Federal_PGFN_Valida.pdf", size: "1.1 MB", date: "25/07/2026" },
    cndtTrabalhista: { name: "CNDT_Justica_do_Trabalho.pdf", size: "620 KB", date: "29/07/2026" },
    crfFgts: { name: "CRF_FGTS_Caixa.pdf", size: "390 KB", date: "27/07/2026" },
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Alterna verificação da caixa de seleção
  const handleToggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Simula upload de anexo para a caixa de seleção
  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const sizeKb = (file.size / 1024).toFixed(0);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

      setUploadedFiles((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: formattedSize,
          date: new Date().toLocaleDateString("pt-BR"),
        },
      }));

      // Marcar checkbox automaticamente como concluído ao enviar anexo!
      setCheckedItems((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
  };

  // Remove anexo
  const handleRemoveFile = (key: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Cálculo dinâmico do progresso
  const totalItemsCount = Object.keys(checkedItems).length;
  const completedItemsCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedItemsCount / totalItemsCount) * 100);

  // Ação para gerar declaração e abrir diálogo de impressão / nova guia
  const handleGenerateDeclaration = (docType: string) => {
    const url = `/dashboard/propostas/declaracoes?type=${docType}`;
    // Abre em nova aba sem bloqueio e aciona visualização de emissão
    window.open(url, "_blank");
  };

  // Ação de download da pasta completa do processo
  const handleDownloadFullDossier = () => {
    if (progressPercent < 100) {
      alert(`⚠️ Você possui ${completedItemsCount} de ${totalItemsCount} documentos prontos (${progressPercent}%). Complete 100% para baixar o dossiê final.`);
      return;
    }
    alert("📦 Baixando Dossiê Completo de Habilitação (.ZIP) contendo todas as Certidões, Contrato Social e Declarações Assinadas!");
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Top Navigation for Checklist */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => router.push("/dashboard")}
          className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors border border-outline-variant/40"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Checklist Anti-Desclassificação &amp; Anexos</h1>
            <p className="text-xs text-on-surface-variant">
              Verifique os requisitos, envie os anexos (Drag &amp; Drop) e baixe a pasta completa do seu processo habilitatório.
            </p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* BARRA DE PROGRESSO DINÂMICA COM STATUS GERAL */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border-2 border-primary/30 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Status Global de Habilitação
              </span>
              <h3 className="font-bold text-base text-on-surface">
                {completedItemsCount} de {totalItemsCount} Documentos Verificados
              </h3>
            </div>
            <span className={`text-xl font-bold ${progressPercent === 100 ? "text-[#137333]" : "text-primary"}`}>
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-surface-variant rounded-full h-3.5 overflow-hidden shadow-inner">
            <div 
              className={`h-3.5 rounded-full transition-all duration-500 ${progressPercent === 100 ? "bg-[#34a853]" : "bg-primary"}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* BOTÃO FINAL DE BAIXAR O PROCESSO COMPLETO CUJO PREENCHIMENTO ATINGE 100% */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-outline-variant/20">
            <span className="text-xs text-on-surface-variant font-medium">
              {progressPercent === 100 
                ? "🎉 Todos os documentos e anexos estão prontos para envio!" 
                : "💡 Anexe ou cheque todos os itens para liberar o download em lote da pasta."}
            </span>

            <button
              onClick={handleDownloadFullDossier}
              disabled={progressPercent < 100}
              className={`px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                progressPercent === 100
                  ? "bg-[#137333] hover:bg-[#0f5927] text-white animate-pulse"
                  : "bg-surface-container-high text-on-surface-variant border border-outline-variant cursor-not-allowed opacity-75"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">folder_zip</span>
              Baixar Todo o Processo Habilitatório (.ZIP)
            </button>
          </div>
        </div>
        
        {/* CATEGORIAS COM ANEXOS DRAG & DROP E TICKING */}
        <div className="flex flex-col gap-4">
          
          {/* CATEGORIA 1: HABILITAÇÃO JURÍDICA */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors text-left" 
              onClick={() => toggleSection('juridica')}
            >
              <div className="flex flex-col">
                <span className="font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  1. Habilitação Jurídica
                </span>
                <span className="text-xs text-on-surface-variant">Contrato Social, Estatuto e Cartão CNPJ com caixas para anexar arquivos.</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                {openSection === 'juridica' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {openSection === 'juridica' && (
              <div className="border-t border-outline-variant/30 bg-surface-container-low p-4 space-y-4">
                
                {/* Item 1.1: Contrato Social */}
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.contratoSocial ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.contratoSocial} 
                        onChange={() => handleToggleCheck('contratoSocial')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.contratoSocial ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Contrato Social / Estatuto Atualizado
                      </h4>
                    </label>

                    {checkedItems.contratoSocial ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Pendente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>O que é:</strong> Documento constitutivo da empresa que define a estrutura corporativa, quadro societário e quem possui autoridade legal para assinar propostas e contratos licitatórios.
                  </p>
                  <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    💡 <strong>Onde retirar a 2ª via:</strong> Pode ser solicitada online no portal da <strong>Junta Comercial do seu Estado (JUCEA, JUCESP, JUCEAP, etc.)</strong> ou com seu contador.
                  </p>

                  {/* CAIXA DE UPLOAD DE ANEXO (DRAG & DROP) */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload do Anexo em PDF / Imagem:
                    </label>
                    {uploadedFiles.contratoSocial ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.contratoSocial.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.contratoSocial.size} — Enviado em {uploadedFiles.contratoSocial.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('contratoSocial')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remover anexo"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-contratoSocial"
                          onChange={(e) => handleFileUpload('contratoSocial', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-contratoSocial" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar o Contrato Social</span>
                          <span className="text-[11px] text-on-surface-variant">Formatos suportados: PDF, PNG, JPG (Até 25MB)</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Item 1.2: Cartão CNPJ */}
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.cartaoCnpj ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.cartaoCnpj} 
                        onChange={() => handleToggleCheck('cartaoCnpj')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.cartaoCnpj ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Cartão CNPJ Ativo (Receita Federal)
                      </h4>
                    </label>

                    {checkedItems.cartaoCnpj ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Pendente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>O que é:</strong> Comprovante oficial de Inscrição e de Situação Cadastral Ativa na Receita Federal do Brasil.
                  </p>
                  
                  <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="text-xs text-on-surface-variant">💡 <strong>Onde emitir gratuitamente:</strong> No site da Receita Federal.</span>
                    <a
                      href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Emitir Cartão CNPJ <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>

                  {/* CAIXA DE UPLOAD DE ANEXO (DRAG & DROP) */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload do Anexo em PDF:
                    </label>
                    {uploadedFiles.cartaoCnpj ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.cartaoCnpj.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.cartaoCnpj.size} — Enviado em {uploadedFiles.cartaoCnpj.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('cartaoCnpj')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-cartaoCnpj"
                          onChange={(e) => handleFileUpload('cartaoCnpj', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-cartaoCnpj" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar o Cartão CNPJ</span>
                          <span className="text-[11px] text-on-surface-variant">Formatos suportados: PDF, PNG, JPG</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
          
          {/* CATEGORIA 2: REGULARIDADE FISCAL & TRABALHISTA */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors text-left" 
              onClick={() => toggleSection('fiscal')}
            >
              <div className="flex flex-col">
                <span className="font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_balance</span>
                  2. Regularidade Fiscal &amp; Trabalhista
                </span>
                <span className="text-xs text-on-surface-variant">Certidões da Receita Federal (CND URL Atualizada), CNDT, FGTS, SEFAZ e Prefeitura.</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                {openSection === 'fiscal' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {openSection === 'fiscal' && (
              <div className="border-t border-outline-variant/30 bg-surface-container-low p-4 space-y-4">
                
                {/* CND Federal URL ATUALIZADA */}
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.cndFederal ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.cndFederal} 
                        onChange={() => handleToggleCheck('cndFederal')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.cndFederal ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Certidão Negativa Federal &amp; Dívida Ativa da União (PGFN)
                      </h4>
                    </label>

                    {checkedItems.cndFederal ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Pendente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    <strong>O que é:</strong> Prova de quitação de tributos federais e previdenciários administrados pela Receita Federal e PGFN.
                  </p>

                  <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="text-xs text-on-surface-variant">💡 <strong>Onde emitir no Portal Oficial:</strong> No site da Receita Federal.</span>
                    <a
                      href="https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cnpj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Emitir CND Federal <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>

                  {/* UPLOAD DE ANEXO */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload da CND Federal:
                    </label>
                    {uploadedFiles.cndFederal ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.cndFederal.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.cndFederal.size} — Enviado em {uploadedFiles.cndFederal.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('cndFederal')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-cndFederal"
                          onChange={(e) => handleFileUpload('cndFederal', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-cndFederal" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar a CND Federal</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* CNDT Trabalhista */}
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.cndtTrabalhista ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.cndtTrabalhista} 
                        onChange={() => handleToggleCheck('cndtTrabalhista')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.cndtTrabalhista ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Certidão Negativa de Débitos Trabalhistas (CNDT)
                      </h4>
                    </label>

                    {checkedItems.cndtTrabalhista ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Pendente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    <strong>O que é:</strong> Documento obrigatório previsto na Lei 12.440/2011 comprovando a inexistência de débitos na Justiça do Trabalho.
                  </p>

                  <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="text-xs text-on-surface-variant">💡 <strong>Onde emitir instantaneamente:</strong> No site do TST.</span>
                    <a
                      href="https://cndt-certidao.tst.jus.br/inicio.faces"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Emitir CNDT TST <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>

                  {/* UPLOAD DE ANEXO */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload da CNDT:
                    </label>
                    {uploadedFiles.cndtTrabalhista ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.cndtTrabalhista.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.cndtTrabalhista.size} — Enviado em {uploadedFiles.cndtTrabalhista.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('cndtTrabalhista')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-cndtTrabalhista"
                          onChange={(e) => handleFileUpload('cndtTrabalhista', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-cndtTrabalhista" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar a CNDT</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* FGTS Caixa */}
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.crfFgts ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.crfFgts} 
                        onChange={() => handleToggleCheck('crfFgts')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.crfFgts ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Certificado de Regularidade do FGTS (CRF Caixa)
                      </h4>
                    </label>

                    {checkedItems.crfFgts ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Pendente
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    <strong>O que é:</strong> Comprova a adimplência com os depósitos do FGTS de seus empregados.
                  </p>

                  <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    <span className="text-xs text-on-surface-variant">💡 <strong>Onde emitir online:</strong> No sistema da Caixa Econômica.</span>
                    <a
                      href="https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      Emitir CRF FGTS <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  </div>

                  {/* UPLOAD DE ANEXO */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload do CRF FGTS:
                    </label>
                    {uploadedFiles.crfFgts ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.crfFgts.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.crfFgts.size} — Enviado em {uploadedFiles.crfFgts.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('crfFgts')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-crfFgts"
                          onChange={(e) => handleFileUpload('crfFgts', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-crfFgts" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar o CRF FGTS</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* CND Estadual e Municipal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CND Estadual */}
                  <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                    checkedItems.cndEstadual ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={checkedItems.cndEstadual} 
                          onChange={() => handleToggleCheck('cndEstadual')}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                        />
                        <h4 className={`font-bold text-xs ${checkedItems.cndEstadual ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                          Certidão Estadual (SEFAZ)
                        </h4>
                      </label>
                      {checkedItems.cndEstadual && <span className="text-[10px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded">OK</span>}
                    </div>

                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-3 text-center bg-surface-container-lowest">
                      <input
                        type="file"
                        id="file-cndEstadual"
                        onChange={(e) => handleFileUpload('cndEstadual', e)}
                        className="hidden"
                      />
                      <label htmlFor="file-cndEstadual" className="cursor-pointer flex items-center justify-center gap-1 text-xs font-bold text-primary">
                        <span className="material-symbols-outlined text-base">upload</span> Anexar CND Estadual
                      </label>
                    </div>
                  </div>

                  {/* CND Municipal */}
                  <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                    checkedItems.cndMunicipal ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={checkedItems.cndMunicipal} 
                          onChange={() => handleToggleCheck('cndMunicipal')}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                        />
                        <h4 className={`font-bold text-xs ${checkedItems.cndMunicipal ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                          Certidão Municipal (Prefeitura)
                        </h4>
                      </label>
                      {checkedItems.cndMunicipal && <span className="text-[10px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded">OK</span>}
                    </div>

                    <div className="border-2 border-dashed border-primary/20 rounded-xl p-3 text-center bg-surface-container-lowest">
                      <input
                        type="file"
                        id="file-cndMunicipal"
                        onChange={(e) => handleFileUpload('cndMunicipal', e)}
                        className="hidden"
                      />
                      <label htmlFor="file-cndMunicipal" className="cursor-pointer flex items-center justify-center gap-1 text-xs font-bold text-primary">
                        <span className="material-symbols-outlined text-base">upload</span> Anexar CND Municipal
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* CATEGORIA 3: QUALIFICAÇÃO TÉCNICA E ATESTADOS */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-4 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors text-left" 
              onClick={() => toggleSection('tecnica')}
            >
              <div className="flex flex-col">
                <span className="font-bold text-base text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  3. Qualificação Técnica &amp; Atestados
                </span>
                <span className="text-xs text-on-surface-variant">Atestados de Capacidade Técnica de fornecimentos anteriores com caixa para anexo.</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">
                {openSection === 'tecnica' ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {openSection === 'tecnica' && (
              <div className="border-t border-outline-variant/30 bg-surface-container-low p-4 space-y-4">
                
                <div className={`bg-surface-container-lowest p-4 rounded-xl border transition-colors space-y-3 ${
                  checkedItems.atestadoTecnico ? "border-[#34a853]/50 bg-green-50/20" : "border-outline-variant/30"
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={checkedItems.atestadoTecnico} 
                        onChange={() => handleToggleCheck('atestadoTecnico')}
                        className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer" 
                      />
                      <h4 className={`font-bold text-sm ${checkedItems.atestadoTecnico ? "text-on-surface line-through opacity-85" : "text-on-surface"}`}>
                        Atestado de Capacidade Técnica (ACT)
                      </h4>
                    </label>

                    {checkedItems.atestadoTecnico ? (
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f4ea] text-[#137333] font-bold text-[11px] flex items-center gap-1 border border-[#34a853]/30">
                        <span className="material-symbols-outlined text-xs">check_circle</span> Concluído
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-[11px] border border-amber-500/30">
                        Recomendado
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>O que é:</strong> Documento impresso emitido por órgão público ou empresa privada comprovando fornecimento anterior compatível em características e quantidade.
                  </p>
                  
                  <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                    💡 <strong>Como obter:</strong> Solicite ao setor de compras ou contratos dos seus clientes anteriores.
                  </p>

                  {/* UPLOAD DE ANEXO DE ATESTADO */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-on-surface mb-1.5">
                      📎 Upload do Atestado de Capacidade Técnica:
                    </label>
                    {uploadedFiles.atestadoTecnico ? (
                      <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-xl border border-outline-variant/40">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="material-symbols-outlined text-primary text-xl">description</span>
                          <div className="truncate">
                            <span className="text-xs font-bold text-on-surface block truncate">{uploadedFiles.atestadoTecnico.name}</span>
                            <span className="text-[11px] text-on-surface-variant">{uploadedFiles.atestadoTecnico.size} — Enviado em {uploadedFiles.atestadoTecnico.date}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile('atestadoTecnico')}
                          className="text-xs font-bold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-primary/30 rounded-xl p-4 text-center bg-surface-container-lowest hover:border-primary transition-colors">
                        <input
                          type="file"
                          id="file-atestadoTecnico"
                          onChange={(e) => handleFileUpload('atestadoTecnico', e)}
                          className="hidden"
                        />
                        <label htmlFor="file-atestadoTecnico" className="cursor-pointer flex flex-col items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                          <span className="text-xs font-bold text-primary">Arraste ou clique para anexar o Atestado de Capacidade Técnica</span>
                          <span className="text-[11px] text-on-surface-variant">Formatos suportados: PDF, PNG, JPG</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
