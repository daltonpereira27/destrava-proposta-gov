"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type UserData = {
  cnpj: string | null;
  razaoSocial: string | null;
  endereco: string | null;
  banco: string | null;
  agencia: string | null;
  conta: string | null;
};

export function ProfileForm({ initialData }: { initialData: UserData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cnpj: initialData.cnpj || "",
    razaoSocial: initialData.razaoSocial || "",
    endereco: initialData.endereco || "",
    banco: initialData.banco || "",
    agencia: initialData.agencia || "",
    conta: initialData.conta || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await updateProfile(formData);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
        router.refresh();
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erro inesperado ao salvar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Empresa</CardTitle>
        <CardDescription>
          Preencha os dados da sua empresa. Eles serão utilizados para gerar as propostas e declarações.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="razaoSocial">Razão Social</Label>
              <Input
                id="razaoSocial"
                name="razaoSocial"
                placeholder="Sua Empresa LTDA"
                value={formData.razaoSocial}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input
              id="endereco"
              name="endereco"
              placeholder="Rua Exemplo, 123, Bairro, Cidade - UF, CEP"
              value={formData.endereco}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="banco">Banco (Nome/Número)</Label>
              <Input
                id="banco"
                name="banco"
                placeholder="Ex: Banco do Brasil (001)"
                value={formData.banco}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agencia">Agência</Label>
              <Input
                id="agencia"
                name="agencia"
                placeholder="0000-0"
                value={formData.agencia}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conta">Conta Corrente</Label>
              <Input
                id="conta"
                name="conta"
                placeholder="00000-0"
                value={formData.conta}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
