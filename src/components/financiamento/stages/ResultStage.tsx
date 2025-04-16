import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { Apartamento } from '@/types/apartamento';
import FinanciamentoResultado from '@/components/FinanciamentoResultado';
import ApartamentoCard from '@/components/ApartamentoCard';
import { useFinanciamento } from '../core/FinanciamentoContext';

interface ResultStageProps {
  apartamento: Apartamento;
  onReset: () => void;
  stepperSteps: string[];
  currentStep: number;
}

const ResultStage = ({
  apartamento,
  onReset,
  stepperSteps,
  currentStep
}: ResultStageProps) => {
  const { resultado, entrada, rendaMensal, selectedVariacao } = useFinanciamento();

  const variacaoAtual = selectedVariacao || apartamento.variacoes[0];

  if (!resultado) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-16 md:mb-20">
        <Stepper steps={stepperSteps} currentStep={currentStep} className="w-full" />
      </div>
      
      <div className="mb-8 md:mb-10">
        <ApartamentoCard 
          apartamento={apartamento}
          showSimulateButton={false}
          selectedVariacao={selectedVariacao}
          className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden w-full"
        />
      </div>
      
      <div className="mb-8 md:mb-10">
        <FinanciamentoResultado 
          resultado={resultado}
          valorImovel={variacaoAtual.valor}
          entrada={Number(entrada) / 100}
          rendaMensal={Number(rendaMensal) / 100}
        />
      </div>
      
      <div className="w-full">
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full flex items-center gap-2 py-6 text-base font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista de imóveis
        </Button>
      </div>
    </div>
  );
};

export default ResultStage; 