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
    percentualEntrada
  } = resultado;

  const valorFinanciado = valorImovel - entrada;

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-card border border-gray-100 p-8 flex flex-col gap-6 items-start mt-2 md:mt-3">
        {/* Sistema de Amortização */}
        <div className="w-full mb-2 text-left">
          <p className="text-hype-gray-dark text-xs font-medium mb-1">Sistema de Amortização</p>
          <h2 className="text-xl font-bold text-hype-black mb-1">
            {sistema === 'SAC' ? 'Parcelas decrescentes' : 'Parcelas fixas'} <span className="font-normal text-base">({sistema})</span>
          </h2>
          <p className="text-hype-gray-dark text-sm">
            {sistema === 'SAC'
              ? <>Suas parcelas vão diminuindo com o tempo. O valor mostrado é da <span className="font-semibold">primeira parcela</span>.</>
              : <>Suas parcelas serão fixas durante todo o financiamento.</>}
          </p>
        </div>

        <hr className="w-full border-hype-gray-light my-2" />

        {/* Valor da Parcela */}
        <div className="w-full mb-2">
          <p className="text-hype-gray-dark text-xs font-medium mb-1">Valor da Parcela</p>
          <span className="text-4xl font-extrabold text-hype-green block leading-tight">{formatCurrency(primeiraParcela)}</span>
          <p className="text-hype-gray-dark text-base">(primeira parcela)</p>
          {sistema === 'SAC' && (
            <p className="text-hype-gray-dark text-xs mt-2">Última parcela: <span className="font-semibold">{formatCurrency(ultimaParcela)}</span></p>
          )}
          {!dentroCapacidade && (
            <div className="bg-red-100 text-red-700 rounded-full text-xs px-3 py-1 mt-3 flex items-center gap-1">
              <span aria-hidden="true">⚠</span> Acima da sua capacidade ({formatCurrency(capacidadePagamento)})
            </div>
          )}
        </div>

        <hr className="w-full border-hype-gray-light my-2" />

        {/* Dados financeiros */}
        <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4 text-left">
          <div>
            <p className="text-xs text-hype-gray-dark uppercase font-medium">Valor do imóvel</p>
            <p className="text-lg font-bold text-hype-black">{formatCurrency(valorImovel)}</p>
          </div>
          <div>
            <p className="text-xs text-hype-gray-dark uppercase font-medium">Entrada</p>
            <p className="text-lg font-bold text-hype-black">{formatCurrency(entrada)} <span className="text-xs text-hype-gray-dark font-normal">({percentualEntrada.toFixed(1)}%)</span></p>
          </div>
          <div>
            <p className="text-xs text-hype-gray-dark uppercase font-medium">Financiado</p>
            <p className="text-lg font-bold text-hype-black">{formatCurrency(valorFinanciado)}</p>
          </div>
          <div>
            <p className="text-xs text-hype-gray-dark uppercase font-medium">Total de juros</p>
            <p className="text-lg font-bold text-hype-black">{formatCurrency(totalJuros)}</p>
          </div>
          <div>
            <p className="text-xs text-hype-gray-dark uppercase font-medium">Total pago</p>
            <p className="text-lg font-bold text-hype-black">{formatCurrency(totalPago)}</p>
          </div>
        </div>
      </div>

      {/* Botão CTA */}
      <div className="mt-8 w-full max-w-2xl mx-auto">
        <button
          className="w-full bg-hype-green text-white text-base font-semibold px-8 py-5 rounded-lg shadow-card hover:bg-hype-green-dark transition-all flex items-center justify-center gap-2"
          onClick={onQueroEsteImovel}
          aria-label="Falar com um especialista"
        >
          <PhoneCall className="w-5 h-5" aria-hidden="true" />
          Falar com um especialista
        </button>
      </div>

      {/* Rodapé */}
      <p className="text-xs text-hype-gray-dark text-left max-w-2xl mx-auto mt-6 italic">
        Esta simulação é apenas um exemplo para fins informativos. As condições reais podem variar conforme análise de crédito e política da instituição financeira.
      </p>
    </>
  );
};

export default FinanciamentoResultado;
