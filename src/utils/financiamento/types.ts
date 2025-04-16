export type SistemaAmortizacao = 'PRICE' | 'SAC';
export type Indexador = 'TR' | 'POUPANCA' | 'IPCA' | 'FIXA';

export interface ParametrosFinanciamento {
  valorImovel: number;
  valorEntrada: number;
  rendaMensal: number;
  sistema: SistemaAmortizacao;
  prazoMeses?: number;
  indexador?: Indexador;
}

export interface ResultadoFinanciamento {
  valorImovel: number;
  valorEntrada: number;
  valorFinanciado: number;
  percentualEntrada: number;
  primeiraParcela: number;
  ultimaParcela: number;
  prazoMeses: number;
  taxaJurosAnual: number;
  taxaJurosMensal: number;
  totalJuros: number;
  totalPago: number;
  sistema: SistemaAmortizacao;
  indexador: Indexador;
} 