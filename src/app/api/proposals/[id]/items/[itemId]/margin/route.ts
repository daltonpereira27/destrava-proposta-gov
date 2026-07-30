import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
  try {
    const data = await req.json();

    // We assume the user is authenticated in a real app
    // const session = await getServerSession(authOptions);

    // Verify if the item exists
    const item = await prisma.proposalItem.findUnique({
      where: { id: itemId, proposalId: id },
    });

    if (!item) {
      return NextResponse.json({ message: "Item não encontrado." }, { status: 404 });
    }

    // Upsert MarginCalculation
    const marginCalc = await prisma.marginCalculation.upsert({
      where: {
        itemId: itemId,
      },
      update: {
        custoBase: data.custoBase,
        aliquotaImposto: data.aliquotaImposto,
        frete: data.frete,
        taxas: data.taxasFixas,
        difalSt: data.difalSt,
        jurosBancarios: data.jurosBancarios,
        margemLucro: data.margemLucroDesejada || data.margemReal,
        precoSugerido: data.precoSugerido,
        lucroLiquido: data.lucroLiquido,
        exequibilidadeStatus: data.status,
      },
      create: {
        itemId: itemId,
        custoBase: data.custoBase,
        aliquotaImposto: data.aliquotaImposto,
        frete: data.frete,
        taxas: data.taxasFixas,
        difalSt: data.difalSt,
        jurosBancarios: data.jurosBancarios,
        margemLucro: data.margemLucroDesejada || data.margemReal,
        precoSugerido: data.precoSugerido,
        lucroLiquido: data.lucroLiquido,
        exequibilidadeStatus: data.status,
      },
    });

    return NextResponse.json({ message: "Cálculo de margem salvo com sucesso.", data: marginCalc });
  } catch (error: any) {
    console.error("Error saving margin calculation:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
