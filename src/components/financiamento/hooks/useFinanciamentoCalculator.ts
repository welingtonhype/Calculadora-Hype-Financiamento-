import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FinanciamentoService } from '@/utils/financiamento';
import { useFinanciamento } from '../core/FinanciamentoContext';
import { FormStage } from '../core/FinanciamentoContext';
import { Apartamento } from '@/types/apartamento';

export function useFinanciamentoCalculator() {
  const { dispatch, rendaMensal, entrada, amortizationSystem } = useFinanciamento();
  const { toast } = useToast();

  const handleNumberInput = useCallback((
    value: string,
    setter: 'SET_RENDA_MENSAL' | 'SET_ENTRADA'
  ) => {
    // Remove caracteres não numéricos
    const rawValue = value.replace(/\D/g, '');
    
    // Limita o valor a 15 dígitos para evitar overflow
    const truncatedValue = rawValue.slice(0, 15);
    
    // Armazena o valor numérico (em centavos)
    dispatch({ type: setter, payload: truncatedValue });
    
    console.log('Valor do input:', {
      raw: rawValue,
      truncated: truncatedValue,
      asNumber: Number(truncatedValue) / 100
    });
  }, [dispatch]);

  const calcularFinanciamento = useCallback((apartamento: Apartamento) => {
    // Converte os valores de string (em centavos) para número em reais
    const entradaValue = Number(entrada) / 100;
    const rendaMensalValue = Number(rendaMensal) / 100;

    // Valida os parâmetros
    const validationError = FinanciamentoService.validarParametros({
      valorImovel: apartamento.valor,
      valorEntrada: entradaValue,
      rendaMensal: rendaMensalValue,
      sistema: amortizationSystem
    });

    if (validationError) {
      dispatch({ type: 'SET_ERROR', payload: validationError });
      return false;
    }

    // Calcula o financiamento
    try {
      const result = FinanciamentoService.calcular({
        valorImovel: apartamento.valor,
        valorEntrada: entradaValue,
        rendaMensal: rendaMensalValue,
        sistema: amortizationSystem
      });

      console.log('Resultado do cálculo:', result);
      dispatch({ type: 'SET_RESULTADO', payload: result });
      dispatch({ type: 'SET_STAGE', payload: FormStage.LEAD_FORM });
      dispatch({ type: 'SET_ERROR', payload: null });

      return true;
    } catch (error) {
      console.error('Erro no cálculo:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: "Erro ao calcular o financiamento. Por favor, verifique os valores." 
      });
      return false;
    }
  }, [amortizationSystem, entrada, rendaMensal, dispatch]);

  return {
    handleNumberInput,
    calcularFinanciamento
  };
} 