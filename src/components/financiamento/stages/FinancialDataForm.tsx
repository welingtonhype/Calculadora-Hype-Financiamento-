import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import AmortizationSwitch from '@/components/ui/amortization-switch';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { Apartamento } from '@/types/apartamento';
import { useFinanciamento } from '../core/FinanciamentoContext';
import { useFinanciamentoCalculator } from '../hooks/useFinanciamentoCalculator';
import ApartamentoCard from '@/components/ApartamentoCard';

interface FinancialDataFormProps {
  apartamento: Apartamento;
  onVoltar: () => void;
  stepperSteps: string[];
  currentStep: number;
}

const FinancialDataForm = ({
  apartamento,
  onVoltar,
  stepperSteps,
  currentStep
}: FinancialDataFormProps) => {
  const { 
    rendaMensal, 
    entrada, 
    amortizationSystem,
    error,
    dispatch 
  } = useFinanciamento();

  const { handleNumberInput, calcularFinanciamento } = useFinanciamentoCalculator();

  const handleCalcular = () => {
    calcularFinanciamento(apartamento);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-10">
      <div className="pt-4 pb-8 md:pt-6 md:pb-10">
        <Stepper steps={stepperSteps} currentStep={currentStep} />
      </div>

      <div className="w-full">
        <ApartamentoCard 
          apartamento={apartamento}
          showSimulateButton={false}
          className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden w-full"
        />
      </div>

      <div className="bg-white p-8 md:p-10 rounded-xl shadow-md space-y-8">
        <div>
          <label htmlFor="rendaMensal" className="block text-sm font-medium text-gray-700 mb-2">
            Renda mensal
          </label>
          <Input
            id="rendaMensal"
            type="text"
            placeholder="R$ 0,00"
            value={formatCurrency(Number(rendaMensal) / 100)}
            onChange={(e) => handleNumberInput(e.target.value, 'SET_RENDA_MENSAL')}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="entrada" className="block text-sm font-medium text-gray-700 mb-2">
            Valor de entrada
          </label>
          <Input
            id="entrada"
            type="text"
            placeholder="R$ 0,00"
            value={formatCurrency(Number(entrada) / 100)}
            onChange={(e) => handleNumberInput(e.target.value, 'SET_ENTRADA')}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sistema de amortização
          </label>
          <AmortizationSwitch
            value={amortizationSystem}
            onChange={(value) => dispatch({ type: 'SET_AMORTIZATION_SYSTEM', payload: value })}
            onValueChange={(value) => dispatch({ type: 'SET_AMORTIZATION_SYSTEM', payload: value })}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 pt-4">
          <Button 
            onClick={handleCalcular}
            className="w-full bg-hype-green hover:bg-hype-green/90 text-white py-6"
          >
            Calcular
          </Button>

          <Button 
            onClick={onVoltar}
            variant="outline"
            className="w-full flex items-center gap-2 py-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDataForm; 