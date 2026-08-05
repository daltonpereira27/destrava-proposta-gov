"use client";

import React, { useState, useEffect } from "react";

// Lista Completa dos Principais Bancos Brasileiros (Código + Nome)
const BRAZILIAN_BANKS = [
  { code: "001", name: "001 — Banco do Brasil S.A." },
  { code: "104", name: "104 — Caixa Econômica Federal" },
  { code: "237", name: "237 — Banco Bradesco S.A." },
  { code: "341", name: "341 — Itaú Unibanco S.A." },
  { code: "033", name: "033 — Banco Santander (Brasil) S.A." },
  { code: "756", name: "756 — Banco Cooperativo Sicoob (Bancoob)" },
  { code: "748", name: "748 — Banco Cooperativo Sicredi S.A." },
  { code: "260", name: "260 — Nu Pagamentos S.A. (Nubank)" },
  { code: "077", name: "077 — Banco Inter S.A." },
  { code: "208", name: "208 — Banco BTG Pactual S.A." },
  { code: "041", name: "041 — Banco Banrisul S.A." },
  { code: "070", name: "070 — BRB - Banco de Brasília S.A." },
  { code: "422", name: "422 — Banco Safra S.A." },
  { code: "336", name: "336 — Banco C6 S.A." },
  { code: "290", name: "290 — PagSeguro Internet S.A. (PagBank)" },
  { code: "212", name: "212 — Banco Original S.A." },
  { code: "655", name: "655 — Banco Votorantim S.A. (BV)" },
  { code: "637", name: "637 — Banco Sofisa S.A." },
  { code: "389", name: "389 — Banco Mercantil do Brasil S.A." },
  { code: "136", name: "136 — Unicred Cooperativa" },
];

