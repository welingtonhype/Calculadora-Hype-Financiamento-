import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Bed, Move, ExternalLink, ChevronDown } from 'lucide-react';
import { Apartamento, ApartamentoVariacao } from '@/types/apartamento';
import { formatCurrency } from '@/utils/formatters';

interface ApartamentoCardProps {
  apartamento: Apartamento;
  onSelect?: (variacao: ApartamentoVariacao) => void;
  selected?: boolean;
  selectedVariacao?: ApartamentoVariacao | null;
  showSimulateButton?: boolean;
  className?: string;
}

const ApartamentoCard = ({ 
  apartamento, 
  onSelect, 
  selected, 
  selectedVariacao,
  showSimulateButton = true,
  className = '' 
}: ApartamentoCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [localSelectedVariacao, setLocalSelectedVariacao] = useState<ApartamentoVariacao | null>(
    selectedVariacao || (apartamento.variacoes?.length > 0 ? apartamento.variacoes[0] : null)
  );

  // Atualiza a variação local quando a selecionada externamente muda
  useEffect(() => {
    if (selectedVariacao) {
      setLocalSelectedVariacao(selectedVariacao);
    }
  }, [selectedVariacao]);

  // Se não houver variações, usar os campos do apartamento diretamente
  const variacaoAtual = selectedVariacao || localSelectedVariacao || {
    id: apartamento.id,
    metragem: apartamento.metragem || 0,
    quartos: apartamento.quartos || 0,
    valor: apartamento.valor || 0,
    url: apartamento.url || ''
  };

  const handleSelectVariacao = (variacao: ApartamentoVariacao, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita propagação do evento
    setLocalSelectedVariacao(variacao);
    setIsDropdownOpen(false);
    if (onSelect) {
      onSelect(variacao);
    }
  };

  // Fecha o dropdown quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div 
      className={`
        bg-white rounded-xl
        ${selected ? 'ring-2 ring-hype-green' : 'ring-1 ring-gray-100'} 
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        flex flex-col
        cursor-pointer
        overflow-hidden
        ${className.includes('w-full') ? '' : 'w-[280px]'}
        ${className}
      `}
    >
      {apartamento.imagem && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={apartamento.imagem} 
            alt={apartamento.nome} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-[18px] w-[18px] text-hype-green flex-shrink-0" />
          <h3 className="text-base font-semibold text-hype-black">
            {apartamento.nome}
          </h3>
        </div>

        {apartamento.bairro && (
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin className="h-[14px] w-[14px] text-hype-gray-dark flex-shrink-0" />
            <span className="text-xs text-hype-gray-dark">{apartamento.bairro}</span>
          </div>
        )}

        {apartamento.variacoes?.length > 1 ? (
          <div className="relative mb-4 dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-full flex items-center justify-between p-2.5 border rounded-lg hover:border-hype-green/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Move className="h-[14px] w-[14px] text-hype-gray-dark" />
                  <span className="text-xs text-hype-gray-dark">
                    {variacaoAtual.metragem} m²
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Bed className="h-[14px] w-[14px] text-hype-gray-dark" />
                  <span className="text-xs text-hype-gray-dark">
                    {variacaoAtual.quartos === 0 ? 'Studio' : 
                     variacaoAtual.quartos === 1 ? '1 quarto' : 
                     `${variacaoAtual.quartos} quartos`}
                  </span>
                </div>
              </div>
              <ChevronDown className={`h-[14px] w-[14px] text-hype-gray-dark transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                {apartamento.variacoes.map((variacao) => (
                  <button
                    key={variacao.id}
                    onClick={(e) => handleSelectVariacao(variacao, e)}
                    className={`
                      w-full flex items-center justify-between p-2.5
                      transition-colors hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg
                      ${variacaoAtual.id === variacao.id ? 'bg-hype-green/5' : ''}
                      ${variacao.id === apartamento.variacoes![apartamento.variacoes!.length - 1].id ? '' : 'border-b border-gray-100'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Move className={`h-[14px] w-[14px] ${variacaoAtual.id === variacao.id ? 'text-hype-green' : 'text-hype-gray-dark'}`} />
                        <span className={`text-xs ${variacaoAtual.id === variacao.id ? 'text-hype-green font-medium' : 'text-hype-gray-dark'}`}>
                          {variacao.metragem} m²
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Bed className={`h-[14px] w-[14px] ${variacaoAtual.id === variacao.id ? 'text-hype-green' : 'text-hype-gray-dark'}`} />
                        <span className={`text-xs ${variacaoAtual.id === variacao.id ? 'text-hype-green font-medium' : 'text-hype-gray-dark'}`}>
                          {variacao.quartos === 0 ? 'Studio' : 
                           variacao.quartos === 1 ? '1 quarto' : 
                           `${variacao.quartos} quartos`}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${variacaoAtual.id === variacao.id ? 'text-hype-green' : 'text-hype-black'}`}>
                      {formatCurrency(variacao.valor)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Move className="h-[14px] w-[14px] text-hype-gray-dark flex-shrink-0" />
              <span className="text-xs text-hype-gray-dark">{variacaoAtual.metragem} m²</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Bed className="h-[14px] w-[14px] text-hype-gray-dark flex-shrink-0" />
              <span className="text-xs text-hype-gray-dark">
                {variacaoAtual.quartos === 0 ? 'Studio' : 
                 variacaoAtual.quartos === 1 ? '1 quarto' : 
                 `${variacaoAtual.quartos} quartos`}
              </span>
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs text-hype-gray-dark mb-1">Valor do imóvel</p>
          <p className="text-xl font-bold text-hype-black">
            {formatCurrency(variacaoAtual.valor)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <a 
            href={variacaoAtual.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-hype-blue hover:text-hype-green transition-colors text-xs font-medium flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-[14px] w-[14px]" />
            Ver detalhes do imóvel
          </a>
          
          {onSelect && showSimulateButton && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(variacaoAtual);
              }}
              className="
                w-full px-4 py-2.5
                rounded-lg
                bg-hype-green text-white 
                hover:bg-hype-green-dark 
                font-medium 
                text-sm
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
