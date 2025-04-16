/**
 * Tipo de sistema de amortização
 */
export type AmortizationSystem = 'PRICE' | 'SAC';

/**
 * Tipo de indexador
 */
export type Indexador = 'TR' | 'POUPANCA' | 'IPCA' | 'FIXA';

interface TaxasJuros {
  [key: string]: {
    SAC: number;
    PRICE: number;
  };
}

const TAXAS_JUROS: TaxasJuros = {
  TR: { SAC: 11.49, PRICE: 10.99 },
  POUPANCA: { SAC: 5.06, PRICE: 4.12 },
  IPCA: { SAC: 4.5, PRICE: 4.0 },
  FIXA: { SAC: 11.0, PRICE: 10.5 }
};

const PRAZO_PADRAO = 420; // 35 anos em meses
const INDEXADOR_PADRAO: Indexador = 'TR';
const PERCENTUAL_RENDA_MAXIMO = 0.3; // 30% da renda

/**
 * Calcula o financiamento utilizando o sistema selecionado (PRICE ou SAC)
 */
export const calculateFinanciamento = (
  valorImovel: number,
  entrada: number,
  rendaMensal?: number,
  sistema: AmortizationSystem = 'SAC',
  prazoMeses: number = PRAZO_PADRAO,
  indexador: Indexador = INDEXADOR_PADRAO
) => {
  // Garante que os valores são números
  const valorImovelNum = Number(valorImovel);
  const entradaNum = Number(entrada);
  const rendaMensalNum = rendaMensal ? Number(rendaMensal) : undefined;

  // Obtém a taxa de juros anual baseada no indexador e sistema
  const taxaJurosAnual = TAXAS_JUROS[indexador][sistema];
  const taxaJurosMensal = taxaJurosAnual / 12 / 100;
  
  // Calcula o valor máximo da parcela (30% da renda)
  const parcelaMaxima = rendaMensalNum ? rendaMensalNum * PERCENTUAL_RENDA_MAXIMO : undefined;
  
  // Calcula o valor financiado
  const valorFinanciado = valorImovelNum - entradaNum;
  
  let parcela = 0;
  let totalPago = 0;
  let totalJuros = 0;
  let parcelaFinal = 0; // Apenas para SAC
  
  if (sistema === 'PRICE') {
    // Cálculo da parcela mensal no sistema PRICE (parcelas fixas)
    parcela = (valorFinanciado * taxaJurosMensal) / 
              (1 - Math.pow(1 + taxaJurosMensal, -prazoMeses));
    parcelaFinal = parcela; // No PRICE, todas as parcelas são iguais
    
    // Cálculo do valor total pago
    totalPago = parcela * prazoMeses;
    
    // Cálculo do total de juros
    totalJuros = totalPago - valorFinanciado;
  } else if (sistema === 'SAC') {
    // No sistema SAC, a amortização é constante
    const amortizacaoMensal = valorFinanciado / prazoMeses;
    
    // A primeira parcela é a maior
    const jurosPrimeiraParcela = valorFinanciado * taxaJurosMensal;
    parcela = amortizacaoMensal + jurosPrimeiraParcela;
    
    // A última parcela é a menor
    const jurosUltimaParcela = amortizacaoMensal * taxaJurosMensal;
    parcelaFinal = amortizacaoMensal + jurosUltimaParcela;
    
    // Cálculo do total de juros (progressão aritmética)
    // Soma dos juros = (juros da primeira parcela + juros da última parcela) * número de parcelas / 2
    totalJuros = (jurosPrimeiraParcela + jurosUltimaParcela) * prazoMeses / 2;
    
    // Valor total pago
    totalPago = valorFinanciado + totalJuros;
  }

  // Capacidade de pagamento com base na renda (30% da renda)
  const capacidadePagamento = rendaMensalNum ? rendaMensalNum * PERCENTUAL_RENDA_MAXIMO : undefined;
  
  return {
    parcela,
    parcelaFinal,
    totalPago,
    totalJuros,
    taxaJurosAnual,
    prazoMeses,
    sistema,
    indexador,
    capacidadePagamento,
    valorFinanciado
  };
};
