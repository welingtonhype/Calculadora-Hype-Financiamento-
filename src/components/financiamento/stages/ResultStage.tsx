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
  const { resultado, entrada, rendaMensal } = useFinanciamento();

  if (!resultado) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-10">
      <div className="pt-4 pb-8 md:pt-6 md:pb-10 flex justify-center">
        <Stepper steps={stepperSteps} currentStep={currentStep} className="w-full" />
      </div>
      
      <div className="my-8 md:my-10">
        <ApartamentoCard 
          apartamento={apartamento}
          showSimulateButton={false}
          className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
        />
      </div>
      
      <div className="my-8 md:my-10">
        <FinanciamentoResultado 
          resultado={resultado}
          valorImovel={apartamento.valor}
          entrada={Number(entrada) / 100}
          rendaMensal={Number(rendaMensal) / 100}
        />
      </div>
      
      <div className="w-full mx-auto pb-8 pt-4">
        <Button 
          onClick={onReset}
          variant="outline"
          className="w-full flex items-center gap-2 py-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista de imóveis
        </Button>
      </div>
    </div>
  );
};

export default ResultStage; 