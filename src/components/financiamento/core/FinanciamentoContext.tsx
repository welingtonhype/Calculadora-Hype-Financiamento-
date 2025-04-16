import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Apartamento } from '@/types/apartamento';
import { SistemaAmortizacao, ResultadoFinanciamento } from '@/utils/financiamento';
import { CheckCircle, XCircle, Info } from 'lucide-react';

// Estados do formulário
export enum FormStage {
  SELECT_PROPERTY,
  FINANCIAL_DATA,
  LEAD_FORM,
  RESULT
}

// Interface do estado
interface FinanciamentoState {
  selectedApartamentoId: string | null;
  rendaMensal: string;
  entrada: string;
  formStage: FormStage;
  amortizationSystem: SistemaAmortizacao;
  resultado: ResultadoFinanciamento | null;
  error: string | null;
  formPreenchido: boolean;
}

// Tipos de ações
type FinanciamentoAction =
  | { type: 'SELECT_APARTAMENTO'; payload: string }
  | { type: 'SET_RENDA_MENSAL'; payload: string }
  | { type: 'SET_ENTRADA'; payload: string }
  | { type: 'SET_STAGE'; payload: FormStage }
  | { type: 'SET_AMORTIZATION_SYSTEM'; payload: SistemaAmortizacao }
  | { type: 'SET_RESULTADO'; payload: ResultadoFinanciamento }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FORM_PREENCHIDO'; payload: boolean }
  | { type: 'RESET' };

// Estado inicial
const initialState: FinanciamentoState = {
  selectedApartamentoId: null,
  rendaMensal: '',
  entrada: '',
  formStage: FormStage.SELECT_PROPERTY,
  amortizationSystem: 'SAC',
  resultado: null,
  error: null,
  formPreenchido: false
};

// Reducer
function financiamentoReducer(state: FinanciamentoState, action: FinanciamentoAction): FinanciamentoState {
  switch (action.type) {
    case 'SELECT_APARTAMENTO':
      return {
        ...state,
        selectedApartamentoId: action.payload,
        formStage: FormStage.FINANCIAL_DATA
      };
    case 'SET_RENDA_MENSAL':
      return { ...state, rendaMensal: action.payload };
    case 'SET_ENTRADA':
      return { ...state, entrada: action.payload };
    case 'SET_STAGE':
      return { ...state, formStage: action.payload };
    case 'SET_AMORTIZATION_SYSTEM':
      return { ...state, amortizationSystem: action.payload };
    case 'SET_RESULTADO':
      return { ...state, resultado: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FORM_PREENCHIDO':
      return { ...state, formPreenchido: action.payload };
    case 'RESET':
      return { ...initialState, formPreenchido: state.formPreenchido };
    default:
      return state;
  }
}

// Contexto
interface FinanciamentoContextType extends FinanciamentoState {
  dispatch: React.Dispatch<FinanciamentoAction>;
}

const FinanciamentoContext = createContext<FinanciamentoContextType | undefined>(undefined);

// Provider
interface FinanciamentoProviderProps {
  children: ReactNode;
}

export function FinanciamentoProvider({ children }: FinanciamentoProviderProps) {
  const [state, dispatch] = useReducer(financiamentoReducer, {
    ...initialState,
    formPreenchido: localStorage.getItem('formPreenchido') === 'true'
  });

  // Salva no localStorage quando o estado muda
  React.useEffect(() => {
    localStorage.setItem('formPreenchido', state.formPreenchido.toString());
  }, [state.formPreenchido]);

  return (
    <FinanciamentoContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FinanciamentoContext.Provider>
  );
}

// Hook personalizado
export function useFinanciamento() {
  const context = useContext(FinanciamentoContext);
  if (context === undefined) {
    throw new Error('useFinanciamento deve ser usado dentro de um FinanciamentoProvider');
  }
  return context;
}

// Adicionar um componente de Toast mais elaborado
const Toast = {
  success: {
    icon: <CheckCircle className="text-green-500" />,
    bgColor: 'bg-green-50',
    textColor: 'text-green-800'
  },
  error: {
    icon: <XCircle className="text-red-500" />,
    bgColor: 'bg-red-50',
    textColor: 'text-red-800'
  },
  info: {
    icon: <Info className="text-blue-500" />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800'
  }
} 