import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await req.json();

    const checklist = await prisma.checklist.upsert({
      where: {
        proposalId: id,
      },
      update: {
        sicaf: data.sicaf,
        certidaoFederal: data.certidaoFederal,
        certidaoEstadual: data.certidaoEstadual,
        certidaoMunicipal: data.certidaoMunicipal,
        certidaoTrabalhista: data.certidaoTrabalhista,
        certidaoFgts: data.certidaoFgts,
        balancoPatrimonial: data.balancoPatrimonial,
      },
      create: {
        proposalId: id,
        sicaf: data.sicaf,
        certidaoFederal: data.certidaoFederal,
        certidaoEstadual: data.certidaoEstadual,
        certidaoMunicipal: data.certidaoMunicipal,
        certidaoTrabalhista: data.certidaoTrabalhista,
        certidaoFgts: data.certidaoFgts,
        balancoPatrimonial: data.balancoPatrimonial,
      },
    });

    return NextResponse.json({ message: "Checklist atualizado com sucesso.", data: checklist });
  } catch (error: any) {
    console.error("Error saving checklist:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const checklist = await prisma.checklist.findUnique({
      where: {
        proposalId: id,
      },
    });

    return NextResponse.json({ data: checklist });
  } catch (error: any) {
    console.error("Error fetching checklist:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
