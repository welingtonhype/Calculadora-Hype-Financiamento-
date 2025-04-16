import React from 'react';
import { Building2, MapPin, Bed, Move, ExternalLink } from 'lucide-react';
import { Apartamento } from '@/types/apartamento';
import { formatCurrency } from '@/utils/formatters';

interface ApartamentoCardProps {
  apartamento: Apartamento;
  onSelect?: () => void;
  selected?: boolean;
  showSimulateButton?: boolean;
  className?: string;
}

const ApartamentoCard = ({ 
  apartamento, 
  onSelect, 
  selected, 
  showSimulateButton = true,
  className = '' 
}: ApartamentoCardProps) => {
  return (
    <div 
      className={`
        bg-white rounded-lg 
        ${selected ? 'ring-2 ring-hype-green' : 'ring-1 ring-gray-100'} 
        shadow-sm
        transition-all duration-200
        hover:shadow
        flex flex-col
        cursor-pointer
        overflow-hidden
        ${className.includes('w-full') ? '' : 'w-[320px]'}
        ${className}
      `}
      onClick={onSelect}
    >
      {apartamento.imagem && (
        <div className="w-full h-44 overflow-hidden">
          <img 
            src={apartamento.imagem} 
            alt={apartamento.nome} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-5 w-5 text-hype-green flex-shrink-0" />
          <h3 className="text-lg font-semibold text-hype-black">
            {apartamento.nome}
          </h3>
        </div>

        {apartamento.bairro && (
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-hype-gray-dark flex-shrink-0" />
            <span className="text-sm text-hype-gray-dark">{apartamento.bairro}, Curitiba</span>
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4 text-hype-gray-dark flex-shrink-0" />
            <span className="text-sm text-hype-gray-dark">{apartamento.metragem} m²</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-hype-gray-dark flex-shrink-0" />
            <span className="text-sm text-hype-gray-dark">
              {apartamento.quartos} quarto
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm text-hype-gray-dark mb-1">Valor do imóvel</p>
          <p className="text-xl font-bold text-hype-black">
            {formatCurrency(apartamento.valor)}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <a 
            href={apartamento.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-hype-blue hover:text-hype-green transition-colors text-sm font-medium flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4" />
            Ver detalhes do imóvel
          </a>
          
          {onSelect && showSimulateButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="
                w-full px-4 py-3 
                rounded-lg 
                bg-hype-green text-white 
                hover:bg-hype-green-dark 
                font-medium 
                transition-colors
              "
            >
              Simular financiamento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartamentoCard;
