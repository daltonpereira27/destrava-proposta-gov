"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Loader2, CheckCircle2, FileText, ListChecks, FileSearch, Trash2 } from "lucide-react";

export function ProposalWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States - Passo 1 (Upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // States - Passo 2 (Edital Data)
  const [editalData, setEditalData] = useState({
    numero: "",
    orgao: "",
    dataAbertura: "",
    objeto: "",
  });

  // States - Passo 3 (Itens)
  const [items, setItems] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUploadAndExtract = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione um arquivo primeiro.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/extract-proposal", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Erro na extração dos dados.");
      }

      const { data } = await res.json();
      
      setEditalData({
        numero: data.edital?.numero || "",
        orgao: data.edital?.orgao || "",
        dataAbertura: data.edital?.dataAbertura || "",
        objeto: data.edital?.objeto || "",
      });

      setItems(data.itens || []);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-6">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <FileUp className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Upload</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Edital</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <ListChecks className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Itens</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center ${step >= 4 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 4 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Resumo</span>
          </div>
        </div>

        <CardTitle>
          {step === 1 && "Nova Proposta"}
          {step === 2 && "Dados do Edital"}
          {step === 3 && "Revisão de Itens"}
          {step === 4 && "Resumo da Proposta"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Faça upload do edital em PDF para extração automática via Inteligência Artificial."}
          {step === 2 && "Confirme ou edite os dados extraídos do cabeçalho do edital."}
          {step === 3 && "Revise os itens encontrados e ajuste descrições e quantidades."}
          {step === 4 && "Valide todas as informações antes de salvar o rascunho."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* PASSO 1: UPLOAD */}
        {step === 1 && (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">Clique ou arraste um edital em PDF aqui</p>
              <p className="text-xs text-slate-400">Tamanho máximo: 10MB</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="application/pdf"
                className="hidden" 
              />
            </div>
            {selectedFile && (
              <div className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                <FileText className="w-5 h-5 mr-3 shrink-0" />
                <span className="truncate flex-1">{selectedFile.name}</span>
                <span className="text-xs font-medium bg-blue-100 px-2 py-1 rounded">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>
        )}

        {/* PASSO 2: DADOS DO EDITAL */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label>Número do Edital / Pregão</Label>
              <Input 
                value={editalData.numero} 
                onChange={(e) => setEditalData({...editalData, numero: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Abertura</Label>
              <Input 
                value={editalData.dataAbertura} 
                onChange={(e) => setEditalData({...editalData, dataAbertura: e.target.value})} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Órgão Comprador</Label>
              <Input 
                value={editalData.orgao} 
                onChange={(e) => setEditalData({...editalData, orgao: e.target.value})} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Objeto da Licitação</Label>
              <Input 
                value={editalData.objeto} 
                onChange={(e) => setEditalData({...editalData, objeto: e.target.value})} 
              />
            </div>
          </div>
        )}

        {/* PASSO 3: ITENS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Item</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[100px]">Qtd</TableHead>
                    <TableHead className="w-[100px]">Unid.</TableHead>
                    <TableHead className="w-[120px]">Valor Ref.</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input 
                          value={item.numero || ""} 
                          onChange={(e) => handleItemChange(index, "numero", e.target.value)} 
                          className="w-16 h-8 text-sm px-2"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.descricao || ""} 
                          onChange={(e) => handleItemChange(index, "descricao", e.target.value)} 
                          className="h-8 text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.quantidade || ""} 
                          onChange={(e) => handleItemChange(index, "quantidade", e.target.value)} 
                          className="h-8 text-sm px-2"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.unidade || ""} 
                          onChange={(e) => handleItemChange(index, "unidade", e.target.value)} 
                          className="h-8 text-sm px-2"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.valorReferencia || ""} 
                          onChange={(e) => handleItemChange(index, "valorReferencia", e.target.value)} 
                          className="h-8 text-sm px-2"
                          placeholder="R$ 0,00"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="h-8 w-8 text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                        Nenhum item encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" size="sm" onClick={() => setItems([...items, { numero: "", descricao: "", quantidade: "", unidade: "", valorReferencia: "" }])}>
              + Adicionar Item Manualmente
            </Button>
          </div>
        )}

        {/* PASSO 4: RESUMO */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h3 className="font-semibold text-lg mb-2">Resumo da Licitação</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div><span className="text-slate-500">Órgão:</span> {editalData.orgao}</div>
                <div><span className="text-slate-500">Edital:</span> {editalData.numero}</div>
                <div><span className="text-slate-500">Abertura:</span> {editalData.dataAbertura}</div>
                <div className="col-span-2"><span className="text-slate-500">Objeto:</span> {editalData.objeto}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <ListChecks className="w-4 h-4 mr-2 text-blue-600" />
                Itens a cotar ({items.length})
              </h3>
              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white border rounded-md text-sm">
                    <div className="flex-1">
                      <span className="font-medium mr-2">Item {it.numero}:</span>
                      <span className="text-slate-700">{it.descricao}</span>
                    </div>
                    <div className="font-medium text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                      {it.quantidade} {it.unidade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rounded-md bg-green-50 p-4 text-green-800 flex items-start border border-green-200">
              <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tudo pronto!</p>
                <p className="text-sm mt-1">Ao salvar, este edital será adicionado ao seu painel e você poderá iniciar a precificação dos itens e o cálculo de margem.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/50">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        ) : <div />}
        
        {step === 1 ? (
          <Button onClick={handleUploadAndExtract} disabled={loading || !selectedFile}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Extrair com IA"}
          </Button>
        ) : step < 4 ? (
          <Button onClick={() => setStep(step + 1)}>
            Próximo Passo
          </Button>
        ) : (
          <Button onClick={() => {
            // Em breve: chamar API para salvar no banco
            alert("Proposta salva com sucesso!");
          }}>
            Salvar Proposta
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
