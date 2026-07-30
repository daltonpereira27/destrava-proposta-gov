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

  return (
    <div className="flex items-center justify-center min-h-screen p-md">
      <main className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(31,41,55,0.05)] p-lg flex flex-col gap-lg border border-outline-variant md:p-xl">
      <div className="flex flex-col items-center text-center gap-xs">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-xs">
          <span className="material-symbols-outlined text-4xl text-primary">gavel</span>
        </div>
        <h1 className="font-display-sm text-display-sm text-on-surface font-bold">Destrava Proposta Gov</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Acesse sua conta para continuar</p>
        <div className="mt-xs bg-primary/5 border border-primary/20 rounded-lg p-sm text-xs text-on-surface flex flex-col gap-1 text-left">
          <span className="font-semibold text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">key</span> Acesso de Teste (Piloto):
          </span>
          <div><strong>E-mail:</strong> <code className="bg-surface-container px-1 py-0.5 rounded text-primary">piloto@destrava.com.br</code></div>
          <div><strong>Senha:</strong> <code className="bg-surface-container px-1 py-0.5 rounded text-primary">123456</code></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-xs">
          <label htmlFor="email" className="font-label-md text-label-md text-on-surface-variant font-medium">E-mail</label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-sm text-on-surface-variant">mail</span>
            <input 
              type="email" 
              id="email" 
              className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-md pl-10 pr-sm font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50" 
              placeholder="seu@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="font-label-md text-label-md text-on-surface-variant font-medium">Senha</label>
            <Link href="#" className="font-label-sm text-label-sm text-primary hover:underline font-medium">Esqueceu a senha?</Link>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-sm text-on-surface-variant">lock</span>
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-md pl-10 pr-10 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined">{showPassword ? "visibility" : "visibility_off"}</span>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full h-12 bg-primary hover:bg-on-secondary-fixed-variant text-on-primary font-label-lg text-label-lg font-semibold rounded-md transition-colors mt-xs flex items-center justify-center gap-xs disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
          {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
        </button>
      </form>

      <div className="flex items-center gap-sm">
        <div className="h-px bg-outline-variant flex-1"></div>
        <span className="font-label-sm text-label-sm text-on-surface-variant">ou</span>
        <div className="h-px bg-outline-variant flex-1"></div>
      </div>

      <button type="button" className="w-full h-12 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface font-label-md text-label-md font-medium rounded-md transition-colors flex items-center justify-center gap-sm">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Entrar com Google
      </button>

        <div className="text-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Não tem uma conta? </span>
          <Link href="/onboarding" className="font-label-sm text-label-sm text-primary hover:underline font-medium">Cadastre-se</Link>
        </div>
      </main>
    </div>
  );
}
