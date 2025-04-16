import { AmortizacaoStrategy, ResultadoCalculo } from './AmortizacaoStrategy';

export class PriceStrategy implements AmortizacaoStrategy {
  calcular(valorFinanciado: number, taxaJurosMensal: number, prazoMeses: number): ResultadoCalculo {
    // Fórmula PRICE: PMT = PV * (i * (1 + i)^n) / ((1 + i)^n - 1)
    const parcela = valorFinanciado * 
      (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) / 
      (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);

    const totalPago = parcela * prazoMeses;
    const totalJuros = totalPago - valorFinanciado;

    return {
      primeiraParcela: parcela,
      ultimaParcela: parcela, // No PRICE as parcelas são iguais
      totalPago,
      totalJuros
    };
  }
} 