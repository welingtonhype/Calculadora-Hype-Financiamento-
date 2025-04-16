import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FinanciamentoService } from '@/utils/financiamento';
import { useFinanciamento } from '../core/FinanciamentoContext';
import { FormStage } from '../core/FinanciamentoContext';
import { ApartamentoVariacao } from '@/types/apartamento';
import { formatCurrency } from '@/utils/formatters';
import { PERCENTUAL_ENTRADA_MINIMO, RENDA_MINIMA } from '@/utils/financiamento/constants';

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
      // Converte os valores de string (em centavos) para número em reais
      const entradaValue = Number(entrada) / 100;
      const rendaMensalValue = Number(rendaMensal) / 100;
      const valorImovel = variacao.valor;

      // Validações básicas
      if (!rendaMensalValue || rendaMensalValue <= 0) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: "Por favor, informe sua renda mensal." 
        });
        return false;
      }

      if (!entradaValue || entradaValue <= 0) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: "Por favor, informe o valor da entrada." 
        });
        return false;
      }

      // Validação do percentual mínimo de entrada
      const percentualEntrada = (entradaValue / valorImovel) * 100;
      if (percentualEntrada < PERCENTUAL_ENTRADA_MINIMO * 100) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: `A entrada mínima deve ser de ${PERCENTUAL_ENTRADA_MINIMO * 100}% do valor do imóvel (${formatCurrency(valorImovel * PERCENTUAL_ENTRADA_MINIMO)}).` 
        });
        return false;
      }

      // Validação do valor máximo financiável
      if (entradaValue >= valorImovel) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: "O valor da entrada não pode ser maior ou igual ao valor do imóvel." 
        });
        return false;
      }

      // Validação da renda mínima
      if (rendaMensalValue < RENDA_MINIMA) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: `A renda mensal mínima é de ${formatCurrency(RENDA_MINIMA)}.` 
        });
        return false;
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
      console.error('Erro no cálculo:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: "Ocorreu um erro ao calcular o financiamento. Por favor, verifique os valores e tente novamente." 
      });
      return false;
    }
  }, [amortizationSystem, entrada, rendaMensal, dispatch]);

  return {
    handleNumberInput,
    calcularFinanciamento
  };
} 