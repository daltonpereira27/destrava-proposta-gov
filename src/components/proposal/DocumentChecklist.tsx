"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ChecklistData {
  sicaf: boolean;
  certidaoFederal: boolean;
  certidaoEstadual: boolean;
  certidaoMunicipal: boolean;
  certidaoTrabalhista: boolean;
  certidaoFgts: boolean;
  balancoPatrimonial: boolean;
}

export function DocumentChecklist({ proposalId }: { proposalId: string }) {
  const [checklist, setChecklist] = useState<ChecklistData>({
    sicaf: false,
    certidaoFederal: false,
    certidaoEstadual: false,
    certidaoMunicipal: false,
    certidaoTrabalhista: false,
    certidaoFgts: false,
    balancoPatrimonial: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadChecklist() {
      setLoading(true);
      try {
        const res = await fetch(`/api/proposals/${proposalId}/checklist`);
        const json = await res.json();
        if (json.data) {
          setChecklist(json.data);
        }
      } catch (error) {
        console.error("Failed to load checklist", error);
      }
      setLoading(false);
    }
    loadChecklist();
  }, [proposalId]);

  const handleToggle = (field: keyof ChecklistData) => {
    setChecklist((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/proposals/${proposalId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checklist),
      });
      alert("Checklist salvo com sucesso!");
    } catch (error) {
      console.error("Failed to save checklist", error);
      alert("Erro ao salvar checklist.");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-4">Carregando checklist...</div>;
  }

  const items = [
    { key: "sicaf", label: "SICAF Atualizado (Nível 1 a 4)" },
    { key: "certidaoFederal", label: "Certidão Negativa Federal (Receita/INSS)" },
    { key: "certidaoEstadual", label: "Certidão Negativa Estadual" },
    { key: "certidaoMunicipal", label: "Certidão Negativa Municipal" },
    { key: "certidaoTrabalhista", label: "Certidão Negativa de Débitos Trabalhistas (CNDT)" },
    { key: "certidaoFgts", label: "Certidão de Regularidade do FGTS (CRF)" },
    { key: "balancoPatrimonial", label: "Balanço Patrimonial Registrado (se exigido)" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist Anti-Desclassificação</CardTitle>
        <CardDescription>
          Marque os documentos que você já verificou e validou. Manter a documentação em dia evita a desclassificação da sua proposta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox
                id={item.key}
                checked={checklist[item.key as keyof ChecklistData]}
                onCheckedChange={() => handleToggle(item.key as keyof ChecklistData)}
              />
              <Label htmlFor={item.key} className="cursor-pointer">
                {item.label}
              </Label>
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving} className="mt-4">
            {saving ? "Salvando..." : "Salvar Checklist"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
