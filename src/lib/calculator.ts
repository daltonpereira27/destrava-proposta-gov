export interface CalculationInput {
  custoBase: number;
  frete: number;
  taxasFixas: number;
  difalSt: number;
  aliquotaImposto: number; // in percentage, e.g. 6 for 6%
  jurosBancarios: number;  // in percentage
  margemLucroDesejada: number; // in percentage
}

export interface CalculationResult {
  custoTotal: number;
  precoSugerido: number;
  lucroLiquido: number;
  margemReal: number;
  precoPiso: number; // minimum price to break even
  status: "GREEN" | "YELLOW" | "RED";
}

export function calculateMargin(input: CalculationInput): CalculationResult {
  const {
    custoBase,
    frete,
    taxasFixas,
    difalSt,
    aliquotaImposto,
    jurosBancarios,
    margemLucroDesejada,
  } = input;

  const custoTotal = custoBase + frete + taxasFixas + difalSt;

  // Total deductions as a fraction (e.g., 6% + 2% + 15% = 23% = 0.23)
  const deducaoFracao = (aliquotaImposto + jurosBancarios + margemLucroDesejada) / 100;

  // Prevent division by zero or negative if deductions >= 100%
  let precoSugerido = 0;
  if (deducaoFracao < 1) {
    precoSugerido = custoTotal / (1 - deducaoFracao);
  }

  // Preço Piso (Floor Price) is where profit is 0%.
  const deducaoSemLucro = (aliquotaImposto + jurosBancarios) / 100;
  let precoPiso = 0;
  if (deducaoSemLucro < 1) {
    precoPiso = custoTotal / (1 - deducaoSemLucro);
  }

  // Calculate exact values to account for JS floating point imprecisions
  const impostosReais = precoSugerido * (aliquotaImposto / 100);
  const jurosReais = precoSugerido * (jurosBancarios / 100);
  const lucroLiquido = precoSugerido - custoTotal - impostosReais - jurosReais;
  
  const margemReal = precoSugerido > 0 ? (lucroLiquido / precoSugerido) * 100 : 0;

  return {
    custoTotal,
    precoSugerido,
    lucroLiquido,
    margemReal,
    precoPiso,
    status: getViabilityStatus(margemReal),
  };
}

export function calculateReverse(input: Omit<CalculationInput, 'margemLucroDesejada'>, precoVenda: number): CalculationResult {
  const {
    custoBase,
    frete,
    taxasFixas,
    difalSt,
    aliquotaImposto,
    jurosBancarios,
  } = input;

  const custoTotal = custoBase + frete + taxasFixas + difalSt;
  
  const impostosReais = precoVenda * (aliquotaImposto / 100);
  const jurosReais = precoVenda * (jurosBancarios / 100);
  const lucroLiquido = precoVenda - custoTotal - impostosReais - jurosReais;
  
  const margemReal = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0;

  const deducaoSemLucro = (aliquotaImposto + jurosBancarios) / 100;
  let precoPiso = 0;
  if (deducaoSemLucro < 1) {
    precoPiso = custoTotal / (1 - deducaoSemLucro);
  }

  return {
    custoTotal,
    precoSugerido: precoVenda,
    lucroLiquido,
    margemReal,
    precoPiso,
    status: getViabilityStatus(margemReal),
  };
}

export function getViabilityStatus(margem: number): "GREEN" | "YELLOW" | "RED" {
  if (margem < 0) return "RED";      // Inexequível / Prejuízo (sinal em vermelho)
  if (margem < 5) return "YELLOW";   // Lucro muito baixo
  return "GREEN";                    // Lucro saudável
}
