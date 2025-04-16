
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Apartamento } from '@/types/apartamento';
import { formatCurrency } from '@/utils/formatters';

interface ApartamentoSelectProps {
  apartamentos: Apartamento[];
  selectedApartamentoId: number | null;
  onSelect: (id: number) => void;
  isLoading: boolean;
}

const ApartamentoSelect = ({ 
  apartamentos, 
  selectedApartamentoId, 
  onSelect,
  isLoading
}: ApartamentoSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor="apartamento-select" className="block text-sm font-medium text-[#1E1E1E]">
        Selecione um imóvel
      </label>
      <Select
        disabled={isLoading || apartamentos.length === 0}
        value={selectedApartamentoId?.toString() || ""}
        onValueChange={(value) => onSelect(parseInt(value))}
      >
        <SelectTrigger id="apartamento-select" className="w-full border-gray-200 focus:ring-[#00BF98]">
          <SelectValue placeholder={isLoading ? "Carregando imóveis..." : "Selecione um imóvel"} />
        </SelectTrigger>
        <SelectContent>
          {apartamentos.map((apartamento) => (
            <SelectItem 
              key={apartamento.id} 
              value={apartamento.id.toString()}
              className="py-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">{apartamento.nome}</span>
                <span className="text-sm text-[#555555]">
                  {apartamento.bairro && `${apartamento.bairro} • `}
                  {apartamento.metragem}m² • {apartamento.quartos} {apartamento.quartos === 1 ? 'quarto' : 'quartos'} • {formatCurrency(apartamento.valor)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ApartamentoSelect;
