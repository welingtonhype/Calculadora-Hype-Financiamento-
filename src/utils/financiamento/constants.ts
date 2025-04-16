export const PRAZO_PADRAO = 420; // 35 anos
export const PERCENTUAL_ENTRADA_MINIMO = 0.05; // 5%
export const PERCENTUAL_RENDA_MAXIMO = 0.30; // 30%
export const RENDA_MINIMA = 1000; // R$ 1.000,00

export const TAXAS_JUROS = {
  TR: { SAC: 11.49, PRICE: 10.99 },
  POUPANCA: { SAC: 5.06, PRICE: 4.12 },
  IPCA: { SAC: 4.5, PRICE: 4.0 },
  FIXA: { SAC: 11.0, PRICE: 10.5 }
} as const; 