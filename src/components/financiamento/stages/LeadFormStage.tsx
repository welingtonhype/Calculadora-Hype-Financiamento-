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
    amortizationSystem,
    formPreenchido,
    selectedVariacao
  } = useFinanciamento();

  const variacaoAtual = selectedVariacao || apartamento.variacoes[0];

  // Se já preencheu o formulário antes, pula direto para o resultado
  React.useEffect(() => {
    if (formPreenchido && resultado) {
      onSubmitSuccess();
    }
  }, [formPreenchido, resultado, onSubmitSuccess]);

  if (!resultado || !formPreenchido) return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-6 md:space-y-8 px-4 md:px-0">
      <div className="pt-4 pb-6 md:pt-6 md:pb-10">
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
      
      <LeadForm 
        apartamento={apartamento}
        onSubmitSuccess={onSubmitSuccess}
        showConsentCheckbox={true}
        ctaButtonText="Ver simulação completa"
        rendaMensal={rendaMensal}
        valorEntrada={entrada}
        sistemaAmortizacao={amortizationSystem}
        valorParcela={resultado?.primeiraParcela}
        prazoMeses={resultado?.prazoMeses}
        taxaJuros={resultado?.taxaJurosAnual}
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
  );

  return null;
};

export default LeadFormStage; 