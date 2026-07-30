import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MarginCalculator } from "@/components/proposal/MarginCalculator";
import { DocumentChecklist } from "@/components/proposal/DocumentChecklist";
import { DeclarationGenerator } from "@/components/proposal/DeclarationGenerator";

export default async function ProposalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposalId = id;

  // Em produção, você pegaria o userId da sessão.
  // const session = await getServerSession(authOptions);

  const proposal = await prisma.proposal.findUnique({
    where: { id: proposalId },
    include: {
      user: true,
      items: {
        include: {
          marginCalculation: true,
        },
      },
    },
  });

  if (!proposal) {
    redirect("/dashboard");
  }

  const companyData = {
    razaoSocial: proposal.user.razaoSocial || "",
    cnpj: proposal.user.cnpj || "",
    endereco: proposal.user.endereco || "",
  };

  const proposalData = {
    numPregao: proposal.numPregao || "",
    orgao: proposal.orgao || "",
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposta: {proposal.numPregao || "Sem número"}</h1>
          <p className="text-gray-500">Órgão: {proposal.orgao || "Não especificado"}</p>
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Itens e Precificação</TabsTrigger>
          <TabsTrigger value="docs">Documentos e Declarações</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6 mt-6">
          {proposal.items.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p>Nenhum item encontrado nesta proposta.</p>
              </CardContent>
            </Card>
          ) : (
            proposal.items.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Item: {item.descricao}</CardTitle>
                  <CardDescription>
                    Qtd: {item.quantidade} | Valor Unitário Estimado: R$ {item.valorUnitario.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarginCalculator
                    proposalId={proposal.id}
                    itemId={item.id}
                    initialData={item.marginCalculation ? {
                      custoBase: item.marginCalculation.custoBase,
                      aliquotaImposto: item.marginCalculation.aliquotaImposto,
                      frete: item.marginCalculation.frete,
                      taxasFixas: item.marginCalculation.taxas,
                      difalSt: item.marginCalculation.difalSt,
                      jurosBancarios: item.marginCalculation.jurosBancarios,
                      margemLucroDesejada: item.marginCalculation.margemLucro,
                      precoSugerido: item.marginCalculation.precoSugerido,
                    } : undefined}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="docs" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <DocumentChecklist proposalId={proposal.id} />
            </div>
            <div>
              <DeclarationGenerator company={companyData} proposal={proposalData} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
