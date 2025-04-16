interface ResultadoCalculo {
  primeiraParcela: number;
  ultimaParcela: number;
  totalPago: number;
  totalJuros: number;
}

export interface AmortizacaoStrategy {
  calcular(valorFinanciado: number, taxaJurosMensal: number, prazoMeses: number): ResultadoCalculo;
}

export { ResultadoCalculo }; 