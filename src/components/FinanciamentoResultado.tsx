import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { PhoneCall } from 'lucide-react';
import { ResultadoFinanciamento } from '@/utils/financiamento';

interface FinanciamentoResultadoProps {
  resultado: ResultadoFinanciamento;
  valorImovel: number;
  entrada: number;
  rendaMensal: number;
  onQueroEsteImovel?: () => void;
}

const FinanciamentoResultado = ({
  resultado,
  valorImovel,
  entrada,
  rendaMensal,
  onQueroEsteImovel
}: FinanciamentoResultadoProps) => {
  const {
    primeiraParcela,
    ultimaParcela,
    totalPago,
    totalJuros,
    capacidadePagamento,
    dentroCapacidade,
    sistema,
    percentualEntrada,
    taxaJurosMensal,
    taxaJurosAnual
  } = resultado;

  const valorFinanciado = valorImovel - entrada;

  return (
    <>
      <div className="bg-white p-4 md:p-10 rounded-xl shadow-md">
        <div className="text-left md:text-center mb-4 md:mb-8">
          <div className="space-y-1.5 md:space-y-2">
            <div className="text-lg md:text-2xl font-semibold text-hype-black">
              Resultado da simulação
            </div>
            <div className="text-sm text-gray-500">
              Confira abaixo os detalhes do seu financiamento
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-gray-100 p-4 md:p-8 flex flex-col gap-4 md:gap-6 items-start">
          {/* Sistema de Amortização */}
          <div className="w-full text-left">
            <p className="text-hype-gray-dark text-xs font-medium mb-1">Sistema de Amortização</p>
            <h2 className="text-lg md:text-xl font-bold text-hype-black mb-1">
              {sistema === 'SAC' ? 'Parcelas decrescentes' : 'Parcelas fixas'} <span className="font-normal text-base">({sistema})</span>
            </h2>
            <p className="text-hype-gray-dark text-[11px] md:text-sm">
              {sistema === 'SAC'
                ? <>Suas parcelas vão diminuindo com o tempo. O valor mostrado é da <span className="font-semibold">primeira parcela</span>.</>
                : <>Suas parcelas serão fixas durante todo o financiamento.</>}
            </p>
          </div>

          <hr className="w-full border-hype-gray-light" />

          {/* Valor da Parcela */}
          <div className="w-full">
            <p className="text-hype-gray-dark text-xs font-medium mb-2 md:mb-3">Valor da Parcela</p>
            <div className="space-y-2">
              <div>
                <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-hype-green block leading-none tracking-tight">{formatCurrency(primeiraParcela)}</span>
                <p className="text-sm text-hype-gray-dark mt-2">(primeira parcela)</p>
              </div>
              {sistema === 'SAC' && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-hype-gray-dark">Última parcela:</span>
                  <span className="text-base md:text-lg font-semibold text-hype-black">{formatCurrency(ultimaParcela)}</span>
                </div>
              )}
            </div>
          </div>

          <hr className="w-full border-hype-gray-light" />

          {/* Dados financeiros */}
          <div className="w-full grid grid-cols-2 gap-3 md:gap-2 text-left">
            <div>
              <p className="text-[10px] md:text-xs text-hype-gray-dark uppercase font-medium mb-0.5 md:mb-1">Valor do imóvel</p>
              <p className="text-sm md:text-xl font-bold text-hype-black">{formatCurrency(valorImovel)}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-hype-gray-dark uppercase font-medium mb-0.5 md:mb-1">Entrada</p>
              <p className="text-sm md:text-xl font-bold text-hype-black flex items-baseline gap-1">
                {formatCurrency(entrada)}
                <span className="text-[10px] md:text-sm text-hype-green font-semibold">({percentualEntrada.toFixed(1)}%)</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-hype-gray-dark uppercase font-medium mb-0.5 md:mb-1">Financiado</p>
              <p className="text-sm md:text-xl font-bold text-hype-black">{formatCurrency(valorFinanciado)}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-hype-gray-dark uppercase font-medium mb-0.5 md:mb-1">Taxa de juros</p>
              <div className="flex flex-col">
                <p className="text-sm md:text-xl font-bold text-hype-black">{taxaJurosAnual.toFixed(2)}% a.a.</p>
                <p className="text-[10px] md:text-sm text-hype-gray-dark">{taxaJurosMensal.toFixed(2)}% a.m.</p>
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] md:text-xs text-hype-gray-dark uppercase font-medium mb-0.5 md:mb-1">Total pago</p>
              <p className="text-base md:text-2xl font-bold text-hype-black">{formatCurrency(totalPago)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão CTA */}
      <div className="px-4 md:px-0 mt-6 md:mt-8">
        <button
          className="w-full bg-hype-green text-white text-sm md:text-base font-semibold px-4 md:px-8 py-4 md:py-5 rounded-lg hover:bg-hype-green/90 transition-all flex items-center justify-center gap-1.5 md:gap-2"
          onClick={onQueroEsteImovel}
          aria-label="Falar com um especialista"
        >
          <PhoneCall className="w-4 md:w-5 h-4 md:h-5" aria-hidden="true" />
          Falar com um especialista
        </button>

        {/* Rodapé */}
        <p className="text-sm text-hype-gray-dark mt-4 md:mt-6">
          Conte com a Hype para encontrar o imóvel dos seus sonhos.
          <span className="hidden md:inline"> Nossa equipe está pronta para te ajudar em cada etapa.</span>
        </p>
      </div>
    </>
  );
};

export default FinanciamentoResultado;
