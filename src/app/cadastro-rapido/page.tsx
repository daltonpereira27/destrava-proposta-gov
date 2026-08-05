"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function CadastroRapidoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [ramo, setRamo] = useState("Tecnologia e Informática");
  const [observacoes, setObservacoes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const leadData = {
      id: Date.now().toString(),
      nome,
      email,
      telefone,
      empresa,
      ramo,
      observacoes,
      dataCadastro: new Date().toISOString(),
    };

    try {
      const existingLeadsRaw = localStorage.getItem("destrava_leads");
      const existingLeads = existingLeadsRaw ? JSON.parse(existingLeadsRaw) : [];
      existingLeads.push(leadData);
      localStorage.setItem("destrava_leads", JSON.stringify(existingLeads));
    } catch (err) {
      console.error("Erro ao salvar cadastro de lead", err);
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 md:p-8 lg:p-12">
      {/* HEADER PRINCIPAL */}
      <header className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
          </div>
          <div>
            <span className="font-extrabold text-blue-700 text-xl tracking-tight uppercase block leading-none">
              DESTRAVA PROPOSTA GOV
            </span>
            <span className="text-[10px] font-bold text-blue-600 tracking-wider">
              SAAS WHITE LABEL DE GESTÃO DE LICITAÇÕES
            </span>
          </div>
        </div>

        <Link
          href="/login"
          className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">login</span>
          <span>Já tem conta? Fazer Login</span>
        </Link>
      </header>

      {/* CONTEÚDO EM PÁGINA COMPLETA E AMPLA (2 COLUNAS NO DESKTOP) */}
      <main className="w-full max-w-6xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-10 lg:p-12 my-auto">
        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* COLUNA DA ESQUERDA: APRESENTAÇÃO & BENEFÍCIOS (PÁGINA COMPLETA) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-base text-blue-700">stars</span>
                <span>Acesso Gratuito &amp; Demonstração Guiada</span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                Impulsione as Vendas da sua Empresa no Governo com Propostas Perfeitas
              </h1>

              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Cadastre seus dados abaixo para receber uma demonstração personalizada da plataforma **DESTRAVA PROPOSTA GOV**. Criamos soluções sob medida para você vencer licitações com segurança jurídica.
              </p>

              {/* LISTA DE BENEFÍCIOS RELEVANTES */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <strong>Propostas em PDF em Minutos:</strong> Crie documentos homologados com cálculo automático de impostos e frete.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <strong>Simulador de Lances ao Vivo:</strong> Calcule o preço mínimo com margem de lucro em disputas acirradas.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium">
                    <strong>Emissão das 4 Declarações da Lei 14.133:</strong> Emita ME/EPP, Menor de Idade, Elaboração Independente e Unificada em 1 clique.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-3 text-xs text-blue-900 font-medium">
                <span className="material-symbols-outlined text-blue-700 text-xl shrink-0">support_agent</span>
                <span>Nossa equipe comercial entrará em contato via WhatsApp ou e-mail em poucas horas.</span>
              </div>
            </div>

            {/* COLUNA DA DIREITA: FORMULÁRIO DE CADASTRO AMPLO */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Solicitar Contato &amp; Acesso
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Preencha o formulário rápido para entrarmos em contato.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      E-mail Comercial *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com.br"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 90000-0000"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nome da Empresa / Órgão
                    </label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Sua empresa ou instituição"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ramo de Atuação
                    </label>
                    <select
                      value={ramo}
                      onChange={(e) => setRamo(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Tecnologia e Informática">Tecnologia &amp; Informática</option>
                      <option value="Mobiliário e Escritório">Mobiliário &amp; Escritório</option>
                      <option value="Engenharia e Construção">Engenharia &amp; Construção</option>
                      <option value="Serviços Médicos e Hospitalares">Serviços Médicos &amp; Hospitalares</option>
                      <option value="Alimentação e Merenda">Alimentação &amp; Merenda</option>
                      <option value="Consultoria e Serviços Gerais">Consultoria &amp; Serviços Gerais</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Como podemos te ajudar? (Opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Conte-nos brevemente sobre seus objetivos ou dúvidas sobre licitações..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando seus dados...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">send</span>
                      <span>Enviar Solicitação de Demonstração</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              Cadastro Recebido com Sucesso!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Agradecemos o seu interesse na plataforma <strong>DESTRAVA PROPOSTA GOV</strong>. Um consultor especializado entrará em contato pelo seu WhatsApp ou e-mail nos próximos dias.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/login"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Ir para a Tela de Login</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto text-center mt-8 text-xs text-slate-500">
        © {new Date().getFullYear()} DESTRAVA PROPOSTA GOV — Todos os direitos reservados.
      </footer>
    </div>
  );
}
