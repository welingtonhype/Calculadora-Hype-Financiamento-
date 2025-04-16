import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="relative flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm font-medium",
                  index + 1 === currentStep
                    ? "bg-[#00C896] text-white font-bold" // Active
                    : index + 1 < currentStep
                    ? "bg-[#00C896]/20 text-[#00C896]" // Completed
                    : "bg-[#E4E7EC] text-gray-500" // Inactive
                )}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-3.5 w-3.5 md:h-4 md:w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "absolute top-10 md:top-12 text-[10px] md:text-xs text-center max-w-[70px] md:max-w-[80px] lg:max-w-none",
                  "whitespace-normal lg:whitespace-nowrap mt-1",
                  index + 1 === currentStep
                    ? "text-[#00C896] font-semibold" // Active
                    : index + 1 < currentStep
                    ? "text-[#00C896]/80" // Completed
                    : "text-gray-400 font-normal" // Inactive
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-0.5 md:h-1 flex-1 mx-1.5 md:mx-2 lg:mx-4",
                  index + 1 < currentStep ? "bg-[#00C896]/60" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Stepper };
