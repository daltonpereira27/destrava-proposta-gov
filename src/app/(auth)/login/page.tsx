"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleCopyQrLink = () => {
    const fullUrl = `${window.location.origin}/cadastro-rapido`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 gap-6 bg-slate-50/50 dark:bg-neutral-950">
      {/* FORMULÁRIO DE LOGIN */}
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 md:p-8 flex flex-col gap-6 border border-outline-variant/40">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-1 shadow-xs">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
          </div>
          <h1 className="text-2xl md:text-3xl text-blue-700 dark:text-blue-400 font-extrabold tracking-tight uppercase">
            DESTRAVA PROPOSTA GOV
          </h1>
          <span className="text-[11px] font-bold tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-200">
            Gerador de Propostas &amp; Gestão de Licitações
          </span>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 font-medium">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-medium border border-red-200">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-on-surface-variant">E-mail</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">mail</span>
              <input 
                type="email" 
                id="email" 
                className="w-full h-11 bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-3 text-sm text-on-surface focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all font-medium disabled:opacity-50" 
                placeholder="seu@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-on-surface-variant">Senha</label>
              <Link href="#" className="text-xs text-blue-700 hover:underline font-semibold">Esqueceu a senha?</Link>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-xl">lock</span>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="w-full h-11 bg-surface-container-lowest border border-outline-variant rounded-xl pl-10 pr-10 text-sm text-on-surface focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all font-medium disabled:opacity-50" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">{showPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md mt-1 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar no Sistema"}
            {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px bg-outline-variant/60 flex-1"></div>
          <span className="text-xs text-on-surface-variant font-medium">ou</span>
          <div className="h-px bg-outline-variant/60 flex-1"></div>
        </div>

        <button type="button" className="w-full h-11 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Entrar com Google
        </button>

        <div className="text-center">
          <span className="text-xs text-on-surface-variant font-medium">Não tem uma conta ainda? </span>
          <Link href="/onboarding" className="text-xs text-blue-700 hover:underline font-bold">Cadastre sua Empresa</Link>
        </div>
      </main>

      {/* SEÇÃO DE CAPTAÇÃO VIA QR CODE NA TELA DE LOGIN (NOVO LOCAL SOLICITADO) */}
      <div className="w-full max-w-[420px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col items-center gap-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
          <span className="material-symbols-outlined text-sm">qr_code_2</span>
          <span>Interessados via QR Code</span>
        </div>

        <div>
          <h2 className="text-base font-bold text-blue-950 leading-snug">
            Acesso Rápido por Celular / QR Code
          </h2>
          <p className="text-xs text-blue-900 leading-relaxed mt-1 font-medium">
            Escaneie o QR Code abaixo com a câmera do seu celular para acessar a página de cadastro rápido para interessados na plataforma.
          </p>
        </div>

        {/* CONTAINER QR CODE */}
        <div className="bg-white p-3 rounded-2xl border border-blue-200 shadow-xs flex flex-col items-center gap-2">
          <div className="w-32 h-32 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-center p-2 relative overflow-hidden">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fdestrava-proposta-gov.app%2Fcadastro-rapido&color=00236f"
              alt="QR Code DESTRAVA PROPOSTA GOV"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-[9px] font-bold text-blue-900 tracking-wider uppercase">
            DESTRAVA PROPOSTA GOV
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <button
            type="button"
            onClick={handleCopyQrLink}
            className="flex-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">content_copy</span>
            <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
          </button>

          <Link
            href="/cadastro-rapido"
            target="_blank"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 text-center"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            <span>Abrir Formulário</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
