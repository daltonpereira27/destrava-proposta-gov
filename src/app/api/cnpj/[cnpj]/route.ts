import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

// Cache para evitar bater na BrasilAPI múltiplas vezes para o mesmo CNPJ (limite de requests / performance)
const cnpjCache = new LRUCache<string, any>({
  max: 100, // Máximo de 100 CNPJs em cache na memória
  ttl: 1000 * 60 * 60, // 1 hora de TTL
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  try {
    const { cnpj } = await params;
    const rawCnpj = cnpj.replace(/\D/g, ""); // Remove pontuação

    if (rawCnpj.length !== 14) {
      return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
    }

    // Verifica se já temos em cache
    const cachedData = cnpjCache.get(rawCnpj);
    if (cachedData) {
      return NextResponse.json({ source: "cache", data: cachedData });
    }

    // Consulta na BrasilAPI com User-Agent apropriado
    let data = null;
    let source = "brasilapi";

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        data = await res.json();
      }
    } catch (e) {
      console.warn("BrasilAPI falhou, tentando API secundária MinhaReceita...");
    }

    // Fallback para MinhaReceita se a BrasilAPI falhar
    if (!data) {
      try {
        const resFallback = await fetch(`https://minhareceita.org/${rawCnpj}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            "Accept": "application/json",
          },
        });
        if (resFallback.ok) {
          data = await resFallback.json();
          source = "minhareceita";
        }
      } catch (e) {
        console.error("MinhaReceita também falhou.");
      }
    }

    if (!data) {
      return NextResponse.json({ error: "CNPJ não encontrado ou indisponível na Receita Federal." }, { status: 404 });
    }
    
    // Salva no cache
    cnpjCache.set(rawCnpj, data);

    return NextResponse.json({ source, data });
  } catch (error) {
    console.error("Erro na consulta de CNPJ:", error);
    return NextResponse.json({ error: "Erro interno ao processar a consulta" }, { status: 500 });
  }
}
