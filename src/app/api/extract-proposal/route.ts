import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is provided
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { message: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 }
      );
    }

    // Prepare the model
    // Gemini 1.5 Flash is fast and cheap, suitable for standard parsing.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Read the file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Prepare the part for the Gemini prompt
    const filePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type, // e.g., "application/pdf"
      },
    };

    const prompt = `
      Você é um especialista em licitações públicas no Brasil.
      Sua tarefa é ler este documento (provavelmente um edital de licitação em PDF) e extrair os itens (produtos ou serviços) que estão sendo licitados.
      
      Retorne APENAS um JSON válido com a seguinte estrutura:
      {
        "edital": {
          "numero": "Número do edital",
          "orgao": "Nome do órgão",
          "dataAbertura": "Data de abertura (se houver)",
          "objeto": "Objeto da licitação resumo"
        },
        "itens": [
          {
            "numero": "Número do item",
            "descricao": "Descrição detalhada do item",
            "quantidade": "Quantidade (número)",
            "unidade": "Unidade de medida (ex: UN, KG, L)",
            "valorReferencia": "Valor de referência (se houver)"
          }
        ]
      }
      Certifique-se de que a resposta seja estritamente o JSON, sem markdown ou explicações.
    `;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting from the response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", text);
      return NextResponse.json(
        { message: "A IA não retornou um formato válido.", rawResponse: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: parsedData });

  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error during extraction." },
      { status: 500 }
    );
  }
}