// Formatador automático de CPF: 000.000.000-00
const formatCPF = (val: string) => {
  if (!val) return "";
  const digits = val.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Formatador automático de CNPJ: 00.000.000/0001-00
const formatCNPJ = (val: string) => {
  if (!val) return "";
  const digits = val.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export default function PerfilPage() {
  // Estado do Usuário Cadastrado
  const [person, setPerson] = useState({
    nomeCompleto: "Dalton Pereira",
    email: "dalton@empresa.com.br",
    telefone: "(96) 99999-9999",
  });

  // Estado da Empresa
  const [company, setCompany] = useState({
    cnpj: "39.335.069/0001-01",
    razao_social: "INFOR TECH SOLUCOES (DALTON A. B. PEREIRA)",
    nome_fantasia: "INFOR TECH SOLUCOES",
    inscricao_estadual: "ISENTO",
    cep: "68900-000",
    logradouro: "AL LAGOAS DAS GARCAS",
    numero: "S/N",
    complemento: "",
    bairro: "ALVORADA",
    municipio: "MACAPA",
    uf: "AP",
  });

  // Estado do Responsável Legal / Pessoa que lidará com Licitações
  const [legalResp, setLegalResp] = useState({
    nome: "Dalton Pereira",
    cpf: "000.000.000-00",
    rg: "123456-AP",
    cargo: "Sócio-Administrador / Gestor de Licitações",
  });

  // Estado dos Dados Bancários
  const [bank, setBank] = useState({
    banco: "077 — Banco Inter S.A.",
    agencia: "0001",
    conta: "123456-0",
    tipoConta: "Conta Corrente Pessoa Jurídica",
    chavePix: "39.335.069/0001-01",
  });

  // Sócios encontrados na consulta de CNPJ (se houver)
  const [foundPartners, setFoundPartners] = useState<any[]>([]);
  const [isConsultingCnpj, setIsConsultingCnpj] = useState(false);

  // Estados de Edição
  const [editSection, setEditSection] = useState<"person" | "company" | "bank" | "legal" | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Carregar dados salvos no localStorage
  useEffect(() => {
    try {
      let activeName = "Dalton Pereira";
      let activeCpf = "000.000.000-00";
      let activeCargo = "Sócio-Administrador / Gestor de Licitações";

      const pRaw = localStorage.getItem("destrava_user_person");
      if (pRaw) {
        const parsedP = JSON.parse(pRaw);
        setPerson((prev) => ({ ...prev, ...parsedP }));
        if (parsedP.nomeCompleto) activeName = parsedP.nomeCompleto;
        if (parsedP.cpf) activeCpf = parsedP.cpf;
        if (parsedP.cargo) activeCargo = parsedP.cargo;
      }

      const cRaw = localStorage.getItem("destrava_user_company");
      if (cRaw) {
        const parsedC = JSON.parse(cRaw);
        setCompany((prev) => ({ ...prev, ...parsedC }));
        if (parsedC.responsavel_nome) activeName = parsedC.responsavel_nome;
        if (parsedC.responsavel_cpf) activeCpf = parsedC.responsavel_cpf;
        if (parsedC.responsavel_cargo) activeCargo = parsedC.responsavel_cargo;
      }

      setLegalResp({
        nome: activeName,
        cpf: activeCpf,
        rg: "123456-AP",
        cargo: activeCargo,
      });

      const bRaw = localStorage.getItem("destrava_user_bank");
      if (bRaw) setBank((prev) => ({ ...prev, ...JSON.parse(bRaw) }));
    } catch (e) {
      console.error("Erro ao carregar dados do perfil", e);
    }
  }, []);

  const showSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  // Consultar CNPJ via BrasilAPI
  const handleConsultCnpj = async () => {
    const cleanCnpj = company.cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) {
      alert("Por favor, informe um CNPJ válido com 14 dígitos.");
      return;
    }

    setIsConsultingCnpj(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      if (!res.ok) throw new Error("CNPJ não encontrado na Receita Federal.");
      const data = await res.json();

      setCompany((prev) => ({
        ...prev,
        razao_social: data.razao_social || prev.razao_social,
        nome_fantasia: data.nome_fantasia || data.razao_social || prev.nome_fantasia,
        logradouro: data.logradouro || prev.logradouro,
        numero: data.numero || prev.numero,
        complemento: data.complemento || prev.complemento,
        bairro: data.bairro || prev.bairro,
        municipio: data.municipio || prev.municipio,
        uf: data.uf || prev.uf,
        cep: data.cep || prev.cep,
      }));

      showSuccess("Dados da Empresa atualizados via Receita Federal!");
    } catch (err: any) {
      alert(err.message || "Erro ao consultar CNPJ na Receita Federal.");
    } finally {
      setIsConsultingCnpj(false);
    }
  };

  // Salvar Pessoa/Usuário
  const handleSavePerson = () => {
    localStorage.setItem("destrava_user_person", JSON.stringify(person));
    setLegalResp((prev) => ({ ...prev, nome: person.nomeCompleto }));
    window.dispatchEvent(new Event("user_name_updated"));
    setEditSection(null);
    showSuccess("Dados de Usuário salvos e atualizados no sistema!");
  };

  // Salvar Empresa
  const handleSaveCompany = () => {
    const updated = { ...company, responsavel_nome: legalResp.nome, responsavel_cpf: legalResp.cpf };
    localStorage.setItem("destrava_user_company", JSON.stringify(updated));
    setEditSection(null);
    showSuccess("Dados da Empresa salvos com sucesso!");
  };

  // Salvar Dados Bancários
  const handleSaveBank = () => {
    localStorage.setItem("destrava_user_bank", JSON.stringify(bank));
    setEditSection(null);
    showSuccess("Dados Bancários salvos com sucesso!");
  };

  // Salvar Responsável Legal / Licitante
  const handleSaveLegalResp = () => {
    // 1. Atualiza estado de pessoa e empresa
    const personRaw = localStorage.getItem("destrava_user_person");
    const personObj = personRaw ? JSON.parse(personRaw) : person;
    personObj.nomeCompleto = legalResp.nome;
    personObj.cpf = legalResp.cpf;
    personObj.cargo = legalResp.cargo;
    localStorage.setItem("destrava_user_person", JSON.stringify(personObj));
    setPerson((prev) => ({ ...prev, nomeCompleto: legalResp.nome }));

    const companyRaw = localStorage.getItem("destrava_user_company");
    const parsedComp = companyRaw ? JSON.parse(companyRaw) : company;

    const updatedComp = {
      ...parsedComp,
      responsavel_nome: legalResp.nome,
      responsavel_cpf: legalResp.cpf,
      responsavel_rg: legalResp.rg,
      responsavel_cargo: legalResp.cargo,
    };
    localStorage.setItem("destrava_user_company", JSON.stringify(updatedComp));

    // 2. Dispara evento global para o topo e o Dashboard atualizarem na hora
    window.dispatchEvent(new Event("user_name_updated"));

    setEditSection(null);
    showSuccess("Responsável pela Empresa / Licitações salvo! Nome sincronizado no Dashboard e nas Declarações Oficiais.");
  };

  // Pegar iniciais do nome
  const getInitials = (name: string) => {
    if (!name) return "DP";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Alerta de Sucesso Salvo */}
      {saveSuccessMsg && (
        <div className="bg-[#eefaf4] border border-[#006c49]/30 text-[#006c49] p-4 rounded-xl shadow-md font-bold text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg("")} className="text-xs hover:underline cursor-pointer">Fechar</button>
        </div>
      )}

      {/* Header & Perfil do Usuário */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          <div className="w-20 h-20 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md border-2 border-blue-600/30 shrink-0 font-extrabold text-2xl tracking-wider">
            {getInitials(person.nomeCompleto)}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl font-bold text-on-surface">{person.nomeCompleto}</h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-blue-300">
                Responsável / Licitante
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">{person.email} • {person.telefone}</p>
            <p className="text-[11px] text-blue-700 font-bold mt-1">Empresa Cadastrada: {company.razao_social}</p>
          </div>
        </div>

        <button
          onClick={() => setEditSection(editSection === "person" ? null : "person")}
          className="bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-xs px-4 py-2.5 rounded-xl border border-outline-variant/40 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Editar Dados do Usuário
        </button>
      </section>

      {/* Edição de Dados Pessoais */}
      {editSection === "person" && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-primary/40 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">person</span>
            Editar Dados Pessoais do Usuário
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">Nome Completo do Responsável:</label>
              <input
                type="text"
                value={person.nomeCompleto}
                onChange={(e) => setPerson({ ...person, nomeCompleto: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">E-mail Corporativo:</label>
              <input
                type="email"
                value={person.email}
                onChange={(e) => setPerson({ ...person, email: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant block mb-1">Telefone / WhatsApp:</label>
              <input
                type="text"
                value={person.telefone}
                onChange={(e) => setPerson({ ...person, telefone: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditSection(null)} className="px-4 py-2 text-xs font-bold text-on-surface-variant cursor-pointer">Cancelar</button>
            <button onClick={handleSavePerson} className="bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-blue-800">Salvar Alterações</button>
          </div>
        </div>
      )}

      {/* Grid de Configurações Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD 1: RESPONSÁVEL LEGAL / LICITANTE (EDITÁVEL) */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 border-2 border-blue-600/30 relative flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">badge</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Responsável Legal / Licitante</h2>
                  <p className="text-[11px] text-on-surface-variant">Pessoa cadastrada para responder pelas propostas e declarações</p>
                </div>
              </div>

              <button
                onClick={() => setEditSection(editSection === "legal" ? null : "legal")}
                className="text-blue-700 hover:bg-blue-50 p-2 rounded-xl transition-colors cursor-pointer"
                title="Editar Responsável pela Empresa"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>

            {/* Alerta de Destaque para o Usuário */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 text-xs text-amber-900 font-medium flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-700 text-base mt-0.5">verified_user</span>
              <div>
                <strong>Atenção ao cadastro:</strong> O Nome, CPF e Cargo deste responsável serão inseridos automaticamente no topo do Dashboard e nas assinaturas das 4 Declarações Licitatórias.
              </div>
            </div>

            {editSection === "legal" ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Nome Completo do Responsável / Licitante:</label>
                  <input
                    type="text"
                    required
                    value={legalResp.nome}
                    onChange={(e) => setLegalResp({ ...legalResp, nome: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ex: Dalton Pereira"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">CPF do Responsável:</label>
                    <input
                      type="text"
                      value={legalResp.cpf}
                      onChange={(e) => setLegalResp({ ...legalResp, cpf: formatCPF(e.target.value) })}
                      maxLength={14}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">RG / Órgão Emissor:</label>
                    <input
                      type="text"
                      value={legalResp.rg}
                      onChange={(e) => setLegalResp({ ...legalResp, rg: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      placeholder="Ex: 123456-AP"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Cargo / Função na Empresa:</label>
                  <input
                    type="text"
                    value={legalResp.cargo}
                    onChange={(e) => setLegalResp({ ...legalResp, cargo: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ex: Sócio-Administrador ou Gestor de Licitações"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditSection(null)} className="px-3 py-2 text-xs font-bold text-on-surface-variant cursor-pointer">Cancelar</button>
                  <button onClick={handleSaveLegalResp} className="bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-800 cursor-pointer">Salvar Responsável</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Nome do Responsável / Licitante</span>
                  <p className="text-base font-bold text-blue-900">{legalResp.nome}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">CPF</span>
                    <p className="text-xs font-bold text-on-surface">{legalResp.cpf}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Cargo / Função</span>
                    <p className="text-xs font-bold text-blue-700">{legalResp.cargo}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: DADOS BANCÁRIOS (TODOS OS BANCOS DO BRASIL) */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-surface">Dados Bancários Oficiais</h2>
                  <p className="text-[11px] text-on-surface-variant">Selecione o banco e informe agência e conta</p>
                </div>
              </div>

              <button
                onClick={() => setEditSection(editSection === "bank" ? null : "bank")}
                className="text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors cursor-pointer"
                title="Editar Dados Bancários"
              >
                <span className="material-symbols-outlined text-xl">edit</span>
              </button>
            </div>

            {editSection === "bank" ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Selecione o Banco:</label>
                  <select
                    value={bank.banco}
                    onChange={(e) => setBank({ ...bank, banco: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {BRAZILIAN_BANKS.map((b) => (
                      <option key={b.code} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Agência:</label>
                    <input
                      type="text"
                      value={bank.agencia}
                      onChange={(e) => setBank({ ...bank, agencia: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Conta Corrente:</label>
                    <input
                      type="text"
                      value={bank.conta}
                      onChange={(e) => setBank({ ...bank, conta: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Chave PIX Cadastrada:</label>
                  <input
                    type="text"
                    value={bank.chavePix}
                    onChange={(e) => setBank({ ...bank, chavePix: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditSection(null)} className="px-3 py-2 text-xs font-bold text-on-surface-variant cursor-pointer">Cancelar</button>
                  <button onClick={handleSaveBank} className="bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">Salvar Banco</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Instituição Financeira</span>
                  <p className="text-sm font-bold text-on-surface">{bank.banco}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Agência</span>
                    <p className="text-xs font-bold text-on-surface">{bank.agencia}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Conta Corrente</span>
                    <p className="text-xs font-bold text-on-surface">{bank.conta}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Chave PIX Registrada</span>
                  <p className="text-xs font-bold text-primary">{bank.chavePix}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CARD GRANDE: DADOS CADASTRAIS DA EMPRESA */}
      <section className="bg-surface-container-lowest rounded-2xl shadow-sm p-6 border border-outline-variant/30 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">domain</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">Dados Cadastrais da Empresa</h2>
              <p className="text-[11px] text-on-surface-variant">Sincronizado com o cadastro inicial da conta</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleConsultCnpj}
              disabled={isConsultingCnpj}
              className="w-full sm:w-auto bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-xs px-3.5 py-2.5 rounded-xl border border-outline-variant/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              <span>{isConsultingCnpj ? "Consultando..." : "Atualizar via Receita Federal"}</span>
            </button>
            <button
              onClick={() => setEditSection(editSection === "company" ? null : "company")}
              className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Editar Empresa</span>
            </button>
          </div>
        </div>

        {editSection === "company" ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">CNPJ:</label>
                <input
                  type="text"
                  value={company.cnpj}
                  onChange={(e) => setCompany({ ...company, cnpj: formatCNPJ(e.target.value) })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">Razão Social:</label>
                <input
                  type="text"
                  value={company.razao_social}
                  onChange={(e) => setCompany({ ...company, razao_social: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">Nome Fantasia:</label>
                <input
                  type="text"
                  value={company.nome_fantasia}
                  onChange={(e) => setCompany({ ...company, nome_fantasia: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant block mb-1">Inscrição Estadual:</label>
                <input
                  type="text"
                  value={company.inscricao_estadual}
                  onChange={(e) => setCompany({ ...company, inscricao_estadual: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs font-bold text-on-surface"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditSection(null)} className="px-4 py-2 text-xs font-bold text-on-surface-variant cursor-pointer">Cancelar</button>
              <button onClick={handleSaveCompany} className="bg-primary text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">Salvar Empresa</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">CNPJ</span>
              <p className="text-sm font-bold text-on-surface font-mono">{company.cnpj}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Razão Social</span>
              <p className="text-xs font-bold text-on-surface truncate" title={company.razao_social}>{company.razao_social}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-0.5">Endereço da Sede</span>
              <p className="text-xs font-bold text-on-surface truncate">
                {company.logradouro}, Nº {company.numero} - {company.bairro}, {company.municipio}/{company.uf}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
