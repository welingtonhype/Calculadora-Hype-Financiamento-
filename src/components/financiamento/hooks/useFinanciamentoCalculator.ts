import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FinanciamentoService } from '@/utils/financiamento';
import { useFinanciamento } from '../core/FinanciamentoContext';
import { FormStage } from '../core/FinanciamentoContext';
import { ApartamentoVariacao } from '@/types/apartamento';
import { formatCurrency } from '@/utils/formatters';
import { logger } from '@/utils/logger';

export function useFinanciamentoCalculator() {
  const { dispatch, rendaMensal, entrada, amortizationSystem } = useFinanciamento();
  const { toast } = useToast();

  const handleNumberInput = useCallback((value: string, type: 'SET_RENDA_MENSAL' | 'SET_ENTRADA') => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    dispatch({ type, payload: numbers });
  }, [dispatch]);

  const calcularFinanciamento = useCallback((variacao: ApartamentoVariacao) => {
    try {
      // Validações de segurança
      if (!variacao || !variacao.valor || variacao.valor <= 0) {
        throw new Error('Valor do imóvel inválido');
      }

      const valorImovel = variacao.valor;
      const entradaValue = Number(entrada) / 100;
      const rendaMensalValue = Number(rendaMensal) / 100;

      // Validações de valores
      if (isNaN(entradaValue) || entradaValue <= 0) {
        throw new Error('Valor de entrada inválido');
      }

      if (isNaN(rendaMensalValue) || rendaMensalValue <= 0) {
        throw new Error('Renda mensal inválida');
      }

      // Validação de percentual mínimo de entrada (20%)
      const percentualEntrada = (entradaValue / valorImovel) * 100;
      if (percentualEntrada < 20) {
        throw new Error(`A entrada mínima deve ser de 20% do valor do imóvel (${formatCurrency(valorImovel * 0.2)})`);
      }

      // Validação de valor máximo de entrada
      if (entradaValue >= valorImovel) {
        throw new Error('O valor da entrada não pode ser maior ou igual ao valor do imóvel');
      }

      // Validação de renda mínima (30% da parcela)
      const valorFinanciado = valorImovel - entradaValue;
      const parcelaEstimada = valorFinanciado * 0.01; // Estimativa conservadora
      if (parcelaEstimada > rendaMensalValue * 0.3) {
        throw new Error('Sua renda mensal não atende aos requisitos mínimos para este financiamento');
      }

      // Valida os parâmetros usando o serviço
      const validationError = FinanciamentoService.validarParametros({
        valorImovel,
        valorEntrada: entradaValue,
        rendaMensal: rendaMensalValue,
        sistema: amortizationSystem
      });

      if (validationError) {
        dispatch({ type: 'SET_ERROR', payload: validationError });
        return false;
      }

      // Calcula o financiamento
      const result = FinanciamentoService.calcular({
        valorImovel,
        valorEntrada: entradaValue,
        rendaMensal: rendaMensalValue,
        sistema: amortizationSystem
      });

      // Limpa erro anterior se houver
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Atualiza o resultado e avança para o próximo estágio
      dispatch({ type: 'SET_RESULTADO', payload: result });
      dispatch({ type: 'SET_STAGE', payload: FormStage.LEAD_FORM });

      return true;
    } catch (error) {
      logger.error('Erro no cálculo do financiamento', error as Error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Não foi possível calcular o financiamento. Por favor, verifique os dados e tente novamente.' 
      });
      return false;
    }
  }, [amortizationSystem, entrada, rendaMensal, dispatch]);

  return {
    handleNumberInput,
    calcularFinanciamento
  };
} 