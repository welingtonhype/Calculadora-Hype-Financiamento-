import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, PiggyBank, Calculator, Building2 } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import AmortizationSwitch from '@/components/ui/amortization-switch';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';
import { Apartamento, ApartamentoVariacao } from '@/types/apartamento';
import { useFinanciamento } from '../core/FinanciamentoContext';
import { useFinanciamentoCalculator } from '../hooks/useFinanciamentoCalculator';
import ApartamentoCard from '@/components/ApartamentoCard';
import { FormStage } from '../core/FinanciamentoContext';

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
    selectedVariacao,
    error,
    dispatch 
  } = useFinanciamento();

  const { handleNumberInput, calcularFinanciamento } = useFinanciamentoCalculator();

  const handleSelectVariacao = (variacao: ApartamentoVariacao) => {
    dispatch({ type: 'SELECT_VARIACAO', payload: variacao });
  };

  const handleVoltar = () => {
    dispatch({ type: 'SET_STAGE', payload: FormStage.SELECT_PROPERTY });
    if (onVoltar) {
      onVoltar();
    }
  };

  const handleCalcular = () => {
    if (selectedVariacao) {
      calcularFinanciamento(selectedVariacao);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-16 md:mb-16">
        <Stepper steps={stepperSteps} currentStep={currentStep} />
      </div>

      <div className="w-full mb-3 md:mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-hype-green" />
              <h2 className="text-lg font-semibold text-hype-black">Imóvel selecionado</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoltar}
              className="text-xs border-gray-200 hover:bg-gray-50"
            >
              Trocar imóvel
            </Button>
          </div>

          <ApartamentoCard 
            apartamento={apartamento}
            showSimulateButton={false}
            selectedVariacao={selectedVariacao}
            onSelect={handleSelectVariacao}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden w-full"
          />
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-xl shadow-sm md:shadow-md">
        <div className="space-y-6 md:space-y-8">
          <div className="relative">
            <label htmlFor="rendaMensal" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <Wallet className="w-4 h-4 text-hype-green" />
              Renda mensal
            </label>
            <Input
              id="rendaMensal"
              type="text"
              placeholder="R$ 0,00"
              value={formatCurrency(Number(rendaMensal) / 100)}
              onChange={(e) => handleNumberInput(e.target.value, 'SET_RENDA_MENSAL')}
              className="w-full text-base py-3 px-3 border-gray-200 focus:border-hype-green focus:ring-hype-green transition-colors rounded-lg placeholder:text-gray-400"
            />
          </div>

          <div className="relative">
            <label htmlFor="entrada" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
              <PiggyBank className="w-4 h-4 text-hype-green" />
              Valor de entrada
            </label>
            <Input
              id="entrada"
              type="text"
              placeholder="R$ 0,00"
              value={formatCurrency(Number(entrada) / 100)}
              onChange={(e) => handleNumberInput(e.target.value, 'SET_ENTRADA')}
              className="w-full text-base py-3 px-3 border-gray-200 focus:border-hype-green focus:ring-hype-green transition-colors rounded-lg placeholder:text-gray-400"
            />
          </div>

          <div className="relative pb-1 md:pb-2">
            <label className="flex items-center gap-2 md:gap-2.5 text-sm md:text-base font-medium text-gray-800 mb-2 md:mb-3">
              <Calculator className="w-4 md:w-5 h-4 md:h-5 text-hype-green" />
              Sistema de amortização
            </label>
            <AmortizationSwitch
              value={amortizationSystem}
              onChange={(value) => dispatch({ type: 'SET_AMORTIZATION_SYSTEM', payload: value })}
              onValueChange={(value) => dispatch({ type: 'SET_AMORTIZATION_SYSTEM', payload: value })}
            />
          </div>
        </div>

        {error && (
          <div className="text-xs md:text-sm text-red-500 mt-6 md:mt-8 bg-red-50 p-3 md:p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-10">
          <Button 
            onClick={handleCalcular}
            className="w-full bg-hype-green hover:bg-hype-green/90 text-white py-4 md:py-5 text-sm md:text-base font-medium transition-colors duration-200 rounded-lg"
          >
            Calcular financiamento
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDataForm; 