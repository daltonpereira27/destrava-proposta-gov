"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function PageFeedbackWidget() {
  const pathname = usePathname();
  const [rating, setRating] = useState<"ideal" | "falta_algo" | "sugestao" | "duvida">("ideal");
  const [comentario, setComentario] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newFeedback = {
      id: Date.now().toString(),
      pathname,
      rating,
      comentario,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingRaw = localStorage.getItem("destrava_page_feedbacks");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(newFeedback);
      localStorage.setItem("destrava_page_feedbacks", JSON.stringify(existing));
    } catch (err) {
      console.error("Erro ao salvar feedback da página", err);
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="mt-8 border-t border-outline-variant/30 pt-6">
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 md:p-6 shadow-sm">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-700">chat_bubble</span>
                  Avaliação &amp; Observações da Página
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Esta página atende suas necessidades? Deixe suas observações ou sugestões para aprimoramento.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
                Versão 0.1
              </span>
            </div>

            {/* Opções de Status */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRating("ideal")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  rating === "ideal"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span>⭐ Página Ideal</span>
              </button>

              <button
                type="button"
                onClick={() => setRating("falta_algo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  rating === "falta_algo"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span>💡 Falta algum detalhe</span>
              </button>

              <button
                type="button"
                onClick={() => setRating("sugestao")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  rating === "sugestao"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span>💬 Tenho uma sugestão</span>
              </button>

              <button
                type="button"
                onClick={() => setRating("duvida")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  rating === "duvida"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span>❓ Dúvida sobre o fluxo</span>
              </button>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={2}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva suas observações, feedbacks ou complementos desejados nesta tela..."
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl p-3 text-xs md:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>{loading ? "Enviando..." : "Enviar Observação"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-4 text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
              <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <span>Obrigado pelo seu comentário! Suas observações foram registradas para aperfeiçoamento continuo.</span>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setComentario("");
              }}
              className="text-xs font-bold text-emerald-700 underline hover:opacity-80 cursor-pointer shrink-0"
            >
              Novo Comentário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
