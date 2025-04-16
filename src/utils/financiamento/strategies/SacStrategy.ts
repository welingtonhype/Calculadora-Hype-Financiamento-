import { AmortizacaoStrategy, ResultadoCalculo } from './AmortizacaoStrategy';

export class SacStrategy implements AmortizacaoStrategy {
  calcular(valorFinanciado: number, taxaJurosMensal: number, prazoMeses: number): ResultadoCalculo {
    const amortizacao = valorFinanciado / prazoMeses;
    const primeiraParcela = amortizacao + (valorFinanciado * taxaJurosMensal);
    const ultimaParcela = amortizacao + (amortizacao * taxaJurosMensal);
    
    // No SAC, os juros formam uma PA decrescente
    const jurosPrimeiraParcela = valorFinanciado * taxaJurosMensal;
    const jurosUltimaParcela = amortizacao * taxaJurosMensal;
    const totalJuros = ((jurosPrimeiraParcela + jurosUltimaParcela) * prazoMeses) / 2;
    const totalPago = valorFinanciado + totalJuros;

    return {
      primeiraParcela,
      ultimaParcela,
      totalPago,
      totalJuros
    };
  }
} 