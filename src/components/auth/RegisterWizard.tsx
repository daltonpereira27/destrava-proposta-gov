"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, AlertCircle, Building2, User, Landmark } from "lucide-react";

const BANKS = [
  "001 - Banco do Brasil S.A.",
  "104 - Caixa Econômica Federal",
  "033 - Banco Santander (Brasil) S.A.",
  "341 - Itaú Unibanco S.A.",
  "237 - Banco Bradesco S.A.",
  "077 - Banco Inter S.A.",
  "260 - Nu Pagamentos S.A. (Nubank)",
  "Outro",
];

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

export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // States - Passo 1
  const [cnpj, setCnpj] = useState("");
  const [cnpjData, setCnpjData] = useState<any>(null);
  const [cnpjStatus, setCnpjStatus] = useState<"idle" | "loading" | "success" | "not_found" | "error">("idle");

  // States - Campos da empresa (editáveis)
  const [companyData, setCompanyData] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    naturezaJuridica: "",
    porte: "",
    dataAbertura: "",
    endereco: "",
    telefone: "",
    cnaePrincipal: "",
  });
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  // States - Passo 2
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  // States - Passo 3
  const [banco, setBanco] = useState(BANKS[0]);
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [sameNameChecked, setSameNameChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  // Calcula força da senha
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };
  const pwStrength = getPasswordStrength();

  const handleCnpjSearch = async () => {
    const rawCnpj = cnpj.replace(/\D/g, "");
    if (rawCnpj.length !== 14) {
      setError("CNPJ deve ter 14 dígitos.");
      return;
    }
    
    setError("");
    setCnpjStatus("loading");
    
    try {
      const res = await fetch(`/api/cnpj/${rawCnpj}`);
      if (!res.ok) {
        if (res.status === 404) setCnpjStatus("not_found");
        else setCnpjStatus("error");
        return;
      }
      
      const { data } = await res.json();
      setCnpjData(data);
      setCnpjStatus("success");
      
      // Auto-populate
      setCompanyData({
        razaoSocial: data.razao_social || "",
        nomeFantasia: data.nome_fantasia || "",
        naturezaJuridica: data.natureza_juridica || "",
        porte: data.porte || "",
        dataAbertura: data.data_inicio_atividade || "",
        endereco: `${data.logradouro}, ${data.numero}${data.complemento ? " - " + data.complemento : ""} - ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`,
        telefone: data.ddd_telefone_1 || "",
        cnaePrincipal: data.cnae_fiscal_descricao || "",
      });
      setEditedFields(new Set()); // reset edited fields
    } catch (err) {
      setCnpjStatus("error");
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
    setEditedFields((prev) => {
      const newSet = new Set(prev);
      newSet.add(name);
      return newSet;
    });
  };

  const renderBadge = (fieldName: string) => {
    if (!cnpjData) return null;
    if (editedFields.has(fieldName)) {
      return <span className="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Editado</span>;
    }
    return <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Receita Federal</span>;
  };

  const submitFinal = async () => {
    if (!sameNameChecked) {
      setError("Confirme que a conta bancária está no nome da empresa.");
      return;
    }
    if (!termsChecked) {
      setError("Aceite os termos de uso para continuar.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, password,
          cnpj, ...companyData,
          banco, agencia, conta,
          termsAccepted: termsChecked
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || "Erro no cadastro");
      }
      
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-6">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Empresa</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Acesso</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Bancário</span>
          </div>
        </div>

        <CardTitle>{step === 1 ? 'Dados da Empresa' : step === 2 ? 'Dados de Acesso' : 'Dados Bancários'}</CardTitle>
        <CardDescription>
          {step === 1 ? 'Identifique sua empresa para automatizar as propostas.' : 
           step === 2 ? 'Crie as credenciais do representante legal.' : 
           'Informações para recebimento das vendas ao governo.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* PASSO 1: EMPRESA */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj" 
                  placeholder="00.000.000/0001-00" 
                  value={cnpj} 
                  maxLength={18}
                  onChange={(e) => setCnpj(formatCNPJ(e.target.value))} 
                />
              </div>
              <Button onClick={handleCnpjSearch} disabled={cnpjStatus === 'loading' || cnpj.length < 14}>
                {cnpjStatus === 'loading' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Buscar na Receita
              </Button>
            </div>

            {cnpjStatus === 'success' && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 flex items-center border border-green-200">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Empresa encontrada com sucesso! Revise os dados abaixo.
              </div>
            )}
            
            {cnpjStatus === 'not_found' && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                CNPJ não encontrado na Receita Federal. Verifique o número digitado.
              </div>
            )}
            
            {cnpjStatus === 'error' && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700 border border-amber-200">
                Não foi possível consultar a Receita Federal agora. Você pode preencher manualmente.
              </div>
            )}

            {(cnpjData || cnpjStatus === 'error') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {(companyData.porte === "MICRO EMPRESA" || companyData.porte === "EMPRESA DE PEQUENO PORTE") && (
                  <div className="col-span-1 md:col-span-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800 border border-blue-200">
                    <strong>Benefício Identificado:</strong> Sua empresa é ME/EPP. Você tem preferência de contratação em licitações (LC 123/2006).
                  </div>
                )}
                
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label>Razão Social {renderBadge('razaoSocial')}</Label>
                  <Input name="razaoSocial" value={companyData.razaoSocial} onChange={handleCompanyChange} />
                </div>
                
                <div className="space-y-2">
                  <Label>Nome Fantasia {renderBadge('nomeFantasia')}</Label>
                  <Input name="nomeFantasia" value={companyData.nomeFantasia} onChange={handleCompanyChange} />
                </div>
                
                <div className="space-y-2">
                  <Label>Natureza Jurídica {renderBadge('naturezaJuridica')}</Label>
                  <Input name="naturezaJuridica" value={companyData.naturezaJuridica} onChange={handleCompanyChange} />
                </div>

                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label>Endereço Completo {renderBadge('endereco')}</Label>
                  <Input name="endereco" value={companyData.endereco} onChange={handleCompanyChange} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASSO 2: ACESSO */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label>Nome Completo do Responsável</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="João Silva" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>E-mail de Acesso</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" />
              </div>
              <div className="space-y-2">
                <Label>Telefone / WhatsApp</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {password && (
                  <div className="flex gap-1 h-1.5 mt-2">
                    <div className={`flex-1 rounded-full ${pwStrength >= 25 ? 'bg-red-500' : 'bg-slate-200'}`} />
                    <div className={`flex-1 rounded-full ${pwStrength >= 50 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                    <div className={`flex-1 rounded-full ${pwStrength >= 75 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                    <div className={`flex-1 rounded-full ${pwStrength >= 100 ? 'bg-green-500' : 'bg-slate-200'}`} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Confirmar Senha</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* PASSO 3: BANCO */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
              <p>Em licitações, a conta bancária para recebimento <strong>deve obrigatoriamente</strong> estar no nome da pessoa jurídica (CNPJ cadastrado).</p>
            </div>
            
            <div className="space-y-2">
              <Label>Banco</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={banco} 
                onChange={(e) => setBanco(e.target.value)}
              >
                {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Agência (sem dígito)</Label>
                <Input value={agencia} onChange={(e) => setAgencia(e.target.value)} placeholder="0000" />
              </div>
              <div className="space-y-2">
                <Label>Conta com Dígito</Label>
                <Input value={conta} onChange={(e) => setConta(e.target.value)} placeholder="00000-0" />
              </div>
            </div>

            <div className="pt-4 space-y-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox id="sameName" checked={sameNameChecked} onCheckedChange={(c) => setSameNameChecked(c === true)} />
                <label htmlFor="sameName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Confirmo que a conta informada está em nome da empresa (CNPJ {cnpj || "informado"}).
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={termsChecked} onCheckedChange={(c) => setTermsChecked(c === true)} />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Li e concordo com os Termos de Uso e Política de Privacidade.
                </label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/50">
        {step > 1 ? (
          <Button variant="outline" onClick={() => { setStep(step - 1); setError(""); }}>
            Voltar
          </Button>
        ) : <div />}
        
        {step < 3 ? (
          <Button onClick={() => {
            if (step === 1 && (!cnpj || !companyData.razaoSocial)) {
              setError("Preencha o CNPJ e a Razão Social para avançar.");
              return;
            }
            if (step === 2 && (!name || !email || !password || password !== confirmPassword)) {
              setError("Preencha os dados de acesso e confirme a senha corretamente.");
              return;
            }
            setError("");
            setStep(step + 1);
          }}>
            Próximo Passo
          </Button>
        ) : (
          <Button onClick={submitFinal} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Finalizar Cadastro
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
