import { ProposalWizard } from "@/components/proposal/ProposalWizard";

export default function NovaPropostaPage() {
  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Proposta</h1>
        <p className="text-muted-foreground mt-1">
          Faça o upload do edital para extração automática e análise de itens.
        </p>
      </div>
      <ProposalWizard />
    </div>
  );
}
