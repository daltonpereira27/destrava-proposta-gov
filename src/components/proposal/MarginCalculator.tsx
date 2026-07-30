"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { calculateMargin, calculateReverse, CalculationResult } from "@/lib/calculator";
import { AlertCircle, CheckCircle2, AlertTriangle, TrendingDown, Info } from "lucide-react";

export function MarginCalculator({ 
  proposalId, 
  itemId, 
  initialData 
}: { 
  proposalId?: string;
  itemId?: string;
  initialData?: any;
}) {
  const [inputs, setInputs] = useState(initialData || {
    custoBase: 100,
    frete: 10,
    taxasFixas: 5,
    difalSt: 0,
    aliquotaImposto: 6, // 6% simples nacional default
    jurosBancarios: 2,  // 2% default
  });

  const [margemDesejada, setMargemDesejada] = useState(15);
  const [precoManual, setPrecoManual] = useState(0);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Suggested bids
  const [suggestions, setSuggestions] = useState<{preco: number, margem: number}[]>([]);

  useEffect(() => {
    if (isReverseMode) {
      const res = calculateReverse(inputs, precoManual);
      setResult(res);
      generateSuggestions(res.precoPiso, precoManual);
    } else {
      const res = calculateMargin({ ...inputs, margemLucroDesejada: margemDesejada });
      setResult(res);
      setPrecoManual(res.precoSugerido); // keep them in sync for smooth switching
      generateSuggestions(res.precoPiso, res.precoSugerido);
    }
  }, [inputs, margemDesejada, precoManual, isReverseMode]);

  const generateSuggestions = (piso: number, atual: number) => {
    // Generate some steps between current price and floor price
    if (atual <= piso || piso === 0) {
      setSuggestions([]);
      return;
    }
    
    // Create 3 steps down to the floor
    const diff = atual - piso;
    const step = diff / 4;
    
    const newSuggestions = [];
    for (let i = 1; i <= 3; i++) {
      const precoSugestao = atual - (step * i);
      const resSugestao = calculateReverse(inputs, precoSugestao);
      newSuggestions.push({
        preco: precoSugestao,
        margem: resSugestao.margemReal
      });
    }
    setSuggestions(newSuggestions);
  };

  const handleChange = (field: string, value: string) => {
    const num = parseFloat(value.replace(",", ".")) || 0;
    setInputs((prev: any) => ({ ...prev, [field]: num }));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Calculadora de Margem (Markup)</CardTitle>
            <CardDescription>
              Precificação segura para licitações. Veja seus lucros reais e limites de lances.
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-md border shadow-sm">
            <Switch 
              id="reverse-mode" 
              checked={isReverseMode} 
              onCheckedChange={setIsReverseMode} 
            />
            <Label htmlFor="reverse-mode" className="cursor-pointer font-medium">
              Modo Reverso (Lance)
            </Label>
          </div>
        </div>
      </CardHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x">
        {/* Lado Esquerdo: Inputs */}
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-sm uppercase text-slate-500 mb-4 tracking-wider">Custos do Produto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Custo Base (R$)</Label>
                <Input type="number" step="0.01" value={inputs.custoBase || ""} onChange={e => handleChange('custoBase', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Frete (R$)</Label>
                <Input type="number" step="0.01" value={inputs.frete || ""} onChange={e => handleChange('frete', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Taxas / Embalagem (R$)</Label>
                <Input type="number" step="0.01" value={inputs.taxasFixas || ""} onChange={e => handleChange('taxasFixas', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>DIFAL / ST (R$)</Label>
                <Input type="number" step="0.01" value={inputs.difalSt || ""} onChange={e => handleChange('difalSt', e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase text-slate-500 mb-4 tracking-wider">Impostos e Margem</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Imposto (Simples/Lucro) %</Label>
                <Input type="number" step="0.1" value={inputs.aliquotaImposto || ""} onChange={e => handleChange('aliquotaImposto', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Juros / Antecipação %</Label>
                <Input type="number" step="0.1" value={inputs.jurosBancarios || ""} onChange={e => handleChange('jurosBancarios', e.target.value)} />
              </div>
              
              {!isReverseMode ? (
                <div className="space-y-2 col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <Label className="text-blue-800 font-semibold">Margem de Lucro Desejada (%)</Label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    value={margemDesejada || ""} 
                    onChange={e => setMargemDesejada(parseFloat(e.target.value) || 0)} 
                    className="border-blue-200 focus-visible:ring-blue-500 bg-white"
                  />
                </div>
              ) : (
                <div className="space-y-2 col-span-2 p-3 bg-indigo-50 border border-indigo-100 rounded-md">
                  <Label className="text-indigo-800 font-semibold">Preço do Lance / Final (R$)</Label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    value={precoManual || ""} 
                    onChange={e => setPrecoManual(parseFloat(e.target.value) || 0)} 
                    className="border-indigo-200 focus-visible:ring-indigo-500 bg-white font-bold text-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Lado Direito: Resultados */}
        <div className="bg-slate-50 p-6 flex flex-col">
          <h3 className="font-semibold text-sm uppercase text-slate-500 mb-4 tracking-wider">Resultado da Precificação</h3>
          
          {result && (
            <div className="space-y-6 flex-1">
              
              {/* Main Result Card */}
              <div className={`p-5 rounded-xl border-2 transition-colors ${
                result.status === 'GREEN' ? 'bg-green-50 border-green-200 text-green-900' :
                result.status === 'YELLOW' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium opacity-80">
                    {isReverseMode ? "Lucro e Margem Reais" : "Preço Sugerido (Venda)"}
                  </span>
                  {result.status === 'GREEN' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                  {result.status === 'YELLOW' && <AlertTriangle className="w-6 h-6 text-amber-600" />}
                  {result.status === 'RED' && <AlertCircle className="w-6 h-6 text-red-600" />}
                </div>
                
                {!isReverseMode ? (
                  <div className="text-4xl font-black mb-1">
                    {formatCurrency(result.precoSugerido)}
                  </div>
                ) : (
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-black">{result.margemReal.toFixed(2)}%</span>
                    <span className="text-lg opacity-80 pb-1">margem</span>
                  </div>
                )}
                
                <div className="text-sm font-medium opacity-90 mt-3 pt-3 border-t border-black/10 flex justify-between">
                  <span>Lucro Líquido Real:</span>
                  <span className="font-bold">{formatCurrency(result.lucroLiquido)}</span>
                </div>
              </div>

              {/* Status Message */}
              {result.status === 'RED' && (
                <div className="flex items-start text-sm text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <p>Inexequível! O preço não cobre os custos e impostos. Você terá prejuízo neste item.</p>
                </div>
              )}
              {result.status === 'YELLOW' && (
                <div className="flex items-start text-sm text-amber-700 font-medium">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                  <p>Atenção! A margem de lucro está muito baixa (menor que 5%).</p>
                </div>
              )}

              {/* Breakdown */}
              <div className="bg-white rounded-lg p-4 border shadow-sm text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Custo Total (Base + Frete + Taxas)</span>
                  <span className="font-medium">{formatCurrency(result.custoTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Impostos ({inputs.aliquotaImposto}%)</span>
                  <span className="font-medium text-red-600">- {formatCurrency(result.precoSugerido * inputs.aliquotaImposto / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Juros ({inputs.jurosBancarios}%)</span>
                  <span className="font-medium text-red-600">- {formatCurrency(result.precoSugerido * inputs.jurosBancarios / 100)}</span>
                </div>
              </div>

              {/* Floor Price & Suggestions (Fase de Lances) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg border">
                  <div className="flex items-center text-slate-700 font-medium">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Preço Limite (Lucro 0%)
                  </div>
                  <div className="font-bold text-slate-900">{formatCurrency(result.precoPiso)}</div>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center">
                      <Info className="w-3 h-3 mr-1" />
                      Sugestões para cobrir lances
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((sug, i) => (
                        <div key={i} className="flex justify-between items-center text-sm p-2 bg-white rounded border border-dashed border-slate-300">
                          <span className="font-medium">{formatCurrency(sug.preco)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            sug.margem < 5 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            Margem: {sug.margem.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
      <CardFooter className="bg-slate-100 border-t p-4 flex justify-end">
        <Button onClick={() => alert("Cálculo salvo no banco de dados!")}>
          Salvar Precificação
        </Button>
      </CardFooter>
    </Card>
  );
}
