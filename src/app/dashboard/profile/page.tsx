import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  const userData = {
    cnpj: user.cnpj,
    razaoSocial: user.razaoSocial,
    endereco: user.endereco,
    banco: user.banco,
    agencia: user.agencia,
    conta: user.conta,
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium">Perfil e Dados da Empresa</h3>
        <p className="text-sm text-muted-foreground">
          Atualize as informações da sua empresa. Esses dados aparecerão nos cabeçalhos das suas propostas e declarações.
        </p>
      </div>
      <div className="max-w-3xl">
        <ProfileForm initialData={userData} />
      </div>
    </div>
  );
}
