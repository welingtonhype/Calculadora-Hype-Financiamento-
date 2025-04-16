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
    <div className="w-full max-w-[1200px] mx-auto animate-fade-in mb-32">
      <div className="pb-4 mb-20">
        <Stepper steps={stepperSteps} currentStep={currentStep} />
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 md:w-6 h-5 md:h-6 text-hype-green flex-shrink-0" />
            <h2 className="text-2xl md:text-[32px] font-semibold tracking-tight text-gray-900">
              Selecione um imóvel
            </h2>
          </div>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl font-normal">
            Escolha um dos imóveis disponíveis para simular seu financiamento e realizar seu sonho da casa própria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apartamentos.map((apartamento) => (
            <div key={apartamento.id} className="w-full">
              <ApartamentoCard
                apartamento={apartamento}
                onSelect={() => onSelectApartamento(apartamento.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApartamentoSelectionStage; 