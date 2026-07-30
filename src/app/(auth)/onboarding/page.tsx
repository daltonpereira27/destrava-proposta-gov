"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [error, setError] = useState("");

  // Estado inicial limpo (será preenchido pela Receita Federal)
  const [companyData, setCompanyData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    naturezaJuridica: "",
    porte: "",
    dataAbertura: "",
    cnae: "",
    telefone: "",
    email: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-") && dateStr.length === 10) {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const formatCep = (cepStr: string) => {
    if (!cepStr) return "";
    const clean = cepStr.replace(/\D/g, "");
    if (clean.length === 8) {
      return `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    return cepStr;
  };

  const formatPhone = (phoneStr: string) => {
    if (!phoneStr) return "";
    const clean = phoneStr.replace(/\D/g, "");
    if (clean.length === 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    }
    if (clean.length === 11) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    return phoneStr;
  };

  const executeSearch = async (cnpjToSearch: string) => {
    const rawCnpj = cnpjToSearch.replace(/\D/g, "");
    if (rawCnpj.length !== 14) {
      setError("Por favor, informe um CNPJ válido com 14 dígitos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/cnpj/${rawCnpj}`);
      if (res.ok) {
        const json = await res.json();
        const apiData = json.data || json;
        if (apiData) {
          // Formata Natureza Jurídica se tiver código
          const natJur = apiData.codigo_natureza_juridica && apiData.natureza_juridica
            ? `${apiData.codigo_natureza_juridica} - ${apiData.natureza_juridica}`
            : (apiData.natureza_juridica || "");

          setCompanyData({
            razaoSocial: apiData.razao_social || "",
            nomeFantasia: apiData.nome_fantasia || apiData.razao_social || "",
            naturezaJuridica: natJur,
            porte: apiData.porte || "ME - Microempresa",
            dataAbertura: formatDate(apiData.data_inicio_atividade || apiData.data_abertura || ""),
            cnae: apiData.cnae_fiscal_descricao 
              ? `${apiData.cnae_fiscal || ""} - ${apiData.cnae_fiscal_descricao}` 
              : "",
            cep: formatCep(apiData.cep || ""),
            rua: apiData.logradouro || apiData.rua || "",
            numero: apiData.numero || "",
            complemento: apiData.complemento || "",
            bairro: apiData.bairro || "",
            cidade: apiData.municipio || apiData.cidade || "",
            estado: apiData.uf || apiData.estado || "",
            telefone: formatPhone(apiData.ddd_telefone_1 || apiData.telefone || ""),
            email: apiData.email || "",
          });
          setFound(true);
        }
      } else {
        const errJson = await res.json();
        setError(errJson.error || "CNPJ não encontrado na Receita Federal.");
      }
    } catch (err) {
      setError("Erro ao conectar aos servidores da Receita Federal. Verifique o CNPJ e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCnpj = () => {
    executeSearch(cnpj);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/register");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface shadow-sm px-md py-sm flex flex-col gap-sm">
        <div className="flex justify-between items-center w-full">
          <Link href="/login" className="flex items-center gap-xs text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
            <span className="font-headline-md text-headline-md-mobile font-bold tracking-tight">Destrava Proposta Gov</span>
          </Link>
          <div className="flex items-center gap-md">
            <Link href="/login" className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span> Voltar para o Login
            </Link>
          </div>
        </div>
        <div className="w-full flex flex-col gap-xs">
          <div className="flex justify-between items-center w-full">
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">Passo 1 de 2: Cadastro da Empresa (Receita Federal)</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Passo 1 de 2</span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: "50%" }}></div>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-[116px] px-md pb-lg flex flex-col min-h-screen">
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_20px_rgba(31,41,55,0.05)] border border-outline-variant/20 flex-1 flex flex-col max-w-[550px] w-full mx-auto">
          <div className="mb-md">
            <h1 className="font-headline-md text-headline-md-mobile text-on-surface mb-xs font-bold">1º Passo: Cadastro da Empresa (CNPJ)</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Informe o CNPJ da sua empresa para buscarmos os dados oficiais da Receita Federal em tempo real.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md flex-1">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 font-medium border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-[#1e3a8a] flex items-center justify-between" htmlFor="cnpj">
                <span className="font-semibold">CNPJ da Empresa</span>
              </label>
              <div className="relative w-full">
                <input 
                  className="w-full h-12 px-3 pr-10 border-2 border-primary rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline-variant font-semibold tracking-widest disabled:opacity-50" 
                  id="cnpj" 
                  placeholder="00.000.000/0001-00" 
                  type="text" 
                  value={cnpj}
                  onChange={(e) => {
                    setCnpj(e.target.value);
                    if (found) setFound(false);
                  }}
                  disabled={loading}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">search</span>
              </div>
              
              {!found && (
                <button 
                  className="mt-2 w-full bg-[#1e3a8a] text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 font-semibold" 
                  type="button"
                  onClick={handleSearchCnpj}
                  disabled={loading}
                >
                  {loading ? "Consultando Receita Federal..." : "Consultar CNPJ na Receita Federal"}
                </button>
              )}
            </div>

            {found && (
              <>
                <div className="bg-[#e6f4ea] border border-[#34a853]/30 rounded-lg p-3 flex items-start gap-2 mt-1">
                  <span className="material-symbols-outlined text-[#34a853]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-body-sm text-[#137333] font-medium">CNPJ Ativo e Validado na Receita Federal! Revise os dados abaixo.</span>
                </div>

                {companyData.porte && (
                  <div className="bg-secondary-container/30 border border-secondary/20 rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <p className="font-body-sm text-on-secondary-container flex-1">
                        Sua empresa é enquadrada como <strong>{companyData.porte}</strong>. Você possui direito a margem de preferência em empates fictícios (Lei Orgânica LC 123/2006).
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-sm mt-2">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-[#1e3a8a] flex items-center gap-2" htmlFor="razao_social">
                      Razão Social
                      <span className="bg-[#dce1ff] text-[#1e3a8a] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Receita Federal</span>
                    </label>
                    <input 
                      className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md font-semibold" 
                      id="razao_social" 
                      type="text" 
                      value={companyData.razaoSocial}
                      onChange={(e) => setCompanyData({ ...companyData, razaoSocial: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-[#1e3a8a] flex items-center gap-2" htmlFor="nome_fantasia">
                      Nome Fantasia / Título do Estabelecimento
                      <span className="bg-[#dce1ff] text-[#1e3a8a] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Receita Federal</span>
                    </label>
                    <input 
                      className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                      id="nome_fantasia" 
                      type="text" 
                      value={companyData.nomeFantasia}
                      onChange={(e) => setCompanyData({ ...companyData, nomeFantasia: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a] flex items-center gap-2" htmlFor="natureza_juridica">
                        Natureza Jurídica
                      </label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="natureza_juridica" 
                        type="text" 
                        value={companyData.naturezaJuridica}
                        onChange={(e) => setCompanyData({ ...companyData, naturezaJuridica: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a] flex items-center gap-2" htmlFor="porte">
                        Porte
                      </label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="porte" 
                        type="text" 
                        value={companyData.porte}
                        onChange={(e) => setCompanyData({ ...companyData, porte: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="cnae">
                      Atividade Principal (CNAE)
                    </label>
                    <input 
                      className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md text-xs font-mono" 
                      id="cnae" 
                      type="text" 
                      value={companyData.cnae}
                      onChange={(e) => setCompanyData({ ...companyData, cnae: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-sm mt-4 pt-4 border-t border-outline-variant/30">
                  <h3 className="font-label-md text-on-surface font-bold">Contato da Empresa</h3>
                  <div className="grid grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="telefone">
                        Telefone
                      </label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-lowest text-on-surface font-body-md" 
                        id="telefone" 
                        type="tel" 
                        value={companyData.telefone}
                        onChange={(e) => setCompanyData({ ...companyData, telefone: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="email_contato">
                        E-mail Comercial
                      </label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-lowest text-on-surface font-body-md" 
                        id="email_contato" 
                        type="email" 
                        value={companyData.email}
                        onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-sm mt-4 pt-4 border-t border-outline-variant/30">
                  <h3 className="font-label-md text-on-surface font-bold">Endereço da Sede</h3>
                  <div className="grid grid-cols-3 gap-md">
                    <div className="col-span-2 flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="rua">Logradouro / Rua</label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="rua" 
                        type="text" 
                        value={companyData.rua}
                        onChange={(e) => setCompanyData({ ...companyData, rua: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="numero">Número</label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-lowest text-on-surface font-body-md" 
                        id="numero" 
                        type="text" 
                        value={companyData.numero}
                        onChange={(e) => setCompanyData({ ...companyData, numero: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="bairro">Bairro</label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="bairro" 
                        type="text" 
                        value={companyData.bairro}
                        onChange={(e) => setCompanyData({ ...companyData, bairro: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="cidade">Cidade</label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="cidade" 
                        type="text" 
                        value={companyData.cidade}
                        onChange={(e) => setCompanyData({ ...companyData, cidade: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-sm text-label-sm text-[#1e3a8a]" htmlFor="estado">UF</label>
                      <input 
                        className="w-full h-12 px-3 border border-outline rounded-lg bg-surface-container-low text-on-surface font-body-md" 
                        id="estado" 
                        type="text" 
                        value={companyData.estado}
                        onChange={(e) => setCompanyData({ ...companyData, estado: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-lg flex flex-col gap-3">
                  <div className="flex gap-md">
                    <button 
                      className="flex-1 bg-surface-container text-on-surface font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-[0.98] transition-all border border-outline-variant/50 font-medium" 
                      type="button"
                      onClick={() => setFound(false)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                      Refazer Busca
                    </button>
                    <button 
                      className="flex-1 bg-[#1e3a8a] text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all font-semibold" 
                      type="submit"
                    >
                      Avançar para Dados Pessoais
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
}
