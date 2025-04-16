import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Stepper } from '@/components/ui/stepper';
import { Apartamento } from '@/types/apartamento';
import LeadForm from '@/components/LeadForm';
import ApartamentoCard from '@/components/ApartamentoCard';
import { useFinanciamento } from '../core/FinanciamentoContext';

interface LeadFormStageProps {
  apartamento: Apartamento;
  onVoltar: () => void;
  onSubmitSuccess: () => void;
  stepperSteps: string[];
  currentStep: number;
}

const LeadFormStage = ({
  apartamento,
  onVoltar,
  onSubmitSuccess,
  stepperSteps,
  currentStep
}: LeadFormStageProps) => {
  const { 
    resultado,
    rendaMensal,
    entrada,
    amortizationSystem
  } = useFinanciamento();

  if (!resultado) return null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="pt-4 pb-6 md:pt-6 md:pb-10">
        <Stepper steps={stepperSteps} currentStep={currentStep} />
      </div>
      
      <ApartamentoCard 
        apartamento={apartamento}
        showSimulateButton={false}
        className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden w-full"
      />
      
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="space-y-1.5 md:space-y-2">
            <div className="text-xl md:text-2xl font-semibold text-hype-black">
              Sua parcela estimada
            </div>
            <div className="text-base md:text-lg text-hype-green font-medium">
              Desbloqueie sua análise
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-bold text-hype-black mt-3 md:mt-4 blur-[8px] select-none opacity-60">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado.primeiraParcela)}
            <span className="text-sm md:text-base font-normal text-gray-500 ml-1">/mês</span>
          </div>
        </div>
        
        <LeadForm 
          apartamento={apartamento}
          onSubmitSuccess={onSubmitSuccess}
          showConsentCheckbox={true}
          ctaButtonText="Ver simulação completa"
          rendaMensal={rendaMensal}
          valorEntrada={entrada}
          sistemaAmortizacao={amortizationSystem}
          valorParcela={resultado.primeiraParcela}
          prazoMeses={resultado.prazoMeses}
          taxaJuros={resultado.taxaJurosAnual}
        />

        <div className="mt-4 md:mt-6">
          <Button 
            onClick={onVoltar}
            variant="outline"
            className="w-full flex items-center gap-2 py-4 md:py-6 text-sm md:text-base"
          >
            <ArrowLeft className="h-4 md:h-4 w-4 md:w-4" />
            Voltar
          </Button>
        </div>
      </div>
      
      <div className="h-6 md:h-8" /> {/* Espaço até o footer */}
    </div>
  );
};

export default LeadFormStage; 