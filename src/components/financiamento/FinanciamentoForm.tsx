import React from 'react';
import { Loader2 } from 'lucide-react';
import { Apartamento } from '@/types/apartamento';
import { useFinanciamento } from './core/FinanciamentoContext';
import { FormStage } from './core/FinanciamentoContext';

// Import the components
import ApartamentoSelectionStage from './stages/ApartamentoSelectionStage';
import FinancialDataForm from './stages/FinancialDataForm';
import LeadFormStage from './stages/LeadFormStage';
import ResultStage from './stages/ResultStage';

interface FinanciamentoFormProps {
  apartamentos: Apartamento[];
  isLoading: boolean;
}

const FinanciamentoForm = ({ apartamentos, isLoading }: FinanciamentoFormProps) => {
  const { 
    formStage,
    selectedApartamentoId,
    resultado,
    entrada,
    rendaMensal,
    dispatch
  } = useFinanciamento();

  const selectedApartamento = selectedApartamentoId 
    ? apartamentos.find(ap => ap.id === selectedApartamentoId) 
    : null;

  const handleSelectApartamento = (id: string) => {
    const apartamento = apartamentos.find(ap => ap.id === id);
    if (apartamento) {
      dispatch({ 
        type: 'SELECT_APARTAMENTO', 
        payload: { 
          id, 
          variacao: apartamento.variacoes[0] 
        } 
      });
    }
  };

  const handleVoltar = () => {
    switch (formStage) {
      case FormStage.FINANCIAL_DATA:
        dispatch({ type: 'SET_STAGE', payload: FormStage.SELECT_PROPERTY });
        break;
      case FormStage.LEAD_FORM:
        dispatch({ type: 'SET_STAGE', payload: FormStage.FINANCIAL_DATA });
        break;
      case FormStage.RESULT:
        dispatch({ type: 'SET_STAGE', payload: FormStage.FINANCIAL_DATA });
        dispatch({ type: 'SET_RESULTADO', payload: null });
        break;
      default:
        break;
    }
  };

  const handleLeadSubmitSuccess = () => {
    dispatch({ type: 'SET_STAGE', payload: FormStage.RESULT });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  const stepperSteps = ['Imóvel', 'Dados financeiros', 'Seus dados', 'Resultado'];
  const getCurrentStep = () => formStage + 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00C896]" />
        <span className="ml-2 text-gray-900">Carregando imóveis...</span>
      </div>
    );
  }

  switch (formStage) {
    case FormStage.SELECT_PROPERTY:
      return (
        <ApartamentoSelectionStage 
          apartamentos={apartamentos}
          onSelectApartamento={handleSelectApartamento}
          stepperSteps={stepperSteps}
          currentStep={getCurrentStep()}
        />
      );

    case FormStage.FINANCIAL_DATA:
      if (!selectedApartamento) return null;
      return (
        <FinancialDataForm 
          apartamento={selectedApartamento}
          onVoltar={handleVoltar}
          stepperSteps={stepperSteps}
          currentStep={getCurrentStep()}
        />
      );

    case FormStage.LEAD_FORM:
      if (!selectedApartamento || !resultado) return null;
      return (
        <LeadFormStage
          apartamento={selectedApartamento}
          resultado={resultado}
          onVoltar={handleVoltar}
          onSubmitSuccess={handleLeadSubmitSuccess}
          stepperSteps={stepperSteps}
          currentStep={getCurrentStep()}
        />
      );

    case FormStage.RESULT:
      if (!selectedApartamento || !resultado) return null;
      return (
        <ResultStage 
          apartamento={selectedApartamento}
          resultado={resultado}
          entrada={entrada}
          rendaMensal={rendaMensal}
          onReset={handleReset}
          stepperSteps={stepperSteps}
          currentStep={getCurrentStep()}
        />
      );

    default:
      return null;
  }
};

export default FinanciamentoForm; 