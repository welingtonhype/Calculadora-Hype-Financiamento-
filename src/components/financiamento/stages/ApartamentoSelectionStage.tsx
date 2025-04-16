import React from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Apartamento } from '@/types/apartamento';
import ApartamentoCard from '@/components/ApartamentoCard';
import { Building2 } from 'lucide-react';

interface ApartamentoSelectionStageProps {
  apartamentos: Apartamento[];
  onSelectApartamento: (id: string) => void;
  stepperSteps: string[];
  currentStep: number;
}

const ApartamentoSelectionStage = ({
  apartamentos,
  onSelectApartamento,
  stepperSteps,
  currentStep
}: ApartamentoSelectionStageProps) => {
  return (
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-8 md:mb-10">
        <Stepper steps={stepperSteps} currentStep={currentStep} />
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-6 px-4 md:px-0 mt-16">
        <div className="text-left space-y-1.5 md:space-y-2">
          <div className="text-xl md:text-2xl font-semibold text-hype-black flex items-center gap-2">
            <Building2 className="w-5 h-5 text-hype-green" aria-hidden="true" />
            Selecione um apartamento
          </div>
          <div className="text-sm text-gray-500">
            Escolha um dos apartamentos disponíveis para simular o financiamento
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {apartamentos.map((apartamento) => (
            <div key={apartamento.id} className="w-full">
              <ApartamentoCard
                apartamento={apartamento}
                onSelect={() => onSelectApartamento(apartamento.id)}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApartamentoSelectionStage; 