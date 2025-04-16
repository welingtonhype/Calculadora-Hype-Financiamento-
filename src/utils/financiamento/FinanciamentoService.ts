import { ParametrosFinanciamento, ResultadoFinanciamento, Indexador } from './types';
import { AmortizacaoFactory } from './AmortizacaoFactory';
import { 
  PRAZO_PADRAO, 
  PERCENTUAL_ENTRADA_MINIMO, 
  PERCENTUAL_RENDA_MAXIMO,
  RENDA_MINIMA,
  TAXAS_JUROS 
} from './constants';

export class FinanciamentoService {
  static validarParametros(params: ParametrosFinanciamento): string | null {
    const { valorImovel, valorEntrada, rendaMensal } = params;

    if (!valorImovel || !valorEntrada || !rendaMensal) {
      return "Todos os valores são obrigatórios";
    }

    if (valorImovel <= 0 || valorEntrada <= 0 || rendaMensal <= 0) {
      return "Os valores não podem ser negativos ou zero";
    }

    const entradaMinima = valorImovel * PERCENTUAL_ENTRADA_MINIMO;
    if (valorEntrada < entradaMinima) {
      return `A entrada mínima deve ser de ${PERCENTUAL_ENTRADA_MINIMO * 100}% do valor do imóvel`;
    }

    if (valorEntrada >= valorImovel) {
      return "A entrada não pode ser maior ou igual ao valor do imóvel";
    }

    if (rendaMensal < RENDA_MINIMA) {
      return "A renda mensal mínima é de R$ 1.000,00";
    }

    return null;
  }

  static calcular(params: ParametrosFinanciamento): ResultadoFinanciamento {
    const {
      valorImovel,
      valorEntrada,
      rendaMensal,
      sistema,
      prazoMeses = PRAZO_PADRAO,
      indexador = 'TR' as Indexador
    } = params;

    // Cálculos básicos
    const valorFinanciado = valorImovel - valorEntrada;
    const percentualEntrada = (valorEntrada / valorImovel) * 100;
    const taxaJurosAnual = TAXAS_JUROS[indexador][sistema];
    const taxaJurosMensal = taxaJurosAnual / 12 / 100;
    const capacidadePagamento = rendaMensal * PERCENTUAL_RENDA_MAXIMO;

    // Obtém a estratégia de amortização apropriada
    const strategy = AmortizacaoFactory.getStrategy(sistema);
    const resultado = strategy.calcular(valorFinanciado, taxaJurosMensal, prazoMeses);

    // Verifica se a parcela está dentro da capacidade de pagamento
    const dentroCapacidade = resultado.primeiraParcela <= capacidadePagamento;

    return {
      valorImovel,
      valorEntrada,
      valorFinanciado,
      percentualEntrada,
      primeiraParcela: resultado.primeiraParcela,
      ultimaParcela: resultado.ultimaParcela,
      prazoMeses,
      taxaJurosAnual,
      taxaJurosMensal,
      totalJuros: resultado.totalJuros,
      totalPago: resultado.totalPago,
      sistema,
      indexador,
      capacidadePagamento,
      dentroCapacidade
    };
  }
} 