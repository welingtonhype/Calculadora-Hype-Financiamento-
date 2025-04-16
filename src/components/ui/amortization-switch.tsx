import React from 'react';
import { Label } from '@/components/ui/label';
import { AmortizationSystem } from '@/utils/calculators';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AmortizationSwitchProps {
  value: AmortizationSystem;
  onChange: (system: AmortizationSystem) => void;
  onValueChange?: (system: AmortizationSystem) => void;
}

const AmortizationSwitch = ({ 
  value, 
  onChange,
  onValueChange
}: AmortizationSwitchProps) => {
  const isPriceSystem = value === 'PRICE';
  
  const handleChange = (system: AmortizationSystem) => {
    if (onChange) onChange(system);
    if (onValueChange) onValueChange(system);
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div className="flex items-start md:items-center justify-between">
          <Label className="text-base md:text-lg text-hype-black font-semibold">Sistema de Amortização</Label>
          <div className="text-[10px] md:text-xs text-hype-gray-dark flex items-center bg-gray-50 px-2 md:px-3 py-1 rounded-full">
            <span className="text-amber-500 mr-1">💡</span>
            <p>Você pode mudar depois!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <div 
            className={cn(
              "relative p-2.5 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:border-hype-green",
              !isPriceSystem 
                ? 'border-hype-green bg-green-50/50' 
                : 'border-gray-100 bg-white'
            )}
            onClick={() => handleChange('SAC')}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full text-left">
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-sm md:text-base font-semibold text-hype-black leading-tight">
                      Parcelas decrescentes
                    </div>
                    <div className="text-[11px] md:text-sm text-gray-600 leading-snug">
                      Começam maiores e diminuem ao longo do tempo
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-hype-green mt-1 md:mt-2">
                      Sistema SAC
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-xs">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sistema de Amortização Constante (SAC)</p>
                    <p className="text-sm text-gray-600">
                      • Taxa de juros: 11.49% a.a. (TR)
                      <br/>• Amortização é fixa durante todo o período
                      <br/>• Juros diminuem a cada mês
                      <br/>• Parcelas reduzem ao longo do tempo
                      <br/>• Paga menos juros no total
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div 
            className={cn(
              "relative p-2.5 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:border-hype-green",
              isPriceSystem 
                ? 'border-hype-green bg-green-50/50' 
                : 'border-gray-100 bg-white'
            )}
            onClick={() => handleChange('PRICE')}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full text-left">
                  <div className="space-y-1 md:space-y-2">
                    <div className="text-sm md:text-base font-semibold text-hype-black leading-tight">
                      Parcelas fixas
                    </div>
                    <div className="text-[11px] md:text-sm text-gray-600 leading-snug">
                      Mesmo valor durante todo o prazo
                    </div>
                    <div className="text-[10px] md:text-xs font-medium text-hype-green mt-1 md:mt-2">
                      Sistema PRICE
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-xs">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sistema PRICE (Parcelas Fixas)</p>
                    <p className="text-sm text-gray-600">
                      • Taxa de juros: 10.99% a.a. (TR)
                      <br/>• Parcelas iguais do início ao fim
                      <br/>• Mais juros no início, menos no final
                      <br/>• Mais previsibilidade no orçamento
                      <br/>• Parcela inicial menor que o SAC
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmortizationSwitch;
