"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateProfile(data: {
  cnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return { error: "Não autorizado" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        cnpj: data.cnpj,
        razaoSocial: data.razaoSocial,
        endereco: data.endereco,
        banco: data.banco,
        agencia: data.agencia,
        conta: data.conta,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { error: "Erro interno ao atualizar o perfil." };
  }
}
